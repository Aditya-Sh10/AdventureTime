# CLAUDE.md — The Hidden Treasure (birthday game)

> **Session start:** if the user hasn't run `/start-session`, first read `.claude/state/NEXT_SESSION.md`
> (then `CURRENT_STATE.md` if needed). **Session end:** run the `/end-session` skill steps.
> This file is auto-loaded — keep it 150–175 lines. Details live in `.claude/docs/*` (read on demand).

## 1. Project
Personalized browser 2D top-down adventure (Pokémon-GBA feel) made as a **birthday gift**. The player is the
birthday girl; a bound, reluctant Snape guides her through 6 chapters + prologue + finale to a "hidden treasure"
that turns out to be fireworks and a personal birthday message. Target **60–80 min polished** playtime.
Deadline: **D14 = 2026-10-13** (D1 = 2026-09-30). Deploy: Vercel, public URL, no login.
Quality bar: *"a game that could only have been made for her."*

**Chapter quick-ref** (full design: GDD §4; all DRAFT until QUESTIONS.md is answered):
P Letter/castle gates (Contract binds Snape) · 1 Castle+library (Map) · 2 Forbidden forest (lantern, stalker) ·
3 Wizengamot courtroom (evidence + objections, law/Bollywood) · 4 Multiverse (Daredevil radar-sense, Spidey
web-zip, Disney realm) · 5 Haunted wing (room-swap, chase) · 6 Room of Hidden Things (callbacks) ·
F Astronomy tower (chest code → "Really?" → fireworks → stats → message).
Spine: Contract clauses + self-inking Map + one code fragment per chapter → final chest code; author = the gift-giver.

## 2. Hard rules
1. **Never invent personal information.** Personal facts come only from `QUESTIONS.md`. Tag internally as
   KNOWN / LIKELY / UNCERTAIN / UNKNOWN. UNCERTAIN → ask before using prominently. UNKNOWN → placeholder
   `{{TODO:what}}` in content, never a guess.
2. **One system at a time**: implement → test → fix → commit → next. Chapters built sequentially, never in parallel.
3. **Ask for assets only when their phase starts**, using the exact spec template in `.claude/docs/ASSETS.md`.
   Never ask vaguely ("send some Hogwarts images").
4. **Copyright**: original dialogue/art direction, short references and parody only. No ripped sprites, soundtrack
   files, or movie clips. Every third-party asset gets source + license in ASSETS.md credits.
5. Master brief `birthday_mystery_game_master_plan.md` is an **archive**. Use `.claude/docs/GDD.md` instead.
6. Ask the user when an MCP, tool install, or file is needed — don't silently work around it.
7. Horror is seasoning, not the meal: tonal rhythm in GDD §2/§6; always honour the scare-intensity setting.

## 3. Stack
| Layer | Tech |
|---|---|
| Build | Vite 8, TypeScript 6 (strict), path alias `@/` → `src/` |
| World | **Phaser 3.90** (Arcade physics, tilemaps, Light2D, particles), pixelArt, 480×270 internal, 32px tiles |
| UI | React 19 + Tailwind 4 + `motion` — overlays above the canvas (dialogue, menus, HUD, puzzles) |
| Bridge | `zustand` **vanilla** store `src/store/gameStore.ts` — Phaser reads/writes via `getState/setState` |
| Dialogue | **ink** via `inkjs`; `.ink` files compiled at build by `vite-plugin-ink.ts` |
| Audio | `howler` (layered ambience, crossfades, sprites) |
| Other | `easystarjs` (chase/pathing), `zod` (save schema), `phaser3-rex-plugins` (joystick etc.), @fontsource pixel fonts |
| Tests | `vitest` (unit, `tests/unit`), `@playwright/test` (e2e smoke, `tests/e2e`) |

## 4. Commands
```
npm run dev        # http://localhost:5173
npm run check      # typecheck + lint + unit tests  (run before every commit)
npm run test:e2e   # playwright smoke (starts dev server itself)
npm run build      # production build → dist/
npm run format     # prettier
```
Shell is Windows PowerShell 5.1 (no `&&`; use `;` or `; if ($?) {}`); Bash tool also available.

## 5. Architecture
```
React (App.tsx)
 ├─ <PhaserGame/>  mounts Phaser.Game once (config.ts) → scenes: Boot → World(…chapters) → Finale
 └─ UI overlay (pointer-events-none wrapper; panels opt-in with pointer-events-auto)
        ▲ useGame(selector)                     │ dialogue.advance()/choose()
        │                                        ▼
   gameStore (zustand vanilla)  ◄── setState ── systems/* (dialogue, quest, save, audio …)
        ▲ getState() every frame
   Phaser scenes (input only when mode === 'play')
```
- `mode`: `'title' | 'play' | 'dialogue' | 'paused'` decides input ownership. Phaser freezes the player when ≠ play.
- Shared singletons live in `src/game/services.ts` (e.g. `dialogue`). Scenes & UI import from there.
- Interact input is **event-driven** (`keydown-E`/`keydown-SPACE` queue), with `INTERACT_COOLDOWN_MS` after
  dialogue close so the closing key can't re-open it.
- React never re-renders per frame; Phaser never imports React.

## 6. File map
```
src/main.tsx, App.tsx, index.css (Tailwind @theme: font-pixel, font-title)
src/store/gameStore.ts          global UI/game state (vanilla zustand + useGame hook)
src/game/config.ts              Phaser config; constants.ts (GAME_W/H, TILE, cooldowns)
src/game/services.ts            singletons shared by scenes + UI
src/game/scenes/                BootScene (placeholder textures), WorldScene (map, player, interactables)
src/game/systems/dialogue.ts    ink bridge: start(knot)/advance/choose, parseLine
src/game/entities/  maps/       (Phase 1: Player/NPC/Interactable; Tiled JSON)
src/ui/                         DialogueBox, TitleScreen (+ HUD, Inventory, Pause, Settings, PuzzleModal later)
src/story/*.ink                 dialogue per chapter (+ snape.ink shared)
src/data/                       chapters, items, clues, characters (typed TS data)
public/assets/{tiles,sprites,portraits,audio,ui}
tests/unit/*.test.ts  tests/e2e/*.spec.ts
vite-plugin-ink.ts              .ink → JSON transform
QUESTIONS.md                    personalization answers (user-filled; source of truth for personal facts)
```

## 7. Docs index (read on demand, not by default)
| File | Read when |
|---|---|
| `.claude/state/NEXT_SESSION.md` | every session start (≤40 lines) |
| `.claude/state/CURRENT_STATE.md` | session start / before touching unfamiliar systems (≤60 lines) |
| `.claude/docs/ROADMAP.md` | planning, "what's left", end-session ticking |
| `.claude/docs/GDD.md` | story, chapter, mechanic, tone, Snape, finale questions (grep `## N.` then read range) |
| `.claude/docs/ASSETS.md` | importing/requesting art or audio, credits |
| `.claude/docs/DECISIONS.md` | before changing architecture; append new decisions |
| `.claude/state/SESSION_LOG.md` | only if history is needed (append at end-session) |

## 8. Code conventions
- TS strict, no `any` in `src/` (tests may). Named exports; one class/component per file; files ≤ ~250 lines.
- Scenes: PascalCase `XScene.ts`, key = name without "Scene" (`'World'`). Systems: camelCase files, framework-free
  where possible so they're unit-testable (pure logic + store writes).
- Content is **data**, not code: chapters/items/clues in `src/data/*.ts`, lines in `.ink`. No dialogue strings in TS.
- Comments explain *why*, briefly. Match surrounding style. Prettier: single quotes, width 120, trailing commas.
- No per-frame allocations in `update()` hot paths; reuse vectors. Particles ≤150 live. No blur/shadow filters on DOM
  above the canvas during gameplay.
- Every new system gets a unit test for its logic; the e2e smoke must keep passing.
- DEV-only debug hooks behind `import.meta.env.DEV` (e.g. `window.__player`).

## 9. ink conventions
- Line format `Speaker: text`, optional tags `# portrait:snape_annoyed`, `# sfx:chime`, `# event:give_item:map`.
- One `.ink` file per chapter; knots named `<area>_<thing>` (e.g. `library_portrait`). Globals in `snape.ink`.
- Game state the story needs (flags, stats) lives in ink VARs; read/write via `dialogue.vars`.
- Snape's voice: dry, clipped, formal; insults are elaborate, never cruel about real insecurities. Warms slowly (GDD §7).

## 10. Assets conventions
- Paths: `public/assets/<kind>/<chapter>-<name>.<ext>`; IDs in ASSETS.md match filenames.
- 32px tiles; LPC 64×64 character frames; portraits 256×256; WebP for big images; OGG audio (+MP3 fallback).
- Placeholder textures are generated in BootScene until real art lands — keep keys stable when swapping.

## 11. Definition of done (per feature)
Works in `npm run dev` · `npm run check` green · e2e green if gameplay touched · no console errors ·
state docs updated at end-session · committed.

## 12. Workflow per task
1. Check NEXT_SESSION task → read only the files it names.
2. If it needs personal info → grep `QUESTIONS.md` section; missing/unsure → ask (batch questions).
3. If it needs an asset not in repo → placeholder now + add `REQ` row in ASSETS.md + ask with template.
4. Implement smallest playable version → `npm run check` → try it in dev → polish.
5. Commit with a clear message; keep `main` always runnable.

## 13. Gotchas
- Phaser scenes restart on HMR edits of scene files; state in the zustand store survives, scene fields don't.
- React StrictMode double-mounts `PhaserGame` in dev; the cleanup destroys the first game — keep it that way.
- Phaser captures keys: `removeCapture('SPACE')` so React panels still get Space during dialogue.
- ink: `ChoosePathString` resets the flow — call it only at knot entry; VARs persist across knots.
- Tailwind 4: theme tokens are in `index.css` `@theme`, no tailwind.config file.
- Vite 8 (rolldown): prefer `build.rolldownOptions` over rollupOptions if chunking is needed.
- Audio can't start before a user gesture; start Howler contexts after "New Game"/"Continue".
- Save format is versioned: bump `SAVE_VERSION` + write a migration when the schema changes.

## 14. Asset request example
> **Asset needed: Chapter 2 forest tileset** — PNG spritesheet · 32×32 tiles · not transparent · must include:
> grass, dirt, path edges, tree trunk + canopy, rocks, water edge · sheet 256–512px wide · one sheet, not loose files.
> **Sound:** Ch5 haunted ambience — seamless loop · OGG/WAV · 30–90s · low wind + distant creaks · no jumpscare.

## 15. Token efficiency
- Don't re-read files already in context; don't read node_modules/dist; grep → read ranges for big files.
- Prefer Edit over full rewrites. Batch independent tool calls. Keep replies short; no recaps of file contents.
- State files are **rewritten** (bounded size), logs are append-only and not read by default.
