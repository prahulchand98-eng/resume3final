import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const payload = await getRequestUser(req);
  if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { message, rating } = await req.json();
  if (!message?.trim()) return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  if (message.trim().length < 5) return NextResponse.json({ error: 'Please write a bit more' }, { status: 400 });

  const suggestion = await prisma.suggestion.create({
    data: {
      userId: payload.userId,
      message: message.trim(),
      rating: typeof rating === 'number' ? rating : null,
    },
  });

  return NextResponse.json({ ok: true, id: suggestion.id });
}
