import type { MapDef } from './types';

/**
 * Chapter 1b: the Library. Four glowing numbered books spell the Restricted Section password (ISHU);
 * behind the gate, a lectern holds the self-inking Map + Contract clause 2.
 */
export const library: MapDef = {
  id: 'library',
  name: 'The Library',
  chapter: 'ch1',
  music: 'hogwarts',
  ambience: 'library',
  ambient: 0x6a6490,
  grid: [
    '######################',
    '#XXXXBBBtBBBBBBtBBBOO#',
    '#qqqqB...............#',
    '#qLqqB.BBB.BBB..TU...#',
    '#qqqqB...............#',
    '#qqqqB.BBB.BBB..TU.J.#',
    '#qqqq........,.......E',
    '#qqqqB.BBB.BBB..TU...#',
    '#qqqqB...............#',
    '#XqqqB.BBB.BBB.......#',
    '#qqqqB...............#',
    '######################',
  ],
  spawns: { entry: [20, 6, 'left'], restricted: [4, 6, 'left'], title: [11, 6, 'down'] },
  objects: [
    { kind: 'trigger', id: 'arrive', x: 18, y: 5, w: 2, h: 3, knot: 'library_arrive', when: '!library_seen' },
    { kind: 'trigger', id: 'exit', x: 21, y: 6, knot: 'library_exit' },
    { kind: 'npc', id: 'pince', char: 'pince', x: 19, y: 4, facing: 'down', knot: 'pince' },
    { kind: 'spot', id: 'pinceDesk', x: 19, y: 5, knot: 'pince_desk' },
    // The four glowing books: shelf number = letter order.
    { kind: 'spot', id: 'book1', x: 8, y: 3, knot: 'book_1', glow: 'library_seen && !book1' },
    { kind: 'spot', id: 'book2', x: 12, y: 5, knot: 'book_2', glow: 'library_seen && !book2' },
    { kind: 'spot', id: 'book3', x: 8, y: 9, knot: 'book_3', glow: 'library_seen && !book3' },
    { kind: 'spot', id: 'book4', x: 17, y: 1, knot: 'book_4', glow: 'library_seen && !book4' },
    // Flavour shelves / tables.
    { kind: 'spot', id: 'shelfA', x: 11, y: 3, w: 3, knot: 'shelf_law' },
    { kind: 'spot', id: 'shelfB', x: 7, y: 7, w: 3, knot: 'shelf_romance' },
    { kind: 'spot', id: 'shelfC', x: 11, y: 9, w: 3, knot: 'shelf_snape' },
    { kind: 'spot', id: 'table', x: 16, y: 7, w: 2, knot: 'reading_table' },
    { kind: 'spot', id: 'window', x: 19, y: 1, w: 2, knot: 'library_window' },
    // Restricted Section.
    { kind: 'prop', id: 'gate', x: 5, y: 6, sprite: 'gate', solid: true, when: '!restricted_open' },
    { kind: 'spot', id: 'gateLock', x: 5, y: 6, knot: 'restricted_gate', when: '!restricted_open', glow: 'books>=4' },
    { kind: 'spot', id: 'lectern', x: 2, y: 3, knot: 'restricted_lectern', glow: 'restricted_open && !got_map' },
    { kind: 'spot', id: 'chained', x: 1, y: 9, knot: 'chained_book' },
    { kind: 'light', id: 't1', x: 8, y: 1.4, radius: 140, color: 0xffa860, intensity: 1.2, flicker: true },
    { kind: 'light', id: 't2', x: 15, y: 1.4, radius: 140, color: 0xffa860, intensity: 1.2, flicker: true },
    { kind: 'light', id: 'c1', x: 16, y: 3, radius: 70, color: 0xffd28a, intensity: 1, flicker: true },
    { kind: 'light', id: 'c2', x: 16, y: 5, radius: 70, color: 0xffd28a, intensity: 1, flicker: true },
    { kind: 'light', id: 'c3', x: 16, y: 7, radius: 70, color: 0xffd28a, intensity: 1, flicker: true },
    // Floating candles over the aisles: dark enough to feel late, bright enough to read every spine.
    { kind: 'light', id: 'a1', x: 10, y: 4, radius: 130, color: 0xffd28a, intensity: 0.9, flicker: true },
    { kind: 'light', id: 'a2', x: 10, y: 8, radius: 130, color: 0xffd28a, intensity: 0.9, flicker: true },
    { kind: 'light', id: 'a3', x: 6.5, y: 6, radius: 110, color: 0xffd28a, intensity: 0.7, flicker: true },
    { kind: 'light', id: 'a4', x: 14.5, y: 6, radius: 110, color: 0xffd28a, intensity: 0.7, flicker: true },
    { kind: 'light', id: 'win', x: 19.5, y: 2, radius: 110, color: 0x8fa8ff, intensity: 0.8 },
    { kind: 'light', id: 'restricted', x: 2.5, y: 5, radius: 120, color: 0x7a6cff, intensity: 0.7, flicker: true },
    { kind: 'light', id: 'mapGlow', x: 2, y: 3, radius: 70, color: 0xffe08a, intensity: 1.1, when: 'restricted_open && !got_map' },
  ],
};
