import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const protectedPaths = ['/dashboard', '/create', '/history'];
const authPaths = ['/login', '/signup'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('resume_tailor_token')?.value;

  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));
  const isAuthPage = authPaths.some((p) => pathname.startsWith(p));

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    const user = await verifyToken(token);
    if (!user) {
      const res = NextResponse.redirect(new URL('/login', req.url));
      res.cookies.delete('resume_tailor_token');
      return res;
    }
  }

  if (isAuthPage && token) {
    const user = await verifyToken(token);
    if (user) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
