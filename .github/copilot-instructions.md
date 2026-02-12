# GitHub Copilot Instructions for Solo Guardian

This file provides guidance for GitHub Copilot when working in this repository.

## 📋 Project Context

**Solo Guardian (独居守护)** is a safety check-in app for people living alone. If users don't check in daily, their emergency contacts get notified via email, SMS, and push notifications.

**Current Status**: v3.11.0 - Flutter Mobile App Complete

## 🏗️ Repository Structure

This is a **pnpm monorepo** with:
- `apps/backend` - NestJS + Prisma + PostgreSQL + Redis
- `apps/user-web` - React 18 + Vite + Tailwind + shadcn/ui
- `apps/admin-web` - React + Vite + Ant Design
- `apps/mobile/solo_guardian` - Flutter + Riverpod
- `packages/types` - Shared TypeScript types
- `packages/api-client` - TanStack Query hooks

## 🎯 Required Reading

Before making changes, **ALWAYS** read:
1. `AGENTS.md` - Complete architecture, commands, and coding rules
2. `.claude/DESIGN_STATE.yaml` - Current iteration status
3. `CLAUDE.md` - Development commands and constraints

## 💡 Skills Available

Use the following skills for specific tasks:

- **Backend Development**: `.github/skills/backend.skill.md`
- **Frontend Development**: `.github/skills/frontend.skill.md`
- **Mobile Development**: `.github/skills/mobile.skill.md`
- **Testing**: `.github/skills/testing.skill.md`
- **Deployment**: `.github/skills/deployment.skill.md`

## 🔧 Quick Commands

```bash
# Install
pnpm install

# Development
cd apps/backend && pnpm run start:dev     # Backend :3000
cd apps/user-web && pnpm run dev          # User Web :5173
cd apps/admin-web && pnpm run dev         # Admin Web :5174

# Testing
cd apps/backend && pnpm run test          # Backend unit tests
cd e2e && pnpm run test                   # E2E tests

# Mobile
cd apps/mobile/solo_guardian && flutter run
```

## ✅ Code Rules (MUST FOLLOW)

### TypeScript
- ❌ No `any` type
- ✅ Every function has return type
- ✅ Single function < 50 lines
- ✅ Single file < 300 lines

### Backend (NestJS)
- Controller → Service → Repository → Prisma
- Controllers: validation only
- Services: business logic
- Repositories: database operations
- API format: `{ success: true, data: {...} }`

### Frontend (React)
- Functional components + hooks only
- Use `@solo-guardian/api-client` for API calls
- Zustand for auth, TanStack Query for server state
- i18n via `react-i18next` (en/zh/ja)

### Mobile (Flutter)
- Clean Architecture (presentation/domain/data)
- Riverpod for state management
- Freezed for data classes
- `snake_case` for file names

## 🚫 What NOT to Do

- ❌ Don't use `any` type
- ❌ Don't add inline comments unless needed
- ❌ Don't modify `.claude/DESIGN_STATE.yaml` (Session A only)
- ❌ Don't commit secrets or `.env` files
- ❌ Don't rewrite unrelated files
- ❌ Don't skip tests after backend changes

## 🔐 Security

- All sensitive operations must be logged
- Use DTO validation (class-validator)
- Error codes in `packages/types/src/errors.ts`
- Environment variables in `.env.example`

## 📝 Commit Format

```
type(scope): description

[optional body]

Co-Authored-By: GitHub Copilot <noreply@github.com>
```

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
**Scopes**: `backend`, `user-web`, `admin-web`, `mobile`, `api-client`, `types`, `e2e`

## 🤖 AI Development Workflow

This project uses a **3-session workflow**:

1. **Session A** (Architect): Design & decisions → skeleton code with TODOs
2. **Session B** (Implementer): Fill TODOs → write implementation
3. **Session C** (Reviewer): Review code → ensure quality

See `.claude/prompts/` for detailed instructions for each session.

## 🎓 Learning Resources

- NestJS: https://docs.nestjs.com
- Prisma: https://www.prisma.io/docs
- React Query: https://tanstack.com/query
- Flutter: https://flutter.dev/docs
- Riverpod: https://riverpod.dev

## 📊 Test Coverage

- 407 backend unit tests (Jest)
- E2E tests with Playwright
- Run tests before committing backend changes

## 🚀 Deployment

- Backend: Railway / Vercel
- Frontend: Vercel
- Mobile: Google Play / App Store

See `DEPLOYMENT.md` for detailed deployment instructions.
