import Link from 'next/link';
import { Zap } from 'lucide-react';

export const metadata = { title: 'Privacy Policy – VicksResume' };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg"><Zap size={18} /></div>
          <span className="font-bold text-gray-900 text-lg">VicksResume</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 20, 2025</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
            <p>We collect information you provide directly to us when you create an account, including your name, email address, and password. We also collect resume content and job descriptions you submit when using our tailoring service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To provide and operate the VicksResume service</li>
              <li>To generate AI-tailored resumes using your resume data and job descriptions</li>
              <li>To send transactional emails such as password reset links</li>
              <li>To process payments and manage your subscription via Stripe</li>
              <li>To improve our service and fix issues</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Data Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We share data only with service providers necessary to operate our service:</p>
            <ul className="list-disc pl-5 space-y-2 mt-2">
              <li><strong>Anthropic</strong> — your resume and job description are sent to Claude AI to generate tailored content. Anthropic's privacy policy applies to this processing.</li>
              <li><strong>Stripe</strong> — payment information is handled directly by Stripe. We never store your card details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Data Retention</h2>
            <p>Tailored resume history is automatically deleted after 7 days. Your account data is retained until you delete your account. You may request deletion of your data at any time by contacting us.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Security</h2>
            <p>We use industry-standard security practices including bcrypt password hashing, HTTPS encryption, and secure HTTP-only cookies for authentication. No method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
            <p>We use a single HTTP-only authentication cookie to keep you logged in. We do not use tracking cookies or third-party advertising cookies.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at the email below. You may also cancel your subscription and delete your account at any time.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website or sending an email to your registered address.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Contact Us</h2>
            <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:p.rahul434@gmail.com" className="text-primary-600 hover:underline">p.rahul434@gmail.com</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">← Back to home</Link>
        </div>
      </main>
    </div>
  );
}
