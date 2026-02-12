# AI Development Skills

This directory contains specialized skill guides for AI coding assistants working on Solo Guardian.

## Available Skills

Each skill provides:
- **When to use it**: Specific scenarios where the skill applies
- **Code templates**: Ready-to-use code patterns
- **Best practices**: Project-specific guidelines
- **Common commands**: Quick reference for development tasks

### 🔧 [backend.skill.md](./backend.skill.md)
**NestJS Backend Development**

Use when working on:
- API endpoints and controllers
- Business logic and services
- Database operations with Prisma
- Authentication and authorization
- Queue jobs and notifications
- Backend unit tests

Key patterns:
- Controller → Service → Repository architecture
- DTO validation with class-validator
- JWT authentication with refresh tokens
- Error handling with NestJS exceptions

### 🎨 [frontend.skill.md](./frontend.skill.md)
**React Frontend Development**

Use when working on:
- React components and pages (User Web / Admin Web)
- State management (Zustand, TanStack Query)
- API integration via `@solo-guardian/api-client`
- UI components (shadcn/ui, Ant Design)
- Internationalization (en/zh/ja)

Key patterns:
- Functional components with hooks
- Custom hooks for business logic
- TanStack Query for server state
- Form validation with react-hook-form + zod

### 📱 [mobile.skill.md](./mobile.skill.md)
**Flutter Mobile Development**

Use when working on:
- Flutter mobile app (Android/iOS)
- State management with Riverpod
- API integration with Dio
- Offline-first architecture
- Code generation (Freezed, Retrofit)

Key patterns:
- Clean Architecture (presentation/domain/data)
- Riverpod StateNotifier for state
- Freezed for immutable data classes
- Secure token storage with flutter_secure_storage

### ✅ [testing.skill.md](./testing.skill.md)
**Testing (Backend, Frontend, Mobile, E2E)**

Use when working on:
- Backend unit tests (Jest)
- E2E tests (Playwright)
- Mobile tests (Flutter Test)
- Integration tests

Key patterns:
- Test pyramid (many unit, some integration, few E2E)
- AAA pattern (Arrange-Act-Assert)
- Mock external dependencies
- Page Object Model for E2E

### 🚀 [deployment.skill.md](./deployment.skill.md)
**Deployment & DevOps**

Use when working on:
- Backend deployment (Railway, Vercel)
- Frontend deployment (Vercel)
- Mobile deployment (Google Play, App Store)
- CI/CD pipelines
- Database migrations
- Production troubleshooting

Key patterns:
- Environment variable management
- Zero-downtime deployments
- Database migration strategies
- Health checks and monitoring

## How to Use These Skills

### For GitHub Copilot

Skills are automatically available when you work in this repository. GitHub Copilot will reference them based on:
1. The file you're editing
2. Your current task
3. Context from your code

### For Claude Code

Reference skills explicitly in your prompts:
```
Use the backend skill to create a new API endpoint for user preferences.
```

### For Other AI Tools

Read the relevant skill file before starting work:
```bash
# Backend work
cat .github/skills/backend.skill.md

# Mobile work
cat .github/skills/mobile.skill.md
```

## Skill Organization

Each skill follows this structure:

1. **When to Use This Skill** - Scenarios and use cases
2. **Technology Stack** - Technologies covered
3. **Architecture Pattern** - High-level design
4. **Code Templates** - Copy-paste starting points
5. **Common Commands** - CLI commands for development
6. **Best Practices** - Project-specific guidelines
7. **Related Files** - Where to find more information

## Contributing

When updating skills:

1. **Keep them concise** - Focus on project-specific patterns
2. **Use real examples** - From this codebase when possible
3. **Include commands** - Make them actionable
4. **Cross-reference** - Link to AGENTS.md and other docs

## Related Documentation

- **[AGENTS.md](../../AGENTS.md)** - Complete repository guide for AI agents
- **[CLAUDE.md](../../CLAUDE.md)** - Claude Code specific instructions
- **[.github/copilot-instructions.md](../copilot-instructions.md)** - GitHub Copilot overview
- **[.claude/DESIGN_STATE.yaml](../../.claude/DESIGN_STATE.yaml)** - Current project status

## Quick Reference

| Working on... | Use this skill |
|---------------|----------------|
| NestJS API | backend.skill.md |
| React web app | frontend.skill.md |
| Flutter mobile | mobile.skill.md |
| Tests | testing.skill.md |
| Deployment | deployment.skill.md |

---

**Need help?** Start with `AGENTS.md` for the complete picture, then dive into specific skills as needed.
