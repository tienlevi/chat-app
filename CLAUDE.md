# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository structure

This is **not** a unified pnpm workspace — `backend/` and `frontend/` are two independent projects, each with its own `package.json`, `pnpm-lock.yaml`, and `node_modules`. There is no root `package.json`. Always `cd` into the relevant package before running commands, and never assume a command run at the repo root affects both.

- `backend/` — NestJS API (TypeScript, MongoDB via Mongoose)
- `frontend/` — React 19 + Vite SPA (TypeScript)

## Backend (`backend/`)

### Commands
- `pnpm install` — install dependencies
- `pnpm dev` — start with hot reload (`nest start --watch`)
- `pnpm start` — start without watch
- `pnpm start:debug` — start with `--debug --watch`
- `pnpm build` — compile to `dist/` (`nest build`)
- `pnpm start:prod` — run compiled output (`node dist/main`)
- `pnpm lint` — ESLint with `--fix` over `src`, `apps`, `libs`, `test`
- `pnpm format` — Prettier over `src/**/*.ts` and `test/**/*.ts`
- `pnpm test` — Jest unit tests (config lives inline in `package.json`, `rootDir: src`, matches `*.spec.ts`)
- `pnpm test:watch` / `pnpm test:cov` — watch mode / coverage
- `pnpm test:e2e` — Jest e2e tests via `test/jest-e2e.json`
- Run a single test file: `pnpm test -- app.controller.spec.ts` (or `pnpm test -- -t "test name"` to filter by name)

### Architecture
Currently a minimal, unmodified NestJS starter:
- `src/main.ts` — bootstraps via `NestFactory.create(AppModule)`, listens on `process.env.PORT ?? 3000`
- `src/app.module.ts` — root module; registers `ConfigModule.forRoot({ isGlobal: true })` and `MongooseModule.forRoot(process.env.MONGODB_URI)`
- `src/app.controller.ts` / `src/app.service.ts` — single `GET /` route returning a hello-world string
- Config comes from a `.env` file at `backend/.env` (not committed) — currently just `MONGODB_URI` pointing at a MongoDB Atlas cluster
- No feature modules, controllers, schemas, auth, or websocket gateways exist yet despite this being a "chat app" — that functionality has not been built.

## Frontend (`frontend/`)

### Commands
- `pnpm install` — install dependencies (**pnpm only** — never npm, yarn, or bun)
- `pnpm dev` — start Vite dev server
- `pnpm build` — typecheck (`tsc -b`) then `vite build`
- `pnpm preview` — preview the production build
- `pnpm lint` — ESLint
- `pnpm format` / `pnpm format:check` — Prettier write/check over `src/**/*.{ts,tsx,js,jsx,json,css,scss}`
- `pnpm test` — Vitest in watch mode
- `pnpm test:coverage` — Vitest run once with v8 coverage
- `pnpm test:ui` — Vitest UI
- Run a single test: `pnpm vitest run src/path/to/file.test.ts`, or filter by name: `pnpm vitest -t "test name"`
- Vitest globals are enabled — no need to import `describe`/`it`/`expect`. Setup file expected at `src/test/setup.ts` (create with `@testing-library/jest-dom` if missing).
- Don't run `pnpm build` or `pnpm dev` unless asked.

### Architecture
- **Entry**: `src/main.tsx` → `src/App.tsx`, which wraps `BrowserRouter` in `QueryProvider` (TanStack Query, `src/provider/queryProvider.tsx`) and renders routes.
- **Routing**: routes are declared as plain data in `src/routes/routes.tsx` — an array of `{ href, id, name, element }` objects (typed by `Routes` in `src/interfaces/types.ts`) — then mapped into `<Route>` elements in `App.tsx`. Unknown paths redirect to `/`. Add new pages by adding an entry here, not by editing `App.tsx` directly.
- **State**: server state via TanStack Query; client state via Zustand + Immer (see `CounterState`/`CounterActions`/`CounterStore` pattern in `src/interfaces/types.ts` for the state/actions-split convention).
- **UI components**: ShadCN (`new-york` style, neutral base color, lucide icons) under `src/components/ui/`, configured via `components.json`. Forms use `react-hook-form` + `zod` + `@hookform/resolvers`, composed with the ShadCN `Form`/`FormField`/`FormItem` primitives in `src/components/ui/form.tsx`.
- **Styling**: Tailwind CSS v4 (CSS-first config via `@theme` in `src/assets/css/index.css`, imported with `@import 'tailwindcss'`, not the old `@tailwind` directives or `tailwind.config.js`). Use utility classes directly; never reference `var(--color-name)` in JSX. Merge conditional classes with the `cn()` helper (`src/lib/utils.ts`, clsx + tailwind-merge). Note the v4 shadow rename: `shadow-sm` → `shadow-xs`, `shadow` → `shadow-sm`.
- **Path alias**: `@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`) — always use it instead of relative `../../` imports across directories.
- **Env vars**: prefixed `VITE_`, read via `import.meta.env.VITE_*`, stored in `frontend/.env` (not committed).

### Code style (frontend)
- TypeScript strict mode; no `any`; prefer `type` over `interface`; avoid `as` assertions unless necessary.
- Prefix unused params/vars with `_` to satisfy lint.
- Default export for page components (`export default function Home()`); named exports for utilities/providers/hooks.
- Functional components only.
- File naming: `camelCase.ts` for utilities/providers, `PascalCase.tsx` for components.
- Don't add comments unless asked.
