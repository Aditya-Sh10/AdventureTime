# CLAUDE.md — The Hidden Treasure (birthday game)

> **Session start:** if the user hasn't run `/start-session`, first read `.claude/state/NEXT_SESSION.md`
> (then `CURRENT_STATE.md` if needed). **Session end:** run the `/end-session` skill steps.
> This file is auto-loaded — keep it 150–175 lines. Details live in `.claude/docs/*` (read on demand).

## 1. Project
Personalized browser 2D top-down adventure (Pokémon-GBA feel), a **birthday gift for Ishu** (birthday 14 Oct).
The player is Ishu; a bound, reluctant Snape follows and guides her through prologue + 6 chapters + finale to a
"hidden treasure" = fireworks + a personal birthday message. Target **60–80 min polished**.
Deadline: **ship by 2026-10-13** (D1 = 2026-09-30, D14 = 10-13). Deploy: Vercel, public URL, no login.
The **demo IS the game**: every system/map/knot built for the demo is production code — extend, never rebuild.
Quality bar: *"a game that could only have been made for her."*

**Chapter quick-ref** (GDD §4): P Ishu's room → letter → portal (BUILT) · 1 Castle: Entrance Hall + Library (BUILT) ·
2 Forbidden forest (BUILT) · 3 Wizengamot courtroom (BUILT) · 4 Multiverse (BUILT) ·
5 Haunted wing + Room of Hidden Things (BUILT; Ch6 merged) · F Astronomy tower (BUILT; message = Q66 TODO).
Spine: Contract clauses (1/chapter) + code fragments (chest code 1-4-1-0 = 14/10) + hooded "G." glimpses;
the author "G." (Goldfish — her nickname for him) is Adi (the gift-giver), revealed at the end.

## 2. Hard rules
1. **Never invent personal information.** Personal facts come only from `QUESTIONS.md` / GDD §0. Unknown →
   placeholder `{{TODO:what}}` or ask. Never guess.
2. **Content bans (from the user — absolute):** no dogs except **Lily** (her living golden retriever; never the
   one that died; no Fang, Fluffy, Padfoot/dog form, Grim), no exes (one approved oblique Q39 joke only),
   no depression/panic attacks/mental-health jokes, no jokes about her weight/body, and **never state or imply
   what the user's relationship to her is**. Tone: teasing + ambiguous. Height (4'11") jokes ARE allowed.
3. **One system at a time**: implement → test → fix → commit → next. Chapters built sequentially.
4. **Ask for assets only when their phase starts**, with the exact spec template in `.claude/docs/ASSETS.md`.
5. **Copyright**: the game is private (only the user + Ishu, unlisted URL), so user-supplied copyrighted assets
   (e.g. film music) are OK — don't flag them. Still list every third-party asset's source in ASSETS.md credits.
6. Master brief `birthday_mystery_game_master_plan.md` is an **archive**. Use `.claude/docs/GDD.md`.
7. Ask the user when an MCP, tool install, or file is needed — don't silently work around it.
8. Horror is seasoning: tonal rhythm in GDD §2/§6; always honour `settings.scare`.

## 3. Stack
| Layer | Tech |
|---|---|
| Build | Vite 8, TypeScript 6 (strict), alias `@/` → `src/` |
| World | **Phaser 3.90**: Arcade physics, tilemap from ASCII grids, Light2D, 480×270 internal, 32px tiles |
| UI | React 19 + Tailwind 4 + `motion` — overlays (dialogue, HUD, toast, menu, title, end card) |
| State | `zustand` vanilla stores: `gameStore` (UI/game), `settingsStore` (persisted) |
| Story | **ink** (`inkjs`), ONE story `src/story/main.ink` INCLUDEs chapter files; compiled by `vite-plugin-ink.ts` |
| Audio | demo SFX synthesised in `systems/audio.ts` (WebAudio); `howler` for real files later, same `play(name)` API |
| Other | `zod` saves, `easystarjs` (chase, later), `phaser3-rex-plugins` (touch joystick, later), pixel fonts |
| Tests | `vitest` (`tests/unit`), Playwright (`tests/e2e`: smoke playthrough + opt-in screenshot tour) |

## 4. Commands
```
npm run dev        # http://localhost:5173
npm run check      # typecheck + lint + unit tests  (before every commit)
npm run test:e2e   # playwright playthrough (starts dev server itself)
SHOT_DIR=<dir> npx playwright test tour   # screenshot tour → look at the PNGs to review art/UI
npm run build      # production build → dist/
```
Shell is Windows PowerShell 5.1 (no `&&`; use `;`). Set env vars as `$env:SHOT_DIR="..."`.

## 5. Architecture
```
React App ─ <PhaserGame/> (Boot: generates art+anims → World(map) … restarted per map)
          └ overlay: Hud · ChapterCard · Toast · DialogueBox · GameMenu · DemoEnd · TitleScreen
Phaser WorldScene ── reads gameStore.mode each frame; input only when mode === 'play'
      │  E/Space/Enter → probe in front of player → dialogue.start(knot)
      ▼
Dialogue (ink) ── tags → systems/effects.ts → gameStore (items/quest/card/toast), sfx, bus events
bus (systems/events.ts): load-map · refresh · show · cam · end-demo · autosave     flow.ts: new/continue/save/title
```
- `mode`: `title | play | dialogue | menu | ended`. Phaser freezes the player when ≠ play.
- **All story state lives in ink VARs** (flags, stats, clauses). Map objects show/hide via `when` conditions on
  those VARs; `bus.emit('refresh')` after every line re-evaluates them. Save = ink JSON + inventory + quest + pos.
- Per-frame values (play time, player pos) live in `systems/session.ts`, not the store (no re-renders).
- Interact input is event-driven (`keydown-E/SPACE/ENTER` queue) + `INTERACT_COOLDOWN_MS` after dialogue close.

## 6. File map
```
src/game/art/        draw.ts · characters.ts (+cast specs, creatures) · tiles.ts (+tileKit, tilesBedroom/…/Rift/Haunted/Tower) · props.ts
src/game/scenes/     BootScene (textures+anims) · WorldScene (any MapDef: tiles, lights, lantern, objects) · worldFx
src/game/entities/   Actor.ts (sprite + 4-dir walk/idle, feet origin, depth sort)
src/game/systems/    dialogue · effects (ink tags) · events (bus) · conditions · hints · save · audio · session · puzzle · lantern
src/game/flow.ts     newGame / continueGame / saveNow / quitToTitle / autosave · services.ts (dialogue singleton)
src/data/            items · quests (title + 3 hints) · chapters (+ CLAUSES, outro) · speakers · puzzles · finale (stats, message, credits)
src/data/maps/       types.ts · legend.ts (char → tile) · bedroom · hall · library · forest · court · rift · haunted · tower · index.ts
src/story/           main.ink (VARs, INCLUDEs) · prologue · ch1_hall · ch1_library · ch2_forest · ch3_court · ch4_rift · ch5_haunted · finale · snape
src/store/           gameStore.ts · settingsStore.ts        src/ui/  one component file per overlay
tests/unit/          dialogue (full story paths) · systems (conditions, hints, save, map↔knot integrity)
```

## 7. Docs index (read on demand)
| File | Read when |
|---|---|
| `.claude/state/NEXT_SESSION.md` | every session start (≤40 lines) |
| `.claude/state/CURRENT_STATE.md` | session start / before touching unfamiliar systems (≤60 lines) |
| `.claude/docs/GDD.md` | profile (§0), story, chapters, mechanics, Snape, finale (grep `## N.` then read range) |
| `.claude/docs/ROADMAP.md` | planning, "what's left", end-session ticking |
| `.claude/docs/ASSETS.md` | art/audio requests + credits · `DECISIONS.md` before changing architecture |
| `QUESTIONS.md` | only for personal details not yet in GDD §0 (grep the section) |

## 8. Adding content (the main loop from here on)
- **New map**: `src/data/maps/<id>.ts` (ASCII `grid`, `spawns`, `markers`, `objects`) → add to `maps/index.ts`.
  New tile? add a `TileDef` in a tileset file + a char in the map's own `legend` (shared chars are used up). Equal rows.
- **Objects**: `npc` (char, knot, facing) · `spot` (inspect with E; `glow` condition) · `trigger` (fires on enter)
  · `prop` (`solid` = blocks while shown, e.g. gate) · `light` (Light2D) · `tile` (swap a grid tile).
  All take `when: 'var' | '!var' | 'n>=2' | 'a && !b'`. Dark map: `lantern: true` (radius from ink VAR `lantern`).
- **Warps**: an ink line tagged `# warp:<map>:<spawn>` (runs after the box closes). Doors = trigger → knot → warp.
- **New knot**: write it in the chapter `.ink`; the integrity test fails if a map references a missing knot.
- **New item/quest/chapter/speaker**: add to `src/data/*`. Quests need exactly 3 escalating hints.
- **New character**: add a `CharSpec` in `art/characters.ts` (+ `speakers.ts` entry for portrait/voice).

## 9. ink conventions
- `Speaker: text` only if Speaker is registered in `data/speakers.ts`; otherwise the line is narration.
  **Never put a colon in the first 24 chars of narration.** Avoid `//` in text (ink comment).
- Tags: `portrait:<char>_<neutral|annoyed|smug|shock|soft|happy>` · `give:<item>` · `take:<item>` · `quest:<id>`
  · `done` · `sfx:<chime|tap|door|whoosh|sting|pickup|boom|select|open|sigh>` · `chapter:<id>` · `show:figure`
  · `cam:shake|flash` · `warp:<map>:<spawn>` · `puzzle:<id>` (modal, `data/puzzles.ts`) · `end_demo[:<chapter>]`.
  `end_demo` card shows Continue if `outro.next` is set. Ink `scare()` → 0 gentle · 1 reduced · 2 full.
  Unknown tags warn in DEV. **A knot may not share a name with a VAR** (ink compile error).
- Knots `<area>_<thing>`; repeat visits via `{knot > 1: …}` or `{stopping: - … }`. Stats: `~ snape_sighs++`.
- Snape: dry, clipped, formal; roasts medium (height jokes OK); never cruel; warms slowly (GDD §7).

## 10. Code conventions
- TS strict, no `any` in `src/`. Named exports; files ≤ ~300 lines. Comments explain *why*.
- Systems framework-free where possible (unit-testable). Content is data (`src/data`, `.ink`), not TS strings.
- Art/audio drawing code may use comma sequences (lint rule off there only).
- No per-frame allocations in hot paths; particles ≤150; no DOM blur/shadows over the canvas while playing.
- DEV-only hooks: `window.__player`, `__scene`, `__dialogue`, `__bus` (e2e + console debugging).
- Every new system gets unit tests; the e2e playthrough must keep passing (extend it per chapter).

## 11. Art & audio
- **Demo art is code-generated** (`src/game/art/*`) under stable texture keys: `tiles`, `<charId>` (9-frame
  24×36 sheet: down/up/side × idle+2 walk; side faces left, flipX = right), `owl`, `glow`, `spark`.
  Real assets later: load in a Preload scene under the SAME keys (see ASSETS.md) and drop the generator call.
- Ishu's sprite is drawn 2px shorter than everyone else. Deliberately.
- 32px tiles · portraits come from `portraitURL(char, expr)` · SFX via `sfx.play(name)`; voices via `sfx.blip`.

## 12. Definition of done
Works in `npm run dev` · `npm run check` green · e2e green · no console errors · screenshot-tour reviewed for
visual changes · state docs updated at end-session · committed.

## 13. Gotchas
- WorldScene instances are reused on restart → reset per-map fields in `init()`.
- React StrictMode double-mounts `PhaserGame` in dev; cleanup destroys the first game — keep it.
- Phaser captures keys: SPACE/ENTER capture removed so React panels get them.
- ink `ChoosePathString` resets flow — only at knot entry. `dialogue.start` is ignored while a dialogue is open.
- e2e: after pressing E, wait for the dialogue to be visible before advancing (it appears next frame).
- Pixelify Sans "fi" ligature looks like "A" → ligatures disabled globally in index.css.
- Audio starts only after a user gesture (`sfx.unlock()` in newGame/continueGame).
- Save is versioned (`SAVE_VERSION` in save.ts): bump + migrate when the schema changes.
- Headless Chromium logs "GPU stall due to ReadPixels" on screenshots — harmless.

## 14. Workflow & token efficiency
1. NEXT_SESSION task → read only named files. 2. Personal info → GDD §0, else grep QUESTIONS.md, else ask.
3. Missing asset → keep generated art, add `REQ` row in ASSETS.md, ask with the template.
4. Smallest playable version → check → screenshot tour → polish → commit.
- Don't re-read files in context; grep → read ranges; Edit over rewrites; batch tool calls; short replies.
- State files are rewritten (bounded); SESSION_LOG is append-only and never auto-read.
