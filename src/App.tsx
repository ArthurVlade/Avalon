import React, { useState, useEffect } from 'react';
import {
  Project,
  Task,
  User,
  Workspace,
  NotificationItem,
  ViewType,
  VideoInstruction,
  TaskStatus,
  SiteContent,
  Organization,
} from './types';
import {
  loadStoredData,
  saveTasks,
  saveProjects,
  saveNotifications,
  saveUsers,
  saveOrganizations,
  saveCurrentUserId,
  exportWorkspaceBackup,
  queueOfflineMutation,
  loadStoredSiteContent,
  saveStoredSiteContent,
  isUserAuthenticated,
  setAuthenticatedSession,
} from './utils/storage';
import { INITIAL_ORGANIZATIONS } from './data/mockInitialData';
import { Navbar } from './components/navigation/Navbar';
import { Sidebar } from './components/navigation/Sidebar';
import { CommandPalette } from './components/navigation/CommandPalette';
import { TableView } from './components/views/TableView';
import { BoardView } from './components/views/BoardView';
import { ListView } from './components/views/ListView';
import { TimelineView } from './components/views/TimelineView';
import { CalendarView } from './components/views/CalendarView';
import { GalleryView } from './components/views/GalleryView';
import { TaskDetailModal } from './components/tasks/TaskDetailModal';
import { NewTaskModal } from './components/tasks/NewTaskModal';
import { NewProjectModal } from './components/projects/NewProjectModal';
import { EditProjectModal } from './components/admin/EditProjectModal';
import { SuperAdminControlModal } from './components/admin/SuperAdminControlModal';
import { OrgTeamModal } from './components/admin/OrgTeamModal';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { ApprovalsView } from './components/approvals/ApprovalsView';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { SecurityAndApiModal } from './components/security/SecurityAndApiModal';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { VideoInstructionPlayerModal } from './components/video/VideoInstructionPlayerModal';
import { InteractiveBackground } from './components/common/InteractiveBackground';
import { InteractiveCursor } from './components/common/InteractiveCursor';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { ContactPage } from './pages/ContactPage';
import {
  LayoutGrid,
  Table as TableIcon,
  List as ListIcon,
  Clock,
  Calendar as CalendarIcon,
  Sparkles,
  Search,
  Video,
  CheckCircle2,
  Edit2,
  Building2,
  Shield,
  Layers,
} from 'lucide-react';

export default function App() {
  const initial = loadStoredData();
  const [organizations, setOrganizations] = useState<Organization[]>(initial.organizations || INITIAL_ORGANIZATIONS);
  const [users, setUsers] = useState<User[]>(initial.users);
  const [workspace, setWorkspace] = useState<Workspace>(initial.workspace);
  const [projects, setProjects] = useState<Project[]>(initial.projects);
  const [tasks, setTasks] = useState<Task[]>(initial.tasks);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initial.notifications);
  const [currentUserId, setCurrentUserId] = useState<string>(initial.currentUserId);
  const [siteContent, setSiteContent] = useState<SiteContent>(loadStoredSiteContent());

  // Super Admin Tenant Context filter ('all' or specific organization ID)
  const [selectedTenantOrgId, setSelectedTenantOrgId] = useState<string>('all');

  // Multi-Page state: 'home' | 'login' | 'signup' | 'contact' | 'dashboard'
  const [currentPage, setCurrentPage] = useState<'home' | 'login' | 'signup' | 'contact' | 'dashboard'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('signup')) return 'signup';
      if (hash.includes('contact')) return 'contact';
      if (hash.includes('login')) return 'login';
      if (hash.includes('dashboard')) {
        if (isUserAuthenticated()) return 'dashboard';
        return 'login';
      }
    }
    return 'home';
  });

  // Active navigation states in Dashboard
  const [activeProjectId, setActiveProjectId] = useState<string>(initial.projects[0]?.id || 'proj_1');
  const [activeCategory, setActiveCategory] = useState<'project' | 'my_tasks' | 'approvals' | 'analytics'>('project');
  const [activeViewType, setActiveViewType] = useState<ViewType>('board');

  // Modals state
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [newTaskInitialStatus, setNewTaskInitialStatus] = useState<TaskStatus>('backlog');
  const [newTaskInitialDueDate, setNewTaskInitialDueDate] = useState<string>('');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isSuperAdminModalOpen, setIsSuperAdminModalOpen] = useState(false);
  const [isOrgTeamModalOpen, setIsOrgTeamModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<{
    instruction: VideoInstruction;
    task: Task;
  } | null>(null);

  // Dark Theme State
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('avalon_theme_v2');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Offline Sync State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);

  // Filters
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [hasVideoOnly, setHasVideoOnly] = useState(false);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // ==========================================
  // MULTI-TENANT ISOLATION ARCHITECTURE
  // ==========================================
  const currentUser: User | null = isUserAuthenticated()
    ? users.find((u) => u.id === currentUserId) || null
    : null;
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Determine current active organization
  const currentOrg: Organization = isSuperAdmin
    ? (selectedTenantOrgId === 'all'
        ? organizations[0] || INITIAL_ORGANIZATIONS[0]
        : organizations.find((o) => o.id === selectedTenantOrgId) || organizations[0] || INITIAL_ORGANIZATIONS[0])
    : (organizations.find((o) => o.id === currentUser?.organizationId) || organizations[0] || INITIAL_ORGANIZATIONS[0]);

  // STRICT TENANT DATA ISOLATION (ZERO LEAKS)
  // Super admin can inspect all or filtered by tenant; regular org users ONLY see their org data
  const tenantProjects: Project[] = isSuperAdmin
    ? (selectedTenantOrgId === 'all'
        ? projects
        : projects.filter((p) => p.organizationId === selectedTenantOrgId))
    : currentUser
    ? projects.filter((p) => p.organizationId === currentUser.organizationId)
    : [];

  const tenantTasks: Task[] = isSuperAdmin
    ? (selectedTenantOrgId === 'all'
        ? tasks
        : tasks.filter((t) => t.organizationId === selectedTenantOrgId))
    : currentUser
    ? tasks.filter((t) => t.organizationId === currentUser.organizationId)
    : [];

  const tenantUsers: User[] = isSuperAdmin
    ? (selectedTenantOrgId === 'all'
        ? users
        : users.filter((u) => u.organizationId === selectedTenantOrgId || u.role === 'super_admin'))
    : currentUser
    ? users.filter((u) => u.organizationId === currentUser.organizationId)
    : [];

  const tenantNotifications: NotificationItem[] = isSuperAdmin
    ? notifications
    : currentUser
    ? notifications.filter(
        (n) =>
          n.organizationId === currentUser.organizationId &&
          (n.recipientId === currentUser.id || currentUser.role === 'admin')
      )
    : [];

  // Active project within tenant
  const currentProject: Project =
    tenantProjects.find((p) => p.id === activeProjectId) ||
    tenantProjects[0] ||
    projects[0];

  // Sync hash routing with authentication guard
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('signup')) setCurrentPage('signup');
      else if (hash.includes('contact')) setCurrentPage('contact');
      else if (hash.includes('login')) setCurrentPage('login');
      else if (hash.includes('dashboard')) {
        if (isUserAuthenticated()) {
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('login');
          window.location.hash = '#/login';
        }
      }
      else if (hash === '' || hash === '#/' || hash === '#home') setCurrentPage('home');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: 'home' | 'login' | 'signup' | 'contact' | 'dashboard') => {
    if (page === 'dashboard' && !isUserAuthenticated()) {
      setCurrentPage('login');
      window.location.hash = '#/login';
      return;
    }
    setCurrentPage(page);
    window.location.hash = page === 'home' ? '' : `#/${page}`;
  };

  // Synchronize Dark Theme class and data attribute
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('avalon_theme_v2', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('avalon_theme_v2', 'light');
    }
  }, [isDark]);

  // Global scroll listener for auto-hiding scrollbar (only visible when actively scrolling)
  useEffect(() => {
    let scrollTimer: ReturnType<typeof setTimeout>;
    const handleScroll = () => {
      document.documentElement.classList.add('is-scrolling');
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        document.documentElement.classList.remove('is-scrolling');
      }, 750);
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { capture: true });
      clearTimeout(scrollTimer);
    };
  }, []);

  // Online / Offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setPendingSyncCount(0);
      showToast('Connection restored. All changes synced with cloud.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Offline mode active. Changes will be queued locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null), 4000;
    });
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUserId(user.id);
    saveCurrentUserId(user.id);
    setAuthenticatedSession(true, user.id);
    showToast(`Signed in as ${user.name} (${user.role.replace('_', ' ')})`);
    if (user.role === 'super_admin') {
      setIsSuperAdminModalOpen(true);
    }
    navigateTo('dashboard');
  };

  const handleSignUpSuccess = (newUser: User, newOrg?: Organization) => {
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveUsers(updatedUsers);

    if (newOrg) {
      const updatedOrgs = [...organizations, newOrg];
      setOrganizations(updatedOrgs);
      saveOrganizations(updatedOrgs);

      // Create a default project for the new workspace
      const defaultProj: Project = {
        id: `proj_${Date.now()}`,
        organizationId: newOrg.id,
        workspaceId: 'ws_main',
        title: `${newOrg.name} Primary Workspace`,
        description: 'Default project board for deliverables, video edits, and sprint reviews.',
        icon: 'Layout',
        color: '#4f46e5',
        defaultView: 'board',
        stakeholderIds: [newUser.id],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedProjects = [...projects, defaultProj];
      setProjects(updatedProjects);
      saveProjects(updatedProjects);
      setActiveProjectId(defaultProj.id);

      // Seed starter tasks so the freshly created organization workspace is immediately fully functional
      const starterTasks: Task[] = [
        {
          id: `task_${Date.now()}_1`,
          organizationId: newOrg.id,
          projectId: defaultProj.id,
          title: 'Welcome to your Avalon Workspace',
          description: 'This is your primary project board. Invite team members, attach video revisions, and track deliverable sign-offs.',
          status: 'backlog',
          priority: 'high',
          assigneeId: newUser.id,
          creatorId: newUser.id,
          dependencies: [],
          dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
          tags: ['Onboarding', 'Workspace Setup'],
          subtasks: [
            { id: `sub_${Date.now()}_1`, parentId: `task_${Date.now()}_1`, title: 'Invite team members via the Team modal', completed: false },
            { id: `sub_${Date.now()}_2`, parentId: `task_${Date.now()}_1`, title: 'Configure project stages & deliverables', completed: false },
          ],
          videoInstructions: [],
          attachments: [],
          comments: [],
          requiresApproval: false,
          approvalStatus: 'none',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: `task_${Date.now()}_2`,
          organizationId: newOrg.id,
          projectId: defaultProj.id,
          title: 'Review Initial Creative Assets & Video Directives',
          description: 'Upload footage, paste screenshots from clipboard, or hyperlink frame-accurate timestamps (e.g. 0:00 - 0:15).',
          status: 'in_progress',
          priority: 'urgent',
          assigneeId: newUser.id,
          creatorId: newUser.id,
          dependencies: [],
          dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
          tags: ['Production', 'Creative'],
          subtasks: [
            { id: `sub_${Date.now()}_3`, parentId: `task_${Date.now()}_2`, title: 'Verify audio stems and color grade LUTs', completed: false },
          ],
          videoInstructions: [],
          attachments: [],
          comments: [],
          requiresApproval: true,
          approvalStatus: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      const updatedTasks = [...tasks, ...starterTasks];
      setTasks(updatedTasks);
      saveTasks(updatedTasks);
    }

    setCurrentUserId(newUser.id);
    saveCurrentUserId(newUser.id);
    setAuthenticatedSession(true, newUser.id);
    showToast(`Welcome to Avalon, ${newUser.name}! Your ${newOrg ? 'workspace' : 'account'} is ready.`);
    navigateTo('dashboard');
  };

  const handleLogout = () => {
    setAuthenticatedSession(false);
    showToast('Signed out of account.');
    navigateTo('login');
  };

  const handleUpdateUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    saveUsers(updatedUsers);
  };

  const handleUpdateOrganizations = (updatedOrgs: Organization[]) => {
    setOrganizations(updatedOrgs);
    saveOrganizations(updatedOrgs);
  };

  const handleUpdateSiteContent = (updatedContent: SiteContent) => {
    setSiteContent(updatedContent);
    saveStoredSiteContent(updatedContent);
    showToast('Website copy and container configuration updated live!');
  };

  const notifyStakeholders = (
    task: Task,
    type: 'task_completed' | 'approval_required' | 'approved' | 'changes_requested',
    customTitle?: string
  ) => {
    const stakeholders = currentProject.stakeholderIds
      .map((id) => tenantUsers.find((u) => u.id === id))
      .filter(Boolean) as User[];

    const newNotifs: NotificationItem[] = stakeholders.map((stakeholder) => ({
      id: `notif_${Date.now()}_${stakeholder.id}`,
      organizationId: task.organizationId || currentOrg.id,
      type,
      title:
        customTitle ||
        (type === 'task_completed'
          ? `Task Completed: ${task.title}`
          : `Sign-off Required: ${task.title}`),
      message: `${currentUser?.name || 'A team member'} updated "${task.title}". View deliverable specs and video instructions.`,
      taskId: task.id,
      projectId: task.projectId,
      recipientId: stakeholder.id,
      senderId: currentUser?.id || 'system',
      read: false,
      createdAt: new Date().toISOString(),
    }));

    const updated = [...newNotifs, ...notifications];
    setNotifications(updated);
    saveNotifications(updated);

    showToast(`Automated notification sent to stakeholders (${stakeholders.map((s) => s.name).join(', ')})`);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const existing = tasks.find((t) => t.id === updatedTask.id);
    const wasJustCompleted = existing && existing.status !== 'completed' && updatedTask.status === 'completed';
    const wasJustSubmittedForApproval =
      existing &&
      existing.approvalStatus !== 'pending' &&
      updatedTask.approvalStatus === 'pending';

    const newTasks = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(newTasks);
    saveTasks(newTasks);

    if (selectedTask?.id === updatedTask.id) {
      setSelectedTask(updatedTask);
    }

    if (!isOnline) {
      queueOfflineMutation({
        id: `mut_${Date.now()}`,
        type: 'UPDATE_TASK',
        payload: updatedTask,
        timestamp: new Date().toISOString(),
      });
      setPendingSyncCount((prev) => prev + 1);
    }

    if (wasJustCompleted) {
      notifyStakeholders(updatedTask, 'task_completed');
    } else if (wasJustSubmittedForApproval) {
      notifyStakeholders(updatedTask, 'approval_required');
    }
  };

  const handleAddTask = (newTask: Task) => {
    const taskWithTenant: Task = {
      ...newTask,
      organizationId: newTask.organizationId || currentProject?.organizationId || currentOrg.id,
    };
    const newTasks = [taskWithTenant, ...tasks];
    setTasks(newTasks);
    saveTasks(newTasks);

    if (!isOnline) {
      queueOfflineMutation({
        id: `mut_${Date.now()}`,
        type: 'CREATE_TASK',
        payload: taskWithTenant,
        timestamp: new Date().toISOString(),
      });
      setPendingSyncCount((prev) => prev + 1);
    }

    showToast(`Task "${taskWithTenant.title}" added to project.`);
  };

  const handleDeleteTask = (taskId: string) => {
    const newTasks = tasks.filter((t) => t.id !== taskId);
    setTasks(newTasks);
    saveTasks(newTasks);

    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }

    showToast('Task removed.');
  };

  const handleApproveTask = (taskId: string, notes: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      approvalStatus: 'approved',
      status: 'completed',
      approvalNotes: notes,
      approvedBy: currentUser?.id || 'system',
      approvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    handleUpdateTask(updatedTask);
    notifyStakeholders(updatedTask, 'approved', `Deliverable Approved: ${updatedTask.title}`);
    showToast(`Signed off on "${updatedTask.title}".`);
  };

  const handleRequestChanges = (taskId: string, notes: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTask: Task = {
      ...task,
      approvalStatus: 'changes_requested',
      status: 'in_progress',
      approvalNotes: notes,
      updatedAt: new Date().toISOString(),
    };

    handleUpdateTask(updatedTask);
    notifyStakeholders(
      updatedTask,
      'changes_requested',
      `Revision Requested: ${updatedTask.title}`
    );
    showToast(`Requested changes on "${updatedTask.title}".`);
  };

  const handleAddProject = (newProj: Project) => {
    const projWithTenant: Project = {
      ...newProj,
      organizationId: newProj.organizationId || currentOrg.id,
    };
    const updated = [...projects, projWithTenant];
    setProjects(updated);
    saveProjects(updated);
    setActiveProjectId(projWithTenant.id);
    setActiveCategory('project');
    showToast(`Created project "${projWithTenant.title}".`);
  };

  const handleUpdateProject = (updatedProj: Project) => {
    const updated = projects.map((p) => (p.id === updatedProj.id ? updatedProj : p));
    setProjects(updated);
    saveProjects(updated);
    showToast(`Project "${updatedProj.title}" updated.`);
  };

  const handleDeleteProject = (projId: string) => {
    if (tenantProjects.length <= 1) {
      alert('You must have at least one active project.');
      return;
    }
    const updated = projects.filter((p) => p.id !== projId);
    setProjects(updated);
    saveProjects(updated);
    const nextProj = updated.find((p) => p.organizationId === currentOrg.id) || updated[0];
    if (nextProj) setActiveProjectId(nextProj.id);
    showToast('Project deleted.');
  };

  // Filter tasks for current view based on active tab and search
  const getVisibleTasks = () => {
    let list: Task[] = [];
    if (activeCategory === 'project') {
      list = tenantTasks.filter((t) => t.projectId === currentProject?.id);
    } else if (activeCategory === 'my_tasks') {
      list = tenantTasks.filter((t) => t.assigneeId === currentUser?.id);
    } else if (activeCategory === 'approvals') {
      list = tenantTasks.filter((t) => t.requiresApproval);
    } else {
      list = tenantTasks;
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (statusFilter !== 'all') {
      list = list.filter((t) => t.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      list = list.filter((t) => t.priority === priorityFilter);
    }

    if (hasVideoOnly) {
      list = list.filter((t) => t.videoInstructions.length > 0);
    }

    return list;
  };

  const visibleTasks = getVisibleTasks();
  const unreadCount = tenantNotifications.filter((n) => !n.read).length;
  const pendingApprovalsCount = tenantTasks.filter(
    (t) => t.requiresApproval && t.approvalStatus === 'pending'
  ).length;
  const myTasksCount = tenantTasks.filter((t) => t.assigneeId === currentUser?.id && t.status !== 'completed').length;

  // ROUTE 1: Home Page
  if (currentPage === 'home') {
    return (
      <HomePage
        siteContent={siteContent}
        currentUser={currentUser}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onNavigateToLogin={() => navigateTo('login')}
        onNavigateToSignUp={() => navigateTo('signup')}
        onNavigateToContact={() => navigateTo('contact')}
      />
    );
  }

  // ROUTE 2: Login Page
  if (currentPage === 'login') {
    return (
      <LoginPage
        users={users}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onLoginSuccess={handleLoginSuccess}
        onNavigateToHome={() => navigateTo('home')}
        onNavigateToSignUp={() => navigateTo('signup')}
        onUpdateUsers={handleUpdateUsers}
      />
    );
  }

  // ROUTE 3: Sign Up Page (New Members & Workspace Registration)
  if (currentPage === 'signup') {
    return (
      <SignUpPage
        organizations={organizations}
        users={users}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onSignUpSuccess={handleSignUpSuccess}
        onNavigateToHome={() => navigateTo('home')}
        onNavigateToLogin={() => navigateTo('login')}
      />
    );
  }

  // ROUTE 4: Contact Us Page
  if (currentPage === 'contact') {
    return (
      <ContactPage
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onNavigateToHome={() => navigateTo('home')}
        onNavigateToLogin={() => navigateTo('login')}
        onNavigateToSignUp={() => navigateTo('signup')}
      />
    );
  }

  // ROUTE 5: Dashboard Workspace Page (STRICT AUTHENTICATION REQUIRED - NO BYPASS)
  if (!currentUser || !isUserAuthenticated()) {
    return (
      <LoginPage
        users={users}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onLoginSuccess={handleLoginSuccess}
        onNavigateToHome={() => navigateTo('home')}
        onNavigateToSignUp={() => navigateTo('signup')}
        onUpdateUsers={handleUpdateUsers}
      />
    );
  }

  return (
    <div className="relative h-screen flex flex-col bg-slate-100 dark:bg-[#07090e] text-[#0f172a] dark:text-[#f8fafc] font-sans selection:bg-indigo-500/20 selection:text-indigo-900 dark:selection:text-indigo-200 transition-colors overflow-hidden">
      {/* Interactive Canvas Mesh & Spotlight Aura */}
      <InteractiveBackground isDark={isDark} />
      {/* Interactive Magnetic Mouse Follower */}
      <InteractiveCursor />

      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 p-3 bg-slate-900 text-white dark:bg-white dark:text-slate-950 rounded-xl border border-slate-700 dark:border-slate-200 flex items-center gap-2.5 text-[13px] font-normal shadow-xl animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Avalon Top Navigation Bar */}
      <Navbar
        organization={currentOrg}
        organizations={organizations}
        currentProject={currentProject}
        currentUser={currentUser}
        users={tenantUsers}
        isDark={isDark}
        isOnline={isOnline}
        pendingSyncCount={pendingSyncCount}
        unreadNotifsCount={unreadCount}
        onToggleTheme={() => setIsDark(!isDark)}
        onToggleOnlineMode={() => {
          const nextState = !isOnline;
          setIsOnline(nextState);
          showToast(nextState ? 'Simulating Online Mode' : 'Simulating Offline Mode (mutations will queue locally)');
        }}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenNewTaskModal={() => {
          setNewTaskInitialStatus('backlog');
          setNewTaskInitialDueDate('');
          setIsNewTaskModalOpen(true);
        }}
        onOpenSearch={() => setIsCommandPaletteOpen(true)}
        onLogout={handleLogout}
        onNavigateHome={() => navigateTo('home')}
        onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
        onOpenOrgTeamModal={() => setIsOrgTeamModalOpen(true)}
        onSwitchTenantOrg={(orgId) => {
          setSelectedTenantOrgId(orgId);
          showToast(orgId === 'all' ? 'Viewing all SaaS organizations' : `Switched tenant context to ${organizations.find((o) => o.id === orgId)?.name}`);
        }}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Avalon Sidebar with tenant projects */}
        <Sidebar
          organization={currentOrg}
          workspace={workspace}
          projects={tenantProjects}
          activeProjectId={activeProjectId}
          activeViewCategory={activeCategory}
          pendingApprovalsCount={pendingApprovalsCount}
          myTasksCount={myTasksCount}
          users={tenantUsers}
          currentUser={currentUser}
          onSelectProject={(id) => {
            setActiveProjectId(id);
            setActiveCategory('project');
          }}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
          onExportBackup={() =>
            exportWorkspaceBackup({
              organization: currentOrg,
              workspace,
              projects: tenantProjects,
              tasks: tenantTasks,
              notifications: tenantNotifications,
              users: tenantUsers,
            })
          }
          onAddNewProject={() => setIsNewProjectModalOpen(true)}
          onEditProject={(proj) => setEditingProject(proj)}
          onOpenOrgTeamModal={() => setIsOrgTeamModalOpen(true)}
          onOpenSuperAdminModal={() => setIsSuperAdminModalOpen(true)}
        />

        {/* Workspace Canvas (Ergonomic slate field with elevated white cards) */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-100 dark:bg-[#07090e] p-4 sm:p-6 lg:p-8 space-y-6">
          {/* If the current user is a Member/Editor and clicked 'My Tasks', show dedicated Member Dashboard */}
          {currentUser.role === 'editor' && activeCategory === 'my_tasks' ? (
            <MemberDashboard
              currentUser={currentUser}
              organization={currentOrg}
              tasks={tenantTasks}
              projects={tenantProjects}
              onSelectTask={(task) => setSelectedTask(task)}
              onOpenVideoPlayer={(instruction, task) =>
                setActiveVideoModal({ instruction, task })
              }
              onToggleTaskComplete={(task) => {
                const newStatus: TaskStatus = task.status === 'completed' ? 'in_progress' : 'completed';
                handleUpdateTask({ ...task, status: newStatus, updatedAt: new Date().toISOString() });
              }}
              onRequestApproval={(taskId) => {
                const task = tasks.find((t) => t.id === taskId);
                if (task) {
                  handleUpdateTask({
                    ...task,
                    status: 'ready_for_approval',
                    approvalStatus: 'pending',
                    updatedAt: new Date().toISOString(),
                  });
                }
              }}
            />
          ) : (
            <>
              {/* Header Block: Headline & View Toggles inside elevated card container */}
              <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[12px] font-semibold tracking-wide uppercase text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-full">
                        {activeCategory === 'project'
                          ? 'Project'
                          : activeCategory === 'my_tasks'
                          ? 'My Tasks'
                          : activeCategory === 'approvals'
                          ? 'Approvals'
                          : 'Reporting'}
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[13px] text-slate-600 dark:text-slate-400 font-medium">
                        {currentOrg.name} ({currentOrg.plan})
                      </span>
                      <span className="text-slate-400">·</span>
                      <span className="text-[13px] text-slate-500 dark:text-slate-400 font-normal">
                        {visibleTasks.length} {visibleTasks.length === 1 ? 'task' : 'tasks'}
                      </span>
                    </div>

                    {/* Display Headline */}
                    <div className="flex items-center gap-3">
                      <h1 className="text-[24px] lg:text-[30px] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.2]">
                        {activeCategory === 'project'
                          ? currentProject?.title || 'Active Project'
                          : activeCategory === 'my_tasks'
                          ? `My Tasks (${currentUser.name})`
                          : activeCategory === 'approvals'
                          ? 'Stakeholder Approvals & Review Loop'
                          : 'Velocity & Delivery Analytics'}
                      </h1>

                      {activeCategory === 'project' && (currentUser.role === 'admin' || currentUser.role === 'super_admin') && (
                        <button
                          onClick={() => setEditingProject(currentProject)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Edit project details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {activeCategory === 'project' && currentProject?.description && (
                      <p className="text-[14px] font-normal text-slate-600 dark:text-slate-300 max-w-3xl mt-1 leading-relaxed">
                        {currentProject.description}
                      </p>
                    )}
                  </div>

                  {/* View Switchers: Segmented Controls */}
                  {(activeCategory === 'project' || activeCategory === 'my_tasks') && (
                    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#181c26] rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto self-start md:self-auto">
                      <button
                        onClick={() => setActiveViewType('board')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg transition-colors whitespace-nowrap ${
                          activeViewType === 'board'
                            ? 'bg-white dark:bg-[#11141c] text-slate-900 dark:text-white font-semibold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span>Board</span>
                      </button>

                      <button
                        onClick={() => setActiveViewType('table')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg transition-colors whitespace-nowrap ${
                          activeViewType === 'table'
                            ? 'bg-white dark:bg-[#11141c] text-slate-900 dark:text-white font-semibold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                      >
                        <TableIcon className="w-3.5 h-3.5" />
                        <span>Table</span>
                      </button>

                      <button
                        onClick={() => setActiveViewType('list')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg transition-colors whitespace-nowrap ${
                          activeViewType === 'list'
                            ? 'bg-white dark:bg-[#11141c] text-slate-900 dark:text-white font-semibold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                      >
                        <ListIcon className="w-3.5 h-3.5" />
                        <span>List</span>
                      </button>

                      <button
                        onClick={() => setActiveViewType('timeline')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg transition-colors whitespace-nowrap ${
                          activeViewType === 'timeline'
                            ? 'bg-white dark:bg-[#11141c] text-slate-900 dark:text-white font-semibold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Timeline</span>
                      </button>

                      <button
                        onClick={() => setActiveViewType('calendar')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg transition-colors whitespace-nowrap ${
                          activeViewType === 'calendar'
                            ? 'bg-white dark:bg-[#11141c] text-slate-900 dark:text-white font-semibold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                      >
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>Calendar</span>
                      </button>

                      <button
                        onClick={() => setActiveViewType('gallery')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-lg transition-colors whitespace-nowrap ${
                          activeViewType === 'gallery'
                            ? 'bg-white dark:bg-[#11141c] text-slate-900 dark:text-white font-semibold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium'
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gallery</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Filter and Search Bar for active view */}
                {(activeCategory === 'project' || activeCategory === 'my_tasks') && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[13px]">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={searchFilter}
                          onChange={(e) => setSearchFilter(e.target.value)}
                          placeholder="Filter tasks by name or tag..."
                          className="pl-8 pr-3 py-1 text-[13px] rounded-lg bg-slate-50 dark:bg-[#181c26] border border-slate-300 dark:border-slate-700 focus:border-indigo-500 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
                        />
                      </div>

                      {/* Status filter */}
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-1 rounded-lg bg-slate-50 dark:bg-[#181c26] border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none cursor-pointer"
                      >
                        <option value="all">All Statuses</option>
                        <option value="backlog">Backlog</option>
                        <option value="in_progress">In Progress</option>
                        <option value="in_review">In Review</option>
                        <option value="ready_for_approval">Ready for Approval</option>
                        <option value="completed">Completed</option>
                      </select>

                      {/* Video Only toggle */}
                      <button
                        onClick={() => setHasVideoOnly(!hasVideoOnly)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border transition-colors ${
                          hasVideoOnly
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-[#ff584a]/40 font-semibold'
                            : 'bg-slate-50 dark:bg-[#181c26] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <Video className="w-3.5 h-3.5 text-[#ff584a]" />
                        <span>Video Instructions Only</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* View Presentation Switcher */}
              <div className="bg-white dark:bg-[#111622] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
                {activeCategory === 'approvals' ? (
                  <ApprovalsView
                    tasks={tenantTasks}
                    users={tenantUsers}
                    currentUser={currentUser}
                    onSelectTask={(task: Task) => setSelectedTask(task)}
                    onApproveTask={handleApproveTask}
                    onRequestChanges={handleRequestChanges}
                    onPlayVideoInstruction={(instruction: VideoInstruction, task: Task) =>
                      setActiveVideoModal({ instruction, task })
                    }
                  />
                ) : activeCategory === 'analytics' ? (
                  <AnalyticsDashboard
                    tasks={tenantTasks}
                    users={tenantUsers}
                    projects={tenantProjects}
                  />
                ) : activeViewType === 'board' ? (
                  <BoardView
                    tasks={visibleTasks}
                    users={tenantUsers}
                    onSelectTask={(task: Task) => setSelectedTask(task)}
                    onUpdateTask={handleUpdateTask}
                    onAddTaskWithStatus={(status: TaskStatus) => {
                      setNewTaskInitialStatus(status);
                      setNewTaskInitialDueDate('');
                      setIsNewTaskModalOpen(true);
                    }}
                    onPlayVideoInstruction={(instruction: VideoInstruction, task: Task) =>
                      setActiveVideoModal({ instruction, task })
                    }
                  />
                ) : activeViewType === 'table' ? (
                  <TableView
                    tasks={visibleTasks}
                    users={tenantUsers}
                    onSelectTask={(task: Task) => setSelectedTask(task)}
                    onUpdateTask={handleUpdateTask}
                    onAddTask={() => {
                      setNewTaskInitialStatus('backlog');
                      setNewTaskInitialDueDate('');
                      setIsNewTaskModalOpen(true);
                    }}
                  />
                ) : activeViewType === 'list' ? (
                  <ListView
                    tasks={visibleTasks}
                    users={tenantUsers}
                    onSelectTask={(task: Task) => setSelectedTask(task)}
                    onUpdateTask={handleUpdateTask}
                    onAddTask={() => {
                      setNewTaskInitialStatus('backlog');
                      setNewTaskInitialDueDate('');
                      setIsNewTaskModalOpen(true);
                    }}
                    onPlayVideoInstruction={(instruction: VideoInstruction, task: Task) =>
                      setActiveVideoModal({ instruction, task })
                    }
                  />
                ) : activeViewType === 'timeline' ? (
                  <TimelineView
                    tasks={visibleTasks}
                    users={tenantUsers}
                    onSelectTask={(task: Task) => setSelectedTask(task)}
                  />
                ) : activeViewType === 'calendar' ? (
                  <CalendarView
                    tasks={visibleTasks}
                    users={tenantUsers}
                    onSelectTask={(task: Task) => setSelectedTask(task)}
                    onAddTaskWithDate={(dateStr: string) => {
                      setNewTaskInitialDueDate(dateStr);
                      setNewTaskInitialStatus('in_progress');
                      setIsNewTaskModalOpen(true);
                    }}
                  />
                ) : (
                  <GalleryView
                    tasks={visibleTasks}
                    users={tenantUsers}
                    onSelectTask={(task: Task) => setSelectedTask(task)}
                    onPlayVideoInstruction={(instruction: VideoInstruction, task: Task) =>
                      setActiveVideoModal({ instruction, task })
                    }
                  />
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Task Details Modal (Asana clean design, closes on backdrop click or Esc) */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          allTasks={tenantTasks}
          users={tenantUsers}
          currentUser={currentUser}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          onRequestApproval={(taskId) => {
            const t = tasks.find((item) => item.id === taskId);
            if (t) {
              handleUpdateTask({
                ...t,
                status: 'ready_for_approval',
                approvalStatus: 'pending',
                updatedAt: new Date().toISOString(),
              });
            }
          }}
          onApproveTask={handleApproveTask}
          onRequestChanges={handleRequestChanges}
        />
      )}

      {/* New Task Creation Modal */}
      {isNewTaskModalOpen && (
        <NewTaskModal
          organizationId={currentProject?.organizationId || currentOrg.id}
          projectId={currentProject?.id || activeProjectId}
          users={tenantUsers}
          currentUserId={currentUser.id}
          initialStatus={newTaskInitialStatus}
          initialDueDate={newTaskInitialDueDate}
          onClose={() => setIsNewTaskModalOpen(false)}
          onAddTask={handleAddTask}
        />
      )}

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <NewProjectModal
          organizationId={currentOrg.id}
          workspaceId={workspace.id}
          users={tenantUsers}
          onClose={() => setIsNewProjectModalOpen(false)}
          onAddProject={handleAddProject}
        />
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          users={tenantUsers}
          onClose={() => setEditingProject(null)}
          onUpdateProject={handleUpdateProject}
          onDeleteProject={handleDeleteProject}
        />
      )}

      {/* Super Admin Hub Modal (SaaS Platform Seller portal) */}
      {isSuperAdminModalOpen && (
        <SuperAdminControlModal
          organizations={organizations}
          users={users}
          siteContent={siteContent}
          onClose={() => setIsSuperAdminModalOpen(false)}
          onUpdateOrganizations={handleUpdateOrganizations}
          onUpdateUsers={handleUpdateUsers}
          onUpdateSiteContent={handleUpdateSiteContent}
        />
      )}

      {/* Organization Admin Team Management Modal */}
      {isOrgTeamModalOpen && (
        <OrgTeamModal
          organization={currentOrg}
          currentUser={currentUser}
          users={users}
          onClose={() => setIsOrgTeamModalOpen(false)}
          onUpdateUsers={handleUpdateUsers}
        />
      )}

      {/* Security & GoDaddy Database Schema Modal */}
      {isSecurityModalOpen && (
        <SecurityAndApiModal onClose={() => setIsSecurityModalOpen(false)} />
      )}

      {/* Notifications Drawer */}
      {isNotificationsOpen && (
        <NotificationDrawer
          notifications={tenantNotifications}
          users={tenantUsers}
          currentUserId={currentUser.id}
          onClose={() => setIsNotificationsOpen(false)}
          onMarkAllRead={() => {
            const updated = notifications.map((n) =>
              n.organizationId === currentOrg.id ? { ...n, read: true } : n
            );
            setNotifications(updated);
            saveNotifications(updated);
          }}
          onSelectNotificationTask={(taskId: string) => {
            const task = tasks.find((t) => t.id === taskId);
            if (task) {
              setSelectedTask(task);
            }
            setIsNotificationsOpen(false);
          }}
        />
      )}

      {/* Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        tasks={tenantTasks}
        projects={tenantProjects}
        users={tenantUsers}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTask={(task: Task) => setSelectedTask(task)}
        onSelectProject={(projId: string) => {
          setActiveProjectId(projId);
          setActiveCategory('project');
        }}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        onOpenNewTaskModal={() => {
          setNewTaskInitialStatus('backlog');
          setNewTaskInitialDueDate('');
          setIsNewTaskModalOpen(true);
        }}
      />

      {/* Standalone Video Player Overlay Modal */}
      {activeVideoModal && (
        <VideoInstructionPlayerModal
          instruction={activeVideoModal.instruction}
          task={activeVideoModal.task}
          onClose={() => setActiveVideoModal(null)}
          onToggleInstructionComplete={(instructionId: string) => {
            const updatedInstructions = activeVideoModal.task.videoInstructions.map((vi) =>
              vi.id === instructionId
                ? { ...vi, isCompletedByEditor: !vi.isCompletedByEditor }
                : vi
            );
            handleUpdateTask({
              ...activeVideoModal.task,
              videoInstructions: updatedInstructions,
            });
            setActiveVideoModal(null);
            showToast('Video instruction status updated.');
          }}
        />
      )}
    </div>
  );
}
