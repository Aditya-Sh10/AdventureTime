# Roadmap — 14 days (D1 = 2026-09-30, ship by D14 = 2026-10-13)
Rule: one system at a time → implement → test → fix → commit. Finish chapters sequentially; never 6 half-chapters.
Scope valve if behind: cut optional secrets → merge Ch6 into Ch5 ending → shorten Multiverse to 2 dimensions.
Never cut: Prologue, Ch1 polish, Finale.

## Phase 0 — Setup & Discovery
- [x] D1 Scaffold Vite+React+TS+Phaser 3.90+ink+Howler+zustand+Tailwind; tests (vitest+playwright) green
- [x] D1 Claude workflow (.claude docs/state/skills), GDD v0, QUESTIONS.md
- [ ] D1–2 User fills QUESTIONS.md  ← BLOCKS GDD v1
- [ ] D2 GDD v1: final story, clue chain, chapter synopses, NPC list, puzzle list, reference list, horror+comedy beats
- [ ] D2 ASSETS.md: full asset + sound manifest with exact specs; pick LPC/Kenney packs

## Phase 1 — Core systems (D3–4)
- [ ] Tiled map loading (JSON) + collision layer + object layer (interactables, doors, triggers, spawns)
- [ ] Player: 4-dir anim, interact range, camera; placeholder → LPC sprite
- [ ] Interaction + ink dialogue polish: portraits, text speed, skip, choices, mouse
- [ ] Quest/objective system + HUD objective line
- [ ] Inventory + inspect view
- [ ] Save/load (zod, versioned) + Title (Continue/New Game)
- [ ] Audio manager (Howler layers, crossfade, random one-shots, captions)
- [ ] Settings + pause menu (incl. scare intensity, reduced motion)
- [ ] Hint system + stats tracker
- [ ] Scene/chapter transitions (fade, lazy asset load)

## Phase 2 — Art pipeline + Prologue (D5)
- [ ] Import tilesets/sprites/portraits; atlas; credits list
- [ ] Prologue complete (map, Snape intro, Contract, clause 1)

## Phase 3 — Chapter 1 (D6–7) — the template chapter, fully polished
- [ ] Map, NPCs, puzzles, refs, first "wrong" beat, audio, playtest (pacing/readability/perf)

## Phase 4 — Chapters 2–6 (D8–11)
Per chapter: map → NPCs → mechanic → puzzle → refs → horror/comedy beat → clue → audio → test
- [ ] Ch2 Forest (Light2D lantern, stalker)
- [ ] Ch3 Courtroom (evidence board, objection duel)
- [ ] Ch4 Multiverse (radar-sense, web-zip, princess realm)
- [ ] Ch5 Haunted wing (room-swap, chase)
- [ ] Ch6 Room of Hidden Things (callbacks)

## Phase 5 — Finale (D12)
- [ ] Chest code, "Really?", silence, fireworks, stats screen, Snape sincere line, message, credits

## Phase 6 — Optimise + playtest (D13)
- [ ] FPS/memory/load on low-end laptop; Chrome/Edge/Firefox; 1366×768 / 1920×1080; zoom 100/125%
- [ ] Full playthrough timing (target 60–80 min); soft-lock sweep; testing checklist (below)

## Phase 7 — Deploy (D14)
- [ ] Vercel deploy, memorable URL, final smoke test on her likely device

## Testing checklist (run in Phase 6)
Gameplay: no wall clipping · never permanently stuck · every quest completable · every transition · save/load/restart
Dialogue: no missing lines · no overflow · skip · choices · hints fire
Audio: clean loops · balanced · horror cues fire · no stacking · mute
Perf: low-end test · no memory spikes · lazy-load · Responsive: both resolutions, zoom, trackpad/touch
