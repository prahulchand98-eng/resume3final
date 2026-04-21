'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Clock, Zap, Check, AlertCircle, Plus, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { UserProfile, HistoryItem } from '@/lib/types';

function DashboardInner() {
  const params = useSearchParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const upgraded = params.get('upgraded') === '1';

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/history').then((r) => r.json()),
    ]).then(([u, h]) => {
      setUser(u);
      setHistory(Array.isArray(h) ? h.slice(0, 5) : []);
      setLoading(false);
    });
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const creditPercent = Math.round((user.credits / (user.creditsLimit || 1)) * 100);
  const planLabel = user.plan.charAt(0).toUpperCase() + user.plan.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Upgrade banner */}
        {upgraded && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl">
            <Check size={18} className="shrink-0 text-green-600" />
            <p className="font-medium">Plan upgraded! Your new credits are now available.</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back{user.name ? `, ${user.name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-gray-500 mt-0.5">Ready to tailor your next resume?</p>
          </div>
          <Link href="/create" className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            New Resume
          </Link>
        </div>

        {/* Credits card */}
        <div className="card">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500 font-medium mb-1">Credits Remaining</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold text-gray-900">{user.credits}</span>
                <span className="text-gray-400 text-xl mb-1">/ {user.creditsLimit}</span>
              </div>
            </div>
            <span className="text-xs font-semibold bg-primary-100 text-primary-700 px-3 py-1 rounded-full">
              {planLabel} Plan
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div
              className={`h-2.5 rounded-full transition-all ${creditPercent < 20 ? 'bg-red-500' : 'bg-primary-600'}`}
              style={{ width: `${creditPercent}%` }}
            />
          </div>
          {user.credits === 0 ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-red-600 font-medium">No credits left</p>
              <Link href="/pricing" className="text-sm bg-primary-600 text-white px-4 py-1.5 rounded-lg hover:bg-primary-700 font-medium flex items-center gap-1.5">
                <Star size={14} /> Upgrade Plan
              </Link>
            </div>
          ) : user.plan === 'free' ? (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">{user.credits} free resume{user.credits !== 1 ? 's' : ''} remaining</p>
              <Link href="/pricing" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Upgrade for more →
              </Link>
            </div>
          ) : null}
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

        {/* Quick CTA */}
        <div className="bg-gradient-to-r from-primary-600 to-violet-600 rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg mb-1">Tailor a resume now</h3>
            <p className="text-primary-100 text-sm">Paste any job description — results in ~30 seconds.</p>
          </div>
          <Link
            href="/create"
            className="bg-white text-primary-700 px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-50 transition-colors shrink-0 ml-4"
          >
            <Zap size={16} />
            Start
          </Link>
        </div>

        {/* Recent history */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <Clock size={16} className="text-primary-600" />
              Recent History
            </h2>
            <Link href="/history" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all →
            </Link>
          </div>
          {history.length === 0 ? (
            <div className="text-center py-10">
              <Clock size={36} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No tailored resumes yet.</p>
              <Link href="/create" className="mt-2 inline-block text-sm text-primary-600 hover:text-primary-700 font-medium">
                Create your first one →
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {history.map((h) => (
                <li key={h.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {h.tailoredResume.name || 'Tailored Resume'}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {h.jobDescription.substring(0, 80)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-3 shrink-0">
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(h.createdAt), { addSuffix: true })}
                    </span>
                    <Link href="/history" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      View →
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
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
