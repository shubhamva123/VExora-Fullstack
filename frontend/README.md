# VExora — AI-Powered Productivity Platform

VExora is a premium, enterprise-grade frontend for an AI-powered productivity platform. It provides notes, tasks, calendar, revision planning, AI chat, analytics, and more — built with a polished, modern UI inspired by Apple, Linear, Notion, Arc Browser, ChatGPT, and Raycast.

This repository contains the **complete frontend only**. It is designed to integrate with an existing FastAPI backend via Axios service layers with clean placeholder methods.

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | TailwindCSS + CSS custom properties |
| Routing | React Router v6 |
| State | React Context (global) + local state (feature-level) |
| Animation | Framer Motion |
| Icons | Lucide React |
| UI Library | shadcn/ui (Radix primitives) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Toasts | Sonner |
| HTTP | Axios |

---

## Project Structure

```
vexora/
├── public/                  # Static assets (favicon)
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui primitives (buttons, cards, dialogs, etc.)
│   │   ├── layout/          # Sidebar, Topbar
│   │   ├── dashboard/       # Dashboard widgets (StatCard, ActivityChart)
│   │   └── common/          # Shared components (PageHeader, EmptyState, CommandPalette, etc.)
│   ├── contexts/            # React Context providers
│   │   ├── theme-context.tsx         # Dark/light theme engine
│   │   ├── auth-context.tsx          # Authentication state
│   │   ├── notification-context.tsx  # Global notifications
│   │   ├── preferences-context.tsx  # User preferences
│   │   └── command-palette-context.tsx
│   ├── providers/
│   │   └── app-providers.tsx          # Wraps all providers
│   ├── layouts/
│   │   ├── auth-layout.tsx           # Animated auth layout
│   │   └── dashboard-layout.tsx      # Main app shell (sidebar + topbar)
│   ├── pages/
│   │   ├── auth/                     # Login, Register, Forgot, Reset
│   │   ├── dashboard/                # Dashboard, Notes, Tasks, Calendar, AI Chat, etc.
│   │   └── errors/                   # 404, 500, Unauthorized, Network Error
│   ├── services/                    # Axios API service layer (placeholder methods)
│   │   ├── api-client.ts            # Axios instance + interceptors
│   │   ├── auth.service.ts
│   │   ├── notes.service.ts
│   │   ├── tasks.service.ts
│   │   └── index.ts                 # Calendar, revision, chat, notification, analytics, summary
│   ├── hooks/                        # useMediaQuery, useLocalStorage, useToast
│   ├── lib/
│   │   ├── utils.ts                  # cn(), formatDate, getGreeting, etc.
│   │   └── mock-data.ts              # Demo data for UI development
│   ├── types/                        # TypeScript interfaces
│   ├── constants/                    # App constants, sidebar items, quotes, etc.
│   ├── animations/                   # (reserved for shared animation variants)
│   ├── assets/                       # (reserved for images, illustrations)
│   ├── App.tsx                       # Root router
│   ├── main.tsx                      # Entry point
│   └── index.css                     # Global styles + theme tokens
├── .env                              # VITE_API_BASE_URL
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run typecheck
```

---

## Environment Variables

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8000/api
```

The API base URL is read in `src/constants/index.ts` and used by the Axios client (`src/services/api-client.ts`). **Never hardcode API URLs in components** — always use the service layer.

---

## Design System

### Theme Engine

The theming system uses CSS custom properties (HSL color values) defined in `src/index.css`. Two themes are built-in:

- **Dark** (default): matte black, charcoal, deep navy with blue/green/orange accents
- **Light**: clean whites with the same accent palette

Themes are toggled via the `ThemeProvider` in `src/contexts/theme-context.tsx`. The `useTheme()` hook exposes `theme`, `setTheme()`, and `toggleTheme()`.

**Adding custom themes:** Define a new CSS class (e.g., `.theme-ocean`) in `index.css` with your color variables, then add it as an option in the Settings page. No component changes needed — all components read from CSS variables.

### Color Tokens

| Token | Usage |
|-------|-------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--surface` | Elevated surfaces |
| `--card` / `--card-foreground` | Cards |
| `--primary` / `--primary-foreground` | Primary actions |
| `--secondary` | Secondary elements |
| `--muted` / `--muted-foreground` | Muted text/backgrounds |
| `--accent` / `--accent-foreground` | Accent highlights |
| `--success` | Success states |
| `--warning` | Warning states |
| `--destructive` | Error/destructive actions |
| `--border` | Borders |
| `--input` | Input borders |
| `--ring` | Focus rings |
| `--chart-1` through `--chart-5` | Chart colors |

### Typography

- **Font:** Inter (300–700 weights)
- **Mono:** JetBrains Mono
- **Body line height:** 150% | **Headings:** 120%
- **Max weights per view:** 3

### Spacing

8px spacing system with additional tokens (`4.5`, `13`, `18`, `22`) for fine-tuning.

### Elevation

Four shadow levels (`elevation-1` through `elevation-4`) plus a `glow` shadow for primary elements.

### Border Radius

Single `--radius` token (0.625rem) with computed variants (`sm`, `md`, `lg`, `xl`, `2xl`).

---

## Routing

Routes are defined in `src/App.tsx`:

| Route | Page |
|-------|------|
| `/login` | Login |
| `/register` | Register |
| `/forgot-password` | Forgot Password |
| `/reset-password` | Reset Password |
| `/app/dashboard` | Dashboard |
| `/app/notes` | Notes |
| `/app/tasks` | Tasks |
| `/app/calendar` | Calendar |
| `/app/ai-chat` | AI Chat |
| `/app/revision` | Revision Planner |
| `/app/summary` | Daily Summary |
| `/app/analytics` | Analytics |
| `/app/profile` | Profile |
| `/app/settings` | Settings |
| `/500` | Server Error |
| `/unauthorized` | Unauthorized |
| `/network-error` | Network Error |
| `*` | 404 Not Found |

Dashboard routes are protected by `ProtectedRoute` which redirects to `/login` if not authenticated.

**Command Palette:** Press `Ctrl+K` (or `Cmd+K`) anywhere to open the command palette for quick navigation.

---

## State Management

### Global State (React Context)

| Context | Responsibility |
|---------|---------------|
| `ThemeContext` | Dark/light theme |
| `AuthContext` | User session, login/register/logout |
| `NotificationContext` | App notifications, unread count |
| `PreferencesContext` | User settings (notifications, AI, accessibility) |
| `CommandPaletteContext` | Command palette open/close state |

### Local State

Feature-specific state (notes filtering, task board, chat messages, calendar view) is kept local to components using `useState` and `useMemo`.

---

## Backend Integration Guide

The frontend is built to connect to an existing FastAPI backend. All API calls go through the service layer in `src/services/`.

### How to Connect

1. **Set the API base URL** in `.env`:
   ```
   VITE_API_BASE_URL=https://your-api.com/api
   ```

2. **Update service methods** in `src/services/`:
   - Each service file contains placeholder methods with `TODO` comments
   - Replace the placeholder URLs and payloads with your actual FastAPI endpoints
   - The Axios client (`api-client.ts`) already handles:
     - Base URL from environment variable
     - Auth token injection (reads from `localStorage`)
     - Response error normalization
     - Request/response interceptors

3. **Wire authentication**:
   - `src/contexts/auth-context.tsx` currently creates a mock session
   - Replace the `try/catch` fallbacks with real `authService` calls
   - The service layer expects a Bearer token in the `Authorization` header

4. **Service files to update**:
   | File | Endpoints to implement |
   |------|----------------------|
   | `auth.service.ts` | login, register, forgot/reset password, profile |
   | `notes.service.ts` | CRUD, favorite/pin, AI summary, export |
   | `tasks.service.ts` | CRUD, status updates |
   | `index.ts` | calendar, revision, chat (incl. streaming), notifications, analytics, summary |

5. **Streaming AI responses**: `chatService.streamMessage()` is an async generator placeholder. Wire it to your backend's SSE or WebSocket endpoint.

---

## Reusable Components

### Common
- `PageHeader` — Consistent page titles with icon, description, and actions
- `EmptyState` — Illustrated empty states with optional CTA
- `ErrorPage` — Shared template for all error pages
- `CommandPalette` — Ctrl+K navigation (Linear/Raycast style)
- `AuthCard` — Shared auth form container with social buttons

### Dashboard Widgets
- `StatCard` — Metric cards with trend indicators
- `ActivityChart` — Area chart for weekly activity

### UI Primitives (shadcn/ui)
Full set: Button, Card, Input, Label, Dialog, Drawer, Sheet, Tabs, Select, Checkbox, Switch, Slider, Progress, Badge, Avatar, Tooltip, Popover, Dropdown Menu, Scroll Area, Separator, Accordion, Alert, Breadcrumb, Calendar, Collapsible, Context Menu, Form, Hover Card, Menubar, Navigation Menu, Pagination, Radio Group, Table, Toast, Toggle, Toggle Group.

---

## Coding Conventions

- **Imports:** Use `@/` alias for all project imports
- **Types:** Explicit types on all function parameters; no implicit `any`
- **Naming:** PascalCase for components, camelCase for functions/variables
- **Styling:** TailwindCSS utility classes; use `cn()` for conditional classes
- **State:** Global state via Context; feature state local to components
- **API:** All HTTP calls through service layer; never hardcode URLs in components
- **Animations:** Framer Motion for page transitions, micro-interactions, and layout animations
- **Accessibility:** ARIA labels on interactive elements, keyboard navigation support, semantic HTML

---

## Future-Ready Architecture

The application is designed for extensibility without major redesigns:

- **Custom themes:** Add CSS variables in `index.css`, add option in Settings
- **Dashboard widgets:** Each widget is an independent component — add new ones in `src/components/dashboard/`
- **AI features:** Service layer has placeholders for streaming, summaries, and recommendations
- **Collaboration:** Navigation and routing support future workspace switching, shared notes/tasks, and role-based access
- **File uploads:** Attachment UI placeholders in Notes support PDFs, docs, images, audio
- **Mobile-first:** Responsive design works on mobile, tablet, and desktop; adaptable to React Native/Flutter

---

## License

This is a private project. All rights reserved.
