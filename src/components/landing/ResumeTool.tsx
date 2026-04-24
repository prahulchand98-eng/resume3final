'use client';

import { useState, useRef } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Target, Upload, Loader2,
  Check, X, RotateCcw, TrendingUp,
  AlertCircle, CheckCircle2, FileText,
} from 'lucide-react';

/* ── Mock data ─────────────────────────────────────────── */

const MOCK_SUGGESTIONS = [
  {
    id: 1,
    section: 'Professional Summary',
    original: 'Software developer with experience building web applications.',
    suggestion:
      'Results-driven Full Stack Engineer with 4+ years building scalable, high-performance web applications. Delivered 30% improvement in load time across mission-critical products using React, Node.js, and cloud infrastructure.',
    applied: false,
  },
  {
    id: 2,
    section: 'Work Experience',
    original: 'Built new features for the company product.',
    suggestion:
      'Led development of 12 new product features using React/TypeScript — reducing customer-reported bugs by 45% and increasing user retention by 22% over two consecutive quarters.',
    applied: false,
  },
  {
    id: 3,
    section: 'Skills',
    original: 'JavaScript, HTML, CSS, some React knowledge',
    suggestion:
      'React.js • TypeScript • Node.js • REST APIs • PostgreSQL • Docker • Git • Agile/Scrum • CI/CD Pipelines • System Design',
    applied: false,
  },
  {
    id: 4,
    section: 'Education',
    original: 'CS degree from university.',
    suggestion:
      'B.S. Computer Science — State University | GPA: 3.8/4.0 | Relevant coursework: Data Structures, Algorithms, Distributed Systems, Database Management',
    applied: false,
  },
];

const MOCK_ATS = {
  score: 74,
  matched: ['React', 'TypeScript', 'Node.js', 'REST API', 'Agile', 'Git', 'PostgreSQL', 'JavaScript'],
  missing: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'System Design'],
  tips: [
    'Add Docker containerisation experience — it appears 3× in the job description.',
    'Include a specific cloud platform (AWS / GCP / Azure) you have worked with.',
    'Quantify your achievements — numbers and percentages stand out to ATS.',
    'Mention CI/CD tools: GitHub Actions, Jenkins, or CircleCI.',
  ],
};

type Suggestion = (typeof MOCK_SUGGESTIONS)[number];
type ATSResult  = typeof MOCK_ATS;

/* ── Score Ring ────────────────────────────────────────── */

function ScoreRing({ score }: { score: number }) {
  const r      = 52;
  const circ   = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color  = score >= 80 ? '#22c55e' : score >= 60 ? '#5B8DEF' : '#f97316';
  const label  = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-36 h-36">
        <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#E2E8F0" strokeWidth="9" />
          <circle
            cx="60" cy="60" r={r} fill="none"
            stroke={color} strokeWidth="9"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold text-slate-900">{score}</span>
          <span className="text-xs text-slate-400 font-medium">/ 100</span>
        </div>
      </div>
      <span
        className="text-sm font-semibold px-4 py-1 rounded-full"
        style={{ color, background: `${color}18` }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Loading Skeleton ──────────────────────────────────── */

function LoadingState({ label, sublabel }: { label: string; sublabel: string }) {
  return (
    <div className="h-full min-h-[420px] flex flex-col items-center justify-center gap-5">
      <div className="relative w-14 h-14">
        <div
          className="absolute inset-0 rounded-2xl opacity-20 blur-md"
          style={{ background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
        />
        <div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EEF4FF, #E0EAFF)' }}
        >
          <Loader2 size={22} className="text-primary-500 animate-spin" />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-1">{sublabel}</p>
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary-300 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Empty State ───────────────────────────────────────── */

function EmptyState({
  icon: Icon,
  title,
  body,
  iconColor = '#5B8DEF',
  iconBg = '#EEF4FF',
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  iconColor?: string;
  iconBg?: string;
}) {
  return (
    <div className="h-full min-h-[420px] flex flex-col items-center justify-center text-center px-6">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: iconBg }}
      >
        <Icon size={28} style={{ color: iconColor }} />
      </div>
      <h3 className="text-base font-bold text-slate-700 mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-[260px] leading-relaxed">{body}</p>
    </div>
  );
}

/* ── Shared Textarea ───────────────────────────────────── */

function InputArea({
  label,
  value,
  onChange,
  placeholder,
  rows,
  showUpload,
  fileRef,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  rows: number;
  showUpload?: boolean;
  fileRef?: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400 resize-none transition-all duration-200 bg-white"
      />
      {showUpload && fileRef && (
        <>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-primary-500 transition-colors"
          >
            <Upload size={12} />
            Upload .pdf or .docx instead
          </button>
          <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" />
        </>
      )}
    </div>
  );
}

/* ── Main Component ────────────────────────────────────── */

export default function ResumeTool() {
  /* -- File refs -- */
  const tailorFileRef = useRef<HTMLInputElement>(null);
  const atsFileRef    = useRef<HTMLInputElement>(null);

  /* -- Tailor tab state -- */
  const [tailorResume, setTailorResume]   = useState('');
  const [tailorJob,    setTailorJob]      = useState('');
  const [tailorLoading, setTailorLoading] = useState(false);
  const [suggestions,   setSuggestions]   = useState<Suggestion[] | null>(null);

  /* -- ATS tab state -- */
  const [atsResume, setAtsResume]   = useState('');
  const [atsJob,    setAtsJob]      = useState('');
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsResult,  setAtsResult]  = useState<ATSResult | null>(null);

  /* -- Handlers (visual-only, no real AI calls) -- */
  const handleGenerate = () => {
    setTailorLoading(true);
    setSuggestions(null);
    setTimeout(() => {
      setSuggestions(MOCK_SUGGESTIONS.map(s => ({ ...s, applied: false })));
      setTailorLoading(false);
    }, 1800);
  };

  const handleCheckATS = () => {
    setAtsLoading(true);
    setAtsResult(null);
    setTimeout(() => {
      setAtsResult(MOCK_ATS);
      setAtsLoading(false);
    }, 1800);
  };

  const toggleApply = (id: number) => {
    setSuggestions(prev =>
      prev?.map(s => s.id === id ? { ...s, applied: !s.applied } : s) ?? null
    );
  };

  /* -- Applied count -- */
  const appliedCount = suggestions?.filter(s => s.applied).length ?? 0;

  return (
    <section id="tool" className="py-24 px-6" style={{ background: '#F8FAFF' }}>
      <div className="max-w-6xl mx-auto">

        {/* ── Section header ── */}
        <div className="text-center mb-12">
          <span className="section-badge">Free to Try</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Your AI Resume Copilot
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Paste your resume + job description. AI does the rest — no login required to preview.
          </p>
        </div>

        {/* ── Tool card ── */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
          <TabsPrimitive.Root defaultValue="tailor" className="flex flex-col">

            {/* ── Tab list ── */}
            <div className="bg-slate-50/60 border-b border-slate-100">
              <div className="px-6">
                <TabsPrimitive.List className="flex -mb-px">
                  {[
                    { value: 'tailor', label: 'Resume Tailoring', icon: Sparkles },
                    { value: 'ats',    label: 'ATS Score Check',   icon: Target   },
                  ].map(({ value, label, icon: Icon }) => (
                    <TabsPrimitive.Trigger
                      key={value}
                      value={value}
                      className="
                        flex items-center gap-2 px-6 py-4 text-sm font-semibold
                        border-b-[2.5px] transition-all duration-200
                        data-[state=active]:border-primary-500 data-[state=active]:text-primary-600
                        data-[state=inactive]:border-transparent data-[state=inactive]:text-slate-400
                        data-[state=inactive]:hover:text-slate-700 focus:outline-none
                      "
                    >
                      <Icon size={14} />
                      {label}
                    </TabsPrimitive.Trigger>
                  ))}
                </TabsPrimitive.List>
              </div>
            </div>

            {/* ══════════════════════════════════════════════
                TAB 1 — Resume Tailoring
            ══════════════════════════════════════════════ */}
            <TabsPrimitive.Content value="tailor" className="focus:outline-none">
              <div className="grid lg:grid-cols-[1fr_1px_1fr]">

                {/* Left — Inputs */}
                <div className="p-7 space-y-5">
                  <InputArea
                    label="Your Resume"
                    value={tailorResume}
                    onChange={setTailorResume}
                    placeholder="Paste your current resume here — summary, experience, skills, education…"
                    rows={9}
                    showUpload
                    fileRef={tailorFileRef}
                  />
                  <InputArea
                    label="Job Description"
                    value={tailorJob}
                    onChange={setTailorJob}
                    placeholder="Paste the full job description — role, requirements, responsibilities…"
                    rows={6}
                  />

                  <button
                    onClick={handleGenerate}
                    disabled={tailorLoading}
                    className="w-full flex items-center justify-center gap-2.5 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-70 shadow-brand-sm hover:shadow-brand hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
                  >
                    {tailorLoading ? (
                      <><Loader2 size={16} className="animate-spin" /> Analysing with AI…</>
                    ) : (
                      <><Sparkles size={16} /> Generate Suggestions</>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="hidden lg:block bg-slate-100" />

                {/* Right — Results */}
                <div className="p-7 lg:overflow-y-auto lg:max-h-[700px]">

                  {!suggestions && !tailorLoading && (
                    <EmptyState
                      icon={FileText}
                      title="AI Suggestions Will Appear Here"
                      body="Fill in your resume and the job description, then click Generate Suggestions."
                    />
                  )}

                  {tailorLoading && (
                    <LoadingState
                      label="Analysing your resume…"
                      sublabel="AI is comparing against the job requirements"
                    />
                  )}

                  {suggestions && (
                    <div className="space-y-4">
                      {/* Results header */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            {suggestions.length} suggestions found
                          </p>
                          {appliedCount > 0 && (
                            <p className="text-xs text-green-600 font-medium mt-0.5">
                              {appliedCount} applied
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setSuggestions(null)}
                          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <RotateCcw size={11} /> Reset
                        </button>
                      </div>

                      <AnimatePresence>
                        {suggestions.map((s, i) => (
                          <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.97 }}
                            transition={{ delay: i * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className={`rounded-2xl border p-4 transition-all duration-200 ${
                              s.applied
                                ? 'border-green-200 bg-green-50/60'
                                : 'border-slate-200 bg-white hover:border-primary-200 hover:shadow-card'
                            }`}
                          >
                            {/* Section badge + applied indicator */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-primary-50 text-primary-600 border border-primary-100 uppercase tracking-wide">
                                {s.section}
                              </span>
                              {s.applied && (
                                <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
                                  <Check size={11} /> Applied
                                </span>
                              )}
                            </div>

                            {/* Original (hidden once applied) */}
                            {!s.applied && (
                              <div className="mb-3 pb-3 border-b border-slate-100">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1">
                                  Original
                                </p>
                                <p className="text-xs text-slate-400 line-through leading-relaxed">
                                  {s.original}
                                </p>
                              </div>
                            )}

                            {/* Suggestion */}
                            <div className="mb-4">
                              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                                {s.applied ? 'Applied' : 'AI Suggestion'}
                              </p>
                              <p className={`text-sm leading-relaxed ${s.applied ? 'text-green-700 font-medium' : 'text-slate-700'}`}>
                                {s.suggestion}
                              </p>
                            </div>

                            {/* Action button */}
                            <button
                              onClick={() => toggleApply(s.id)}
                              className={`w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 ${
                                s.applied
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'text-white shadow-brand-sm hover:shadow-brand hover:-translate-y-px'
                              }`}
                              style={s.applied ? undefined : { background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
                            >
                              {s.applied
                                ? <><X size={11} /> Undo Change</>
                                : <><Check size={11} /> Apply Change</>
                              }
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {/* All applied celebration */}
                      {suggestions.every(s => s.applied) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-2xl border border-green-200 bg-green-50 p-4 text-center"
                        >
                          <p className="text-2xl mb-1">🎉</p>
                          <p className="text-sm font-bold text-green-800">All changes applied!</p>
                          <p className="text-xs text-green-600 mt-0.5">Your resume is now fully optimised for this role.</p>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsPrimitive.Content>

            {/* ══════════════════════════════════════════════
                TAB 2 — ATS Score
            ══════════════════════════════════════════════ */}
            <TabsPrimitive.Content value="ats" className="focus:outline-none">
              <div className="grid lg:grid-cols-[1fr_1px_1fr]">

                {/* Left — Inputs */}
                <div className="p-7 space-y-5">
                  <InputArea
                    label="Your Resume"
                    value={atsResume}
                    onChange={setAtsResume}
                    placeholder="Paste your resume here — summary, experience, skills, education…"
                    rows={9}
                    showUpload
                    fileRef={atsFileRef}
                  />
                  <InputArea
                    label="Job Description"
                    value={atsJob}
                    onChange={setAtsJob}
                    placeholder="Paste the full job description to compare against…"
                    rows={6}
                  />

                  <button
                    onClick={handleCheckATS}
                    disabled={atsLoading}
                    className="w-full flex items-center justify-center gap-2.5 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-70 shadow-brand-sm hover:shadow-brand hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #5B8DEF 0%, #7C9CF5 100%)' }}
                  >
                    {atsLoading ? (
                      <><Loader2 size={16} className="animate-spin" /> Scanning Keywords…</>
                    ) : (
                      <><Target size={16} /> Check ATS Score</>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="hidden lg:block bg-slate-100" />

                {/* Right — Results */}
                <div className="p-7 lg:overflow-y-auto lg:max-h-[700px]">

                  {!atsResult && !atsLoading && (
                    <EmptyState
                      icon={Target}
                      title="Your ATS Score Will Appear Here"
                      body="Paste your resume and job description, then click Check ATS Score."
                      iconColor="#7C3AED"
                      iconBg="#F5F3FF"
                    />
                  )}

                  {atsLoading && (
                    <LoadingState
                      label="Scanning for keywords…"
                      sublabel="Comparing your resume against ATS requirements"
                    />
                  )}

                  {atsResult && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-6"
                    >
                      {/* Score ring */}
                      <div className="flex flex-col items-center py-2">
                        <ScoreRing score={atsResult.score} />
                        <p className="mt-3 text-sm text-slate-500 text-center max-w-[220px] leading-relaxed">
                          Your resume matches{' '}
                          <strong className="text-slate-800">{atsResult.score}%</strong> of this
                          job's ATS requirements
                        </p>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-100" />

                      {/* Matched keywords */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <CheckCircle2 size={13} className="text-green-500" />
                          Matched Keywords ({atsResult.matched.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {atsResult.matched.map(kw => (
                            <span
                              key={kw}
                              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-green-50 text-green-700 border border-green-200"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing keywords */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <AlertCircle size={13} className="text-orange-500" />
                          Missing Keywords ({atsResult.missing.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {atsResult.missing.map(kw => (
                            <span
                              key={kw}
                              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-100" />

                      {/* Tips */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                          <TrendingUp size={13} className="text-primary-500" />
                          How to Improve
                        </p>
                        <ul className="space-y-2.5">
                          {atsResult.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-3 text-xs text-slate-600 leading-relaxed">
                              <span
                                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 text-white"
                                style={{ background: 'linear-gradient(135deg, #5B8DEF, #7C9CF5)' }}
                              >
                                {i + 1}
                              </span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Reset */}
                      <button
                        onClick={() => setAtsResult(null)}
                        className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors pt-2"
                      >
                        <RotateCcw size={11} /> Check Another Resume
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </TabsPrimitive.Content>

          </TabsPrimitive.Root>
        </div>

        {/* ── Bottom CTA nudge ── */}
        <p className="mt-8 text-center text-sm text-slate-400">
          Want full access?{' '}
          <a href="/signup" className="text-primary-500 font-semibold hover:text-primary-600 transition-colors">
            Sign up free →
          </a>
        </p>
      </div>
    </section>
  );
}
