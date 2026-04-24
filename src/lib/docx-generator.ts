import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { ResumeData } from './types';

export type DocxTemplate = 'classic' | 'minimal' | 'ats-clean' | 'ats-modern';

// ─── Section header styles per template ──────────────────────────────────────

function sectionHeader(text: string, t: DocxTemplate): Paragraph {
  switch (t) {
    case 'minimal':
      return new Paragraph({
        children: [new TextRun({ text: text.toUpperCase(), size: 16, color: '9CA3AF', characterSpacing: 150 })],
        spacing: { before: 220, after: 60 },
      });
    case 'ats-clean':
      return new Paragraph({
        children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20, color: '000000' })],
        border: { bottom: { color: '000000', style: BorderStyle.SINGLE, size: 8 } },
        spacing: { before: 240, after: 80 },
      });
    case 'ats-modern':
      return new Paragraph({
        children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 20, color: '1D4ED8' })],
        border: { bottom: { color: '93C5FD', style: BorderStyle.SINGLE, size: 4 } },
        spacing: { before: 240, after: 80 },
      });
    default: // classic
      return new Paragraph({
        children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: '4338CA' })],
        border: { bottom: { color: '4338CA', style: BorderStyle.SINGLE, size: 6 } },
        spacing: { before: 240, after: 80 },
      });
  }
}

// ─── Name / contact header per template ──────────────────────────────────────

function nameHeader(name: string, t: DocxTemplate): Paragraph {
  switch (t) {
    case 'minimal':
      return new Paragraph({
        children: [new TextRun({ text: name || 'Your Name', size: 52, color: '1A1A1A' })],
        alignment: AlignmentType.LEFT,
        spacing: { after: 60 },
      });
    case 'ats-clean':
    case 'ats-modern':
      return new Paragraph({
        children: [new TextRun({ text: name || 'Your Name', bold: true, size: 44, color: '111827' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
      });
    default: // classic
      return new Paragraph({
        children: [new TextRun({ text: name || 'Your Name', bold: true, size: 48, color: '1E1B4B' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 80 },
      });
  }
}

// ─── Main generator ───────────────────────────────────────────────────────────

export async function generateDocx(resume: ResumeData, template: DocxTemplate = 'classic'): Promise<Buffer> {
  const children: Paragraph[] = [];
  const t = template;
  const isAts = t === 'ats-clean' || t === 'ats-modern';
  const textColor = isAts ? '111827' : t === 'minimal' ? '1A1A1A' : '1F2937';
  const subColor = '6B7280';

  // Name
  children.push(nameHeader(resume.name, t));

  // Contact
  const contactParts = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.linkedin,
    resume.contact.github,
    resume.contact.website,
  ].filter(Boolean);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join('  |  '), size: 18, color: subColor })],
        alignment: t === 'minimal' ? AlignmentType.LEFT : AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Summary
  if (resume.summary) {
    children.push(sectionHeader('Summary', t));
    children.push(new Paragraph({
      children: [new TextRun({ text: resume.summary, size: 20, color: textColor })],
      spacing: { after: 120 },
    }));
  }

  // Skills
  if (resume.skills.length > 0) {
    children.push(sectionHeader('Skills', t));
    children.push(new Paragraph({
      children: [new TextRun({ text: resume.skills.join(' • '), size: 20, color: textColor })],
      spacing: { after: 120 },
    }));
  }

  // Experience
  if (resume.experience.length > 0) {
    children.push(sectionHeader('Experience', t));
    for (const exp of resume.experience) {
      const dateStr = `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`;
      children.push(new Paragraph({
        children: [
          new TextRun({ text: exp.company, bold: true, size: 22, color: textColor }),
          new TextRun({ text: `  —  ${exp.title}`, size: 22, color: textColor }),
          ...(exp.location ? [new TextRun({ text: `  |  ${exp.location}`, size: 22, color: subColor })] : []),
        ],
        spacing: { before: 120, after: 40 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: dateStr, italics: true, size: 18, color: subColor })],
        spacing: { after: 60 },
      }));
      for (const bullet of exp.description.split('\n').filter((b) => b.trim())) {
        children.push(new Paragraph({
          children: [new TextRun({ text: bullet.trim(), size: 20, color: textColor })],
          bullet: { level: 0 },
          spacing: { after: 40 },
        }));
      }
    }
  }

  // Education
  if (resume.education.length > 0) {
    children.push(sectionHeader('Education', t));
    for (const edu of resume.education) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: edu.school, bold: true, size: 22, color: textColor }),
          new TextRun({ text: `  —  ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`, size: 22, color: textColor }),
        ],
        spacing: { before: 120, after: 40 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({
          text: `${edu.startDate} – ${edu.endDate}${edu.gpa ? `  |  GPA: ${edu.gpa}` : ''}`,
          italics: true, size: 18, color: subColor,
        })],
        spacing: { after: 80 },
      }));
    }
  }

  // Projects
  if (resume.projects.length > 0) {
    children.push(sectionHeader('Projects', t));
    for (const proj of resume.projects) {
      children.push(new Paragraph({
        children: [new TextRun({ text: proj.name, bold: true, size: 22, color: textColor })],
        spacing: { before: 120, after: 40 },
      }));
      children.push(new Paragraph({
        children: [new TextRun({ text: proj.description, size: 20, color: textColor })],
        spacing: { after: 40 },
      }));
      children.push(new Paragraph({
        children: [
          new TextRun({ text: 'Technologies: ', bold: true, size: 20, color: textColor }),
          new TextRun({ text: proj.technologies, size: 20, color: subColor }),
        ],
        spacing: { after: 80 },
      }));
    }
  }

  // Certifications
  if (resume.certifications.length > 0) {
    children.push(sectionHeader('Certifications', t));
    for (const cert of resume.certifications) {
      children.push(new Paragraph({
        children: [
          new TextRun({ text: cert.name, bold: true, size: 22, color: textColor }),
          new TextRun({ text: `  —  ${cert.issuer}${cert.date ? `, ${cert.date}` : ''}`, size: 22, color: subColor }),
        ],
        spacing: { before: 80, after: 80 },
      }));
    }
  }

  const doc = new Document({
    sections: [{
      properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
      children,
    }],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
