import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const resumes = await prisma.savedResume.findMany({
    where: { userId: session.userId },
    orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
  });

  return NextResponse.json(
    resumes.map((r) => ({
      id: r.id,
      name: r.name,
      content: JSON.parse(r.content),
      isDefault: r.isDefault,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { name, content, setDefault } = await req.json();
  if (!name || !content) {
    return NextResponse.json({ error: 'Name and content are required' }, { status: 400 });
  }

  // If setDefault, clear existing default
  if (setDefault) {
    await prisma.savedResume.updateMany({
      where: { userId: session.userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  const resume = await prisma.savedResume.create({
    data: {
      userId: session.userId,
      name: name.trim(),
      content: JSON.stringify(content),
      isDefault: !!setDefault,
    },
  });

  return NextResponse.json({
    id: resume.id,
    name: resume.name,
    content: JSON.parse(resume.content),
    isDefault: resume.isDefault,
    createdAt: resume.createdAt.toISOString(),
    updatedAt: resume.updatedAt.toISOString(),
  });
}
