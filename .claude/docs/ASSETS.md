# Assets & Sound Manifest
Status: `TODO` (not sourced) · `REQ` (requested from user) · `SRC` (found, not imported) · `IN` (in repo) · `FINAL`
Every asset needs **source + license** (credits screen). Request from user only when its phase starts.

**Current (2026-09-30): every visual + SFX is code-generated demo art (`GEN`)** — `src/game/art/*` and
`systems/audio.ts`. Texture keys to keep when swapping: `tiles` (one row of 32px tiles, order = `TILES` in
tiles.ts), character sheets `ishu|snape|mcgonagall|ginny|student|figure` (9 frames 24×36: down,up,side ×
idle/walk1/walk2; side faces left), `owl` (2×16px), `glow`, `spark`. Item icons 16px via `iconURL(id)`.
If real character sheets differ in size (e.g. LPC 64×64), update `FW/FH` + body offsets in Actor.ts.
Music/ambience: **none yet** — first real audio request comes with Ch1 polish.

## Global specs (use in every request)
| Kind | Format | Size | Notes |
|---|---|---|---|
| Tiles | PNG spritesheet | 32×32 tiles, sheet 256–512px wide | no padding or 1px extrude; consistent palette |
| Characters | PNG sheet, transparent | 64×64 frames (LPC layout) or 32×48 | 4 dirs × 3–4 walk frames + idle |
| Portraits | PNG/WebP, transparent | 256×256 | per expression, same framing |
| Backgrounds/illustrations | WebP | ≤1600×900 | use sparingly (title, finale) |
| UI icons | SVG (or PNG 16/32px) | — | clue markers, quest, items |
| Music/ambience | OGG (+MP3 fallback); master WAV | 30–120s seamless loop | 44.1kHz, stereo |
| SFX | OGG; master WAV | 0.1–3s | mono OK, trimmed, no leading silence |

## Request template (copy when asking the user)
> **Asset needed: <name> (<chapter>)** — Type · Format · Size/frames · Transparent? · Must include: … ·
> Loop/one-shot · Duration · Mood/notes. One spritesheet preferred over loose files.

## Characters & portraits
| ID | What | Spec | Status | Source/License |
|---|---|---|---|---|
| player | Her (sprite) | LPC 64×64, walk 4-dir | TODO (needs QUESTIONS §C) | LPC generator |
| snape | Snape sprite | LPC 64×64, walk 4-dir, black robes | TODO | LPC generator |
| portrait-snape-* | annoyed, disgusted, smug, serious, soft | 256×256 ×5 | TODO | user / commission |
| portrait-player-* | neutral, happy, scared, smug | 256×256 ×4 | TODO | user |
| npc-* | per GDD v1 NPC list | LPC 64×64 | TODO | — |

## Tilesets (per chapter)
| ID | Needs | Status | Source |
|---|---|---|---|
| castle | stone floor/walls, doors, bookshelves, torches, tables, portraits, windows | TODO | LPC castle/interior |
| forest | grass, dirt path, tree trunk+canopy, rocks, water edge, fog | TODO | LPC terrain |
| court | wood floor, benches, podium, gavel, pillars | TODO | LPC interior |
| multiverse | neon city roofs, rift/portal, princess castle bits | TODO | mix |
| haunted | cracked stone, cobwebs, broken furniture, changed portraits | TODO | LPC dungeon |
| finale | tower top, sky, chest | TODO | LPC + custom |

## UI
Fonts: Pixelify Sans + Press Start 2P — **IN** (@fontsource, OFL). Icons: TODO (Kenney UI pack / custom SVG).

## Audio (layer · loop? · chapter)
| ID | Layer | Loop | Ch | Status |
|---|---|---|---|---|
| amb-castle | base ambience | loop | P,1 | IN (synth, systems/ambience.ts) |
| amb-fireplace/library | area | loop | 1 | IN (synth, systems/ambience.ts) |
| amb-forest-night + wind | base | loop | 2 | TODO |
| amb-court-murmur | base | loop | 3 | TODO |
| amb-rift-hum | base | loop | 4 | TODO |
| amb-haunted-wind + low-drone | base | loop | 5 | TODO |
| music-theme / mystery / comedy / tension / celebration | music | loop | all | IN (synth chiptune, data/music.ts; birthday = trad. PD) |
| sfx-footstep-{stone,grass,wood} | character | one-shot, random pitch | all | IN (synth per surface, systems/footsteps.ts) |
| sfx-door, pickup, page, chime, ui-click, ui-open | event | one-shot | all | page REQ 10-03 (rest synth OK) |
| sfx-whisper, knock, creak, breath, impact, static | horror | one-shot | 2,5 | TODO |
| sfx-record-scratch, dramatic-sting, objection | comedy | one-shot | 3+ | TODO |
| sfx-firework-launch, burst ×3, crackle | finale | one-shot | F | TODO |

## Credits (fill as assets land)
- Fonts: Pixelify Sans (OFL), Press Start 2P (OFL)
- Music, Ch1 (hall + library): "Hedwig's Theme" (John Williams, Harry Potter OST) 17s clip, `src/sounds/harry-potter.mp3`,
  supplied by the user 2026-10-13. Copyrighted; fine because the game is private (only the user and Ishu access it).
  Original synth waltz `castle` is still in data/music.ts if ever needed.
- Recorded SFX (src/sounds/*.mp3, supplied by the user 2026-10-13; processed by scripts/process_sounds.py into
  src/sounds/sfx, levels in src/data/sounds.ts): chime, pickup, select, open, door, scary-sting, boom, sigh, firework,
  map-rustle, draught, book-scream, owl, gavel, objection, web-thwip, vhs-noise, music-box, dog-woof-woof, chest-open,
  page-flip, amb-fire, amb-forest-night, step-grass, step-wood.
- All other music/SFX/ambience: synthesised in code (original); Happy Birthday melody is public domain.
