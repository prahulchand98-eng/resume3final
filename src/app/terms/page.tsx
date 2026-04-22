import Link from 'next/link';
import { Zap } from 'lucide-react';

export const metadata = { title: 'Terms of Service – VicksResume' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg"><Zap size={18} /></div>
          <span className="font-bold text-gray-900 text-lg">VicksResume</span>
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: April 20, 2025</p>

        <div className="space-y-8 text-gray-600 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
            <p>By creating an account or using VicksResume, you agree to these Terms of Service. If you do not agree, do not use the service.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Description of Service</h2>
            <p>VicksResume is an AI-powered resume tailoring service. You provide a resume and a job description, and our service generates a tailored version of your resume to better match the job requirements. The service is provided "as is" and results may vary.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">3. User Accounts</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>You must be at least 16 years old to use this service.</li>
              <li>You are responsible for maintaining the security of your account and password.</li>
              <li>You must provide accurate and complete information when creating your account.</li>
              <li>You are responsible for all activity that occurs under your account.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Credits and Subscriptions</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Free accounts receive 3 credits at signup. Each AI-tailored resume generation uses 1 credit.</li>
              <li>Paid subscriptions are billed monthly and credits reset on each billing cycle.</li>
              <li>Unused credits do not roll over to the next billing period.</li>
              <li>You may cancel your subscription at any time. Access continues until the end of the current billing period.</li>
              <li>We do not offer refunds for partially used credit periods unless required by law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Acceptable Use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Use the service for any unlawful purpose or in violation of any regulations</li>
              <li>Submit false, misleading, or fraudulent information</li>
              <li>Attempt to reverse engineer, scrape, or abuse the service</li>
              <li>Share your account credentials with others</li>
              <li>Use automated tools to make requests beyond normal usage</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Your Content</h2>
            <p>You retain ownership of all resume content and data you submit. By using the service, you grant us a limited license to process your content solely for the purpose of providing the tailoring service. We do not use your resume data to train AI models.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Disclaimer of Warranties</h2>
            <p>VicksResume is provided "as is" without warranties of any kind. We do not guarantee that using our service will result in job interviews, employment, or any specific outcome. AI-generated content should be reviewed by you before submission.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Limitation of Liability</h2>
            <p>To the fullest extent permitted by law, VicksResume shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability to you shall not exceed the amount you paid us in the past 3 months.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Changes to Terms</h2>
            <p>We may update these Terms at any time. Continued use of the service after changes constitutes acceptance of the new Terms. We will notify users of significant changes via email.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Contact</h2>
            <p>Questions about these Terms? Contact us at <a href="mailto:p.rahul434@gmail.com" className="text-primary-600 hover:underline">p.rahul434@gmail.com</a>.</p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/" className="text-primary-600 hover:text-primary-700 text-sm font-medium">← Back to home</Link>
        </div>
      </main>
    </div>
  );
}
