import React from 'react';
import { Task, User } from '../../types';
import { Video } from 'lucide-react';

interface Props {
  tasks: Task[];
  users: User[];
  onSelectTask: (task: Task) => void;
}

export const TimelineView: React.FC<Props> = ({ tasks, users, onSelectTask }) => {
  const days = Array.from({ length: 22 }, (_, i) => {
    const d = new Date(2026, 8, 18 + i);
    return {
      dateStr: d.toISOString().slice(0, 10),
      dayNum: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
    };
  });

  const getPositionPercent = (dateStr?: string) => {
    if (!dateStr) return 10;
    const baseDate = new Date('2026-09-18').getTime();
    const targetDate = new Date(dateStr).getTime();
    const diffDays = (targetDate - baseDate) / (1000 * 60 * 60 * 24);
    const clamped = Math.max(0, Math.min(21, diffDays));
    return (clamped / 21) * 100;
  };

  return (
    <div className="w-full bg-[#ffffff] border border-[#e7e7e7] rounded-[12px] overflow-x-auto shadow-none select-none">
      <div className="min-w-[900px]">
        {/* Timeline Header Days */}
        <div className="grid grid-cols-[280px_1fr] border-b border-[#e7e7e7] bg-[#fbfbfb] text-[12px] font-medium text-[#646f79]">
          <div className="p-3 border-r border-[#e7e7e7]">
            Task & dependencies
          </div>
          <div className="grid grid-cols-22 divide-x divide-[#e7e7e7] text-center text-[11px]">
            {days.map((d, i) => (
              <div
                key={i}
                className={`py-2 ${d.isWeekend ? 'bg-[#f3f3f3] text-[#9ca6af]' : ''}`}
              >
                <div className="font-light">{d.dayName}</div>
                <div className="font-mono font-medium">{d.dayNum}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Rows */}
        <div className="divide-y divide-[#e7e7e7] font-sans">
          {tasks.map((task) => {
            const startPct = getPositionPercent(task.startDate || task.createdAt);
            const endPct = getPositionPercent(task.dueDate);
            const widthPct = Math.max(8, endPct - startPct);

            return (
              <div
                key={task.id}
                onClick={() => onSelectTask(task)}
                className="grid grid-cols-[280px_1fr] hover:bg-[#f3f3f3]/50 transition-colors cursor-pointer group"
              >
                {/* Left Task Label */}
                <div className="p-3 border-r border-[#e7e7e7] flex items-center justify-between gap-2">
                  <div className="truncate">
                    <span className="text-[13px] font-normal text-[#0d0d0d] truncate block">
                      {task.title}
                    </span>
                    <span className="text-[11px] text-[#9ca6af] font-mono">
                      Due: {task.dueDate || 'Unscheduled'}
                    </span>
                  </div>
                  {task.dependencies.length > 0 && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-[999px] bg-[#ffeaec] text-[#690031] shrink-0 font-medium"
                      title="Has prerequisite blockers"
                    >
                      Linked
                    </span>
                  )}
                </div>

                {/* Right Gantt Bar Canvas */}
                <div className="relative py-2.5 px-2 flex items-center">
                  <div className="absolute inset-0 grid grid-cols-22 divide-x divide-[#f3f3f3] pointer-events-none" />

                  {/* Task Timeline Bar in Asana Violet or Coral */}
                  <div
                    className={`relative z-10 h-7 rounded-[999px] px-3 flex items-center justify-between gap-2 shadow-none transition-all ${
                      task.status === 'completed'
                        ? 'bg-[#0d0d0d] text-white'
                        : task.status === 'ready_for_approval'
                        ? 'bg-[#ff584a] text-white'
                        : 'bg-[#222875] text-white'
                    }`}
                    style={{
                      marginLeft: `${startPct}%`,
                      width: `${widthPct}%`,
                    }}
                  >
                    <span className="text-[12px] font-normal truncate">
                      {task.title}
                    </span>
                    {task.videoInstructions.length > 0 && (
                      <Video className="w-3 h-3 text-white/90 shrink-0" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
