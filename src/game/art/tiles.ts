import { TILE as T } from '../constants';
import { dot, frame, makeCanvas, rect, rng, shade, type Ctx } from './draw';
import { GOLD, WOOD, bricks, stoneFloor, wallTop, type TileDef } from './tileKit';
import { BEDROOM_TILES } from './tilesBedroom';
import { FOREST_TILES } from './tilesForest';
import { LIBRARY_TILES } from './tilesLibrary';

/** Code-drawn demo tileset. Order = tile index. `solid` drives collision. Replace with real sheet, keep names. */

function banner(ctx: Ctx, r: () => number, color: string, trim: string) {
  bricks(ctx, r);
  rect(ctx, 8, 0, 16, 24, color);
  rect(ctx, 8, 0, 16, 2, trim);
  rect(ctx, 8, 24, 6, 3, color);
  rect(ctx, 18, 24, 6, 3, color);
  rect(ctx, 13, 8, 6, 8, trim);
  rect(ctx, 14, 9, 4, 6, color);
  dot(ctx, 15, 11, trim), dot(ctx, 16, 12, trim);
}

const CASTLE_TILES: TileDef[] = [
  { name: 'stone', draw: (c, r) => stoneFloor(c, r) },
  { name: 'stone2', draw: (c, r) => stoneFloor(c, r, true) },
  { name: 'carpetL', draw: (c) => (rect(c, 0, 0, T, T, '#7c1f2d'), rect(c, 0, 0, 3, T, GOLD), rect(c, 5, 0, 1, T, '#9b3040')) },
  { name: 'carpetR', draw: (c) => (rect(c, 0, 0, T, T, '#7c1f2d'), rect(c, 29, 0, 3, T, GOLD), rect(c, 26, 0, 1, T, '#9b3040')) },
  { name: 'wallTop', solid: true, draw: (c) => wallTop(c, '#26232f') },
  { name: 'wall', solid: true, draw: (c, r) => bricks(c, r) },
  {
    name: 'window', solid: true,
    draw: (c, r) => {
      bricks(c, r);
      rect(c, 8, 4, 16, 22, '#3a3340');
      rect(c, 10, 6, 12, 18, '#1b2a4d');
      rect(c, 12, 4, 8, 2, '#3a3340');
      rect(c, 15, 6, 2, 18, '#3a3340');
      rect(c, 10, 14, 12, 1, '#3a3340');
      dot(c, 12, 8, '#e8e6ff'), dot(c, 19, 10, '#c8d4ff'), dot(c, 13, 18, '#e8e6ff');
    },
  },
  {
    name: 'torch', solid: true,
    draw: (c, r) => {
      bricks(c, r);
      rect(c, 14, 14, 4, 7, '#3b2a1c');
      rect(c, 12, 13, 8, 2, '#4c3624');
      rect(c, 13, 6, 6, 7, '#e8742a');
      rect(c, 14, 4, 4, 6, '#f7b733');
      rect(c, 15, 7, 2, 4, '#fff2b0');
    },
  },
  {
    // Same sconce, flame gone: a curl of smoke and a scorch mark (hall after Ch1).
    name: 'torchOut', solid: true,
    draw: (c, r) => {
      bricks(c, r);
      rect(c, 14, 14, 4, 7, '#3b2a1c');
      rect(c, 12, 13, 8, 2, '#4c3624');
      rect(c, 14, 11, 4, 2, '#1e1814');
      rect(c, 13, 3, 6, 6, shade('#5d5668', -0.18));
      dot(c, 16, 8, '#8a8494'), dot(c, 15, 6, '#7a7484'), dot(c, 16, 4, '#6a6474');
    },
  },
  {
    name: 'bookshelf', solid: true,
    draw: (c, r) => {
      rect(c, 0, 0, T, T, WOOD);
      const colors = ['#8e2a2a', '#2a4f8e', '#2f7a45', '#b58a2a', '#6a3a7a', '#cfc2a0'];
      for (let row = 0; row < 3; row++) {
        const y = 2 + row * 10;
        rect(c, 2, y, 28, 8, '#2a1a10');
        for (let x = 3; x < 29; ) {
          const w = 2 + Math.floor(r() * 3);
          rect(c, x, y + 1 + Math.floor(r() * 2), w, 7, colors[Math.floor(r() * colors.length)]);
          x += w + (r() < 0.2 ? 1 : 0);
        }
      }
    },
  },
  { name: 'bannerRed', solid: true, draw: (c, r) => banner(c, r, '#8f1d2c', GOLD) },
  { name: 'bannerBlue', solid: true, draw: (c, r) => banner(c, r, '#1f3d7a', '#b8834a') },
  { name: 'bannerYellow', solid: true, draw: (c, r) => banner(c, r, '#d7a826', '#2a2a2a') },
  { name: 'bannerGreen', solid: true, draw: (c, r) => banner(c, r, '#1f5c3a', '#b8bcc4') },
  {
    name: 'painting', solid: true,
    draw: (c, r) => {
      bricks(c, r);
      rect(c, 5, 3, 22, 22, GOLD);
      rect(c, 7, 5, 18, 18, '#2c3a2e');
      rect(c, 12, 9, 8, 8, '#d9b48f');
      rect(c, 10, 16, 12, 7, '#5a2330');
      frame(c, 5, 3, 22, 22, '#9c7424');
    },
  },
  {
    name: 'door', solid: true,
    draw: (c, r) => {
      bricks(c, r);
      rect(c, 4, 4, 24, 28, '#4a2e18');
      rect(c, 6, 2, 20, 2, '#4a2e18');
      for (let x = 6; x < 28; x += 5) rect(c, x, 5, 1, 27, '#3a2312');
      rect(c, 4, 12, 24, 2, '#2b2b30');
      rect(c, 4, 24, 24, 2, '#2b2b30');
      rect(c, 22, 18, 2, 3, GOLD);
    },
  },
  {
    name: 'arch',
    draw: (c) => {
      rect(c, 0, 0, T, T, '#0d0b12');
      rect(c, 0, 0, T, 4, '#26232f');
      rect(c, 0, 0, 3, T, '#26232f');
      rect(c, 29, 0, 3, T, '#26232f');
    },
  },
  {
    name: 'pillar', solid: true,
    draw: (c, r) => {
      stoneFloor(c, r);
      rect(c, 7, 0, 18, 30, '#77718a');
      rect(c, 7, 0, 4, 30, '#8c86a0');
      rect(c, 21, 0, 4, 30, '#5f5a70');
      rect(c, 5, 26, 22, 5, '#5f5a70');
      rect(c, 5, 0, 22, 3, '#8c86a0');
    },
  },
  {
    name: 'stairs', solid: true,
    draw: (c) => {
      for (let i = 0; i < 8; i++) {
        rect(c, 0, i * 4, T, 4, shade('#5a5570', -i * 0.03));
        rect(c, 0, i * 4 + 3, T, 1, '#2e2b3a');
      }
      rect(c, 0, 0, 2, T, '#3a3747');
    },
  },
  {
    name: 'cauldron', solid: true,
    draw: (c, r) => {
      stoneFloor(c, r);
      rect(c, 6, 12, 20, 16, '#1c1b22');
      rect(c, 4, 10, 24, 4, '#2d2c36');
      rect(c, 7, 10, 18, 3, '#5ce07a');
      dot(c, 11, 8, '#8cf5a0'), dot(c, 18, 6, '#8cf5a0'), dot(c, 15, 9, '#b8ffc4');
      rect(c, 8, 28, 3, 2, '#1c1b22'), rect(c, 21, 28, 3, 2, '#1c1b22');
    },
  },
  {
    name: 'hourglass', solid: true,
    draw: (c, r) => {
      stoneFloor(c, r);
      rect(c, 8, 2, 16, 3, GOLD);
      rect(c, 8, 27, 16, 3, GOLD);
      rect(c, 10, 5, 12, 8, '#cfe4f0');
      rect(c, 13, 13, 6, 4, '#cfe4f0');
      rect(c, 10, 17, 12, 10, '#cfe4f0');
      rect(c, 11, 20, 10, 7, '#b0102a');
      rect(c, 11, 7, 10, 3, '#b0102a');
      dot(c, 16, 15, '#b0102a');
    },
  },
];

const TILES: TileDef[] = [
  ...CASTLE_TILES,
  ...BEDROOM_TILES,
  ...LIBRARY_TILES,
  ...FOREST_TILES,
  { name: 'void', solid: true, draw: (c) => rect(c, 0, 0, T, T, '#07060a') },
];

export const TILE_INDEX: Record<string, number> = Object.fromEntries(TILES.map((t, i) => [t.name, i]));
export const SOLID_TILES = TILES.flatMap((t, i) => (t.solid ? [i] : []));

export function tilesetCanvas() {
  const { c, ctx } = makeCanvas(T * TILES.length, T);
  TILES.forEach((t, i) => {
    ctx.save();
    ctx.translate(i * T, 0);
    ctx.beginPath();
    ctx.rect(0, 0, T, T);
    ctx.clip();
    t.draw(ctx, rng(1000 + i * 7));
    ctx.restore();
  });
  return c;
}
