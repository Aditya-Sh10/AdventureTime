# GDD — The Hidden Treasure (v1, partial)
> Condensed + upgraded from `birthday_mystery_game_master_plan.md` (archive). QUESTIONS.md §A–E answered;
> §F–Q (Marvel, Disney, horror, law, Bollywood, memes, memories, ending) still open → those chapters stay DRAFT.

## 0. Profile (from QUESTIONS.md — the only source of personal facts)
- **Ishu** (Ishita; game says "Ishu"). Born 14 Oct 2003 → turns 23. A lawyer. Known "a couple of years".
- Look: black shoulder-length wavy hair worn open, glasses, fair Indian skin tone, **4'11"** (height jokes OK),
  medium earrings, likes crop tops. Sprite: maroon crop top, high-waist jeans, white sneakers.
- HP: Gryffindor · Patronus cat · favourites Ginny, James, Harry · fav professors Dumbledore, McGonagall ·
  quote "Don't let the Muggles get you down" · prefers books · collects merch (wands, figures, tees, wearables,
  letters, a framed Hogwarts acceptance letter). Unknown: spell, creature, location, wand.
- Snape: she dislikes him because he bullied Harry despite loving Lily (genuine). Enjoys being roasted: **medium**.
  Wants him "kinda kind at the end, as their relationship develops". → Late payoff: Snape admits he was unfair to
  the boy (self-aware, earned, not a redemption speech).
- Tone: romantic + platonic + teasing + ambiguous, **mostly teasing and ambiguous**.
- **Adi** (Aditya) appears as a **mystery character** = hooded "A." who signs the letter/contract/clues.
- **BANNED**: dogs (any: Fang, Fluffy, Padfoot, Grim), exes, depression/panic attacks, her weight/body,
  any statement of the user's relationship to her.

## 1. Pitch
Browser 2D top-down adventure (Pokémon-GBA feel, 32px tiles). The player IS the birthday girl. A bound, deeply
unwilling Snape guides her through a quest for "the hidden treasure". Each chapter = new place, a piece of the
mystery, a memorable moment. Treasure = fireworks + personal birthday message. Target **60–80 min**, polished.
Quality bar: *"a game that could only have been made for her."*

## 2. Pillars
1. **Personal** — layered references: L1 obvious → L2 fan → L3 hers → L4 inside jokes (strongest payoff).
2. **Tonal rhythm** — comedy → explore → mystery → comfort → something wrong → tension → scare → relief → comedy.
   If everything is scary nothing is; if everything is funny nothing matters.
3. **Always doing something** — small dense maps, no filler, no grinding, never stuck (hint system).
4. **Snape arc** — reluctant → invested → serious in horror → sincere at the end (still Snape).

## 3. Mystery spine (upgrade: mechanical, not "collect 6 keys")
- **The Contract** (inventory item, Option E): *"Magically Binding Agreement of Reluctant Guidance."* Binds Snape
  to guide "the Seeker" until the treasure is found. Surface = funny. One new **clause** unlocks per chapter; clauses
  get stranger and more specific to *her* → someone wrote this for her.
- **The Map** (from Ch1): a blank map that inks itself in chapter by chapter — shows progress, hides the finale spot.
- **Code fragments**: chest code **1-4-1-0** (14/10). Ch1 Dumbledore Frog Card "1" (BUILT), Ch2 "4", Ch3 "1",
  Ch4 "0"; Ch5/6 reveal the order means a date — *today*. (Confirm via QUESTIONS 63.)
- **"A." sightings**: hooded figure glimpsed once per chapter, a little closer each time (Ch1: west archway, BUILT).
  Portraits/NPCs overhear "A." saying things like "she'll love this". Finale: the hood comes down — Adi.
- **Signature**: the Contract's author line is smudged; each chapter clears a letter. Finale reveals the author =
  the gift-giver ("the entire world was created to lead her toward it").

## 4. Chapters (draft; lengths deliberately uneven, ≈70 min + secrets)
| # | Place | Min | Core mechanic(s) | Memorable moment | Yields |
|---|---|---|---|---|---|
| P | Ishu's room, 11:57 PM 13 Oct — *The Letter* (BUILT) | 4 | move/inspect her merch; owl letter; framed letter = portal | her own room, her own merch | Letter |
| 1a | Entrance Hall (BUILT) | 6 | Snape bound + follows; portraits (Cadogan, Violet); banner riddle; McGonagall, Ginny; cauldron gag | first "A." glimpse; Ginny's "Don't let the Muggles…" | Contract+clause 1, Frog Card "1" |
| 1b | Library (NEXT) | 5 | book puzzle / restricted section; the Map appears | a corridor is empty on the way back (1st tiny wrong) | Map, clause 2 |
| 2 | Forbidden forest | 10 | darkness + lantern radius, follow tracks, stalker | something follows you → comedic OR real reveal | fragment 2 |
| 3 | Wizengamot courtroom | 9 | evidence board + "OBJECTION" dialogue duel | she's on trial for touching things Snape said not to (uses stats!) + Bollywood courtroom drama | fragment 3 |
| 4 | Multiverse rift | 10 | hub → 3 mini-dimensions: Daredevil radar-sense (echolocation reveal), Spider-Man web-zip, Disney princess realm | a Marvel/Disney cameo tuned to her favourites | fragment 4 |
| 5 | Haunted wing | 11 | room-swap on revisit, sound-led tension, chase (easystar), minimal UI | the scare she remembers (intensity per settings) | fragment 5 |
| 6 | Room of Hidden Things | 7 | callbacks: room assembles from past chapters | Snape drops the sarcasm (almost) | finale location |
| F | Astronomy tower | 8 | chest code = all fragments | empty chest → "Really?" → silence → BOOM | fireworks + message |
Every chapter: distinct environment · central mystery · 1–2 mechanics · ≥3 personal refs · 1 memorable moment · clue.
Disney + Bollywood placement is provisional (no dedicated chapters in the brief) — confirm via QUESTIONS §N.

## 5. Systems (build once, reuse everywhere)
Status 2026-09-30: BUILT = player/anim, follower Snape, interaction probe, ink dialogue + portraits + voice blips,
quests + HUD, escalating hints, inventory + Contract clauses view, stats (ink VARs), save/continue, settings,
pause menu, map warps + fades, Light2D lighting, demo SFX synth, chapter cards, end card.
TODO = puzzle modals, music/ambience (needs files), lantern darkness, stalker/chase, touch controls.
- **Player**: 4-dir move, collision, interact range, camera follow; walk anims when art lands.
- **Interaction**: E/Space/click → nearest interactable → ink knot. Mouse click-to-interact where practical.
- **Dialogue**: ink (`src/story/*.ink`) — speaker, portrait tag, choices, conditions, variables. Snape lines live in ink.
- **Quest**: chapter → objectives → completion → reward/clue → next chapter. Data in `src/data/chapters.ts`.
- **Inventory**: ≤12 items (letters, keys, artifacts, evidence, clue fragments). Inspect view with flavour text.
- **Hints (upgrade)**: stuck timer per objective: 60s vague Snape nag → 120s specific → 180s explicit + marker. Never skip content.
- **Stats (upgrade)**: snape_sighs, touched_forbidden, scares_survived, secrets_found, time_played, deaths/catches → finale + Ch3 trial.
- **Save**: localStorage, zod-validated, versioned. Autosave at chapter start + checkpoints. Continue / New Game.
- **Audio**: Howler layers: base ambience + area ambience + music + event SFX + character SFX; crossfades;
  randomised one-shots (never loop everything). Captions for important sounds (accessibility + horror w/o sound).
- **Lighting/FX**: Phaser Light2D darkness + lantern; vignette/FX pipeline sparingly; ≤150 particles at once.
- **Puzzle UIs (React modals)**: code lock, symbol/rune arrange, evidence board. One generic PuzzleModal shell.
- **Settings**: text speed, skip dialogue, master/music/sfx/ambience volume, reduced motion, **scare intensity**
  (full/reduced/gentle), high-contrast text.

## 6. Horror rules
Mostly **sound + anticipation + uncertainty**. Jumpscares rare (≤1 per horror chapter, scaled by setting). Toolkit:
light dies behind you, footsteps matching yours then one extra, portrait changes on revisit, empty corridor that was
full, funny NPC acting wrong, silence before a beat, something at screen edge. Always followed by relief + comedy.

## 7. Snape
Reason (Option E): the Contract. Surface: bureaucratic comedy. Deep: the Contract's author chose Snape on purpose
(she "dislikes" him → maximum comedy; answer QUESTIONS §E). Expressions needed: annoyed, disgusted, smug, serious,
soft. Running gags: "Do not touch that." / sigh counter / clauses he reads aloud in growing horror.

## 8. Finale
Code entered → chest opens → nothing → Snape: "Really?" → 2s silence (music cut) → BOOM → fireworks (Phaser
particles) + sky/environment transform + music swap → "Happy Birthday, [NAME] ❤️" → stats screen (funny titles) →
Snape's sincere line → personal message (text; optional photos/voice note/song) → credits (asset attributions).

## 9. Art & audio direction
**Now:** all art is code-generated chibi pixel art (src/game/art) — consistent and personal (Ishu's glasses,
hair, earrings, height). **Later:** swap in real sheets under the same texture keys.
32px tiles, 480×270 internal, pixel-perfect scale. Preferred base for real art: **LPC** assets (32px tiles, 64×64 char frames,
huge castle/forest/interior coverage, Universal Character Generator for her + Snape) + Kenney/itch CC0 fill-ins.
LPC is CC-BY-SA/GPL → credits screen mandatory; track every asset in ASSETS.md.
Per-chapter palette: castle warm amber/stone · forest teal/black · court mahogany/gold · multiverse neon ·
haunted desaturated green · finale midnight blue → firework colours.
Audio: Freesound CC0, Kenney audio, OpenGameArt, Pixabay music — OGG delivery, MP3 fallback.

## 10. Performance & targets
60 FPS (graceful 30) on low/mid laptops; Chrome/Edge (Firefox if practical); 1366×768 + 1920×1080; 100/125% zoom.
Small maps, camera culling (Phaser default), texture atlases, lazy-load per chapter, compressed audio.
Deploy: Vercel, public URL, no login/install.
