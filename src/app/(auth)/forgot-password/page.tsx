'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, CheckCircle, ArrowLeft, Loader2, Mail } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  // ── Unchanged business logic ──────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────

  return (
    <AuthShell quote="Locked out? No worries — I'll help you get back in and back to tailoring resumes!">

      {sent ? (
        /* ── Success state ── */
        <div className="text-center py-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #EEF4FF, #E0EAFF)' }}
          >
            <Mail size={28} className="text-primary-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Check your inbox</h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-2">
            If <strong className="text-slate-700">{email}</strong> has an account, we've sent a
            password reset link.
          </p>
          <p className="text-xs text-slate-400 mb-8">It expires in 1 hour · Check your spam folder too</p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="w-full flex items-center justify-center text-white font-bold py-3.5 rounded-xl shadow-brand-sm hover:shadow-brand hover:-translate-y-0.5 transition-all"
              style={{ background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
            >
              Try a different email
            </button>
            <Link
              href="/login"
              className="flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        </div>
      ) : (
        /* ── Form state ── */
        <>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
          >
            <ArrowLeft size={14} /> Back to login
          </Link>

          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Forgot password?</h1>
            <p className="text-sm text-slate-500">Enter your email and we'll send a reset link.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-brand-sm hover:shadow-brand hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                : 'Send Reset Link'}
            </button>
          </form>
        </>
      )}
    </AuthShell>
  );
}
