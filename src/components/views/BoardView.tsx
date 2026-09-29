import React, { useState } from 'react';
import { Task, User, TaskStatus, VideoInstruction } from '../../types';
import {
  Plus,
  Video,
  Layers,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sparkles,
  MessageSquare,
  Image as ImageIcon,
  Check,
  ZoomIn,
  LayoutGrid,
  ListFilter,
  Edit2,
  Trash2,
  AlertCircle,
  X,
} from 'lucide-react';

interface Props {
  tasks: Task[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onAddTaskWithStatus?: (status: TaskStatus) => void;
  onPlayVideoInstruction?: (instruction: VideoInstruction, task: Task) => void;
}

const STAGES: {
  id: TaskStatus;
  label: string;
  description: string;
  color: string;
  borderColor: string;
  bgLight: string;
  bgDark: string;
}[] = [
  {
    id: 'backlog',
    label: 'Backlog',
    description: 'Upcoming tasks queued for triage & sprint planning',
    color: '#64748b',
    borderColor: 'border-slate-400',
    bgLight: 'bg-slate-50',
    bgDark: 'dark:bg-zinc-900/40',
  },
  {
    id: 'in_progress',
    label: 'In Progress',
    description: 'Actively in production and development',
    color: '#f59e0b',
    borderColor: 'border-amber-500',
    bgLight: 'bg-amber-50/40',
    bgDark: 'dark:bg-amber-950/20',
  },
  {
    id: 'in_review',
    label: 'In Review',
    description: 'Internal QA & creative peer evaluation',
    color: '#6366f1',
    borderColor: 'border-indigo-500',
    bgLight: 'bg-indigo-50/40',
    bgDark: 'dark:bg-indigo-950/20',
  },
  {
    id: 'ready_for_approval',
    label: 'Ready for Approval',
    description: 'Awaiting stakeholder or client sign-off',
    color: '#0ea5e9',
    borderColor: 'border-sky-500',
    bgLight: 'bg-sky-50/40',
    bgDark: 'dark:bg-sky-950/20',
  },
  {
    id: 'completed',
    label: 'Completed',
    description: 'Finished, verified, and shipped deliverables',
    color: '#10b981',
    borderColor: 'border-emerald-500',
    bgLight: 'bg-emerald-50/40',
    bgDark: 'dark:bg-emerald-950/20',
  },
];

export const BoardView: React.FC<Props> = ({
  tasks,
  users,
  onSelectTask,
  onUpdateTask,
  onAddTaskWithStatus,
  onPlayVideoInstruction,
}) => {
  // Default to 'vertical-pipeline' as explicitly requested: vertical scroll instead of horizontal
  const [viewLayout, setViewLayout] = useState<'vertical-pipeline' | 'responsive-grid'>('vertical-pipeline');
  const [collapsedStages, setCollapsedStages] = useState<Record<string, boolean>>({});
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Quick inline title editing state for admins
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskTitle, setEditingTaskTitle] = useState('');

  const toggleStageCollapse = (stageId: string) => {
    setCollapsedStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((t) => t.status === status);
  };

  const moveTask = (task: Task, direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIndex = STAGES.findIndex((c) => c.id === task.status);
    if (direction === 'prev' && currentIndex > 0) {
      const newStatus = STAGES[currentIndex - 1].id;
      onUpdateTask({ ...task, status: newStatus, updatedAt: new Date().toISOString() });
    } else if (direction === 'next' && currentIndex < STAGES.length - 1) {
      const newStatus = STAGES[currentIndex + 1].id;
      onUpdateTask({ ...task, status: newStatus, updatedAt: new Date().toISOString() });
    }
  };

  const toggleTaskComplete = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextStatus: TaskStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    onUpdateTask({ ...task, status: nextStatus, updatedAt: new Date().toISOString() });
  };

  const handleStartEditTitle = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTaskId(task.id);
    setEditingTaskTitle(task.title);
  };

  const handleSaveTitle = (task: Task, e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (!editingTaskTitle.trim()) {
      setEditingTaskId(null);
      return;
    }
    onUpdateTask({
      ...task,
      title: editingTaskTitle.trim(),
      updatedAt: new Date().toISOString(),
    });
    setEditingTaskId(null);
  };

  // Render a Single Rich Task Card (anti-blank container, highly styled and tactile)
  const renderTaskCard = (task: Task, stageColor: string) => {
    const assignee = users.find((u) => u.id === task.assigneeId);
    const completedSubs = task.subtasks.filter((s) => s.completed).length;
    const taskImages = task.attachments.filter(
      (a) => a.type === 'image' || a.url.startsWith('data:image')
    );

    return (
      <div
        key={task.id}
        onClick={() => onSelectTask(task)}
        className="group relative bg-white dark:bg-[#111319] border border-slate-200/90 dark:border-white/[0.08] hover:border-indigo-500/50 dark:hover:border-indigo-500/40 rounded-xl p-3.5 shadow-2xs hover:shadow-md dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-all cursor-pointer flex flex-col justify-between gap-3 text-slate-900 dark:text-zinc-100"
      >
        {/* Subtle stage indicator strip on left */}
        <div
          className="absolute left-0 top-3.5 bottom-3.5 w-1 rounded-r-md transition-opacity"
          style={{ backgroundColor: stageColor }}
        />

        <div className="pl-1">
          {/* Card Top Row: Priority & Quick Stage Move Controls */}
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                task.priority === 'urgent'
                  ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50'
                  : task.priority === 'high'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-900/50'
                  : 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  task.priority === 'urgent'
                    ? 'bg-rose-500'
                    : task.priority === 'high'
                    ? 'bg-amber-500'
                    : 'bg-slate-400'
                }`}
              />
              <span>{task.priority}</span>
            </span>

            {/* Quick Actions (Move previous, Edit, Move next) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                type="button"
                onClick={(e) => handleStartEditTitle(task, e)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                title="Quick edit task title"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => moveTask(task, 'prev', e)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                title="Move to previous workflow stage"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={(e) => moveTask(task, 'next', e)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 transition-colors"
                title="Move to next workflow stage"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title row with complete-toggle */}
          <div className="flex items-start gap-2.5">
            <button
              type="button"
              onClick={(e) => toggleTaskComplete(task, e)}
              className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                task.status === 'completed'
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : 'border-slate-300 dark:border-zinc-600 text-transparent hover:border-emerald-500'
              }`}
            >
              <Check className="w-2.5 h-2.5 stroke-[3]" />
            </button>

            {editingTaskId === task.id ? (
              <div
                className="flex items-center gap-1.5 flex-1"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="text"
                  autoFocus
                  value={editingTaskTitle}
                  onChange={(e) => setEditingTaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveTitle(task, e);
                    else if (e.key === 'Escape') setEditingTaskId(null);
                  }}
                  className="w-full text-xs font-medium px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-indigo-500 text-slate-900 dark:text-zinc-100 outline-none"
                />
                <button
                  type="button"
                  onClick={(e) => handleSaveTitle(task, e)}
                  className="px-2 py-1 bg-indigo-600 text-white rounded text-[11px] font-semibold"
                >
                  Save
                </button>
              </div>
            ) : (
              <h4
                className={`text-[13.5px] font-semibold leading-snug line-clamp-2 ${
                  task.status === 'completed'
                    ? 'line-through text-slate-400 dark:text-zinc-500'
                    : 'text-slate-900 dark:text-zinc-100'
                }`}
              >
                {task.title}
              </h4>
            )}
          </div>

          {/* Description Preview (if present) */}
          {task.description && (
            <p className="mt-1.5 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Attached Images Thumbnail Preview Strip */}
          {taskImages.length > 0 && (
            <div className="mt-2.5 flex items-center gap-2 overflow-hidden">
              {taskImages.slice(0, 3).map((img) => (
                <div
                  key={img.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(img.url);
                  }}
                  className="relative w-12 h-9 rounded-lg overflow-hidden border border-slate-200 dark:border-white/[0.1] bg-slate-100 dark:bg-zinc-800 shrink-0 hover:opacity-90 transition-opacity"
                  title="Click to view image"
                >
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                </div>
              ))}
              {taskImages.length > 3 && (
                <span className="text-[11px] text-slate-400 dark:text-zinc-500 font-mono">
                  +{taskImages.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Video Directive Badge */}
          {task.videoInstructions.length > 0 && (
            <div
              className="mt-2.5 p-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50 flex items-center justify-between hover:bg-indigo-100/60 dark:hover:bg-indigo-900/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onPlayVideoInstruction?.(task.videoInstructions[0], task);
              }}
            >
              <div className="flex items-center gap-1.5 text-[11px] text-indigo-700 dark:text-indigo-300 font-medium truncate">
                <Video className="w-3.5 h-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                <span className="truncate">{task.videoInstructions[0].targetSection}</span>
              </div>
              <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-300 bg-white dark:bg-zinc-900 px-1.5 py-0.5 rounded shadow-2xs">
                {task.videoInstructions[0].timestampFormatted}
              </span>
            </div>
          )}

          {/* Subtask Progress Track */}
          {task.subtasks.length > 0 && (
            <div className="mt-2.5 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-zinc-500">
                  Subtasks
                </span>
                <span>
                  {completedSubs}/{task.subtasks.length}
                </span>
              </div>
              <div className="w-full h-1 bg-slate-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{ width: `${(completedSubs / task.subtasks.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Card Footer: Assignee & Meta */}
        <div className="pt-2 pl-1 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500 dark:text-zinc-400">
          {/* Assignee */}
          <div className="flex items-center gap-1.5 truncate max-w-[120px]">
            {assignee ? (
              <>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-2xs"
                  style={{ backgroundColor: assignee.color || '#4f46e5' }}
                  title={assignee.name}
                >
                  {assignee.initials}
                </div>
                <span className="truncate text-slate-700 dark:text-zinc-300">
                  {assignee.name.split(' ')[0]}
                </span>
              </>
            ) : (
              <span className="text-slate-400 dark:text-zinc-500">Unassigned</span>
            )}
          </div>

          {/* Comments & Due Date */}
          <div className="flex items-center gap-2.5 shrink-0">
            {task.comments.length > 0 && (
              <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400 dark:text-zinc-500">
                <MessageSquare className="w-3 h-3" />
                <span>{task.comments.length}</span>
              </span>
            )}

            {task.dueDate && (
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                <Calendar className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                <span>{task.dueDate}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col space-y-4 select-none pb-16 font-sans overflow-x-hidden">
      {/* Top Controls: Layout switcher & Workflow overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400">
          <span className="font-semibold text-slate-900 dark:text-white">Workflow Pipeline</span>
          <span>•</span>
          <span className="font-mono">{tasks.length} tasks total</span>
        </div>

        {/* Layout Toggle: Vertical Pipeline (default) vs Vertical Multi-Column */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-200/70 dark:bg-zinc-800/80 text-xs font-medium self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewLayout('vertical-pipeline')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              viewLayout === 'vertical-pipeline'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Vertical Pipeline</span>
          </button>

          <button
            type="button"
            onClick={() => setViewLayout('responsive-grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${
              viewLayout === 'responsive-grid'
                ? 'bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-2xs font-semibold'
                : 'text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Vertical Columns</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: Vertical Stages Pipeline (Top-to-Bottom Vertical Flow with Zero Horizontal Scroll) */}
      {viewLayout === 'vertical-pipeline' ? (
        <div className="space-y-4 w-full">
          {STAGES.map((stage) => {
            const stageTasks = getTasksByStatus(stage.id);
            const isCollapsed = collapsedStages[stage.id];

            return (
              <div
                key={stage.id}
                className="w-full bg-slate-50/70 dark:bg-[#0c0e14] border border-slate-200/90 dark:border-white/[0.08] rounded-xl overflow-hidden transition-all shadow-2xs"
              >
                {/* Stage Header Accordion Bar */}
                <div
                  onClick={() => toggleStageCollapse(stage.id)}
                  className="px-4 py-3 bg-white/70 dark:bg-[#111319]/70 border-b border-slate-200/80 dark:border-white/[0.06] flex items-center justify-between cursor-pointer hover:bg-white dark:hover:bg-[#111319] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: stage.color }}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                          {stage.label}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/70 dark:border-white/[0.08]">
                          {stageTasks.length}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                        {stage.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onAddTaskWithStatus?.(stage.id)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-200 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleStageCollapse(stage.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isCollapsed ? '-rotate-90' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Stage Task Cards in a Clean Vertical Responsive Flow */}
                {!isCollapsed && (
                  <div className="p-4">
                    {stageTasks.length === 0 ? (
                      <div className="py-6 rounded-xl border border-dashed border-slate-200 dark:border-white/[0.08] text-center text-xs text-slate-400 dark:text-zinc-500">
                        No tasks currently in {stage.label.toLowerCase()}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                        {stageTasks.map((task) => renderTaskCard(task, stage.color))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* VIEW MODE 2: Vertical Responsive Multi-Column Grid (Fits viewport width, scrolls vertically) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start w-full">
          {STAGES.map((stage) => {
            const stageTasks = getTasksByStatus(stage.id);

            return (
              <div
                key={stage.id}
                className="w-full flex flex-col bg-slate-100/70 dark:bg-[#0c0e14] border border-slate-200/90 dark:border-white/[0.08] rounded-xl p-3 space-y-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                      {stage.label}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.2 rounded-full bg-white dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200/70 dark:border-white/[0.08]">
                      {stageTasks.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddTaskWithStatus?.(stage.id)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-zinc-800 transition-colors"
                    title={`Add task to ${stage.label}`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Tasks List within column */}
                <div className="space-y-3 min-h-[80px]">
                  {stageTasks.length === 0 ? (
                    <div className="p-4 rounded-lg border border-dashed border-slate-300 dark:border-white/[0.08] text-center text-xs text-slate-400 dark:text-zinc-500">
                      No tasks in {stage.label.toLowerCase()}
                    </div>
                  ) : (
                    stageTasks.map((task) => renderTaskCard(task, stage.color))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] bg-black/90 rounded-2xl overflow-hidden shadow-2xl border border-white/20"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={lightboxImage}
              alt="Enlarged attachment preview"
              className="max-w-full max-h-[85vh] object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
