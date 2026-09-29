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
  ORGANIZATIONS: 'avalon_orgs_v3',
  USERS: 'avalon_users_v3',
  WORKSPACE: 'avalon_workspace_v3',
  PROJECTS: 'avalon_projects_v3',
  TASKS: 'avalon_tasks_v3',
  NOTIFICATIONS: 'avalon_notifications_v3',
  CURRENT_USER_ID: 'avalon_current_user_v3',
  OFFLINE_QUEUE: 'avalon_offline_queue_v3',
  THEME: 'avalon_theme_v3',
  SITE_CONTENT: 'avalon_site_content_v3',
  AUTH_LOGGED_IN: 'avalon_auth_logged_in_v3',
};

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

    return {
      organizations: rawOrgs ? (JSON.parse(rawOrgs) as Organization[]) : INITIAL_ORGANIZATIONS,
      users: rawUsers ? (JSON.parse(rawUsers) as User[]) : INITIAL_USERS,
      workspace: rawWorkspace ? (JSON.parse(rawWorkspace) as Workspace) : INITIAL_WORKSPACE,
      projects: rawProjects ? (JSON.parse(rawProjects) as Project[]) : INITIAL_PROJECTS,
      tasks: rawTasks ? (JSON.parse(rawTasks) as Task[]) : INITIAL_TASKS,
      notifications: rawNotifs ? (JSON.parse(rawNotifs) as NotificationItem[]) : INITIAL_NOTIFICATIONS,
      currentUserId: rawUserId || 'user_super',
    };
  } catch (err) {
    console.error('Failed to load from localStorage, falling back to initial data', err);
    return {
      organizations: INITIAL_ORGANIZATIONS,
      users: INITIAL_USERS,
      workspace: INITIAL_WORKSPACE,
      projects: INITIAL_PROJECTS,
      tasks: INITIAL_TASKS,
      notifications: INITIAL_NOTIFICATIONS,
      currentUserId: 'user_super',
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
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
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
  return localStorage.getItem(STORAGE_KEYS.AUTH_LOGGED_IN) === 'true';
}

export function setAuthenticatedSession(isLoggedIn: boolean, userId?: string) {
  if (isLoggedIn) {
    localStorage.setItem(STORAGE_KEYS.AUTH_LOGGED_IN, 'true');
    if (userId) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.AUTH_LOGGED_IN);
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
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, userId);
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
