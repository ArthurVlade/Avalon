import React, { useState } from 'react';
import { Project, Workspace, User, Organization } from '../../types';
import {
  CheckSquare,
  ShieldCheck,
  Shield,
  BarChart3,
  Database,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Users,
  Building2,
  FolderGit2,
  Download,
} from 'lucide-react';
import { hasPermission } from '../../utils/security';

interface Props {
  organization: Organization;
  workspace: Workspace;
  projects: Project[];
  activeProjectId: string;
  activeViewCategory: 'project' | 'my_tasks' | 'approvals' | 'analytics';
  pendingApprovalsCount: number;
  myTasksCount: number;
  users: User[];
  currentUser: User;
  onSelectProject: (projectId: string) => void;
  onSelectCategory: (category: 'project' | 'my_tasks' | 'approvals' | 'analytics') => void;
  onOpenSecurityModal: () => void;
  onExportBackup: () => void;
  onAddNewProject: () => void;
  onEditProject?: (project: Project) => void;
  onOpenOrgTeamModal?: () => void;
  onOpenSuperAdminModal?: () => void;
}

export const Sidebar: React.FC<Props> = ({
  organization,
  workspace,
  projects,
  activeProjectId,
  activeViewCategory,
  pendingApprovalsCount,
  myTasksCount,
  users,
  currentUser,
  onSelectProject,
  onSelectCategory,
  onOpenSecurityModal,
  onExportBackup,
  onAddNewProject,
  onEditProject,
  onOpenOrgTeamModal,
  onOpenSuperAdminModal,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const canCreateProject = hasPermission(currentUser.role, 'canCreateProject');
  const isSuperAdmin = currentUser.role === 'super_admin';
  const isOrgAdmin = currentUser.role === 'admin' || isSuperAdmin;

  const orgMembers = users.filter((u) => u.organizationId === organization.id);

  return (
    <aside
      className={`h-[calc(100vh-50px)] border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between transition-all duration-200 select-none font-sans ${
        collapsed ? 'w-14' : 'w-60'
      }`}
    >
      {/* Top Section */}
      <div className="p-2.5 space-y-3 overflow-y-auto">
        {/* Workspace Brand / Header with Organization Context */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <div className="w-6 h-6 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0">
              <Building2 className="w-3.5 h-3.5" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <span className="text-[12px] font-semibold text-slate-900 dark:text-white truncate block">
                  {organization.name}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block capitalize">
                  {organization.plan} Workspace
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Core Navigation Items */}
        <div className="space-y-0.5">
          {/* My Tasks */}
          <button
            onClick={() => onSelectCategory('my_tasks')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] transition-colors ${
              activeViewCategory === 'my_tasks'
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-semibold shadow-xs border border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${activeViewCategory === 'my_tasks' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              {!collapsed && <span>My tasks</span>}
            </div>
            {!collapsed && (
              <span className={`font-mono text-[10px] px-1.5 py-0.2 rounded-full ${
                activeViewCategory === 'my_tasks' ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold' : 'bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}>
                {myTasksCount}
              </span>
            )}
          </button>

          {/* Pending Approvals */}
          <button
            onClick={() => onSelectCategory('approvals')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] transition-colors ${
              activeViewCategory === 'approvals'
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-semibold shadow-xs border border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${activeViewCategory === 'approvals' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              {!collapsed && <span>Approvals</span>}
            </div>
            {pendingApprovalsCount > 0 && !collapsed && (
              <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-semibold">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          {/* Analytics / Reporting */}
          <button
            onClick={() => onSelectCategory('analytics')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] transition-colors ${
              activeViewCategory === 'analytics'
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-semibold shadow-xs border border-slate-200 dark:border-slate-800'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium'
            }`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className={`w-3.5 h-3.5 shrink-0 ${activeViewCategory === 'analytics' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              {!collapsed && <span>Reporting & velocity</span>}
            </div>
          </button>

          {/* Org Team Management (For Org Admins) */}
          {isOrgAdmin && onOpenOrgTeamModal && (
            <button
              onClick={onOpenOrgTeamModal}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors font-medium"
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              {!collapsed && <span>Team Members</span>}
            </button>
          )}

          {/* Super Admin Dedicated Command Panel */}
          {isSuperAdmin && onOpenSuperAdminModal && (
            <button
              onClick={onOpenSuperAdminModal}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[12px] text-amber-700 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors font-semibold border border-amber-200/80 dark:border-amber-800/40"
              title="Super Admin Multi-Tenant Platform Hub"
            >
              <Shield className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
              {!collapsed && <span>Platform Root Hub</span>}
            </button>
          )}
        </div>

        {/* Projects Section */}
        <div className="pt-2">
          {!collapsed && (
            <div className="flex items-center justify-between px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <span>Projects ({projects.length})</span>
              {canCreateProject && (
                <button
                  onClick={onAddNewProject}
                  className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  title="Create new project"
                >
                  <Plus className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          <div className="space-y-0.5 mt-1">
            {projects.map((proj) => {
              const isActive = activeViewCategory === 'project' && activeProjectId === proj.id;

              return (
                <div
                  key={proj.id}
                  className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[12px] transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-semibold shadow-xs border border-slate-200 dark:border-slate-800'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 font-normal'
                  }`}
                  onClick={() => {
                    onSelectProject(proj.id);
                    onSelectCategory('project');
                  }}
                >
                  <div className="flex items-center gap-2 truncate flex-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: isActive ? '#4f46e5' : proj.color || '#94a3b8' }}
                    />
                    {!collapsed && <span className="truncate">{proj.title}</span>}
                  </div>

                  {canCreateProject && onEditProject && !collapsed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditProject(proj);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded transition-opacity"
                      title="Edit project details"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Active Team & Infrastructure */}
      <div className="p-2.5 border-t border-slate-200 dark:border-slate-800 space-y-2 bg-white/50 dark:bg-slate-950">
        {/* Active Collaborators strictly in this organization */}
        {!collapsed && (
          <div className="space-y-1 px-1">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="truncate max-w-[90px]">{organization.name}</span>
              </span>
              <span className="font-mono text-[10px]">{orgMembers.filter((u) => u.isOnline).length} online</span>
            </div>
            <div className="flex items-center gap-1 py-0.5">
              {orgMembers.slice(0, 5).map((u) => (
                <div
                  key={u.id}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white ring-1 ring-white dark:ring-slate-950"
                  style={{ backgroundColor: u.color || '#4f46e5' }}
                  title={`${u.name} (${u.role})`}
                >
                  {u.initials}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Security & Database Schemas */}
        <div className="space-y-0.5">
          <button
            onClick={onOpenSecurityModal}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="Database Schemas & Security Audit"
          >
            <Database className="w-3.5 h-3.5 text-indigo-500" />
            {!collapsed && <span>Security & DB Specs</span>}
          </button>

          <button
            onClick={onExportBackup}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            title="Export JSON snapshot"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            {!collapsed && <span>Export Org Backup</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
