'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, Star, Sparkles } from 'lucide-react';

const PLANS = [
  {
    key: 'basic',
    name: 'Basic',
    price: '$9.99',
    period: '/month',
    tagline: '50 resumes / month',
    highlight: false,
    badge: null,
    features: [
      '50 AI-tailored resumes/mo',
      'Resume builder',
      'PDF & Word download',
      '7-day history',
      'Email support',
    ],
    unavailable: ['ATS score checks'],
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$24.99',
    period: '/month',
    tagline: '150 resumes + 200 ATS checks',
    highlight: true,
    badge: 'Most Popular',
    features: [
      '150 AI-tailored resumes/mo',
      '200 ATS score checks/mo',
      'PDF & Word download',
      '7-day history',
      'Advanced resume builder',
      'Priority AI processing',
      'Priority support',
    ],
    unavailable: [],
  },
  {
    key: 'premium',
    name: 'Premium',
    price: '$35.99',
    period: '/month',
    tagline: 'Unlimited everything',
    highlight: false,
    badge: 'Best Value',
    features: [
      'Unlimited tailored resumes',
      'Unlimited ATS checks',
      'PDF & Word download',
      '7-day history',
      'Advanced resume builder',
      'Priority AI processing',
      'Early access to new features',
      'Dedicated support',
    ],
    unavailable: [],
  },
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <span className="section-badge">Pricing</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Simple, transparent{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              pricing
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Start with 3 free resumes. No credit card needed. Upgrade when you're ready.
          </p>
        </div>

        {/* ── Free plan banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 rounded-2xl border border-primary-100 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #EEF4FF 0%, #E0EAFF 100%)' }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
            >
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-extrabold text-slate-900 text-lg">Free Plan</h3>
                <span className="text-xs font-bold text-primary-600 bg-white border border-primary-200 px-2 py-0.5 rounded-full">
                  $0 forever
                </span>
              </div>
              <p className="text-sm text-slate-600">
                3 AI-tailored resumes · No credit card required · Instant access
              </p>
            </div>
          </div>
          <Link
            href="/signup"
            className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-white px-6 py-2.5 rounded-xl shadow-brand-sm hover:shadow-brand hover:-translate-y-px transition-all duration-150"
            style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
          >
            <Sparkles size={14} />
            Get Started Free
          </Link>
        </motion.div>

        {/* ── Paid plans grid ── */}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map(({ key, name, price, period, tagline, highlight, badge, features, unavailable }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`relative flex flex-col rounded-3xl border-2 p-7 transition-all duration-300 ${
                highlight
                  ? 'border-primary-400 shadow-brand'
                  : 'border-slate-200 hover:border-slate-300 shadow-card hover:shadow-card-hover'
              }`}
              style={highlight ? { background: 'linear-gradient(160deg, #FAFBFF 0%, #F0F5FF 100%)' } : { background: '#FFFFFF' }}
            >
              {/* Badge */}
              {badge && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold px-4 py-1 rounded-full text-white whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
                >
                  {badge}
                </div>
              )}

              {/* Plan header */}
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-extrabold text-slate-900 text-xl">{name}</h3>
                  {highlight && (
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  )}
                </div>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{price}</span>
                  <span className="text-slate-400 text-sm mb-1.5 font-medium">{period}</span>
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: highlight ? '#5B8DEF' : '#64748B' }}
                >
                  {tagline}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1 mb-7">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle
                      size={15}
                      className="shrink-0 mt-0.5"
                      style={{ color: highlight ? '#5B8DEF' : '#22c55e' }}
                    />
                    {f}
                  </li>
                ))}
                {unavailable.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300 line-through">
                    <CheckCircle size={15} className="text-slate-200 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/signup"
                className={`block text-center text-sm font-bold py-3.5 rounded-xl transition-all duration-200 ${
                  highlight
                    ? 'text-white shadow-brand-sm hover:shadow-brand hover:-translate-y-0.5'
                    : 'text-slate-700 border border-slate-200 hover:border-primary-300 hover:text-primary-600 bg-white hover:bg-primary-50'
                }`}
                style={highlight ? { background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' } : undefined}
              >
                Get {name} Plan
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <p className="text-center text-sm text-slate-400 mt-10">
          All plans include PDF & Word export · No setup fees · Cancel anytime
        </p>
      </div>
    </section>
  );
}
