import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const history = await prisma.aTSHistory.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
    take: 10,
    select: {
      id: true,
      jobDescription: true,
      overallScore: true,
      createdAt: true,
    },
  });

  return NextResponse.json(history);
}
