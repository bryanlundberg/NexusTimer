# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is NexusTimer

NexusTimer is a full-stack speedcubing timer and analytics PWA built with Next.js 16, React 19, and TypeScript. It features real-time 3D cube visualization, statistical analysis, community leaderboards, multiplayer modes, and supports 10 languages.

## Commands

```bash
pnpm dev              # Dev server with Turbopack (localhost:3000)
pnpm build            # Production build (uses webpack, not turbo)
pnpm lint             # ESLint
pnpm test             # Jest unit tests
pnpm test -- --testPathPattern="path/to/test"  # Run single test file
pnpm test:watch       # Jest watch mode
pnpm test:e2e         # Playwright E2E tests (chromium only, needs dev server)
```

## Architecture

The project follows **Feature-Sliced Design (FSD)** under `src/`:

- **`app/`** — Next.js App Router. Route groups: `(with-sidebar)` for core app pages, `(legal)` for legal pages. API routes under `api/v1/`.
- **`entities/`** — Domain models and types (user, solve, cube, statistics, achievement, settings, backup).
- **`features/`** — Feature modules with `model/` (logic, hooks, types) and `ui/` (components) subdirectories. ~30+ features including timer, authentication, leaderboards, deep-statistics, manage-solves.
- **`widgets/`** — Composite UI components that combine multiple features (sidebar, navigation-header, stats-dashboard, cubes-dashboard).
- **`shared/`** — Cross-cutting concerns:
  - `config/` — i18n, auth, firebase, mongodb connection
  - `model/` — Zustand stores (timerStore, settingsStore, overlayStore)
  - `lib/` — Utility functions
  - `hooks/` — Custom React hooks
  - `ui/` — Shared UI components
  - `types/`, `const/`, `data/` — Types, constants, static data
- **`components/`** — Root-level components: `ui/` has Shadcn/ui primitives, `providers/` has context providers.

## Key Technology Decisions

- **State**: Zustand stores for client state, SWR for server data fetching, IndexedDB (via `idb`) for offline-first local persistence
- **Database**: MongoDB via Mongoose for user data, solves, backups. Firebase Realtime Database + Firestore for multiplayer features.
- **Auth**: NextAuth v5 (beta) with Google and Discord OAuth providers. Config at `src/shared/config/auth/auth.ts`.
- **i18n**: next-intl with cookie-based locale selection. 10 locales in `messages/{locale}.json`. English is the default fallback; messages are deep-merged.
- **UI**: Shadcn/ui (Radix-based) + Tailwind CSS v4. 3D rendering with Three.js/React Three Fiber. Charts with Recharts.
- **PWA**: Serwist service worker (`src/app/sw.ts`)
- **Multiplayer**: PeerJS for P2P connections, Firebase for room management

## Code Style

- Prettier: no semicolons, single quotes, trailing comma "none", 120 char width, LF line endings
- Path alias: `@/*` maps to `src/*`
- Husky + lint-staged run on pre-commit

## Testing

- **Unit tests**: Jest with jsdom environment, `*.test.ts` files. Files matching `*.spec.ts` are excluded from Jest (those are Playwright).
- **E2E tests**: Playwright in `e2e/` directory, Chromium only, 120s timeout. Auto-starts dev server if not running.
