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
  KeyRound,
  AlertCircle,
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
  const [mode, setMode] = useState<'invite' | 'new_org'>('invite');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [orgCode, setOrgCode] = useState('');
  const [newOrgName, setNewOrgName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteOrg, setInviteOrg] = useState<Organization | null>(null);

  // Check URL parameters for invite links (e.g. ?joinOrg=org_1 or #signup?joinOrg=org_1)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search || window.location.hash.split('?')[1] || '';
      const params = new URLSearchParams(search);
      const joinOrgId = params.get('joinOrg') || params.get('orgId');
      if (joinOrgId) {
        const found = organizations.find((o) => o.id === joinOrgId);
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
      setErrorMsg(`Too many requests. Please wait ${rateCheck.waitSeconds}s.`);
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

    setIsLoading(true);

    setTimeout(() => {
      resetRateLimit(clientKey);

      if (mode === 'invite') {
        // Resolve target organization
        const targetOrg = inviteOrg || organizations.find(
          (o) => o.id.toLowerCase() === orgCode.trim().toLowerCase() || o.name.toLowerCase() === orgCode.trim().toLowerCase()
        ) || organizations[0];

        const newUser: User = {
          id: `user_${Date.now()}`,
          organizationId: targetOrg.id,
          name: sanitizeHtml(name.trim()),
          email: sanitizedEmail,
          avatar: '',
          role: 'editor',
          title: sanitizeHtml(title.trim() || 'Team Member'),
          initials: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
          color: '#6366f1',
          isOnline: true,
          password: password.trim(),
          lastLogin: 'Just now',
        };

        setIsLoading(false);
        onSignUpSuccess(newUser);
      } else {
        // Create new organization workspace
        const newOrgId = `org_${Date.now()}`;
        const newOrg: Organization = {
          id: newOrgId,
          name: sanitizeHtml(newOrgName.trim() || `${name}'s Team`),
          slug: newOrgName.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'team',
          plan: 'Pro',
          status: 'active',
          maxMembers: 15,
          storageLimitGb: 100,
          mrr: 299,
          contactEmail: sanitizedEmail,
          createdAt: new Date().toISOString(),
          adminId: `user_${Date.now()}`,
        };

        const newUser: User = {
          id: newOrg.adminId,
          organizationId: newOrg.id,
          name: sanitizeHtml(name.trim()),
          email: sanitizedEmail,
          avatar: '',
          role: 'admin',
          title: 'Workspace Admin',
          initials: name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
          color: '#4f46e5',
          isOnline: true,
          password: password.trim(),
          lastLogin: 'Just now',
        };

        setIsLoading(false);
        onSignUpSuccess(newUser, newOrg);
      }
    }, 400);
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
      <div className="relative z-20 w-full max-w-md mx-auto my-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-5">
        <div className="text-center space-y-1.5">
          <div className="flex justify-center">
            <AvalonLogo size="lg" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Create your Avalon Account
          </h2>
          <p className="text-[13px] text-slate-600 dark:text-slate-400">
            {inviteOrg
              ? `You've been invited to join ${inviteOrg.name}`
              : 'Join a workspace or create a new team'}
          </p>
        </div>

        {/* Tab Selection if not pinned to invite */}
        {!inviteOrg && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[12px] font-semibold">
            <button
              type="button"
              onClick={() => setMode('invite')}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'invite'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Join with Invite
            </button>
            <button
              type="button"
              onClick={() => setMode('new_org')}
              className={`py-1.5 rounded-lg transition-all ${
                mode === 'new_org'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              New Organization
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-[12px] text-rose-700 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <div>{errorMsg}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-[13px]">
          {/* Target Organization selector / indicator */}
          {mode === 'invite' ? (
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Organization / Workspace
              </label>
              {inviteOrg ? (
                <div className="px-3 py-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-semibold text-[13px]">
                  <Building2 className="w-4 h-4 text-indigo-500" />
                  <span>{inviteOrg.name} (Verified Invite)</span>
                </div>
              ) : (
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={orgCode}
                    onChange={(e) => setOrgCode(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                New Organization Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={newOrgName}
                  onChange={(e) => setNewOrgName(e.target.value)}
                  placeholder="e.g. Apex Post Production"
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Your Full Name *
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Liam Parker"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Work Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="liam@company.com"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Role / Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lead Video Editor"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password *
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 mt-4 shadow-xs"
          >
            {isLoading ? (
              <span>Creating membership...</span>
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center text-[12px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            className="font-semibold text-slate-900 dark:text-white hover:underline"
          >
            Sign In
          </button>
        </div>
      </div>

      <div className="relative z-20 text-center text-[12px] text-slate-500 dark:text-slate-400">
        Avalon Multi-Tenant Shield • Zero cross-organization leakage
      </div>
    </div>
  );
};
