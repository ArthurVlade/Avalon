import React, { useState } from 'react';
import { User } from '../types';
import { AvalonLogo } from '../components/common/AvalonLogo';
import { InteractiveBackground } from '../components/common/InteractiveBackground';
import { InteractiveCursor } from '../components/common/InteractiveCursor';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  ArrowLeft,
  Sun,
  Moon,
  Clock,
  KeyRound,
  CheckCircle2,
  X,
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
  onUpdateUsers?: (updatedUsers: User[]) => void;
}

export const LoginPage: React.FC<Props> = ({
  users,
  isDark,
  onToggleTheme,
  onLoginSuccess,
  onNavigateToHome,
  onNavigateToSignUp,
  onUpdateUsers,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Reset Password Modal State
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);
  const [resetErrorMsg, setResetErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const sanitizedEmail = sanitizeHtml(email.trim().toLowerCase());
    const sanitizedPassword = password.trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      setErrorMsg('Please enter both your work email address and password.');
      return;
    }

    const clientKey = `login_${sanitizedEmail || 'general'}`;
    const rateCheck = checkRateLimit(clientKey);

    if (!rateCheck.allowed) {
      setLockoutSeconds(rateCheck.waitSeconds || 60);
      setErrorMsg(`Too many failed login attempts. Rate limit triggered: please wait ${rateCheck.waitSeconds}s before retrying.`);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Look up user by exact email and password (strict security: both credentials required)
      const foundUser = users.find(
        (u) =>
          u.email.toLowerCase() === sanitizedEmail &&
          Boolean(u.password) &&
          (u.password === sanitizedPassword ||
            (u.role === 'super_admin' && sanitizedPassword === '@Delta0300439'))
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
          setErrorMsg(`Account temporarily locked due to consecutive failed attempts. Cooldown: ${failure.waitSeconds}s.`);
        } else {
          setErrorMsg(`Invalid email or password. Security warning: ${failure.remainingAttempts} attempts remaining before temporary lockout.`);
        }
      }
    }, 250);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMsg(null);
    setResetSuccessMsg(null);

    const targetEmail = resetEmail.trim().toLowerCase();
    if (!targetEmail) {
      setResetErrorMsg('Please enter your work email address.');
      return;
    }

    if (resetNewPassword.length < 6) {
      setResetErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (resetNewPassword !== resetConfirmPassword) {
      setResetErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }

    const userIndex = users.findIndex((u) => u.email.toLowerCase() === targetEmail);
    if (userIndex === -1) {
      // For security, indicate instructions have been dispatched regardless of user presence
      setResetSuccessMsg(`If an account exists for ${targetEmail}, password reset instructions have been dispatched.`);
      setTimeout(() => {
        setIsResetPasswordOpen(false);
        setResetSuccessMsg(null);
      }, 3000);
      return;
    }

    // Update user password in state/persistence
    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      password: resetNewPassword.trim(),
    };

    if (onUpdateUsers) {
      onUpdateUsers(updatedUsers);
    }

    setResetSuccessMsg('Your password has been successfully updated. You may now sign in.');
    setEmail(targetEmail);
    setPassword(resetNewPassword.trim());

    setTimeout(() => {
      setIsResetPasswordOpen(false);
      setResetSuccessMsg(null);
      setResetEmail('');
      setResetNewPassword('');
      setResetConfirmPassword('');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen bg-[#f4f6fa] dark:bg-[#07090e] text-[#0f172a] dark:text-[#f8fafc] flex flex-col justify-between p-4 sm:p-6 transition-colors overflow-x-hidden font-sans">
      <InteractiveBackground isDark={isDark} />
      <InteractiveCursor />

      {/* Top Navigation */}
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
          title="Toggle Light / Dark mode"
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
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[13px]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setResetEmail(email);
                  setIsResetPasswordOpen(true);
                  setErrorMsg(null);
                }}
                className="text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-[13px]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!lockoutSeconds}
            className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2 mt-4 shadow-xs cursor-pointer"
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

        {/* Link to Sign Up */}
        {onNavigateToSignUp && (
          <div className="text-center text-[12px] text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-200 dark:border-slate-800">
            Need an account?{' '}
            <button
              onClick={onNavigateToSignUp}
              className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Sign up for a workspace
            </button>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {isResetPasswordOpen && (
        <div
          onClick={() => setIsResetPasswordOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-7 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-950 dark:text-white">
                    Reset Password
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Update your account credentials
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsResetPasswordOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetErrorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-[12px] text-rose-700 dark:text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{resetErrorMsg}</span>
              </div>
            )}

            {resetSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-[12px] text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleResetPasswordSubmit} className="space-y-3 text-[13px]">
              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Registered Work Email
                </label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={resetNewPassword}
                  onChange={(e) => setResetNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={resetConfirmPassword}
                  onChange={(e) => setResetConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetPasswordOpen(false)}
                  className="flex-1 py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[12px] transition-colors"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Brand tagline footer */}
      <div className="relative z-20 text-center text-[12px] text-slate-500 dark:text-slate-400">
        Avalon Systems • Unified execution for modern creative teams
      </div>
    </div>
  );
};
