import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const payload = await getRequestUser(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { code } = await req.json();
  if (!code?.trim()) return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 });

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 });

  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    return NextResponse.json({ error: 'This coupon has expired' }, { status: 410 });
  }

  // Check if this user already used it
  const alreadyUsed = await prisma.couponRedemption.findUnique({
    where: { couponId_userId: { couponId: coupon.id, userId: payload.userId } },
  });
  if (alreadyUsed) {
    return NextResponse.json({ error: 'You have already used this coupon' }, { status: 409 });
  }

  // Atomically claim one use slot — only succeeds if usedCount < maxUses at DB level
  const claimed = await prisma.coupon.updateMany({
    where: { id: coupon.id, usedCount: { lt: coupon.maxUses } },
    data: { usedCount: { increment: 1 } },
  });

  if (claimed.count === 0) {
    return NextResponse.json({ error: 'This coupon has already been used' }, { status: 410 });
  }

  // Record redemption and credit the user
  try {
    await prisma.$transaction([
      prisma.couponRedemption.create({ data: { couponId: coupon.id, userId: payload.userId } }),
      prisma.user.update({
        where: { id: payload.userId },
        data: {
          credits: { increment: coupon.credits },
          atsCredits: { increment: coupon.atsCredits },
        },
      }),
    ]);
  } catch {
    // Unique constraint hit — another request from same user snuck through; roll back the slot
    await prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { decrement: 1 } } });
    return NextResponse.json({ error: 'You have already used this coupon' }, { status: 409 });
  }

  return NextResponse.json({
    ok: true,
    creditsAdded: coupon.credits,
    atsCreditsAdded: coupon.atsCredits,
  });
}
