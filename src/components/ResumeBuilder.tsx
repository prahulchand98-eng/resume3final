'use client';

import { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { ResumeData, ExperienceEntry, EducationEntry, ProjectEntry, CertificationEntry, emptyResume } from '@/lib/types';

interface ResumeBuilderProps {
  value: ResumeData;
  onChange: (data: ResumeData) => void;
}

function uuid() {
  return crypto.randomUUID();
}

function SectionHeader({
  title,
  open,
  toggle,
}: {
  title: string;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={toggle}
      className="w-full flex items-center justify-between py-3 text-left font-semibold text-gray-800 border-b border-gray-200 hover:text-primary-700 transition-colors"
    >
      {title}
      {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
  );
}

export default function ResumeBuilder({ value, onChange }: ResumeBuilderProps) {
  const [sections, setSections] = useState({
    contact: true,
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: false,
    certifications: false,
  });

  const toggle = (s: keyof typeof sections) =>
    setSections((prev) => ({ ...prev, [s]: !prev[s] }));

  const set = (patch: Partial<ResumeData>) => onChange({ ...value, ...patch });
  const setContact = (patch: Partial<ResumeData['contact']>) =>
    onChange({ ...value, contact: { ...value.contact, ...patch } });

  // Experience
  const addExp = () =>
    set({
      experience: [
        ...value.experience,
        { id: uuid(), company: '', title: '', startDate: '', endDate: '', current: false, description: '' },
      ],
    });
  const updateExp = (id: string, patch: Partial<ExperienceEntry>) =>
    set({ experience: value.experience.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const removeExp = (id: string) =>
    set({ experience: value.experience.filter((e) => e.id !== id) });

  // Education
  const addEdu = () =>
    set({
      education: [
        ...value.education,
        { id: uuid(), school: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' },
      ],
    });
  const updateEdu = (id: string, patch: Partial<EducationEntry>) =>
    set({ education: value.education.map((e) => (e.id === id ? { ...e, ...patch } : e)) });
  const removeEdu = (id: string) =>
    set({ education: value.education.filter((e) => e.id !== id) });

  // Projects
  const addProj = () =>
    set({
      projects: [
        ...value.projects,
        { id: uuid(), name: '', description: '', technologies: '', link: '' },
      ],
    });
  const updateProj = (id: string, patch: Partial<ProjectEntry>) =>
    set({ projects: value.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  const removeProj = (id: string) =>
    set({ projects: value.projects.filter((p) => p.id !== id) });

  // Certifications
  const addCert = () =>
    set({
      certifications: [
        ...value.certifications,
        { id: uuid(), name: '', issuer: '', date: '' },
      ],
    });
  const updateCert = (id: string, patch: Partial<CertificationEntry>) =>
    set({ certifications: value.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  const removeCert = (id: string) =>
    set({ certifications: value.certifications.filter((c) => c.id !== id) });

  const [skillInput, setSkillInput] = useState('');
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !value.skills.includes(s)) set({ skills: [...value.skills, s] });
    setSkillInput('');
  };
  const removeSkill = (skill: string) =>
    set({ skills: value.skills.filter((s) => s !== skill) });

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="label">Full Name *</label>
        <input
          className="input"
          value={value.name}
          onChange={(e) => set({ name: e.target.value })}
          placeholder="Jane Smith"
        />
      </div>

      {/* Contact */}
      <div>
        <SectionHeader title="Contact Information" open={sections.contact} toggle={() => toggle('contact')} />
        {sections.contact && (
          <div className="grid grid-cols-2 gap-3 pt-3">
            <div>
              <label className="label">Email *</label>
              <input className="input" value={value.contact.email} onChange={(e) => setContact({ email: e.target.value })} placeholder="jane@example.com" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={value.contact.phone} onChange={(e) => setContact({ phone: e.target.value })} placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" value={value.contact.location} onChange={(e) => setContact({ location: e.target.value })} placeholder="San Francisco, CA" />
            </div>
            <div>
              <label className="label">LinkedIn URL</label>
              <input className="input" value={value.contact.linkedin || ''} onChange={(e) => setContact({ linkedin: e.target.value })} placeholder="linkedin.com/in/janesmith" />
            </div>
            <div>
              <label className="label">GitHub URL</label>
              <input className="input" value={value.contact.github || ''} onChange={(e) => setContact({ github: e.target.value })} placeholder="github.com/janesmith" />
            </div>
            <div>
              <label className="label">Website</label>
              <input className="input" value={value.contact.website || ''} onChange={(e) => setContact({ website: e.target.value })} placeholder="janesmith.dev" />
            </div>
          </div>
        )}
      </div>

      {/* Summary */}
      <div>
        <SectionHeader title="Professional Summary" open={sections.summary} toggle={() => toggle('summary')} />
        {sections.summary && (
          <div className="pt-3">
            <textarea
              className="input resize-none"
              rows={4}
              value={value.summary}
              onChange={(e) => set({ summary: e.target.value })}
              placeholder="Write a compelling 2-3 sentence summary of your professional background and key strengths..."
            />
          </div>
        )}
      </div>

      {/* Skills */}
      <div>
        <SectionHeader title="Skills" open={sections.skills} toggle={() => toggle('skills')} />
        {sections.skills && (
          <div className="pt-3 space-y-2">
            <div className="flex gap-2">
              <input
                className="input flex-1"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }}
                placeholder="Type a skill and press Enter"
              />
              <button type="button" onClick={addSkill} className="btn-secondary whitespace-nowrap">
                Add
              </button>
            </div>
            {value.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {value.skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-sm px-2.5 py-1 rounded-full">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="hover:text-primary-900 ml-0.5">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Experience */}
      <div>
        <SectionHeader title="Work Experience" open={sections.experience} toggle={() => toggle('experience')} />
        {sections.experience && (
          <div className="pt-3 space-y-4">
            {value.experience.map((exp, idx) => (
              <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Experience {idx + 1}</span>
                  <button type="button" onClick={() => removeExp(exp.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Company *</label>
                    <input className="input" value={exp.company} onChange={(e) => updateExp(exp.id, { company: e.target.value })} placeholder="Acme Corp" />
                  </div>
                  <div>
                    <label className="label">Job Title *</label>
                    <input className="input" value={exp.title} onChange={(e) => updateExp(exp.id, { title: e.target.value })} placeholder="Software Engineer" />
                  </div>
                  <div>
                    <label className="label">Start Date</label>
                    <input className="input" value={exp.startDate} onChange={(e) => updateExp(exp.id, { startDate: e.target.value })} placeholder="Jan 2022" />
                  </div>
                  <div>
                    <label className="label">End Date</label>
                    <div className="space-y-1">
                      <input className="input" value={exp.endDate} onChange={(e) => updateExp(exp.id, { endDate: e.target.value })} placeholder="Dec 2024" disabled={exp.current} />
                      <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={exp.current} onChange={(e) => updateExp(exp.id, { current: e.target.checked, endDate: e.target.checked ? '' : exp.endDate })} />
                        Currently working here
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="label">Responsibilities & Achievements</label>
                  <textarea
                    className="input resize-none"
                    rows={4}
                    value={exp.description}
                    onChange={(e) => updateExp(exp.id, { description: e.target.value })}
                    placeholder="Each line becomes a bullet point. Start with strong action verbs:&#10;Led a team of 5 engineers to deliver X&#10;Increased performance by 40% through Y&#10;Built and deployed Z using React and Node.js"
                  />
                  <p className="text-xs text-gray-400 mt-1">Each line = one bullet point</p>
                </div>
              </div>
            ))}
            <button type="button" onClick={addExp} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 flex items-center justify-center gap-2 transition-colors">
              <Plus size={16} /> Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div>
        <SectionHeader title="Education" open={sections.education} toggle={() => toggle('education')} />
        {sections.education && (
          <div className="pt-3 space-y-4">
            {value.education.map((edu, idx) => (
              <div key={edu.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Education {idx + 1}</span>
                  <button type="button" onClick={() => removeEdu(edu.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="label">School / University</label>
                    <input className="input" value={edu.school} onChange={(e) => updateEdu(edu.id, { school: e.target.value })} placeholder="Massachusetts Institute of Technology" />
                  </div>
                  <div>
                    <label className="label">Degree</label>
                    <input className="input" value={edu.degree} onChange={(e) => updateEdu(edu.id, { degree: e.target.value })} placeholder="Bachelor of Science" />
                  </div>
                  <div>
                    <label className="label">Field of Study</label>
                    <input className="input" value={edu.field} onChange={(e) => updateEdu(edu.id, { field: e.target.value })} placeholder="Computer Science" />
                  </div>
                  <div>
                    <label className="label">Start Year</label>
                    <input className="input" value={edu.startDate} onChange={(e) => updateEdu(edu.id, { startDate: e.target.value })} placeholder="2018" />
                  </div>
                  <div>
                    <label className="label">End Year</label>
                    <input className="input" value={edu.endDate} onChange={(e) => updateEdu(edu.id, { endDate: e.target.value })} placeholder="2022" />
                  </div>
                  <div>
                    <label className="label">GPA (optional)</label>
                    <input className="input" value={edu.gpa || ''} onChange={(e) => updateEdu(edu.id, { gpa: e.target.value })} placeholder="3.8" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addEdu} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 flex items-center justify-center gap-2 transition-colors">
              <Plus size={16} /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* Projects */}
      <div>
        <SectionHeader title="Projects (optional)" open={sections.projects} toggle={() => toggle('projects')} />
        {sections.projects && (
          <div className="pt-3 space-y-4">
            {value.projects.map((proj, idx) => (
              <div key={proj.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Project {idx + 1}</span>
                  <button type="button" onClick={() => removeProj(proj.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="label">Project Name</label>
                    <input className="input" value={proj.name} onChange={(e) => updateProj(proj.id, { name: e.target.value })} placeholder="E-Commerce Platform" />
                  </div>
                  <div className="col-span-2">
                    <label className="label">Description</label>
                    <textarea className="input resize-none" rows={2} value={proj.description} onChange={(e) => updateProj(proj.id, { description: e.target.value })} placeholder="Brief description of the project and your contributions..." />
                  </div>
                  <div>
                    <label className="label">Technologies Used</label>
                    <input className="input" value={proj.technologies} onChange={(e) => updateProj(proj.id, { technologies: e.target.value })} placeholder="React, Node.js, PostgreSQL" />
                  </div>
                  <div>
                    <label className="label">Link (optional)</label>
                    <input className="input" value={proj.link || ''} onChange={(e) => updateProj(proj.id, { link: e.target.value })} placeholder="github.com/you/project" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addProj} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 flex items-center justify-center gap-2 transition-colors">
              <Plus size={16} /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* Certifications */}
      <div>
        <SectionHeader title="Certifications (optional)" open={sections.certifications} toggle={() => toggle('certifications')} />
        {sections.certifications && (
          <div className="pt-3 space-y-4">
            {value.certifications.map((cert, idx) => (
              <div key={cert.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Certification {idx + 1}</span>
                  <button type="button" onClick={() => removeCert(cert.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={15} />
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="label">Certification Name</label>
                    <input className="input" value={cert.name} onChange={(e) => updateCert(cert.id, { name: e.target.value })} placeholder="AWS Solutions Architect" />
                  </div>
                  <div>
                    <label className="label">Issuing Organization</label>
                    <input className="input" value={cert.issuer} onChange={(e) => updateCert(cert.id, { issuer: e.target.value })} placeholder="Amazon Web Services" />
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input className="input" value={cert.date} onChange={(e) => updateCert(cert.id, { date: e.target.value })} placeholder="Mar 2024" />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addCert} className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 flex items-center justify-center gap-2 transition-colors">
              <Plus size={16} /> Add Certification
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
