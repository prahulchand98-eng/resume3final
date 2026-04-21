import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const item = await prisma.resumeHistory.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    id: item.id,
    jobDescription: item.jobDescription,
    resumeName: item.resumeName,
    tailoredResume: JSON.parse(item.tailoredResume),
    createdAt: item.createdAt.toISOString(),
    expiresAt: item.expiresAt.toISOString(),
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const item = await prisma.resumeHistory.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.resumeHistory.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
