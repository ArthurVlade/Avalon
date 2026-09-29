import React, { useState } from 'react';
import { User, Project, Organization } from '../../types';
import { AvalonLogo } from '../common/AvalonLogo';
import {
  Bell,
  Sun,
  Moon,
  Plus,
  Search,
  LogOut,
  Home,
  ChevronDown,
  Building2,
  Users,
  Shield,
  Layers,
} from 'lucide-react';

interface Props {
  organization: Organization;
  organizations: Organization[];
  currentProject: Project;
  currentUser: User;
  users: User[];
  isDark: boolean;
  isOnline: boolean;
  pendingSyncCount: number;
  unreadNotifsCount: number;
  onToggleTheme: () => void;
  onToggleOnlineMode: () => void;
  onOpenNotifications: () => void;
  onOpenNewTaskModal: () => void;
  onOpenSearch: () => void;
  onLogout: () => void;
  onNavigateHome: () => void;
  onOpenSuperAdminModal?: () => void;
  onOpenOrgTeamModal?: () => void;
  onSwitchTenantOrg?: (orgId: string) => void;
}

export const Navbar: React.FC<Props> = ({
  organization,
  organizations,
  currentProject,
  currentUser,
  isDark,
  isOnline,
  pendingSyncCount,
  unreadNotifsCount,
  onToggleTheme,
  onToggleOnlineMode,
  onOpenNotifications,
  onOpenNewTaskModal,
  onOpenSearch,
  onLogout,
  onNavigateHome,
  onOpenSuperAdminModal,
  onOpenOrgTeamModal,
  onSwitchTenantOrg,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const isSuperAdmin = currentUser.role === 'super_admin';
  const isOrgAdmin = currentUser.role === 'admin' || isSuperAdmin;

  return (
    <header className="h-12 border-b border-slate-200/80 dark:border-white/[0.08] bg-white/80 dark:bg-[#09090b]/85 backdrop-blur-xl px-3 sm:px-5 flex items-center justify-between sticky top-0 z-30 transition-all select-none">
      {/* Zone 1: Avalon Brand & Organization / Project Breadcrumb */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onNavigateHome}
          className="flex items-center text-left hover:opacity-85 transition-opacity"
          title="Go to Avalon Homepage"
        >
          <AvalonLogo size="sm" />
        </button>

        {/* Quiet Unboxed Breadcrumb */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500 pl-3 border-l border-slate-200 dark:border-white/[0.08]">
          {isSuperAdmin && onSwitchTenantOrg ? (
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-zinc-200 font-medium">
              <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <select
                value={organization.id}
                onChange={(e) => onSwitchTenantOrg(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 dark:text-zinc-200 outline-none cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                title="Switch Customer Organization Tenant"
              >
                {organizations.map((org) => (
                  <option
                    key={org.id}
                    value={org.id}
                    className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100"
                  >
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-zinc-300">
              <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate max-w-[130px]">{organization.name}</span>
            </div>
          )}

          <span className="text-slate-300 dark:text-zinc-700">/</span>

          <div className="flex items-center gap-1 text-slate-700 dark:text-zinc-200 font-semibold truncate max-w-[170px]">
            <Layers className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{currentProject?.title || 'Overview'}</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Compact Modern Global Search Trigger */}
      <div className="flex items-center mx-2 sm:mx-4 flex-1 max-w-xs md:max-w-sm justify-center">
        <button
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 h-7.5 rounded-lg bg-slate-100/70 dark:bg-white/[0.05] hover:bg-slate-200/60 dark:hover:bg-white/[0.09] border border-slate-200/70 dark:border-white/[0.08] text-xs text-slate-400 dark:text-zinc-400 transition-all"
        >
          <div className="flex items-center gap-2 truncate">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />
            <span className="truncate">Search tasks or jump to...</span>
          </div>
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-white dark:bg-zinc-800/80 text-slate-500 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-slate-200/80 dark:border-white/[0.08]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Zone 3: Actions & Profile */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
        {/* Sync Status Indicator */}
        <button
          onClick={onToggleOnlineMode}
          title={isOnline ? 'Online: click to simulate offline mode' : 'Offline: click to reconnect'}
          className="hidden md:flex items-center gap-1.5 h-7.5 px-2 rounded-lg text-[11px] font-medium text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors"
        >
          {isOnline ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Synced</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="font-mono">Offline ({pendingSyncCount})</span>
            </>
          )}
        </button>

        {/* Superadmin Platform Hub Trigger */}
        {isSuperAdmin && onOpenSuperAdminModal && (
          <button
            onClick={onOpenSuperAdminModal}
            className="hidden lg:flex items-center gap-1.5 h-7.5 px-2.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50/80 dark:bg-white/[0.04] text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
            title="Superadmin Multi-Tenant Organization Manager"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Platform Root</span>
          </button>
        )}

        {/* Team Management Trigger for Org Admins */}
        {isOrgAdmin && onOpenOrgTeamModal && (
          <button
            onClick={onOpenOrgTeamModal}
            className="hidden xl:flex items-center gap-1.5 h-7.5 px-2.5 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-slate-50/80 dark:bg-white/[0.04] text-xs font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-950 dark:hover:text-white transition-all"
            title="Invite & manage members in this organization"
          >
            <Users className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            <span>Team</span>
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative w-7.5 h-7.5 rounded-lg flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors"
          title="Notifications"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadNotifsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-zinc-900" />
          )}
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={onToggleTheme}
          className="w-7.5 h-7.5 rounded-lg flex items-center justify-center text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors"
          title="Toggle Light / Dark mode"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
        </button>

        {/* Compact Proportional Add Task CTA */}
        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-1.5 h-7.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add task</span>
        </button>

        {/* User Account Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-1.5 h-7.5 px-1.5 rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors"
          >
            <div
              className="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 shadow-2xs"
              style={{ backgroundColor: currentUser.color || '#4f46e5' }}
            >
              {currentUser.initials}
            </div>
            <span className="hidden sm:inline text-xs font-medium text-slate-700 dark:text-zinc-300 max-w-[80px] truncate">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
          </button>

          {/* Profile Dropdown */}
          {isProfileMenuOpen && (
            <div
              onClick={() => setIsProfileMenuOpen(false)}
              className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#121319] border border-slate-200 dark:border-white/[0.1] rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in"
            >
              <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-white/[0.08]">
                <div className="font-semibold text-xs text-slate-900 dark:text-zinc-100 truncate">
                  {currentUser.name}
                </div>
                <div className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">{currentUser.email}</div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <span className="text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
                    {currentUser.role.replace('_', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-zinc-500 truncate max-w-[120px]">
                    {organization.name}
                  </span>
                </div>
              </div>

              <div className="py-1 text-xs">
                {isSuperAdmin && onOpenSuperAdminModal && (
                  <button
                    onClick={onOpenSuperAdminModal}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/[0.06] text-indigo-600 dark:text-indigo-400 font-medium"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Manage Organizations</span>
                  </button>
                )}

                {isOrgAdmin && onOpenOrgTeamModal && (
                  <button
                    onClick={onOpenOrgTeamModal}
                    className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-700 dark:text-zinc-300"
                  >
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Manage Org Team</span>
                  </button>
                )}

                <button
                  onClick={onNavigateHome}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-white/[0.06] text-slate-700 dark:text-zinc-300"
                >
                  <Home className="w-3.5 h-3.5 text-slate-400" />
                  <span>Avalon Homepage</span>
                </button>

                <div className="border-t border-slate-100 dark:border-white/[0.08] my-1" />

                <button
                  onClick={onLogout}
                  className="w-full px-3.5 py-2 text-left flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
