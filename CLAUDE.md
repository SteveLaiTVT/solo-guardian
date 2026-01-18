# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Solo Guardian (独居守护) is a safety check-in app for people living alone. If users don't check in daily, their emergency contacts get notified via email or SMS.

## Development Commands

```bash
# Install dependencies (from root)
pnpm install

# Start development servers
cd apps/backend && pnpm run start:dev    # Backend on :3000
cd apps/user-web && pnpm run dev         # Frontend on :5173

# Database
cd apps/backend && pnpm run prisma:generate  # Generate Prisma client
cd apps/backend && pnpm run prisma:migrate   # Run migrations
cd apps/backend && pnpm run prisma:studio    # Open Prisma Studio

# Build
cd apps/backend && pnpm run build
cd apps/user-web && pnpm run build
cd packages/types && pnpm run build

# Lint
cd apps/user-web && pnpm run lint

# E2E Tests (requires backend + frontend running)
cd e2e && pnpm run test                  # Run all E2E tests
cd e2e && pnpm run test:ui               # Open Playwright UI
cd e2e && pnpm run test:headed           # Run in headed mode
cd e2e && pnpm run test:auth             # Run auth tests only
cd e2e && pnpm run test:checkin          # Run check-in tests only
```

## Architecture

### Monorepo Structure (pnpm workspaces)
- **apps/backend**: NestJS API with Prisma ORM + PostgreSQL + Redis (BullMQ)
- **apps/user-web**: React 18 + Vite + shadcn/ui + Tailwind + i18n
- **apps/admin-web**: Admin dashboard (React + Ant Design) - planned
- **apps/mobile/android**: Kotlin + Jetpack Compose - planned
- **packages/types**: Shared TypeScript types and error codes
- **packages/api-client**: Axios + TanStack Query hooks for API calls
- **e2e**: Playwright E2E tests

### Backend Layered Architecture
```
Controller → Service → Repository → Prisma
     ↓           ↓
  Validates   Business Logic   Database Operations
```
- Controllers: Parameter validation only, delegate to services
- Services: Business logic, no direct DB access
- Repositories: All database operations via Prisma

### Key Modules
- **auth**: JWT auth with access/refresh token rotation, OAuth (Google/Apple)
- **check-in**: Daily safety check-in with settings and history
- **emergency-contacts**: Up to 5 contacts per user, email/phone verification
- **alerts**: Missed check-in detection, triggers notifications
- **notifications**: Bull queue for email/SMS delivery to contacts
- **sms**: Twilio integration for SMS notifications

### Frontend Patterns
- Zustand for auth state management
- TanStack Query for server state via @solo-guardian/api-client
- react-i18next for internationalization (en/zh/ja)
- All API calls through packages/api-client hooks

## Environment Setup

Backend requires `.env` file (see `apps/backend/.env.example`):
```
DATABASE_URL="postgresql://user:password@localhost:5432/solo_guardian"
REDIS_URL="redis://localhost:6379"
JWT_ACCESS_SECRET="min-32-char-secret"
JWT_REFRESH_SECRET="min-32-char-secret"
SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS  # For email
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER  # For SMS
```

## 3-Session Workflow

This project uses 3 Claude Code sessions:

| Session | Role | Prompt File |
|---------|------|-------------|
| **A** | Architect - Design & decisions | `.claude/prompts/A_SESSION.md` |
| **B** | Implementer - Write code | `.claude/prompts/B_SESSION.md` |
| **C** | Reviewer - Code review | `.claude/prompts/C_SESSION.md` |

**Key Files:**
- `.claude/DESIGN_STATE.yaml` - Single source of truth for current iteration tasks and tech decisions
- `.claude/handoffs/HO-*.yaml` - Task handoffs (A → B)
- `.claude/handoffs/IR-*.yaml` - Implementation reports (B → C)
- `.claude/handoffs/RR-*.yaml` - Review reports (C → A)

## Code Constraints (MUST FOLLOW)

```yaml
General:
  - No `any` type in TypeScript
  - Single function < 50 lines
  - Single file < 300 lines
  - All functions have return types

Backend:
  - Controller only validates and calls Service
  - Service has business logic, no direct DB access
  - Repository handles database operations
  - Sensitive operations must be logged

Frontend:
  - Functional components + Hooks
  - Business logic in custom hooks
  - All API calls through api-client package
```

## API Conventions

- RESTful with URL prefix `/api/v1`
- Response format: `{ success: true, data: {...}, meta?: {...} }` or `{ success: false, error: {...} }`
- Auth: Bearer token in Authorization header
- Error codes defined in `packages/types/src/errors.ts`