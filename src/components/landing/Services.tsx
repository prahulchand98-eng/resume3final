'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Target, ArrowRight, CheckCircle } from 'lucide-react';

const SERVICES = [
  {
    icon: Sparkles,
    badge: 'Most Popular',
    title: 'Resume Tailoring',
    description:
      'Paste any job description and watch AI rewrite your resume to perfectly match every requirement, keyword, and qualification — in seconds.',
    features: [
      'Keyword optimisation for the exact role',
      'Achievement quantification with metrics',
      'Role-specific tone and language',
      'ATS-friendly formatting throughout',
    ],
    cta: 'Tailor My Resume',
    href: '/signup',
    accentColor: '#5B8DEF',
    bgGrad: 'from-[#EEF4FF] to-[#F8FAFF]',
    iconBg: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)',
    badgeBg: 'bg-primary-50 text-primary-600 border-primary-100',
  },
  {
    icon: Target,
    badge: 'Free to use',
    title: 'ATS Score Checker',
    description:
      'Instantly see how your resume scores against applicant-tracking systems. Find missing keywords and fix gaps before you click Apply.',
    features: [
      'Real-time compatibility score',
      'Missing keyword detection',
      'Full keyword match report',
      'Actionable improvement tips',
    ],
    cta: 'Check My Score',
    href: '/signup',
    accentColor: '#7C3AED',
    bgGrad: 'from-violet-50 to-[#F8FAFF]',
    iconBg: 'linear-gradient(135deg, #7C3AED 0%, #9C5CF9 100%)',
    badgeBg: 'bg-violet-50 text-violet-600 border-violet-100',
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-16">
          <span className="section-badge">What We Do</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Two tools.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              One goal.
            </span>
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Everything you need to go from application to interview — powered by AI,
            designed for speed.
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {SERVICES.map(({ icon: Icon, badge, title, description, features, cta, href, accentColor, bgGrad, iconBg, badgeBg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative bg-gradient-to-br ${bgGrad} rounded-3xl border border-slate-100 p-8 flex flex-col gap-6 shadow-card hover:shadow-card-hover transition-all duration-300 group`}
            >
              {/* Badge */}
              <span className={`absolute top-6 right-6 text-xs font-semibold px-3 py-1 rounded-full border ${badgeBg}`}>
                {badge}
              </span>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-brand-sm"
                style={{ background: iconBg }}
              >
                <Icon size={24} className="text-white" />
              </div>

              {/* Text */}
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">{title}</h3>
                <p className="text-slate-500 leading-relaxed">{description}</p>
              </div>

              {/* Features */}
              <ul className="space-y-2.5 flex-1">
                {features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-600">
                    <CheckCircle size={15} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={href}
                className="inline-flex items-center justify-center gap-2 font-semibold text-sm py-3 px-6 rounded-xl border-2 transition-all duration-200 group-hover:-translate-y-0.5"
                style={{
                  color: accentColor,
                  borderColor: accentColor + '30',
                  background: accentColor + '08',
                }}
              >
                {cta}
                <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── How-it-works strip ── */}
        <div className="mt-20">
          <p className="text-center text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
            How it works
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Paste your resume',
                desc: 'Drop in your current resume or upload a PDF / Word file.',
              },
              {
                step: '02',
                title: 'Add the job description',
                desc: 'Copy the full posting from LinkedIn, Indeed, or anywhere.',
              },
              {
                step: '03',
                title: 'Get results instantly',
                desc: 'AI tailors your resume and scores ATS compatibility in seconds.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4">
                <span
                  className="text-3xl font-black leading-none shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {step}
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
