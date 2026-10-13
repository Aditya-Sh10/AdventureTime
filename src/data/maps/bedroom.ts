import type { MapDef } from './types';

/** Prologue: Ishu's room, 11:57 PM on 13 October. Full of her (real) Harry Potter merch. */
export const bedroom: MapDef = {
  id: 'bedroom',
  name: "Ishu's Room",
  chapter: 'prologue',
  music: 'home',
  ambience: 'room',
  ambient: 0x4a4f78,
  grid: [
    '%%%%%%%%%%%%%',
    '%wFwwvwwMMZm%',
    '%K___~~~___c%',
    '%k___~~~____%',
    '%____~~~____%',
    '%_________dd%',
    '%p__________%',
    '%___________%',
    '%%%%%%%%%%%%%',
  ],
  spawns: { start: [6, 4, 'down'] },
  objects: [
    { kind: 'trigger', id: 'opening', x: 4, y: 3, w: 5, h: 3, knot: 'p_opening', when: '!p_started' },
    { kind: 'prop', id: 'owl', sprite: 'owl', x: 5, y: 1, when: '!got_letter' },
    { kind: 'spot', id: 'window', x: 5, y: 1, knot: 'room_window' },
    { kind: 'spot', id: 'frame', x: 2, y: 1, knot: 'room_frame', glow: 'got_letter' },
    { kind: 'spot', id: 'merch', x: 8, y: 1, w: 2, knot: 'room_merch' },
    { kind: 'spot', id: 'wands', x: 10, y: 1, knot: 'room_wands' },
    { kind: 'spot', id: 'mirror', x: 11, y: 1, knot: 'room_mirror' },
    { kind: 'spot', id: 'bed', x: 1, y: 2, h: 2, knot: 'room_bed' },
    { kind: 'spot', id: 'tee', x: 11, y: 2, knot: 'room_tee' },
    { kind: 'spot', id: 'desk', x: 10, y: 5, w: 2, knot: 'room_desk' },
    { kind: 'spot', id: 'plant', x: 1, y: 6, knot: 'room_plant' },
    { kind: 'light', id: 'lamp', x: 10.5, y: 5, radius: 130, color: 0xffc27a, intensity: 1.2, flicker: true },
    { kind: 'light', id: 'moon', x: 5, y: 2.2, radius: 110, color: 0x9fb4ff, intensity: 1 },
    { kind: 'light', id: 'frameGlow', x: 2, y: 1.6, radius: 90, color: 0xffe28a, intensity: 1.6, when: 'got_letter' },
  ],
};
