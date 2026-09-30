# Roadmap — ship by 2026-10-13 (D1 = 2026-09-30; her birthday is 14 Oct)
Rule: one system at a time → implement → test → fix → commit. Chapters sequential. The demo IS the game.
Scope valve if behind: cut optional secrets → merge Ch6 into Ch5 ending → shorten Multiverse to 2 dimensions.
Never cut: Prologue, Ch1 polish, Finale.

## Phase 0 — Setup & Discovery
- [x] D1 Scaffold stack; tests green; Claude workflow; GDD v0; QUESTIONS.md
- [x] D1 QUESTIONS §A–E answered → GDD §0 profile
- [ ] QUESTIONS §F–Q (Marvel, Disney, horror, law, Bollywood, memes, memories, ending, delivery) ← blocks Ch2–F content
- [ ] GDD v1 complete: clue chain, chapter synopses, NPCs, puzzles, refs L1–L4, horror + comedy beats

## Phase 1 — Core systems (D1, done early)
- [x] ASCII map loader + collision + object layer (npc/spot/trigger/prop/light, `when` conditions)
- [x] Player 4-dir anim, interaction probe + prompt, camera, y-sort; Snape follower
- [x] ink dialogue: one story, portraits + expressions, voice blips, text speed, skip, choices, tag effects
- [x] Quests + HUD objective + escalating Snape hints; inventory + Contract clauses
- [x] Save/continue (zod, versioned, autosave); title; pause menu; settings (incl. scare intensity)
- [x] Map warps with fades; chapter cards; Light2D lighting with flicker; demo SFX synth; end card
- [ ] Music/ambience layer (Howler) — needs audio files
- [ ] Touch controls (rex joystick) + click-to-move/interact — if she may play on phone/tablet (Q72)
- [ ] Puzzle modal shell (code lock / symbol arrange / evidence board)

## Phase 2 — Prologue + Chapter 1 (D2–D4)
- [x] Prologue: Ishu's room (merch, owl, letter, portal)
- [x] Ch1a Entrance Hall: Snape bound, portraits, banner riddle, McGonagall, Ginny, cauldron gag, "A." glimpse
- [ ] Ch1b Library: map + puzzle + the Map item + clause 2 + "empty corridor" beat → Ch1 end card
- [ ] Polish pass: pacing, readability, art tweaks from screenshot tour, sound balance

## Phase 3 — Chapters 2–6 (D5–D10)
Per chapter: map → NPCs → mechanic → puzzle → refs → horror/comedy beat → clue → audio → e2e path → tour
- [ ] Ch2 Forest (lantern darkness, stalker)   - [ ] Ch3 Courtroom (evidence board, objection duel)
- [ ] Ch4 Multiverse (radar-sense, web-zip, princess realm)   - [ ] Ch5 Haunted wing   - [ ] Ch6 callbacks

## Phase 4 — Finale (D11)
- [ ] Chest code 1410, "Really?", silence, fireworks (particles), stats screen, Snape's sincere line,
      hood comes down (Adi), personal message, credits

## Phase 5 — Real assets, optimise, playtest (D12–D13)
- [ ] Swap in real art/audio where available (same keys) · credits
- [ ] FPS/memory on low-end laptop; Chrome/Edge; 1366×768 / 1920×1080; zoom 100/125%
- [ ] Full playthrough timing (60–80 min); soft-lock sweep; testing checklist

## Phase 6 — Deploy (D13)
- [ ] Vercel deploy, memorable URL, final smoke on her device; delivery plan for 14 Oct

## Testing checklist
Gameplay: no clipping · never stuck · every quest completable · transitions · save/load/restart
Dialogue: no missing lines · no overflow · skip · choices · hints fire · Audio: loops · balance · mute
Perf: low-end · no memory spikes · Responsive: both resolutions, zoom, trackpad/touch
