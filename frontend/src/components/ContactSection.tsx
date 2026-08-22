'use client';

import React, { useState } from 'react';
import { sendContactMessage } from '@/lib/api';
import { Mail, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);

    try {
      const res = await sendContactMessage(formData);
      setStatusMsg({ type: 'success', text: res.message || 'Message submitted successfully!' });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Failed to send message. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-800/60">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Info */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-blue-400">GET IN TOUCH</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Let&apos;s Connect
            </h2>
          </div>

          <p className="text-base text-gray-300 leading-relaxed">
            Have a project in mind, a backend development opportunity, or want to discuss Spring Boot architecture? Send me a message and I&apos;ll get back to you promptly.
          </p>

          <div className="glass-panel p-6 rounded-2xl border border-gray-800 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">Email Address</p>
                <p className="text-sm font-semibold text-white">keval.sheth@example.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7 glass-panel p-8 rounded-2xl border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {statusMsg && (
              <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-semibold ${
                statusMsg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'
              }`}>
                {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <span>{statusMsg.text}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Your Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Project Inquiry / Job Opportunity"
                className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-1.5">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 text-sm transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
            >
              {loading ? 'Sending Message...' : (
                <>
                  Send Message <Send className="w-4 h-4" />
                </>
              )}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
