import type { MapDef } from './types';

/**
 * Finale: the top of the Astronomy Tower. Lit, cosy, walled all round (she is afraid of heights, so there is no
 * visible drop, only sky). The chest in the middle takes 1-4-1-0; it is empty; then the sky goes up.
 */
const sky = (n: number) => 's'.repeat(n);

export const tower: MapDef = {
  id: 'tower',
  name: 'The Astronomy Tower',
  chapter: 'finale',
  ambient: 0x5a5a88,
  legend: {
    '.': 'towerStone',
    ',': 'towerStone2',
    s: 'skyStars',
    B: 'battlement',
    T: 'telescope',
    C: 'chest',
    S: 'stairs',
  },
  grid: [
    sky(24),
    sky(24),
    sky(24),
    sky(4) + 'BBBBBBBBBBBBBBBB' + sky(4),
    sky(4) + 'B..............B' + sky(4),
    sky(4) + 'B.,....C.....,.B' + sky(4),
    sky(4) + 'B..............B' + sky(4),
    sky(4) + 'B..T.~~~~~~....B' + sky(4),
    sky(4) + 'B.,..........,.B' + sky(4),
    sky(4) + 'B..............B' + sky(4),
    sky(4) + 'BBBBBBBSSBBBBBBB' + sky(4),
    sky(24),
    sky(24),
    sky(24),
    sky(24),
  ],
  // The platform is short so the chest is on screen from the top of the stairs.
  spawns: { entry: [11, 8, 'up'], title: [11, 7, 'down'] },
  objects: [
    { kind: 'trigger', id: 'arrive', x: 9, y: 8, w: 6, h: 2, knot: 'tower_arrive', when: '!tower_seen' },
    { kind: 'spot', id: 'chest', x: 11, y: 5, knot: 'tower_chest', glow: '!chest_open' },
    { kind: 'tile', id: 'chestOpen', x: 11, y: 5, tile: 'chestOpen', when: 'chest_open' },
    { kind: 'spot', id: 'telescope', x: 7, y: 7, knot: 'tower_telescope' },
    { kind: 'spot', id: 'wall', x: 15, y: 3, w: 4, knot: 'tower_wall' },
    { kind: 'npc', id: 'g', char: 'figure', x: 13, y: 9, facing: 'up', knot: 'tower_g', when: 'g_here' },
    // Warm torches and a big moon; once the chest is open, the fireworks wash the tower in colour.
    { kind: 'light', id: 'torchL', x: 5.5, y: 4.5, radius: 140, color: 0xffa860, intensity: 1.1, flicker: true },
    { kind: 'light', id: 'torchR', x: 18.5, y: 4.5, radius: 140, color: 0xffa860, intensity: 1.1, flicker: true },
    { kind: 'light', id: 'moon', x: 12, y: 7, radius: 300, color: 0x9aa8ff, intensity: 0.8 },
    { kind: 'light', id: 'fwGold', x: 8, y: 5, radius: 220, color: 0xffc23c, intensity: 1.3, flicker: true, when: 'chest_open' },
    { kind: 'light', id: 'fwPink', x: 16, y: 6, radius: 220, color: 0xff4cc8, intensity: 1.2, flicker: true, when: 'chest_open' },
    { kind: 'light', id: 'fwCyan', x: 12, y: 9, radius: 200, color: 0x3ce8ff, intensity: 1, flicker: true, when: 'chest_open' },
  ],
};
