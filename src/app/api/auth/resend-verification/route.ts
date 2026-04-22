import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getRequestUser } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const payload = await getRequestUser(req);
  if (!payload) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  if (user.emailVerified) return NextResponse.json({ error: 'Email already verified' }, { status: 400 });

  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationToken, emailVerificationExpiry },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const verifyUrl = `${appUrl}/api/auth/verify-email?token=${emailVerificationToken}`;
  await sendVerificationEmail(user.email, verifyUrl);

  return NextResponse.json({ ok: true });
}
