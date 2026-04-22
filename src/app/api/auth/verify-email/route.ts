import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/verify-email?error=missing', req.url));
  }

  const user = await prisma.user.findUnique({ where: { emailVerificationToken: token } });

  if (!user) {
    return NextResponse.redirect(new URL('/verify-email?error=invalid', req.url));
  }

  if (user.emailVerified) {
    return NextResponse.redirect(new URL('/dashboard?verified=already', req.url));
  }

  if (user.emailVerificationExpiry && user.emailVerificationExpiry < new Date()) {
    return NextResponse.redirect(new URL('/verify-email?error=expired', req.url));
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpiry: null,
    },
  });

  return NextResponse.redirect(new URL('/dashboard?verified=true', req.url));
}
