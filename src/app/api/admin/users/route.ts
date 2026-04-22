import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function isAdmin(req: NextRequest) {
  const payload = await getRequestUser(req);
  if (!payload) return null;
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  return user?.isAdmin ? user : null;
}

export async function GET(req: NextRequest) {
  const admin = await isAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const search = req.nextUrl.searchParams.get('search') || '';
  const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
  const take = 20;
  const skip = (page - 1) * take;

  const where = search
    ? { OR: [{ email: { contains: search, mode: 'insensitive' as const } }, { name: { contains: search, mode: 'insensitive' as const } }] }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      skip,
      select: {
        id: true, email: true, name: true, plan: true,
        credits: true, creditsLimit: true,
        atsCredits: true, atsCreditsLimit: true,
        emailVerified: true, isAdmin: true, createdAt: true,
        _count: { select: { history: true, atsHistory: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({ users, total, page, pages: Math.ceil(total / take) });
}
