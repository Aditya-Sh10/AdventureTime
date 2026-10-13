# Next Session (D14 = 2026-10-13, ship day; her birthday is tomorrow)
**Goal:** personal message in → one real playthrough → deploy to Vercel → send-ready link.

## Tasks (in order)
1. Paste the user's Q66 message into `src/data/finale.ts` (`MESSAGE.lines`, `signed`), their words exactly.
   Add a unit test that no `{{TODO` remains in `src/data` + `src/story`.
2. Apply any audio/UI feedback from the user's playtest (gains: `src/data/sounds.ts`, `music.ts` FILE_SONGS,
   `audio.ts` applyVolumes; title/gate copy: `data/title.ts`, `data/gate.ts`).
3. Full playthrough from the gate + New Game (target 60–80 min); soft-lock sweep; save/continue mid-Ch5 + finale.
4. Deploy: `npm run build` → Vercel (needs user OK; CLI not installed — `npm i -g vercel` + login, or import the
   repo at vercel.com). Unguessable URL (private gift). Smoke test Chrome + Edge at 1366×768 and 1920×1080;
   confirm the DEV chapter-select row is NOT on the deployed title.
5. Optional: remaining sounds (step-stone/carpet, whoosh, tap, lantern-out, lock-click) if the user adds files
   to src/sounds → add rows in `scripts/process_sounds.py` + gains; Adi sprite if the user describes him.

## Needs from user
- **Q66 final personal message** + how to sign it.
- **OK to deploy** + URL name; install Vercel CLI here or import at vercel.com themselves.

## Files to open
src/data/finale.ts · src/data/sounds.ts · .claude/docs/ROADMAP.md (Phase 5–6)
