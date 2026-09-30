import { User, Workspace, Project, Task, NotificationItem, Organization } from '../types';

export const INITIAL_ORGANIZATIONS: Organization[] = [
  {
    id: 'org_platform',
    name: 'Avalon Platform Master',
    slug: 'avalon-platform',
    plan: 'Enterprise',
    status: 'active',
    adminId: 'user_super',
    createdAt: '2026-01-01T00:00:00Z',
    maxMembers: 100,
    storageLimitGb: 1000,
    mrr: 0,
    contactEmail: 'superadmin@avalon.io',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_super',
    organizationId: 'org_platform',
    name: 'Alexander Wright',
    email: 'superadmin@avalon.io',
    avatar: '',
    role: 'super_admin',
    title: 'SaaS Platform Founder & Seller',
    initials: 'AW',
    color: '#ff584a',
    isOnline: true,
    password: '@Delta0300439',
    lastLogin: 'Just now',
  },
];

export const INITIAL_WORKSPACE: Workspace = {
  id: 'ws_platform',
  organizationId: 'org_platform',
  name: 'Avalon Platform Core',
  icon: 'Layers',
  plan: 'Enterprise',
  ownerId: 'user_super',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_platform_1',
    organizationId: 'org_platform',
    workspaceId: 'ws_platform',
    title: 'Platform Infrastructure & Releases',
    description: 'Master platform roadmaps, tenant security isolation, and enterprise governance.',
    icon: 'Shield',
    color: '#6366f1',
    isFavorite: true,
    defaultView: 'board',
    stakeholderIds: ['user_super'],
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task_platform_1',
    organizationId: 'org_platform',
    projectId: 'proj_platform_1',
    title: 'Multi-Tenant Security & Account Protection Hardening',
    description: 'Enforce credential requirements across all organizations. Zero unauthorized workspace access.',
    status: 'completed',
    priority: 'urgent',
    assigneeId: 'user_super',
    creatorId: 'user_super',
    dueDate: '2026-10-01',
    startDate: '2026-09-20',
    tags: ['Security', 'RBAC', 'Governance'],
    requiresApproval: false,
    approvalStatus: 'none',
    dependencies: [],
    videoInstructions: [],
    subtasks: [
      {
        id: 'sub_platform_1',
        parentId: 'task_platform_1',
        title: 'Purge demo logins and quick credentials',
        completed: true,
      },
      {
        id: 'sub_platform_2',
        parentId: 'task_platform_1',
        title: 'Lock workspace route behind authenticated session verification',
        completed: true,
      },
    ],
    attachments: [],
    comments: [],
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-30T00:00:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
