'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, FileText, Info, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const PRODUCT_LINKS = [
  { label: 'Resume Tailoring', href: '/create' },
  { label: 'ATS Score Checker', href: '/ats-check' },
  { label: 'Pricing',           href: '/pricing' },
  { label: 'Dashboard',         href: '/dashboard' },
];

const COMPANY_LINKS = [
  { label: 'About Us',         href: '/about',   icon: Info },
  { label: 'Contact',          href: '/contact', icon: Mail },
  { label: 'Privacy Policy',   href: '/privacy', icon: FileText },
  { label: 'Terms of Service', href: '/terms',   icon: FileText },
];

export default function LandingFooter() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [msg,    setMsg]    = useState('');
  const [rating, setRating] = useState(0);
  const [hover,  setHover]  = useState(0);
  const [sent,   setSent]   = useState(false);
  const [busy,   setBusy]   = useState(false);

  const submit = async () => {
    if (!msg.trim()) return;
    setBusy(true);
    const res = await fetch('/api/suggestions', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ message: msg, rating: rating || undefined }),
    });
    if (res.ok) { setSent(true); setMsg(''); setRating(0); }
    setBusy(false);
  };

  return (
    <>
      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">

          {/* Top grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="VicksResume mascot"
                  width={34}
                  height={34}
                  className="drop-shadow-sm"
                />
                <span className="font-bold text-slate-900 text-base tracking-tight">
                  Vicks<span className="text-primary-500">Resume</span>
                </span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed max-w-[200px]">
                AI-powered resume tailoring and ATS scoring to help you land your dream job.
              </p>

              {/* Socials / badges */}
              <div className="flex items-center gap-2 mt-5">
                <span className="text-xs font-semibold text-primary-600 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full">
                  Free to start
                </span>
                <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  ATS-optimised
                </span>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-4">Product</h4>
              <ul className="space-y-2.5">
                {PRODUCT_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-slate-500 hover:text-primary-600 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                {COMPANY_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-slate-500 hover:text-primary-600 transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feedback */}
            <div>
              <h4 className="font-bold text-slate-900 text-sm mb-4">Feedback</h4>
              <ul className="space-y-2.5">
                <li>
                  <button
                    onClick={() => setFeedbackOpen(true)}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors"
                  >
                    <MessageSquare size={13} />
                    Give a Suggestion
                  </button>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-primary-600 transition-colors"
                  >
                    <Mail size={13} />
                    Contact Support
                  </Link>
                </li>
              </ul>

              {/* Mini CTA */}
              <div className="mt-6">
                <Link
                  href="/signup"
                  className="inline-block text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-brand-sm hover:shadow-brand hover:-translate-y-px transition-all duration-150"
                  style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
                >
                  Get Started Free →
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 mb-8" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              © {new Date().getFullYear()} VicksResume. All rights reserved.
            </p>
            <p className="text-xs text-slate-400">
              Made with ❤️ to help job seekers succeed
            </p>
          </div>
        </div>
      </footer>

      {/* ── Feedback Modal ── */}
      {feedbackOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={e => { if (e.target === e.currentTarget) setFeedbackOpen(false); }}
        >
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7">
            <h2 className="font-extrabold text-slate-900 text-xl mb-1">Share your feedback</h2>
            <p className="text-slate-500 text-sm mb-5">Your suggestion goes directly to our team. We read every one.</p>

            {sent ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🙏</p>
                <p className="font-bold text-slate-900 text-lg">Thank you!</p>
                <p className="text-sm text-slate-500 mt-1 mb-5">We really appreciate your feedback.</p>
                <button
                  onClick={() => { setSent(false); setFeedbackOpen(false); }}
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                {/* Stars */}
                <div className="mb-4">
                  <p className="text-xs text-slate-400 font-medium mb-2">Rate your experience (optional)</p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button
                        key={s}
                        onMouseEnter={() => setHover(s)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(s)}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        <span className={(hover || rating) >= s ? 'text-amber-400' : 'text-slate-200'}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  placeholder="Tell us what you think, what you'd like to see, or how we can improve…"
                  rows={4}
                  className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none mb-4 text-slate-900 placeholder:text-slate-400"
                />

                <div className="flex gap-3">
                  <button
                    onClick={submit}
                    disabled={busy || !msg.trim()}
                    className="flex-1 text-white py-3 rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-brand-sm hover:shadow-brand"
                    style={{ background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
                  >
                    {busy ? 'Sending…' : 'Send Feedback'}
                  </button>
                  <button
                    onClick={() => setFeedbackOpen(false)}
                    className="px-5 py-3 border border-slate-200 rounded-xl text-sm text-slate-500 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
