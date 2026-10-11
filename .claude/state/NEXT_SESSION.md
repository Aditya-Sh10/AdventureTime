# Next Session (D14 = 2026-10-13, ship day; her birthday is tomorrow)
**Goal:** fill the personal message → full playthrough → deploy to Vercel → send-ready link.

## Tasks (in order)
1. Paste the user's Q66 message into `src/data/finale.ts` (`MESSAGE.lines`, `signed`). Keep their words exactly
   (polish only if asked). Add a unit test that no `{{TODO` remains in `src/data` + `src/story` once filled.
2. If the user describes Adi's look: add an `adi` CharSpec (art/cast.ts) and swap the tower npc to it when
   `hood_down` (two npc objects with `when: 'g_here && !hood_down'` / `'hood_down'`). Otherwise leave silhouette.
3. Full screenshot tour (`SHOT_DIR=... npx playwright test tour`) — review 70–94; fix anything ugly.
4. Real playthrough timing from New Game (target 60–80 min); soft-lock sweep; save/continue mid-Ch5 + finale.
5. Deploy: `npm run build` → Vercel (user OK required; CLI not installed — `npm i -g vercel` + login, or import
   repo at vercel.com). Memorable URL. Smoke test on Chrome + Edge at 1366×768 and 1920×1080.
6. Optional polish if time: Snape spawn offset on warp; rift core sealed tile.

## Needs from user
- **Q66 final personal message** (+ how to sign it). Optional: Adi's appearance for a hood-down sprite.
- **OK to deploy publicly** + preferred URL name; whether to install the Vercel CLI here.

## Files to open
src/data/finale.ts · src/data/maps/tower.ts · src/story/finale.ink · .claude/docs/ROADMAP.md (Phase 5–6)
