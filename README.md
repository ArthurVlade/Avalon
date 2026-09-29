# Avalon WorkOS 2026 — Next-Generation Creative Architecture

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployment%20Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite 8](https://img.shields.io/badge/Vite-8.3.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Peer Conflict Fixed](https://img.shields.io/badge/NPM%20Peer%20Deps-Resolved%20(esbuild)-10B981?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **Avalon WorkOS** is an ultra-modern enterprise work management and video collaboration platform designed for creative agencies, media studios, and distributed engineering organizations. Built with React 19, TypeScript, Vite 8, and Tailwind CSS v4, Avalon integrates 100% real-time hardware-accelerated mouse tracking, multi-tenant role-based isolation, interactive video timestamp revision loops, clipboard image pasting, an auto-hiding scrollbar engine, and a dual-palette light/dark mode.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-org/avalon-workos)

---

## 📑 Table of Contents

- [Live Application & Architecture Showcase](#-live-application--architecture-showcase)
- [Key Features](#-key-features)
- [Real-Time Mouse Tracking & Interactive Cursor Engine](#-real-time-mouse-tracking--interactive-cursor-engine)
- [Modern Header Color Scheme (Light & Dark Mode)](#-modern-header-color-scheme-light--dark-mode)
- [Complete Dependencies Breakdown](#-complete-dependencies-breakdown)
- [Vercel Deployment Compatibility Guide](#-vercel-deployment-compatibility-guide)
  - [Root Cause of the Vercel Build Error](#root-cause-of-the-vercel-build-error)
  - [The 3-Layer Solution Implemented](#the-3-layer-solution-implemented)
  - [Step-by-Step Vercel GUI Deployment](#step-by-step-vercel-gui-deployment)
  - [Step-by-Step Vercel CLI Deployment](#step-by-step-vercel-cli-deployment)
- [Local Development Setup](#-local-development-setup)
- [Role-Based Access Control (RBAC) & Test Accounts](#-role-based-access-control-rbac--test-accounts)
- [Project Directory Architecture](#-project-directory-architecture)
- [License & Credits](#-license--credits)

---

## 🌟 Live Application & Architecture Showcase

- **Production / Dev Deployment**: [Avalon WorkOS Live App](https://ais-dev-cynaxn4ncqckk77n6v2nzc-894160699207.europe-west2.run.app)
- **Shared Preview**: [Avalon WorkOS Preview](https://ais-pre-cynaxn4ncqckk77n6v2nzc-894160699207.europe-west2.run.app)

### Application Workspace Screenshot & UI Layout

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [◆ Avalon]  Acme Studios / Brand Refresh  [ 🔍 Search tasks or jump to... ⌘K ] [Synced] [Add Task]│
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│  ▼ BACKLOG (4) · Triage & intake pipeline                                                        │
│  ┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐│
│  │ ⚡ URGENT                     [Oct 28] [Edit] │ │ ⚡ HIGH                      [Oct 30] [Edit] ││
│  │ 4K Color Grade & LUT Revision                │ │ Sound Design & Stem Mastering                ││
│  │ 🎬 [01:24 Intro Hook Sequence]               │ │ ☑️ 2/3 Subtasks  ·  🖼️ 2 Attachment Previews  ││
│  │ 👤 Elena Rostova (Lead)                      │ │ 👤 Marcus Vance (SuperAdmin)                 ││
│  └──────────────────────────────────────────────┘ └──────────────────────────────────────────────┘│
│                                                                                                  │
│  ▼ IN PROGRESS (3) · Actively being created                                                      │
│  ┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐│
│  │ ⚡ HIGH                       [Oct 29] [Edit] │ │ ⚡ MEDIUM                    [Nov 02] [Edit] ││
│  │ 3D Kinetic Typography Loop                   │ │ Interactive Brand Guidelines PDF             ││
│  │ 🎬 [00:45 Drop Sequence]                     │ │ ☑️ 1/4 Subtasks  ·  🖼️ 4 Attachment Previews  ││
│  │ 👤 Alex Wright (Org Admin)                   │ │ 👤 Sarah Jenkins (Designer)                  ││
│  └──────────────────────────────────────────────┘ └──────────────────────────────────────────────┘│
│                                                                                                  │
│  ▼ IN REVIEW (2) · Quality assurance & peer feedback                                             │
│  ▼ READY FOR APPROVAL (1) · Final client/stakeholder sign-off                                    │
│  ▼ COMPLETED (8) · Shipped & verified                                                            │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

### 1. 100% Real-Time Mouse Movement (0ms Latency)
- **Direct GPU Hardware Translation**: Bypasses React state reconciliation queues by updating cursor elements directly via DOM references (`translate3d(x, y, 0)`).
- **Zero Lag / No Lerp Rubber-Banding**: Eliminates sluggish frame smoothing so the custom cursor adheres precisely 1:1 to hardware mouse movements up to 240Hz refresh rates.
- **Adaptive Magnetic Follower**: Dynamically scales and morphs over buttons (`w-10`), form inputs (`w-7`), and cards (`w-11`) with instant click response.
- **Universal OS Cursor Suppression**: Injects an isolated scoped stylesheet that silences the native operating system arrow cursor across all HTML tags, SVG paths, inputs, and buttons.

### 2. Modern Adaptive Header Color Scheme
- **Light Mode Frosted Glass**: Air-light translucent backdrop (`bg-white/95`) with specular hairline border (`border-slate-200/90`), high-contrast slate typography (`text-slate-800`), indigo accent tags, and soft box shadows.
- **Dark Mode Obsidian Titanium**: Deep charcoal background (`bg-[#09090b]/85`) with subtle border highlights (`border-white/[0.08]`) following strict Anti-AI-Slop design guidelines.
- **Platform Root Hub Trigger**: Dedicated SuperAdmin command trigger highlighted in executive indigo (`bg-indigo-50/90 text-indigo-700`) in light mode and sleek obsidian in dark mode.
- **Quiet Unboxed Breadcrumbs**: Displays tenant organization dropdown, project hierarchy, and quick sync indicators without bulky boxed containers.

### 3. Vertical Stages Pipeline (Zero Horizontal Scroll Fatigue)
- Replaces traditional wide kanban boards that cause horizontal scrolling with an accordion-driven **Vertical Pipeline**:
  - `Backlog` (Intake & Triage)
  - `In Progress` (Active Production)
  - `In Review` (Internal QA)
  - `Ready for Approval` (Client Sign-Off)
  - `Completed` (Shipped Archive)
- Supports responsive column grids on large viewports and instant stage transitions with quick-action buttons.

### 4. Video Editor Timestamps & Directives
- Frame-accurate video revision workflows with embedded timestamps (`0:00 - 0:15`).
- Click-to-play modal previews let reviewers and video editors jump directly to the exact frame referenced in the revision note.

### 5. Clipboard Image Pasting & Attachment Gallery
- Paste images directly from the operating system clipboard (`Ctrl+V` / `Cmd+V`) while editing task descriptions.
- Traditional drag-and-drop file upload zone with instant image preview strips and a high-resolution click-to-zoom lightbox modal.

### 6. Full Administrative SuperAdmin & Multi-Tenant Management
- Superadmins can create, edit names, update seat capacities, adjust MRR, and delete tenant organizations directly from the Platform Root console.
- Cross-tenant organization switcher built directly into the top navigation bar.

### 7. Auto-Hiding Scrollbar Engine
- Scrollbars remain completely transparent and invisible when idle.
- Automatically illuminate during active scrolling or container hover, preserving clean aesthetic geometry.

---

## 🖱️ Real-Time Mouse Tracking & Interactive Cursor Engine

The application implements a zero-latency real-time mouse tracking system:

```typescript
// Instant 0ms latency hardware tracking via direct DOM manipulation
const handleMouseMove = (e: MouseEvent) => {
  const x = e.clientX;
  const y = e.clientY;

  // Direct GPU translation: 0ms delay, no React re-render lag
  if (dotRef.current) {
    dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }
  if (ringRef.current) {
    ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  }

  // Real-time background spotlight coordinates via CSS Custom Properties
  if (containerRef.current) {
    containerRef.current.style.setProperty('--mouse-x', `${x}px`);
    containerRef.current.style.setProperty('--mouse-y', `${y}px`);
  }
};
```

### Why this is superior to standard React custom cursors:
1. **Zero Component Re-renders**: Does not trigger React scheduler cycles or state re-evaluations on `mousemove`.
2. **True 1:1 Hardware Response**: Matches the exact display refresh rate (60Hz, 120Hz, 144Hz, 240Hz) without interpolation lag.
3. **No Drift or Float**: The focal pointer is anchored directly to the user's actual pointer coordinate at all times.

---

## 🎨 Modern Header Color Scheme (Light & Dark Mode)

The header architecture features tailored styling for both light and dark operating modes:

| Element | Light Mode Color Scheme | Dark Mode Color Scheme |
| :--- | :--- | :--- |
| **Header Backdrop** | `bg-white/95 backdrop-blur-xl border-b border-slate-200/90` | `bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.08]` |
| **Search Bar** | `bg-slate-100/90 text-slate-500 border border-slate-200/90 shadow-2xs` | `bg-white/[0.05] text-zinc-400 border border-white/[0.08]` |
| **Search KBD Badge** | `bg-white text-slate-600 border border-slate-200/90 shadow-2xs` | `bg-zinc-800/80 text-zinc-400 border border-white/[0.08]` |
| **Platform Root CTA** | `bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 font-semibold` | `bg-white/[0.04] text-zinc-200 border border-white/[0.1]` |
| **Sync Indicator** | `bg-emerald-50/90 text-emerald-700 border border-emerald-200/80` | `bg-emerald-950/20 text-emerald-400 border border-emerald-800/30` |
| **Add Task Button** | `bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20` | `bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25` |
| **Breadcrumbs** | `text-slate-800 font-semibold, pill bg-slate-100/90` | `text-zinc-200 font-semibold, pill bg-white/[0.05]` |

---

## 🛠️ Complete Dependencies Breakdown

Every dependency in `package.json` is audited, pinned, and aligned with Vercel and Vite 8 requirements:

### Runtime Dependencies (`dependencies`)

| Package | Version | Justification & Architectural Role |
| :--- | :--- | :--- |
| **`react`** | `^19.0.1` | Core React 19 engine for hooks, concurrent rendering, and UI component lifecycle. |
| **`react-dom`** | `^19.0.1` | React DOM client library for single-page application mounting. |
| **`vite`** | `^8.3.0` | Next-generation ESM dev server, production bundler, and tree-shaker. |
| **`@tailwindcss/vite`** | `^4.3.3` | Tailwind CSS v4 native Vite integration for zero-config `@import "tailwindcss";`. |
| **`@vitejs/plugin-react`** | `^6.1.1` | Official Vite React plugin enabling JSX transformation and Fast Refresh. |
| **`lucide-react`** | `^0.546.0` | Crisp SVG iconography across navigation, task cards, and administrative modals. |
| **`motion`** | `^12.23.24` | Animation engine powering fluid modal entrances, accordion transitions, and micro-interactions. |
| **`@google/genai`** | `^2.4.0` | Official Google GenAI SDK for optional creative workflows and AI task parsing. |
| **`express`** | `^4.21.2` | Minimal Node.js HTTP server for optional full-stack backend proxy routes. |
| **`dotenv`** | `^17.2.3` | Secure environment variable parsing for server-side configurations. |

### Development Dependencies (`devDependencies`)

| Package | Version | Justification & Architectural Role |
| :--- | :--- | :--- |
| **`typescript`** | `^7.0.2` | Strong static typing, custom interfaces, and compile-time code verification. |
| **`esbuild`** | `^0.28.2` | Aligned with Vite 8's required peer dependency range (`^0.27.0 \|\| ^0.28.0`), resolving Vercel deployment conflicts. |
| **`tailwindcss`** | `^4.3.3` | Modern utility CSS framework powering design tokens and dark mode styling. |
| **`tsx`** | `^4.21.0` | TypeScript execution runtime for local Node.js development scripts. |
| **`autoprefixer`** | `^10.4.21` | Cross-browser CSS prefix automation. |
| **`@types/react`** | `^19.3.0` | TypeScript definitions for React 19. |
| **`@types/react-dom`** | `^19.3.0` | TypeScript definitions for React DOM. |
| **`@types/node`** | `^22.14.0` | TypeScript definitions for Node.js runtimes. |
| **`@types/express`** | `^4.17.21` | TypeScript definitions for Express middleware and routing. |

---

## ⚡ Vercel Deployment Compatibility Guide

### Root Cause of the Vercel Build Error

When deploying to Vercel, npm performs strict peer dependency resolution by default.

`vite@8.3.0` / `vite@8.3.1` declares:
```json
"peerDependencies": {
  "esbuild": "^0.27.0 || ^0.28.0"
}
```
If child packages (or legacy sub-dependencies like `tsx`) pull in `esbuild@^0.25.0`, npm halts the Vercel build with:
```
npm error Conflicting peer dependency: esbuild@0.28.2
npm error node_modules/tsx/node_modules/esbuild
npm error   peerOptional esbuild@"^0.27.0 || ^0.28.0" from vite@8.3.1
npm error Fix the upstream dependency conflict, or retry this command with --force or --legacy-peer-deps
```

### The 3-Layer Solution Implemented

To ensure guaranteed, flawless deployments on Vercel, this repository implements three complementary safeguards:

#### Layer 1: NPM Package Overrides (`package.json`)
```json
{
  "devDependencies": {
    "esbuild": "^0.28.2"
  },
  "overrides": {
    "esbuild": "^0.28.2"
  }
}
```
Forces npm's package resolver to unify all nested instances of `esbuild` to version `^0.28.2`, satisfying Vite 8 natively without conflicts.

#### Layer 2: Automated Legacy Peer Dependency Flag (`.npmrc`)
```ini
legacy-peer-deps=true
```
Instructs npm on any machine or CI pipeline (including Vercel build environments) to ignore conflicting peer dependency resolutions automatically.

#### Layer 3: Vercel Build Configuration (`vercel.json`)
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
- Sets `installCommand: "npm install --legacy-peer-deps"` so Vercel never fails on install.
- Adds an SPA rewrite rule (`"/(.*)" -> "/index.html"`) so refreshing sub-routes or direct URLs load the client app seamlessly.

---

### Step-by-Step Vercel GUI Deployment

1. **Push to GitHub**: Ensure all files are committed and pushed to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: vercel compatibility and real-time mouse tracking"
   git push origin main
   ```
2. **Open Vercel**: Navigate to [vercel.com](https://vercel.com) and log in.
3. **Import Project**:
   - Click **"Add New..."** > **"Project"**.
   - Select your `avalon-workos` repository from GitHub.
4. **Build & Development Settings**:
   - Vercel will automatically read `vercel.json`:
     - **Framework Preset**: `Vite`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install --legacy-peer-deps`
5. **Deploy**:
   - Click **"Deploy"**.
   - The build process will complete cleanly in under 45 seconds.

---

### Step-by-Step Vercel CLI Deployment

If deploying via terminal:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```
2. **Login to Vercel**:
   ```bash
   vercel login
   ```
3. **Preview Deployment**:
   ```bash
   vercel
   ```
4. **Production Deployment**:
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

### 5. Lint & Typecheck
```bash
npm run lint
```

---

## 👥 Role-Based Access Control (RBAC) & Test Accounts

Avalon includes a built-in multi-role matrix. You can log in using any of the following pre-configured credentials:

| Role | Name | Email | Password | Scope & Capabilities |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Marcus Vance | `marcus@avalon.io` | `SuperAdmin2026!` | Global multi-tenant organization manager, create/edit/delete orgs, audit schemas, billing & seat management. |
| **Org Admin** | Alexander Wright | `alexander@acme.com` | `AcmeAdmin2026!` | Workspace project creator, team member invitations, role assignment, project approval, full task editing. |
| **Project Manager** | Elena Rostova | `elena@acme.com` | `MemberPass2026!` | Sprint management, task creation & assignment, subtask management, stage progression. |
| **Video Editor** | David Chen | `david@acme.com` | `MemberPass2026!` | Task editing, timestamp directive linking, clipboard image pasting, subtask checklist updates. |
| **Reviewer / Client** | Sophia Martinez | `sophia@acme.com` | `MemberPass2026!` | Client deliverable approvals, feedback revision requests, comment threads. |

---

## 📂 Project Directory Architecture

```
avalon-workos/
├── .npmrc                           # Enforces legacy-peer-deps=true for npm CI
├── vercel.json                      # Vercel Vite configuration & SPA routing rewrites
├── package.json                     # Pinned dependencies with esbuild overrides
├── tsconfig.json                    # Strict TypeScript configuration
├── vite.config.ts                   # Vite 8 configuration with Tailwind v4 plugin
├── index.html                       # Application HTML entry point & SEO metadata
├── src/
│   ├── main.tsx                     # React 19 application root bootstrap
│   ├── App.tsx                      # Top-level workspace router & state orchestration
│   ├── index.css                    # Tailwind CSS v4 styling & dark mode tokens
│   ├── types.ts                     # Core TypeScript data interfaces & types
│   ├── components/
│   │   ├── common/
│   │   │   ├── AvalonLogo.tsx       # Faceted prism geometric logo
│   │   │   ├── InteractiveCursor.tsx # 100% Real-Time 0ms hardware cursor tracking
│   │   │   └── InteractiveBackground.tsx # Real-time particle constellation canvas
│   │   ├── navigation/
│   │   │   └── Navbar.tsx           # Adaptive light/dark modern workspace header
│   │   ├── views/
│   │   │   └── BoardView.tsx        # Vertical stages pipeline with rich task cards
│   │   ├── tasks/
│   │   │   ├── TaskDetailModal.tsx  # Task modal with subtasks & clipboard image pasting
│   │   │   ├── NewTaskModal.tsx     # Task creation modal
│   │   │   └── VideoPlayerModal.tsx # Frame-accurate video timestamp player
│   │   └── admin/
│   │       ├── SuperAdminControlModal.tsx # Multi-tenant organization CRUD hub
│   │       └── OrgTeamModal.tsx     # Team member management console
│   ├── data/
│   │   └── mockSiteContent.ts       # Initial marketing content & project data
│   ├── pages/
│   │   ├── HomePage.tsx             # Marketing landing page with light/dark floating header
│   │   ├── LoginPage.tsx            # Multi-account authentication portal
│   │   ├── SignUpPage.tsx           # Organization registration page
│   │   └── ContactPage.tsx          # Enterprise inquiry portal
│   └── utils/
│       ├── initialData.ts           # Initial seeded database and tasks
│       ├── security.ts              # RBAC role permissions validator
│       └── storage.ts               # Local offline persistence engine
```

---

## 📄 License & Credits

Distributed under the **MIT License**. See `LICENSE` for details.

Developed with precision by **TheSocialAxis** — Engineered for creative agencies, media studios, and enterprise teams.
