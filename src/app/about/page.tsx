import Link from 'next/link';
import { Zap, Target, Users, Award, Heart } from 'lucide-react';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg"><Zap size={18} /></div>
          <span className="font-bold text-gray-900 text-lg">VicksResume</span>
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">About VicksResume</h1>
          <p className="text-gray-500 text-lg leading-relaxed">
            We built VicksResume because we know how frustrating it is to spend hours tailoring your resume
            for every job — only to never hear back. We&apos;re here to change that.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: Target,
              title: 'Our Mission',
              color: 'bg-primary-50 text-primary-600',
              text: 'To give every job seeker — regardless of experience or background — the best possible shot at landing interviews by making professional resume tailoring fast, easy, and affordable.',
            },
            {
              icon: Heart,
              title: 'Why We Built This',
              color: 'bg-red-50 text-red-500',
              text: 'We were frustrated watching talented people get filtered out by ATS systems before a human ever saw their resume. Great candidates deserve better tools.',
            },
            {
              icon: Award,
              title: 'What We Offer',
              color: 'bg-amber-50 text-amber-600',
              text: 'AI-powered resume tailoring that matches your skills to any job description in seconds, plus VicksATS — our in-house scoring engine that tells you exactly how recruiters see your resume.',
            },
            {
              icon: Users,
              title: 'Who We Serve',
              color: 'bg-emerald-50 text-emerald-600',
              text: 'Recent graduates, career changers, experienced professionals, and everyone in between. If you\'re applying for a job, we\'re here for you.',
            },
          ].map(({ icon: Icon, title, color, text }) => (
            <div key={title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-primary-600 to-violet-700 rounded-3xl p-8 text-white text-center">
          <h2 className="text-2xl font-extrabold mb-2">Ready to get started?</h2>
          <p className="text-primary-200 mb-6">3 free tailored resumes. No credit card required.</p>
          <Link
            href="/signup"
            className="inline-block bg-white text-primary-700 font-bold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
