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
      className={`group relative cursor-pointer rounded hover:bg-primary-50 hover:outline hover:outline-1 hover:outline-primary-300 transition-all inline-block w-full ${className}`}
    >
      {value || <span className="text-gray-300 italic text-xs">{placeholder || 'Click to edit'}</span>}
      <Edit2 size={10} className="absolute right-0.5 top-0.5 opacity-0 group-hover:opacity-60 text-primary-500" />
    </span>
  );
}

// ─── Template components ──────────────────────────────────────────────────────

interface TemplateProps {
  resume: ResumeData;
  onChange: (r: ResumeData) => void;
  readOnly?: boolean;
}

function Bullets({ text, readOnly }: { text: string; readOnly?: boolean }) {
  const lines = text.split('\n').filter((b) => b.trim());
  return (
    <div className="space-y-0.5 mt-1">
      {lines.map((b, i) => (
        <div key={i} className="flex gap-2 text-sm">
          <span className="mt-0.5 shrink-0">•</span>
          <span>{b.trim()}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Template 1: Classic ─────────────────────────────────────────────────────
function ClassicTemplate({ resume, onChange, readOnly }: TemplateProps) {
  const set = (p: Partial<ResumeData>) => onChange({ ...resume, ...p });
  const updateExp = (id: string, patch: Partial<ResumeData['experience'][0]>) =>
    set({ experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  const contact = [resume.contact.email, resume.contact.phone, resume.contact.location,
    resume.contact.linkedin, resume.contact.github].filter(Boolean);

  return (
    <div className="font-sans text-gray-800" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Header */}
      <div className="text-center pb-4 border-b-2 border-gray-700 mb-4">
        <EditableText value={resume.name} onChange={(v) => set({ name: v })} readOnly={readOnly}
          className="text-3xl font-bold text-gray-900 block" placeholder="Your Name" />
        {contact.length > 0 && <p className="text-sm text-gray-500 mt-1">{contact.join('  ·  ')}</p>}
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
          <p className="text-sm">{resume.skills.join('  ·  ')}</p>
        </div>
      )}
      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[11px] font-bold tracking-widest text-indigo-700 uppercase border-b border-indigo-200 pb-0.5 mb-2">Experience</h2>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <EditableText value={exp.title} onChange={(v) => updateExp(exp.id, { title: v })} readOnly={readOnly}
                      className="font-bold text-sm text-gray-900 block" />
                    <EditableText value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} readOnly={readOnly}
                      className="text-sm text-gray-600 block" />
                  </div>
                  <span className="text-xs text-gray-400 ml-4 shrink-0">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <Bullets text={exp.description} readOnly={readOnly} />
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
              <div key={edu.id} className="flex items-start justify-between">
                <div>
                  <p className="font-bold text-sm">{edu.school}</p>
                  <p className="text-sm text-gray-600">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
                </div>
                <span className="text-xs text-gray-400 ml-4 shrink-0">{edu.startDate} – {edu.endDate}</span>
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
                <p className="font-bold text-sm">{p.name}</p>
                <p className="text-sm text-gray-700">{p.description}</p>
                <p className="text-xs text-gray-500"><span className="font-medium">Tech:</span> {p.technologies}</p>
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
            <div key={c.id} className="flex justify-between text-sm">
              <span className="font-medium">{c.name}</span>
              <span className="text-gray-500">{c.issuer}{c.date ? ` · ${c.date}` : ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template 2: Modern ───────────────────────────────────────────────────────
function ModernTemplate({ resume, onChange, readOnly }: TemplateProps) {
  const set = (p: Partial<ResumeData>) => onChange({ ...resume, ...p });
  const updateExp = (id: string, patch: Partial<ResumeData['experience'][0]>) =>
    set({ experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  const contact = [resume.contact.email, resume.contact.phone, resume.contact.location,
    resume.contact.linkedin, resume.contact.github].filter(Boolean);

  return (
    <div className="font-sans text-gray-800" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Dark header */}
      <div className="bg-gray-900 text-white px-6 py-5 -mx-8 -mt-8 mb-5" style={{ marginLeft: '-2rem', marginRight: '-2rem', marginTop: '-2rem', paddingLeft: '2rem', paddingRight: '2rem' }}>
        <EditableText value={resume.name} onChange={(v) => set({ name: v })} readOnly={readOnly}
          className="text-3xl font-bold block" placeholder="Your Name" />
        {contact.length > 0 && (
          <p className="text-gray-300 text-sm mt-1">{contact.join('  ·  ')}</p>
        )}
      </div>
      {/* Summary */}
      {resume.summary && (
        <div className="mb-4 pl-3 border-l-4 border-teal-500">
          <EditableText value={resume.summary} onChange={(v) => set({ summary: v })} multiline readOnly={readOnly}
            className="text-sm text-gray-700 leading-relaxed block" />
        </div>
      )}
      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2 flex items-center gap-2">
            <span className="flex-1 border-t border-teal-200" />SKILLS<span className="flex-1 border-t border-teal-200" />
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {resume.skills.map((s) => (
              <span key={s} className="bg-teal-50 text-teal-800 text-xs px-2 py-0.5 rounded-full border border-teal-200">{s}</span>
            ))}
          </div>
        </div>
      )}
      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2 flex items-center gap-2">
            <span className="flex-1 border-t border-teal-200" />EXPERIENCE<span className="flex-1 border-t border-teal-200" />
          </h2>
          <div className="space-y-3">
            {resume.experience.map((exp) => (
              <div key={exp.id} className="pl-3 border-l-2 border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <EditableText value={exp.title} onChange={(v) => updateExp(exp.id, { title: v })} readOnly={readOnly}
                      className="font-bold text-sm text-gray-900 block" />
                    <EditableText value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} readOnly={readOnly}
                      className="text-sm text-teal-700 block" />
                  </div>
                  <span className="text-xs text-gray-400 ml-4 shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <Bullets text={exp.description} readOnly={readOnly} />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2 flex items-center gap-2">
            <span className="flex-1 border-t border-teal-200" />EDUCATION<span className="flex-1 border-t border-teal-200" />
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="flex items-start justify-between">
              <div>
                <p className="font-bold text-sm">{edu.school}</p>
                <p className="text-sm text-gray-600">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
              </div>
              <span className="text-xs text-gray-400 ml-4 shrink-0">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2 flex items-center gap-2">
            <span className="flex-1 border-t border-teal-200" />PROJECTS<span className="flex-1 border-t border-teal-200" />
          </h2>
          {resume.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-bold text-sm">{p.name} <span className="font-normal text-gray-500 text-xs">— {p.technologies}</span></p>
              <p className="text-sm text-gray-700">{p.description}</p>
            </div>
          ))}
        </div>
      )}
      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-teal-600 mb-2 flex items-center gap-2">
            <span className="flex-1 border-t border-teal-200" />CERTIFICATIONS<span className="flex-1 border-t border-teal-200" />
          </h2>
          {resume.certifications.map((c) => (
            <div key={c.id} className="flex justify-between text-sm">
              <span className="font-medium">{c.name}</span>
              <span className="text-gray-500">{c.issuer}{c.date ? ` · ${c.date}` : ''}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template 3: Minimal ─────────────────────────────────────────────────────
function MinimalTemplate({ resume, onChange, readOnly }: TemplateProps) {
  const set = (p: Partial<ResumeData>) => onChange({ ...resume, ...p });
  const updateExp = (id: string, patch: Partial<ResumeData['experience'][0]>) =>
    set({ experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  const contact = [resume.contact.email, resume.contact.phone, resume.contact.location,
    resume.contact.linkedin, resume.contact.github].filter(Boolean);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', color: '#1a1a1a' }}>
      {/* Name */}
      <div className="mb-5">
        <EditableText value={resume.name} onChange={(v) => set({ name: v })} readOnly={readOnly}
          className="text-4xl font-light tracking-tight block" placeholder="Your Name" />
        {contact.length > 0 && (
          <p className="text-xs text-gray-400 mt-2 tracking-wide">{contact.join('   |   ')}</p>
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
          <p className="text-sm text-gray-700">{resume.skills.join(' · ')}</p>
        </div>
      )}
      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-3">Experience</h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-baseline justify-between mb-0.5">
                  <div>
                    <EditableText value={exp.title} onChange={(v) => updateExp(exp.id, { title: v })} readOnly={readOnly}
                      className="font-medium text-sm block" />
                    <EditableText value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} readOnly={readOnly}
                      className="text-xs text-gray-500 block" />
                  </div>
                  <span className="text-xs text-gray-400 ml-4 shrink-0">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <Bullets text={exp.description} readOnly={readOnly} />
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
            <div key={edu.id} className="flex items-baseline justify-between">
              <div>
                <p className="font-medium text-sm">{edu.school}</p>
                <p className="text-xs text-gray-500">{edu.degree}{edu.field ? `, ${edu.field}` : ''}</p>
              </div>
              <span className="text-xs text-gray-400 ml-4">{edu.startDate} – {edu.endDate}</span>
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
              <p className="font-medium text-sm">{p.name} <span className="text-gray-400 font-normal">— {p.technologies}</span></p>
              <p className="text-xs text-gray-600">{p.description}</p>
            </div>
          ))}
        </div>
      )}
      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div>
          <h2 className="text-[9px] uppercase tracking-[0.2em] text-gray-400 font-medium mb-2">Certifications</h2>
          {resume.certifications.map((c) => (
            <p key={c.id} className="text-sm">{c.name} <span className="text-gray-400">— {c.issuer}{c.date ? `, ${c.date}` : ''}</span></p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template 4: Executive ───────────────────────────────────────────────────
function ExecutiveTemplate({ resume, onChange, readOnly }: TemplateProps) {
  const set = (p: Partial<ResumeData>) => onChange({ ...resume, ...p });
  const updateExp = (id: string, patch: Partial<ResumeData['experience'][0]>) =>
    set({ experience: resume.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });

  const contact = [resume.contact.email, resume.contact.phone, resume.contact.location,
    resume.contact.linkedin, resume.contact.github].filter(Boolean);

  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#1c1c1c' }}>
      {/* Header */}
      <div className="mb-5 pb-4" style={{ borderBottom: '3px solid #92400e' }}>
        <EditableText value={resume.name} onChange={(v) => set({ name: v })} readOnly={readOnly}
          className="text-4xl font-bold tracking-tight block text-gray-900" placeholder="Your Name" />
        {contact.length > 0 && (
          <p className="text-xs mt-2" style={{ color: '#78350f' }}>{contact.join('   ·   ')}</p>
        )}
      </div>
      {/* Summary */}
      {resume.summary && (
        <div className="mb-5">
          <h2 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>
            ◆ Executive Summary
          </h2>
          <EditableText value={resume.summary} onChange={(v) => set({ summary: v })} multiline readOnly={readOnly}
            className="text-sm leading-relaxed block text-gray-700" />
        </div>
      )}
      {/* Skills */}
      {resume.skills.length > 0 && (
        <div className="mb-5">
          <h2 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>
            ◆ Core Competencies
          </h2>
          <div className="grid grid-cols-3 gap-1">
            {resume.skills.map((s) => (
              <span key={s} className="text-sm text-gray-700 flex items-center gap-1">
                <span style={{ color: '#d97706' }}>›</span> {s}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Experience */}
      {resume.experience.length > 0 && (
        <div className="mb-5">
          <h2 className="font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#92400e' }}>
            ◆ Professional Experience
          </h2>
          <div className="space-y-4">
            {resume.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <EditableText value={exp.title} onChange={(v) => updateExp(exp.id, { title: v })} readOnly={readOnly}
                      className="font-bold text-sm block" />
                    <EditableText value={exp.company} onChange={(v) => updateExp(exp.id, { company: v })} readOnly={readOnly}
                      className="text-sm italic block text-amber-800" />
                  </div>
                  <span className="text-xs text-gray-500 ml-4 shrink-0 font-medium">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <Bullets text={exp.description} readOnly={readOnly} />
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Education */}
      {resume.education.length > 0 && (
        <div className="mb-5">
          <h2 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>
            ◆ Education
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="flex items-start justify-between">
              <div>
                <p className="font-bold text-sm">{edu.school}</p>
                <p className="text-sm italic text-gray-600">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</p>
              </div>
              <span className="text-xs text-gray-500 ml-4">{edu.startDate} – {edu.endDate}</span>
            </div>
          ))}
        </div>
      )}
      {/* Projects */}
      {resume.projects.length > 0 && (
        <div className="mb-5">
          <h2 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>◆ Notable Projects</h2>
          {resume.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <p className="font-bold text-sm">{p.name}</p>
              <p className="text-sm text-gray-700">{p.description}</p>
              <p className="text-xs text-gray-500 italic">{p.technologies}</p>
            </div>
          ))}
        </div>
      )}
      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <div>
          <h2 className="font-bold text-xs uppercase tracking-widest mb-2" style={{ color: '#92400e' }}>◆ Certifications</h2>
          {resume.certifications.map((c) => (
            <p key={c.id} className="text-sm">{c.name} <span className="text-gray-500 italic">— {c.issuer}{c.date ? `, ${c.date}` : ''}</span></p>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Template registry ───────────────────────────────────────────────────────

export type TemplateKey = 'classic' | 'modern' | 'minimal' | 'executive';

const TEMPLATES: Record<TemplateKey, { label: string; accent: string; Component: React.FC<TemplateProps> }> = {
  classic: { label: 'Classic', accent: '#4338ca', Component: ClassicTemplate },
  modern: { label: 'Modern', accent: '#0d9488', Component: ModernTemplate },
  minimal: { label: 'Minimal', accent: '#6b7280', Component: MinimalTemplate },
  executive: { label: 'Executive', accent: '#92400e', Component: ExecutiveTemplate },
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

  // Scale factor: preview card is 200px wide, resume content is ~680px wide
  const SCALE = 0.26;
  const CARD_W = 180;
  const CARD_H = 240;
  const INNER_W = CARD_W / SCALE; // 692px

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

        <div className="grid grid-cols-4 gap-4">
          {(Object.entries(TEMPLATES) as [TemplateKey, typeof TEMPLATES[TemplateKey]][]).map(([key, tmpl]) => {
            const Comp = tmpl.Component;
            const isSelected = key === current;
            const isHovered = key === hovered;

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
                {/* Mini preview */}
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
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent" />
                </div>

                {/* Label bar */}
                <div
                  className="flex items-center justify-between px-3 py-2 border-t"
                  style={{ borderColor: isSelected ? tmpl.accent + '40' : '#e5e7eb', background: isSelected ? tmpl.accent + '08' : 'white' }}
                >
                  <span className="text-sm font-semibold" style={{ color: isSelected ? tmpl.accent : '#374151' }}>
                    {tmpl.label}
                  </span>
                  {isSelected && <CheckCircle size={14} style={{ color: tmpl.accent }} />}
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
  onDownloadDocx: () => void;
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
            onClick={onDownloadDocx}
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
