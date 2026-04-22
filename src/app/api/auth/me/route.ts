import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await getRequestUser(req);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    credits: user.credits,
    creditsLimit: user.creditsLimit,
    atsCredits: user.atsCredits,
    atsCreditsLimit: user.atsCreditsLimit,
    plan: user.plan,
    emailVerified: user.emailVerified,
    referralCode: user.referralCode,
  });
}
