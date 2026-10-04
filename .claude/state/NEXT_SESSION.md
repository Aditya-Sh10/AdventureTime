# Next Session
**Goal:** Chapter 3: the Wizengamot courtroom — Ishu on trial (evidence board + "OBJECTION" duel), fragment "1".

## Tasks (in order)
1. Refactor first: move object build/refresh out of `src/game/scenes/WorldScene.ts` (~400 lines) into a
   `scenes/mapObjects.ts` helper; keep e2e green.
2. Write GDD §4 Ch3 synopsis (pattern: Ch2 synopsis). Beats from GDD §3 L4 plan: trial for touching things
   (`touched_forbidden`, `snape_sighs` stats), "who blocked whom" exhibit (Q55), "calm down" objection, Q39
   professor joke ONCE (never describe the ex), Modi-ji/dad gag (light), Divisha = logical defence counsel,
   Guddu = wannabe-baddie hostile witness, Legally Blonde nod, Bollywood courtroom drama. "G." sighting #3, clause 4.
3. Set Ch2 card `outro.next` → `['court', 'entry']` in `src/data/chapters.ts` + Ch3 chapter def.
4. Courtroom map `src/data/maps/court.ts` + `art/tilesCourt.ts` (benches, dock, judge's bench, gallery).
   New chars in `art/characters.ts`: divisha, guddu (looks unknown → generic, sunglasses for Guddu) + speakers.
5. Mechanic: evidence board / objection duel as a new PuzzleModal variant (`data/puzzles.ts`): pick the right
   exhibit to counter each claim; forgiving (wrong pick = Snape quip, retry). Unit-test the pure logic.
6. `src/story/ch3_court.ink`; dialogue path test + e2e through Ch3; tour shots 40+; commit.

## Needs from user
- Q63 chest code (assuming 1-4-1-0 = 14/10), Q66 final message, Ch1 audio files (ASSETS.md REQ rows).
- Optional: Guddu/Divisha looks (hair, glasses?) for sprites; "law student" wording confirm.

## Files to open
src/game/scenes/WorldScene.ts · src/data/maps/forest.ts (template) · src/story/ch2_forest.ink · src/data/puzzles.ts
