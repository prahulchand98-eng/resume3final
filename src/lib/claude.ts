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
1. Rewrite the summary to directly address the role and company
2. Highlight the most relevant skills and technologies from the job description
3. Reorder bullet points in each experience to lead with the most relevant accomplishments
4. Use keywords and phrases from the job description naturally throughout
5. Strengthen action verbs and quantify achievements where possible
6. Adjust the skills section to prioritize what the job requires

CRITICAL RULES:
- NEVER fabricate experiences, companies, dates, or credentials
- NEVER add skills the candidate doesn't have
- Only reorganize, reframe, and emphasize existing content
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
