'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';

export default function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // ── Unchanged business logic ──────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────

  return (
    <AuthShell quote="Sign in and I'll have your next tailored resume ready in under 30 seconds.">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
          Welcome back 👋
        </h1>
        <p className="text-sm text-slate-500">Sign in to your VicksResume account</p>
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

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">Password</label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-primary-500 hover:text-primary-600 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              className="input pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-brand-sm hover:shadow-brand hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
          style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
        >
          {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in…</> : 'Sign In'}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-medium">No account yet?</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Sign up CTA */}
      <Link
        href="/signup"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-slate-200 text-sm font-bold text-slate-700 hover:border-primary-300 hover:text-primary-600 transition-all bg-white"
      >
        Create a free account →
      </Link>
    </AuthShell>
  );
}
