'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Star, Sparkles } from 'lucide-react';

const AVATARS = ['#5B8DEF', '#7C9CF5', '#A5C3FD', '#3865C8', '#4A7AE0'];

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: EASE },
});

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      style={{ background: '#F8FAFF' }}
    >
      {/* ── Soft background orbs ── */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl"
          style={{ background: 'radial-gradient(circle, #5B8DEF, transparent 70%)' }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: 'radial-gradient(circle, #7C9CF5, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] opacity-[0.03] blur-3xl rounded-full"
          style={{ background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">

        {/* ── Mascot + badge ── */}
        <motion.div {...fadeUp(0)} className="mb-6 flex flex-col items-center gap-4">
          {/* Floating bird mascot */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
          >
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-30 scale-110"
              style={{ background: 'radial-gradient(circle, #7C9CF5, transparent)' }}
            />
            <Image
              src="/logo.png"
              alt="VicksResume AI Copilot"
              width={100}
              height={100}
              className="relative drop-shadow-xl"
              priority
            />
          </motion.div>

          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white border border-primary-100 text-primary-600 text-sm font-semibold px-5 py-2 rounded-full shadow-brand-sm">
            <Sparkles size={13} className="text-primary-500" />
            AI-Powered Resume Copilot
            <span className="w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse" />
          </span>
        </motion.div>

        {/* ── Headline ── */}
        <motion.h1
          {...fadeUp(0.08)}
          className="text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-slate-900 leading-[1.08] tracking-tight mb-6"
        >
          Land More Interviews
          <br />
          <span
            style={{
              background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            with AI Precision
          </span>
        </motion.h1>

        {/* ── Sub-headline ── */}
        <motion.p
          {...fadeUp(0.16)}
          className="text-xl text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed"
        >
          Tailor your resume to any job in 30 seconds. Check your ATS score.
          Get noticed by recruiters — powered by advanced AI, free to start.
        </motion.p>

        {/* ── Trust pills ── */}
        <motion.div
          {...fadeUp(0.22)}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400 mb-10"
        >
          {['No credit card required', '3 free resumes', 'ATS-optimised output'].map(item => (
            <span key={item} className="flex items-center gap-1.5">
              <CheckCircle size={13} className="text-primary-400 shrink-0" />
              {item}
            </span>
          ))}
        </motion.div>

        {/* ── CTAs ── */}
        <motion.div
          {...fadeUp(0.28)}
          className="flex flex-col sm:flex-row gap-3.5 justify-center"
        >
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 text-white font-semibold px-8 py-3.5 rounded-2xl text-base shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5 transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
          >
            Start Tailoring Free
            <ArrowRight size={17} />
          </Link>
          <a
            href="#tool"
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-8 py-3.5 rounded-2xl text-base border border-slate-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 shadow-card hover:shadow-card-hover"
          >
            Try the Tool Free
          </a>
        </motion.div>

        {/* ── Social proof ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-400"
        >
          {/* Avatar stack */}
          <div className="flex -space-x-2">
            {AVATARS.map((color, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[11px] font-bold"
                style={{ background: color }}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          {/* Stars */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={13} className="text-amber-400 fill-amber-400" />
            ))}
          </div>
          <span>Loved by <strong className="text-slate-600 font-semibold">5,000+</strong> job seekers</span>
        </motion.div>

        {/* ── Floating stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
          className="mt-16 grid grid-cols-3 gap-4 max-w-lg mx-auto"
        >
          {[
            { value: '30s',  label: 'To tailor a resume' },
            { value: '3×',   label: 'More interview calls' },
            { value: '98%',  label: 'ATS pass rate' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-100 shadow-card py-4 px-3 text-center">
              <p
                className="text-2xl font-extrabold mb-0.5"
                style={{
                  background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {value}
              </p>
              <p className="text-xs text-slate-500 leading-snug">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
