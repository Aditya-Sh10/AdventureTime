import { TILE as T } from '../constants';
import { dot, rect, shade, speckle, type Ctx } from './draw';
import type { TileDef } from './tileKit';

/** Chapter 2: the Forbidden Forest. Drawn mid-bright on purpose — the lantern + near-black ambient make it night. */

const GRASS = '#3f6a3a';
const PATH = '#7a6446';
const LEAF = '#2c5233';
const BARK = '#4a3424';
const WATER = '#2a4a6a';

function grass(c: Ctx, r: () => number, base = GRASS) {
  rect(c, 0, 0, T, T, base);
  speckle(c, r, 0, 0, T, T, [shade(base, 0.05), shade(base, -0.05)], 40);
  for (let i = 0; i < 6; i++) {
    const x = 2 + Math.floor(r() * 28);
    const y = 3 + Math.floor(r() * 26);
    dot(c, x, y, shade(base, 0.12)), dot(c, x + 1, y - 1, shade(base, 0.12)), dot(c, x + 2, y, shade(base, 0.12));
  }
}

/** Round canopy blob (top-down tree crown), shaded from the upper left. */
function crown(c: Ctx, cx: number, cy: number, rad: number) {
  for (let y = -rad; y <= rad; y++) {
    for (let x = -rad; x <= rad; x++) {
      const d = x * x + y * y;
      if (d > rad * rad) continue;
      const lit = x + y < -rad * 0.4;
      const dark = x + y > rad * 0.6 || d > (rad - 1) * (rad - 1);
      dot(c, cx + x, cy + y, dark ? shade(LEAF, -0.08) : lit ? shade(LEAF, 0.08) : LEAF);
    }
  }
  for (let i = 0; i < 5; i++) dot(c, cx - rad / 2 + i * 2, cy - rad / 2 + (i % 2), shade(LEAF, 0.14));
}

export const FOREST_TILES: TileDef[] = [
  { name: 'grass', draw: (c, r) => grass(c, r) },
  {
    name: 'grass2',
    draw: (c, r) => {
      grass(c, r);
      for (const [x, y] of [[6, 10], [20, 22], [24, 7]]) {
        rect(c, x, y, 1, 4, shade(GRASS, 0.15)), rect(c, x + 2, y - 1, 1, 5, shade(GRASS, 0.1)), rect(c, x + 4, y + 1, 1, 3, shade(GRASS, 0.15));
      }
    },
  },
  {
    name: 'path',
    draw: (c, r) => {
      rect(c, 0, 0, T, T, PATH);
      speckle(c, r, 0, 0, T, T, [shade(PATH, 0.06), shade(PATH, -0.07), '#8a7456'], 50);
      for (let i = 0; i < 3; i++) rect(c, Math.floor(r() * 28), Math.floor(r() * 28), 3, 2, shade(PATH, -0.12)); // pebbles
    },
  },
  {
    // Dense canopy: the forest's walls.
    name: 'canopy', solid: true,
    draw: (c) => {
      rect(c, 0, 0, T, T, shade(LEAF, -0.16));
      crown(c, 8, 9, 9), crown(c, 24, 7, 8), crown(c, 16, 22, 10), crown(c, 2, 26, 6), crown(c, 30, 24, 6);
    },
  },
  {
    // Lone tree: crown over a visible trunk, on grass.
    name: 'tree', solid: true,
    draw: (c, r) => {
      grass(c, r);
      rect(c, 6, 27, 20, 4, 'rgba(0,0,0,0.25)');
      rect(c, 13, 18, 6, 11, BARK);
      rect(c, 13, 18, 2, 11, shade(BARK, 0.08));
      rect(c, 11, 28, 3, 2, BARK), rect(c, 18, 28, 3, 2, BARK);
      crown(c, 16, 11, 11);
    },
  },
  {
    name: 'roots',
    draw: (c, r) => {
      grass(c, r, shade(GRASS, -0.04));
      for (const [x, y, w] of [[2, 8, 12], [16, 20, 13], [6, 26, 9]]) {
        rect(c, x, y, w, 2, BARK), rect(c, x, y, w, 1, shade(BARK, 0.1));
        rect(c, x + w - 2, y - 2, 2, 2, BARK);
      }
    },
  },
  {
    // Glowing mushrooms: decoration that reads as "light source" even in the dark.
    name: 'mushrooms',
    draw: (c, r) => {
      grass(c, r);
      for (const [x, y] of [[8, 12], [18, 18], [23, 9]]) {
        rect(c, x + 1, y + 3, 2, 4, '#d8d0c0');
        rect(c, x - 1, y, 6, 3, '#6ad8c8');
        dot(c, x, y, '#b8fff0'), dot(c, x + 3, y + 1, '#b8fff0');
      }
    },
  },
  {
    name: 'water', solid: true,
    draw: (c, r) => {
      rect(c, 0, 0, T, T, WATER);
      speckle(c, r, 0, 0, T, T, [shade(WATER, 0.05), shade(WATER, -0.05)], 30);
      for (const [x, y] of [[4, 8], [18, 14], [8, 24]]) rect(c, x, y, 7, 1, shade(WATER, 0.2));
    },
  },
  {
    name: 'bush', solid: true,
    draw: (c, r) => {
      grass(c, r);
      rect(c, 4, 26, 24, 3, 'rgba(0,0,0,0.25)');
      crown(c, 11, 18, 8), crown(c, 21, 19, 8), crown(c, 16, 13, 7);
      dot(c, 10, 15, '#c83a4a'), dot(c, 20, 17, '#c83a4a'), dot(c, 15, 21, '#c83a4a'); // berries
    },
  },
  {
    name: 'stump', solid: true,
    draw: (c, r) => {
      grass(c, r);
      rect(c, 7, 12, 18, 16, BARK);
      rect(c, 7, 8, 18, 6, '#a88a5a');
      rect(c, 9, 9, 14, 4, '#8a6e44');
      rect(c, 12, 10, 8, 2, '#a88a5a'); // rings
      rect(c, 5, 25, 4, 3, BARK), rect(c, 23, 25, 4, 3, BARK);
    },
  },
  {
    name: 'log', solid: true,
    draw: (c, r) => {
      grass(c, r);
      rect(c, 0, 14, T, 12, BARK);
      rect(c, 0, 14, T, 2, shade(BARK, 0.1));
      rect(c, 0, 24, T, 2, shade(BARK, -0.1));
      for (let x = 3; x < T; x += 9) rect(c, x, 18, 4, 1, shade(BARK, -0.12));
      dot(c, 10, 13, '#6a8a4a'), dot(c, 22, 13, '#6a8a4a'); // moss
    },
  },
  {
    // A Niffler burrow: walkable, inspected with E.
    name: 'burrow',
    draw: (c, r) => {
      grass(c, r);
      rect(c, 7, 13, 18, 10, '#5a4632');
      rect(c, 10, 15, 12, 6, '#1a120c');
      rect(c, 8, 12, 16, 2, '#6e5840');
      speckle(c, r, 4, 22, 24, 5, ['#6e5840', '#5a4632'], 12);
    },
  },
  {
    name: 'ferns',
    draw: (c, r) => {
      grass(c, r);
      for (const [x, y] of [[6, 20], [20, 12], [14, 27]]) {
        for (let i = 0; i < 5; i++) dot(c, x - i, y - i, '#5a9a4a'), dot(c, x + i, y - i, '#5a9a4a');
        rect(c, x, y - 6, 1, 7, '#4a8a3a');
      }
    },
  },
];
