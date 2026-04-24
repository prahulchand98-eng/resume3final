'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Sparkles, Zap, CheckCircle } from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* Animated typing dots */
function TypingDots() {
  return (
    <span className="inline-flex items-end gap-[3px] ml-1 mb-0.5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-bounce inline-block"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: '1s' }}
        />
      ))}
    </span>
  );
}

export default function MascotSection() {
  return (
    <section className="relative py-20 px-6 overflow-hidden">
      {/* ── Dark gradient background ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0D1B3E 0%, #152657 50%, #0F1F45 100%)',
        }}
      />

      {/* ── Subtle grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(91,141,239,1) 1px, transparent 1px), linear-gradient(90deg, rgba(91,141,239,1) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── Orb glow behind bird ── */}
      <div
        className="absolute left-0 md:left-1/4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(91,141,239,0.18) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">

        {/* ── Bird mascot ── */}
        <motion.div
          initial={{ opacity: 0, x: -40, scale: 0.92 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: EASE }}
          className="relative shrink-0 flex items-center justify-center"
        >
          {/* Soft glow ring */}
          <div
            className="absolute inset-0 rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(124,156,245,0.35), transparent 70%)' }}
          />

          {/* Floating animation on the bird */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Image
              src="/bird-speak.png"
              alt="Vicky — your AI resume copilot"
              width={300}
              height={300}
              className="relative w-[220px] md:w-[300px] drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Name label under bird */}
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
            Vicky · Your AI Copilot
          </div>
        </motion.div>

        {/* ── Speech bubble card ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
          className="flex-1 relative"
        >
          {/* Arrow pointing left toward bird (desktop) */}
          <div className="hidden md:block absolute -left-4 top-10 w-5 h-5 bg-white rotate-45 rounded-sm shadow-lg" />

          {/* Bubble */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl relative">

            {/* Header label */}
            <div className="flex items-center gap-2.5 mb-5">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
              >
                <Zap size={14} className="text-white" />
              </div>
              <span className="text-xs font-bold text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full">
                Vicky says
              </span>
              <TypingDots />
            </div>

            {/* Main speech text */}
            <div className="mb-5">
              <p className="text-2xl md:text-[1.75rem] font-extrabold text-slate-900 leading-snug tracking-tight">
                "I'm gonna{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  rewrite your resume
                </span>
                {' '}—
              </p>
              <p className="text-2xl md:text-[1.75rem] font-extrabold text-slate-900 leading-snug tracking-tight">
                and get you{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  3× more interviews."
                </span>
              </p>
            </div>

            {/* Body copy */}
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Paste any job description. I'll match your resume to every keyword,
              requirement, and qualification — then check your ATS score too.
              You prep for the interview. I'll handle the paperwork.
            </p>

            {/* Mini feature list */}
            <ul className="space-y-2 mb-7">
              {[
                'Rewrites your resume for the exact role',
                'Detects missing ATS keywords instantly',
                'Done in under 30 seconds',
              ].map(item => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                  <CheckCircle size={14} className="text-primary-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#tool"
                className="flex-1 inline-flex items-center justify-center gap-2 text-white font-bold px-6 py-3.5 rounded-2xl text-sm shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5 transition-all duration-150"
                style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
              >
                <Sparkles size={15} />
                Let Vicky Rewrite Mine
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 text-slate-600 font-semibold px-6 py-3.5 rounded-2xl text-sm border border-slate-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-150 bg-white"
              >
                Sign Up Free
              </Link>
            </div>

            {/* Footnote */}
            <p className="text-xs text-slate-400 text-center mt-4">
              No credit card · 3 free resumes · Instant access
            </p>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom accent strip ── */}
      <div className="relative z-10 mt-16 max-w-5xl mx-auto grid grid-cols-3 gap-4">
        {[
          { stat: '50,000+', label: 'Resumes rewritten' },
          { stat: '4.9 / 5',  label: 'Average rating' },
          { stat: '< 30s',   label: 'Time to tailor' },
        ].map(({ stat, label }) => (
          <div
            key={label}
            className="text-center border border-white/10 rounded-2xl py-5 px-3 bg-white/5 backdrop-blur-sm"
          >
            <p
              className="text-2xl font-extrabold mb-1"
              style={{
                background: 'linear-gradient(135deg, #7C9CF5, #A5C3FD)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {stat}
            </p>
            <p className="text-xs text-slate-400 font-medium">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
