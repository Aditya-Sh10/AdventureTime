# Next Session
**Goal:** Turn QUESTIONS.md answers into GDD v1, then start Phase 1 core systems.

## Tasks (in order)
1. Read `QUESTIONS.md`. If mostly empty → remind user; do Phase 1 work that doesn't need personal info (task 4+).
2. Tag each answer KNOWN/LIKELY/UNCERTAIN/UNKNOWN; ask follow-ups for important UNCERTAIN ones (batch, ≤8 questions).
3. Write GDD v1 into `.claude/docs/GDD.md` (story, clue chain, chapter synopses, NPCs, puzzles, refs L1–L4,
   horror + comedy beats). Update ASSETS.md with exact asset list; pick LPC/Kenney packs.
4. Phase 1: Tiled JSON map loading (collision + object layers) → replace array room in `WorldScene.ts`.
5. Then quest system + HUD objective line.

## Needs from user
- QUESTIONS.md answers · Tiled installed? (`winget install Tiled.Tiled`) · optional: Inky for writing ink.

## Files to open
QUESTIONS.md · .claude/docs/GDD.md · src/game/scenes/WorldScene.ts
