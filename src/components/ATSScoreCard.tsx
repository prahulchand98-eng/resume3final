'use client';

import { CheckCircle, TrendingUp } from 'lucide-react';

interface ATSScoreCardProps {
  scoreBefore: number;
  scoreAfter: number;
  improvements: string[];
}

function ScoreRing({ score, label, color }: { score: number; label: string; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
          <circle cx="48" cy="48" r={r} fill="none" stroke="#e5e7eb" strokeWidth="8" />
          <circle
            cx="48" cy="48" r={r} fill="none"
            stroke={color} strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-extrabold text-gray-900">{score}</span>
        </div>
      </div>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}

export default function ATSScoreCard({ scoreBefore, scoreAfter, improvements }: ATSScoreCardProps) {
  const gain = scoreAfter - scoreBefore;

  return (
    <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="flex items-center gap-2 mb-5">
        <TrendingUp size={18} className="text-green-600" />
        <h3 className="font-bold text-gray-900 text-lg">ATS Score Analysis</h3>
        <span className="ml-auto bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
          +{gain} pts
        </span>
      </div>

      {/* Score rings */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <ScoreRing score={scoreBefore} label="Before" color="#f97316" />
        <div className="flex flex-col items-center gap-1">
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-green-400" />
            ))}
          </div>
          <span className="text-xs text-green-700 font-semibold">Improved</span>
        </div>
        <ScoreRing score={scoreAfter} label="After" color="#16a34a" />
      </div>

      {/* Score bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>ATS Compatibility</span>
          <span>{scoreAfter}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-1000"
            style={{ width: `${scoreAfter}%` }}
          />
        </div>
      </div>

      {/* Improvements */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">What we improved</p>
        <ul className="space-y-2">
          {improvements.map((imp, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle size={15} className="text-green-500 shrink-0 mt-0.5" />
              {imp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
