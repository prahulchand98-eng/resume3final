'use client';

import Link from 'next/link';
import { Zap, Mail, MessageSquare, Clock } from 'lucide-react';
import { useState } from 'react';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Submit as a suggestion so it shows in admin panel
    await fetch('/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `[CONTACT] From: ${form.name} (${form.email})\nSubject: ${form.subject}\n\n${form.message}` }),
    });
    setSent(true);
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-200 bg-white h-16 flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary-600 text-white p-1.5 rounded-lg"><Zap size={18} /></div>
          <span className="font-bold text-gray-900 text-lg">VicksResume</span>
        </Link>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h1>
          <p className="text-gray-500 text-lg">We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Info */}
          <div className="space-y-6">
            {[
              { icon: Mail, title: 'Email', text: 'support@vicksresume.com', sub: 'We reply within 24 hours' },
              { icon: MessageSquare, title: 'Feedback', text: 'Use the form', sub: 'Or the suggestion box in your dashboard' },
              { icon: Clock, title: 'Response Time', text: '< 24 hours', sub: 'Monday – Friday' },
            ].map(({ icon: Icon, title, text, sub }) => (
              <div key={title} className="flex gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-sm text-gray-700">{text}</p>
                  <p className="text-xs text-gray-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <div className="md:col-span-2">
            {sent ? (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-10 text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-bold text-gray-900 text-lg mb-1">Message received!</h3>
                <p className="text-gray-500 text-sm">We&apos;ll get back to you within 24 hours.</p>
                <button onClick={() => setSent(false)} className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium">Send another message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Your Name</label>
                    <input required type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Subject</label>
                  <input required type="text" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="How can we help?" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" placeholder="Tell us more..." />
                </div>
                <button type="submit" disabled={sending} className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
