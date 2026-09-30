# Current State — updated 2026-09-30 (end of D1 setup)
**Phase:** 0 Discovery · **Blocker:** QUESTIONS.md unanswered

## Works
- Vite + React 19 + TS + Phaser 3.90 + Tailwind 4 + motion; `npm run dev` boots.
- Title (React) → New Game → WorldScene: placeholder room (array tilemap), colored-rect player, WASD/arrows,
  wall + object collision, camera follow.
- Interact (E/Space, event-driven, 200ms post-close cooldown) → ink knot → React DialogueBox
  (typewriter, skip, choices via 1–9/click, speaker line; portrait tag parsed but not rendered).
- ink compiled at build via `vite-plugin-ink.ts`; `src/story/prologue.ink` = test story.
- Tests: `npm run check` (tsc+eslint+vitest, 4 unit) green; `npm run test:e2e` smoke green.

## Stubbed / not started
Tiled maps, sprites/anims, portraits, quest, inventory, save, audio (howler installed, unused), settings/pause,
hints, stats, chapter transitions, rex-plugins (installed, unused), easystar (installed, unused).

## Known issues
- Main JS chunk ~1.7MB (Phaser); fine for now, revisit code-split in Phase 6.
- `window.__player` exposed in DEV only (for e2e).
