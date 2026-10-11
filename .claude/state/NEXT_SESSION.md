# Next Session (D13 = 2026-10-12, ship tomorrow)
**Goal:** Ch5 Haunted wing (with Ch6 merged as its last room) → Finale → deploy. Scope valve applied (ROADMAP).

## Tasks (in order)
1. GDD §4: write a compact Ch5 synopsis (~10 min). Beats from GDD §3 L4/§0: The Ring nod (cursed tape/well, Q35),
   Bly Manor/Sinister/Hill House nods, her **glasses as a lens** (see hidden writing), room-swap on revisit,
   scare-gated via `scare()` (default full, intensity 4/5, never heights/falling). Last room = Room of Hidden
   Things: callbacks (stool, receipt, coin, Batman toy) + **Lily** (her living golden retriever, warm) → Snape
   almost drops the sarcasm (admits he was unfair to the boy) → clause 6 → Map points to the Astronomy tower.
2. Ch4 card `outro.next` → `['haunted', 'entry']`; `ch5` chapter def in `src/data/chapters.ts`.
3. Map `src/data/maps/haunted.ts` (`lantern: true`) + `art/tilesHaunted.ts`; Lily sprite as a creature.
   Legend is nearly out of single chars → consider per-map legend override in `legend.ts`/map loader.
4. `src/story/ch5_haunted.ink`; unit path + e2e; tour shots 70+; commit.
5. **Finale** `tower` map: chest code puzzle (code lock 1410) → empty chest → "Really?" → silence → fireworks
   (particles ≤150) → stats (incl. her time vs "a normal person's") → Snape's sincere line → hood down: G. =
   Goldfish = Adi → `{{TODO:message}}` → credits. Signature GOLDFISH reveal.
6. Deploy to Vercel (ask before publishing; memorable URL), final smoke on Chrome/Edge.

## Needs from user
- **Q66 final personal message** (finale placeholder until then). Ch1 audio still optional.
- Confirm OK to deploy publicly on Vercel when ready.

## Files to open
src/data/maps/rift.ts (template) · src/story/ch4_rift.ink · src/game/art/tilesRift.ts · src/data/chapters.ts
