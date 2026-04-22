import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function isAdmin(req: NextRequest) {
  const payload = await getRequestUser(req);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user?.isAdmin ? user : null;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await isAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await req.json();
  const { credits, atsCredits, plan } = body;

  const data: Record<string, unknown> = {};
  if (typeof credits === 'number') data.credits = credits;
  if (typeof atsCredits === 'number') data.atsCredits = atsCredits;
  if (plan) data.plan = plan;

  const updated = await prisma.user.update({
    where: { id: params.id },
    data,
    select: { id: true, email: true, credits: true, atsCredits: true, plan: true },
  });

  return NextResponse.json(updated);
}
