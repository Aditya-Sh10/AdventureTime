# Next Session
**Goal:** Finish Chapter 1 (Library) on top of the demo, then polish Ch1 as the template chapter.

## Tasks (in order)
1. If QUESTIONS.md §F–Q now has answers → fold into GDD §0 (profile) + ban list; flag UNCERTAIN ones.
2. **Library map** `src/data/maps/library.ts` (bookshelves, reading tables, restricted-section gate, Madam
   Pince-style NPC or a ghost, candles/lights). Swap `library_door` knot: `# warp:library:entry` instead of
   `# end_demo`. Add return warp to hall (spawn `library` at hall (1,6) facing right).
3. **Library puzzle** (first puzzle modal): e.g. find 3 books whose titles spell a word / shelf-code lock.
   Build a generic React `PuzzleModal` (code-lock variant first) driven by ink tag `# puzzle:<id>`.
4. Reward: **the Map** item (self-inking), Contract **clause 2**, "empty corridor" beat on return to the hall
   (NPCs gone, one torch out — `when: 'ch1_done'`), Ch1 end card (reuse DemoEnd as chapter results).
5. Extend `tests/unit/dialogue.test.ts` + `tests/e2e/smoke.spec.ts` through the Library; run the screenshot tour.
6. Ask the user for Ch1 audio (castle ambience loop, library ambience, footsteps, page turn, theme) with specs.

## Needs from user
- QUESTIONS §F–Q (esp. ⭐: Marvel 25–26, Disney 30, horror 33, law 37, Bollywood 41–42, memes 45,
  inside jokes 53–56, ending 65–67, device 72). Feedback after playing the demo.

## Files to open
src/data/maps/hall.ts · src/story/ch1_hall.ink · src/game/systems/effects.ts · src/ui/DemoEnd.tsx
