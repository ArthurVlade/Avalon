import React, { useState } from 'react';
import { Project, ViewType, User } from '../../types';
import { X, Folder, Sparkles, Trash2, Save } from 'lucide-react';

interface Props {
  project: Project;
  users: User[];
  onClose: () => void;
  onUpdateProject: (updated: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

export const EditProjectModal: React.FC<Props> = ({
  project,
  users,
  onClose,
  onUpdateProject,
  onDeleteProject,
}) => {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [color, setColor] = useState(project.color);
  const [defaultView, setDefaultView] = useState<ViewType>(project.defaultView);
  const [stakeholderIds, setStakeholderIds] = useState<string[]>(project.stakeholderIds || []);

  const colorPresets = [
    '#6366f1', // Indigo
    '#ff584a', // Avalon Coral
    '#10b981', // Emerald
    '#f59e0b', // Amber
    '#8b5cf6', // Violet
    '#06b6d4', // Cyan
    '#ec4899', // Pink
  ];

  const handleToggleStakeholder = (userId: string) => {
    if (stakeholderIds.includes(userId)) {
      setStakeholderIds(stakeholderIds.filter((id) => id !== userId));
    } else {
      setStakeholderIds([...stakeholderIds, userId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onUpdateProject({
      ...project,
      title: title.trim(),
      description: description.trim(),
      color,
      defaultView,
      stakeholderIds,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg bg-white dark:bg-[#11141c] border border-slate-200 dark:border-[#252b3b] rounded-2xl shadow-2xl overflow-hidden text-[#0d0d0d] dark:text-[#f8fafc]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#252b3b] bg-slate-50/70 dark:bg-[#181c26]">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: color }}
            >
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#0d0d0d] dark:text-white">
                Edit Project Settings
              </h3>
              <p className="text-[11px] text-[#646f79] dark:text-[#94a3b8]">
                Admins can modify project parameters, color code, and assign stakeholders.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-[13px]">
          <div>
            <label className="block text-[12px] font-semibold text-[#0d0d0d] dark:text-white mb-1">
              Project Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#252b3b] bg-white dark:bg-[#181c26] text-[#0d0d0d] dark:text-white font-medium"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#0d0d0d] dark:text-white mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#252b3b] bg-white dark:bg-[#181c26] text-[#0d0d0d] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#0d0d0d] dark:text-white mb-1">
              Theme Accent Color
            </label>
            <div className="flex items-center gap-2">
              {colorPresets.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    color === c ? 'ring-2 ring-offset-2 ring-[#0d0d0d] dark:ring-white scale-110' : ''
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#0d0d0d] dark:text-white mb-1">
              Default Database View
            </label>
            <select
              value={defaultView}
              onChange={(e) => setDefaultView(e.target.value as ViewType)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-[#252b3b] bg-white dark:bg-[#181c26] text-[#0d0d0d] dark:text-white"
            >
              <option value="board">Kanban Board</option>
              <option value="table">Table (Spreadsheet)</option>
              <option value="list">Hierarchical List</option>
              <option value="timeline">Gantt Timeline</option>
              <option value="calendar">Monthly Calendar</option>
              <option value="gallery">Visual Gallery</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-[#0d0d0d] dark:text-white mb-1">
              Assign Executive Stakeholders for Approval
            </label>
            <div className="space-y-1.5 max-h-32 overflow-y-auto p-2 rounded-lg bg-slate-50 dark:bg-[#181c26] border border-slate-200 dark:border-[#252b3b]">
              {users.map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-2 p-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={stakeholderIds.includes(u.id)}
                    onChange={() => handleToggleStakeholder(u.id)}
                    className="rounded text-indigo-600"
                  />
                  <span className="font-medium text-[#0d0d0d] dark:text-white">{u.name}</span>
                  <span className="text-[11px] text-slate-400">({u.role.replace('_', ' ')})</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#252b3b]">
            {onDeleteProject && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this project and all associated tasks?')) {
                    onDeleteProject(project.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg text-[12px] font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Project</span>
              </button>
            )}

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-800 dark:hover:text-white text-[12px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0d0d0d] dark:bg-white text-white dark:text-black rounded-full text-[12px] font-medium hover:opacity-90 transition-opacity"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
