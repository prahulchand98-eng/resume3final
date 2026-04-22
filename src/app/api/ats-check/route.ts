import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';
import { checkRateLimit, getIp, LIMITS } from '@/lib/rate-limit';

const ATS_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst. Analyze how well a resume matches a job description.

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "overallScore": 72,
  "breakdown": {
    "keywordMatch": 65,
    "skillsMatch": 80,
    "experienceMatch": 75,
    "formattingScore": 90,
    "summaryRelevance": 60
  },
  "matchedKeywords": ["keyword1", "keyword2"],
  "missingKeywords": ["keyword3", "keyword4"],
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "verdict": "A one-sentence verdict on the resume's fit for this role."
}

Score each category 0-100. Overall score is the weighted average.`;

export async function POST(req: NextRequest) {
  const ip = getIp(req);
  const { allowed, retryAfterSec } = checkRateLimit(`ats:${ip}`, LIMITS.tailor.limit, LIMITS.tailor.windowMs);
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

  if (user.atsCredits <= 0) {
    return NextResponse.json(
      { error: 'No ATS check credits remaining. Upgrade your plan.', code: 'NO_ATS_CREDITS' },
      { status: 402 }
    );
  }

  const { jobDescription, resume } = await req.json() as { jobDescription: string; resume: string };

  if (!jobDescription || !resume) {
    return NextResponse.json({ error: 'Job description and resume are required' }, { status: 400 });
  }

  if (jobDescription.length < 50) {
    return NextResponse.json({ error: 'Please provide a more detailed job description' }, { status: 400 });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: ATS_PROMPT,
    messages: [{
      role: 'user',
      content: `JOB DESCRIPTION:\n${jobDescription}\n\n---\n\nRESUME:\n${resume}\n\n---\n\nAnalyze this resume against the job description. Return only the JSON object.`,
    }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response');

  const result = JSON.parse(jsonMatch[0]);

  // Deduct 1 ATS credit (9999 = unlimited, don't deduct)
  if (user.atsCredits < 9999) {
    await prisma.user.update({
      where: { id: session.userId },
      data: { atsCredits: { decrement: 1 } },
    });
  }

  // Save to ATS history
  await prisma.aTSHistory.create({
    data: {
      userId: session.userId,
      jobDescription,
      overallScore: result.overallScore,
      result: JSON.stringify(result),
    },
  });

  return NextResponse.json(result);
}
