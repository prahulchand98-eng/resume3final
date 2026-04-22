import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin(req: NextRequest) {
  const payload = await getRequestUser(req);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user?.isAdmin ? user : null;
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.coupon.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
