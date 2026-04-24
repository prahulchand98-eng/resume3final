'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'How does AI resume tailoring work?',
    a: 'You paste your resume and a job description. Our AI analyzes the job requirements, extracts key skills and keywords, then rewrites your resume to highlight the most relevant parts — keeping your experience intact while matching the language and priorities of the role.',
  },
  {
    q: 'What is an ATS score and why does it matter?',
    a: 'ATS (Applicant Tracking System) is software that companies use to filter resumes before a human ever sees them. Your ATS score reflects how well your resume matches the job description\'s keywords. A low score means your resume may be auto-rejected. We help you fix that.',
  },
  {
    q: 'How many resumes can I create for free?',
    a: 'You get 3 fully AI-tailored resumes on the free plan — no credit card required. Each tailoring uses 1 credit. Upgrading to Basic, Pro, or Premium unlocks 50, 150, or unlimited resumes per month.',
  },
  {
    q: 'Is my resume data kept private?',
    a: 'Yes. Your resume data is used only to generate tailored outputs for you and is never shared with third parties, sold, or used to train AI models. You can delete your data at any time from your account settings.',
  },
  {
    q: 'What file formats are supported for upload?',
    a: 'You can upload PDF and Word (.docx) files, or simply paste your resume as plain text. We extract the content automatically. Downloads are available in .docx format (which you can print as PDF from Word).',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Absolutely. Cancel through the billing portal with zero penalties. Your plan stays active until the end of the billing period, then you drop back to the free tier. No lock-ins, no hidden fees.',
  },
  {
    q: 'Does one credit equal one resume?',
    a: 'Yes — one credit = one AI resume tailoring. Saving templates, browsing your history, downloading already-generated resumes, and checking ATS scores (on Pro/Premium) do not consume credits.',
  },
  {
    q: 'How fast does the AI process my resume?',
    a: 'Most tailoring requests complete in under 30 seconds. During peak times it may take a little longer. Pro and Premium subscribers get priority AI processing for faster results.',
  },
];

function FAQItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        open ? 'border-primary-200 bg-primary-50/40' : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className={`text-sm font-bold transition-colors ${open ? 'text-primary-700' : 'text-slate-800'}`}>
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`shrink-0 transition-transform duration-300 ${
            open ? 'rotate-180 text-primary-500' : 'text-slate-400'
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="answer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm text-slate-600 leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <section id="faq" className="py-24 px-6" style={{ background: '#F8FAFF' }}>
      <div className="max-w-3xl mx-auto">

        {/* ── Header ── */}
        <div className="text-center mb-12">
          <span className="section-badge">FAQ</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Common questions
          </h2>
          <p className="text-lg text-slate-500">
            Everything you need to know before you start.
          </p>
        </div>

        {/* ── Accordion ── */}
        <div className="space-y-3">
          {FAQS.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              open={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <div className="mt-14 text-center bg-white rounded-3xl border border-slate-200 shadow-card p-8">
          <p className="text-slate-500 mb-1.5 text-sm">Still have questions?</p>
          <p className="text-slate-900 font-bold text-lg mb-5">We're happy to help.</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-3 rounded-xl shadow-brand-sm hover:shadow-brand hover:-translate-y-px transition-all duration-150"
            style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
