import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Clean up expired history
  await prisma.resumeHistory.deleteMany({
    where: { userId: session.userId, expiresAt: { lt: new Date() } },
  });

  const history = await prisma.resumeHistory.findMany({
    where: { userId: session.userId, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(
    history.map((h) => ({
      id: h.id,
      jobDescription: h.jobDescription,
      resumeName: h.resumeName,
      tailoredResume: JSON.parse(h.tailoredResume),
      createdAt: h.createdAt.toISOString(),
      expiresAt: h.expiresAt.toISOString(),
    }))
  );
}
