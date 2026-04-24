'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Features',  href: '#services' },
  { label: 'Try It',   href: '#tool' },
  { label: 'Pricing',  href: '#pricing' },
  { label: 'FAQ',      href: '#faq' },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled]       = useState(false);
  const [mobileOpen, setMobileOpen]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo.png"
            alt="VicksResume bird mascot"
            width={36}
            height={36}
            className="drop-shadow-sm"
            priority
          />
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            Vicks<span className="text-primary-500">Resume</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm font-medium text-slate-500 hover:text-slate-900 px-3.5 py-2 rounded-lg hover:bg-slate-100 transition-all duration-150"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* ── Desktop CTAs ── */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 rounded-xl transition-all duration-150"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold text-white px-5 py-2.5 rounded-xl shadow-brand-sm hover:shadow-brand hover:-translate-y-px transition-all duration-150"
            style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
          >
            Get Started Free
          </Link>
        </div>

        {/* ── Mobile toggle ── */}
        <button
          onClick={() => setMobileOpen(v => !v)}
          className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-all"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 pb-5">
          <nav className="pt-3 space-y-0.5">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2.5 rounded-lg hover:bg-slate-50 transition-all"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="pt-4 border-t border-slate-100 mt-3 flex flex-col gap-2.5">
            <Link
              href="/login"
              className="block text-center text-sm font-medium text-slate-700 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="block text-center text-sm font-semibold text-white px-4 py-2.5 rounded-xl"
              style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
