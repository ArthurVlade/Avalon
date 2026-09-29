import React, { useState, useEffect, useRef } from 'react';
import { Project, ViewType, User } from '../../types';
import { X, Folder } from 'lucide-react';
import { sanitizeHtml } from '../../utils/security';

interface Props {
  organizationId: string;
  workspaceId: string;
  users: User[];
  onAddProject: (project: Project) => void;
  onClose: () => void;
}

export const NewProjectModal: React.FC<Props> = ({
  organizationId,
  workspaceId,
  users,
  onAddProject,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#ff584a');
  const [defaultView, setDefaultView] = useState<ViewType>('board');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const colors = [
    '#ff584a', // coral ember
    '#4338ca', // asana violet
    '#059669', // emerald
    '#d97706', // amber
    '#0284c7', // sky
    '#e11d48', // rose
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      organizationId,
      workspaceId,
      title: title.trim(),
      description: description.trim(),
      icon: 'Folder',
      color,
      defaultView,
      stakeholderIds: users.slice(0, 2).map((u) => u.id),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs select-none">
      <div
        ref={modalRef}
        className="relative w-full max-w-md bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-[20px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-[6px] flex items-center justify-center text-white"
              style={{ backgroundColor: color }}
            >
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                Create Project
              </h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 font-normal">
                Setup nested task workflows and views
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[13px]">
          <div>
            <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">
              Project title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Video Production Pipeline 2026"
              className="w-full px-3.5 py-2 rounded-md bg-white dark:bg-[#0c1018] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Objective, milestones, and deliverable specs..."
              className="w-full px-3.5 py-2 rounded-md bg-white dark:bg-[#0c1018] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Color & Default View */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">
                Accent color
              </label>
              <div className="flex gap-2 py-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      color === c ? 'scale-110 ring-2 ring-indigo-500 ring-offset-2' : ''
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">
                Default view
              </label>
              <select
                value={defaultView}
                onChange={(e) => setDefaultView(e.target.value as ViewType)}
                className="w-full px-3 py-1.5 rounded-md bg-white dark:bg-[#0c1018] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-normal focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              >
                <option value="board">Kanban Board</option>
                <option value="table">Table / Spreadsheet</option>
                <option value="list">Hierarchical List</option>
                <option value="timeline">Timeline / Gantt</option>
                <option value="calendar">Calendar</option>
                <option value="gallery">Gallery</option>
              </select>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-medium transition-colors shadow-xs"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
