import React, { useState } from 'react';
import { Task, User, TaskStatus, VideoInstruction } from '../../types';
import {
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Video,
  Plus,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  tasks: Task[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onAddTask: () => void;
  onPlayVideoInstruction?: (instruction: VideoInstruction, task: Task) => void;
}

export const ListView: React.FC<Props> = ({
  tasks,
  users,
  onSelectTask,
  onUpdateTask,
  onAddTask,
  onPlayVideoInstruction,
}) => {
  const [expandedTaskIds, setExpandedTaskIds] = useState<Record<string, boolean>>({
    task_1: true,
    task_2: true,
  });

  const toggleExpand = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTaskIds((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const toggleTaskStatus = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    const newStatus: TaskStatus = task.status === 'completed' ? 'in_progress' : 'completed';
    onUpdateTask({ ...task, status: newStatus, updatedAt: new Date().toISOString() });
  };

  const toggleSubtask = (task: Task, subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedSubtasks = task.subtasks.map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="bg-[#ffffff] border border-[#e7e7e7] rounded-[12px] overflow-hidden shadow-none select-none">
      {/* List Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#fbfbfb] border-b border-[#e7e7e7] text-[11px] font-medium uppercase tracking-wider text-[#646f79]">
        <div className="flex items-center gap-2">
          <span>Task name & subtasks</span>
        </div>
        <div className="flex items-center gap-6">
          <span className="w-24 text-right">Due date</span>
          <span className="w-28 text-right">Assignee</span>
          <span className="w-24 text-right">Status</span>
        </div>
      </div>

      {/* Task Rows */}
      <div className="divide-y divide-[#e7e7e7] font-sans">
        {tasks.map((task) => {
          const isExpanded = !!expandedTaskIds[task.id];
          const hasSubtasks = task.subtasks.length > 0;
          const assignee = users.find((u) => u.id === task.assigneeId);

          return (
            <div key={task.id} className="group">
              {/* Primary Task Row */}
              <div
                onClick={() => onSelectTask(task)}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#f3f3f3]/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5 flex-1 min-w-0 pr-4">
                  {/* Expand Chevron */}
                  <button
                    type="button"
                    onClick={(e) => toggleExpand(task.id, e)}
                    className={`p-1 rounded-[4px] hover:bg-[#e7e7e7] text-[#9ca6af] ${
                      !hasSubtasks ? 'invisible' : ''
                    }`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Complete checkbox */}
                  <button
                    type="button"
                    onClick={(e) => toggleTaskStatus(task, e)}
                    className="text-[#9ca6af] hover:text-[#0d0d0d] transition-colors shrink-0"
                  >
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#ff584a]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#9ca6af] group-hover:border-[#0d0d0d]" />
                    )}
                  </button>

                  {/* Title & Badges */}
                  <div className="flex items-center gap-2 truncate">
                    <span
                      className={`text-[13px] font-normal truncate ${
                        task.status === 'completed'
                          ? 'line-through text-[#9ca6af]'
                          : 'text-[#0d0d0d]'
                      }`}
                    >
                      {task.title}
                    </span>

                    {/* Video badge */}
                    {task.videoInstructions.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayVideoInstruction?.(task.videoInstructions[0], task);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[999px] text-[11px] font-medium bg-[#cbefff] text-[#222875] hover:bg-[#b2e6ff] transition-colors shrink-0"
                        title="Click to view video instruction for editor"
                      >
                        <Video className="w-3 h-3 text-[#222875]" />
                        <span>Intro clip ({task.videoInstructions[0].timestampFormatted})</span>
                      </button>
                    )}

                    {task.approvalStatus === 'pending' && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-[#690031] bg-[#ffeaec] px-2 py-0.5 rounded-[999px] shrink-0">
                        <ShieldCheck className="w-3 h-3 text-[#ff584a]" />
                        <span>Pending approval</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side metadata */}
                <div className="flex items-center gap-6 text-[12px] text-[#646f79] shrink-0">
                  <span className="w-24 text-right font-mono text-[11px]">
                    {task.dueDate || '—'}
                  </span>

                  <div className="w-28 flex justify-end items-center gap-1.5">
                    {assignee ? (
                      <>
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                          style={{ backgroundColor: assignee.color || '#222875' }}
                        >
                          {assignee.initials}
                        </div>
                        <span className="truncate max-w-[80px] text-[11px] font-light">
                          {assignee.name.split(' ')[0]}
                        </span>
                      </>
                    ) : (
                      <span className="text-[#9ca6af] italic text-[11px] font-light">Unassigned</span>
                    )}
                  </div>

                  <span className="w-24 text-right capitalize text-[11px] font-normal text-[#646f79]">
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Nested Subtasks Accordion */}
              {isExpanded && hasSubtasks && (
                <div className="bg-[#fbfbfb] pl-12 pr-4 py-2 border-t border-[#e7e7e7] space-y-1">
                  {task.subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between py-1 px-2 rounded-[6px] hover:bg-[#ffffff] text-[12px] text-[#3d3d3d] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleSubtask(task, sub.id, e)}
                          className="text-[#9ca6af] hover:text-[#0d0d0d] transition-colors"
                        >
                          {sub.completed ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#ff584a]" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-[#9ca6af]" />
                          )}
                        </button>
                        <span className={`font-light ${sub.completed ? 'line-through text-[#9ca6af]' : ''}`}>
                          {sub.title}
                        </span>
                      </div>
                      {sub.dueDate && (
                        <span className="font-mono text-[10px] text-[#646f79]">
                          {sub.dueDate}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Task footer */}
      <button
        type="button"
        onClick={onAddTask}
        className="w-full py-2.5 px-4 flex items-center gap-2 text-[13px] font-normal text-[#646f79] hover:text-[#0d0d0d] hover:bg-[#f3f3f3] border-t border-[#e7e7e7] transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add task...</span>
      </button>
    </div>
  );
};
