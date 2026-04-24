'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import AuthShell from '@/components/auth/AuthShell';

function ResetPasswordInner() {
  const router = useRouter();
  const params = useSearchParams();
  const token  = params.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState('');

  // ── Unchanged business logic ──────────────────────────
  useEffect(() => {
    if (!token) setError('Invalid or missing reset token. Please request a new link.');
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8)    { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm)    { setError('Passwords do not match.');                 return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setDone(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Reset failed');
    } finally {
      setLoading(false);
    }
  };
  // ─────────────────────────────────────────────────────

  return (
    <AuthShell quote="Set a strong new password and you'll be back to landing interviews in no time!">

      {done ? (
        /* ── Success state ── */
        <div className="text-center py-6">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' }}
          >
            <CheckCircle size={28} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">Password updated!</h2>
          <p className="text-slate-500 text-sm mb-1">You're all set.</p>
          <p className="text-xs text-slate-400">Redirecting you to login in a moment…</p>
        </div>
      ) : (
        /* ── Form state ── */
        <>
          <div className="mb-7">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Set new password</h1>
            <p className="text-sm text-slate-500">Choose a strong password for your account.</p>
          </div>

          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input pr-10"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
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

            <div>
              <label className="label">Confirm Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                className="input"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repeat your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all shadow-brand-sm hover:shadow-brand hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0"
              style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Updating…</>
                : 'Update Password'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm">
            <Link href="/login" className="text-slate-400 hover:text-slate-600 transition-colors">
              Back to login
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  );
}
