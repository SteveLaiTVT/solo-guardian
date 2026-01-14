# Solo Guardian - Project Instructions

## Project Overview

Solo Guardian (独居守护) is a safety check-in app for people living alone.
If users don't check in daily, their emergency contacts get notified.

## 3-Session Workflow

This project uses 3 Claude Code windows working together:

| Session | Role | Prompt File |
|---------|------|-------------|
| **A** | Architect - Design & decisions | `.claude/prompts/A_SESSION.md` |
| **B** | Implementer - Write code | `.claude/prompts/B_SESSION.md` |
| **C** | Reviewer - Code review | `.claude/prompts/C_SESSION.md` |

## Starting a Session

When you start Claude Code, tell me which session you are:

```
"I am A Session" → I will design and create skeletons with TODOs
"I am B Session" → I will implement code by filling TODOs
"I am C Session" → I will review code against constraints
```

## Key Files to Read

1. **DESIGN_STATE.yaml** - Single source of truth
   - Current tech stack
   - Code constraints (must follow!)
   - Current iteration tasks

2. **Handoffs directory** - Communication between sessions
   - `HO-*.yaml` - Task handoffs (A → B)
   - `IR-*.yaml` - Implementation reports (B → C)
   - `RR-*.yaml` - Review reports (C → A)

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

Frontend:
  - Functional components + Hooks
  - Business logic in custom hooks

Mobile:
  - MVVM pattern
  - ViewModel + Compose separation
```

## Directory Structure

```
apps/
  backend/          # NestJS API
  admin-web/        # Admin dashboard (React)
  user-web/         # User web app (React)
  mobile/android/   # Android app (Kotlin)

packages/
  types/            # Shared TypeScript types
  api-client/       # Shared API client

.claude/
  DESIGN_STATE.yaml # Source of truth
  handoffs/         # Task handoffs between sessions
  prompts/          # Session-specific prompts
  templates/        # Document templates
```

## Current Iteration

Check `.claude/DESIGN_STATE.yaml` → `current_iteration` for active tasks.

## Quick Commands

```bash
# A Session: Start design
"Design the auth module for iter-001"

# B Session: Start implementation  
"Read .claude/handoffs/iter-001/HO-001-auth.yaml and implement"

# C Session: Start review
"Review the auth module implementation"
```