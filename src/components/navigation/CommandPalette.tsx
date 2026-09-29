import React, { useState, useEffect } from 'react';
import { Task, Project, User } from '../../types';
import {
  Search,
  CheckSquare,
  Folder,
  Video,
  Database,
  Sun,
} from 'lucide-react';

interface Props {
  tasks: Task[];
  projects: Project[];
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onSelectTask: (task: Task) => void;
  onSelectProject: (projectId: string) => void;
  onToggleTheme: () => void;
  onOpenSecurityModal: () => void;
  onOpenNewTaskModal: () => void;
}

export const CommandPalette: React.FC<Props> = ({
  tasks,
  projects,
  isOpen,
  onClose,
  onSelectTask,
  onSelectProject,
  onToggleTheme,
  onOpenSecurityModal,
  onOpenNewTaskModal,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) ||
    t.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-[#0d0d0d]/60 backdrop-blur-xs select-none">
      <div className="relative w-full max-w-xl bg-[#ffffff] border border-[#e7e7e7] rounded-[20px] shadow-none overflow-hidden flex flex-col">
        {/* Search input bar */}
        <div className="flex items-center px-5 py-3.5 border-b border-[#e7e7e7] gap-3">
          <Search className="w-4 h-4 text-[#646f79] shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, task title, or project..."
            className="flex-1 bg-transparent text-[14px] text-[#0d0d0d] placeholder:text-[#9ca6af] focus:outline-hidden font-normal"
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9ca6af] hover:text-[#0d0d0d] text-[11px] font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-3">
          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#646f79]">
              Quick actions
            </div>
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  onOpenNewTaskModal();
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] font-normal text-[#0d0d0d] hover:bg-[#f3f3f3] transition-colors text-left"
              >
                <CheckSquare className="w-4 h-4 text-[#ff584a]" />
                <span>Create new task</span>
              </button>
              <button
                onClick={() => {
                  onOpenSecurityModal();
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] font-normal text-[#0d0d0d] hover:bg-[#f3f3f3] transition-colors text-left"
              >
                <Database className="w-4 h-4 text-[#222875]" />
                <span>Inspect GoDaddy SQL schema & REST API</span>
              </button>
              <button
                onClick={() => {
                  onToggleTheme();
                  onClose();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] font-normal text-[#0d0d0d] hover:bg-[#f3f3f3] transition-colors text-left"
              >
                <Sun className="w-4 h-4 text-[#ff584a]" />
                <span>Toggle theme</span>
              </button>
            </div>
          </div>

          {/* Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#646f79]">
                Projects
              </div>
              <div className="space-y-0.5">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p.id);
                      onClose();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-[8px] text-[13px] font-normal text-[#0d0d0d] hover:bg-[#f3f3f3] transition-colors text-left"
                  >
                    <Folder className="w-4 h-4 text-[#222875]" />
                    <span className="truncate">{p.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[#646f79]">
                Tasks
              </div>
              <div className="space-y-0.5">
                {filteredTasks.slice(0, 8).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onSelectTask(t);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[13px] font-normal text-[#0d0d0d] hover:bg-[#f3f3f3] transition-colors text-left group"
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#9ca6af] group-hover:bg-[#ff584a]" />
                      <span className="truncate">{t.title}</span>
                    </div>
                    {t.videoInstructions.length > 0 && (
                      <span className="text-[11px] text-[#222875] bg-[#cbefff] px-2 py-0.5 rounded-[999px] flex items-center gap-1 font-medium shrink-0">
                        <Video className="w-3 h-3 text-[#222875]" />
                        <span>Intro clip</span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
