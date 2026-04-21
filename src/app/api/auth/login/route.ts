import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken, createAuthCookie } from '@/lib/auth';
import { checkRateLimit, getIp, LIMITS } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, retryAfterSec } = checkRateLimit(`login:${ip}`, LIMITS.login.limit, LIMITS.login.windowMs);
  if (!allowed) {
    return NextResponse.json(
      { error: `Too many login attempts. Try again in ${Math.ceil(retryAfterSec / 60)} minutes.` },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const token = await signToken({ userId: user.id, email: user.email });
    const cookie = createAuthCookie(token);

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, credits: user.credits, creditsLimit: user.creditsLimit, plan: user.plan },
    });
    res.cookies.set(cookie);
    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
