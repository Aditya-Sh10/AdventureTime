# Current State — updated 2026-10-12 (end of S7)
**Phase:** 4 done (game complete start → credits) · **Blocker:** Q66 personal message · Vercel deploy needs user OK

## Playable now (`npm run dev`, full game)
- Title → New Game / Continue / Settings. Esc menu (items/clauses/settings/save/quit); I = items.
- **Prologue** · **Ch1** Hall + Library · **Ch2** Forest · **Ch3** Wizengamot · **Ch4** Multiverse (see GDD §4).
- **Ch5 Haunted Wing** (`haunted`, lantern-dark, per-map legend): corridor (extra footstep, stopped clock 11:57,
  chained door "NOT YET") → nursery (fog mirror "perfectly splendid" → `lens` → "14") → TV room (Ring tape = the
  one jumpscare, scare-gated, lantern dies/returns; well girl; "10"; Sinister reels) → portraits turn + middle door
  goes red → Red Room ("14 · 10" = birthday, G. in mirror, hidden door) → Room of Hidden Things (Lily, Snape's
  "unfair to the boy", clause 6, Map corner → tower) → Ch5 card → Continue.
- **Finale** (`tower`): chest code puzzle 1410 → empty → "Really?" → midnight → `# show:fireworks` (Phaser
  particles, worldFx.ts) + `# show:birthday` banner (ui/Finale.tsx) → G. late (asleep, forgot treasure) →
  "calm down"/"Do not." → GOLDFISH → hood down (Adi, kept a silhouette) → Snape's sincere line →
  `end_demo:finale` → FinaleEnd: stats (data/finale.ts, time vs normal person ×0.85) → message → credits.

## Architecture notes
- Story state = ink VARs (`src/story/main.ink`); maps ASCII; puzzles data; finale content in `src/data/finale.ts`.
- `MapDef.legend` overrides the shared LEGEND per map (`legendOf`); tileset canvas is 16 tiles per row.
- Tilesets: tiles.ts + tilesBedroom/Library/Forest/Court/Rift/Haunted/Tower.ts. Creatures: niffler, batplush, lily.
- Speakers added: Lily, G., Adi (G./Adi use the hooded `figure` portrait).

## Tests
- `npm run check` green (35 unit: story paths through finale, finale stats, integrity incl. per-map legends).
- `npm run test:e2e` green (7: prologue→hall, library, forest, court, rift, haunted, finale). Running
  `npm run build` alongside e2e kills the dev server — don't.
- Tour shots 10–94 (`SHOT_DIR=<dir> npx playwright test tour`, ~4.5 min); 70–94 not yet run as a full tour.

## Known issues / TODO
- `MESSAGE.lines` = `{{TODO:message}}` (Q66) — shows literally on the message screen until filled.
- Adi has no face sprite (appearance unknown); hood-down is narrated, sprite stays hooded.
- Snape spawns overlapping Ishu on warps (cosmetic). No music/ambience. No touch controls.
- Rift core tile still shows empty sockets after sealing. Main JS chunk ~1.8MB (Phaser).
- Python edits on Windows can write CRLF → git normalises (autocrlf=true); harmless warnings.
