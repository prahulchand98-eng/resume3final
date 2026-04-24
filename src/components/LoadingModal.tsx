'use client';

import { useEffect, useState } from 'react';
import { Zap, BarChart2 } from 'lucide-react';

interface LoadingModalProps {
  open: boolean;
}

const PHASE1_MESSAGES = [
  'Analyzing the job description...',
  'Identifying key requirements...',
  'Matching your experience...',
  'Crafting tailored bullet points...',
  'Optimizing keywords...',
];

const PHASE2_MESSAGES = [
  'Scoring ATS compatibility...',
  'Comparing before & after...',
];

export default function LoadingModal({ open }: LoadingModalProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [dots,   setDots]  = useState('');

  useEffect(() => {
    if (!open) {
      setMsgIdx(0);
      setDots('');
      return;
    }

    const tickMs = 500;
    const msgEveryTicks = 6; // advance message every 3 s
    let ticks = 0;

    const interval = setInterval(() => {
      ticks++;
      setDots((d) => (d.length >= 3 ? '' : d + '.'));

      if (ticks % msgEveryTicks === 0) {
        setMsgIdx((i) => i + 1);
      }
    }, tickMs);

    return () => clearInterval(interval);
  }, [open]);

  if (!open) return null;

  // Phase 2 starts after 5 phase-1 messages (≈15 s), matching Opus completion
  const phase = msgIdx < PHASE1_MESSAGES.length ? 1 : 2;
  const messages = phase === 1 ? PHASE1_MESSAGES : PHASE2_MESSAGES;
  const displayMsg = messages[msgIdx % messages.length];

  const progressDots = Array.from({ length: 7 }, (_, i) => i);
  const filled = Math.min(msgIdx, 6);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center">

        {/* Step badge */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {[
            { num: 1, label: 'Tailoring',  Icon: Zap,         active: phase === 1 },
            { num: 2, label: 'ATS Scoring', Icon: BarChart2,   active: phase === 2 },
          ].map(({ num, label, Icon, active }) => (
            <div
              key={num}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                active
                  ? 'bg-primary-50 border-primary-300 text-primary-700'
                  : num < phase
                  ? 'bg-green-50 border-green-200 text-green-600'
                  : 'bg-gray-50 border-gray-200 text-gray-400'
              }`}
            >
              <Icon size={11} />
              Step {num}: {label}
            </div>
          ))}
        </div>

        {/* Animated icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center animate-pulse">
                {phase === 1
                  ? <Zap size={32} className="text-primary-600" />
                  : <BarChart2 size={32} className="text-primary-600" />
                }
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {phase === 1 ? 'Crafting your tailored resume' : 'Calculating ATS score'}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {phase === 1 ? 'Powered by Claude Opus · 15–25 seconds' : 'Almost there · a few more seconds'}
        </p>

        <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-primary-700 font-medium min-h-[44px] flex items-center justify-center">
          {displayMsg}{dots}
        </div>

        <div className="mt-6 flex gap-1 justify-center">
          {progressDots.map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= filled ? 'bg-primary-600 w-4' : 'bg-gray-200 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
