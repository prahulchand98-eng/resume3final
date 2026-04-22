import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VicksResume – AI-Powered Resume Tailoring',
  description: 'AI-powered resume tailoring that helps you match any job description in seconds. Powered by VicksResume.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
