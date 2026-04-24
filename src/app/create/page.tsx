'use client';

import { useEffect, useState, Suspense } from 'react';
import { AlertCircle, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import LoadingModal from '@/components/LoadingModal';
import ResumePreview from '@/components/ResumePreview';
import ResumeSelector, { ResumeSource } from '@/components/ResumeSelector';
import ATSScoreCard from '@/components/ATSScoreCard';
import { UserProfile, ResumeData } from '@/lib/types';

function CreatePageInner() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [jobDescription, setJobDescription] = useState('');
  const [resumeSource, setResumeSource] = useState<ResumeSource | null>(null);

  const [tailored, setTailored] = useState<ResumeData | null>(null);
  const [atsScoreBefore, setAtsScoreBefore] = useState<number | null>(null);
  const [atsScoreAfter, setAtsScoreAfter] = useState<number | null>(null);
  const [improvements, setImprovements] = useState<string[]>([]);
  const [tailoring, setTailoring] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const handleTailor = async () => {
    setError('');
    if (!jobDescription.trim()) { setError('Please enter the job description.'); return; }
    if (!resumeSource) { setError('Please provide your resume.'); return; }

    let resumePayload: ResumeData | string;
    if (resumeSource.type === 'build') {
      resumePayload = resumeSource.data;
    } else {
      resumePayload = resumeSource.text;
    }

    setTailoring(true);
    try {
      const res = await fetch('/api/tailor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription, resume: resumePayload, resumeName: resumeSource.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.code === 'NO_CREDITS'
          ? 'No credits remaining. Please upgrade your plan.'
          : data.error || 'Tailoring failed.');
        return;
      }
      setTailored(data.tailoredResume);
      setAtsScoreBefore(data.atsScoreBefore ?? null);
      setAtsScoreAfter(data.atsScoreAfter ?? null);
      setImprovements(data.improvements ?? []);
      fetch('/api/auth/me').then((r) => r.json()).then(setUser);
      setTimeout(() => {
        document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch {
      setError('Tailoring failed. Please try again.');
    } finally {
      setTailoring(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (!tailored) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: tailored, format: 'docx' }),
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(tailored.name || 'resume').replace(/\s+/g, '_')}_tailored.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = () => {
    const resumeName = tailored?.name || 'Resume';
    const el = document.getElementById('resume-print');
    if (!el) {
      const prev = document.title;
      document.title = resumeName;
      window.onafterprint = () => { document.title = prev; };
      window.print();
      return;
    }
    const printWin = window.open('', '_blank');
    if (!printWin) {
      const prev = document.title;
      document.title = resumeName;
      window.onafterprint = () => { document.title = prev; };
      window.print();
      return;
    }
    const styles = Array.from(document.querySelectorAll<HTMLElement>('link[rel="stylesheet"], style'))
      .map((s) => s.outerHTML).join('');
    printWin.document.write(`<!DOCTYPE html><html><head><title>${resumeName}</title>${styles}<style>body{margin:0;background:white;}@media print{@page{margin:1.5cm;}}</style></head><body>${el.innerHTML}</body></html>`);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); printWin.close(); }, 600);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <LoadingModal open={tailoring} />

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tailor Your Resume</h1>
            <p className="text-gray-500 mt-0.5">
              <span className="font-semibold text-primary-600">{user.credits}</span> credit{user.credits !== 1 ? 's' : ''} remaining
              {user.credits === 0 && (
                <> · <a href="/pricing" className="text-primary-600 underline">Upgrade →</a></>
              )}
            </p>
          </div>
        </div>

        {user.credits === 0 && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800">
              No credits remaining.{' '}
              <a href="/pricing" className="underline font-medium">Upgrade your plan</a> to continue.
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
            <AlertCircle size={15} /> {error}
          </div>
        )}

        {/* Step 1: Job Description */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">1</span>
            <h2 className="font-bold text-gray-900">Job Description</h2>
          </div>
          <textarea
            className="input resize-none"
            rows={8}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here — title, responsibilities, requirements. The more detail, the better the tailoring."
          />
          <p className="text-xs text-gray-400 mt-1">{jobDescription.length.toLocaleString()} characters</p>
        </div>

        {/* Step 2: Resume */}
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center shrink-0">2</span>
            <h2 className="font-bold text-gray-900">Your Resume</h2>
          </div>
          <ResumeSelector value={resumeSource} onChange={setResumeSource} />
        </div>

        {/* Tailor button */}
        <button
          onClick={handleTailor}
          disabled={tailoring || user.credits === 0}
          className="w-full btn-primary py-4 text-base font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-200"
        >
          <Zap size={20} />
          {tailoring ? 'Tailoring...' : 'Tailor Resume with AI'}
          <span className="text-primary-300 text-sm font-normal ml-1">— 1 credit</span>
        </button>

        {/* Preview */}
        {tailored && (
          <div id="preview-section" className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Your Tailored Resume</h2>

            {/* ATS Score Card */}
            {atsScoreBefore !== null && atsScoreAfter !== null && (
              <ATSScoreCard
                scoreBefore={atsScoreBefore}
                scoreAfter={atsScoreAfter}
                improvements={improvements}
              />
            )}

            <ResumePreview
              resume={tailored}
              onChange={setTailored}
              onDownloadDocx={handleDownloadDocx}
              onDownloadPdf={handleDownloadPdf}
              downloading={downloading}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense>
      <CreatePageInner />
    </Suspense>
  );
}
