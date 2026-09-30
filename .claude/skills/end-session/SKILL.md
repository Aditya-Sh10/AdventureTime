---
name: end-session
description: End a work session on the birthday game — verify the build, update state/roadmap/decision/asset docs and CLAUDE.md if needed, log the session, and commit. Use when the user says /end-session, "end session", "wrap up", or "that's it for today".
---

# End Session

Goal: the next session can start from NEXT_SESSION.md alone. Keep every file within its size budget.

## Steps
1. **Verify**: `npm run check` (tsc + eslint + vitest). If gameplay code changed, also `npm run test:e2e`.
   Record failures honestly in CURRENT_STATE (don't hide them); fix quick ones first if the user agrees.
2. **CURRENT_STATE.md** (`.claude/state/`, ≤60 lines) — **rewrite**, don't append:
   header date + phase + blocker · Works · Stubbed/not started · Known issues. Present tense, facts only.
3. **NEXT_SESSION.md** (≤40 lines) — **rewrite**: Goal · ordered Tasks (concrete: file + what) ·
   Needs from user · Files to open. Put unfinished work from today first.
4. **ROADMAP.md** — tick completed `[x]` items; add/re-scope items discovered today; apply scope valve if behind
   schedule (compare day number vs phase dates) and tell the user.
5. **DECISIONS.md** — append one line per new architectural/design decision (date · decision · why).
6. **ASSETS.md** — update statuses, add sources/licenses + credits for anything imported.
7. **GDD.md** — only if design changed; edit the affected section in place (no changelog prose).
8. **CLAUDE.md** — only if stack, commands, file map, conventions, or rules changed. Must stay **150–175 lines**
   (check with `(Get-Content CLAUDE.md).Count` / `wc -l`). Trim stale lines rather than grow.
9. **SESSION_LOG.md** — append 3–5 lines: `## date · S# · title` + done / decided / next.
10. **Commit**: `git add -A` then commit `S#: <summary>` (conventional body bullets). Don't push unless asked.
11. Reply to the user with ≤5 lines: what got done, test status, what's next, what you need from them.

## Rules
- Never delete information from QUESTIONS.md (the user's answers).
- Don't copy content between files; link instead (`see GDD §4`).
- If nothing changed in a file, don't touch it.
