import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  if (!stripe) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sub = await prisma.subscription.findUnique({ where: { userId: session.userId } });
  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ error: 'No active subscription found' }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const portal = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${appUrl}/dashboard`,
  });

  return NextResponse.json({ url: portal.url });
}
