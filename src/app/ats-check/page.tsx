'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { AlertCircle, Target, CheckCircle, XCircle, TrendingUp, Zap, ArrowRight, FileText } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { UserProfile } from '@/lib/types';

interface ATSResult {
  overallScore: number;
  breakdown: {
    keywordMatch: number;
    skillsMatch: number;
    experienceMatch: number;
    formattingScore: number;
    summaryRelevance: number;
  };
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  verdict: string;
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-gray-900">{score}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div className={`h-2.5 rounded-full transition-all duration-700 ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';
  const bg = score >= 75 ? '#dcfce7' : score >= 50 ? '#fef3c7' : '#fee2e2';
  const label = score >= 75 ? 'Great Match' : score >= 50 ? 'Needs Work' : 'Poor Match';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle cx="64" cy="64" r={r} fill="none" stroke={color} strokeWidth="10"
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-extrabold" style={{ color }}>{score}</span>
          <span className="text-xs text-gray-400">/100</span>
        </div>
      </div>
      <span className="text-sm font-bold px-4 py-1.5 rounded-full" style={{ background: bg, color }}>{label}</span>
    </div>
  );
}

function ATSCheckInner() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(u => { setUser(u); setLoading(false); });
  }, []);

  const handleCheck = async () => {
    setError('');
    if (!jobDescription.trim()) { setError('Please enter the job description.'); return; }
    if (!resume.trim()) { setError('Please paste your resume text.'); return; }
    if (jobDescription.length < 50) { setError('Please provide a more detailed job description.'); return; }

    setChecking(true);
    try {
      const res = await fetch('/api/ats-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resume }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.code === 'NO_ATS_CREDITS'
          ? 'No ATS check credits remaining. Upgrade your plan.'
          : data.error || 'Check failed.');
        return;
      }
      setResult(data);
      fetch('/api/auth/me').then(r => r.json()).then(setUser);
      setTimeout(() => document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      setError('Check failed. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const atsCreditsLeft = user.atsCredits;
  const isUnlimited = user.atsCreditsLimit >= 9999;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      {/* VicksATS Hero */}
      <div className="bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-5">
            <Target size={14} />
            VicksATS — AI-Powered ATS Scanner
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Know Your ATS Score<br />
            <span className="text-violet-300">Before You Apply</span>
          </h1>
          <p className="text-violet-200 text-lg max-w-2xl mx-auto mb-6">
            Paste your resume and job description. Our AI scans for keyword matches, skill gaps, and ATS compatibility — in seconds.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="bg-white/10 border border-white/20 px-4 py-2 rounded-full">
              {isUnlimited ? '∞ Unlimited checks' : `${atsCreditsLeft} check${atsCreditsLeft !== 1 ? 's' : ''} remaining`}
            </span>
            {user.plan === 'free' || user.plan === 'basic' ? (
              <Link href="/pricing" className="bg-white text-violet-700 px-4 py-2 rounded-full font-semibold hover:bg-violet-50 transition-colors">
                Upgrade for more →
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            <AlertCircle size={15} /> {error}
            {error.includes('credits') && (
              <Link href="/pricing" className="underline font-medium ml-1">Upgrade →</Link>
            )}
          </div>
        )}

        {atsCreditsLeft <= 0 && !isUnlimited && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              No ATS check credits remaining.{' '}
              <Link href="/pricing" className="underline font-medium">Upgrade your plan</Link> to continue.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Job Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">1</span>
              <h2 className="font-bold text-gray-900">Job Description</h2>
            </div>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              rows={12}
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here..."
            />
            <p className="text-xs text-gray-400 mt-1">{jobDescription.length.toLocaleString()} characters</p>
          </div>

          {/* Resume */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-6 h-6 bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">2</span>
              <h2 className="font-bold text-gray-900">Your Resume</h2>
            </div>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
              rows={12}
              value={resume}
              onChange={e => setResume(e.target.value)}
              placeholder="Paste your resume text here (copy from Word, PDF, or type it out)..."
            />
            <p className="text-xs text-gray-400 mt-1">{resume.length.toLocaleString()} characters</p>
          </div>
        </div>

        {/* Check button */}
        <button
          onClick={handleCheck}
          disabled={checking || (atsCreditsLeft <= 0 && !isUnlimited)}
          className="w-full py-4 text-base font-bold flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-lg shadow-violet-200 hover:from-violet-700 hover:to-purple-800 transition-all disabled:opacity-50"
        >
          <Target size={20} />
          {checking ? 'Analyzing...' : 'Check ATS Score'}
          {!isUnlimited && <span className="text-violet-300 text-sm font-normal ml-1">— 1 credit</span>}
        </button>

        {/* Results */}
        {result && (
          <div id="result-section" className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Your ATS Analysis</h2>

            {/* Score + breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Overall score */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center gap-4">
                <ScoreRing score={result.overallScore} />
                <p className="text-sm text-gray-500 text-center italic">"{result.verdict}"</p>
              </div>

              {/* Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-gray-900 mb-2">Score Breakdown</h3>
                <ScoreBar label="Keyword Match" score={result.breakdown.keywordMatch} />
                <ScoreBar label="Skills Match" score={result.breakdown.skillsMatch} />
                <ScoreBar label="Experience Match" score={result.breakdown.experienceMatch} />
                <ScoreBar label="Formatting" score={result.breakdown.formattingScore} />
                <ScoreBar label="Summary Relevance" score={result.breakdown.summaryRelevance} />
              </div>
            </div>

            {/* Keywords */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" /> Matched Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords.map((k) => (
                    <span key={k} className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-3 py-1 rounded-full font-medium">{k}</span>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <XCircle size={16} className="text-red-500" /> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords.map((k) => (
                    <span key={k} className="bg-red-50 text-red-700 border border-red-200 text-xs px-3 py-1 rounded-full font-medium">{k}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths + Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-3">Strengths</h3>
                <ul className="space-y-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-3">What to Improve</h3>
                <ul className="space-y-2">
                  {result.improvements.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <TrendingUp size={15} className="text-amber-500 shrink-0 mt-0.5" /> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA to tailor */}
            <div className="bg-gradient-to-br from-primary-700 to-violet-700 rounded-2xl p-8 text-white text-center">
              <Zap size={32} className="mx-auto mb-3 text-yellow-300" />
              <h3 className="text-2xl font-extrabold mb-2">
                {result.overallScore < 75 ? 'Boost Your Score with AI Tailoring' : 'Make It Even Better'}
              </h3>
              <p className="text-primary-200 mb-6 max-w-lg mx-auto">
                {result.overallScore < 75
                  ? `Your score is ${result.overallScore}/100. Let VicksResume AI rewrite your resume to fix the gaps and hit the missing keywords — automatically.`
                  : `Your score is great! Let VicksResume AI fine-tune it even further to maximize your interview chances.`}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/create"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-xl font-bold hover:bg-primary-50 transition-colors"
                >
                  <Zap size={18} />
                  Tailor My Resume with AI
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => { setResult(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors"
                >
                  <FileText size={16} />
                  Check Another Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ATSCheckPage() {
  return (
    <Suspense>
      <ATSCheckInner />
    </Suspense>
  );
}
