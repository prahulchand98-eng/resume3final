import { NextRequest, NextResponse } from 'next/server';
import { getRequestUser } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await getRequestUser(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large. Maximum 5MB allowed.' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mimeType = file.type;
  let text = '';

  try {
    if (mimeType === 'application/pdf') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse');
      const result = await pdfParse(buffer);
      text = result.text;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.name.endsWith('.docx')
    ) {
      const mammoth = await import('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload PDF or DOCX.' },
        { status: 400 }
      );
    }
  } catch (err) {
    console.error('File parsing error:', err);
    return NextResponse.json({ error: 'Failed to parse file. Please try a different file.' }, { status: 500 });
  }

  if (!text.trim()) {
    return NextResponse.json({ error: 'Could not extract text from file.' }, { status: 400 });
  }

  return NextResponse.json({ text: text.trim() });
}
