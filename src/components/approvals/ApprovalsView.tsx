import React, { useState } from 'react';
import { Task, User, VideoInstruction } from '../../types';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Video,
  FileCheck,
} from 'lucide-react';
import { hasPermission } from '../../utils/security';

interface Props {
  tasks: Task[];
  users: User[];
  currentUser: User;
  onSelectTask: (task: Task) => void;
  onApproveTask: (taskId: string, notes: string) => void;
  onRequestChanges: (taskId: string, notes: string) => void;
  onPlayVideoInstruction?: (instruction: VideoInstruction, task: Task) => void;
}

export const ApprovalsView: React.FC<Props> = ({
  tasks,
  users,
  currentUser,
  onSelectTask,
  onApproveTask,
  onRequestChanges,
  onPlayVideoInstruction,
}) => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'all'>('pending');
  const [revisionTaskId, setRevisionTaskId] = useState<string | null>(null);
  const [revisionNotes, setRevisionNotes] = useState('');

  const canApprove = hasPermission(currentUser.role, 'canApproveDeliverables');

  const approvalTasks = tasks.filter((t) => {
    if (filter === 'pending') {
      return t.requiresApproval && t.approvalStatus === 'pending';
    }
    if (filter === 'approved') {
      return t.approvalStatus === 'approved';
    }
    return t.requiresApproval || t.approvalStatus !== 'none';
  });

  const handleApprove = (taskId: string) => {
    onApproveTask(taskId, `Approved by ${currentUser.name} (${currentUser.title})`);
  };

  const handleRequestChanges = (taskId: string) => {
    if (!revisionNotes.trim()) return;
    onRequestChanges(taskId, revisionNotes.trim());
    setRevisionTaskId(null);
    setRevisionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-[12px] bg-[#ffffff] border border-[#e7e7e7] shadow-none">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-[8px] bg-[#ffeaec] text-[#690031]">
              <ShieldCheck className="w-5 h-5 text-[#ff584a]" />
            </div>
            <h2 className="text-[17px] font-medium text-[#0d0d0d]">
              Stakeholder approvals
            </h2>
          </div>
          <p className="text-[13px] text-[#646f79] font-light mt-1">
            Review creative cuts, intro sequences, and milestone deliverables requiring formal sign-off.
          </p>
        </div>

        {/* Filter Pill Segmented Control */}
        <div className="flex items-center gap-1.5 p-1 bg-[#f3f3f3] rounded-[999px] border border-[#e7e7e7]">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3.5 py-1.5 text-[12px] rounded-[999px] transition-colors ${
              filter === 'pending'
                ? 'bg-[#ffeaec] text-[#690031] font-medium'
                : 'text-[#6e6e6e] hover:text-[#0d0d0d] font-normal'
            }`}
          >
            Pending sign-off ({tasks.filter((t) => t.requiresApproval && t.approvalStatus === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3.5 py-1.5 text-[12px] rounded-[999px] transition-colors ${
              filter === 'approved'
                ? 'bg-[#ffeaec] text-[#690031] font-medium'
                : 'text-[#6e6e6e] hover:text-[#0d0d0d] font-normal'
            }`}
          >
            Approved ({tasks.filter((t) => t.approvalStatus === 'approved').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 text-[12px] rounded-[999px] transition-colors ${
              filter === 'all'
                ? 'bg-[#ffeaec] text-[#690031] font-medium'
                : 'text-[#6e6e6e] hover:text-[#0d0d0d] font-normal'
            }`}
          >
            All deliverables
          </button>
        </div>
      </div>

      {/* Role Notice */}
      {!canApprove && (
        <div className="p-3 bg-[#cbefff] border border-[#b2e6ff] rounded-[10px] flex items-center gap-2 text-[12px] text-[#222875]">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#222875]" />
          <span>
            Viewing as <strong>{currentUser.role.replace('_', ' ')}</strong>. Switch to <strong>Reviewer</strong> or <strong>Admin</strong> using the top navigation bar to execute sign-offs.
          </span>
        </div>
      )}

      {/* Approvals List */}
      {approvalTasks.length === 0 ? (
        <div className="p-12 text-center bg-[#ffffff] border border-[#e7e7e7] rounded-[12px]">
          <FileCheck className="w-12 h-12 text-[#9ca6af] mx-auto mb-3" />
          <h3 className="text-[15px] font-medium text-[#0d0d0d]">
            No deliverables in this queue
          </h3>
          <p className="text-[13px] text-[#646f79] font-light mt-1 max-w-sm mx-auto">
            All submitted tasks have been reviewed. When an editor or PM flags a deliverable for approval, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvalTasks.map((task) => {
            const assignee = users.find((u) => u.id === task.assigneeId);
            const approver = users.find((u) => u.id === task.approvedBy);
            const isPending = task.approvalStatus === 'pending';

            return (
              <div
                key={task.id}
                className="p-5 bg-[#ffffff] border border-[#e7e7e7] rounded-[12px] space-y-4 shadow-none"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#f3f3f3] pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] font-medium uppercase tracking-wide px-2.5 py-0.5 rounded-[999px] ${
                          task.approvalStatus === 'approved'
                            ? 'bg-[#f3f3f3] text-[#0d0d0d]'
                            : task.approvalStatus === 'pending'
                            ? 'bg-[#ffeaec] text-[#690031]'
                            : 'bg-[#ffeaec] text-[#690031]'
                        }`}
                      >
                        {task.approvalStatus === 'approved'
                          ? 'Approved'
                          : task.approvalStatus === 'pending'
                          ? 'Awaiting sign-off'
                          : 'Changes requested'}
                      </span>
                      <span className="text-[#9ca6af]">·</span>
                      <span className="text-[12px] text-[#646f79] font-mono">
                        Due: {task.dueDate}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectTask(task)}
                      className="text-[16px] font-medium text-[#0d0d0d] hover:text-[#ff584a] cursor-pointer transition-colors"
                    >
                      {task.title}
                    </h3>
                  </div>

                  {assignee && (
                    <div className="flex items-center gap-2 text-[12px] text-[#646f79]">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-none"
                        style={{ backgroundColor: assignee.color || '#222875' }}
                      >
                        {assignee.initials}
                      </div>
                      <span className="font-light">Submitted by {assignee.name}</span>
                    </div>
                  )}
                </div>

                {/* Description & Submission Notes */}
                <p className="text-[14px] text-[#3d3d3d] font-light leading-[1.5]">
                  {task.description}
                </p>

                {task.approvalNotes && (
                  <div className="p-3 bg-[#ffeaec] border-l-2 border-[#ff584a] rounded-r-[8px] text-[13px] text-[#690031]">
                    <span className="font-medium">Editor note: </span>
                    {task.approvalNotes}
                  </div>
                )}

                {/* Hyperlinked Video Instructions (Asana Violet framed card) */}
                {task.videoInstructions.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-[11px] font-medium uppercase tracking-wider text-[#646f79]">
                      Attached video instructions & cuts ({task.videoInstructions.length})
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {task.videoInstructions.map((vi) => (
                        <div
                          key={vi.id}
                          onClick={() => onPlayVideoInstruction?.(vi, task)}
                          className="p-3.5 rounded-[10px] bg-[#fbfbfb] border border-[#e7e7e7] hover:border-[#222875] transition-colors cursor-pointer flex items-center justify-between"
                        >
                          <div className="truncate pr-2">
                            <span className="text-[13px] font-medium text-[#0d0d0d] block truncate">
                              {vi.title}
                            </span>
                            <span className="text-[11px] text-[#222875] font-medium">
                              {vi.targetSection} @{vi.timestampFormatted}
                            </span>
                          </div>
                          <span className="p-1 text-[#222875]">
                            <Video className="w-4 h-4" />
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Bar */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-[#f3f3f3]">
                  <button
                    onClick={() => onSelectTask(task)}
                    className="text-[13px] font-normal text-[#0d0d0d] hover:text-[#ff584a] text-left underline underline-offset-4"
                  >
                    View complete task details & timeline →
                  </button>

                  {isPending && canApprove && (
                    <div className="flex items-center gap-2.5">
                      {/* Secondary Outline Pill */}
                      <button
                        onClick={() => setRevisionTaskId(revisionTaskId === task.id ? null : task.id)}
                        className="px-4 py-2 text-[13px] font-medium rounded-[146px] bg-[#f3f3f3] hover:bg-[#e7e7e7] text-[#0d0d0d] border border-[#0d0d0d] transition-colors"
                      >
                        Request changes
                      </button>
                      {/* Primary Pill Button */}
                      <button
                        onClick={() => handleApprove(task.id)}
                        className="px-5 py-2 text-[13px] font-medium rounded-[100px] bg-[#0d0d0d] hover:bg-[#3d3d3d] text-[#ffffff] transition-colors flex items-center gap-1.5 shadow-none"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#ff584a]" />
                        <span>Sign-off & approve</span>
                      </button>
                    </div>
                  )}

                  {task.approvalStatus === 'approved' && approver && (
                    <span className="text-[13px] text-[#0d0d0d] font-normal flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#ff584a]" />
                      <span>Approved by {approver.name}</span>
                    </span>
                  )}
                </div>

                {/* Revision box */}
                {revisionTaskId === task.id && (
                  <div className="p-4 rounded-[10px] bg-[#fbfbfb] border border-[#e7e7e7] space-y-2 mt-2">
                    <label className="block text-[12px] font-medium text-[#0d0d0d]">
                      Specify required edits
                    </label>
                    <textarea
                      rows={2}
                      value={revisionNotes}
                      onChange={(e) => setRevisionNotes(e.target.value)}
                      placeholder="e.g. Intro whip-zoom pacing is too abrupt at 00:15, ease into title card..."
                      className="w-full px-3 py-2 text-[13px] rounded-[6px] bg-[#ffffff] border border-[#e7e7e7] text-[#0d0d0d] focus:outline-hidden focus:border-[#0d0d0d]"
                    />
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setRevisionTaskId(null)}
                        className="px-3 py-1.5 text-[12px] text-[#646f79]"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleRequestChanges(task.id)}
                        className="px-4 py-1.5 bg-[#0d0d0d] text-[#ffffff] text-[12px] font-medium rounded-[100px]"
                      >
                        Submit revision request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
