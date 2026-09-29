import React, { useState } from 'react';
import { Task, User, Project, VideoInstruction, Organization } from '../../types';
import {
  CheckCircle2,
  Video,
  Clock,
  Play,
  Calendar,
  AlertCircle,
  FileCheck,
  Send,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Building2,
  Sparkles,
} from 'lucide-react';

interface Props {
  currentUser: User;
  organization: Organization;
  tasks: Task[];
  projects: Project[];
  onSelectTask: (task: Task) => void;
  onOpenVideoPlayer: (instruction: VideoInstruction, task: Task) => void;
  onToggleTaskComplete: (task: Task) => void;
  onRequestApproval: (taskId: string) => void;
}

export const MemberDashboard: React.FC<Props> = ({
  currentUser,
  organization,
  tasks,
  projects,
  onSelectTask,
  onOpenVideoPlayer,
  onToggleTaskComplete,
  onRequestApproval,
}) => {
  const [filter, setFilter] = useState<'all' | 'video' | 'in_progress' | 'completed'>('all');

  // Filter tasks strictly belonging to this user inside their organization
  const myTasks = tasks.filter((t) => t.assigneeId === currentUser.id);

  // Video instructions assigned to member
  const myVideoInstructions: { instruction: VideoInstruction; task: Task }[] = [];
  myTasks.forEach((t) => {
    t.videoInstructions.forEach((vi) => {
      myVideoInstructions.push({ instruction: vi, task: t });
    });
  });

  const pendingVideoInstructions = myVideoInstructions.filter(
    (item) => !item.instruction.isCompletedByEditor
  );

  const completedTasksCount = myTasks.filter((t) => t.status === 'completed').length;
  const inProgressCount = myTasks.filter((t) => t.status === 'in_progress' || t.status === 'in_review').length;
  const pendingApprovalsCount = myTasks.filter((t) => t.status === 'ready_for_approval' || t.approvalStatus === 'pending').length;

  const filteredTasks = myTasks.filter((t) => {
    if (filter === 'video') return t.videoInstructions.length > 0;
    if (filter === 'in_progress') return t.status === 'in_progress' || t.status === 'in_review';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Member Welcome Banner with high-contrast card elevation */}
      <div className="p-6 rounded-2xl bg-[#0f172a] text-white dark:bg-[#111622] dark:border dark:border-[#1f273a] shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-indigo-400" />
              {organization.name}
            </span>
            <span className="text-[12px] text-slate-400">/ Authenticated Member Workspace</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Welcome back, {currentUser.name}
          </h2>
          <p className="text-[13px] text-slate-300 mt-1 max-w-2xl font-normal">
            Active editing directives, timestamped video instructions, and pending deliverables for {organization.name}.
          </p>
        </div>

        {/* Member KPI counters */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-center min-w-[80px] border border-white/10">
            <div className="text-lg font-bold font-mono text-[#ff584a]">{pendingVideoInstructions.length}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Video Notes</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-center min-w-[80px] border border-white/10">
            <div className="text-lg font-bold font-mono text-indigo-300">{inProgressCount}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">In Progress</div>
          </div>
          <div className="px-3.5 py-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-center min-w-[80px] border border-white/10">
            <div className="text-lg font-bold font-mono text-emerald-300">{completedTasksCount}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Done</div>
          </div>
        </div>
      </div>

      {/* Video Directives Queue */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#1f273a] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ffe4e6] dark:bg-[#2d141d] flex items-center justify-center text-[#9f1239] dark:text-[#fb7185]">
              <Video className="w-4 h-4 text-[#ff584a]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0f172a] dark:text-white">
                My Video Timestamp Directives & Instructions
              </h3>
              <p className="text-[12px] text-[#475569] dark:text-[#94a3b8]">
                Timestamped feedback from creative directors for video intro, color grading, and cuts.
              </p>
            </div>
          </div>
          <span className="text-[12px] font-mono px-3 py-1 rounded-full bg-slate-100 dark:bg-[#161c2a] text-slate-700 dark:text-slate-300 font-semibold border border-slate-200 dark:border-[#1f273a]">
            {pendingVideoInstructions.length} pending pass
          </span>
        </div>

        {myVideoInstructions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-[13px] border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            No video instructions assigned to you right now. Great job.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {myVideoInstructions.map(({ instruction, task }) => {
              const project = projects.find((p) => p.id === task.projectId);
              return (
                <div
                  key={instruction.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                    instruction.isCompletedByEditor
                      ? 'bg-slate-50 dark:bg-[#141a27] border-slate-200 dark:border-slate-800 opacity-75'
                      : 'bg-[#fcfdfd] dark:bg-[#131926] border-slate-200 dark:border-[#1f273a] hover:border-indigo-400 dark:hover:border-indigo-600 shadow-xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[150px]">
                        {project?.title || 'Project'}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#ffe4e6] dark:bg-[#2d141d] text-[#9f1239] dark:text-[#fb7185]">
                        {instruction.targetSection}
                      </span>
                    </div>

                    <h4 className="text-[14px] font-bold text-[#0f172a] dark:text-white line-clamp-1">
                      {instruction.title}
                    </h4>

                    {instruction.notes && (
                      <p className="text-[12px] text-slate-600 dark:text-slate-300 line-clamp-2">
                        {instruction.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400">
                      Task: {task.title.slice(0, 24)}...
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenVideoPlayer(instruction, task)}
                        className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-full text-[11px] font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Play Timestamp</span>
                      </button>

                      <button
                        onClick={() => onSelectTask(task)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="View Task Details"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Task List */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#111622] border border-slate-200 dark:border-[#1f273a] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-bold text-[#0f172a] dark:text-white">
              My Assigned Tasks & Deliverables ({myTasks.length})
            </h3>
            <p className="text-[12px] text-[#475569] dark:text-[#94a3b8]">
              Manage your personal tasks, check off subtasks, and submit for executive sign-off.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-[#f4f6fa] dark:bg-[#161c2a] p-1 rounded-full text-[12px] border border-slate-200 dark:border-[#1f273a]">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-[#111622] text-[#0f172a] dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All ({myTasks.length})
            </button>
            <button
              onClick={() => setFilter('in_progress')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                filter === 'in_progress'
                  ? 'bg-white dark:bg-[#111622] text-[#0f172a] dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Active ({inProgressCount})
            </button>
            <button
              onClick={() => setFilter('video')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                filter === 'video'
                  ? 'bg-white dark:bg-[#111622] text-[#0f172a] dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Video Tasks
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                filter === 'completed'
                  ? 'bg-white dark:bg-[#111622] text-[#0f172a] dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Done ({completedTasksCount})
            </button>
          </div>
        </div>

        {/* Task Cards */}
        <div className="space-y-2">
          {filteredTasks.map((t) => {
            const project = projects.find((p) => p.id === t.projectId);
            const isCompleted = t.status === 'completed';
            return (
              <div
                key={t.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-[#1f273a] hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-[#131926] transition-all group cursor-pointer"
                onClick={() => onSelectTask(t)}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTaskComplete(t);
                    }}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : 'border-slate-400 hover:border-emerald-500 text-transparent'
                    }`}
                  >
                    <Check className="w-3 h-3 stroke-[3]" />
                  </button>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[13px] font-semibold truncate ${
                          isCompleted ? 'line-through text-slate-400' : 'text-[#0f172a] dark:text-white'
                        }`}
                      >
                        {t.title}
                      </span>
                      {t.videoInstructions.length > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded bg-[#ffe4e6] dark:bg-[#2d141d] text-[#9f1239] dark:text-[#fb7185] font-bold shrink-0">
                          <Video className="w-3 h-3 text-[#ff584a]" />
                          <span>{t.videoInstructions.length} notes</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{project?.title || 'Project'}</span>
                      <span>/</span>
                      <span>Due {t.dueDate || 'No date'}</span>
                      {t.subtasks.length > 0 && (
                        <>
                          <span>/</span>
                          <span>
                            {t.subtasks.filter((s) => s.completed).length}/{t.subtasks.length} subtasks
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-4">
                  {t.requiresApproval && t.status !== 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRequestApproval(t.id);
                      }}
                      className="hidden sm:flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 rounded-full text-[11px] font-semibold hover:bg-amber-100 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      <span>Submit for Review</span>
                    </button>
                  )}

                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full capitalize ${
                      t.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : t.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : t.status === 'ready_for_approval'
                        ? 'bg-[#ffe4e6] text-[#9f1239] dark:bg-[#2d141d] dark:text-[#fb7185]'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {t.status.replace('_', ' ')}
                  </span>

                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
