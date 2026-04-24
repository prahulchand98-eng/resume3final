'use client';

import { useState } from 'react';
import { Download, Printer, Edit2, Check, X, Palette, CheckCircle } from 'lucide-react';
import { ResumeData } from '@/lib/types';

// ─── Inline editable text ────────────────────────────────────────────────────

function EditableText({
  value,
  onChange,
  multiline = false,
  className = '',
  placeholder = '',
  readOnly = false,
}: {
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  if (readOnly) {
    return (
      <span className={className}>
        {value || <span className="text-gray-300 italic text-xs">{placeholder}</span>}
      </span>
    );
  }

  if (editing) {
    const save = () => { onChange(draft); setEditing(false); };
    const cancel = () => { setDraft(value); setEditing(false); };
    return (
      <span className="relative block">
        {multiline ? (
          <textarea
            autoFocus
            className="w-full border border-primary-400 rounded p-1 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
            rows={Math.max(3, (value || '').split('\n').length)}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        ) : (
          <input
            autoFocus
            className="w-full border border-primary-400 rounded px-1 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
        )}
        <span className="flex gap-1 mt-1">
          <button onClick={save} className="text-xs flex items-center gap-1 bg-primary-600 text-white px-2 py-0.5 rounded">
            <Check size={11} /> Save
          </button>
          <button onClick={cancel} className="text-xs flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
            <X size={11} /> Cancel
          </button>
        </span>
      </span>
    );
  }

  return (
    <span
      onClick={() => { setDraft(value); setEditing(true); }}
      className={`group relative cursor-pointer rounded hover:bg-primary-50 hover:outline hover:outline-1 hover:outline-primary-300 transition-all inline-block ${className}`}
    >
      {value || <span className="text-gray-300 italic text-xs">{placeholder || 'Click to edit'}</span>}
      <Edit2 size={10} className="absolute right-0.5 top-0.5 opacity-0 group-hover:opacity-60 text-primary-500" />
    </span>
  );
}

// ─── Editable bullet list ─────────────────────────────────────────────────────

function Bullets({
  text,
  onChange,
  readOnly,
}: {
  text: string;
  onChange?: (v: string) => void;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const lines = text.split('\n').filter((b) => b.trim());

  const bulletDisplay = (
    <div className="space-y-0.5 mt-1">
      {lines.map((b, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="mt-0.5 shrink-0">•</span>
          <span>{b.trim()}</span>
        </div>
      ))}
    </div>
  );

  if (readOnly || !onChange) return bulletDisplay;

  if (editing) {
    const save = () => { onChange(draft); setEditing(false); };
    const cancel = () => { setDraft(text); setEditing(false); };
    return (
      <span className="relative block mt-1">
        <textarea
          autoFocus
          className="w-full border border-primary-400 rounded p-1 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-300"
          rows={Math.max(3, lines.length + 1)}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="One bullet point per line"
        />
        <span className="flex gap-1 mt-1">
          <button onClick={save} className="text-xs flex items-center gap-1 bg-primary-600 text-white px-2 py-0.5 rounded">
            <Check size={11} /> Save
          </button>
          <button onClick={cancel} className="text-xs flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
            <X size={11} /> Cancel
          </button>
        </span>
      </span>
    );
  }

  return (
    <div
      className="mt-1 group relative cursor-pointer rounded hover:bg-primary-50 hover:outline hover:outline-1 hover:outline-primary-300 transition-all px-1"
      onClick={() => { setDraft(text); setEditing(true); }}
    >
      {lines.map((b, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="mt-0.5 shrink-0">•</span>
          <span>{b.trim()}</span>
        </div>
      ))}
      <Edit2 size={10} className="absolute right-0.5 top-0.5 opacity-0 group-hover:opacity-60 text-primary-500" />
    </div>
  );
}

// ─── Template components ──────────────────────────────────────────────────────

interface TemplateProps {
  resume: ResumeData;
  onChange: (r: ResumeData) => void;
  readOnly?: boolean;
}

// ─── Template 1: Classic ─────────────────────────────────────────────────────
function ClassicTemplate({ resume, onChange, readOnly }: TemplateProps) {
  const set = (p: Partial<ResumeData>) => onChange({ ...resume, ...p });
  const setContact = (p: Partial<ResumeData['contact']>) => set({ contact: { ...resume.contact, ...p } });
  const updateExp = (id: string, patch: Partial<ResumeData['experience'][0]>) =>
    set({ experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const updateEdu = (id: string, patch: Partial<ResumeData['education'][0]>) =>
    set({ education: resume.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const updateProj = (id: string, patch: Partial<ResumeData['projects'][0]>) =>
    set({ projects: resume.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const updateCert = (id: string, patch: Partial<ResumeData['certifications'][0]>) =>
    set({ certifications: resume.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  const contactEntries = [
    { key: 'email' as const, value: resume.contact.email },
    { key: 'phone' as const, value: resume.contact.phone },
    { key: 'location' as const, value: resume.contact.location },
    { key: 'linkedin' as const, value: resume.contact.linkedin || '' },
    { key: 'github' as const, value: resume.contact.github || '' },
    { key: 'website' as const, value: resume.contact.website || '' },
  ].filter((f) => f.value);

  return (
    <div className="font-sans text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center pb-4 border-b-2 border-gray-700 mb-4">
        <EditableText value={resume.name} onChange={(v) => set({ name: v })} readOnly={readOnly}
          className="text-3xl font-bold text-gray-900 block" placeholder="Your Name" />
        {contactEntries.length > 0 && (
          <p className="text-sm text-gray-500 mt-1 flex flex-wrap justify-center items-center gap-y-0.5">
            {contactEntries.map((f, i) => (
              <span key={f.key} className="flex items-center">
                <EditableText value={f.value} onChange={(v) => setContact({ [f.key]: v } as Partial<ResumeData['contact']>)}
                  readOnly={readOnly} className="inline-block" />
                {i < contactEntries.length - 1 && <span className="mx-1.5 text-gray-300">·</span>}
              </span>
            ))}
          </p>
        )}
      </div>
      {/* Summary */}
      {resume.summary && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-indigo-700 uppercase border-b border-indigo-200 pb-0.5 mb-2">Summary</h2>
          <EditableText value={resume.summary} onChange={(v) => set({ summary: v })} multiline readOnly={readOnly}
            className="text-sm text-gray-700 leading-relaxed block" />
        </div>
      )}
      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-indigo-700 uppercase border-b border-indigo-200 pb-0.5 mb-2">Skills</h2>
          <EditableText
            value={resume.skills.join(', ')}
            onChange={(v) => set({ skills: v.split(',').map((s) => s.trim()).filter(Boolean) })}
            readOnly={readOnly}
            className="text-sm block"
            placeholder="Skills (comma-separated)"
          />
        </div>
      )}
      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-indigo-700 uppercase border-b border-indigo-200 pb-0.5 mb-2">Experience</h2>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <EditableText value={exp.title} onChange={(v) => updateExp(exp.id, { title: v })} readOnly={readOnly}
                      className="font-bold text-sm text-gray-900 block" />
                    <span className="text-sm text-gray-600 flex flex-wrap items-center gap-x-1">
                      <EditableText value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} readOnly={readOnly}
                        className="inline-block" />
                      {(exp.location || !readOnly) && (
                        <>
                          <span className="text-gray-300">·</span>
                          <EditableText value={exp.location || ''} onChange={(v) => updateExp(exp.id, { location: v })}
                            readOnly={readOnly} placeholder="Location" className="inline-block text-gray-400" />
                        </>
                      )}
                    </span>
                  </div>
                  <EditableText
                    value={`${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`}
                    onChange={(v) => {
                      const parts = v.split(/\s*[–-]\s*/);
                      const end = parts[1]?.trim() || '';
                      const isCurrent = end.toLowerCase() === 'present';
                      updateExp(exp.id, { startDate: parts[0]?.trim() || '', endDate: isCurrent ? exp.endDate : end, current: isCurrent });
                    }}
                    readOnly={readOnly}
                    className="text-xs text-gray-400 shrink-0"
                  />
                </div>
                <Bullets text={exp.description} onChange={readOnly ? undefined : (v) => updateExp(exp.id, { description: v })} readOnly={readOnly} />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-indigo-700 uppercase border-b border-indigo-200 pb-0.5 mb-2">Education</h2>
          <div className="space-y-2">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <EditableText value={edu.school} onChange={(v) => updateEdu(edu.id, { school: v })} readOnly={readOnly}
                    className="font-bold text-sm block" />
                  <EditableText
                    value={`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}${edu.gpa ? ` — GPA: ${edu.gpa}` : ''}`}
                    onChange={(v) => updateEdu(edu.id, { degree: v, field: '', gpa: '' })}
                    readOnly={readOnly}
                    className="text-sm text-gray-600 block"
                  />
                </div>
                <EditableText
                  value={`${edu.startDate} – ${edu.endDate}`}
                  onChange={(v) => {
                    const parts = v.split(/\s*[–-]\s*/);
                    updateEdu(edu.id, { startDate: parts[0]?.trim() || '', endDate: parts[1]?.trim() || '' });
                  }}
                  readOnly={readOnly}
                  className="text-xs text-gray-400 shrink-0"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-indigo-700 uppercase border-b border-indigo-200 pb-0.5 mb-2">Projects</h2>
          <div className="space-y-2">
            {resume.projects.map((p) => (
              <div key={p.id}>
                <EditableText value={p.name} onChange={(v) => updateProj(p.id, { name: v })} readOnly={readOnly}
                  className="font-bold text-sm block" />
                <EditableText value={p.description} onChange={(v) => updateProj(p.id, { description: v })} multiline readOnly={readOnly}
                  className="text-sm text-gray-700 block" />
                <span className="text-xs text-gray-500">
                  <span className="font-medium">Tech: </span>
                  <EditableText value={p.technologies} onChange={(v) => updateProj(p.id, { technologies: v })} readOnly={readOnly}
                    className="inline-block" />
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div>
          <h2 className="text-[11px] font-bold tracking-widest text-indigo-700 uppercase border-b border-indigo-200 pb-0.5 mb-2">Certifications</h2>
          {resume.certifications.map((c) => (
            <div key={c.id} className="flex justify-between text-sm gap-2">
              <EditableText value={c.name} onChange={(v) => updateCert(c.id, { name: v })} readOnly={readOnly}
                className="font-medium" />
              <span className="text-gray-500 shrink-0 flex items-center gap-1">
                <EditableText value={c.issuer} onChange={(v) => updateCert(c.id, { issuer: v })} readOnly={readOnly}
                  className="inline-block" />
                {(c.date || !readOnly) && (
                  <>
                    <span className="text-gray-300">·</span>
                    <EditableText value={c.date || ''} onChange={(v) => updateCert(c.id, { date: v })} readOnly={readOnly}
                      placeholder="Date" className="inline-block" />
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template 2: Minimal ─────────────────────────────────────────────────────
function MinimalTemplate({ resume, onChange, readOnly }: TemplateProps) {
  const set = (p: Partial<ResumeData>) => onChange({ ...resume, ...p });
  const setContact = (p: Partial<ResumeData['contact']>) => set({ contact: { ...resume.contact, ...p } });
  const updateExp = (id: string, patch: Partial<ResumeData['experience'][0]>) =>
    set({ experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const updateEdu = (id: string, patch: Partial<ResumeData['education'][0]>) =>
    set({ education: resume.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const updateProj = (id: string, patch: Partial<ResumeData['projects'][0]>) =>
    set({ projects: resume.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const updateCert = (id: string, patch: Partial<ResumeData['certifications'][0]>) =>
    set({ certifications: resume.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  const contactEntries = [
    { key: 'email' as const, value: resume.contact.email },
    { key: 'phone' as const, value: resume.contact.phone },
    { key: 'location' as const, value: resume.contact.location },
    { key: 'linkedin' as const, value: resume.contact.linkedin || '' },
    { key: 'github' as const, value: resume.contact.github || '' },
    { key: 'website' as const, value: resume.contact.website || '' },
  ].filter((f) => f.value);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#1a1a1a' }}>
      {/* Name */}
      <div className="mb-5">
        <EditableText value={resume.name} onChange={(v) => set({ name: v })} readOnly={readOnly}
          className="text-4xl font-light tracking-tight block" placeholder="Your Name" />
        {contactEntries.length > 0 && (
          <p className="text-xs text-gray-400 mt-2 tracking-wide flex flex-wrap items-center gap-y-0.5">
            {contactEntries.map((f, i) => (
              <span key={f.key} className="flex items-center">
                <EditableText value={f.value} onChange={(v) => setContact({ [f.key]: v } as Partial<ResumeData['contact']>)}
                  readOnly={readOnly} className="inline-block" />
                {i < contactEntries.length - 1 && <span className="mx-2 text-gray-200">|</span>}
              </span>
            ))}
          </p>
        )}
      </div>
      {/* Summary */}
      {resume.summary && (
        <div className="mb-5">
          <EditableText value={resume.summary} onChange={(v) => set({ summary: v })} multiline readOnly={readOnly}
            className="text-sm text-gray-600 leading-relaxed block border-l-2 border-gray-200 pl-3" />
        </div>
      )}
      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-2">Skills</h2>
          <EditableText
            value={resume.skills.join(', ')}
            onChange={(v) => set({ skills: v.split(',').map((s) => s.trim()).filter(Boolean) })}
            readOnly={readOnly}
            className="text-sm text-gray-700 block"
            placeholder="Skills (comma-separated)"
          />
        </div>
      )}
      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <div className="flex-1 min-w-0">
                    <EditableText value={exp.title} onChange={(v) => updateExp(exp.id, { title: v })} readOnly={readOnly}
                      className="font-medium text-sm block" />
                    <span className="text-xs text-gray-500 flex flex-wrap items-center gap-x-1">
                      <EditableText value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} readOnly={readOnly}
                        className="inline-block" />
                      {(exp.location || !readOnly) && (
                        <>
                          <span className="text-gray-300">·</span>
                          <EditableText value={exp.location || ''} onChange={(v) => updateExp(exp.id, { location: v })}
                            readOnly={readOnly} placeholder="Location" className="inline-block text-gray-400" />
                        </>
                      )}
                    </span>
                  </div>
                  <EditableText
                    value={`${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`}
                    onChange={(v) => {
                      const parts = v.split(/\s*[–-]\s*/);
                      const end = parts[1]?.trim() || '';
                      const isCurrent = end.toLowerCase() === 'present';
                      updateExp(exp.id, { startDate: parts[0]?.trim() || '', endDate: isCurrent ? exp.endDate : end, current: isCurrent });
                    }}
                    readOnly={readOnly}
                    className="text-xs text-gray-400 shrink-0"
                  />
                </div>
                <Bullets text={exp.description} onChange={readOnly ? undefined : (v) => updateExp(exp.id, { description: v })} readOnly={readOnly} />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-2">Education</h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="flex items-baseline justify-between gap-2">
              <div className="flex-1 min-w-0">
                <EditableText value={edu.school} onChange={(v) => updateEdu(edu.id, { school: v })} readOnly={readOnly}
                  className="font-medium text-sm block" />
                <EditableText
                  value={`${edu.degree}${edu.field ? `, ${edu.field}` : ''}${edu.gpa ? ` — GPA: ${edu.gpa}` : ''}`}
                  onChange={(v) => updateEdu(edu.id, { degree: v, field: '', gpa: '' })}
                  readOnly={readOnly}
                  className="text-xs text-gray-500 block"
                />
              </div>
              <EditableText
                value={`${edu.startDate} – ${edu.endDate}`}
                onChange={(v) => {
                  const parts = v.split(/\s*[–-]\s*/);
                  updateEdu(edu.id, { startDate: parts[0]?.trim() || '', endDate: parts[1]?.trim() || '' });
                }}
                readOnly={readOnly}
                className="text-xs text-gray-400 shrink-0"
              />
            </div>
          ))}
        </div>
      )}
      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-2">Projects</h2>
          {resume.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <span className="font-medium text-sm flex flex-wrap items-center gap-x-1">
                <EditableText value={p.name} onChange={(v) => updateProj(p.id, { name: v })} readOnly={readOnly}
                  className="inline-block" />
                <span className="text-gray-400 font-normal">—</span>
                <EditableText value={p.technologies} onChange={(v) => updateProj(p.id, { technologies: v })} readOnly={readOnly}
                  className="inline-block text-gray-400 font-normal" />
              </span>
              <EditableText value={p.description} onChange={(v) => updateProj(p.id, { description: v })} multiline readOnly={readOnly}
                className="text-xs text-gray-600 block" />
            </div>
          ))}
        </div>
      )}
      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div>
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-2">Certifications</h2>
          {resume.certifications.map((c) => (
            <p key={c.id} className="text-sm flex flex-wrap items-center gap-x-1">
              <EditableText value={c.name} onChange={(v) => updateCert(c.id, { name: v })} readOnly={readOnly}
                className="inline-block" />
              <span className="text-gray-400">—</span>
              <EditableText value={c.issuer} onChange={(v) => updateCert(c.id, { issuer: v })} readOnly={readOnly}
                className="inline-block text-gray-400" />
              {(c.date || !readOnly) && (
                <>
                  <span className="text-gray-300">,</span>
                  <EditableText value={c.date || ''} onChange={(v) => updateCert(c.id, { date: v })} readOnly={readOnly}
                    placeholder="Date" className="inline-block text-gray-400" />
                </>
              )}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template 3: ATS Clean ───────────────────────────────────────────────────
function ATSCleanTemplate({ resume, onChange, readOnly }: TemplateProps) {
  const set = (p: Partial<ResumeData>) => onChange({ ...resume, ...p });
  const setContact = (p: Partial<ResumeData['contact']>) => set({ contact: { ...resume.contact, ...p } });
  const updateExp = (id: string, patch: Partial<ResumeData['experience'][0]>) =>
    set({ experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const updateEdu = (id: string, patch: Partial<ResumeData['education'][0]>) =>
    set({ education: resume.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const updateProj = (id: string, patch: Partial<ResumeData['projects'][0]>) =>
    set({ projects: resume.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const updateCert = (id: string, patch: Partial<ResumeData['certifications'][0]>) =>
    set({ certifications: resume.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  const contactEntries = [
    { key: 'email' as const, value: resume.contact.email },
    { key: 'phone' as const, value: resume.contact.phone },
    { key: 'location' as const, value: resume.contact.location },
    { key: 'linkedin' as const, value: resume.contact.linkedin || '' },
    { key: 'github' as const, value: resume.contact.github || '' },
  ].filter((f) => f.value);

  const Heading = ({ title }: { title: string }) => (
    <div className="mb-2">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-900">{title}</p>
      <div style={{ borderTop: '1.5px solid #111', marginTop: 2 }} />
    </div>
  );

  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: '#111', fontSize: 13 }}>
      <div className="text-center mb-3">
        <EditableText value={resume.name} onChange={(v) => set({ name: v })} readOnly={readOnly}
          className="text-2xl font-bold block tracking-tight" placeholder="Your Name" />
        {contactEntries.length > 0 && (
          <p className="text-xs mt-1 text-gray-600 flex flex-wrap justify-center items-center gap-y-0.5">
            {contactEntries.map((f, i) => (
              <span key={f.key} className="flex items-center">
                <EditableText value={f.value} onChange={(v) => setContact({ [f.key]: v } as Partial<ResumeData['contact']>)}
                  readOnly={readOnly} className="inline-block" />
                {i < contactEntries.length - 1 && <span className="mx-1.5 text-gray-400">|</span>}
              </span>
            ))}
          </p>
        )}
      </div>
      <div style={{ borderTop: '2px solid #111', marginBottom: 12 }} />

      {resume.summary && (
        <div className="mb-3"><Heading title="Professional Summary" />
          <EditableText value={resume.summary} onChange={(v) => set({ summary: v })} multiline readOnly={readOnly}
            className="text-sm leading-relaxed block" />
        </div>
      )}
      {resume.skills.length > 0 && (
        <div className="mb-3"><Heading title="Skills" />
          <EditableText
            value={resume.skills.join(', ')}
            onChange={(v) => set({ skills: v.split(',').map((s) => s.trim()).filter(Boolean) })}
            readOnly={readOnly}
            className="text-sm block"
            placeholder="Skills (comma-separated)"
          />
        </div>
      )}
      {resume.experience.length > 0 && (
        <div className="mb-3"><Heading title="Work Experience" />
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <EditableText value={exp.title} onChange={(v) => updateExp(exp.id, { title: v })} readOnly={readOnly}
                      className="font-bold text-sm block" />
                    <span className="text-sm flex flex-wrap items-center gap-x-1">
                      <EditableText value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} readOnly={readOnly}
                        className="inline-block" />
                      {(exp.location || !readOnly) && (
                        <>
                          <span className="text-gray-400">|</span>
                          <EditableText value={exp.location || ''} onChange={(v) => updateExp(exp.id, { location: v })}
                            readOnly={readOnly} placeholder="Location" className="inline-block text-gray-600" />
                        </>
                      )}
                    </span>
                  </div>
                  <EditableText
                    value={`${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`}
                    onChange={(v) => {
                      const parts = v.split(/\s*[–-]\s*/);
                      const end = parts[1]?.trim() || '';
                      const isCurrent = end.toLowerCase() === 'present';
                      updateExp(exp.id, { startDate: parts[0]?.trim() || '', endDate: isCurrent ? exp.endDate : end, current: isCurrent });
                    }}
                    readOnly={readOnly}
                    className="text-xs text-gray-700 shrink-0"
                  />
                </div>
                <Bullets text={exp.description} onChange={readOnly ? undefined : (v) => updateExp(exp.id, { description: v })} readOnly={readOnly} />
              </div>
            ))}
          </div>
        </div>
      )}
      {resume.education.length > 0 && (
        <div className="mb-3"><Heading title="Education" />
          {resume.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start text-sm gap-2">
              <div className="flex-1 min-w-0">
                <EditableText value={edu.school} onChange={(v) => updateEdu(edu.id, { school: v })} readOnly={readOnly}
                  className="font-bold block" />
                <EditableText
                  value={`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}${edu.gpa ? ` — GPA: ${edu.gpa}` : ''}`}
                  onChange={(v) => updateEdu(edu.id, { degree: v, field: '', gpa: '' })}
                  readOnly={readOnly}
                  className="block"
                />
              </div>
              <EditableText
                value={`${edu.startDate} – ${edu.endDate}`}
                onChange={(v) => {
                  const parts = v.split(/\s*[–-]\s*/);
                  updateEdu(edu.id, { startDate: parts[0]?.trim() || '', endDate: parts[1]?.trim() || '' });
                }}
                readOnly={readOnly}
                className="text-xs text-gray-700 shrink-0"
              />
            </div>
          ))}
        </div>
      )}
      {resume.projects.length > 0 && (
        <div className="mb-3"><Heading title="Projects" />
          {resume.projects.map((p) => (
            <div key={p.id} className="mb-1.5">
              <span className="font-bold text-sm flex flex-wrap items-center gap-x-1">
                <EditableText value={p.name} onChange={(v) => updateProj(p.id, { name: v })} readOnly={readOnly}
                  className="inline-block" />
                <span className="font-normal text-gray-700">|</span>
                <EditableText value={p.technologies} onChange={(v) => updateProj(p.id, { technologies: v })} readOnly={readOnly}
                  className="inline-block font-normal text-gray-700" />
              </span>
              <EditableText value={p.description} onChange={(v) => updateProj(p.id, { description: v })} multiline readOnly={readOnly}
                className="text-sm block" />
            </div>
          ))}
        </div>
      )}
      {resume.certifications.length > 0 && (
        <div><Heading title="Certifications" />
          {resume.certifications.map((c) => (
            <div key={c.id} className="flex justify-between text-sm gap-2">
              <EditableText value={c.name} onChange={(v) => updateCert(c.id, { name: v })} readOnly={readOnly}
                className="font-bold" />
              <span className="text-gray-600 shrink-0 flex items-center gap-1">
                <EditableText value={c.issuer} onChange={(v) => updateCert(c.id, { issuer: v })} readOnly={readOnly}
                  className="inline-block" />
                {(c.date || !readOnly) && (
                  <>
                    <span className="text-gray-300">·</span>
                    <EditableText value={c.date || ''} onChange={(v) => updateCert(c.id, { date: v })} readOnly={readOnly}
                      placeholder="Date" className="inline-block" />
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template 4: ATS Modern ──────────────────────────────────────────────────
function ATSModernTemplate({ resume, onChange, readOnly }: TemplateProps) {
  const set = (p: Partial<ResumeData>) => onChange({ ...resume, ...p });
  const setContact = (p: Partial<ResumeData['contact']>) => set({ contact: { ...resume.contact, ...p } });
  const updateExp = (id: string, patch: Partial<ResumeData['experience'][0]>) =>
    set({ experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const updateEdu = (id: string, patch: Partial<ResumeData['education'][0]>) =>
    set({ education: resume.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const updateProj = (id: string, patch: Partial<ResumeData['projects'][0]>) =>
    set({ projects: resume.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const updateCert = (id: string, patch: Partial<ResumeData['certifications'][0]>) =>
    set({ certifications: resume.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)) });

  const contactEntries = [
    { key: 'email' as const, value: resume.contact.email },
    { key: 'phone' as const, value: resume.contact.phone },
    { key: 'location' as const, value: resume.contact.location },
    { key: 'linkedin' as const, value: resume.contact.linkedin || '' },
    { key: 'github' as const, value: resume.contact.github || '' },
  ].filter((f) => f.value);

  const Heading = ({ title }: { title: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <div style={{ width: 3, height: 14, background: '#1d4ed8', borderRadius: 2, flexShrink: 0 }} />
      <span className="text-[10px] font-bold uppercase tracking-widest text-blue-800">{title}</span>
      <div style={{ flex: 1, height: 1, background: '#bfdbfe' }} />
    </div>
  );

  return (
    <div style={{ fontFamily: 'system-ui, Calibri, sans-serif', color: '#1e293b', fontSize: 13 }}>
      <div className="mb-4">
        <EditableText value={resume.name} onChange={(v) => set({ name: v })} readOnly={readOnly}
          className="text-3xl font-bold text-slate-900 tracking-tight block" placeholder="Your Name" />
        {contactEntries.length > 0 && (
          <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-y-0.5">
            {contactEntries.map((f, i) => (
              <span key={f.key} className="flex items-center">
                <EditableText value={f.value} onChange={(v) => setContact({ [f.key]: v } as Partial<ResumeData['contact']>)}
                  readOnly={readOnly} className="inline-block" />
                {i < contactEntries.length - 1 && <span className="mx-1.5 text-slate-300">·</span>}
              </span>
            ))}
          </p>
        )}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #1d4ed8 0%, #93c5fd 100%)', borderRadius: 1, marginTop: 8 }} />
      </div>

      {resume.summary && (
        <div className="mb-4"><Heading title="Professional Summary" />
          <EditableText value={resume.summary} onChange={(v) => set({ summary: v })} multiline readOnly={readOnly}
            className="text-sm text-slate-600 leading-relaxed block" />
        </div>
      )}
      {resume.skills.length > 0 && (
        <div className="mb-4"><Heading title="Core Skills" />
          <EditableText
            value={resume.skills.join(', ')}
            onChange={(v) => set({ skills: v.split(',').map((s) => s.trim()).filter(Boolean) })}
            readOnly={readOnly}
            className="text-sm text-slate-700 block"
            placeholder="Skills (comma-separated)"
          />
        </div>
      )}
      {resume.experience.length > 0 && (
        <div className="mb-4"><Heading title="Work Experience" />
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <EditableText value={exp.title} onChange={(v) => updateExp(exp.id, { title: v })} readOnly={readOnly}
                      className="font-bold text-sm text-slate-900 block" />
                    <span className="text-xs text-slate-500 flex flex-wrap items-center gap-x-1">
                      <EditableText value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} readOnly={readOnly}
                        className="inline-block" />
                      {(exp.location || !readOnly) && (
                        <>
                          <span className="text-slate-300">·</span>
                          <EditableText value={exp.location || ''} onChange={(v) => updateExp(exp.id, { location: v })}
                            readOnly={readOnly} placeholder="Location" className="inline-block text-slate-400" />
                        </>
                      )}
                    </span>
                  </div>
                  <EditableText
                    value={`${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`}
                    onChange={(v) => {
                      const parts = v.split(/\s*[–-]\s*/);
                      const end = parts[1]?.trim() || '';
                      const isCurrent = end.toLowerCase() === 'present';
                      updateExp(exp.id, { startDate: parts[0]?.trim() || '', endDate: isCurrent ? exp.endDate : end, current: isCurrent });
                    }}
                    readOnly={readOnly}
                    className="text-xs text-slate-400 shrink-0"
                  />
                </div>
                <Bullets text={exp.description} onChange={readOnly ? undefined : (v) => updateExp(exp.id, { description: v })} readOnly={readOnly} />
              </div>
            ))}
          </div>
        </div>
      )}
      {resume.education.length > 0 && (
        <div className="mb-4"><Heading title="Education" />
          {resume.education.map((edu) => (
            <div key={edu.id} className="flex justify-between items-start gap-2">
              <div className="flex-1 min-w-0">
                <EditableText value={edu.school} onChange={(v) => updateEdu(edu.id, { school: v })} readOnly={readOnly}
                  className="font-bold text-sm text-slate-900 block" />
                <EditableText
                  value={`${edu.degree}${edu.field ? ` in ${edu.field}` : ''}${edu.gpa ? ` — GPA: ${edu.gpa}` : ''}`}
                  onChange={(v) => updateEdu(edu.id, { degree: v, field: '', gpa: '' })}
                  readOnly={readOnly}
                  className="text-xs text-slate-500 block"
                />
              </div>
              <EditableText
                value={`${edu.startDate} – ${edu.endDate}`}
                onChange={(v) => {
                  const parts = v.split(/\s*[–-]\s*/);
                  updateEdu(edu.id, { startDate: parts[0]?.trim() || '', endDate: parts[1]?.trim() || '' });
                }}
                readOnly={readOnly}
                className="text-xs text-slate-400 shrink-0"
              />
            </div>
          ))}
        </div>
      )}
      {resume.projects.length > 0 && (
        <div className="mb-4"><Heading title="Projects" />
          {resume.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <span className="font-bold text-sm text-slate-900 flex flex-wrap items-center gap-x-1">
                <EditableText value={p.name} onChange={(v) => updateProj(p.id, { name: v })} readOnly={readOnly}
                  className="inline-block" />
                <span className="font-normal text-slate-500">|</span>
                <EditableText value={p.technologies} onChange={(v) => updateProj(p.id, { technologies: v })} readOnly={readOnly}
                  className="inline-block font-normal text-slate-500" />
              </span>
              <EditableText value={p.description} onChange={(v) => updateProj(p.id, { description: v })} multiline readOnly={readOnly}
                className="text-xs text-slate-600 block" />
            </div>
          ))}
        </div>
      )}
      {resume.certifications.length > 0 && (
        <div><Heading title="Certifications" />
          {resume.certifications.map((c) => (
            <div key={c.id} className="flex justify-between text-sm gap-2">
              <EditableText value={c.name} onChange={(v) => updateCert(c.id, { name: v })} readOnly={readOnly}
                className="font-semibold text-slate-800" />
              <span className="text-slate-500 shrink-0 flex items-center gap-1">
                <EditableText value={c.issuer} onChange={(v) => updateCert(c.id, { issuer: v })} readOnly={readOnly}
                  className="inline-block" />
                {(c.date || !readOnly) && (
                  <>
                    <span className="text-slate-300">·</span>
                    <EditableText value={c.date || ''} onChange={(v) => updateCert(c.id, { date: v })} readOnly={readOnly}
                      placeholder="Date" className="inline-block" />
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template registry ───────────────────────────────────────────────────────

export type TemplateKey = 'classic' | 'minimal' | 'ats-clean' | 'ats-modern';

const TEMPLATES: Record<TemplateKey, { label: string; accent: string; badge?: string; Component: React.FC<TemplateProps> }> = {
  classic:    { label: 'Classic',      accent: '#4338ca', Component: ClassicTemplate },
  minimal:    { label: 'Minimal',      accent: '#6b7280', Component: MinimalTemplate },
  'ats-clean':  { label: 'ATS Clean',  accent: '#111',    badge: '100% ATS', Component: ATSCleanTemplate },
  'ats-modern': { label: 'ATS Modern', accent: '#1d4ed8', badge: '100% ATS', Component: ATSModernTemplate },
};

// ─── Template Picker Modal ───────────────────────────────────────────────────

function TemplatePicker({
  current,
  resume,
  onSelect,
  onClose,
}: {
  current: TemplateKey;
  resume: ResumeData;
  onSelect: (k: TemplateKey) => void;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState<TemplateKey | null>(null);

  const SCALE = 0.26;
  const CARD_W = 180;
  const CARD_H = 240;
  const INNER_W = CARD_W / SCALE;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-3xl mx-4">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Choose a Template</h2>
            <p className="text-sm text-gray-500 mt-0.5">Click a template to apply it</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(Object.entries(TEMPLATES) as [TemplateKey, typeof TEMPLATES[TemplateKey]][]).map(([key, tmpl]) => {
            const Comp = tmpl.Component;
            const isSelected = key === current;

            return (
              <div
                key={key}
                onClick={() => { onSelect(key); onClose(); }}
                onMouseEnter={() => setHovered(key)}
                onMouseLeave={() => setHovered(null)}
                className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                  isSelected ? 'border-primary-500 shadow-lg shadow-primary-100' : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div
                  style={{ width: CARD_W, height: CARD_H, overflow: 'hidden', position: 'relative', background: 'white' }}
                >
                  <div style={{
                    transform: `scale(${SCALE})`,
                    transformOrigin: 'top left',
                    width: INNER_W,
                    pointerEvents: 'none',
                    padding: '32px',
                  }}>
                    <Comp resume={resume} onChange={() => {}} readOnly />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                </div>

                <div
                  className="flex items-center justify-between px-3 py-2 border-t"
                  style={{ borderColor: isSelected ? tmpl.accent + '40' : '#e5e7eb', background: isSelected ? tmpl.accent + '08' : 'white' }}
                >
                  <span className="text-sm font-semibold" style={{ color: isSelected ? tmpl.accent : '#374151' }}>
                    {tmpl.label}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {tmpl.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700">
                        {tmpl.badge}
                      </span>
                    )}
                    {isSelected && <CheckCircle size={14} style={{ color: tmpl.accent }} />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main ResumePreview ───────────────────────────────────────────────────────

interface ResumePreviewProps {
  resume: ResumeData;
  onChange: (resume: ResumeData) => void;
  onDownloadDocx: (template: TemplateKey) => void;
  onDownloadPdf: () => void;
  downloading?: boolean;
}

export default function ResumePreview({
  resume,
  onChange,
  onDownloadDocx,
  onDownloadPdf,
  downloading,
}: ResumePreviewProps) {
  const [template, setTemplate] = useState<TemplateKey>('classic');
  const [showPicker, setShowPicker] = useState(false);

  const { Component } = TEMPLATES[template];

  return (
    <div>
      {/* Action bar */}
      <div className="no-print flex items-center justify-between mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm text-amber-800 font-medium">Click any text to edit inline</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <Palette size={15} />
            Template
          </button>
          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
          >
            <Printer size={15} />
            PDF
          </button>
          <button
            onClick={() => onDownloadDocx(template)}
            disabled={downloading}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Download size={15} />
            {downloading ? 'Generating...' : 'Word (.docx)'}
          </button>
        </div>
      </div>

      {/* Resume document */}
      <div
        id="resume-print"
        className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-3xl mx-auto"
      >
        <Component resume={resume} onChange={onChange} />
      </div>

      {/* Template picker modal */}
      {showPicker && (
        <TemplatePicker
          current={template}
          resume={resume}
          onSelect={setTemplate}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}
