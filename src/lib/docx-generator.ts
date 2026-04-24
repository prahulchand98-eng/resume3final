import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  ShadingType,
} from 'docx';
import { ResumeData } from './types';

function sectionHeader(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 22,
        color: '4338CA',
      }),
    ],
    border: {
      bottom: {
        color: '4338CA',
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    spacing: { before: 240, after: 80 },
  });
}

export async function generateDocx(resume: ResumeData): Promise<Buffer> {
  const children: Paragraph[] = [];

  // Name
  children.push(
    new Paragraph({
      children: [
        new TextRun({
          text: resume.name || 'Your Name',
          bold: true,
          size: 48,
          color: '1E1B4B',
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 },
    })
  );

  // Contact info
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
        children: [
          new TextRun({
            text: contactParts.join('  |  '),
            size: 18,
            color: '4B5563',
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );
  }

  // Summary
  if (resume.summary) {
    children.push(sectionHeader('Summary'));
    children.push(
      new Paragraph({
        children: [new TextRun({ text: resume.summary, size: 20 })],
        spacing: { after: 120 },
      })
    );
  }

  // Skills
  if (resume.skills.length > 0) {
    children.push(sectionHeader('Skills'));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.skills.join(' • '),
            size: 20,
          }),
        ],
        spacing: { after: 120 },
      })
    );
  }

  // Experience
  if (resume.experience.length > 0) {
    children.push(sectionHeader('Experience'));
    for (const exp of resume.experience) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.company, bold: true, size: 22 }),
            new TextRun({ text: `  —  ${exp.title}`, size: 22 }),
            ...(exp.location ? [new TextRun({ text: `  |  ${exp.location}`, size: 22, color: '6B7280' })] : []),
          ],
          spacing: { before: 120, after: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.startDate} – ${exp.current ? 'Present' : exp.endDate}`,
              italics: true,
              size: 18,
              color: '6B7280',
            }),
          ],
          spacing: { after: 60 },
        })
      );
      const bullets = exp.description.split('\n').filter((b) => b.trim());
      for (const bullet of bullets) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: bullet.trim(), size: 20 })],
            bullet: { level: 0 },
            spacing: { after: 40 },
          })
        );
      }
    }
  }

  // Education
  if (resume.education.length > 0) {
    children.push(sectionHeader('Education'));
    for (const edu of resume.education) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: edu.school, bold: true, size: 22 }),
            new TextRun({
              text: `  —  ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
              size: 22,
            }),
          ],
          spacing: { before: 120, after: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.startDate} – ${edu.endDate}${edu.gpa ? `  |  GPA: ${edu.gpa}` : ''}`,
              italics: true,
              size: 18,
              color: '6B7280',
            }),
          ],
          spacing: { after: 80 },
        })
      );
    }
  }

  // Projects
  if (resume.projects.length > 0) {
    children.push(sectionHeader('Projects'));
    for (const proj of resume.projects) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: proj.name, bold: true, size: 22 })],
          spacing: { before: 120, after: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [new TextRun({ text: proj.description, size: 20 })],
          spacing: { after: 40 },
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: 'Technologies: ', bold: true, size: 20 }),
            new TextRun({ text: proj.technologies, size: 20 }),
          ],
          spacing: { after: 80 },
        })
      );
    }
  }

  // Certifications
  if (resume.certifications.length > 0) {
    children.push(sectionHeader('Certifications'));
    for (const cert of resume.certifications) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true, size: 22 }),
            new TextRun({
              text: `  —  ${cert.issuer}${cert.date ? `, ${cert.date}` : ''}`,
              size: 22,
            }),
          ],
          spacing: { before: 80, after: 80 },
        })
      );
    }
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 900, right: 900 },
          },
        },
        children,
      },
    ],
  });

  return Buffer.from(await Packer.toBuffer(doc));
}
