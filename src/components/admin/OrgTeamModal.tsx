import React, { useState } from 'react';
import { User, Role, Organization } from '../../types';
import {
  X,
  Users,
  Plus,
  Trash2,
  Mail,
  Shield,
  Key,
  CheckCircle2,
  Building2,
  Copy,
  Check,
  Link,
  Send,
} from 'lucide-react';
import { sanitizeHtml } from '../../utils/security';

interface Props {
  organization: Organization;
  currentUser: User;
  users: User[];
  onClose: () => void;
  onUpdateUsers: (updatedUsers: User[]) => void;
}

export const OrgTeamModal: React.FC<Props> = ({
  organization,
  currentUser,
  users,
  onClose,
  onUpdateUsers,
}) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('editor');
  const [inviteTitle, setInviteTitle] = useState('Video Editor');
  const [invitePassword, setInvitePassword] = useState('MemberPass2026!');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [inviteLinkRole, setInviteLinkRole] = useState<Role>('editor');

  // Filter strictly to current organization members
  const orgMembers = users.filter((u) => u.organizationId === organization.id);

  // Generate shareable invite link for this organization
  const getInviteLink = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://avalon.io';
    return `${origin}/#signup?joinOrg=${organization.id}&role=${inviteLinkRole}`;
  };

  const handleCopyInviteLink = () => {
    const link = getInviteLink();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    setCopiedLink(true);
    showNotice(`Workspace invite link copied to clipboard! Anyone with this link can join ${organization.name}.`);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;

    if (orgMembers.length >= organization.maxMembers) {
      alert(`Seat limit reached (${organization.maxMembers} seats max). Please contact the SaaS platform administrator to upgrade your plan.`);
      return;
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      organizationId: organization.id,
      name: sanitizeHtml(inviteName.trim()),
      email: sanitizeHtml(inviteEmail.trim().toLowerCase()),
      avatar: '',
      role: inviteRole,
      title: sanitizeHtml(inviteTitle.trim()),
      initials: inviteName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      color: '#6366f1',
      isOnline: false,
      password: invitePassword,
      lastLogin: 'Never',
    };

    const updated = [...users, newUser];
    onUpdateUsers(updated);

    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('editor');
    setInviteTitle('Video Editor');
    setInvitePassword('MemberPass2026!');
    showNotice(`Invitation dispatched to ${newUser.name} (${newUser.email}).`);
  };

  const handleRemoveMember = (userId: string) => {
    if (userId === currentUser.id) {
      alert('You cannot remove yourself from your organization.');
      return;
    }
    if (confirm('Remove this member from your organization?')) {
      const updated = users.filter((u) => u.id !== userId);
      onUpdateUsers(updated);
      showNotice('Member removed from organization.');
    }
  };

  const showNotice = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-[#0f172a] dark:text-[#f8fafc] font-sans"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <span>{organization.name} — Team Management</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold uppercase">
                  Org Admin
                </span>
              </h2>
              <p className="text-[12px] text-slate-500 dark:text-slate-400">
                Manage seats ({orgMembers.length}/{organization.maxMembers} used) and send direct invite links.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="mx-6 mt-3 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-[12px] rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Shareable Invite Link Card */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-indigo-500" />
                <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">
                  Send Shareable Workspace Invite Link
                </h3>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-slate-500 text-[11px]">Default Role:</span>
                <select
                  value={inviteLinkRole}
                  onChange={(e) => setInviteLinkRole(e.target.value as Role)}
                  className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[11px] font-medium"
                >
                  <option value="editor">Editor (Worker)</option>
                  <option value="reviewer">Reviewer (Client)</option>
                  <option value="project_manager">Project Manager</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={getInviteLink()}
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[12px] font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyInviteLink}
                className="px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Colleagues clicking this link will be directed straight to signup with your organization already pre-filled.
            </p>
          </div>

          {/* Members Table Header & Manual Invite Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-slate-900 dark:text-white">
              Organization Members ({orgMembers.length})
            </span>

            <button
              onClick={() => setIsInviteOpen(!isInviteOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[12px] font-semibold hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isInviteOpen ? 'Close Form' : 'Invite via Email'}</span>
            </button>
          </div>

          {/* Direct Invite form */}
          {isInviteOpen && (
            <form
              onSubmit={handleInviteMember}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3"
            >
              <h4 className="text-[13px] font-bold text-slate-900 dark:text-white">
                Dispatch Direct Email Invite to {organization.name}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[12px]">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    placeholder="e.g. Jordan Lee"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="jordan@company.com"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Organization Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as Role)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px]"
                  >
                    <option value="editor">Editor (Task Worker)</option>
                    <option value="reviewer">Reviewer (Stakeholder)</option>
                    <option value="project_manager">Project Manager</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={inviteTitle}
                    onChange={(e) => setInviteTitle(e.target.value)}
                    placeholder="e.g. Colorist & Editor"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Initial Password
                  </label>
                  <input
                    type="text"
                    required
                    value={invitePassword}
                    onChange={(e) => setInvitePassword(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-[13px]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3 py-1 text-[12px] text-slate-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[12px] font-semibold flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Invitation</span>
                </button>
              </div>
            </form>
          )}

          {/* Members Table */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Member</th>
                  <th className="py-2.5 px-4">Email</th>
                  <th className="py-2.5 px-4">Role</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {orgMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ backgroundColor: m.color || '#6366f1' }}
                        >
                          {m.initials}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">{m.name}</div>
                          <div className="text-[11px] text-slate-400">{m.title}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-[12px] text-slate-600 dark:text-slate-300">
                      {m.email}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 capitalize">
                        {m.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      {m.id !== currentUser.id && (
                        <button
                          onClick={() => handleRemoveMember(m.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
