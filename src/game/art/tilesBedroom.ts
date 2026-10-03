import { TILE as T } from '../constants';
import { dot, rect } from './draw';
import { GOLD, WOOD, planks, wallTop, wallpaper, type TileDef } from './tileKit';

/** Ishu's bedroom (prologue). */
export const BEDROOM_TILES: TileDef[] = [
  { name: 'planks', draw: (c, r) => planks(c, r) },
  {
    name: 'rug',
    // Seamless diamond lattice so any rectangle of rug tiles reads as one rug.
    draw: (c) => {
      rect(c, 0, 0, T, T, '#6d2a3a');
      for (let i = 0; i < T; i++) {
        dot(c, i, i, '#4f1c2a');
        dot(c, T - 1 - i, i, '#4f1c2a');
      }
      rect(c, 15, 15, 2, 2, '#c79a4a');
      rect(c, 0, 0, 1, 1, '#c79a4a');
      dot(c, 15, 4, '#8a3a4a'), dot(c, 15, 27, '#8a3a4a'), dot(c, 4, 15, '#8a3a4a'), dot(c, 27, 15, '#8a3a4a');
    },
  },
  { name: 'roomTop', solid: true, draw: (c) => wallTop(c, '#3b2f3f') },
  { name: 'wallpaper', solid: true, draw: (c) => wallpaper(c) },
  {
    name: 'roomWindow', solid: true,
    draw: (c) => {
      wallpaper(c);
      rect(c, 6, 3, 20, 20, '#f0e6d6');
      rect(c, 8, 5, 16, 16, '#16223f');
      rect(c, 15, 5, 2, 16, '#f0e6d6');
      dot(c, 20, 8, '#fff7d6'), dot(c, 21, 8, '#fff7d6'), dot(c, 20, 9, '#fff7d6'); // moon
      dot(c, 10, 10, '#c8d4ff');
      rect(c, 3, 2, 4, 22, '#7a2335');
      rect(c, 25, 2, 4, 22, '#7a2335');
    },
  },
  {
    name: 'merchShelf', solid: true,
    draw: (c) => {
      wallpaper(c);
      rect(c, 2, 10, 28, 2, WOOD);
      rect(c, 2, 21, 28, 2, WOOD);
      // tiny figures (red/gold, black robe, blue) and a snitch
      rect(c, 4, 5, 3, 5, '#8f1d2c'), rect(c, 4, 3, 3, 2, '#f1cfae');
      rect(c, 10, 5, 3, 5, '#1d1b22'), rect(c, 10, 3, 3, 2, '#c4471c');
      rect(c, 16, 4, 3, 6, '#5b5e8c'), rect(c, 16, 2, 3, 2, '#e8e8e8');
      rect(c, 23, 6, 3, 3, GOLD), dot(c, 22, 6, '#fff'), dot(c, 26, 6, '#fff');
      rect(c, 5, 15, 8, 6, '#6a3a7a'), rect(c, 16, 14, 9, 7, '#8f1d2c'), rect(c, 18, 16, 5, 2, GOLD);
    },
  },
  {
    name: 'wandRack', solid: true,
    draw: (c) => {
      wallpaper(c);
      rect(c, 3, 4, 26, 19, '#4a2e18');
      rect(c, 4, 5, 24, 17, '#2a1a10');
      const woods = ['#c9a27a', '#6b4528', '#e5d3b3', '#3a2312', '#a7784e'];
      for (let i = 0; i < 5; i++) rect(c, 6 + i * 5, 6, 2, 15, woods[i]), dot(c, 6 + i * 5, 6, '#d9d2c5');
    },
  },
  {
    name: 'framedLetter', solid: true,
    draw: (c) => {
      wallpaper(c);
      rect(c, 6, 2, 20, 22, GOLD);
      rect(c, 8, 4, 16, 18, '#efe2c2');
      for (let y = 7; y < 18; y += 3) rect(c, 10, y, 12, 1, '#8a7a5a');
      rect(c, 14, 18, 4, 3, '#a3202e');
    },
  },
  {
    name: 'mirror', solid: true,
    draw: (c) => {
      wallpaper(c);
      rect(c, 10, 2, 12, 22, '#b89a5a');
      rect(c, 12, 4, 8, 18, '#a9c3cf');
      rect(c, 13, 5, 2, 8, '#d9eef5');
    },
  },
  {
    name: 'bedHead', solid: true,
    draw: (c, r) => {
      planks(c, r);
      rect(c, 2, 0, 28, 32, '#4a2e18');
      rect(c, 4, 4, 24, 10, '#f3efe6');
      rect(c, 4, 14, 24, 18, '#8f1d2c');
      rect(c, 4, 14, 24, 2, GOLD);
    },
  },
  {
    name: 'bedFoot', solid: true,
    draw: (c, r) => {
      planks(c, r);
      rect(c, 2, 0, 28, 28, '#4a2e18');
      rect(c, 4, 0, 24, 26, '#8f1d2c');
      rect(c, 4, 12, 24, 3, GOLD);
      rect(c, 13, 17, 6, 6, GOLD), rect(c, 14, 18, 4, 4, '#8f1d2c');
    },
  },
  {
    name: 'desk', solid: true,
    draw: (c, r) => {
      planks(c, r);
      rect(c, 0, 8, 32, 18, WOOD);
      rect(c, 0, 8, 32, 3, '#8a5a34');
      rect(c, 2, 26, 3, 5, WOOD), rect(c, 27, 26, 3, 5, WOOD);
      rect(c, 4, 0, 10, 4, '#6b1d24'), rect(c, 5, 4, 9, 4, '#1f3d5a'), rect(c, 3, 4, 2, 4, '#e8e0cc'); // law books
      rect(c, 20, 2, 8, 6, '#f5f0e0'), rect(c, 21, 3, 6, 1, '#9a9080'), rect(c, 21, 5, 5, 1, '#9a9080');
    },
  },
  {
    name: 'chairTee', solid: true,
    draw: (c, r) => {
      planks(c, r);
      rect(c, 8, 4, 16, 14, WOOD);
      rect(c, 8, 18, 16, 6, '#8a5a34');
      rect(c, 9, 20, 2, 10, WOOD), rect(c, 21, 20, 2, 10, WOOD);
      rect(c, 9, 6, 14, 12, '#8f1d2c'), rect(c, 6, 6, 3, 5, '#8f1d2c'), rect(c, 23, 6, 3, 5, '#8f1d2c');
      rect(c, 14, 9, 4, 4, GOLD);
    },
  },
  {
    name: 'plant', solid: true,
    draw: (c, r) => {
      planks(c, r);
      rect(c, 10, 20, 12, 10, '#9a5a3a');
      rect(c, 9, 19, 14, 2, '#b06a45');
      for (let i = 0; i < 14; i++) rect(c, 8 + Math.floor(r() * 14), 4 + Math.floor(r() * 15), 3, 3, i % 2 ? '#3f8a4a' : '#2f6a3a');
    },
  },
];
