# Current State — updated 2026-10-04 (end of S4)
**Phase:** 3 (Chapters 2–6) — Ch2 done · **Blocker:** none for Ch3; finale needs Q63 code + Q66 message

## Playable now (`npm run dev`, ~25 min)
- Title → New Game / Continue / Settings (+ overwrite confirm).
- **Prologue**: Ishu's room → owl letter (signed "G.") → framed letter portal.
- **Ch1 Hall + Library**: Snape bound (clause 1), portraits riddle → Frog Card "1", "G." glimpse, ISHU code lock,
  the Map + clause 2, empty hall (torch tile now visibly out) → Ch1 results card → **Continue** → forest.
- **Ch2 Forbidden Forest** (dark map, lantern light follows player): lantern on stump (G.'s note) → glowing tracks
  → stalker beat (scare-gated) + Snape's Lumos (lantern 2) + "G." sighting #2 → G.'s unfinished note → 3 burrows
  (Niffler always in the 3rd checked) → trade an earring for coin "4" → clause 3 ("calm down") → north exit →
  Ch2 results card (no Continue until Ch3 exists).
- Esc menu (items/clauses/settings/save/quit); I = items; autosave on objective/room change.

## Architecture notes
- Story state = ink VARs (`src/story/main.ink`); maps ASCII (`src/data/maps`); puzzles data (`src/data/puzzles.ts`).
- New this session: `MapDef.lantern` + `systems/lantern.ts`; map object `tile` (grid swap by `when`);
  ink EXTERNAL `scare()` (0/1/2 from settings); `outro.next` → Continue on the results card (no save at a
  card with Continue — the next map's arrival autosaves); `scenes/worldFx.ts` (show:figure, cam fx).
- Creatures: `CharSpec.creature` ('niffler') draws a non-humanoid in the same 24×36 sheet.
- Art code-generated: tiles in `tiles.ts` + `tilesBedroom/Library/Forest.ts`.

## Tests
- `npm run check` green (25 unit: story paths incl. full Ch2 + Niffler haggle loop, map/tile/legend/Continue
  integrity, lantern maths, code lock).
- `npm run test:e2e` green (prologue→hall; library→card→Continue→forest; full forest → Ch2 card). Tour shots 30–37.

## Known issues / TODO
- No music/ambience (Ch1 audio requested 2026-10-03). No touch controls (deprioritised: laptop).
- `WorldScene.ts` ~400 lines (over the ~300 guideline) → split object building/refresh out in Ch3.
- Lighting setting off / Canvas renderer → forest is not dark (no Light2D); acceptable fallback, untested.
- Tour skips Snape binding, so tour shots show no follower (tour-only). Tour can't reach the Ch1 card (warps).
- Bookshelf tiles repeat; Ishu's up-facing sprite is a hair blob; no lantern drawn in her hand.
- Main JS chunk ~1.8MB (Phaser) — code-split in optimisation phase.
