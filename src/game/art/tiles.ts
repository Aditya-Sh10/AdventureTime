import { TILE as T } from '../constants';
import { dot, frame, makeCanvas, rect, rng, shade, speckle, type Ctx } from './draw';

/** Code-drawn demo tileset. Order = tile index. `solid` drives collision. Replace with real sheet, keep names. */
interface TileDef {
  name: string;
  solid?: boolean;
  draw: (ctx: Ctx, r: () => number) => void;
}

const STONE = '#4a4658';
const MORTAR = '#3a3747';
const BRICK = '#5d5668';
const WOOD = '#6b4528';
const PLANK = '#8a603f';
const GOLD = '#d9a93f';
const WALLPAPER = '#c9b49b';

function stoneFloor(ctx: Ctx, r: () => number, alt = false) {
  rect(ctx, 0, 0, T, T, STONE);
  rect(ctx, 0, 15, T, 1, MORTAR);
  rect(ctx, 0, 31, T, 1, MORTAR);
  rect(ctx, 15, 0, 1, 15, MORTAR);
  rect(ctx, 7, 16, 1, 15, MORTAR);
  rect(ctx, 23, 16, 1, 15, MORTAR);
  speckle(ctx, r, 0, 0, T, T, ['#53506a', '#423f52'], 26);
  if (alt) {
    dot(ctx, 20, 5, MORTAR), dot(ctx, 21, 6, MORTAR), dot(ctx, 22, 6, MORTAR), dot(ctx, 23, 7, MORTAR);
  }
}

function bricks(ctx: Ctx, r: () => number, base = BRICK) {
  rect(ctx, 0, 0, T, T, base);
  for (let row = 0; row < 4; row++) {
    const y = row * 8;
    rect(ctx, 0, y + 7, T, 1, MORTAR);
    const off = row % 2 ? 8 : 0;
    for (let x = off; x < T; x += 16) rect(ctx, x, y, 1, 7, MORTAR);
    rect(ctx, 0, y, T, 1, shade(base, 0.05));
  }
  speckle(ctx, r, 0, 0, T, T, [shade(base, -0.05), shade(base, 0.04)], 20);
  rect(ctx, 0, 29, T, 3, shade(base, -0.12)); // base shadow for depth
}

function wallTop(ctx: Ctx, base: string) {
  rect(ctx, 0, 0, T, T, base);
  speckle(ctx, rng(base.length * 97), 0, 0, T, T, [shade(base, 0.03), shade(base, -0.03)], 30);
}

function wallpaper(ctx: Ctx) {
  rect(ctx, 0, 0, T, T, WALLPAPER);
  for (let x = 3; x < T; x += 8) rect(ctx, x, 0, 2, 26, shade(WALLPAPER, -0.04));
  rect(ctx, 0, 26, T, 6, '#7a5a3e');
  rect(ctx, 0, 26, T, 1, '#9a7552');
}

/** Horizontal floorboards: slight per-board tone, dark gaps, occasional butt joint, grain streaks. */
function planks(ctx: Ctx, _r?: () => number) {
  const pr = rng(4242); // fixed so every planks tile matches and boards line up across tiles
  for (let y = 0; y < T; y += 8) {
    const tone = shade(PLANK, (pr() - 0.5) * 0.08);
    rect(ctx, 0, y, T, 7, tone);
    rect(ctx, 0, y, T, 1, shade(tone, 0.05));
    rect(ctx, 0, y + 7, T, 1, shade(PLANK, -0.2));
    if (pr() < 0.5) rect(ctx, 4 + Math.floor(pr() * 24), y, 1, 7, shade(PLANK, -0.2));
    for (let i = 0; i < 3; i++) rect(ctx, Math.floor(pr() * 26), y + 2 + Math.floor(pr() * 4), 3 + Math.floor(pr() * 6), 1, shade(tone, -0.06));
  }
}

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

const TILES: TileDef[] = [
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
  // --- bedroom ---
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
