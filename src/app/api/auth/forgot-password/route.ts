import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { checkRateLimit, getIp, LIMITS } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, retryAfterSec } = checkRateLimit(`forgot:${ip}`, LIMITS.forgotPassword.limit, LIMITS.forgotPassword.windowMs);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many requests. Try again in ${Math.ceil(retryAfterSec / 60)} minutes.` },
      { status: 429 }
    );
  }

  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  // Always return success to prevent email enumeration
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (user) {
    // Invalidate any existing tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, used: false },
      data: { used: true },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  // Return success regardless so attackers can't enumerate emails
  return NextResponse.json({ success: true });
}
