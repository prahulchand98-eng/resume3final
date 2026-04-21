import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';
import { generateDocx } from '@/lib/docx-generator';
import { ResumeData } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { resume, format } = await req.json() as { resume: ResumeData; format: string };

  if (!resume) {
    return NextResponse.json({ error: 'Resume data is required' }, { status: 400 });
  }

  if (format === 'docx') {
    const buffer = await generateDocx(resume);
    const filename = `${(resume.name || 'resume').replace(/\s+/g, '_')}_tailored.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    });
  }

  return NextResponse.json({ error: 'Invalid format. Use "docx".' }, { status: 400 });
}
