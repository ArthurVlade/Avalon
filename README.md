# Avalon WorkOS 2026 — Next-Generation Creative Architecture

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment%20Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Avalon WorkOS** is a high-velocity enterprise work management and video collaboration platform designed for creative agencies, video production teams, and engineering organizations. It combines deep multi-tenant role-based isolation, interactive video timestamp revision loops, nested task hierarchies, clipboard image uploads, auto-hiding scrollbars, and an obsidian-zinc dark mode.

---

## 🌟 Live Previews & Application Showcase

- **Production / Dev Deployment**: [Avalon WorkOS Live App](https://ais-dev-cynaxn4ncqckk77n6v2nzc-894160699207.europe-west2.run.app)
- **Shared Preview**: [Avalon WorkOS Preview](https://ais-pre-cynaxn4ncqckk77n6v2nzc-894160699207.europe-west2.run.app)

### Application Architecture Preview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                               AVALON WORKOS 2026                                │
│                                                                                 │
│   [◆ Avalon]  Acme Studios / Brand Refresh  [ ⌘K Search tasks... ]   [Add Task] │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ▼ BACKLOG (4) · Upcoming triage & sprint pipeline                              │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐        │
│  │ ⚡ URGENT                        │ │ ⚡ HIGH                         │        │
│  │ 4K Color Grade Revision         │ │ Sound Design & Stem Mastering   │        │
│  │ [🎬 01:24 Intro Hook]           │ │ [2/3 Subtasks] [🖼️ 2 Images]     │        │
│  │ Due: Oct 28 · Assignee: Elena   │ │ Due: Oct 30 · Assignee: Marcus  │        │
│  └─────────────────────────────────┘ └─────────────────────────────────┘        │
│                                                                                 │
│  ▼ IN PROGRESS (3) · Actively in production                                     │
│  ┌─────────────────────────────────┐ ┌─────────────────────────────────┐        │
│  │ ⚡ HIGH                         │ │ ⚡ MEDIUM                       │        │
│  │ 3D Kinetic Typography Loop      │ │ Interactive Brand Guidelines    │        │
│  │ [🎬 00:45 Drop Sequence]        │ │ [1/4 Subtasks] [🖼️ 4 Images]     │        │
│  │ Due: Oct 29 · Assignee: Alex    │ │ Due: Nov 02 · Assignee: Sarah   │        │
│  └─────────────────────────────────┘ └─────────────────────────────────┘        │
│                                                                                 │
│  ▼ IN REVIEW (2) · QA & peer review                                             │
│  ▼ READY FOR APPROVAL (1) · Client / Stakeholder Sign-Off                       │
│  ▼ COMPLETED (8) · Verified & Shipped                                           │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

1. **Perpetual Starry Interactive Atmosphere**:
   - Celestial particle drift running at an unthrottled 60 FPS across light and dark modes.
   - Decoupled animation loops ensure particles continually glide across the screen regardless of cursor movement or hovering.

2. **Zero-Leak System Cursor Suppression**:
   - Dual-layer CSS engine eliminates operating system pointer flicker across buttons, links, inputs, and SVG tags with an adaptive magnetic ring follower.

3. **Auto-Hiding Scrollbar Engine**:
   - Scrollbar stays 100% invisible when idle.
   - Dynamically illuminates during active scrolling or when hovering over the scroll container.

4. **Vertical Stages Pipeline (No Horizontal Overflow)**:
   - Modern vertical pipeline displays `Backlog`, `In Progress`, `In Review`, `Ready for Approval`, and `Completed` stages in an intuitive accordion stack.
   - Smooth vertical scrolling throughout the entire application with responsive multi-column fallback.

5. **Video Editor Directives & Timestamps**:
   - Hyperlink video timestamps (`0:00 - 0:15`) directly into task directives.
   - Built-in video player modal for frame-accurate creative reviews.

6. **Clipboard Image Pasting & Attachment Strips**:
   - Paste screenshots directly from the OS clipboard (`Ctrl+V` / `Cmd+V`) into task descriptions.
   - Traditional drag-and-drop file upload with inline thumbnail strips and click-to-zoom image lightboxes.

7. **Multi-Tenant SaaS Platform Seller Hub**:
   - Multi-tenant architecture with tenant isolation.
   - Superadmin control console allows creating, editing, and deleting customer organizations, setting MRR, configuring seat allocations, and managing cross-organization credentials.

8. **Restrained Anti-AI-Slop Dark Mode**:
   - Curated obsidian (`#09090b`), titanium, and deep zinc palette with hairline specular highlights (`shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]`) adhering to modern human-crafted design guidelines.

---

## 🛠️ Complete Dependencies Breakdown

Below is the complete list of runtime and developer dependencies declared in `package.json`, along with the technical justification for each:

### Runtime Dependencies (`dependencies`)

| Package | Version | Purpose & Description |
| :--- | :--- | :--- |
| **`react`** | `^19.0.1` | Modern React core library powering component architecture, state hooks, and client-side rendering. |
| **`react-dom`** | `^19.0.1` | React DOM renderer for mounting the single-page application to the browser DOM. |
| **`vite`** | `^8.3.0` | Ultra-fast frontend build tool and dev server providing ESM bundling, asset optimization, and instant startup. |
| **`@tailwindcss/vite`** | `^4.3.3` | Native Tailwind CSS v4 compiler plugin for Vite, enabling direct `@import "tailwindcss";` styling without legacy PostCSS config. |
| **`@vitejs/plugin-react`** | `^6.1.1` | Official Vite plugin for React providing JSX transformation and Fast Refresh support. |
| **`lucide-react`** | `^0.546.0` | Modern, lightweight icon system providing crisp SVG iconography across navigation, task cards, and administrative controls. |
| **`motion`** | `^12.23.24` | Production-grade motion and physics animation library for smooth UI transitions, micro-interactions, and modal animations. |
| **`@google/genai`** | `^2.4.0` | Official Google GenAI SDK for optional AI-assisted task workflows and server-side processing capabilities. |
| **`express`** | `^4.21.2` | Minimalist web framework available for local server proxying, API routes, and full-stack deployment scenarios. |
| **`dotenv`** | `^17.2.3` | Environment variable loader for managing local environment configs securely without hardcoded credentials. |

### Development Dependencies (`devDependencies`)

| Package | Version | Purpose & Description |
| :--- | :--- | :--- |
| **`typescript`** | `^7.0.2` | Typed JavaScript superset providing end-to-end type safety, interfaces, and compile-time error detection. |
| **`esbuild`** | `^0.28.2` | High-performance JavaScript/TypeScript bundler and minifier aligned with Vite's peer dependency requirement (`^0.27.0 \|\| ^0.28.0`). |
| **`tailwindcss`** | `^4.3.3` | Next-generation utility-first CSS framework powering the application's responsive layouts and dark mode themes. |
| **`tsx`** | `^4.21.0` | Zero-config TypeScript execution CLI for Node.js scripts and server processes. |
| **`autoprefixer`** | `^10.4.21` | CSS vendor prefix automation tool ensuring cross-browser styling compatibility. |
| **`@types/react`** | `^19.3.0` | TypeScript definitions and types for React 19 components and hooks. |
| **`@types/react-dom`** | `^19.3.0` | TypeScript definitions for React DOM client operations. |
| **`@types/node`** | `^22.14.0` | TypeScript definitions for Node.js runtime APIs, file system helpers, and environment variables. |
| **`@types/express`** | `^4.17.21` | TypeScript definitions for Express application routing and middleware. |

---

## ⚡ Vercel Deployment Compatibility Guide

### Root Cause of the Vercel Build Error

When deploying to Vercel, npm runs in strict peer dependency resolution mode by default (equivalent to `--strict-peer-deps` on modern npm versions).

`vite@8.3.1` specifies:
```json
"peerDependencies": {
  "esbuild": "^0.27.0 || ^0.28.0"
}
```
If `package.json` pins `esbuild: "^0.25.0"`, npm encounters an `ERESOLVE` conflict:
```
npm error Conflicting peer dependency: esbuild@0.28.2
npm error peerOptional esbuild@"^0.27.0 || ^0.28.0" from vite@8.3.1
npm error Found: esbuild@0.25.12
```

### The Solution Implemented in this Repository

This codebase is configured to be **100% compatible with Vercel** through three complementary layers:

1. **Updated `package.json`**:
   `esbuild` is updated to `"^0.28.2"`, satisfying Vite 8's peer dependency requirement natively.

2. **Added `.npmrc`**:
   ```ini
   legacy-peer-deps=true
   ```
   Ensures npm tolerates peer dependency overlaps automatically on both local machines and CI/CD pipelines.

3. **Added `vercel.json`**:
   ```json
   {
     "$schema": "https://openapi.vercel.sh/vercel.json",
     "framework": "vite",
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install --legacy-peer-deps",
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
   - Specifies `installCommand: "npm install --legacy-peer-deps"` to guarantee clean package resolution on Vercel build runners.
   - Configures SPA rewrites so direct navigation and refreshes to routes (`/#/login`, `/#/dashboard`, `/#/contact`) resolve cleanly to `index.html`.

---

## 🚢 How to Deploy to Vercel

### Method 1: Deploy via Vercel Web Dashboard (Recommended)

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com](https://vercel.com) and log in.
3. Click **"Add New..."** > **"Project"**.
4. Import your `avalon-workos` repository.
5. In the **Configure Project** screen, Vercel will automatically detect `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install --legacy-peer-deps`
6. Click **Deploy**. Your application will build and deploy in under 60 seconds!

### Method 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. Authenticate with your Vercel account:
   ```bash
   vercel login
   ```

3. Deploy from the root directory:
   ```bash
   vercel
   ```

4. For production release:
   ```bash
   vercel --prod
   ```

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-org/avalon-workos.git
cd avalon-workos
```

### 2. Install dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production
```bash
npm run build
```
The compiled, minified bundle will be output to the `dist/` directory.

### 5. Typecheck & Lint
```bash
npm run lint
```

---

## 👥 Default Accounts & Role Credentials

Avalon features strict role-based access control (RBAC). You can log in using any of the following accounts:

| Role | Name | Email | Password | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Marcus Vance | `marcus@avalon.io` | `SuperAdmin2026!` | Global SaaS tenant manager, create/edit/delete organizations, security audit, database schemas. |
| **Org Admin** | Alexander Wright | `alexander@acme.com` | `AcmeAdmin2026!` | Workspace projects, invite & manage team members, approve deliverables, edit tasks. |
| **Project Manager** | Elena Rostova | `elena@acme.com` | `MemberPass2026!` | Sprint management, project creation, task editing, approvals. |
| **Video Editor** | David Chen | `david@acme.com` | `MemberPass2026!` | Task editing, subtask checklists, video timestamp directives, image attachments. |
| **Reviewer / Client** | Sophia Martinez | `sophia@acme.com` | `MemberPass2026!` | Deliverable approvals, change requests, comment reviews. |

---

## 📄 License & Credits

Distributed under the MIT License. See `LICENSE` for details.

Made with love by - **TheSocialAxis**
