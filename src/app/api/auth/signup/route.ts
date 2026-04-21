import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, createAuthCookie } from '@/lib/auth';
import { checkRateLimit, getIp, LIMITS } from '@/lib/rate-limit';

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
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashed,
        name: name?.trim() || null,
        credits: 3,
        creditsLimit: 3,
        plan: 'free',
      },
    });

    const token = await signToken({ userId: user.id, email: user.email });
    const cookie = createAuthCookie(token);

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, credits: user.credits, creditsLimit: user.creditsLimit, plan: user.plan },
    });
    res.cookies.set(cookie);
    return res;
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 });
  }
}
