# Next Session
**Goal:** Chapter 2: the Forbidden Forest (lantern darkness + a stalker beat), built on the Ch1 template.

## Tasks (in order)
1. If QUESTIONS §K/§M, 63, 64 traits, 66 got answers → fold into GDD §0; plan where L4 inside jokes land (Ch2–6).
2. Quick Ch1 fixes: `torchOut` tile or a prop to hide the flame on `ch1_done` (hall (19,1)); hall `library_door`
   after the card should hint at the forest. Write GDD §4 Ch2 synopsis (beats, refs, clue "4", "A." sighting #2).
3. **Lantern darkness system**: near-black ambient + light that follows the player (Light2D, radius from ink VAR
   `lantern`), WorldScene support via a MapDef flag (e.g. `dark: true`). Unit-test any pure logic.
4. **Forest map** `src/data/maps/forest.ts` + tiles (`tilesForest.ts`: grass, trees, path, roots, mushrooms, water).
   Entry from hall: the hall_empty beat should warp to the forest instead of `end_demo:ch1` (keep a Ch1 card via
   chapter card `ch2`). Ch2 card in `data/chapters.ts`.
5. Forest content (`src/story/ch2_forest.ink`): follow tracks, something follows you (comedic reveal), fragment "4",
   clause 3, "A." glimpse closer. Respect scare 4/5, no heights, no dogs/wolves-as-dogs. Puzzle via PuzzleModal if fits.
6. Tests: dialogue path + e2e through Ch2; tour shots; then commit.

## Needs from user
- §M inside jokes/memories (53–60), §K memes/Hinglish (45–48), Q63 chest code, Q66 message, Guddu/Divisha traits.
- Confirm: "law student" wording; Astronomy-tower finale OK given fear of heights; The Ring — loves or hates?
- Ch1 audio files (spec sent 2026-10-03; ASSETS.md REQ rows).

## Files to open
src/game/scenes/WorldScene.ts (lights/refresh) · src/data/maps/library.ts (template) · src/story/ch1_hall.ink (hall_empty)
