import React, { useState } from 'react';
import { AvalonLogo } from '../components/common/AvalonLogo';
import { InteractiveBackground } from '../components/common/InteractiveBackground';
import { InteractiveCursor } from '../components/common/InteractiveCursor';
import {
  Mail,
  Building2,
  Clock,
  Send,
  CheckCircle2,
  ArrowLeft,
  Sun,
  Moon,
  MessageSquare,
  ShieldCheck,
  Globe,
  Sparkles,
} from 'lucide-react';
import { sanitizeHtml } from '../utils/security';

interface Props {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateToHome: () => void;
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
}

export const ContactPage: React.FC<Props> = ({
  isDark,
  onToggleTheme,
  onNavigateToHome,
  onNavigateToLogin,
  onNavigateToSignUp,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [inquiryType, setInquiryType] = useState('enterprise');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTicketId(`AVL-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 600);
  };

  return (
    <div className="relative min-h-screen bg-[#f4f6fa] dark:bg-[#07090e] text-[#0f172a] dark:text-[#f8fafc] font-sans selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors flex flex-col justify-between overflow-x-hidden">
      <InteractiveBackground isDark={isDark} />
      <InteractiveCursor />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#f4f6fa]/75 dark:bg-[#07090e]/75 backdrop-blur-xl border-b border-slate-200/70 dark:border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={onNavigateToHome}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <AvalonLogo size="md" />
            </button>

            <button
              onClick={onNavigateToHome}
              className="hidden sm:flex items-center gap-1.5 text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Overview</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
              title="Toggle Light / Dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            <button
              onClick={onNavigateToLogin}
              className="px-3.5 py-1.5 text-[13px] font-medium text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-full transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={onNavigateToSignUp}
              className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[13px] font-semibold hover:opacity-90 transition-opacity shadow-xs"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info & Value Props */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 text-[12px] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>Enterprise & Support Desk</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
                Let's discuss your workflow requirements
              </h1>
              <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether you are evaluating multi-team workspace migration, custom video pipelines, or need assistance with your organization, our solutions engineers are ready to assist.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-[13px]">
              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <Clock className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Rapid Response SLA</div>
                  <div className="text-slate-600 dark:text-slate-400 text-[12px] mt-0.5">
                    Guaranteed response within 2 business hours for enterprise and trial inquiries.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <Mail className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Direct Email Inquiries</div>
                  <div className="text-slate-600 dark:text-slate-400 text-[12px] mt-0.5 font-mono">
                    sales@avalon.io • support@avalon.io
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Security & Compliance</div>
                  <div className="text-slate-600 dark:text-slate-400 text-[12px] mt-0.5">
                    Request custom NDAs, SOC2 compliance documentation, or private VPC deployment options.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8">
              {isSubmitted ? (
                <div className="py-10 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                    Message Received
                  </h3>
                  <p className="text-[13px] text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Thank you, <span className="font-semibold">{name}</span>. Your inquiry ticket <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">#{ticketId}</span> has been dispatched to our engineering team. We will respond to <span className="font-mono text-slate-800 dark:text-slate-200">{email}</span> within 2 business hours.
                  </p>
                  <div className="pt-4">
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setName('');
                        setEmail('');
                        setCompany('');
                        setMessage('');
                      }}
                      className="px-5 py-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[13px] font-semibold hover:opacity-90 transition-opacity"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                    Send us an inquiry
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Jordan Mitchell"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Work Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Organization / Company
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Apex Post Studios"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Inquiry Topic
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                      >
                        <option value="enterprise">Enterprise Workspace & Volume Pricing</option>
                        <option value="support">Technical & Video Directives Support</option>
                        <option value="security">Security, RBAC & Custom Hosting Audit</option>
                        <option value="partnership">Partner or Creative Studio Integration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Message Details *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your team size, current bottlenecks, or questions..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 shadow-xs"
                  >
                    {isSubmitting ? (
                      <span>Dispatching message...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-slate-500 dark:text-slate-400">
          <div>
            © 2026 Avalon Systems Inc. All rights reserved.
          </div>
          <div className="font-medium text-slate-600 dark:text-slate-300">
            Made with love by - TheSocialAxis
          </div>
        </div>
      </footer>
    </div>
  );
};
