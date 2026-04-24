'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2, Gift, CheckCircle } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';

export default function SignupPage() {
  const router = useRouter();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // ── Unchanged business logic ──────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────

  return (
    <AuthShell quote="Create your account and I'll start tailoring resumes that actually get you hired!">

      {/* Free badge */}
      <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-xs font-bold px-4 py-2 rounded-full mb-6">
        <Gift size={13} />
        3 free tailored resumes — no credit card needed
      </div>

      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          Create your account
        </h1>
        <p className="text-sm text-slate-500">Start tailoring resumes in minutes</p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
          <AlertCircle size={15} className="shrink-0" />
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">Full Name</label>
          <input
            type="text"
            className="input"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Jane Smith"
            autoFocus
          />
        </div>

        <div>
          <label className="label">Email address *</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="label">Password *</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              className="input pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Password strength bar */}
          {password && (
            <div className="mt-2 space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(level => {
                  const filled =
                    (password.length >= 8  && level <= 1) ||
                    (password.length >= 10 && level <= 2) ||
                    (/[A-Z]/.test(password) && /[0-9]/.test(password) && level <= 3) ||
                    (/[^A-Za-z0-9]/.test(password) && level <= 4);
                  return (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        filled
                          ? level <= 2 ? 'bg-amber-400' : level <= 3 ? 'bg-primary-400' : 'bg-green-500'
                          : 'bg-slate-200'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400">Use uppercase, numbers and symbols for a stronger password</p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-brand-sm hover:shadow-brand hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
        >
          {loading
            ? <><Loader2 size={16} className="animate-spin" /> Creating account…</>
            : 'Create Account — It\'s Free'}
        </button>
      </form>

      {/* What you get */}
      <div className="mt-5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2">What you get free</p>
        <ul className="space-y-1.5">
          {['3 AI-tailored resumes', 'ATS keyword scanner', 'PDF & Word download'].map(item => (
            <li key={item} className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle size={12} className="text-primary-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Sign in link */}
      <p className="mt-5 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
