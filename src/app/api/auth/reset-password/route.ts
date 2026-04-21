import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { checkRateLimit, getIp } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, retryAfterSec } = checkRateLimit(`reset:${ip}`, 10, 15 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minutes.` },
      { status: 429 }
    );
  }

  const { token, password } = await req.json();
  if (!token || !password) {
    return NextResponse.json({ error: 'Token and password are required' }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
    return NextResponse.json(
      { error: 'This reset link is invalid or has expired. Please request a new one.' },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { password: hashed } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { used: true } }),
  ]);

  return NextResponse.json({ success: true });
}
