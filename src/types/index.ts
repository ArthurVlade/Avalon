export type Role = 'super_admin' | 'admin' | 'project_manager' | 'editor' | 'reviewer' | 'guest';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'Enterprise' | 'Pro' | 'Starter';
  status: 'active' | 'trial' | 'suspended';
  adminId: string;
  createdAt: string;
  maxMembers: number;
  storageLimitGb: number;
  mrr: number;
  contactEmail: string;
}

export interface User {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  title: string;
  initials: string;
  color: string;
  isOnline: boolean;
  password?: string;
  lastLogin?: string;
}

export interface SiteContent {
  brandName: string;
  heroBadge: string;
  heroHeadline: string;
  heroSubtitle: string;
  heroCtaPrimary: string;
  heroCtaSecondary: string;
  bannerNotice: string;
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  footerTagline: string;
  customContainerDetails: string;
}

export type TaskStatus = 'backlog' | 'in_progress' | 'in_review' | 'ready_for_approval' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface VideoInstruction {
  id: string;
  title: string;
  url: string;
  timestampSeconds?: number;
  timestampFormatted?: string;
  targetSection: string; // e.g. "Intro (0:00 - 0:15)"
  notes: string;
  highlightedTextRef?: string;
  isCompletedByEditor?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: 'video' | 'image' | 'audio' | 'pdf' | 'document';
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface Subtask {
  id: string;
  parentId: string;
  title: string;
  completed: boolean;
  assigneeId?: string;
  dueDate?: string;
}

export interface TaskComment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  videoTimestampRef?: string;
}

export interface Task {
  id: string;
  organizationId: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  creatorId: string;
  dueDate: string;
  startDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  subtasks: Subtask[];
  dependencies: string[]; // IDs of tasks this task depends on (blocked by)
  isMilestone?: boolean;
  videoInstructions: VideoInstruction[];
  attachments: Attachment[];
  comments: TaskComment[];
  requiresApproval?: boolean;
  approvalStatus?: 'none' | 'pending' | 'approved' | 'changes_requested';
  approvalNotes?: string;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type ViewType = 'table' | 'board' | 'list' | 'timeline' | 'calendar' | 'gallery';

export interface Project {
  id: string;
  organizationId: string;
  workspaceId: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  isFavorite?: boolean;
  defaultView: ViewType;
  stakeholderIds: string[];
  customFields?: {
    id: string;
    name: string;
    type: 'text' | 'number' | 'select' | 'date';
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  organizationId: string;
  name: string;
  icon: string;
  plan: 'Enterprise' | 'Team' | 'Personal';
  ownerId: string;
}

export interface NotificationItem {
  id: string;
  organizationId: string;
  type: 'task_completed' | 'approval_required' | 'approved' | 'changes_requested' | 'mention' | 'assigned';
  title: string;
  message: string;
  taskId?: string;
  projectId?: string;
  recipientId: string;
  senderId: string;
  read: boolean;
  createdAt: string;
  metadata?: {
    videoUrl?: string;
    section?: string;
  };
}

export interface EditorBlock {
  id: string;
  type: 'paragraph' | 'heading1' | 'heading2' | 'heading3' | 'todo' | 'bullet' | 'callout' | 'quote' | 'code' | 'video_instruction' | 'divider' | 'file';
  content: string;
  completed?: boolean;
  videoData?: VideoInstruction;
  fileData?: Attachment;
}

export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingChangesCount: number;
  lastSyncedAt: string;
}

export interface FilterOptions {
  searchQuery: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  assigneeId: string | 'all';
  tag: string | 'all';
  hasVideoInstructionsOnly?: boolean;
}
