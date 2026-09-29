import React from 'react';
import { Task, User, VideoInstruction } from '../../types';
import { Video, Calendar } from 'lucide-react';

interface Props {
  tasks: Task[];
  users: User[];
  onSelectTask: (task: Task) => void;
  onPlayVideoInstruction?: (instruction: VideoInstruction, task: Task) => void;
}

export const GalleryView: React.FC<Props> = ({
  tasks,
  users,
  onSelectTask,
  onPlayVideoInstruction,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 select-none">
      {tasks.map((task) => {
        const assignee = users.find((u) => u.id === task.assigneeId);
        const hasVideo = task.videoInstructions.length > 0;
        const videoInst = hasVideo ? task.videoInstructions[0] : null;

        return (
          <div
            key={task.id}
            onClick={() => onSelectTask(task)}
            className="group bg-[#ffffff] border border-[#e7e7e7] rounded-[12px] overflow-hidden hover:border-[#646f79] transition-all cursor-pointer flex flex-col shadow-none"
          >
            {/* Gallery Cover / Visual Banner */}
            <div className="h-32 w-full bg-[#f3f3f3] relative overflow-hidden flex items-center justify-center">
              {hasVideo ? (
                <div className="absolute inset-0 bg-[#222875] flex flex-col justify-end p-3 text-white">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#cbefff] font-medium mb-0.5">
                    <Video className="w-3.5 h-3.5 text-[#cbefff]" />
                    <span>{videoInst?.targetSection}</span>
                  </div>
                  <span className="font-mono text-[10px] text-[#ffffff]/80">
                    Marker: @{videoInst?.timestampFormatted}
                  </span>
                </div>
              ) : (
                <div className="absolute inset-0 bg-[#fbfbfb] flex items-center justify-center border-b border-[#e7e7e7]">
                  <span className="text-[20px] font-bold text-[#e0dedc] select-none font-sans">
                    {task.title.slice(0, 2).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Status pill overlay */}
              <div className="absolute top-2.5 right-2.5">
                <span className="text-[10px] font-medium uppercase tracking-wide px-2 py-0.5 rounded-[999px] bg-[#ffffff] text-[#0d0d0d] border border-[#e7e7e7]">
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4 flex-1 flex flex-col justify-between gap-3">
              <div>
                <h4 className="text-[14px] font-medium text-[#0d0d0d] line-clamp-2 leading-[1.3]">
                  {task.title}
                </h4>
                <p className="text-[12px] text-[#646f79] font-light line-clamp-2 mt-1 leading-[1.4]">
                  {task.description}
                </p>
              </div>

              {/* Tags in Asana Coral Blush */}
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-normal px-2 py-0.5 rounded-[999px] bg-[#ffeaec] text-[#690031]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-[#f3f3f3] flex items-center justify-between text-[12px] text-[#646f79]">
                <div className="flex items-center gap-1 font-mono text-[11px]">
                  <Calendar className="w-3 h-3" />
                  <span>{task.dueDate || 'No date'}</span>
                </div>

                {assignee && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium text-white shadow-none"
                    style={{ backgroundColor: assignee.color || '#222875' }}
                    title={assignee.name}
                  >
                    {assignee.initials}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
