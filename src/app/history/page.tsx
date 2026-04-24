'use client';

import { useEffect, useState } from 'react';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import { Clock, Trash2, Download, Eye, X, Printer, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ResumePreview from '@/components/ResumePreview';
import { UserProfile, HistoryItem, ResumeData } from '@/lib/types';

export default function HistoryPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewItem, setPreviewItem] = useState<HistoryItem | null>(null);
  const [previewResume, setPreviewResume] = useState<ResumeData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then((r) => r.json()),
      fetch('/api/history').then((r) => r.json()),
    ]).then(([u, h]) => {
      setUser(u);
      setHistory(Array.isArray(h) ? h : []);
      setLoading(false);
    });
  }, []);

  const deleteItem = async (id: string) => {
    setDeletingId(id);
    await fetch(`/api/history/${id}`, { method: 'DELETE' });
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (previewItem?.id === id) setPreviewItem(null);
    setDeletingId(null);
  };

  const openPreview = (item: HistoryItem) => {
    setPreviewItem(item);
    setPreviewResume(item.tailoredResume);
  };

  const handleDownloadDocx = async (template = 'classic') => {
    if (!previewResume) return;
    setDownloading(true);
    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: previewResume, format: 'docx', template }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(previewResume.name || 'resume').replace(/\s+/g, '_')}_tailored.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = () => {
    const resumeName = previewResume?.name || 'Resume';
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
    printWin.document.write(`<!DOCTYPE html><html><head><title>${resumeName}</title>${styles}<style>@page{margin:0;}body{margin:0;background:white;}.no-print{display:none!important;}</style></head><body>${el.outerHTML}</body></html>`);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); printWin.close(); }, 600);
  };

  const getDaysLeft = (expiresAt: string) => {
    const days = differenceInDays(new Date(expiresAt), new Date());
    return Math.max(0, days);
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
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Resume History</h1>
          <p className="text-gray-500 mt-0.5">Your tailored resumes from the last 7 days</p>
        </div>

        {history.length === 0 ? (
          <div className="card text-center py-16">
            <Clock size={48} className="text-gray-200 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No history yet</h2>
            <p className="text-gray-400 text-sm">Tailored resumes appear here for 7 days after creation.</p>
            <a href="/create" className="mt-4 inline-block text-sm text-primary-600 font-medium hover:text-primary-700">
              Create your first tailored resume →
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-sm px-4 py-2.5 rounded-lg">
              <AlertCircle size={15} />
              History is automatically deleted after 7 days.
            </div>

            {history.map((item) => {
              const daysLeft = getDaysLeft(item.expiresAt);
              return (
                <div key={item.id} className="card flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {item.tailoredResume.name || 'Tailored Resume'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                          {item.resumeName ? ` · Based on: ${item.resumeName}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {item.atsScoreAfter > 0 && (
                          <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            item.atsScoreAfter >= 75 ? 'bg-green-100 text-green-700' :
                            item.atsScoreAfter >= 50 ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            ATS {item.atsScoreAfter}
                            {item.atsScoreBefore > 0 && (
                              <span className="text-[10px] font-normal opacity-70 ml-1">
                                (+{item.atsScoreAfter - item.atsScoreBefore})
                              </span>
                            )}
                          </div>
                        )}
                        <div className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          daysLeft <= 1 ? 'bg-red-100 text-red-600' :
                          daysLeft <= 3 ? 'bg-amber-100 text-amber-600' :
                          'bg-gray-100 text-gray-500'
                        }`}>
                          {daysLeft}d left
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                      <span className="font-medium text-gray-600">Job: </span>
                      {item.jobDescription.substring(0, 150)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openPreview(item)}
                      className="flex items-center gap-1 text-xs px-2.5 py-1.5 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <Eye size={13} /> Preview
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      disabled={deletingId === item.id}
                      className="p-1.5 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Preview modal */}
      {previewItem && previewResume && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setPreviewItem(null)} />
          <div className="relative min-h-screen flex flex-col">
            {/* Modal header */}
            <div className="no-print sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
              <h2 className="font-bold text-gray-900">
                {previewResume.name || 'Tailored Resume'} — Preview
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadPdf}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Printer size={14} /> PDF
                </button>
                <button
                  onClick={() => handleDownloadDocx()}
                  disabled={downloading}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  <Download size={14} /> {downloading ? 'Generating...' : 'Word'}
                </button>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 ml-1"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            {/* Modal content */}
            <div className="flex-1 overflow-y-auto py-8 px-4">
              <div className="max-w-3xl mx-auto">
                <ResumePreview
                  resume={previewResume}
                  onChange={setPreviewResume}
                  onDownloadDocx={handleDownloadDocx}
                  onDownloadPdf={handleDownloadPdf}
                  downloading={downloading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
