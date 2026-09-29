import React, { useState } from 'react';
import { User } from '../types';
import { AvalonLogo } from '../components/common/AvalonLogo';
import { InteractiveBackground } from '../components/common/InteractiveBackground';
import { InteractiveCursor } from '../components/common/InteractiveCursor';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  Sun,
  Moon,
  Building2,
  Clock,
  Shield,
  KeyRound,
} from 'lucide-react';
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '../utils/rateLimiter';
import { sanitizeHtml } from '../utils/security';

interface Props {
  users: User[];
  isDark: boolean;
  onToggleTheme: () => void;
  onLoginSuccess: (user: User) => void;
  onNavigateToHome: () => void;
  onNavigateToSignUp?: () => void;
  onOpenSuperAdminConsole?: () => void;
}

export const LoginPage: React.FC<Props> = ({
  users,
  isDark,
  onToggleTheme,
  onLoginSuccess,
  onNavigateToHome,
  onNavigateToSignUp,
  onOpenSuperAdminConsole,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const clientKey = `login_${email.trim().toLowerCase() || 'general'}`;
    const rateCheck = checkRateLimit(clientKey);

    if (!rateCheck.allowed) {
      setLockoutSeconds(rateCheck.waitSeconds || 60);
      setErrorMsg(`Too many failed login attempts. Rate limit triggered: please wait ${rateCheck.waitSeconds}s before retrying.`);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const sanitizedEmail = sanitizeHtml(email.trim().toLowerCase());
      const sanitizedPassword = password.trim();

      const foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === sanitizedEmail &&
          (!u.password || u.password === sanitizedPassword)
      );

      if (foundUser) {
        resetRateLimit(clientKey);
        setIsLoading(false);
        onLoginSuccess(foundUser);
      } else {
        const failure = recordFailedAttempt(clientKey);
        setIsLoading(false);

        if (failure.locked) {
          setLockoutSeconds(failure.waitSeconds || 60);
          setErrorMsg(`Account temporarily locked due to 5 consecutive failed attempts. Cooldown: ${failure.waitSeconds}s.`);
        } else {
          setErrorMsg(`Invalid email or password. Security warning: ${failure.remainingAttempts} attempts remaining before temporary lockout.`);
        }
      }
    }, 250);
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
    const foundUser = users.find((u) => u.email.toLowerCase() === demoEmail.toLowerCase());
    if (foundUser) {
      onLoginSuccess(foundUser);
    }
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

      {/* Main Login Card */}
      <div className="relative z-20 w-full max-w-md mx-auto my-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden p-6 sm:p-8 space-y-5">
        {/* Brand & Title */}
        <div className="text-center space-y-1.5">
          <div className="flex justify-center">
            <AvalonLogo size="lg" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Sign in to Avalon
          </h2>
          <p className="text-[13px] text-slate-600 dark:text-slate-400">
            Multi-tenant workspace access for production teams
          </p>
        </div>

        {/* Error Alert / Rate Limit Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-[12px] text-rose-700 dark:text-rose-300">
            {lockoutSeconds ? (
              <Clock className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            )}
            <div>{errorMsg}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-[13px]">
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
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Bcrypt/SHA-256</span>
            </div>
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
            disabled={isLoading || !!lockoutSeconds}
            className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 mt-2 shadow-xs"
          >
            {isLoading ? (
              <span>Verifying authorization...</span>
            ) : (
              <>
                <span>Sign In to Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Exclusive SaaS Seller Hub Entry (Only accessible from Login page as requested) */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>SaaS Seller Hub (Super Admin)</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Platform Admin</span>
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-400">
            For platform owner Alexander Wright to provision tenant organizations, manage billing tiers, and inspect system audit logs.
          </p>
          <button
            type="button"
            onClick={() => {
              handleQuickLogin('superadmin@avalon.io', 'SuperAdminPass2026!');
              onOpenSuperAdminConsole?.();
            }}
            className="w-full py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-slate-400 text-slate-900 dark:text-white rounded-lg text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
            <span>Launch SaaS Seller Hub Console</span>
          </button>
        </div>

        {/* Quick Demo Switcher */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span>Fast Tenant Logins</span>
            <span>Click to autofill</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Org 1 Admin: Apex Media */}
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@avalon.io', 'AdminPass2026!')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-left transition-all bg-white dark:bg-slate-900 shadow-2xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white">Apex Media Admin</div>
              <div className="text-slate-500 text-[10px] truncate">Elena Rostova (Org 1)</div>
            </button>

            {/* Org 1 Member: Video Editor */}
            <button
              type="button"
              onClick={() => handleQuickLogin('editor@avalon.io', 'EditorPass2026!')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-left transition-all bg-white dark:bg-slate-900 shadow-2xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white">Apex Video Editor</div>
              <div className="text-slate-500 text-[10px] truncate">Sarah Jenkins (Org 1)</div>
            </button>

            {/* Org 2 Admin: Vanguard VFX */}
            <button
              type="button"
              onClick={() => handleQuickLogin('alex@avalon.io', 'ProjectPass2026!')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-left transition-all bg-white dark:bg-slate-900 shadow-2xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white">Vanguard Admin</div>
              <div className="text-slate-500 text-[10px] truncate">Alex Rivera (Org 2)</div>
            </button>

            {/* Org 2 Member: Motion Designer */}
            <button
              type="button"
              onClick={() => handleQuickLogin('liam@avalon.io', 'MemberPass2026!')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-400 text-left transition-all bg-white dark:bg-slate-900 shadow-2xs"
            >
              <div className="font-semibold text-slate-900 dark:text-white">Vanguard VFX Member</div>
              <div className="text-slate-500 text-[10px] truncate">Liam Chen (Org 2)</div>
            </button>
          </div>
        </div>

        {/* Link to Sign Up */}
        {onNavigateToSignUp && (
          <div className="text-center text-[12px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
            Need an account?{' '}
            <button
              onClick={onNavigateToSignUp}
              className="font-semibold text-slate-900 dark:text-white hover:underline"
            >
              Sign up for a workspace
            </button>
          </div>
        )}
      </div>

      {/* Security note footer */}
      <div className="relative z-20 text-center text-[12px] text-slate-500 dark:text-slate-400">
        Avalon Multi-Tenant Shield • Zero cross-organization leakage • Rate-limited against brute force
      </div>
    </div>
  );
};
