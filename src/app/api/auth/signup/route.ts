import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { signToken, createAuthCookie } from '@/lib/auth';
import { checkRateLimit, getIp, LIMITS } from '@/lib/rate-limit';
import { isDisposableEmail } from '@/lib/disposable-emails';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, retryAfterSec } = checkRateLimit(`signup:${ip}`, LIMITS.signup.limit, LIMITS.signup.windowMs);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many signups from this IP. Try again in ${Math.ceil(retryAfterSec / 60)} minutes.` },
      { status: 429 }
    );
  }

  try {
    const { email, password, name, ref } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }
    if (isDisposableEmail(email)) {
      return NextResponse.json({ error: 'Please use a real email address. Disposable emails are not allowed.' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    // Validate referral code if provided
    let referrerId: string | null = null;
    if (ref) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: ref } });
      if (referrer) referrerId = referrer.id;
    }

    const hashed = await bcrypt.hash(password, 12);
    const referralCode = crypto.randomBytes(6).toString('hex');
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        name: name?.trim() || null,
        credits: 3,
        creditsLimit: 3,
        atsCredits: 3,
        atsCreditsLimit: 3,
        plan: 'free',
        referralCode,
        referredBy: referrerId ? ref : null,
        emailVerified: false,
        emailVerificationToken,
        emailVerificationExpiry,
      },
    });

    // Record referral and grant referrer credits
    if (referrerId) {
      await prisma.referral.create({
        data: { referrerId, referredEmail: email.toLowerCase(), creditGranted: true },
      });
      await prisma.user.update({
        where: { id: referrerId },
        data: { credits: { increment: 3 } },
      });
    }

    // Send verification email
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const verifyUrl = `${appUrl}/api/auth/verify-email?token=${emailVerificationToken}`;
    await sendVerificationEmail(email.toLowerCase(), verifyUrl).catch(console.error);

    const token = await signToken({ userId: user.id, email: user.email });
    const cookie = createAuthCookie(token);

    const res = NextResponse.json({
      user: {
        id: user.id, email: user.email, name: user.name,
        credits: user.credits, creditsLimit: user.creditsLimit,
        atsCredits: user.atsCredits, atsCreditsLimit: user.atsCreditsLimit,
        plan: user.plan,
      },
      emailVerificationRequired: true,
    });
    res.cookies.set(cookie);
    return res;
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
