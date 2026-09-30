import React, { useState } from 'react';
import { User, SiteContent } from '../types';
import { AvalonLogo } from '../components/common/AvalonLogo';
import { InteractiveBackground } from '../components/common/InteractiveBackground';
import { InteractiveCursor } from '../components/common/InteractiveCursor';
import {
  Sun,
  Moon,
  ArrowRight,
  Video,
  Layers,
  ShieldCheck,
  Zap,
  Lock,
  Play,
  Calendar,
  Sparkles,
  Building2,
  Users,
  CheckCircle2,
  FolderGit2,
  Mail,
} from 'lucide-react';

interface Props {
  siteContent: SiteContent;
  currentUser: User | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigateToLogin: () => void;
  onNavigateToSignUp: () => void;
  onNavigateToContact: () => void;
}

export const HomePage: React.FC<Props> = ({
  siteContent,
  currentUser,
  isDark,
  onToggleTheme,
  onNavigateToLogin,
  onNavigateToSignUp,
  onNavigateToContact,
}) => {
  const [activeTourTab, setActiveTourTab] = useState<'video' | 'views' | 'approvals' | 'offline'>('video');

  return (
    <div className="relative min-h-screen bg-[#f4f6fa] dark:bg-[#090a0f] text-[#0f172a] dark:text-[#f8fafc] font-sans selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors overflow-x-hidden">
      {/* Interactive Constellation Particle Canvas & Smooth Follower */}
      <InteractiveBackground isDark={isDark} />
      <InteractiveCursor />

      {/* Floating Modern Header (Light Mode Frosted Glass / Dark Mode Obsidian Capsule) */}
      <div className="sticky top-4 z-40 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full transition-all">
        <div className="flex items-center justify-between gap-3">
          {/* Logo Capsule */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-black/85 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-xl text-slate-900 dark:text-white shrink-0 transition-colors">
            <AvalonLogo size="sm" lightText={isDark} />
          </div>

          {/* Center Navigation Capsule */}
          <nav className="hidden lg:flex items-center gap-7 px-7 py-2.5 rounded-full bg-white/90 dark:bg-black/85 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-2xl text-[13px] font-medium text-slate-600 dark:text-slate-300 transition-colors">
            <a href="#tour" className="hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1">
              <span>Solutions</span>
              <span className="text-slate-400 dark:text-slate-500 font-light text-[14px]">+</span>
            </a>
            <a href="#tour" className="hover:text-slate-950 dark:hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#architecture" className="hover:text-slate-950 dark:hover:text-white transition-colors flex items-center gap-1">
              <span>Architecture</span>
              <span className="text-slate-400 dark:text-slate-500 font-light text-[14px]">+</span>
            </a>
            <a href="#architecture" className="hover:text-slate-950 dark:hover:text-white transition-colors">
              Security
            </a>
            <button
              onClick={onNavigateToContact}
              className="hover:text-slate-950 dark:hover:text-white transition-colors text-left flex items-center gap-1 cursor-pointer"
            >
              <span>Company</span>
              <span className="text-slate-400 dark:text-slate-500 font-light text-[14px]">+</span>
            </button>
            <button
              onClick={onNavigateToContact}
              className="hover:text-slate-950 dark:hover:text-white transition-colors text-left cursor-pointer"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-full bg-white/90 dark:bg-black/85 border border-slate-200/90 dark:border-white/10 backdrop-blur-xl text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white shadow-md dark:shadow-xl transition-colors cursor-pointer"
              title="Toggle Light / Dark mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600 hover:text-indigo-600" />}
            </button>

            <button
              onClick={onNavigateToLogin}
              className="px-4 py-2 rounded-full bg-white/90 dark:bg-black/85 border border-slate-200/90 dark:border-white/10 backdrop-blur-xl text-[13px] font-medium text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white shadow-md dark:shadow-xl transition-colors cursor-pointer"
            >
              Sign In
            </button>

            {/* Get Started CTA */}
            <button
              onClick={onNavigateToSignUp}
              className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 border border-indigo-600/30 dark:border-white/20 backdrop-blur-xl font-semibold text-[13px] flex items-center gap-1.5 shadow-md shadow-indigo-600/20 dark:shadow-white/10 transition-all cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 pb-20 sm:pt-24 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Transparent Container without Notion or Asana */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-transparent border border-slate-400/40 dark:border-white/15 text-slate-800 dark:text-slate-200 text-[12px] font-medium mb-6 backdrop-blur-xs">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Avalon WorkOS 2026 / Next-Generation Creative Architecture</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-950 dark:text-white max-w-5xl mx-auto leading-[1.12]">
          {siteContent.heroHeadline}
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          {siteContent.heroSubtitle}
        </p>

        {/* Primary CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNavigateToSignUp}
            className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[14px] font-semibold hover:opacity-90 shadow-sm transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Create Team Workspace</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onNavigateToLogin}
            className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 rounded-full text-[14px] font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
          >
            Sign In to Workspace
          </button>
        </div>

        {/* Feature Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-[12px] text-slate-600 dark:text-slate-400 font-medium">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Hyperlinked Video Timestamp Directives
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Multi-Tenant Data Isolation
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            6 Advanced Database Perspectives
          </span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Offline Resilience & Clipboard Pasting
          </span>
        </div>
      </section>

      {/* Interactive Tour Section */}
      <section id="tour" className="relative z-10 py-16 bg-slate-200/40 dark:bg-slate-950/40 border-y border-slate-200/80 dark:border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
              Engineered for High-Velocity Creative Execution
            </h2>
            <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">
              Explore the core functional pillars of the Avalon platform.
            </p>
          </div>

          {/* Tour Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveTourTab('video')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all ${
                activeTourTab === 'video'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Video Directives & Timestamps</span>
            </button>

            <button
              onClick={() => setActiveTourTab('views')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all ${
                activeTourTab === 'views'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>6 Database Views</span>
            </button>

            <button
              onClick={() => setActiveTourTab('approvals')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all ${
                activeTourTab === 'approvals'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Executive Sign-Offs</span>
            </button>

            <button
              onClick={() => setActiveTourTab('offline')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-semibold transition-all ${
                activeTourTab === 'offline'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Offline Resilience</span>
            </button>
          </div>

          {/* Interactive Preview Container */}
          <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8">
            {activeTourTab === 'video' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold uppercase tracking-wider">
                    Video Directives Workflow
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {siteContent.feature1Title}
                  </h3>
                  <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {siteContent.feature1Desc}
                  </p>

                  <ul className="space-y-2 text-[13px] text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Direct timecode jump (e.g. 0:00 - 0:15) with video preview overlay
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Video editor checkbox tracking per individual section
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      Supports MP4/WebM direct streaming or Loom/YouTube embed URLs
                    </li>
                  </ul>

                  <button
                    onClick={onNavigateToSignUp}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[13px] font-semibold hover:opacity-90 transition-opacity mt-2 cursor-pointer"
                  >
                    <span>Create Free Workspace to Test Workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-white p-5 shadow-lg space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700" />
                      <span className="text-[12px] font-mono text-slate-400 ml-2">Video Directive Player</span>
                    </div>
                    <span className="text-[11px] font-mono bg-indigo-950 text-indigo-300 px-2.5 py-0.5 rounded-full font-medium">
                      0:00 - 0:15
                    </span>
                  </div>

                  <div className="aspect-video bg-black/80 rounded-lg flex items-center justify-center relative overflow-hidden group">
                    <Play className="w-12 h-12 text-white/90 group-hover:scale-105 transition-transform fill-current z-10" />
                    <div className="absolute bottom-3 left-3 text-[12px] font-mono text-white/90 z-10 flex items-center gap-1.5">
                      <Play className="w-3 h-3 fill-current inline text-indigo-400" />
                      <span>Playing segment: 0:00 - 0:15 [Lead Hook]</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-[12px] space-y-1">
                    <div className="font-semibold text-indigo-400">Director Directive:</div>
                    <p className="text-slate-300">
                      "Fast hook cut: insert dynamic kinetic typography and sound effect on title appearance at 0:04."
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTourTab === 'views' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold uppercase tracking-wider">
                    Custom Database Views
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {siteContent.feature2Title}
                  </h3>
                  <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {siteContent.feature2Desc}
                  </p>

                  <div className="grid grid-cols-2 gap-3 text-[13px]">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <div className="font-semibold text-slate-900 dark:text-white">Kanban Board</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Agile sprint columns & vertical flow</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <div className="font-semibold text-slate-900 dark:text-white">Spreadsheet Table</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Inline cell editing & sorting</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <div className="font-semibold text-slate-900 dark:text-white">Gantt Timeline</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Dependencies & milestones</div>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <div className="font-semibold text-slate-900 dark:text-white">Calendar & Gallery</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Delivery deadlines & cards</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                  <div className="flex items-center justify-between text-[12px] font-semibold pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span>Kanban Sprint Overview</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">12 Tasks Live</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                      <span className="text-[10px] font-medium uppercase text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded">
                        In Progress
                      </span>
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-white">Episode 1 Intro Cut</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Assigned: Sarah Jenkins</div>
                    </div>
                    <div className="p-3.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-xs">
                      <span className="text-[10px] font-medium uppercase text-indigo-700 bg-indigo-50 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded">
                        Ready Sign-Off
                      </span>
                      <div className="text-[13px] font-semibold text-slate-900 dark:text-white">Color Grade Rec.709</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Assigned: Marcus Vance</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTourTab === 'approvals' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-semibold uppercase tracking-wider">
                    Stakeholder Governance
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                    {siteContent.feature3Title}
                  </h3>
                  <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {siteContent.feature3Desc}
                  </p>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-[13px] space-y-2">
                    <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      Executive One-Click Approval Workflow
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-[12px]">
                      Stakeholders receive automated notifications upon task completion and can sign-off or request revisions in a single click.
                    </p>
                  </div>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-[13px]">
                    <ShieldCheck className="w-4 h-4 text-indigo-500" />
                    <span>Executive Sign-Off Pending</span>
                  </div>
                  <p className="text-[12px] text-slate-600 dark:text-slate-300">
                    "YouTube Launch Promo Video - Rough Cut V2 awaits final review from Creative Director."
                  </p>
                  <div className="flex items-center gap-2 pt-2">
                    <button className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[12px] font-semibold shadow-xs">
                      Approve Deliverable
                    </button>
                    <button className="px-4 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full text-[12px] font-medium">
                      Request Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTourTab === 'offline' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[11px] font-semibold uppercase tracking-wider">
                    Zero-Interruption Availability
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                    Offline Resilience & Cross-Platform Sync
                  </h3>
                  <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    Keep working seamlessly without internet connectivity. Changes are queued into local persistent storage and auto-synchronized when back online.
                  </p>
                </div>

                <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-3 font-mono text-[12px]">
                  <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span>Offline Sync Engine</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Active Engine</span>
                  </div>
                  <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    [QUEUE_SYNC_OK] Indexed mutations persisted
                  </div>
                  <div className="p-2.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                    [NETWORK_STATUS] Connected • Zero data packet loss
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enterprise Workspace Architecture Section */}
      <section id="architecture" className="relative z-10 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[12px] font-medium mb-3">
            <Building2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Enterprise Workspace Architecture</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            Built for Multi-Team Creative Operations
          </h2>
          <p className="mt-2 text-[14px] text-slate-600 dark:text-slate-400">
            Autonomous workspaces, granular role-based permissions, and complete data boundary isolation for every production team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Autonomous Workspaces</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Every department or agency team manages dedicated project pipelines, custom fields, and real-time delivery timelines in an isolated environment.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Role-Based Team Collaboration</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Company admins invite team members with tailored access tiers: Project Managers, Video Editors, and Executive Reviewers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-950 dark:text-white">Strict Boundary Isolation</h3>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Strict multi-tenant cryptographic barriers prevent cross-organization leakage. Your briefs, video notes, and comments remain 100% confidential.
            </p>
          </div>
        </div>
      </section>

      {/* Proper Structured Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-slate-200/80 dark:border-slate-800/80">
            {/* Brand Column */}
            <div className="col-span-2 space-y-3">
              <AvalonLogo size="md" />
              <p className="text-[13px] text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
                The unified creative execution OS for video post-production, motion graphics, and multi-team campaign deliverables.
              </p>
              <div className="pt-2">
                <button
                  onClick={onNavigateToContact}
                  className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Get in touch with our team</span>
                </button>
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-2.5 text-[13px]">
              <div className="font-semibold text-slate-900 dark:text-white text-[12px] uppercase tracking-wider">
                Product
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="#tour" className="hover:text-slate-950 dark:hover:text-white transition-colors">Video Directives</a></li>
                <li><a href="#tour" className="hover:text-slate-950 dark:hover:text-white transition-colors">Database Views</a></li>
                <li><a href="#tour" className="hover:text-slate-950 dark:hover:text-white transition-colors">Stakeholder Approvals</a></li>
                <li><a href="#tour" className="hover:text-slate-950 dark:hover:text-white transition-colors">Offline Engine</a></li>
              </ul>
            </div>

            {/* Architecture Column */}
            <div className="space-y-2.5 text-[13px]">
              <div className="font-semibold text-slate-900 dark:text-white text-[12px] uppercase tracking-wider">
                Enterprise
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><a href="#architecture" className="hover:text-slate-950 dark:hover:text-white transition-colors">Workspace Isolation</a></li>
                <li><a href="#architecture" className="hover:text-slate-950 dark:hover:text-white transition-colors">RBAC Governance</a></li>
                <li><a href="#architecture" className="hover:text-slate-950 dark:hover:text-white transition-colors">Security Whitepaper</a></li>
                <li><button onClick={onNavigateToContact} className="hover:text-slate-950 dark:hover:text-white transition-colors">Custom Deployment</button></li>
              </ul>
            </div>

            {/* Company Column */}
            <div className="space-y-2.5 text-[13px]">
              <div className="font-semibold text-slate-900 dark:text-white text-[12px] uppercase tracking-wider">
                Company
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                <li><button onClick={onNavigateToContact} className="hover:text-slate-950 dark:hover:text-white transition-colors">Contact Us</button></li>
                <li><button onClick={onNavigateToSignUp} className="hover:text-slate-950 dark:hover:text-white transition-colors">Create Account</button></li>
                <li><span className="text-slate-400">Privacy Policy</span></li>
                <li><span className="text-slate-400">Terms of Service</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with Requested Credit */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-slate-500 dark:text-slate-400">
            <div>
              © 2026 Avalon Systems Inc. All rights reserved.
            </div>
            <div className="font-medium text-slate-600 dark:text-slate-300">
              Made with love by - TheSocialAxis
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
