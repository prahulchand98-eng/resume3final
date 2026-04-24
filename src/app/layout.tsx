import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title:       'VicksResume – AI-Powered Resume Tailoring',
  description: 'Tailor your resume to any job in 30 seconds. Check your ATS score. Get hired faster. Powered by advanced AI.',
  icons: {
    icon:  [
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title:       'VicksResume – AI-Powered Resume Tailoring',
    description: 'Tailor your resume to any job in 30 seconds and 3× your interview rate.',
    type:        'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
