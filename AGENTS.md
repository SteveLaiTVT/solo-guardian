# AGENTS.md

This file guides agentic coding tools working in this repository.
Follow repo instructions in `CLAUDE.md` and `.claude/`.

## Repository overview
- Monorepo managed with pnpm workspaces.
- Apps:
  - `apps/backend` NestJS API + Prisma + PostgreSQL + Redis.
  - `apps/user-web` React 18/19 + Vite + Tailwind + shadcn/ui.
  - `apps/admin-web` React + Ant Design (planned/partial).
  - `apps/mobile/android` Kotlin + Compose (planned).
- Packages:
  - `packages/types` shared TypeScript types and error codes.
  - `packages/api-client` Axios + TanStack Query hooks.
- End-to-end tests in `e2e` (Playwright).

## Required reading for agents
- `CLAUDE.md` for architecture, constraints, and commands.
- `.claude/DESIGN_STATE.yaml` for current iteration constraints.
- `.claude/prompts/A_SESSION.md`, `B_SESSION.md`, `C_SESSION.md` for the 3-session workflow.

## Build and dev commands
Run from repo root unless noted otherwise.

### Install
- `pnpm install`

### Backend (NestJS)
- Dev server: `cd apps/backend && pnpm run start:dev`
- Build: `cd apps/backend && pnpm run build`
- Prisma client: `cd apps/backend && pnpm run prisma:generate`
- Prisma migrate: `cd apps/backend && pnpm run prisma:migrate`
- Prisma Studio: `cd apps/backend && pnpm run prisma:studio`

### User web (Vite)
- Dev server: `cd apps/user-web && pnpm run dev`
- Build: `cd apps/user-web && pnpm run build`
- Lint: `cd apps/user-web && pnpm run lint`

### Admin web (Vite)
- Dev server: `cd apps/admin-web && pnpm run dev`
- Build: `cd apps/admin-web && pnpm run build`
- Lint: `cd apps/admin-web && pnpm run lint`

### Shared packages
- Types build: `cd packages/types && pnpm run build`
- Types typecheck: `cd packages/types && pnpm run typecheck`
- API client typecheck: `cd packages/api-client && pnpm run typecheck`

## Test commands

### Backend unit tests (Jest)
- All tests: `cd apps/backend && pnpm run test`
- Watch: `cd apps/backend && pnpm run test:watch`
- Coverage: `cd apps/backend && pnpm run test:cov`
- Debug: `cd apps/backend && pnpm run test:debug`
- Single test file: `cd apps/backend && pnpm run test -- auth.service.spec.ts`
- Single test pattern: `cd apps/backend && pnpm run test -- --testNamePattern "register"`

### End-to-end tests (Playwright)
- All (Chromium): `cd e2e && pnpm run test`
- All browsers: `cd e2e && pnpm run test:all-browsers`
- UI runner: `cd e2e && pnpm run test:ui`
- Headed: `cd e2e && pnpm run test:headed`
- Debug: `cd e2e && pnpm run test:debug`
- Single file: `cd e2e && pnpm run test -- auth.spec.ts`
- Reports: `cd e2e && pnpm run test:report`

## Lint and formatting
- Lint is defined for `apps/user-web` and `apps/admin-web`.
- No repo-wide formatter is configured; preserve existing file formatting.
- Match existing indentation and import ordering in the touched file.

## Code style and architecture rules

### TypeScript baseline
- No `any` type; prefer explicit interfaces or generics.
- Every function must declare a return type.
- Keep a single function under 50 lines.
- Keep a single file under 300 lines.
- Prefer clear naming over inline comments; only add comments for non-obvious logic.

### Backend architecture (NestJS)
- Controller only validates and calls Service.
- Service contains business logic; no direct Prisma access.
- Repository handles database operations via Prisma.
- Sensitive operations must be logged.
- Use DTO validation (class-validator/class-transformer).
- API base path: `/api/v1`.
- Response format:
  - Success: `{ success: true, data: {...}, meta?: {...} }`
  - Error: `{ success: false, error: {...} }`
- Error codes live in `packages/types/src/errors.ts`.

### Frontend architecture (React)
- Functional components and hooks only.
- Business logic goes into custom hooks.
- All API calls must use `packages/api-client` hooks.
- State: Zustand for auth/global state; TanStack Query for server state.
- i18n via `react-i18next` (en/zh/ja).

### Imports and module usage
- Import order: external libs, workspace packages, internal modules, relative modules.
- Use workspace package aliases like `@solo-guardian/types` and `@solo-guardian/api-client`.
- Avoid deep relative paths when package exports exist.

### Naming conventions
- Use `camelCase` for variables and functions.
- Use `PascalCase` for classes, components, and types.
- Use `UPPER_SNAKE_CASE` for constants.
- File names follow existing conventions in each app.

### Error handling
- Backend services should throw NestJS HTTP exceptions with meaningful messages.
- Controllers should not swallow errors; let NestJS exception filters respond.
- Frontend hooks should surface errors (and avoid silent failures).
- Handle async errors with `try/catch/finally` when state updates are involved.

## 3-session workflow notes
- Session A: design and skeletons with TODOs.
- Session B: fill TODOs, add headers, log sensitive ops, write implementation report.
- Session C: review against `DESIGN_STATE.yaml` and acceptance criteria.
- Do not modify `DESIGN_STATE.yaml` unless you are explicitly acting as Session A.

## Environment and secrets
- Backend requires `.env` (see `apps/backend/.env.example`).
- Do not commit secrets or `.env` files.

## Cursor or Copilot rules
- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No GitHub Copilot rules found in `.github/copilot-instructions.md`.

## Notes for agents
- Prefer minimal, targeted changes.
- Do not rewrite unrelated files.
- Do not change README content unless instructions require it.
- Follow existing commit message style if asked to commit.
