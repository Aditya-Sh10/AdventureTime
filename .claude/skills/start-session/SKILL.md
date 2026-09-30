---
name: start-session
description: Start a work session on the birthday game — load only the minimal state files, brief the user, and begin the first planned task. Use when the user says /start-session, "start session", "let's continue", or begins a new day of work.
---

# Start Session

Goal: be productive within ~3 small reads. CLAUDE.md is already in context — do not re-read it.

## Steps
1. Read `.claude/state/NEXT_SESSION.md` (the plan) and `.claude/state/CURRENT_STATE.md` (what exists).
2. Run `git status --short` and `git log --oneline -5` (one call). Note uncommitted work from last time.
3. Open **only** what the first task needs:
   - story/design question → the relevant section of `.claude/docs/GDD.md` (grep the heading, read that range)
   - asset work → `.claude/docs/ASSETS.md`
   - "what's left overall" → `.claude/docs/ROADMAP.md`
   - personal details → `QUESTIONS.md` (grep the section, don't read it all unless writing GDD)
   Never read `birthday_mystery_game_master_plan.md` unless GDD lacks a needed detail.
4. Brief the user in ≤6 lines:
   ```
   Day N · Phase X · last session: <1 line>
   Today: <goal>
   Tasks: 1) … 2) … 3) …
   Blockers/needs from you: <or "none">
   ```
5. If a blocker needs the user (answers, assets, installs), ask now in one batched message, then start the first
   task that is not blocked. Otherwise start task 1 immediately.

## Rules
- Follow the NEXT_SESSION task order unless the user redirects.
- Day number = days since 2026-09-30 + 1 (D14 = ship day).
- Don't summarise files back to the user; act on them.
