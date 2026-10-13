# Current State — updated 2026-10-13 (end of S8, D14 = ship day)
**Phase:** 5 (polish/audio done) · **Blockers:** Q66 personal message · Vercel deploy needs user OK + URL name

## Playable now (`npm run dev`, full game)
- **Front door** (ui/HeightGate.tsx, data/gate.ts): password = her height on a door-frame growth chart; only
  4'11" opens (teases per range, books under her feet, Lily paw hint after 3). Once per session (sessionStorage).
- **Title** (ui/TitleScreen + CozyScene, art/cozyRoom + cozyActors): window seat at 11:57 PM, Ishu reading,
  Lily asleep, everything clickable; menu = parchment letter, paw cursor, GSAP entrance; `home` music.
  DEV-only chapter-select row (game/devJumps.ts). Settings = "cozy console" (ui/SettingsPanel.tsx, shared).
- Prologue → Ch1 Hall/Library → Ch2 Forest → Ch3 Court → Ch4 Rift → Ch5 Haunted → Finale → stats/message/credits.
- Dialogue choices: ↑/↓ or W/S + Enter/Space/E, numbers, mouse; held keys can't pick.
- End cards ignore input for 600ms (useArmed). Snape spawns beside Ishu after warps.

## Audio (all WebAudio; volumes in settings apply live)
- Music: synth chiptune per map (data/music.ts) + Ch1 = user's Hedwig clip (FILE_SONGS, crossfaded loop);
  `# music:<id|none>` tag; music-box Happy Birthday at fireworks. Haunted wing has no music on purpose.
- Ambience (systems/ambience.ts): one-shots + drones, fire loop (hall/library), crickets loop (forest). No noise beds.
- SFX: 35 recorded clips (src/sounds/sfx via scripts/process_sounds.py; gains in data/sounds.ts), synth fallback
  for the rest (whoosh, tap, stone/carpet/metal steps). Footsteps per floor tile; Snape's quieter.
- Snape sighs aloud only on his theatrical-sigh hint line + scripted beats.

## Tests
- `npm run check` green (52 unit). `npm run test:e2e` green (8: gate, prologue→finale chapters; tour skipped
  unless SHOT_DIR). Tour shots 10–94 reviewed this session.

## Known issues / TODO
- `MESSAGE.lines` = `{{TODO:message}}` (Q66) — shows literally on the message screen until filled.
- Not done: full timed playthrough from New Game, soft-lock sweep, Vercel deploy.
- Adi stays a hooded silhouette (look unknown). Rift core tile still shows empty sockets after sealing.
- Couldn't verify `dist/` lacks the DEV panel (dist reads denied); it is behind import.meta.env.DEV.
- Levels were set by measurement, not listening — user is play-testing audio.
- Main JS chunk ~1.8MB (Phaser). Running `npm run build` alongside e2e kills the dev server — don't.
