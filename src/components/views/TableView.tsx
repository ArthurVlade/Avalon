import React, { useState } from 'react';
import { Task, User, TaskStatus, TaskPriority } from '../../types';
import {
  ArrowUpDown,
  Video,
  CheckCircle2,
  Plus,
  Layers,
} from 'lucide-react';

interface Props {
  tasks: Task[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onAddTask: () => void;
}

export const TableView: React.FC<Props> = ({
  tasks,
  users,
  onSelectTask,
  onUpdateTask,
  onAddTask,
}) => {
  const [sortField, setSortField] = useState<keyof Task>('dueDate');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    const valA = a[sortField] || '';
    const valB = b[sortField] || '';
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return <span className="text-[#0d0d0d] font-normal">Completed</span>;
      case 'ready_for_approval':
        return <span className="text-[#690031] bg-[#ffeaec] px-2 py-0.5 rounded-[999px] font-medium text-[11px]">Pending sign-off</span>;
      case 'in_review':
        return <span className="text-[#222875] bg-[#cbefff] px-2 py-0.5 rounded-[999px] font-medium text-[11px]">In review</span>;
      case 'in_progress':
        return <span className="text-[#0d0d0d] font-normal">In progress</span>;
      case 'backlog':
      default:
        return <span className="text-[#9ca6af] font-normal">Backlog</span>;
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return <span className="text-[#690031] font-medium">Urgent</span>;
      case 'high':
        return <span className="text-[#ff584a] font-normal">High</span>;
      case 'medium':
        return <span className="text-[#646f79] font-normal">Medium</span>;
      case 'low':
      default:
        return <span className="text-[#9ca6af] font-normal">Low</span>;
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-[12px] border border-[#e7e7e7] bg-[#ffffff] shadow-none">
      <table className="w-full text-left text-[13px] border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-[#e7e7e7] bg-[#fbfbfb] text-[#646f79] uppercase tracking-wider text-[11px] font-medium select-none">
            <th className="py-2.5 px-4 w-12 text-center">Done</th>
            <th
              className="py-2.5 px-4 cursor-pointer hover:text-[#0d0d0d]"
              onClick={() => handleSort('title')}
            >
              <div className="flex items-center gap-1.5">
                <span>Task name</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="py-2.5 px-4 cursor-pointer hover:text-[#0d0d0d]"
              onClick={() => handleSort('status')}
            >
              <div className="flex items-center gap-1.5">
                <span>Status</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th
              className="py-2.5 px-4 cursor-pointer hover:text-[#0d0d0d]"
              onClick={() => handleSort('priority')}
            >
              <div className="flex items-center gap-1.5">
                <span>Priority</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-2.5 px-4">Assignee</th>
            <th
              className="py-2.5 px-4 cursor-pointer hover:text-[#0d0d0d]"
              onClick={() => handleSort('dueDate')}
            >
              <div className="flex items-center gap-1.5">
                <span>Due date</span>
                <ArrowUpDown className="w-3 h-3" />
              </div>
            </th>
            <th className="py-2.5 px-4">Subtasks</th>
            <th className="py-2.5 px-4">Video instruction</th>
            <th className="py-2.5 px-4">Approval</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-[#e7e7e7] font-sans">
          {sortedTasks.map((task) => {
            const assignee = users.find((u) => u.id === task.assigneeId);
            const completedSubCount = task.subtasks.filter((s) => s.completed).length;

            return (
              <tr
                key={task.id}
                className="hover:bg-[#f3f3f3]/60 transition-colors group cursor-pointer h-[40px]"
                onClick={() => onSelectTask(task)}
              >
                {/* Complete checkbox */}
                <td
                  className="py-2 px-4 text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newStatus: TaskStatus =
                      task.status === 'completed' ? 'in_progress' : 'completed';
                    onUpdateTask({ ...task, status: newStatus, updatedAt: new Date().toISOString() });
                  }}
                >
                  <button type="button" className="text-[#9ca6af] hover:text-[#0d0d0d] transition-colors">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="w-4 h-4 text-[#ff584a]" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-[#9ca6af] group-hover:border-[#0d0d0d]" />
                    )}
                  </button>
                </td>

                {/* Title */}
                <td className="py-2 px-4 font-normal text-[#0d0d0d] max-w-sm truncate">
                  <div className="flex items-center gap-2">
                    <span className={task.status === 'completed' ? 'line-through text-[#9ca6af]' : ''}>
                      {task.title}
                    </span>
                    {task.isMilestone && (
                      <span className="text-[10px] font-medium px-2 py-0.2 rounded-[999px] bg-[#f3f3f3] text-[#0d0d0d] border border-[#e7e7e7]">
                        Milestone
                      </span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="py-2 px-4 whitespace-nowrap">
                  {getStatusBadge(task.status)}
                </td>

                {/* Priority */}
                <td className="py-2 px-4 whitespace-nowrap text-[12px]">
                  {getPriorityBadge(task.priority)}
                </td>

                {/* Assignee */}
                <td className="py-2 px-4 whitespace-nowrap">
                  {assignee ? (
                    <div className="flex items-center gap-1.5">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium text-white shadow-none"
                        style={{ backgroundColor: assignee.color || '#222875' }}
                      >
                        {assignee.initials}
                      </div>
                      <span className="text-[#3d3d3d] truncate max-w-[110px] font-light">
                        {assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#9ca6af] italic font-light">Unassigned</span>
                  )}
                </td>

                {/* Due Date */}
                <td className="py-2 px-4 whitespace-nowrap text-[#646f79] font-mono text-[12px]">
                  {task.dueDate || '—'}
                </td>

                {/* Subtasks */}
                <td className="py-2 px-4 whitespace-nowrap">
                  {task.subtasks.length > 0 ? (
                    <div className="flex items-center gap-1 text-[#646f79] text-[12px]">
                      <Layers className="w-3.5 h-3.5 text-[#9ca6af]" />
                      <span className="font-mono">
                        {completedSubCount}/{task.subtasks.length}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[#9ca6af]">—</span>
                  )}
                </td>

                {/* Video Instructions */}
                <td className="py-2 px-4 whitespace-nowrap">
                  {task.videoInstructions.length > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[999px] bg-[#cbefff] text-[#222875] font-medium text-[11px]">
                      <Video className="w-3 h-3 text-[#222875]" />
                      <span>{task.videoInstructions.length} clip{task.videoInstructions.length > 1 ? 's' : ''}</span>
                    </span>
                  ) : (
                    <span className="text-[#9ca6af]">—</span>
                  )}
                </td>

                {/* Approval */}
                <td className="py-2 px-4 whitespace-nowrap">
                  {task.requiresApproval ? (
                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-[999px] inline-flex items-center gap-1 ${
                        task.approvalStatus === 'approved'
                          ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : task.approvalStatus === 'pending'
                          ? 'text-[#690031] bg-[#ffeaec] dark:bg-[#381622] dark:text-[#fb7185]'
                          : 'text-[#646f79] bg-[#f3f3f3] dark:bg-slate-800'
                      }`}
                    >
                      {task.approvalStatus === 'approved' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Approved</span>
                        </>
                      ) : (
                        <span>Pending sign-off</span>
                      )}
                    </span>
                  ) : (
                    <span className="text-[#9ca6af]">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Quick Add Row Button */}
      <button
        onClick={onAddTask}
        className="w-full py-2.5 px-4 flex items-center gap-2 text-[13px] font-normal text-[#646f79] hover:text-[#0d0d0d] hover:bg-[#f3f3f3] border-t border-[#e7e7e7] transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add task...</span>
      </button>
    </div>
  );
};
