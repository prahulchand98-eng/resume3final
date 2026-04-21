import { NextRequest } from 'next/server';

// In-memory store — resets on server restart.
// Replace with Upstash Redis for multi-instance production deployments.
const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (record.count >= limit) {
    return { allowed: false, retryAfterSec: Math.ceil((record.resetAt - now) / 1000) };
  }

  record.count++;
  return { allowed: true, retryAfterSec: 0 };
}

export function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    '127.0.0.1'
  );
}

// Preconfigured limiters
export const LIMITS = {
  login:         { limit: 10, windowMs: 15 * 60 * 1000 }, // 10 per 15 min
  signup:        { limit: 5,  windowMs: 60 * 60 * 1000 }, // 5 per hour
  forgotPassword:{ limit: 5,  windowMs: 60 * 60 * 1000 }, // 5 per hour
  tailor:        { limit: 20, windowMs: 60 * 60 * 1000 }, // 20 per hour (credits are primary guard)
};
