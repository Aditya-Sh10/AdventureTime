import { TILE as T } from '../constants';
import { dot, rect, rng, shade, type Ctx } from './draw';
import { GOLD, WOOD, stoneFloor, type TileDef } from './tileKit';

/** Chapter 1b: the Library + Restricted Section. */

const DARK_STONE = '#33303f';

function books(c: Ctx, r: () => number, colors: string[]) {
  for (let row = 0; row < 3; row++) {
    const y = 2 + row * 10;
    rect(c, 2, y, 28, 8, '#2a1a10');
    for (let x = 3; x < 29; ) {
      const w = 2 + Math.floor(r() * 3);
      rect(c, x, y + 1 + Math.floor(r() * 2), w, 7, colors[Math.floor(r() * colors.length)]);
      x += w + (r() < 0.2 ? 1 : 0);
    }
  }
}

export const LIBRARY_TILES: TileDef[] = [
  {
    // Restricted Section floor: same stone, colder and darker.
    name: 'darkStone',
    draw: (c, r) => {
      stoneFloor(c, r);
      c.globalAlpha = 0.45;
      rect(c, 0, 0, T, T, DARK_STONE);
      c.globalAlpha = 1;
    },
  },
  {
    name: 'chainShelf', solid: true,
    draw: (c, r) => {
      rect(c, 0, 0, T, T, shade(WOOD, -0.25));
      books(c, r, ['#3a1f2a', '#1f2a3a', '#2a3a2a', '#4a3a1a', '#1a1a1a']);
      for (let x = 0; x < T; x += 3) dot(c, x, 8 + (x % 2), '#9a9aa8'), dot(c, x + 1, 20 - (x % 2), '#9a9aa8');
      rect(c, 13, 12, 6, 6, '#7a7a88'); // padlock
      rect(c, 15, 14, 2, 2, '#2a2a30');
    },
  },
  {
    // Two-tile reading table (left / right halves), candle on the left half.
    name: 'tableL', solid: true,
    draw: (c, r) => {
      stoneFloor(c, r);
      rect(c, 0, 8, T, 16, '#5a3a22');
      rect(c, 0, 8, T, 3, '#7a5232');
      rect(c, 2, 24, 3, 7, '#4a2e18');
      rect(c, 12, 2, 4, 8, '#efe2c2'), rect(c, 13, 0, 2, 2, '#f7b733'); // candle
      rect(c, 20, 13, 9, 6, '#efe2c2'), rect(c, 24, 13, 1, 6, '#b8a888'); // open book
    },
  },
  {
    name: 'tableR', solid: true,
    draw: (c, r) => {
      stoneFloor(c, r);
      rect(c, 0, 8, T, 16, '#5a3a22');
      rect(c, 0, 8, T, 3, '#7a5232');
      rect(c, 27, 24, 3, 7, '#4a2e18');
      rect(c, 4, 13, 8, 5, '#6a3a7a'), rect(c, 6, 11, 8, 4, '#2a4f8e'); // stacked books
      rect(c, 18, 12, 6, 7, '#d8ccb0'), dot(c, 22, 10, '#e8e0d0'); // quill + parchment
    },
  },
  {
    name: 'lectern', solid: true,
    draw: (c, r) => {
      stoneFloor(c, r);
      c.globalAlpha = 0.45;
      rect(c, 0, 0, T, T, DARK_STONE);
      c.globalAlpha = 1;
      rect(c, 13, 14, 6, 14, WOOD);
      rect(c, 9, 27, 14, 3, shade(WOOD, -0.2));
      rect(c, 6, 6, 20, 9, '#7a5232');
      rect(c, 8, 4, 16, 7, '#efe2c2'); // blank parchment
      dot(c, 23, 5, GOLD);
    },
  },
  {
    name: 'pinceDesk', solid: true,
    draw: (c, r) => {
      stoneFloor(c, r);
      rect(c, 0, 10, T, 18, '#4a2e18');
      rect(c, 0, 10, T, 3, '#6b4528');
      rect(c, 3, 2, 8, 9, '#8e2a2a'), rect(c, 4, 0, 7, 3, '#2f7a45'); // returned-books pile
      rect(c, 18, 5, 8, 6, '#c9b48a');
      const pr = rng(77);
      for (let i = 0; i < 3; i++) rect(c, 19, 6 + i * 2, 4 + Math.floor(pr() * 3), 1, '#6a5a3a'); // overdue list
      rect(c, 14, 16, 4, 4, GOLD); // bell
    },
  },
];
