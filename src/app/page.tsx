import Link from 'next/link';
import { Zap, FileText, Download, Clock, Star, CheckCircle, ArrowRight } from 'lucide-react';
import Footer from '@/components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 text-white p-1.5 rounded-lg">
              <Zap size={18} />
            </div>
            <span className="font-bold text-gray-900 text-lg">VicksResume</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5">Login</Link>
            <Link href="/signup" className="text-sm bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium">
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-4 py-2 rounded-full mb-6 border border-primary-200">
            <Star size={14} />
            3 free tailored resumes — no credit card required
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Land More Interviews with{' '}
            <span className="text-primary-600">AI-Tailored</span> Resumes
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Paste any job description and get a perfectly tailored resume in 30 seconds. Powered by Claude AI — the most advanced language model available.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200">
              Start Tailoring Free
              <ArrowRight size={20} />
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl font-semibold text-lg hover:border-gray-400 transition-colors">
              Sign In
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">No credit card • 3 free resumes • Cancel anytime</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">How it works</h2>
          <p className="text-center text-gray-500 mb-12">Three simple steps to a perfectly tailored resume</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: FileText, title: 'Paste the Job Description', desc: 'Copy any job listing and paste it in. Our AI reads every requirement and keyword.' },
              { step: '2', icon: Zap, title: 'AI Tailors Your Resume', desc: 'Claude AI rewrites your resume to highlight the most relevant experience and match key skills.' },
              { step: '3', icon: Download, title: 'Download & Apply', desc: 'Get your tailored resume as Word or PDF, edit any section inline, then submit with confidence.' },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div key={step} className="text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon size={28} className="text-primary-600" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-primary-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">Everything you need</h2>
          <p className="text-center text-gray-500 mb-12">Built for job seekers who want results</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: 'Resume Builder', desc: 'Build your master resume with our structured form. Save it and reuse it for every application.' },
              { icon: Star, title: 'Saved Resumes', desc: 'Save multiple resume versions. Set a default that auto-loads when creating new tailored resumes.' },
              { icon: Clock, title: '7-Day History', desc: 'Every tailored resume is automatically saved for 7 days. Preview or re-download anytime.' },
              { icon: Download, title: 'Word & PDF Export', desc: 'Download as a professionally formatted .docx file or use your browser to save as PDF.' },
              { icon: Zap, title: 'Inline Editing', desc: 'Review your AI-tailored resume and edit any section with a single click before downloading.' },
              { icon: CheckCircle, title: 'ATS Optimized', desc: 'Our AI focuses on keywords and formatting that pass Applicant Tracking Systems.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 p-5 rounded-xl border border-gray-200 hover:border-primary-200 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center shrink-0">
                  <Icon size={20} className="text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Simple pricing</h2>
          <p className="text-gray-500 mb-10">Start free. Upgrade when you need more resumes.</p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { plan: 'Basic', price: '$9.99', credits: '50 resumes/mo', highlight: false },
              { plan: 'Pro', price: '$24.99', credits: '150 resumes/mo', highlight: true },
              { plan: 'Premium', price: '$35.99', credits: '800 resumes/mo', highlight: false },
            ].map(({ plan, price, credits, highlight }) => (
              <div key={plan} className={`rounded-xl p-6 border-2 ${highlight ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}`}>
                <h3 className={`font-bold text-lg mb-1 ${highlight ? 'text-primary-700' : 'text-gray-900'}`}>{plan}</h3>
                <p className="text-3xl font-extrabold text-gray-900 mb-1">{price}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                <p className="text-sm text-gray-500">{credits}</p>
              </div>
            ))}
          </div>
          <Link href="/pricing" className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700">
            View full pricing details <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-primary-700">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to land your next interview?</h2>
          <p className="text-primary-200 mb-8">Join thousands of job seekers using AI to stand out from the crowd.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-xl font-bold text-lg hover:bg-primary-50 transition-colors">
            Get 3 Free Resumes
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
