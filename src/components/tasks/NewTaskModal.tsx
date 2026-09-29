import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskPriority, TaskStatus, User, Attachment } from '../../types';
import { X, CheckSquare, Image as ImageIcon, Trash2, ZoomIn } from 'lucide-react';

interface Props {
  organizationId: string;
  projectId: string;
  users: User[];
  currentUserId: string;
  initialStatus?: TaskStatus;
  initialDueDate?: string;
  onAddTask: (task: Task) => void;
  onClose: () => void;
}

export const NewTaskModal: React.FC<Props> = ({
  organizationId,
  projectId,
  users,
  currentUserId,
  initialStatus = 'backlog',
  initialDueDate = '',
  onAddTask,
  onClose,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [assigneeId, setAssigneeId] = useState<string>(users[0]?.id || 'none');
  const [dueDate, setDueDate] = useState<string>(initialDueDate || '2026-10-05');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [includeVideoInstruction, setIncludeVideoInstruction] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close on outside click or Escape
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

  // Image Processing for Clipboard Paste & File Pick
  const processImageFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const newAttachment: Attachment = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: file.name && file.name !== 'image.png'
          ? file.name
          : `Pasted_Image_${new Date().toLocaleTimeString().replace(/:/g, '-')}.png`,
        size: `${Math.round(file.size / 1024) || 15} KB`,
        type: 'image',
        url: dataUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'You',
      };

      setAttachments((prev) => [...prev, newAttachment]);
    };
    reader.readAsDataURL(file);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          processImageFile(file);
        }
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      processImageFile(files[i]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      organizationId,
      projectId,
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      assigneeId: assigneeId === 'none' ? undefined : assigneeId,
      creatorId: currentUserId,
      dueDate,
      requiresApproval,
      approvalStatus: requiresApproval ? 'pending' : 'none',
      tags: ['Sprint'],
      subtasks: [],
      dependencies: [],
      attachments,
      comments: [],
      videoInstructions: includeVideoInstruction
        ? [
            {
              id: `vi_${Date.now()}`,
              title: 'Intro hook camera motion reference',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              timestampSeconds: 15,
              timestampFormatted: '00:15',
              targetSection: 'Intro (0:00 - 0:15)',
              notes: 'Instruct video editor: Include the fast 3D zoom in before title card.',
              isCompletedByEditor: false,
            },
          ]
        : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-xs select-none font-sans">
      <div
        ref={modalRef}
        className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-semibold text-slate-900 dark:text-white">
                Add Task
              </h3>
              <p className="text-[12px] text-slate-500 dark:text-slate-400 font-normal">
                Add task specifications, deadlines, and visual attachments
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
              Task name *
            </label>
            <input
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Cut 30-sec Intro Sequence & Sound Master"
              className="w-full px-3.5 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-medium text-slate-800 dark:text-slate-200">
                Description & visual brief
              </label>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInputChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-[11px] font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Attach Image</span>
                </button>
              </div>
            </div>

            <div onPaste={handlePaste} className="relative rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onPaste={handlePaste}
                placeholder="Detailed instructions... (Paste images directly from clipboard with Ctrl+V / Cmd+V!)"
                className="w-full px-3 py-2 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none text-[13px]"
              />
              <div className="px-3 pb-1.5 text-[10px] text-slate-400">
                Tip: Paste screenshots directly from your clipboard (Ctrl+V)
              </div>
            </div>

            {/* Attached images preview list */}
            {attachments.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="relative group w-14 h-14 rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                  >
                    <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setAttachments(attachments.filter((a) => a.id !== att.id))}
                      className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Grid properties */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="ready_for_approval">Ready for Approval</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">
                Assignee
              </label>
              <select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="none">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium text-slate-800 dark:text-slate-200 mb-1">
                Due date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Feature Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={includeVideoInstruction}
                onChange={(e) => setIncludeVideoInstruction(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-normal text-xs">
                Include hyperlinked reference video clip for intro instruction
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-normal text-xs">
                Require stakeholder approval prior to completion
              </span>
            </label>
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
              className="px-6 py-2 rounded-full bg-slate-900 dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-100 text-white dark:text-slate-900 font-semibold transition-colors shadow-xs"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
