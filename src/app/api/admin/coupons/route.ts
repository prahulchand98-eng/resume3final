import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin(req: NextRequest) {
  const payload = await getRequestUser(req);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user?.isAdmin ? user : null;
}

export async function GET(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { redemptions: true } } },
  });

  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { code, credits, atsCredits, maxUses, expiresAt, note } = await req.json();

  const finalCode = (code?.trim() || crypto.randomBytes(4).toString('hex').toUpperCase());

  const existing = await prisma.coupon.findUnique({ where: { code: finalCode } });
  if (existing) return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });

  const coupon = await prisma.coupon.create({
    data: {
      code: finalCode,
      credits: credits ?? 0,
      atsCredits: atsCredits ?? 0,
      maxUses: maxUses ?? 1,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      note: note?.trim() || null,
    },
  });

  return NextResponse.json(coupon);
}
