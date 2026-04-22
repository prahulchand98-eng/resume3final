import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { tailorResume, pickModel } from '@/lib/claude';
import { ResumeData } from '@/lib/types';
import { checkRateLimit, getIp, LIMITS } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, retryAfterSec } = checkRateLimit(`tailor:${ip}`, LIMITS.tailor.limit, LIMITS.tailor.windowMs);
  if (!allowed) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Try again in ${Math.ceil(retryAfterSec / 60)} minutes.` },
      { status: 429 }
    );
  }

  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  if (!user.emailVerified) {
    return NextResponse.json({ error: 'Please verify your email before using this service.', code: 'EMAIL_NOT_VERIFIED' }, { status: 403 });
  }

  const isUnlimited = user.plan === 'premium';
  if (!isUnlimited && user.credits <= 0) {
    return NextResponse.json(
      { error: 'No credits remaining. Please upgrade your plan.', code: 'NO_CREDITS' },
      { status: 402 }
    );
  }

  const { jobDescription, resume, resumeName } = await req.json() as {
    jobDescription: string;
    resume: ResumeData | string;
    resumeName?: string;
  };

  if (!jobDescription || !resume) {
    return NextResponse.json({ error: 'Job description and resume are required' }, { status: 400 });
  }

  if (jobDescription.length < 50) {
    return NextResponse.json({ error: 'Please provide a more detailed job description' }, { status: 400 });
  }

  // Pick model based on plan and how many resumes they've made
  const resumeCount = await prisma.resumeHistory.count({ where: { userId: session.userId } });
  const model = pickModel(user.plan, resumeCount);

  const result = await tailorResume(jobDescription, resume, model);

  if (!isUnlimited) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { credits: { decrement: 1 } },
    });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const history = await prisma.resumeHistory.create({
    data: {
      userId: session.userId,
      jobDescription,
      resumeName: resumeName || null,
      tailoredResume: JSON.stringify(result.resume),
      expiresAt,
    },
  });

  return NextResponse.json({
    tailoredResume: result.resume,
    atsScoreBefore: result.atsScoreBefore,
    atsScoreAfter: result.atsScoreAfter,
    improvements: result.improvements,
    historyId: history.id,
  });
}
