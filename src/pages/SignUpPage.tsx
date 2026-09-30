import React, { useState, useEffect } from 'react';
import { User, Organization } from '../types';
import { AvalonLogo } from '../components/common/AvalonLogo';
import { InteractiveBackground } from '../components/common/InteractiveBackground';
import { InteractiveCursor } from '../components/common/InteractiveCursor';
import {
  Lock,
  Mail,
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  Building2,
  User as UserIcon,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Briefcase,
  Users,
  Globe,
  Layers,
} from 'lucide-react';
import { checkRateLimit, resetRateLimit } from '../utils/rateLimiter';
import { sanitizeHtml } from '../utils/security';

interface Props {
  organizations: Organization[];
  users: User[];
  isDark: boolean;
  onToggleTheme: () => void;
  onSignUpSuccess: (user: User, newOrg?: Organization) => void;
  onNavigateToHome: () => void;
  onNavigateToLogin: () => void;
}

export const SignUpPage: React.FC<Props> = ({
  organizations,
  users,
  isDark,
  onToggleTheme,
  onSignUpSuccess,
  onNavigateToHome,
  onNavigateToLogin,
}) => {
  // By default, new sign up creates a new organization workspace where user is Admin
  const [mode, setMode] = useState<'new_org' | 'invite'>('new_org');

  // User credentials
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');

  // Workspace details (for new org admin)
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceSlug, setWorkspaceSlug] = useState('');
  const [teamSize, setTeamSize] = useState('1-10');
  const [industry, setIndustry] = useState('Video Production & Creative Agency');
  const [plan, setPlan] = useState<'Enterprise' | 'Pro' | 'Starter'>('Pro');

  // Invite state (when joining an existing organization)
  const [inviteOrg, setInviteOrg] = useState<Organization | null>(null);
  const [orgCode, setOrgCode] = useState('');
  const [inviteRole, setInviteRole] = useState<'editor' | 'reviewer' | 'admin'>('editor');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auto-slugify workspace name as user types
  const handleWorkspaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setWorkspaceName(val);
    setWorkspaceSlug(val.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''));
  };

  // Inspect URL parameters for direct email invite links (e.g. #signup?joinOrg=org_1&role=editor)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search || window.location.hash.split('?')[1] || '';
      const params = new URLSearchParams(search);
      const joinOrgId = params.get('joinOrg') || params.get('orgId') || params.get('invite');
      const paramRole = params.get('role');
      const paramEmail = params.get('email');

      if (paramEmail) {
        setEmail(paramEmail);
      }
      if (paramRole === 'reviewer' || paramRole === 'editor' || paramRole === 'admin') {
        setInviteRole(paramRole);
      }

      if (joinOrgId) {
        const found = organizations.find((o) => o.id === joinOrgId || o.slug === joinOrgId);
        if (found) {
          setInviteOrg(found);
          setOrgCode(found.id);
          setMode('invite');
        }
      }
    }
  }, [organizations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const clientKey = `signup_${email.trim().toLowerCase()}`;
    const rateCheck = checkRateLimit(clientKey);
    if (!rateCheck.allowed) {
      setErrorMsg(`Too many requests. Please wait ${rateCheck.waitSeconds}s before retrying.`);
      return;
    }

    const sanitizedEmail = sanitizeHtml(email.trim().toLowerCase());
    const existing = users.find((u) => u.email.toLowerCase() === sanitizedEmail);
    if (existing) {
      setErrorMsg('An account with this email address already exists. Please sign in instead.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'new_org' && !workspaceName.trim()) {
      setErrorMsg('Please specify a name for your workspace.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      resetRateLimit(clientKey);

      if (mode === 'invite') {
        // Joining existing organization as an invited user
        const targetOrg =
          inviteOrg ||
          organizations.find(
            (o) =>
              o.id.toLowerCase() === orgCode.trim().toLowerCase() ||
              o.name.toLowerCase() === orgCode.trim().toLowerCase() ||
              o.slug.toLowerCase() === orgCode.trim().toLowerCase()
          ) ||
          organizations[0];

        const newUser: User = {
          id: `user_${Date.now()}`,
          organizationId: targetOrg.id,
          name: sanitizeHtml(name.trim()),
          email: sanitizedEmail,
          avatar: '',
          role: inviteRole,
          title: sanitizeHtml(title.trim() || 'Creative Specialist'),
          initials: name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          color: '#6366f1',
          isOnline: true,
          password: password.trim(),
          lastLogin: 'Just now',
        };

        setIsLoading(false);
        onSignUpSuccess(newUser);
      } else {
        // By default: user creates their organization and becomes the Org Admin
        const newOrgId = `org_${Date.now()}`;
        const newUserId = `user_${Date.now()}`;

        const newOrg: Organization = {
          id: newOrgId,
          name: sanitizeHtml(workspaceName.trim()),
          slug: sanitizeHtml(workspaceSlug.trim() || 'workspace'),
          plan: plan,
          status: 'active',
          maxMembers: teamSize === '50+' ? 100 : teamSize === '25-50' ? 50 : teamSize === '11-25' ? 25 : 15,
          storageLimitGb: plan === 'Enterprise' ? 500 : plan === 'Pro' ? 250 : 100,
          mrr: plan === 'Enterprise' ? 4800 : plan === 'Pro' ? 2400 : 990,
          contactEmail: sanitizedEmail,
          createdAt: new Date().toISOString(),
          adminId: newUserId,
        };

        const newUser: User = {
          id: newUserId,
          organizationId: newOrg.id,
          name: sanitizeHtml(name.trim()),
          email: sanitizedEmail,
          avatar: '',
          role: 'admin', // Default: Admin of their newly created organization
          title: sanitizeHtml(title.trim() || 'Workspace Admin / Team Lead'),
          initials: name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
          color: '#4f46e5',
          isOnline: true,
          password: password.trim(),
          lastLogin: 'Just now',
        };

        setIsLoading(false);
        onSignUpSuccess(newUser, newOrg);
      }
    }, 350);
  };

  return (
    <div className="relative min-h-screen bg-[#f4f6fa] dark:bg-[#07090e] text-[#0f172a] dark:text-[#f8fafc] flex flex-col justify-between p-4 sm:p-6 transition-colors overflow-x-hidden font-sans">
      <InteractiveBackground isDark={isDark} />
      <InteractiveCursor />

      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between max-w-5xl mx-auto w-full">
        <button
          onClick={onNavigateToHome}
          className="flex items-center gap-2 text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={onToggleTheme}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>
      </div>

      {/* Main Sign Up Card */}
      <div className="relative z-20 w-full max-w-lg mx-auto my-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-5">
        <div className="text-center space-y-1.5">
          <div className="flex justify-center">
            <AvalonLogo size="lg" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            {mode === 'invite'
              ? `Join ${inviteOrg?.name || 'Workspace'}`
              : 'Create your Avalon Workspace'}
          </h2>
          <p className="text-[13px] text-slate-600 dark:text-slate-400">
            {mode === 'invite'
              ? `You are joining as an invited team member (${inviteRole})`
              : 'Sign up to provision an enterprise workspace with full admin ownership'}
          </p>
        </div>

        {/* Mode Selector Toggle if not locked to an invite link */}
        {!inviteOrg && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => setMode('new_org')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'new_org'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Create New Workspace</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('invite')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'invite'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Join with Invite</span>
            </button>
          </div>
        )}

        {/* Verified Invite Banner */}
        {inviteOrg && (
          <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2.5 text-[12px] text-indigo-700 dark:text-indigo-300">
            <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />
            <div>
              Joining verified organization <strong className="font-semibold">{inviteOrg.name}</strong> as{' '}
              <strong className="font-semibold capitalize">{inviteRole}</strong>.
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-[12px] text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
          {/* SECTION 1: Personal User Details */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              1. Your Account Details
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Elena Rostova"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Job Title / Role
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={mode === 'new_org' ? 'Studio Lead / Founder' : 'Video Editor'}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Organization / Workspace Details */}
          {mode === 'new_org' ? (
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  2. Workspace Details
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  You will be the Org Admin
                </span>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  What would you like to name your workspace?
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={workspaceName}
                    onChange={handleWorkspaceNameChange}
                    placeholder="e.g. Acme Studios, Horizon VFX, Apex Media"
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {workspaceName && (
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Workspace URL Slug
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 rounded-l-lg text-[12px] text-slate-500 font-mono">
                      avalon.io/
                    </span>
                    <input
                      type="text"
                      value={workspaceSlug}
                      onChange={(e) => setWorkspaceSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="w-full px-3 py-2 rounded-r-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-[12px]"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Team Size
                  </label>
                  <select
                    value={teamSize}
                    onChange={(e) => setTeamSize(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[12px]"
                  >
                    <option value="1-10">1 - 10 members</option>
                    <option value="11-25">11 - 25 members</option>
                    <option value="25-50">25 - 50 members</option>
                    <option value="50+">50+ enterprise seats</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Primary Workflow
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[12px]"
                  >
                    <option value="Video Production & Creative Agency">Video Production & Agency</option>
                    <option value="3D VFX & Animation Studio">3D VFX & Animation</option>
                    <option value="Brand Design & Creative Direction">Brand Design & Marketing</option>
                    <option value="Software & Engineering">Engineering & Tech</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subscription Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Starter', 'Pro', 'Enterprise'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setPlan(tier)}
                      className={`p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        plan === tier
                          ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <div className="text-[12px]">{tier}</div>
                      <div className="text-[10px] opacity-75">
                        {tier === 'Enterprise' ? '$4,800/mo' : tier === 'Pro' ? '$2,400/mo' : '$990/mo'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* SECTION 2 (Invite Mode): Organization Join Info */
            <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                2. Target Workspace
              </span>

              {!inviteOrg && (
                <div>
                  <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Select Organization to Join
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={orgCode}
                      onChange={(e) => setOrgCode(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[13px]"
                    >
                      {organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name} ({org.plan} Plan)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 text-[12px] text-slate-600 dark:text-slate-300">
                You will be granted a seat as a <strong className="font-semibold">{inviteRole}</strong> with direct access to projects, tasks, and video directives inside this organization.
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 mt-4 shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <span>Provisioning credentials & workspace...</span>
            ) : (
              <>
                <span>
                  {mode === 'new_org'
                    ? 'Create Workspace & Launch as Admin'
                    : 'Join Workspace Team'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[12px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
          >
            Sign in here
          </button>
        </div>
      </div>

      {/* Brand tagline footer */}
      <div className="relative z-20 text-center text-[12px] text-slate-500 dark:text-slate-400">
        Avalon WorkOS • Where clarity meets creative execution
      </div>
    </div>
  );
};
