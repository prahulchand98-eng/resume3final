'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Zap, MailCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { useState, Suspense } from 'react';

function VerifyEmailContent() {
  const params = useSearchParams();
  const error = params.get('error');
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-primary-600 px-8 py-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg"><Zap size={18} className="text-white" /></div>
            <span className="font-bold text-white text-lg">VicksResume</span>
          </Link>
        </div>
        <div className="px-8 py-8 text-center">
          {error === 'expired' ? (
            <>
              <AlertCircle size={48} className="text-amber-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">Link expired</h1>
              <p className="text-gray-500 text-sm mb-6">Your verification link has expired. Request a new one below.</p>
            </>
          ) : error === 'invalid' || error === 'missing' ? (
            <>
              <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid link</h1>
              <p className="text-gray-500 text-sm mb-6">This verification link is invalid or has already been used.</p>
            </>
          ) : (
            <>
              <MailCheck size={48} className="text-primary-600 mx-auto mb-4" />
              <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
              <p className="text-gray-500 text-sm mb-6">
                We sent a verification link to your email. Click the link to activate your account.
                The link expires in 24 hours.
              </p>
            </>
          )}

          {resent ? (
            <p className="text-green-600 text-sm font-medium">Verification email resent! Check your inbox.</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium disabled:opacity-50"
            >
              <RefreshCw size={14} className={resending ? 'animate-spin' : ''} />
              {resending ? 'Sending...' : 'Resend verification email'}
            </button>
          )}
          {resendError && <p className="text-red-500 text-xs mt-2">{resendError}</p>}

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link href="/login" className="text-sm text-gray-500 hover:text-gray-700">
              Back to login
            </Link>
          </div>
        </div>
      </div>
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
