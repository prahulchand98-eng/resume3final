import Anthropic from '@anthropic-ai/sdk';
import { ResumeData, TailoringResult } from './types';

// ── Models ───────────────────────────────────────────────────
export const MODEL_OPUS   = 'claude-opus-4-5';
export const MODEL_HAIKU  = 'claude-haiku-4-5-20251001';

/** Kept for backward-compat (used by pickModel) */
export const MODEL_STANDARD = MODEL_OPUS;

// ── Prompt: Opus — resume tailoring only (no scoring) ────────
const TAILOR_PROMPT = `You are an expert resume writer and career coach with 15+ years of experience. Your task is to tailor a candidate's resume to a specific job description.

When tailoring the resume:
1. Based on the job description I pasted, create a professional summary that fully matches my resume and the JD. Make it strong, unique, and interview-ready so it doesn’t look like AI text, plagiarism, or common wording. The summary should impress the interviewer.
2. Also, give me a tools list that is 100% aligned with the JD. Add extra related tools beyond the JD to make my profile stronger. Make the whole output ATS-friendly.
3. Then write 3 small and 3-5 medium project points for first 3 experiences and other experience with 5 points and all  that are 100% related to the JD. Make sure all the tools in the JD are included, and keep the content fully ATS-friendly. Make sure points should nt be too much lengthy they should be equal to other experience points.
4. The final resume should achieve an ATS score of at least 98/100.


CRITICAL RULES:
- NEVER fabricate ,companies, dates
- Keep all factual information (companies, titles, dates, schools) exactly as provided

For experience descriptions, write bullet points separated by newline characters (\\n). Start each bullet with a strong action verb. Do NOT use bullet characters — just plain text lines.

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "improvements": [
    "Added 6 keywords from job description",
    "Rewrote summary to target the specific role",
    "Prioritized relevant skills at the top",
    "Strengthened action verbs in experience bullets"
  ],
  "resume": {
    "name": "string",
    "contact": {
      "email": "string",
      "phone": "string",
      "location": "string",
      "linkedin": "string or empty string",
      "github": "string or empty string",
      "website": "string or empty string"
    },
    "summary": "string",
    "skills": ["skill1", "skill2"],
    "experience": [
      {
        "id": "keep original id or generate uuid",
        "company": "string",
        "title": "string",
        "location": "string or empty string",
        "startDate": "string",
        "endDate": "string",
        "current": false,
        "description": "bullet1\\nbullet2\\nbullet3"
      }
    ],
    "education": [
      {
        "id": "string",
        "school": "string",
        "degree": "string",
        "field": "string",
        "startDate": "string",
        "endDate": "string",
        "gpa": "string or empty string"
      }
    ],
    "projects": [
      {
        "id": "string",
        "name": "string",
        "description": "string",
        "technologies": "string",
        "link": "string or empty string"
      }
    ],
    "certifications": [
      {
        "id": "string",
        "name": "string",
        "issuer": "string",
        "date": "string"
      }
    ]
  }
}`;

// ── Prompt: Haiku — ATS scoring only ─────────────────────────
const SCORE_PROMPT = `You are an ATS (Applicant Tracking System) scoring engine.
Given a job description, an original resume, and a tailored resume, return two ATS compatibility scores.

Score 0-100 based on: keyword presence, skills alignment, experience relevance, and overall fit.

Return ONLY a valid JSON object (no markdown, no explanation):
{
  "atsScoreBefore": 35,
  "atsScoreAfter": 87
}`;

// ── Model picker (unchanged logic) ───────────────────────────
export function pickModel(plan: string, resumeCount: number): string {
  if (plan === 'premium') {
    return resumeCount % 3 === 2 ? MODEL_HAIKU : MODEL_OPUS;
  }
  if (plan === 'pro') {
    return resumeCount % 6 === 5 ? MODEL_HAIKU : MODEL_OPUS;
  }
  return MODEL_OPUS;
}

// ── Tailor resume — Opus (or plan-picked model) ───────────────
export async function tailorResume(
  jobDescription: string,
  resumeInput: ResumeData | string,
  model: string = MODEL_OPUS
): Promise<TailoringResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const resumeText =
    typeof resumeInput === 'string'
      ? resumeInput
      : JSON.stringify(resumeInput, null, 2);

  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system: TAILOR_PROMPT,
    messages: [{
      role: 'user',
      content: `JOB DESCRIPTION:\n${jobDescription}\n\n---\n\nCANDIDATE'S RESUME:\n${resumeText}\n\n---\n\nPlease tailor this resume for the job description above. Return only the JSON object.`,
    }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type from Claude');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Claude did not return valid JSON');

  const parsed = JSON.parse(jsonMatch[0]) as Omit<TailoringResult, 'atsScoreBefore' | 'atsScoreAfter'>;

  // Return with placeholder scores — route fills them via scoreResume()
  return {
    ...parsed,
    atsScoreBefore: 0,
    atsScoreAfter:  0,
  };
}

// ── Score ATS — Haiku (fast + cheap) ─────────────────────────
export async function scoreResume(
  jobDescription: string,
  originalResume: ResumeData | string,
  tailoredResume: ResumeData | string
): Promise<{ atsScoreBefore: number; atsScoreAfter: number }> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const original =
    typeof originalResume === 'string'
      ? originalResume
      : JSON.stringify(originalResume, null, 2);

  const tailored =
    typeof tailoredResume === 'string'
      ? tailoredResume
      : JSON.stringify(tailoredResume, null, 2);

  const message = await client.messages.create({
    model: MODEL_HAIKU,
    max_tokens: 256,
    system: SCORE_PROMPT,
    messages: [{
      role: 'user',
      content: `JOB DESCRIPTION:\n${jobDescription}\n\n---\n\nORIGINAL RESUME:\n${original}\n\n---\n\nTAILORED RESUME:\n${tailored}\n\n---\n\nReturn only the JSON scores.`,
    }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response from Haiku scorer');

  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Haiku scorer did not return valid JSON');

  const scores = JSON.parse(jsonMatch[0]) as { atsScoreBefore: number; atsScoreAfter: number };
  return scores;
}
