'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  Clock, Zap, Check, AlertCircle, Plus, Star,
  TrendingUp, FileText, ArrowRight, Sparkles, Target, Award, Mail, Copy, Users, BarChart2, Ticket
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { UserProfile, HistoryItem } from '@/lib/types';

const QUOTES = [
  { text: "Dream big. We help you get there.", sub: "Every great career starts with the right resume." },
  { text: "Your next opportunity is one tailored resume away.", sub: "Let AI do the heavy lifting." },
  { text: "Stand out from the crowd.", sub: "AI-powered resumes that speak to recruiters." },
  { text: "Land interviews, not rejections.", sub: "Keyword-optimized. ATS-ready. You-focused." },
  { text: "Your skills are extraordinary.", sub: "Let us make sure the world sees it." },
];

function StatCard({ icon: Icon, label, value, sub, color }: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <p className="text-2xl font-extrabold text-gray-900">{value}</p>
      <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

function DashboardInner() {
  const params = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [referralStats, setReferralStats] = useState<{ referralCode: string; totalReferrals: number; creditsEarned: number } | null>(null);
  const [atsHistory, setAtsHistory] = useState<{ id: string; jobDescription: string; overallScore: number; createdAt: string }[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [redeeming, setRedeeming] = useState(false);
  const [copied, setCopied] = useState(false);
  const upgraded = params.get('upgraded') === '1';
  const verified = params.get('verified') === 'true';

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/history').then((r) => r.json()),
      fetch('/api/referral/stats').then((r) => r.json()),
      fetch('/api/ats-history').then((r) => r.json()),
    ]).then(([u, h, ref, ats]) => {
      setUser(u);
      setHistory(Array.isArray(h) ? h.slice(0, 5) : []);
      if (ref && !ref.error) setReferralStats(ref);
      if (Array.isArray(ats)) setAtsHistory(ats.slice(0, 3));
      setLoading(false);
    });
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const redeemCoupon = async () => {
    if (!couponCode.trim()) return;
    setRedeeming(true);
    setCouponMsg(null);
    const res = await fetch('/api/coupon', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      const parts = [];
      if (data.creditsAdded) parts.push(`+${data.creditsAdded} resume credits`);
      if (data.atsCreditsAdded) parts.push(`+${data.atsCreditsAdded} ATS credits`);
      setCouponMsg({ text: `Applied! ${parts.join(' & ')} added.`, ok: true });
      setCouponCode('');
      // Refresh user credits
      fetch('/api/auth/me').then((r) => r.json()).then(setUser);
    } else {
      setCouponMsg({ text: data.error, ok: false });
    }
    setRedeeming(false);
  };

  const appUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const referralLink = referralStats?.referralCode ? `${appUrl}/signup?ref=${referralStats.referralCode}` : '';

  const copyReferral = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const creditPercent = Math.round((user.credits / (user.creditsLimit || 1)) * 100);
  const planLabel = user.plan.charAt(0).toUpperCase() + user.plan.slice(1);
  const firstName = user.name ? user.name.split(' ')[0] : null;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Upgrade banner */}
        {upgraded && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
            <Check size={18} className="shrink-0 text-green-600" />
            <p className="font-medium">Plan upgraded! Your new credits are now available.</p>
          </div>
        )}

        {/* Email verified success */}
        {verified && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
            <Check size={18} className="shrink-0 text-green-600" />
            <p className="font-medium">Email verified! Your account is fully activated.</p>
          </div>
        )}

        {/* Email not verified warning */}
        {user && !user.emailVerified && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
            <Mail size={18} className="shrink-0 text-amber-600" />
            <p className="text-sm flex-1">
              Please verify your email address to secure your account.{' '}
            </p>
            <button
              onClick={async () => {
                await fetch('/api/auth/resend-verification', { method: 'POST' });
                alert('Verification email sent! Check your inbox.');
              }}
              className="shrink-0 text-xs font-semibold text-amber-700 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors"
            >
              Resend email
            </button>
          </div>
        )}

        {/* Hero section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl shadow-primary-200">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={16} className="text-yellow-300" />
                <span className="text-primary-200 text-sm font-medium">{greeting}{firstName ? `, ${firstName}` : ''}!</span>
              </div>
              <h1 className="text-3xl font-extrabold leading-tight mb-2">{quote.text}</h1>
              <p className="text-primary-200 text-sm mb-6">{quote.sub}</p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 bg-white text-primary-700 px-5 py-2.5 rounded-xl font-bold hover:bg-primary-50 transition-colors shadow-lg"
                >
                  <Zap size={16} />
                  Tailor New Resume
                </Link>
                {user.plan === 'free' && (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/20 px-5 py-2.5 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                  >
                    <Star size={16} />
                    Upgrade Plan
                  </Link>
                )}
              </div>
            </div>

            {/* Credits ring */}
            <div className="shrink-0 hidden sm:flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="36" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="36" fill="none"
                    stroke="white" strokeWidth="8"
                    strokeDasharray={226}
                    strokeDashoffset={226 - (creditPercent / 100) * 226}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold">{user.credits}</span>
                  <span className="text-[10px] text-primary-200">credits</span>
                </div>
              </div>
              <span className="text-xs text-primary-200 font-medium">{planLabel} Plan</span>
            </div>
          </div>
        </div>

        {/* No credits warning */}
        {user.credits === 0 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
            <AlertCircle size={18} className="shrink-0 text-amber-600" />
            <p className="text-sm">
              You've used all your credits.{' '}
              <Link href="/pricing" className="underline font-medium">Upgrade your plan</Link>{' '}
              to keep tailoring resumes.
            </p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Zap}
            label="Resume Credits"
            value={user.credits}
            sub={`of ${user.creditsLimit} total`}
            color={creditPercent < 20 ? 'bg-red-500' : 'bg-primary-600'}
          />
          <StatCard
            icon={Target}
            label="ATS Credits"
            value={user.atsCredits >= 9999 ? '∞' : user.atsCredits}
            sub={user.atsCredits >= 9999 ? 'Unlimited' : `of ${user.atsCreditsLimit} total`}
            color={user.atsCredits === 0 ? 'bg-red-500' : 'bg-emerald-600'}
          />
          <StatCard
            icon={FileText}
            label="Resumes Made"
            value={history.length}
            sub="in the last 7 days"
            color="bg-violet-600"
          />
          <StatCard
            icon={Award}
            label="Current Plan"
            value={planLabel}
            sub={user.plan === 'free' ? 'Upgrade for more' : 'Active'}
            color="bg-amber-500"
          />
        </div>

        {/* Services row */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/create" className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary-200 transition-all">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Zap size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900">Resume Tailor</h3>
              <p className="text-sm text-gray-500">Paste a job description and get an AI-tailored resume in seconds</p>
            </div>
            <div className="shrink-0">
              <span className="text-xs font-semibold bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full">{user.credits} credits left</span>
            </div>
          </Link>

          <Link href="/ats-check" className="group flex items-center gap-4 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Target size={22} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-gray-900">VicksATS Checker</h3>
              <p className="text-sm text-gray-500">Score your resume against any job description like a real ATS system</p>
            </div>
            <div className="shrink-0">
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                {user.atsCredits >= 9999 ? 'Unlimited' : `${user.atsCredits} checks left`}
              </span>
            </div>
          </Link>
        </div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Recent history - 2 cols */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Clock size={16} className="text-primary-600" />
                Recent Resumes
              </h2>
              <Link href="/history" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {history.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText size={28} className="text-primary-400" />
                </div>
                <p className="font-semibold text-gray-700 mb-1">No resumes yet</p>
                <p className="text-gray-400 text-sm mb-4">Tailor your first resume and it'll appear here.</p>
                <Link href="/create" className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium">
                  <Plus size={14} /> Create your first one
                </Link>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {history.map((h) => (
                  <li key={h.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-primary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {h.tailoredResume.name || 'Tailored Resume'}
                      </p>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {h.jobDescription.substring(0, 70)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-gray-400 hidden sm:block">
                        {formatDistanceToNow(new Date(h.createdAt), { addSuffix: true })}
                      </span>
                      <Link href="/history" className="text-xs text-primary-600 hover:text-primary-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                        View <ArrowRight size={12} />
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Quick action */}
            <div className="bg-gradient-to-br from-violet-600 to-primary-700 rounded-2xl p-5 text-white">
              <Target size={22} className="mb-3 text-violet-200" />
              <h3 className="font-bold text-lg mb-1">Ready to apply?</h3>
              <p className="text-violet-200 text-sm mb-4">Tailor your resume to any job in under 30 seconds.</p>
              <Link
                href="/create"
                className="flex items-center justify-center gap-2 bg-white text-primary-700 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-50 transition-colors"
              >
                <Zap size={15} /> Start Tailoring
              </Link>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles size={15} className="text-amber-500" />
                Pro Tips
              </h3>
              <ul className="space-y-3">
                {[
                  'Paste the full job description for best results',
                  'Include company name in the job description',
                  'Review and edit the AI output before applying',
                  'Use Word (.docx) for easy editing later',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                    <span className="w-4 h-4 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Upgrade nudge for free users */}
            {user.plan === 'free' && user.credits > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                <Star size={18} className="text-amber-500 mb-2" />
                <h3 className="font-bold text-gray-900 mb-1 text-sm">Unlock more resumes</h3>
                <p className="text-xs text-gray-500 mb-3">You have {user.credits} free credit{user.credits !== 1 ? 's' : ''} left. Upgrade for up to 800/month.</p>
                <Link href="/pricing" className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1">
                  See plans <ArrowRight size={12} />
                </Link>
              </div>
            )}

            {/* Coupon redemption */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                <Ticket size={15} className="text-violet-600" />
                Redeem Coupon
              </h3>
              <p className="text-xs text-gray-500 mb-3">Have a coupon code? Enter it here to add credits.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code..."
                  value={couponCode}
                  onChange={(e) => { setCouponCode(e.target.value.toUpperCase()); setCouponMsg(null); }}
                  onKeyDown={(e) => e.key === 'Enter' && redeemCoupon()}
                  className="flex-1 min-w-0 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  onClick={redeemCoupon}
                  disabled={redeeming || !couponCode.trim()}
                  className="shrink-0 bg-violet-600 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-violet-700 disabled:opacity-50 transition-colors"
                >
                  {redeeming ? '...' : 'Apply'}
                </button>
              </div>
              {couponMsg && (
                <p className={`text-xs mt-2 font-medium ${couponMsg.ok ? 'text-green-600' : 'text-red-500'}`}>
                  {couponMsg.text}
                </p>
              )}
            </div>

            {/* Referral card */}
            {referralStats && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <Users size={15} className="text-primary-600" />
                  Refer & Earn
                </h3>
                <p className="text-xs text-gray-500 mb-3">Share your link. Get <strong>3 free credits</strong> for every friend who signs up.</p>
                <div className="flex gap-2 mb-3">
                  <input
                    readOnly
                    value={referralLink}
                    className="flex-1 min-w-0 text-xs bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-gray-600 truncate"
                  />
                  <button
                    onClick={copyReferral}
                    className="shrink-0 flex items-center gap-1 text-xs font-semibold bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Copy size={12} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                {referralStats.totalReferrals > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    🎉 {referralStats.totalReferrals} friend{referralStats.totalReferrals !== 1 ? 's' : ''} joined · +{referralStats.creditsEarned} credits earned
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ATS History */}
        {atsHistory.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <BarChart2 size={16} className="text-emerald-600" />
                Recent ATS Checks
              </h2>
              <Link href="/ats-check" className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1">
                New check <ArrowRight size={14} />
              </Link>
            </div>
            <ul className="divide-y divide-gray-50">
              {atsHistory.map((a) => {
                const scoreColor = a.overallScore >= 75 ? 'text-green-600 bg-green-50' : a.overallScore >= 50 ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50';
                return (
                  <li key={a.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 font-extrabold text-sm ${scoreColor}`}>
                      {a.overallScore}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 truncate">{a.jobDescription.substring(0, 80)}...</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDistanceToNow(new Date(a.createdAt), { addSuffix: true })}</p>
                    </div>
                    <div className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${scoreColor}`}>
                      {a.overallScore >= 75 ? 'Great' : a.overallScore >= 50 ? 'Fair' : 'Poor'}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardInner />
    </Suspense>
  );
}
