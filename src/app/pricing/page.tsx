'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Zap, Star, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { UserProfile } from '@/lib/types';

const PLANS = [
  {
    key: 'basic',
    name: 'Basic',
    price: '$9.99',
    credits: 50,
    features: [
      '50 tailored resumes/month',
      'PDF & Word download',
      '7-day history',
      'Saved resume templates',
      'Basic resume builder',
    ],
    highlight: false,
    color: 'border-gray-200',
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$24.99',
    credits: 150,
    features: [
      '150 tailored resumes/month',
      'PDF & Word download',
      '7-day history',
      'Saved resume templates',
      'Advanced resume builder',
      'Priority AI processing',
    ],
    highlight: true,
    color: 'border-primary-500',
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '$35.99',
    credits: 800,
    features: [
      '800 tailored resumes/month',
      'PDF & Word download',
      '7-day history',
      'Unlimited saved templates',
      'Advanced resume builder',
      'Priority AI processing',
      'Early access to new features',
    ],
    highlight: false,
    color: 'border-gray-200',
  },
];

export default function PricingPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [noStripe, setNoStripe] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((u) => { setUser(u); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSubscribe = async (planKey: string) => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }
    setError('');
    setCheckoutLoading(planKey);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planKey }),
      });
      const data = await res.json();
      if (res.status === 503) {
        setNoStripe(true);
        return;
      }
      if (!res.ok) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start checkout');
    } finally {
      setCheckoutLoading(null);
    }
  };

  const handleManageBilling = async () => {
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const content = (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Simple, transparent pricing</h1>
        <p className="text-gray-500 text-lg">Start with 3 free resumes. Upgrade when you need more.</p>
      </div>

      {/* Free plan */}
      <div className="card bg-primary-50 border-primary-200 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Star size={18} className="text-primary-600" />
          <span className="font-bold text-primary-800 text-lg">Free Plan</span>
        </div>
        <p className="text-4xl font-extrabold text-primary-900 mb-1">$0</p>
        <p className="text-primary-700 font-medium mb-3">3 resumes • No credit card required</p>
        <p className="text-sm text-primary-600">Perfect for trying out ResumeTailor AI</p>
        {!user && (
          <Link href="/signup" className="mt-4 inline-block bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
            Get Started Free
          </Link>
        )}
      </div>

      {noStripe && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl">
          <AlertCircle size={18} className="shrink-0 text-amber-600" />
          <p className="text-sm">Payments are not yet configured. Please add Stripe credentials to enable subscriptions.</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          <AlertCircle size={15} /> {error}
        </div>
      )}

      {/* Paid plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrentPlan = user?.plan === plan.key;
          return (
            <div
              key={plan.key}
              className={`card relative border-2 flex flex-col ${plan.color} ${plan.highlight ? 'shadow-lg shadow-primary-100' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h2>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 mb-1">/month</span>
                </div>
                <p className="text-sm text-primary-700 font-medium mt-1">{plan.credits} resumes/month</p>
              </div>

              <ul className="space-y-2.5 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <div>
                  <div className="w-full py-2.5 rounded-lg bg-gray-100 text-gray-600 text-sm font-semibold text-center mb-2">
                    Current Plan
                  </div>
                  <button
                    onClick={handleManageBilling}
                    className="w-full text-xs text-gray-400 hover:text-primary-600 underline text-center"
                  >
                    Manage billing →
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={checkoutLoading === plan.key}
                  className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    plan.highlight
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  } disabled:opacity-50`}
                >
                  {checkoutLoading === plan.key ? 'Redirecting...' : `Subscribe to ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 text-center">Common questions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { q: 'Do credits reset monthly?', a: 'Yes. On each billing cycle, your credits reset to the full amount for your plan.' },
            { q: 'Can I cancel anytime?', a: 'Absolutely. Cancel through the billing portal with no penalties. You keep access until the end of your period.' },
            { q: 'Is my resume data private?', a: 'Yes. Your resume data is only used to generate your tailored resume and is never shared with third parties.' },
            { q: 'What does 1 credit mean?', a: 'One credit = one AI-tailored resume generation. Saved templates, history, and downloads don\'t use credits.' },
          ].map(({ q, a }) => (
            <div key={q} className="card">
              <h3 className="font-semibold text-gray-900 mb-1.5">{q}</h3>
              <p className="text-sm text-gray-500">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar user={user} />
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg"><Zap size={18} /></div>
          <span className="font-bold text-gray-900 text-lg">ResumeTailor AI</span>
        </Link>
      </header>
      {content}
    </div>
  );
}
