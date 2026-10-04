import type { MapDef } from './types';

/**
 * Chapter 3: the Wizengamot courtroom. Judge's bench on a dais (top), counsel tables + evidence table (middle),
 * public gallery of wigged spectators behind a rail (bottom). Collect 3 exhibits → approach the bench → duel.
 */
export const court: MapDef = {
  id: 'court',
  name: 'The Wizengamot',
  chapter: 'ch3',
  ambient: 0x6a4a3a,
  grid: [
    '######################',
    '#&&*&&&&&&*&&&&&&*&&&#',
    '#;;;;;;;;;;;;;;;;;;;;#',
    '#&!&&////[j]/////////#',
    '#====+====<>=====z===#',
    '#=========<>=========#',
    '#==={}==?=<>===={}===#',
    '#=========<>=========#',
    '#/////////<>/////////#',
    '#=aaaa====<>==aasa===#',
    '#=========<>=========#',
    '#=xaaa====<>===aaa===#',
    '#=========<>=========#',
    '##########DD##########',
  ],
  spawns: { entry: [10, 12, 'up'], title: [10, 7, 'down'] },
  markers: { figure: [16, 5] },
  objects: [
    { kind: 'trigger', id: 'arrive', x: 9, y: 11, w: 4, h: 2, knot: 'court_arrive', when: '!court_seen' },
    { kind: 'npc', id: 'judge', char: 'mcgonagall', x: 10, y: 2, facing: 'down', knot: 'court_judge' },
    { kind: 'spot', id: 'bench', x: 9, y: 3, w: 3, knot: 'court_judge', glow: 'evidence>=3 && !verdict' },
    { kind: 'npc', id: 'divisha', char: 'divisha', x: 6, y: 6, facing: 'down', knot: 'divisha' },
    { kind: 'npc', id: 'guddu', char: 'guddu', x: 18, y: 4, facing: 'down', knot: 'guddu' },
    // Evidence.
    { kind: 'spot', id: 'evidence', x: 8, y: 6, knot: 'court_evidence_table', glow: 'met_counsel && !ev_receipt' },
    { kind: 'spot', id: 'stool', x: 2, y: 11, knot: 'court_stool', glow: 'met_counsel && !ev_stool' },
    { kind: 'tile', id: 'stoolGone', x: 2, y: 11, tile: 'courtFloor', when: 'ev_stool' },
    // Flavour.
    { kind: 'spot', id: 'portrait', x: 2, y: 3, knot: 'court_portrait' },
    { kind: 'spot', id: 'clerk', x: 5, y: 4, knot: 'court_clerk' },
    { kind: 'spot', id: 'witnessBox', x: 17, y: 4, knot: 'court_witness_box' },
    { kind: 'spot', id: 'galleryL', x: 2, y: 9, w: 4, knot: 'court_gallery' },
    { kind: 'spot', id: 'galleryR', x: 14, y: 9, w: 4, knot: 'court_gallery' },
    { kind: 'spot', id: 'galleryB', x: 15, y: 11, w: 3, knot: 'court_gallery' },
    { kind: 'spot', id: 'door', x: 10, y: 13, w: 2, knot: 'court_door' },
    // Lights: warm chandeliers, a gold pool on the bench, the gallery a touch dimmer.
    // Chandeliers sit either side of the aisle: one over the red carpet turns it into a glowing puddle.
    { kind: 'light', id: 'chandelierL', x: 5.5, y: 5.5, radius: 190, color: 0xffd28a, intensity: 1.05, flicker: true },
    { kind: 'light', id: 'chandelierR', x: 15.5, y: 5.5, radius: 190, color: 0xffd28a, intensity: 1.05, flicker: true },
    { kind: 'light', id: 'bench', x: 10, y: 2.5, radius: 120, color: 0xffe08a, intensity: 1.2 },
    { kind: 'light', id: 'sconceL', x: 3, y: 1.6, radius: 120, color: 0xffa860, intensity: 1, flicker: true },
    { kind: 'light', id: 'sconceR', x: 17, y: 1.6, radius: 120, color: 0xffa860, intensity: 1, flicker: true },
    { kind: 'light', id: 'galleryL', x: 4, y: 10, radius: 150, color: 0xffc878, intensity: 0.8, flicker: true },
    { kind: 'light', id: 'galleryR', x: 16, y: 10, radius: 150, color: 0xffc878, intensity: 0.8, flicker: true },
    {
      kind: 'light',
      id: 'neon',
      x: 20,
      y: 6,
      radius: 140,
      color: 0xff3cc8,
      intensity: 1.2,
      flicker: true,
      when: 'verdict',
    },
  ],
};
