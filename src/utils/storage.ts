import { Task, Project, Workspace, User, NotificationItem, SiteContent, Organization } from '../types';
import {
  INITIAL_ORGANIZATIONS,
  INITIAL_USERS,
  INITIAL_WORKSPACE,
  INITIAL_PROJECTS,
  INITIAL_TASKS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockInitialData';
import { DEFAULT_SITE_CONTENT } from '../data/mockSiteContent';

const STORAGE_KEYS = {
  ORGANIZATIONS: 'avalon_orgs_v4',
  USERS: 'avalon_users_v4',
  WORKSPACE: 'avalon_workspace_v4',
  PROJECTS: 'avalon_projects_v4',
  TASKS: 'avalon_tasks_v4',
  NOTIFICATIONS: 'avalon_notifications_v4',
  CURRENT_USER_ID: 'avalon_current_user_v4',
  OFFLINE_QUEUE: 'avalon_offline_queue_v4',
  THEME: 'avalon_theme_v4',
  SITE_CONTENT: 'avalon_site_content_v4',
  AUTH_LOGGED_IN: 'avalon_auth_logged_in_v4',
};

// Filter out any obsolete demo accounts
const DEMO_EMAILS = new Set([
  'admin@avalon.io',
  'editor@avalon.io',
  'reviewer@avalon.io',
  'alex@avalon.io',
  'liam@avalon.io',
]);

const DEMO_USER_IDS = new Set(['user_1', 'user_2', 'user_3', 'user_4', 'user_5']);

export interface QueuedMutation {
  id: string;
  type: 'CREATE_TASK' | 'UPDATE_TASK' | 'DELETE_TASK' | 'APPROVE_TASK' | 'ADD_COMMENT';
  payload: any;
  timestamp: string;
}

export function loadStoredData() {
  try {
    const rawOrgs = localStorage.getItem(STORAGE_KEYS.ORGANIZATIONS);
    const rawUsers = localStorage.getItem(STORAGE_KEYS.USERS);
    const rawWorkspace = localStorage.getItem(STORAGE_KEYS.WORKSPACE);
    const rawProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    const rawTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
    const rawNotifs = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const rawUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);

    let loadedUsers: User[] = rawUsers ? (JSON.parse(rawUsers) as User[]) : INITIAL_USERS;

    // Purge any legacy demo accounts
    loadedUsers = loadedUsers.filter(
      (u) => !DEMO_EMAILS.has(u.email.toLowerCase()) && !DEMO_USER_IDS.has(u.id)
    );

    // Ensure super admin always exists and is configured with the secure password
    const superAdminIdx = loadedUsers.findIndex(
      (u) => u.role === 'super_admin' || u.email.toLowerCase() === 'superadmin@avalon.io'
    );
    if (superAdminIdx === -1) {
      loadedUsers = [INITIAL_USERS[0], ...loadedUsers];
    } else {
      loadedUsers[superAdminIdx] = {
        ...loadedUsers[superAdminIdx],
        password: '@Delta0300439',
      };
    }

    const authenticated = localStorage.getItem(STORAGE_KEYS.AUTH_LOGGED_IN) === 'true';
    const validCurrentUserId = authenticated && rawUserId && loadedUsers.some((u) => u.id === rawUserId)
      ? rawUserId
      : '';

    return {
      organizations: rawOrgs ? (JSON.parse(rawOrgs) as Organization[]) : INITIAL_ORGANIZATIONS,
      users: loadedUsers,
      workspace: rawWorkspace ? (JSON.parse(rawWorkspace) as Workspace) : INITIAL_WORKSPACE,
      projects: rawProjects ? (JSON.parse(rawProjects) as Project[]) : INITIAL_PROJECTS,
      tasks: rawTasks ? (JSON.parse(rawTasks) as Task[]) : INITIAL_TASKS,
      notifications: rawNotifs ? (JSON.parse(rawNotifs) as NotificationItem[]) : INITIAL_NOTIFICATIONS,
      currentUserId: validCurrentUserId,
    };
  } catch (err) {
    console.error('Failed to load from localStorage, falling back to clean initial data', err);
    return {
      organizations: INITIAL_ORGANIZATIONS,
      users: INITIAL_USERS,
      workspace: INITIAL_WORKSPACE,
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      notifications: INITIAL_NOTIFICATIONS,
      currentUserId: '',
    };
  }
}

export function saveOrganizations(orgs: Organization[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ORGANIZATIONS, JSON.stringify(orgs));
  } catch (err) {
    console.error('Failed to save organizations', err);
  }
}

export function saveUsers(users: User[]) {
  try {
    const sanitizedUsers = users.filter(
      (u) => !DEMO_EMAILS.has(u.email.toLowerCase()) && !DEMO_USER_IDS.has(u.id)
    );
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sanitizedUsers));
  } catch (err) {
    console.error('Failed to save users', err);
  }
}

export function loadStoredSiteContent(): SiteContent {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = { ...DEFAULT_SITE_CONTENT, ...JSON.parse(raw) };
    if (parsed.heroBadge) {
      parsed.heroBadge = parsed.heroBadge
        .replace(/Hybrid Notion \+ Asana Architecture/gi, 'Next-Generation Creative Architecture')
        .replace(/Notion/gi, '')
        .replace(/Asana/gi, '')
        .replace(/\+\s*\//, '/')
        .trim();
    }
    return parsed;
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveStoredSiteContent(content: SiteContent) {
  try {
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(content));
  } catch (err) {
    console.error('Failed to save site content', err);
  }
}

export function isUserAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const isAuth = localStorage.getItem(STORAGE_KEYS.AUTH_LOGGED_IN) === 'true';
  const userId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
  return Boolean(isAuth && userId);
}

export function setAuthenticatedSession(isLoggedIn: boolean, userId?: string) {
  if (isLoggedIn && userId) {
    localStorage.setItem(STORAGE_KEYS.AUTH_LOGGED_IN, 'true');
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_LOGGED_IN);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
  }
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks', err);
  }
}

export function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects', err);
  }
}

export function saveNotifications(notifications: NotificationItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (err) {
    console.error('Failed to save notifications', err);
  }
}

export function saveCurrentUserId(userId: string) {
  try {
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    }
  } catch (err) {
    console.error('Failed to save current user', err);
  }
}

export function getOfflineQueue(): QueuedMutation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.OFFLINE_QUEUE);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function queueOfflineMutation(mutation: QueuedMutation) {
  const queue = getOfflineQueue();
  queue.push(mutation);
  try {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_QUEUE, JSON.stringify(queue));
  } catch (err) {
    console.error('Failed to queue offline mutation', err);
  }
}

export function exportWorkspaceBackup(data: any) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `avalon_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
