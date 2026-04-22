import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const payload = await getRequestUser(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const referrals = await prisma.referral.findMany({
    where: { referrerId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({
    referralCode: user.referralCode,
    totalReferrals: referrals.length,
    creditsEarned: referrals.filter((r) => r.creditGranted).length * 3,
    referrals: referrals.map((r) => ({
      email: r.referredEmail,
      creditGranted: r.creditGranted,
      createdAt: r.createdAt,
    })),
  });
}
