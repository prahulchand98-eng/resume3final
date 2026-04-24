'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, PenLine, Loader2, AlertCircle } from 'lucide-react';
import { ResumeData, emptyResume } from '@/lib/types';
import ResumeBuilder from './ResumeBuilder';

export type ResumeSource =
  | { type: 'upload'; text: string; name: string }
  | { type: 'paste';  text: string; name?: undefined }
  | { type: 'build';  data: ResumeData; name: string };

type Mode = 'upload' | 'paste' | 'build';

interface ResumeSelectorProps {
  value: ResumeSource | null;
  onChange: (source: ResumeSource | null) => void;
}

const OPTIONS: { value: Mode; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'upload', label: 'Upload File', icon: Upload, desc: 'PDF or DOCX' },
  { value: 'paste', label: 'Paste Text', icon: FileText, desc: 'Plain text' },
  { value: 'build', label: 'Build with Form', icon: PenLine, desc: 'Structured entry' },
];

export default function ResumeSelector({ value, onChange }: ResumeSelectorProps) {
  const [mode, setMode] = useState<Mode>('upload');
  const [pasteText, setPasteText] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [buildData, setBuildData] = useState<ResumeData>(emptyResume());
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const selectMode = (m: Mode) => {
    setMode(m);
    onChange(null);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError('');
    setUploadText('');
    setUploadName(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUploadText(data.text);
      onChange({ type: 'upload', text: data.text, name: file.name.replace(/\.[^.]+$/, '') });
    } catch (err: unknown) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode tabs */}
      <div className="grid grid-cols-3 gap-2">
        {OPTIONS.map(({ value: v, label, icon: Icon, desc }) => (
          <button
            key={v}
            type="button"
            onClick={() => selectMode(v)}
            className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-sm font-medium border-2 transition-colors ${
              mode === v
                ? 'bg-primary-50 border-primary-500 text-primary-700'
                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>
            <span className={`text-xs font-normal ${mode === v ? 'text-primary-500' : 'text-gray-400'}`}>{desc}</span>
          </button>
        ))}
      </div>

      {/* Upload */}
      {mode === 'upload' && (
        <div className="space-y-2">
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2 text-primary-600">
                <Loader2 size={28} className="animate-spin" />
                <p className="text-sm font-medium">Extracting text...</p>
              </div>
            ) : uploadText ? (
              <div className="flex flex-col items-center gap-2 text-green-600">
                <FileText size={28} />
                <p className="text-sm font-semibold">{uploadName}</p>
                <p className="text-xs text-gray-400">{uploadText.length.toLocaleString()} characters extracted</p>
                <p className="text-xs text-green-600 font-medium">Ready to tailor ✓</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <Upload size={28} />
                <p className="text-sm font-medium text-gray-600">Click to upload your resume</p>
                <p className="text-xs">PDF or DOCX · Max 5MB</p>
              </div>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
          />
          {uploadError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={14} />
              {uploadError}
            </div>
          )}
        </div>
      )}

      {/* Paste */}
      {mode === 'paste' && (
        <div>
          <textarea
            className="input resize-none"
            rows={10}
            value={pasteText}
            onChange={(e) => {
              setPasteText(e.target.value);
              onChange(e.target.value.trim() ? { type: 'paste', text: e.target.value } : null);
            }}
            placeholder="Paste your full resume text here — include contact info, summary, experience, education, skills, etc."
          />
          <p className="text-xs text-gray-400 mt-1">{pasteText.length.toLocaleString()} characters</p>
        </div>
      )}

      {/* Build */}
      {mode === 'build' && (
        <div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <p className="text-sm text-gray-500 mb-4">
            Fill in your details below. The more complete, the better the AI output.
          </p>
          <ResumeBuilder
            value={buildData}
            onChange={(data) => {
              setBuildData(data);
              onChange({ type: 'build', data, name: data.name || 'Built Resume' });
            }}
          />
        </div>
      )}
    </div>
  );
}
