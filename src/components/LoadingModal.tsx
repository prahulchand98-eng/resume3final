'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

interface LoadingModalProps {
  open: boolean;
}

const MESSAGES = [
  'Analyzing the job description...',
  'Identifying key requirements...',
  'Matching your experience...',
  'Crafting tailored bullet points...',
  'Optimizing keywords...',
  'Polishing your summary...',
  'Almost ready...',
];

export default function LoadingModal({ open }: LoadingModalProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!open) {
      setMessageIndex(0);
      setDots('');
      return;
    }

    const msgInterval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % MESSAGES.length);
    }, 3000);

    const dotInterval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 500);

    return () => {
      clearInterval(msgInterval);
      clearInterval(dotInterval);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center">
        {/* Animated icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center animate-pulse">
                <Zap size={32} className="text-primary-600" />
              </div>
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Crafting your tailored resume</h2>
        <p className="text-sm text-gray-500 mb-4">This takes 15–30 seconds</p>

        <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm text-primary-700 font-medium min-h-[44px] flex items-center justify-center">
          {MESSAGES[messageIndex]}{dots}
        </div>

        <div className="mt-6 flex gap-1 justify-center">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= messageIndex ? 'bg-primary-600 w-4' : 'bg-gray-200 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
