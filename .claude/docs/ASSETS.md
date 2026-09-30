# Assets & Sound Manifest
Status: `TODO` (not sourced) · `REQ` (requested from user) · `SRC` (found, not imported) · `IN` (in repo) · `FINAL`
Every asset needs **source + license** (credits screen). Request from user only when its phase starts.

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
| amb-castle | base ambience | loop | P,1 | TODO |
| amb-fireplace/library | area | loop | 1 | TODO |
| amb-forest-night + wind | base | loop | 2 | TODO |
| amb-court-murmur | base | loop | 3 | TODO |
| amb-rift-hum | base | loop | 4 | TODO |
| amb-haunted-wind + low-drone | base | loop | 5 | TODO |
| music-theme / mystery / comedy / tension / celebration | music | loop | all | TODO |
| sfx-footstep-{stone,grass,wood} | character | one-shot, random pitch | all | TODO |
| sfx-door, pickup, page, chime, ui-click, ui-open | event | one-shot | all | TODO |
| sfx-whisper, knock, creak, breath, impact, static | horror | one-shot | 2,5 | TODO |
| sfx-record-scratch, dramatic-sting, objection | comedy | one-shot | 3+ | TODO |
| sfx-firework-launch, burst ×3, crackle | finale | one-shot | F | TODO |

## Credits (fill as assets land)
- Fonts: Pixelify Sans (OFL), Press Start 2P (OFL)
