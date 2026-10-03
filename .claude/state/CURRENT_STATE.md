# Current State — updated 2026-10-03 (end of S3)
**Phase:** 2 done → 3 (Chapters 2–6) · **Blocker:** none for Ch2 mechanics; §K/§M answers needed for L4 refs + finale

## Playable now (`npm run dev`, ~15 min)
- Title → New Game / Continue / Settings (+ overwrite confirm).
- **Prologue**: Ishu's room 11:57 PM 13 Oct → owl letter → framed letter portal.
- **Ch1a Entrance Hall**: Snape intro + Contract (clause 1) → follower; portraits riddle → Frog Card "1"; "A." glimpse;
  McGonagall, Ginny, cauldron gag → west archway warps to the Library.
- **Ch1b Library**: arrival beat; Madam Pince (shush gag, hint); 4 glowing numbered books (Tangled, law, Hogwarts:
  A History, horned red book = Ch4 foreshadow) → letters I-S-H-U; flavour shelves (Legally Blonde, Imran/SRK romcoms,
  Welcome "Control, Uday"), Snape-was-unfair essay, forest window; iron gate → **code lock** modal (ISHU) → Restricted
  Section: screaming chained book (counted), lectern → **the Map** + **clause 2** → exit → hall is **empty** (NPCs gone,
  torch dark) → **Chapter One complete** results card.
- Esc menu (items/clauses/settings/save/quit); I = items; autosave on objective/room change.

## Architecture notes
- Story state = ink VARs (`src/story/main.ink`); maps ASCII (`src/data/maps`); puzzles data (`src/data/puzzles.ts`).
- Tags added this session: `puzzle:<id>`, `end_demo:<chapter>` (outro in `data/chapters.ts`). Solid gate = `prop` + `solid`.
- Art code-generated: tiles split into `tileKit` / `tiles` (castle) / `tilesBedroom` / `tilesLibrary`.

## Tests
- `npm run check` green (19 unit: story paths incl. full library, map/warp/puzzle/clause integrity, code lock).
- `npm run test:e2e` green (prologue→hall; library→code lock→map→empty hall→chapter card). Tour has library shots 20–27.

## Known issues / TODO
- No music/ambience (Ch1 audio requested 2026-10-03). No touch controls (deprioritised: laptop).
- Torch tile still draws a flame after "the torch has gone out" (only its light turns off).
- Bookshelf tiles repeat identically; hall floor a bit brick-like; Ishu's up-facing sprite is a hair blob.
- Continue after the Ch1 card lands in the empty hall with nothing to do until Ch2 exists.
- Tour skips Snape binding, so the hall shots show him as a standing NPC (tour-only).
- Main JS chunk ~1.8MB (Phaser) — code-split in optimisation phase.
