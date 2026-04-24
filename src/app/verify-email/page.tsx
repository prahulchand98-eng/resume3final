'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MailCheck, AlertCircle, RefreshCw, Sparkles } from 'lucide-react';
import { useState, Suspense } from 'react';

function VerifyEmailContent() {
  const params = useSearchParams();
  const error  = params.get('error');

  const [resent,      setResent]      = useState(false);
  const [resending,   setResending]   = useState(false);
  const [resendError, setResendError] = useState('');

  // ── Unchanged business logic ──────────────────────────
  const handleResend = async () => {
    setResending(true);
    setResendError('');
    try {
      const res = await fetch('/api/auth/resend-verification', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResent(true);
    } catch (err: unknown) {
      setResendError(err instanceof Error ? err.message : 'Failed to resend');
    } finally {
      setResending(false);
    }
  };
  // ─────────────────────────────────────────────────────

  const isExpired = error === 'expired';
  const isInvalid = error === 'invalid' || error === 'missing';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: '#F8FAFF' }}>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">

        {/* Dark header band */}
        <div
          className="relative px-8 pt-8 pb-10 flex flex-col items-center text-center overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #0D1B3E 0%, #152657 60%, #0F1F45 100%)' }}
        >
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(91,141,239,1) 1px,transparent 1px),linear-gradient(90deg,rgba(91,141,239,1) 1px,transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-2 mb-6">
            <Image src="/logo.png" alt="VicksResume" width={30} height={30} className="drop-shadow-sm" />
            <span className="font-bold text-white text-base tracking-tight">
              Vicks<span className="text-primary-400">Resume</span>
            </span>
          </Link>

          {/* Status icon */}
          <div className="relative">
            <div className="absolute inset-0 blur-2xl rounded-full opacity-40" style={{ background: 'radial-gradient(circle, #7C9CF5, transparent)' }} />
            <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center ${
              isExpired ? 'bg-amber-500/20' : isInvalid ? 'bg-red-500/20' : 'bg-primary-500/20'
            }`}>
              {isExpired || isInvalid
                ? <AlertCircle size={30} className={isExpired ? 'text-amber-400' : 'text-red-400'} />
                : <MailCheck size={30} className="text-primary-400" />
              }
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-8 text-center">
          {isExpired ? (
            <>
              <h1 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Link expired</h1>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                Your verification link has expired. Request a new one below.
              </p>
            </>
          ) : isInvalid ? (
            <>
              <h1 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Invalid link</h1>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                This verification link is invalid or has already been used.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Check your email</h1>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                We sent a verification link to your email. Click it to activate your account.
                The link expires in 24 hours.
              </p>
            </>
          )}

          {/* Resend */}
          {resent ? (
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-green-600 bg-green-50 border border-green-200 px-4 py-3 rounded-xl mb-4">
              <Sparkles size={14} />
              Verification email sent! Check your inbox.
            </div>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl shadow-brand-sm hover:shadow-brand hover:-translate-y-0.5 transition-all disabled:opacity-50 mb-4"
              style={{ background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
            >
              <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
              {resending ? 'Sending…' : 'Resend verification email'}
            </button>
          )}

          {resendError && (
            <p className="text-red-500 text-xs mb-4">{resendError}</p>
          )}

          <div className="pt-5 border-t border-slate-100">
            <Link href="/login" className="text-sm text-slate-400 hover:text-primary-500 transition-colors font-medium">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-slate-400">
        © {new Date().getFullYear()} VicksResume ·{' '}
        <Link href="/privacy" className="hover:text-primary-500 transition-colors">Privacy</Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
