# AGENTS.md

This file guides agentic coding tools working in this repository.
Follow repo instructions in `CLAUDE.md` and `.claude/`.

## Repository overview

- Monorepo managed with pnpm workspaces.
- Apps:
  - `apps/backend` NestJS API + Prisma + PostgreSQL + Redis (complete).
  - `apps/user-web` React 18 + Vite + Tailwind + shadcn/ui (complete).
  - `apps/admin-web` React + Vite + Ant Design (complete).
  - `apps/mobile/solo_guardian` Flutter + Riverpod (complete).
- Packages:
  - `packages/types` shared TypeScript types and error codes.
  - `packages/api-client` Axios + TanStack Query hooks.
- End-to-end tests in `e2e` (Playwright).

## Project status

Current version: **3.11.0** (as of 2026-01-19)
Milestone: **Flutter Mobile App Complete**

All major features implemented:
- Authentication (email/password, OAuth Google/Apple, flexible login)
- Check-in system with reminders and alerts
- Emergency contacts with linked users
- Notifications (email + SMS via Twilio)
- Admin dashboard with template management
- Flutter mobile app (Android/iOS)
- 407 backend unit tests

## Required reading for agents

- `CLAUDE.md` for architecture, constraints, and commands.
- `.claude/DESIGN_STATE.yaml` for current iteration status and module states.
- `.claude/prompts/A_SESSION.md`, `B_SESSION.md`, `C_SESSION.md` for the 3-session workflow.

## Build and dev commands

Run from repo root unless noted otherwise.

### Install

```bash
pnpm install
```

### Backend (NestJS)

```bash
cd apps/backend && pnpm run start:dev      # Dev server on :3000
cd apps/backend && pnpm run build          # Production build
cd apps/backend && pnpm run prisma:generate # Generate Prisma client
cd apps/backend && pnpm run prisma:migrate  # Run migrations
cd apps/backend && pnpm run prisma:studio   # Open Prisma Studio
```

### User web (Vite)

```bash
cd apps/user-web && pnpm run dev   # Dev server on :5173
cd apps/user-web && pnpm run build # Production build
cd apps/user-web && pnpm run lint  # ESLint
```

### Admin web (Vite)

```bash
cd apps/admin-web && pnpm run dev   # Dev server on :5174
cd apps/admin-web && pnpm run build # Production build
cd apps/admin-web && pnpm run lint  # ESLint
```

### Mobile app (Flutter)

```bash
cd apps/mobile/solo_guardian && flutter pub get        # Install dependencies
cd apps/mobile/solo_guardian && flutter run            # Run on connected device
cd apps/mobile/solo_guardian && flutter build apk      # Build Android APK
cd apps/mobile/solo_guardian && flutter build ios      # Build iOS (macOS only)
cd apps/mobile/solo_guardian && dart run build_runner build # Generate code
```

### Shared packages

```bash
cd packages/types && pnpm run build      # Build types
cd packages/types && pnpm run typecheck  # Type check
cd packages/api-client && pnpm run typecheck # Type check API client
```

## Test commands

### Backend unit tests (Jest)

```bash
cd apps/backend && pnpm run test                              # All tests
cd apps/backend && pnpm run test:watch                        # Watch mode
cd apps/backend && pnpm run test:cov                          # Coverage report
cd apps/backend && pnpm run test:debug                        # Debug mode
cd apps/backend && pnpm run test -- auth.service.spec.ts      # Single file
cd apps/backend && pnpm run test -- --testNamePattern "register" # Pattern match
```

### End-to-end tests (Playwright)

```bash
cd e2e && pnpm run test              # All (Chromium)
cd e2e && pnpm run test:all-browsers # All browsers
cd e2e && pnpm run test:ui           # UI runner
cd e2e && pnpm run test:headed       # Headed mode
cd e2e && pnpm run test:debug        # Debug mode
cd e2e && pnpm run test -- auth.spec.ts # Single file
cd e2e && pnpm run test:report       # View reports
```

### Mobile tests (Flutter)

```bash
cd apps/mobile/solo_guardian && flutter test           # Unit tests
cd apps/mobile/solo_guardian && flutter test --coverage # With coverage
```

## Lint and formatting

- Lint is defined for `apps/user-web` and `apps/admin-web`.
- Flutter uses `dart analyze` and `dart format`.
- No repo-wide formatter is configured; preserve existing file formatting.
- Match existing indentation and import ordering in the touched file.

## Code style and architecture rules

### TypeScript baseline

- No `any` type; prefer explicit interfaces or generics.
- Every function must declare a return type.
- Keep a single function under 50 lines.
- Keep a single file under 300 lines.
- Prefer clear naming over inline comments; only add comments for non-obvious logic.

### Dart/Flutter baseline

- Use `final` for immutable variables.
- Prefer `const` constructors where possible.
- Every function must declare a return type.
- Keep a single function under 50 lines.
- Keep a single file under 300 lines.
- Use Freezed for immutable data classes.

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

### Mobile architecture (Flutter)

- Clean Architecture with 3 layers: presentation, domain, data.
- State management: Riverpod (StateNotifier pattern).
- Networking: Dio with interceptors for auth.
- Storage: flutter_secure_storage for tokens, shared_preferences for settings.
- i18n via Flutter's built-in localization (en/zh/ja).
- Code generation: Freezed for models, Retrofit for API clients.

```
lib/
├── core/           # Constants, errors, network, storage, utils
├── data/           # Models, datasources, repository implementations
├── domain/         # Repository interfaces
├── l10n/           # Localization
├── presentation/   # Screens, widgets, providers
└── theme/          # App themes
```

### Imports and module usage

- Import order: external libs, workspace packages, internal modules, relative modules.
- Use workspace package aliases like `@solo-guardian/types` and `@solo-guardian/api-client`.
- Avoid deep relative paths when package exports exist.

### Naming conventions

- Use `camelCase` for variables and functions.
- Use `PascalCase` for classes, components, and types.
- Use `UPPER_SNAKE_CASE` for constants.
- File names follow existing conventions in each app.
- Flutter: use `snake_case` for file names.

### Error handling

- Backend services should throw NestJS HTTP exceptions with meaningful messages.
- Controllers should not swallow errors; let NestJS exception filters respond.
- Frontend hooks should surface errors (and avoid silent failures).
- Handle async errors with `try/catch/finally` when state updates are involved.
- Flutter: use AppException for typed errors, ErrorUtils for localized messages.

## Key modules reference

| Module | Backend | User Web | Admin Web | Mobile |
|--------|---------|----------|-----------|--------|
| Auth | `auth/` | `pages/auth/` | `pages/LoginPage` | `screens/auth/` |
| Check-in | `check-in/` | `pages/Dashboard` | - | `screens/dashboard/` |
| Contacts | `emergency-contacts/` | `pages/Contacts` | - | `screens/contacts/` |
| Alerts | `alerts/` | - | `pages/AlertsPage` | - |
| Settings | `check-in/settings` | `pages/Settings` | `pages/SettingsPage` | `screens/settings/` |
| Templates | `templates/` | - | `pages/TemplatesPage` | - |
| Caregiver | `caregiver/` | `components/Caregiver` | - | `screens/caregiver/` |

## 3-session workflow notes

- Session A: design and skeletons with TODOs.
- Session B: fill TODOs, add headers, log sensitive ops, write implementation report.
- Session C: review against `DESIGN_STATE.yaml` and acceptance criteria.
- Do not modify `DESIGN_STATE.yaml` unless you are explicitly acting as Session A.

## Environment and secrets

- Backend requires `.env` (see `apps/backend/.env.example`).
- Mobile requires API base URL in `lib/core/constants/api_constants.dart`.
- Do not commit secrets or `.env` files.

Required backend env vars:
```
DATABASE_URL          # PostgreSQL connection string
REDIS_URL             # Redis connection string
JWT_ACCESS_SECRET     # Min 32 chars
JWT_REFRESH_SECRET    # Min 32 chars
SMTP_HOST/PORT/USER/PASS  # Email (optional)
TWILIO_*              # SMS (optional)
GOOGLE_CLIENT_ID      # OAuth (optional)
APPLE_*               # Apple Sign In (optional)
ALIYUN_OSS_*          # File storage (optional)
```

## Cursor or Copilot rules

- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No GitHub Copilot rules found in `.github/copilot-instructions.md`.

## Notes for agents

- Prefer minimal, targeted changes.
- Do not rewrite unrelated files.
- Do not change README content unless instructions require it.
- Follow existing commit message style if asked to commit.
- Check `DESIGN_STATE.yaml` for module status before making changes.
- The project has 407 unit tests - run tests after backend changes.
- Mobile app uses code generation - run `build_runner` after model changes.

## Commit message format

```
type(scope): description

[optional body]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
Scopes: `backend`, `user-web`, `admin-web`, `mobile`, `api-client`, `types`, `e2e`
