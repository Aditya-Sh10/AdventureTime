import type { MapDef } from './types';

/**
 * Chapter 2: the Forbidden Forest at night. Lantern darkness; the path winds W → N → E: tracks, the stalker beat
 * + G.'s forgotten note, then the moonlit clearing (Niffler burrows, coin "4", clause 3) with the exit north.
 */
export const forest: MapDef = {
  id: 'forest',
  name: 'The Forbidden Forest',
  chapter: 'ch2',
  music: 'forest',
  ambience: 'forest',
  ambient: 0x0b0d16,
  lantern: true,
  grid: [
    'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
    'VVVVVVVVVVVVVVVVVVVVVVVVuVVVVVVV',
    'VVVVVVVVVVVVVVVVVVVVVnnNunnnnVVV',
    'VVVVVVVVAnnnfnnAVVVVnnonnnnnonVV',
    'VVVAnnnnnnnnnnnnnnnnnnnnnGnnnnVV',
    'VVnnuuuuuuuuuuuuuuuuuuunnnnnnnVV',
    'VVnnunNnnnnhnnnnnnennNnnnnnonnVV',
    'VVQnunnnAVVVVVVVVVnnnVVnnnnnnVVV',
    'VVnnunnnVVVVVVVVVVVVVVVVnnnnVVVV',
    'VVnhunenVVVVnnllnnVVVVVVVVVVVVVV',
    'VVnnunnnVVVnnllllnnVVVVVVVVVVVVV',
    'VVfnunnAVVVVnnlllnVVVVVVVVVVVVVV',
    'VVVnunnnVVVVVnnnnnVVVVVVVVVVVVVV',
    'VVVnunnnnnnNnnhnnnVVVVVVVVVVVVVV',
    'VVVnuuuuuuuuuuuunnVVVVVVVVVVVVVV',
    'VVVVnnnnnnnnnnnunnnVVVVVVVVVVVVV',
    'VVVVVVVVnnNnnnnunnAVVVVVVVVVVVVV',
    'VVVVVVVVnnnnnnnunnnVVVVVVVVVVVVV',
    'VVVVVVVVVnnnnnGunnnVVVVVVVVVVVVV',
    'VVVVVVVVVnnfnnnunnVVVVVVVVVVVVVV',
    'VVVVVVVVVVnnnnnunnVVVVVVVVVVVVVV',
    'VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV',
  ],
  spawns: { edge: [15, 20, 'up'], clearing: [24, 5, 'down'], title: [15, 15, 'down'] },
  markers: { figure: [19, 4] },
  objects: [
    { kind: 'trigger', id: 'arrive', x: 14, y: 19, w: 3, h: 2, knot: 'forest_arrive', when: '!forest_seen' },
    { kind: 'trigger', id: 'dark', x: 15, y: 16, w: 3, knot: 'forest_too_dark', when: 'forest_seen && !lantern' },
    { kind: 'prop', id: 'lanternProp', x: 14, y: 18, sprite: 'lantern', when: '!lantern' },
    { kind: 'spot', id: 'stump', x: 14, y: 18, knot: 'forest_lantern', glow: 'forest_seen && !lantern' },
    // Tracks: tiny glowing footprints along the path (only visible by lantern light, so gated on it).
    { kind: 'spot', id: 'track1', x: 10, y: 14, knot: 'forest_track_1', when: 'lantern', glow: '!track1' },
    { kind: 'spot', id: 'track2', x: 4, y: 9, knot: 'forest_track_2', when: 'lantern', glow: '!track2' },
    { kind: 'trigger', id: 'stalker', x: 8, y: 4, w: 2, h: 3, knot: 'forest_stalker', when: 'lantern && !stalked' },
    { kind: 'spot', id: 'gnote', x: 19, y: 4, knot: 'forest_g_note', when: 'stalked', glow: '!g_note' },
    { kind: 'spot', id: 'track3', x: 21, y: 5, knot: 'forest_track_3', when: 'stalked', glow: '!track3' },
    // Clearing: three burrows. The Niffler is always in whichever one you check third.
    { kind: 'spot', id: 'burrowA', x: 22, y: 3, knot: 'forest_burrow_a', when: 'stalked', glow: 'track3 && !niffler_found && !burrow_a' },
    { kind: 'spot', id: 'burrowB', x: 28, y: 3, knot: 'forest_burrow_b', when: 'stalked', glow: 'track3 && !niffler_found && !burrow_b' },
    { kind: 'spot', id: 'burrowC', x: 27, y: 6, knot: 'forest_burrow_c', when: 'stalked', glow: 'track3 && !niffler_found && !burrow_c' },
    { kind: 'npc', id: 'niffler', char: 'niffler', x: 25, y: 5, facing: 'down', knot: 'niffler', when: 'niffler_found && !ch2_done' },
    { kind: 'spot', id: 'clearingStump', x: 25, y: 4, knot: 'forest_clearing_stump' },
    { kind: 'trigger', id: 'exit', x: 24, y: 1, knot: 'forest_exit' },
    // Flavour.
    { kind: 'spot', id: 'pond', x: 13, y: 9, w: 4, h: 3, knot: 'forest_pond' },
    { kind: 'spot', id: 'mushA', x: 18, y: 6, knot: 'forest_mushrooms' },
    { kind: 'spot', id: 'mushB', x: 6, y: 9, knot: 'forest_mushrooms' },
    { kind: 'spot', id: 'bush', x: 2, y: 7, knot: 'forest_bush' },
    // Lights: the lantern does most of the work; these are landmarks in the dark.
    { kind: 'light', id: 'stumpGlow', x: 14, y: 18, radius: 70, color: 0xffc878, intensity: 1.1, flicker: true, when: '!lantern' },
    { kind: 'light', id: 'mushLA', x: 18, y: 6, radius: 60, color: 0x6ad8c8, intensity: 0.9, flicker: true },
    { kind: 'light', id: 'mushLB', x: 6, y: 9, radius: 60, color: 0x6ad8c8, intensity: 0.9, flicker: true },
    { kind: 'light', id: 'pondL', x: 14.5, y: 10, radius: 90, color: 0x6a8aff, intensity: 0.5 },
    { kind: 'light', id: 'moon', x: 25, y: 4, radius: 170, color: 0x9fb4ff, intensity: 0.75, when: 'stalked' },
  ],
};
