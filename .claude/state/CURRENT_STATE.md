# Current State — updated 2026-10-12 (end of S6)
**Phase:** 3 (Chapters) — Ch1–4 done · **Blocker:** finale needs Q66 message (code 1410 confirmed by user)

## Playable now (`npm run dev`, ~45 min)
- Title → New Game / Continue / Settings (+ overwrite confirm). Esc menu (items/clauses/settings/save/quit); I = items.
- **Prologue** (room → owl letter → portal) · **Ch1** Hall + Library (Snape bound, Frog Card "1", Map, clauses 1–2).
- **Ch2 Forest** (lantern darkness, Niffler, coin "4", clause 3).
- **Ch3 Wizengamot** (`court`): McGonagall judge, Snape prosecutor, Divisha counsel, Guddu witness; 3 exhibits →
  objection duel (`ObjectionDuel.tsx`, puzzle kind 'objection') → Case No. 1 + clause 4 → Continue.
- **Ch4 Multiverse** (`rift`, dark + neon): Batman soft toy on the rift core; Hell's Kitchen (Matt, radar → red
  shard), Queens (Spider-Man, web-shooter, in-map warp zip → blue shard), Tangled tower (Rapunzel, 3 lanterns →
  gold shard), Bruno door, Majnu painting → core → "The Zero" (fragments=4) + Batman toy + clause 5 → Ch4 card
  (no Continue until Ch5 exists).
- Snape `snape_talk` is chapter-aware (rift/court/forest/ch1).

## Architecture notes
- Story state = ink VARs (`src/story/main.ink`); maps ASCII (`src/data/maps`); puzzles data (`src/data/puzzles.ts`).
- Map objects built/refreshed/probed in `scenes/mapObjects.ts` (WorldScene ~275 lines).
- `CharSpec.mask` ('spider' | 'band'), hairStyle 'rapunzel', creatures 'niffler' | 'batplush' (`art/creatures.ts`).
- Tilesets: `tiles.ts` + `tilesBedroom/Library/Forest/Court/Rift.ts`. Legend chars nearly exhausted: digits and
  `^|"$@()-` now used by the rift.
- In-map warps (`# warp:rift:far`) restart the scene on the same map — works fine.

## Tests
- `npm run check` green (30 unit: story paths through Ch4, integrity, lantern, code lock, duel logic).
- `npm run test:e2e` green (5 tests: prologue→hall; library→forest; forest→court; court→rift; full rift).
- Tour shots 10–62 (`SHOT_DIR=<dir> npx playwright test tour`, ~2.7 min).

## Known issues / TODO
- No music/ambience (Ch1 audio requested 2026-10-03, none received). No touch controls (laptop target).
- Rift core tile still shows empty sockets after it is sealed (text says "whole again").
- G. figure flash timing not caught in tour shot 61 (works in play).
- Lighting off / Canvas renderer → dark maps not dark; untested.
- Bookshelf tiles repeat; Ishu's up-facing sprite is a hair blob; no lantern drawn in her hand.
- Main JS chunk ~1.8MB (Phaser). Python edits on Windows write CRLF → run `sed -i 's/\r$//'` before commit.
