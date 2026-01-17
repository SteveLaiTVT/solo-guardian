# Claude Code Setup - 3 Session Windows

This guide explains how to run A/B/C Sessions using 3 separate Claude Code terminal windows.

---

## 📁 Directory Structure for Sessions

```
solo-guardian/
├── .claude/
│   ├── DESIGN_STATE.yaml          # Shared source of truth
│   ├── prompts/
│   │   ├── A_SESSION.md           # A Session system prompt
│   │   ├── B_SESSION.md           # B Session system prompt
│   │   └── C_SESSION.md           # C Session system prompt
│   └── CLAUDE.md                  # Claude Code project instructions
```

---

## 🚀 Quick Start

### Terminal 1: A Session (Design)

```bash
cd /Users/stevelife/source/learn/ai_develop_template

# Start Claude Code with A Session prompt
claude --print-system-prompt
# Then paste A_SESSION.md content, or use:

# After Start up.
claude "Read .claude/prompts/A_SESSION.md and act as A Session. 
Read .claude/DESIGN_STATE.yaml to understand current state.
I want to start iter-001: design the auth module."
```

claude "Read .claude/prompts/A_SESSION.md and act as A Session.
Read .claude/DESIGN_STATE.yaml to understand current state."
```

### Terminal 2: B Session (Implementation)

```bash
cd /Users/stevelife/source/learn/ai_develop_template

claude "Read .claude/prompts/B_SESSION.md and act as B Session.
Read .claude/DESIGN_STATE.yaml for constraints.
Wait for task handoff from A Session."
```

### Terminal 3: C Session (Review)

```bash
cd /Users/stevelife/source/learn/ai_develop_template

claude "Read .claude/prompts/C_SESSION.md and act as C Session.
Read .claude/DESIGN_STATE.yaml for constraints.
Wait for implementation report from B Session."
```

---

## 🔧 Better Approach: Use CLAUDE.md

Claude Code automatically reads `CLAUDE.md` (or `.claude/CLAUDE.md`) as project instructions.

Create session-specific instruction files that each window can reference.

---

## 📋 Workflow Between Windows

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Terminal 1      │     │  Terminal 2      │     │  Terminal 3      │
│  A SESSION       │     │  B SESSION       │     │  C SESSION       │
│  (Design)        │     │  (Implement)     │     │  (Review)        │
└────────┬─────────┘     └────────┬─────────┘     └────────┬─────────┘
         │                        │                        │
         │ 1. Create skeleton     │                        │
         │    with TODOs          │                        │
         │ 2. Save to files       │                        │
         │ 3. Update DESIGN_STATE │                        │
         │                        │                        │
         ├───────────────────────►│                        │
         │  "Check handoffs/      │                        │
         │   HO-001-*.yaml"       │                        │
         │                        │                        │
         │                        │ 4. Read task handoff   │
         │                        │ 5. Fill in TODOs       │
         │                        │ 6. Create impl report  │
         │                        │                        │
         │                        ├───────────────────────►│
         │                        │  "Check handoffs/      │
         │                        │   IR-001-*.yaml"       │
         │                        │                        │
         │                        │                        │ 7. Review code
         │                        │                        │ 8. Check constraints
         │◄───────────────────────┼────────────────────────┤ 9. Create review report
         │  "Check handoffs/      │                        │
         │   RR-001-*.yaml"       │                        │
         │                        │                        │
         │ 10. Process feedback   │                        │
         │ 11. Next iteration     │                        │
         │     or fix task        │                        │
         ▼                        ▼                        ▼
```

---

## 💬 Communication Between Sessions

Since all 3 terminals work in the **same directory**, they communicate via files:

| From | To | File Location |
|------|-----|---------------|
| A → B | Task Handoff | `.claude/handoffs/iter-XXX/HO-XXX-*.yaml` |
| B → C | Implementation Report | `.claude/handoffs/iter-XXX/IR-XXX-*.yaml` |
| C → A | Review Report | `.claude/handoffs/iter-XXX/RR-XXX-*.yaml` |
| B → A | Questions/Blockers | `.claude/handoffs/iter-XXX/QF-XXX-*.yaml` |

### Example Commands

**A Session creates task:**
```
A: "Create task handoff for auth module, save to .claude/handoffs/iter-001/"
```

**B Session picks up:**
```
B: "Read .claude/handoffs/iter-001/HO-001-auth.yaml and implement the TODOs"
```

**C Session reviews:**
```
C: "Read .claude/handoffs/iter-001/IR-001-auth.yaml and review the code in apps/backend/src/modules/auth/"
```

---

## 🎯 Session Startup Commands

### A Session Startup
```bash
claude --dangerously-skip-permissions "You are A Session (Architect).

Your responsibilities:
- Read and update .claude/DESIGN_STATE.yaml
- Create skeleton code with TODO(B) markers
- Write task handoffs to .claude/handoffs/

Read .claude/prompts/A_SESSION.md for full instructions.
Read .claude/DESIGN_STATE.yaml for current project state."
```
```
Start iter-001: Design the auth module with phone number login."
```

### B Session Startup
```bash
claude --dangerously-skip-permissions "You are B Session (Implementer). 

Your responsibilities:
- Read task handoffs from .claude/handoffs/
- Fill in TODO(B) markers in code
- Write implementation reports

Read .claude/prompts/B_SESSION.md for full instructions.
Read .claude/DESIGN_STATE.yaml for constraints."
```
```
Waiting for task. Check .claude/handoffs/iter-001/ for new tasks."
```

### C Session Startup
```bash
claude --dangerously-skip-permissions "You are C Session (Reviewer).

Your responsibilities:
- Read implementation reports from .claude/handoffs/
- Review code against DESIGN_STATE constraints
- Write review reports

Read .claude/prompts/C_SESSION.md for full instructions.
Read .claude/DESIGN_STATE.yaml for constraints."
```
```
Waiting for review. Check .claude/handoffs/iter-001/ for implementation reports."
```

---

## 📝 CLAUDE.md Options

You can also create a single CLAUDE.md that detects which session to act as:

```markdown
# Solo Guardian - Claude Code Instructions

This project uses a 3-session AI workflow.

## Session Detection

When starting, ask: "Which session am I? (A/B/C)"

- **A Session**: Read .claude/prompts/A_SESSION.md
- **B Session**: Read .claude/prompts/B_SESSION.md  
- **C Session**: Read .claude/prompts/C_SESSION.md

## Always Read First

1. `.claude/DESIGN_STATE.yaml` - Current project state
2. `.claude/FILE_STRUCTURE.md` - Where files go
3. `.claude/handoffs/` - Current tasks and reports
```