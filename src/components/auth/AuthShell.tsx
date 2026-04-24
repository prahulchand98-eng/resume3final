import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';

interface AuthShellProps {
  children: React.ReactNode;
  /** Quote shown on the left panel */
  quote?: string;
}

const STATS = [
  { value: '50k+', label: 'Resumes rewritten' },
  { value: '3×',   label: 'More interviews'   },
  { value: '< 30s', label: 'Per tailoring'    },
];

export default function AuthShell({ children, quote = "I'm gonna rewrite your resume and get you 3× more interviews." }: AuthShellProps) {
  return (
    <div className="min-h-screen flex" style={{ background: '#F8FAFF' }}>

      {/* ══════════════════════════════════════
          LEFT PANEL  —  bird + brand (desktop)
      ══════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[46%] xl:w-[42%] flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0D1B3E 0%, #152657 55%, #0F1F45 100%)' }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(91,141,239,1) 1px,transparent 1px),linear-gradient(90deg,rgba(91,141,239,1) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow orb behind bird */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[420px] h-[420px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(91,141,239,0.22) 0%, transparent 70%)' }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full px-10 py-10">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-auto">
            <Image src="/logo.png" alt="VicksResume" width={34} height={34} className="drop-shadow-sm" />
            <span className="font-bold text-white text-lg tracking-tight">
              Vicks<span className="text-primary-400">Resume</span>
            </span>
          </Link>

          {/* Bird + speech */}
          <div className="flex flex-col items-center text-center py-10">
            {/* Bird */}
            <div className="relative mb-6">
              <div
                className="absolute inset-0 blur-3xl rounded-full scale-75"
                style={{ background: 'radial-gradient(circle, rgba(124,156,245,0.4), transparent)' }}
              />
              <Image
                src="/bird-speak.png"
                alt="Vicky your AI copilot"
                width={200}
                height={200}
                className="relative drop-shadow-2xl animate-[bounce_3.5s_ease-in-out_infinite]"
                priority
              />
            </div>

            {/* Name tag */}
            <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6">
              <Sparkles size={11} className="text-primary-400" />
              Vicky · Your AI Resume Copilot
            </span>

            {/* Quote bubble */}
            <div className="bg-white/8 border border-white/15 rounded-2xl px-6 py-5 max-w-xs backdrop-blur-sm">
              <p className="text-sm text-slate-300 leading-relaxed italic">
                "{quote}"
              </p>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-3 mt-auto">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center border border-white/10 rounded-xl py-3 bg-white/5">
                <p
                  className="text-lg font-extrabold"
                  style={{
                    background: 'linear-gradient(135deg,#7C9CF5,#A5C3FD)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {value}
                </p>
                <p className="text-[10px] text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL  —  form area
      ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Back to homepage */}
        <Link
          href="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-400 hover:text-primary-600 transition-colors font-medium"
        >
          <ArrowLeft size={15} />
          Home
        </Link>

        {/* Mobile-only logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <Image src="/logo.png" alt="VicksResume" width={36} height={36} className="drop-shadow-sm" />
          <span className="font-bold text-slate-900 text-lg tracking-tight">
            Vicks<span className="text-primary-500">Resume</span>
          </span>
        </Link>

        {/* Form card */}
        <div className="w-full max-w-[380px]">
          {children}
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-slate-400 text-center">
          © {new Date().getFullYear()} VicksResume ·{' '}
          <Link href="/privacy" className="hover:text-primary-500 transition-colors">Privacy</Link>
          {' · '}
          <Link href="/terms" className="hover:text-primary-500 transition-colors">Terms</Link>
        </p>
      </div>
    </div>
  );
}
