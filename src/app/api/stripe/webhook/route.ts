import { NextRequest, NextResponse } from 'next/server';
import { getStripe, planFromPriceId } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { PLAN_CREDITS } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as unknown as { metadata: { userId: string; plan: string }; customer: string; subscription: string };
        const { userId, plan } = session.metadata;
        const credits = PLAN_CREDITS[plan] || PLAN_CREDITS.basic;

        await prisma.user.update({
          where: { id: userId },
          data: { plan, credits, creditsLimit: credits },
        });

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            stripeCustomerId: session.customer as string,
            stripeSubId: session.subscription as string,
            plan,
            status: 'active',
          },
          update: {
            stripeCustomerId: session.customer as string,
            stripeSubId: session.subscription as string,
            plan,
            status: 'active',
          },
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as { subscription: string; customer: string };
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubId: invoice.subscription as string },
        });
        if (sub) {
          const credits = PLAN_CREDITS[sub.plan] || PLAN_CREDITS.basic;
          await prisma.user.update({
            where: { id: sub.userId },
            data: { credits, creditsLimit: credits },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as { id: string };
        const sub = await prisma.subscription.findFirst({
          where: { stripeSubId: subscription.id },
        });
        if (sub) {
          await prisma.user.update({
            where: { id: sub.userId },
            data: { plan: 'free', credits: 0, creditsLimit: 3 },
          });
          await prisma.subscription.update({
            where: { userId: sub.userId },
            data: { status: 'canceled' },
          });
        }
        break;
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
