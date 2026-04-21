import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe, STRIPE_PLANS } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: 'Payments are not configured' }, { status: 503 });
  }

  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { plan } = await req.json();
  const planData = STRIPE_PLANS[plan];
  if (!planData?.priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Get or create Stripe customer
  let customerId: string | undefined;
  const sub = await prisma.subscription.findUnique({ where: { userId: user.id } });
  if (sub?.stripeCustomerId) {
    customerId = sub.stripeCustomerId;
  } else {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name || undefined,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: planData.priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?upgraded=1`,
    cancel_url: `${appUrl}/pricing`,
    metadata: { userId: user.id, plan },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
