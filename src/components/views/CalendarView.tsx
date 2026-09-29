import React, { useState } from 'react';
import { Task, User } from '../../types';
import { ChevronLeft, ChevronRight, Video, Plus } from 'lucide-react';

interface Props {
  tasks: Task[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onAddTaskWithDate?: (dateStr: string) => void;
}

export const CalendarView: React.FC<Props> = ({
  tasks,
  users,
  onSelectTask,
  onAddTaskWithDate,
}) => {
  const [currentMonth] = useState('September 2026');

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthDays = Array.from({ length: 30 }, (_, i) => {
    const day = i + 1;
    const dateStr = `2026-09-${day < 10 ? '0' + day : day}`;
    return {
      day,
      dateStr,
      isCurrentMonth: true,
    };
  });

  const leadingSlots = [null, null];

  return (
    <div className="bg-[#ffffff] border border-[#e7e7e7] rounded-[12px] overflow-hidden shadow-none select-none">
      {/* Calendar Header Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7e7e7]">
        <h3 className="text-[16px] font-medium text-[#0d0d0d]">
          {currentMonth}
        </h3>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-full hover:bg-[#f3f3f3] text-[#646f79]">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px] font-medium px-2 text-[#0d0d0d]">
            Today
          </span>
          <button className="p-1.5 rounded-full hover:bg-[#f3f3f3] text-[#646f79]">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 border-b border-[#e7e7e7] bg-[#fbfbfb] text-[11px] font-medium uppercase tracking-wider text-[#646f79] text-center py-2">
        {weekDays.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {/* Calendar Grid Cells */}
      <div className="grid grid-cols-7 divide-x divide-y divide-[#e7e7e7] min-h-[500px]">
        {leadingSlots.map((_, i) => (
          <div key={`lead_${i}`} className="bg-[#fbfbfb] min-h-[90px]" />
        ))}

        {monthDays.map((d) => {
          const dayTasks = tasks.filter((t) => t.dueDate === d.dateStr);

          return (
            <div
              key={d.dateStr}
              className="p-2 min-h-[90px] flex flex-col justify-between hover:bg-[#fbfbfb] transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-mono font-medium text-[#646f79]">
                  {d.day}
                </span>
                <button
                  type="button"
                  onClick={() => onAddTaskWithDate?.(d.dateStr)}
                  className="opacity-0 group-hover:opacity-100 p-0.5 text-[#9ca6af] hover:text-[#0d0d0d] rounded"
                  title="Add task on this day"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks in this day */}
              <div className="space-y-1 mt-1 flex-1">
                {dayTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onSelectTask(t)}
                    className="p-1.5 rounded-[999px] text-[11px] font-normal truncate cursor-pointer transition-all bg-[#f3f3f3] hover:bg-[#e7e7e7] text-[#0d0d0d] border border-[#e7e7e7] flex items-center justify-between gap-1"
                  >
                    <span className="truncate pl-1">{t.title}</span>
                    {t.videoInstructions.length > 0 && (
                      <Video className="w-3 h-3 text-[#222875] shrink-0 pr-1" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
