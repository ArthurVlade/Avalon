import React, { useState, useEffect, useRef } from 'react';
import {
  Task,
  User,
  TaskStatus,
  TaskPriority,
  VideoInstruction,
  Attachment,
  Subtask,
} from '../../types';
import {
  X,
  Video,
  Paperclip,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  User as UserIcon,
  Flag,
  Play,
  ShieldCheck,
  Send,
  Sparkles,
  Scissors,
  Check,
  Clock,
  Image as ImageIcon,
  ZoomIn,
  Upload,
  Edit2,
} from 'lucide-react';
import { AddVideoInstructionModal } from '../video/AddVideoInstructionModal';
import { VideoInstructionPlayerModal } from '../video/VideoInstructionPlayerModal';
import { hasPermission } from '../../utils/security';

interface Props {
  task: Task;
  allTasks: Task[];
  users: User[];
  currentUser: User;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask?: (taskId: string) => void;
  onRequestApproval?: (taskId: string) => void;
  onApproveTask?: (taskId: string, notes: string) => void;
  onRequestChanges?: (taskId: string, notes: string) => void;
}

export const TaskDetailModal: React.FC<Props> = ({
  task,
  allTasks,
  users,
  currentUser,
  onClose,
  onUpdateTask,
  onDeleteTask,
  onRequestApproval,
  onApproveTask,
  onRequestChanges,
}) => {
  const [currentTask, setCurrentTask] = useState<Task>(task);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState(false);
  const [activeVideoModalInstruction, setActiveVideoModalInstruction] = useState<VideoInstruction | null>(null);
  const [highlightedTextForVideo, setHighlightedTextForVideo] = useState('');
  const [approvalNotesInput, setApprovalNotesInput] = useState('');
  const [showApprovalActionBox, setShowApprovalActionBox] = useState(false);
  const [previewImageModal, setPreviewImageModal] = useState<string | null>(null);
  const [isDraggingOverDescription, setIsDraggingOverDescription] = useState(false);
  const [editingSubtaskId, setEditingSubtaskId] = useState<string | null>(null);
  const [editingSubtaskTitle, setEditingSubtaskTitle] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const canEdit = hasPermission(currentUser.role, 'canEditTasks');
  const canApprove = hasPermission(currentUser.role, 'canApproveDeliverables');

  const assignee = users.find((u) => u.id === currentTask.assigneeId);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (previewImageModal) {
          setPreviewImageModal(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, previewImageModal]);

  const handleToggleComplete = () => {
    const newStatus: TaskStatus = currentTask.status === 'completed' ? 'in_progress' : 'completed';
    const updated = {
      ...currentTask,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleStatusChange = (status: TaskStatus) => {
    const updated = {
      ...currentTask,
      status,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handlePriorityChange = (priority: TaskPriority) => {
    const updated = { ...currentTask, priority, updatedAt: new Date().toISOString() };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleAssigneeChange = (assigneeId: string) => {
    const updated = {
      ...currentTask,
      assigneeId: assigneeId === 'none' ? undefined : assigneeId,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleDueDateChange = (dueDate: string) => {
    const updated = { ...currentTask, dueDate, updatedAt: new Date().toISOString() };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleTitleChange = (title: string) => {
    const updated = { ...currentTask, title, updatedAt: new Date().toISOString() };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleDescriptionChange = (description: string) => {
    const updated = { ...currentTask, description, updatedAt: new Date().toISOString() };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  // Image Processing for Clipboard Paste & File Pick
  const handleProcessImageFile = (file: File, label?: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) return;

      const newAttachment: Attachment = {
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: file.name && file.name !== 'image.png'
          ? file.name
          : `Screenshot_${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/:/g, '-')}.png`,
        size: `${Math.round(file.size / 1024) || 12} KB`,
        type: 'image',
        url: dataUrl,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser.name,
      };

      const updated = {
        ...currentTask,
        attachments: [...currentTask.attachments, newAttachment],
        updatedAt: new Date().toISOString(),
      };
      setCurrentTask(updated);
      onUpdateTask(updated);
    };
    reader.readAsDataURL(file);
  };

  // Clipboard Paste Handler (Detects images in clipboard data on description or modal)
  const handlePasteInDescription = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          handleProcessImageFile(file, 'Clipboard Paste');
        }
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      handleProcessImageFile(files[i]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteAttachment = (attId: string) => {
    const updated = {
      ...currentTask,
      attachments: currentTask.attachments.filter((a) => a.id !== attId),
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  // Subtasks logic
  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    const newSub: Subtask = {
      id: `sub_${Date.now()}`,
      parentId: currentTask.id,
      title: newSubtaskTitle.trim(),
      completed: false,
      assigneeId: currentTask.assigneeId,
    };
    const updated = {
      ...currentTask,
      subtasks: [...currentTask.subtasks, newSub],
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subId: string) => {
    const updatedSubtasks = currentTask.subtasks.map((s) =>
      s.id === subId ? { ...s, completed: !s.completed } : s
    );
    const updated = {
      ...currentTask,
      subtasks: updatedSubtasks,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleDeleteSubtask = (subId: string) => {
    const updatedSubtasks = currentTask.subtasks.filter((s) => s.id !== subId);
    const updated = {
      ...currentTask,
      subtasks: updatedSubtasks,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleStartEditSubtask = (sub: Subtask) => {
    setEditingSubtaskId(sub.id);
    setEditingSubtaskTitle(sub.title);
  };

  const handleSaveSubtaskTitle = (subId: string) => {
    if (!editingSubtaskTitle.trim()) {
      setEditingSubtaskId(null);
      return;
    }
    const updatedSubtasks = currentTask.subtasks.map((s) =>
      s.id === subId ? { ...s, title: editingSubtaskTitle.trim() } : s
    );
    const updated = {
      ...currentTask,
      subtasks: updatedSubtasks,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
    setEditingSubtaskId(null);
  };

  // Video instructions logic
  const handleAddVideoInstruction = (
    data: Omit<VideoInstruction, 'id' | 'isCompletedByEditor'>
  ) => {
    const newInst: VideoInstruction = {
      ...data,
      id: `vi_${Date.now()}`,
      isCompletedByEditor: false,
    };
    const updated = {
      ...currentTask,
      videoInstructions: [...currentTask.videoInstructions, newInst],
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleToggleVideoInstructionComplete = (instId: string) => {
    const updatedInstructions = currentTask.videoInstructions.map((vi) =>
      vi.id === instId ? { ...vi, isCompletedByEditor: !vi.isCompletedByEditor } : vi
    );
    const updated = {
      ...currentTask,
      videoInstructions: updatedInstructions,
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleDeleteVideoInstruction = (instId: string) => {
    const updated = {
      ...currentTask,
      videoInstructions: currentTask.videoInstructions.filter((vi) => vi.id !== instId),
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleSimulateAddAttachment = () => {
    const sampleAttachment: Attachment = {
      id: `att_${Date.now()}`,
      name: 'Video_Reference_Cut.mp4',
      size: '38 MB',
      type: 'video',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.name,
    };
    const updated = {
      ...currentTask,
      attachments: [...currentTask.attachments, sampleAttachment],
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const comment = {
      id: `comm_${Date.now()}`,
      userId: currentUser.id,
      content: newCommentText.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = {
      ...currentTask,
      comments: [...currentTask.comments, comment],
      updatedAt: new Date().toISOString(),
    };
    setCurrentTask(updated);
    onUpdateTask(updated);
    setNewCommentText('');
    setTimeout(() => {
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const completedSubtasksCount = currentTask.subtasks.filter((s) => s.completed).length;
  const attachedImages = currentTask.attachments.filter((a) => a.type === 'image' || a.url.startsWith('data:image'));

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-[#f8fafc] font-sans"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold transition-colors ${
                currentTask.status === 'completed'
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{currentTask.status === 'completed' ? 'Completed' : 'Mark Complete'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onDeleteTask && (
              <button
                onClick={() => {
                  if (confirm('Delete this task?')) {
                    onDeleteTask(currentTask.id);
                    onClose();
                  }
                }}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Approval Sign-off banner if required */}
          {currentTask.requiresApproval && currentTask.approvalStatus === 'pending' && (
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 text-[13px] font-medium">
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>Executive Sign-off Required before final delivery</span>
              </div>

              {canApprove ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onApproveTask?.(currentTask.id, 'Approved by stakeholder');
                      setCurrentTask({
                        ...currentTask,
                        approvalStatus: 'approved',
                        status: 'completed',
                      });
                    }}
                    className="px-3.5 py-1.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[12px] font-semibold hover:opacity-90 transition-opacity"
                  >
                    Approve deliverable
                  </button>
                  <button
                    onClick={() => setShowApprovalActionBox(!showApprovalActionBox)}
                    className="px-3.5 py-1.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-full text-[12px] font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Request changes
                  </button>
                </div>
              ) : (
                <span className="text-[11px] italic text-amber-800 dark:text-amber-300">
                  Awaiting sign-off from Project Director
                </span>
              )}
            </div>
          )}

          {/* Revision request box */}
          {showApprovalActionBox && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
              <label className="text-[12px] font-semibold text-slate-900 dark:text-white">
                Revision Instructions for Editor
              </label>
              <textarea
                rows={2}
                value={approvalNotesInput}
                onChange={(e) => setApprovalNotesInput(e.target.value)}
                placeholder="Specify required edits (e.g. 'Intro cut needs sharper pacing and sound effects at 0:12')..."
                className="w-full px-3 py-2 text-[13px] rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowApprovalActionBox(false)}
                  className="px-3 py-1 text-[12px] text-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onRequestChanges?.(currentTask.id, approvalNotesInput || 'Changes requested');
                    setCurrentTask({
                      ...currentTask,
                      approvalStatus: 'changes_requested',
                      status: 'in_progress',
                    });
                    setShowApprovalActionBox(false);
                  }}
                  className="px-3.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-[12px] font-semibold"
                >
                  Submit Revisions
                </button>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div>
            <input
              type="text"
              value={currentTask.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Task name"
              disabled={!canEdit}
              className="w-full text-2xl font-bold bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Property Grid (Assignee, Due Date, Status, Priority) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 py-2 border-y border-slate-200 dark:border-slate-800 text-[13px]">
            {/* Assignee */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <UserIcon className="w-3.5 h-3.5" />
                Assignee
              </span>
              <div className="flex-1">
                <select
                  value={currentTask.assigneeId || 'none'}
                  onChange={(e) => handleAssigneeChange(e.target.value)}
                  disabled={!canEdit}
                  className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded-md text-slate-900 dark:text-white font-medium border border-transparent hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer outline-none"
                >
                  <option value="none">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Due date
              </span>
              <div className="flex-1">
                <input
                  type="date"
                  value={currentTask.dueDate}
                  onChange={(e) => handleDueDateChange(e.target.value)}
                  disabled={!canEdit}
                  className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded-md text-slate-900 dark:text-white font-medium border border-transparent hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer outline-none"
                />
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Status
              </span>
              <div className="flex-1">
                <select
                  value={currentTask.status}
                  onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                  disabled={!canEdit}
                  className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded-md text-slate-900 dark:text-white font-medium border border-transparent hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer outline-none"
                >
                  <option value="backlog">Backlog</option>
                  <option value="in_progress">In Progress</option>
                  <option value="in_review">In Review</option>
                  <option value="ready_for_approval">Ready for Approval</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center gap-3">
              <span className="w-24 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5" />
                Priority
              </span>
              <div className="flex-1">
                <select
                  value={currentTask.priority}
                  onChange={(e) => handlePriorityChange(e.target.value as TaskPriority)}
                  disabled={!canEdit}
                  className="bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded-md text-slate-900 dark:text-white font-medium border border-transparent hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description Section with Clipboard Paste & Button Attachment for Images */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Description & Visual References
                </h4>
              </div>

              {canEdit && (
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
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[12px] font-medium transition-colors"
                    title="Click button to upload images, or paste from clipboard (Ctrl+V)"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Attach Image</span>
                  </button>
                </div>
              )}
            </div>

            {/* Description Textarea with onPaste image detection */}
            <div
              onPaste={handlePasteInDescription}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOverDescription(true);
              }}
              onDragLeave={() => setIsDraggingOverDescription(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDraggingOverDescription(false);
                if (e.dataTransfer.files) {
                  for (let i = 0; i < e.dataTransfer.files.length; i++) {
                    if (e.dataTransfer.files[i].type.startsWith('image/')) {
                      handleProcessImageFile(e.dataTransfer.files[i]);
                    }
                  }
                }
              }}
              className={`relative rounded-xl border transition-all ${
                isDraggingOverDescription
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/20'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40'
              }`}
            >
              <textarea
                rows={3}
                value={currentTask.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onPaste={handlePasteInDescription}
                placeholder="Add more detail to this task... You can paste screenshots directly from your clipboard (Ctrl+V) or click 'Attach Image'!"
                disabled={!canEdit}
                className="w-full p-3 rounded-xl bg-transparent border-0 text-[13px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              {/* Clipboard paste helper badge */}
              <div className="px-3 pb-2 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Clipboard paste enabled (Ctrl+V / Cmd+V images)
                </span>
                <span>or drag & drop images</span>
              </div>
            </div>

            {/* Attached Images Gallery directly under description */}
            {attachedImages.length > 0 && (
              <div className="pt-2 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <ImageIcon className="w-3 h-3 text-indigo-500" />
                  <span>Attached Images ({attachedImages.length})</span>
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {attachedImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs hover:shadow-md transition-all"
                    >
                      <div
                        onClick={() => setPreviewImageModal(img.url)}
                        className="aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-zoom-in relative"
                      >
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <ZoomIn className="w-5 h-5 drop-shadow" />
                        </div>
                      </div>

                      <div className="p-1.5 flex items-center justify-between text-[10px]">
                        <span className="truncate max-w-[100px] text-slate-700 dark:text-slate-300 font-medium">
                          {img.name}
                        </span>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAttachment(img.id)}
                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Video Instructions & Timestamps */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-indigo-500" />
                <h4 className="text-[13px] font-semibold text-slate-900 dark:text-white">
                  Video Editor Timestamps & Directives
                </h4>
              </div>

              {canEdit && (
                <button
                  onClick={() => setIsAddVideoModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-full text-[12px] font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="w-3 h-3 text-indigo-500" />
                  <span>Add Timestamp Instruction</span>
                </button>
              )}
            </div>

            {currentTask.videoInstructions.length === 0 ? (
              <p className="text-[12px] text-slate-500 dark:text-slate-400 italic">
                No video instruction linked yet. Highlight this task and add a video link to instruct the editor (e.g. Intro hook 0:00 - 0:15).
              </p>
            ) : (
              <div className="space-y-2">
                {currentTask.videoInstructions.map((inst) => (
                  <div
                    key={inst.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 gap-2"
                  >
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => handleToggleVideoInstructionComplete(inst.id)}
                        className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                          inst.isCompletedByEditor
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-400 text-transparent hover:border-emerald-500'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-slate-900 dark:text-white">
                            {inst.title}
                          </span>
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold">
                            {inst.targetSection}
                          </span>
                        </div>
                        {inst.notes && (
                          <p className="text-[12px] text-slate-600 dark:text-slate-400 mt-0.5">
                            {inst.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setActiveVideoModalInstruction(inst)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-md text-[11px] font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Watch Timestamp</span>
                      </button>

                      {canEdit && (
                        <button
                          onClick={() => handleDeleteVideoInstruction(inst.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove instruction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtasks Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Subtasks ({completedSubtasksCount}/{currentTask.subtasks.length})
              </h4>
            </div>

            <div className="space-y-1.5">
              {currentTask.subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between py-1.5 px-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/[0.04] group transition-colors"
                >
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleSubtask(sub.id)}
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${
                        sub.completed
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 dark:border-zinc-600 text-transparent hover:border-emerald-500'
                      }`}
                    >
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </button>

                    {editingSubtaskId === sub.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          autoFocus
                          value={editingSubtaskTitle}
                          onChange={(e) => setEditingSubtaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveSubtaskTitle(sub.id);
                            } else if (e.key === 'Escape') {
                              setEditingSubtaskId(null);
                            }
                          }}
                          className="flex-1 text-xs px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-indigo-500 text-slate-900 dark:text-zinc-100 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveSubtaskTitle(sub.id)}
                          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingSubtaskId(null)}
                          className="px-2 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 text-[11px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => canEdit && handleStartEditSubtask(sub)}
                        className={`text-xs truncate cursor-pointer transition-colors ${
                          sub.completed
                            ? 'line-through text-slate-400 dark:text-zinc-500'
                            : 'text-slate-800 dark:text-zinc-200 hover:text-indigo-600 dark:hover:text-indigo-400'
                        }`}
                        title={canEdit ? 'Click to edit subtask' : undefined}
                      >
                        {sub.title}
                      </span>
                    )}
                  </div>

                  {canEdit && editingSubtaskId !== sub.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleStartEditSubtask(sub)}
                        className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Edit subtask"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubtask(sub.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete subtask"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add subtask form */}
              {canEdit && (
                <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-2">
                  <Plus className="w-4 h-4 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    placeholder="Add a subtask..."
                    className="flex-1 text-[13px] bg-transparent border-0 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400"
                  />
                  {newSubtaskTitle.trim() && (
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-md text-[11px] font-semibold"
                    >
                      Add
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* All Files & Attachments Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                All Deliverable Files ({currentTask.attachments.length})
              </h4>
              {canEdit && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-[12px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                  </button>
                  <button
                    onClick={handleSimulateAddAttachment}
                    className="flex items-center gap-1.5 text-[12px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach Video</span>
                  </button>
                </div>
              )}
            </div>

            {currentTask.attachments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentTask.attachments.map((att) => (
                  <div
                    key={att.id}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      {att.type === 'image' || att.url.startsWith('data:image') ? (
                        <div
                          onClick={() => setPreviewImageModal(att.url)}
                          className="w-8 h-8 rounded-md bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 cursor-pointer"
                        >
                          <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                      <div className="truncate">
                        <p className="text-[12px] font-semibold text-slate-900 dark:text-white truncate">
                          {att.name}
                        </p>
                        <p className="text-[10px] text-slate-400">{att.size} • {att.uploadedBy}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {(att.type === 'image' || att.url.startsWith('data:image')) && (
                        <button
                          type="button"
                          onClick={() => setPreviewImageModal(att.url)}
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="View image"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAttachment(att.id)}
                          className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                          title="Remove file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-slate-400 italic">No attachments added yet.</p>
            )}
          </div>

          {/* Comments & Activity Stream */}
          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h4 className="text-[13px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Activity & Comments
            </h4>

            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {currentTask.comments.map((comm) => {
                const author = users.find((u) => u.id === comm.userId);
                return (
                  <div key={comm.id} className="flex items-start gap-2.5 text-[13px]">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                      style={{ backgroundColor: author?.color || '#6366f1' }}
                    >
                      {author?.initials || 'U'}
                    </div>
                    <div className="flex-1 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900 dark:text-white text-[12px]">
                          {author?.name || 'Collaborator'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-[12px] mt-1">
                        {comm.content}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={commentsEndRef} />
            </div>

            {/* Comment form */}
            <form onSubmit={handleAddComment} className="flex items-center gap-2 mt-3">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                placeholder="Ask a question or post an update..."
                className="flex-1 px-3 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 text-[13px] text-slate-900 dark:text-white focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newCommentText.trim()}
                className="p-2 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 disabled:opacity-30 hover:opacity-90 transition-opacity"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Image Lightbox Preview Modal */}
      {previewImageModal && (
        <div
          onClick={() => setPreviewImageModal(null)}
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[85vh] bg-slate-950 rounded-xl overflow-hidden shadow-2xl flex flex-col items-center"
          >
            <div className="w-full flex items-center justify-between p-3 bg-black/50 text-white">
              <span className="text-[12px] font-mono">Attachment Preview</span>
              <button
                onClick={() => setPreviewImageModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={previewImageModal}
              alt="Expanded preview"
              className="max-h-[75vh] max-w-full object-contain p-2"
            />
          </div>
        </div>
      )}

      {/* Add Video Instruction Modal */}
      {isAddVideoModalOpen && (
        <AddVideoInstructionModal
          initialHighlightedText={highlightedTextForVideo}
          onClose={() => setIsAddVideoModalOpen(false)}
          onAdd={(data) => {
            handleAddVideoInstruction(data);
            setIsAddVideoModalOpen(false);
          }}
        />
      )}

      {/* Video Player Modal */}
      {activeVideoModalInstruction && (
        <VideoInstructionPlayerModal
          instruction={activeVideoModalInstruction}
          task={currentTask}
          onClose={() => setActiveVideoModalInstruction(null)}
          onToggleInstructionComplete={() =>
            handleToggleVideoInstructionComplete(activeVideoModalInstruction.id)
          }
        />
      )}
    </div>
  );
};
