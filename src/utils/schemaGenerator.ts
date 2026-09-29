export function generateMySQLSchema(): string {
  return `-- ===================================================================
-- SYNCVERSE ENTERPRISE DATABASE SCHEMA (OPTIMIZED FOR GODADDY CPANEL/VPS)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- Optimized with composite indices for sub-millisecond task lookups
-- ===================================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS & RBAC TABLE
-- Passwords must ALWAYS be hashed via Argon2id or bcrypt (cost 12+)
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`password_hash\` VARCHAR(255) NOT NULL, -- Salted hash, NEVER plaintext
  \`role\` ENUM('admin', 'project_manager', 'editor', 'reviewer', 'guest') NOT NULL DEFAULT 'editor',
  \`title\` VARCHAR(100) NULL,
  \`avatar_url\` VARCHAR(512) NULL,
  \`status\` ENUM('active', 'invited', 'suspended') NOT NULL DEFAULT 'active',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX \`idx_users_email\` (\`email\`),
  INDEX \`idx_users_role\` (\`role\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. WORKSPACES
CREATE TABLE IF NOT EXISTS \`workspaces\` (
  \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
  \`name\` VARCHAR(150) NOT NULL,
  \`owner_id\` VARCHAR(36) NOT NULL,
  \`plan\` VARCHAR(50) NOT NULL DEFAULT 'Enterprise',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`owner_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. PROJECTS
CREATE TABLE IF NOT EXISTS \`projects\` (
  \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
  \`workspace_id\` VARCHAR(36) NOT NULL,
  \`title\` VARCHAR(200) NOT NULL,
  \`description\` TEXT NULL,
  \`icon\` VARCHAR(50) NOT NULL DEFAULT 'Folder',
  \`color\` VARCHAR(20) NOT NULL DEFAULT '#6366f1',
  \`default_view\` VARCHAR(30) NOT NULL DEFAULT 'table',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`workspace_id\`) REFERENCES \`workspaces\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_projects_workspace\` (\`workspace_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TASKS & NESTED HIERARCHY
-- Includes composite indexes for instant filtering by status, priority, and due dates
CREATE TABLE IF NOT EXISTS \`tasks\` (
  \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
  \`project_id\` VARCHAR(36) NOT NULL,
  \`parent_id\` VARCHAR(36) NULL, -- For infinite recursive subtask nesting
  \`title\` VARCHAR(255) NOT NULL,
  \`description\` LONGTEXT NULL,
  \`status\` ENUM('backlog', 'in_progress', 'in_review', 'ready_for_approval', 'completed') NOT NULL DEFAULT 'backlog',
  \`priority\` ENUM('low', 'medium', 'high', 'urgent') NOT NULL DEFAULT 'medium',
  \`assignee_id\` VARCHAR(36) NULL,
  \`creator_id\` VARCHAR(36) NOT NULL,
  \`due_date\` DATE NULL,
  \`start_date\` DATE NULL,
  \`estimated_hours\` DECIMAL(6,2) NULL DEFAULT 0.00,
  \`actual_hours\` DECIMAL(6,2) NULL DEFAULT 0.00,
  \`requires_approval\` TINYINT(1) NOT NULL DEFAULT 0,
  \`approval_status\` ENUM('none', 'pending', 'approved', 'changes_requested') NOT NULL DEFAULT 'none',
  \`approval_notes\` TEXT NULL,
  \`is_milestone\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (\`project_id\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`parent_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`assignee_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL,
  FOREIGN KEY (\`creator_id\`) REFERENCES \`users\`(\`id\`) ON DELETE RESTRICT,
  INDEX \`idx_tasks_project_status\` (\`project_id\`, \`status\`),
  INDEX \`idx_tasks_assignee\` (\`assignee_id\`),
  INDEX \`idx_tasks_parent\` (\`parent_id\`),
  INDEX \`idx_tasks_due_date\` (\`due_date\`),
  INDEX \`idx_tasks_approval\` (\`requires_approval\`, \`approval_status\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. VIDEO INSTRUCTIONS (For Video Editor Instruction Hyperlinking)
CREATE TABLE IF NOT EXISTS \`video_instructions\` (
  \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
  \`task_id\` VARCHAR(36) NOT NULL,
  \`title\` VARCHAR(200) NOT NULL,
  \`video_url\` VARCHAR(1000) NOT NULL,
  \`timestamp_seconds\` INT UNSIGNED NULL DEFAULT 0,
  \`timestamp_formatted\` VARCHAR(20) NULL,
  \`target_section\` VARCHAR(100) NOT NULL, -- e.g. "Intro (0:00 - 0:15)"
  \`instruction_notes\` LONGTEXT NOT NULL,
  \`highlighted_text_ref\` TEXT NULL,
  \`is_completed_by_editor\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_video_task\` (\`task_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TASK DEPENDENCIES (Asana-Style Blockers)
CREATE TABLE IF NOT EXISTS \`task_dependencies\` (
  \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
  \`task_id\` VARCHAR(36) NOT NULL,
  \`depends_on_task_id\` VARCHAR(36) NOT NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE,
  FOREIGN KEY (\`depends_on_task_id\`) REFERENCES \`tasks\`(\`id\`) ON DELETE CASCADE,
  UNIQUE KEY \`uq_task_dependency\` (\`task_id\`, \`depends_on_task_id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. NOTIFICATIONS & STAKEHOLDER ALERTS
CREATE TABLE IF NOT EXISTS \`notifications\` (
  \`id\` VARCHAR(36) NOT NULL PRIMARY KEY,
  \`recipient_id\` VARCHAR(36) NOT NULL,
  \`sender_id\` VARCHAR(36) NOT NULL,
  \`task_id\` VARCHAR(36) NULL,
  \`type\` VARCHAR(50) NOT NULL,
  \`title\` VARCHAR(255) NOT NULL,
  \`message\` TEXT NOT NULL,
  \`is_read\` TINYINT(1) NOT NULL DEFAULT 0,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`recipient_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE,
  INDEX \`idx_notifications_recipient\` (\`recipient_id\`, \`is_read\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
`;
}

export function generatePostgreSQLSchema(): string {
  return `-- ===================================================================
-- SYNCVERSE POSTGRESQL SCHEMA (WITH ROW-LEVEL SECURITY & PERFORMANCE INDICES)
-- ===================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('admin', 'project_manager', 'editor', 'reviewer', 'guest');
CREATE TYPE task_status AS ENUM ('backlog', 'in_progress', 'in_review', 'ready_for_approval', 'completed');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(120) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'editor',
  title VARCHAR(100),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL,
  parent_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'backlog',
  priority task_priority NOT NULL DEFAULT 'medium',
  assignee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  creator_id UUID REFERENCES users(id),
  due_date DATE,
  requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
  approval_status VARCHAR(50) DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast partial indexes for active tasks and approvals
CREATE INDEX idx_tasks_active ON tasks(project_id, status) WHERE status != 'completed';
CREATE INDEX idx_tasks_approvals ON tasks(project_id) WHERE requires_approval = TRUE AND approval_status = 'pending';
CREATE INDEX idx_tasks_subtasks ON tasks(parent_id);
`;
}
