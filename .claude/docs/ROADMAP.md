# Roadmap — ship by 2026-10-13 (D1 = 2026-09-30; her birthday is 14 Oct)
Rule: one system at a time → implement → test → fix → commit. Chapters sequential. The demo IS the game.
Scope valve if behind: cut optional secrets → merge Ch6 into Ch5 ending → shorten Multiverse to 2 dimensions.
Never cut: Prologue, Ch1 polish, Finale.

## Phase 0 — Setup & Discovery
- [x] D1 Scaffold stack; tests green; Claude workflow; GDD v0; QUESTIONS.md
- [x] D1 QUESTIONS §A–E answered → GDD §0 profile
- [x] D4 QUESTIONS §F–J, L, N, O(65,67), Q answered → GDD §0
- [x] D5 QUESTIONS §K, §M, 35, 64, 68 answered → GDD §0 + L4 placement plan
- [ ] QUESTIONS 63 (chest code), 66 (final message), 69–71 ← blocks finale
- [ ] GDD v1 complete: clue chain, chapter synopses, NPCs, puzzles, refs L1–L4, horror + comedy beats

## Phase 1 — Core systems (D1, done early)
- [x] ASCII map loader + collision + object layer (npc/spot/trigger/prop/light, `when` conditions)
- [x] Player 4-dir anim, interaction probe + prompt, camera, y-sort; Snape follower
- [x] ink dialogue: one story, portraits + expressions, voice blips, text speed, skip, choices, tag effects
- [x] Quests + HUD objective + escalating Snape hints; inventory + Contract clauses
- [x] Save/continue (zod, versioned, autosave); title; pause menu; settings (incl. scare intensity)
- [x] Map warps with fades; chapter cards; Light2D lighting with flicker; demo SFX synth; end card
- [ ] Music/ambience layer (Howler) — needs audio files
- [ ] ~~Touch controls~~ deprioritised: she plays on a laptop, Chrome/Edge (Q72)
- [x] D4 Puzzle modal shell + code-lock variant (`# puzzle:<id>`) · [ ] symbol arrange · [x] D5 objection duel (evidence)

## Phase 2 — Prologue + Chapter 1 (D2–D4)
- [x] Prologue: Ishu's room (merch, owl, letter, portal)
- [x] Ch1a Entrance Hall: Snape bound, portraits, banner riddle, McGonagall, Ginny, cauldron gag, "G." glimpse
- [x] D4 Ch1b Library: map + ISHU code lock + the Map + clause 2 + empty-hall beat → Ch1 results card
- [x] D5 Results card Continue → next chapter; torch-out tile swap
- [ ] Polish pass: pacing, readability, art tweaks from screenshot tour, sound balance

## Phase 3 — Chapters 2–6 (D5–D10)
Per chapter: map → NPCs → mechanic → puzzle → refs → horror/comedy beat → clue → audio → e2e path → tour
- [x] D5 Ch2 Forest (lantern darkness, Niffler stalker, coin 4, clause 3)   - [x] D5 Ch3 Courtroom (objection duel, case 1, clause 4)
- [x] D12 Ch4 Multiverse (radar-sense, web-zip, Tangled lanterns, zero, clause 5)
- [ ] D13 Ch5 Haunted wing **+ Ch6 merged into its ending** (scope valve applied D12: one map, Ring nod,
      glasses lens, Lily callback; the Room of Hidden Things = Ch5's last room → finale)

## Phase 4 — Finale (D13, after Ch5)
- [ ] Chest code 1410, "Really?", silence, fireworks (particles), stats screen, Snape's sincere line,
      hood comes down (Adi), personal message, credits

## Phase 5 — Real assets, optimise, playtest (D13–D14 morning; real assets only if supplied)
- [ ] Swap in real art/audio where available (same keys) · credits
- [ ] FPS/memory on low-end laptop; Chrome/Edge; 1366×768 / 1920×1080; zoom 100/125%
- [ ] Full playthrough timing (60–80 min); soft-lock sweep; testing checklist

## Phase 6 — Deploy (D13)
- [ ] Vercel deploy, memorable URL, final smoke on her device; delivery plan for 14 Oct

## Testing checklist
Gameplay: no clipping · never stuck · every quest completable · transitions · save/load/restart
Dialogue: no missing lines · no overflow · skip · choices · hints fire · Audio: loops · balance · mute
Perf: low-end · no memory spikes · Responsive: both resolutions, zoom, trackpad/touch
