# Current State — updated 2026-09-30 (end of S2)
**Phase:** 2 (Prologue + Ch1) · **Blocker:** QUESTIONS §F–Q unanswered (blocks Ch2+ content, not Ch1)

## Playable now (`npm run dev`, ~8–10 min)
- Title (hall backdrop) → New Game / Continue / Settings (+ overwrite confirm).
- **Prologue** — Ishu's room 11:57 PM 13 Oct: opening narration + chapter card, inspect merch (figures, wands,
  framed letter, tee, mirror, desk, bed, plant), owl at window → letter → framed letter glows → portal flash.
- **Ch1a Entrance Hall** — Snape intro + Contract (clause 1) → Snape follows; portraits Cadogan/Violet (riddle),
  4 house banners, cauldron "Do not touch that" (counted), hourglass/house points, stairs, Great Hall doors,
  McGonagall, Ginny ("Don't let the Muggles…"), Frog Card "1" behind Gryffindor banner (glows after riddle),
  hooded "A." glimpse at west archway, Library archway → **End of demo** card with stats.
- Systems: see GDD §5 status line. Autosave on objective/room change; Esc menu (items/settings/save/quit); I = items.

## Architecture notes
- Everything story-side is in ink VARs (`src/story/main.ink`); maps are ASCII (`src/data/maps`).
- Art is code-generated (`src/game/art`), SFX synthesised (`systems/audio.ts`).

## Tests
- `npm run check` green (13 unit tests incl. full story paths + map↔knot integrity).
- `npm run test:e2e` green (full prologue → hall → save/continue playthrough). Screenshot tour opt-in (SHOT_DIR).

## Known issues / TODO
- No music/ambience yet (needs files). No touch controls. No puzzle modal yet.
- Library is not built: the archway ends the demo (`# end_demo` in `library_door`).
- Hall stone floor looks a bit "brick-like"; Ishu's up-facing sprite is a dark hair blob (fine at game scale).
- Main JS chunk ~1.8MB (Phaser) — revisit code-split in optimisation phase.
