import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resume = await prisma.savedResume.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  // Clear all defaults, set this one
  await prisma.savedResume.updateMany({
    where: { userId: session.userId },
    data: { isDefault: false },
  });
  await prisma.savedResume.update({
    where: { id: params.id },
    data: { isDefault: true },
  });

  return NextResponse.json({ success: true });
}
