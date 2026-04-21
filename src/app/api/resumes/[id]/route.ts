import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resume = await prisma.savedResume.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  return NextResponse.json({
    id: resume.id,
    name: resume.name,
    content: JSON.parse(resume.content),
    isDefault: resume.isDefault,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, content } = await req.json();

  const resume = await prisma.savedResume.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = await prisma.savedResume.update({
    where: { id: params.id },
    data: {
      ...(name && { name: name.trim() }),
      ...(content && { content: JSON.stringify(content) }),
    },
  });

  return NextResponse.json({
    id: updated.id,
    name: updated.name,
    content: JSON.parse(updated.content),
    isDefault: updated.isDefault,
    createdAt: updated.createdAt.toISOString(),
    updatedAt: updated.updatedAt.toISOString(),
  });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resume = await prisma.savedResume.findFirst({
    where: { id: params.id, userId: session.userId },
  });
  if (!resume) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await prisma.savedResume.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
