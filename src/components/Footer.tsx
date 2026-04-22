'use client';

import Link from 'next/link';
import { Zap, MessageSquare, Mail, FileText, Info } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [msg, setMsg] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [open, setOpen] = useState(false);

  const submit = async () => {
    if (!msg.trim()) return;
    setSending(true);
    const res = await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, rating: rating || undefined }),
    });
    if (res.ok) { setSent(true); setMsg(''); setRating(0); }
    setSending(false);
  };

  return (
    <>
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-primary-600 text-white p-1.5 rounded-lg"><Zap size={16} /></div>
                <span className="font-bold text-gray-900">VicksResume</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                AI-powered resume tailoring and ATS scoring to help you land your dream job.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Product</h4>
              <ul className="space-y-2">
                {[
                  { label: 'Resume Tailor', href: '/create' },
                  { label: 'VicksATS Checker', href: '/ats-check' },
                  { label: 'Pricing', href: '/pricing' },
                  { label: 'Dashboard', href: '/dashboard' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-gray-500 hover:text-primary-600 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Company</h4>
              <ul className="space-y-2">
                {[
                  { label: 'About Us', href: '/about' },
                  { label: 'Contact Us', href: '/contact' },
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms of Service', href: '/terms' },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-xs text-gray-500 hover:text-primary-600 transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Feedback */}
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-3">Feedback</h4>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setOpen(true)}
                    className="text-xs text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1"
                  >
                    <MessageSquare size={12} /> Give a Suggestion
                  </button>
                </li>
                <li>
                  <Link href="/contact" className="text-xs text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                    <Mail size={12} /> Contact Support
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-xs text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                    <FileText size={12} /> Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-xs text-gray-500 hover:text-primary-600 transition-colors flex items-center gap-1">
                    <Info size={12} /> About Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} VicksResume. All rights reserved.</p>
            <p className="text-xs text-gray-400">Made with ❤️ to help job seekers succeed</p>
          </div>
        </div>
      </footer>

      {/* Suggestion modal */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="font-bold text-gray-900 text-lg mb-1">Share your feedback</h2>
            <p className="text-gray-500 text-sm mb-4">Your suggestion goes directly to our team. We read every one.</p>

            {sent ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">🙏</div>
                <p className="font-semibold text-gray-900">Thank you!</p>
                <p className="text-sm text-gray-500 mt-1">We appreciate your feedback.</p>
                <button onClick={() => { setSent(false); setOpen(false); }} className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">Close</button>
              </div>
            ) : (
              <>
                {/* Star rating */}
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Rate your experience (optional)</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        <span className={(hoverRating || rating) >= star ? 'text-amber-400' : 'text-gray-200'}>★</span>
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder="Tell us what you think, what you'd like to see, or how we can improve..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none mb-4"
                />

                <div className="flex gap-3">
                  <button
                    onClick={submit}
                    disabled={sending || !msg.trim()}
                    className="flex-1 bg-primary-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors"
                  >
                    {sending ? 'Sending...' : 'Send Feedback'}
                  </button>
                  <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
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
