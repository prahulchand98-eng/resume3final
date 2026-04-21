import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ResumeTailor AI – Land More Interviews',
  description: 'AI-powered resume tailoring that helps you match any job description in seconds.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
