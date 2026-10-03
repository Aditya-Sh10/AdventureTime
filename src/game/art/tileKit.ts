import { TILE as T } from '../constants';
import { dot, rect, rng, shade, speckle, type Ctx } from './draw';

/** Shared palette + base surfaces for the code-drawn tilesets (tiles*.ts). */
export interface TileDef {
  name: string;
  solid?: boolean;
  draw: (ctx: Ctx, r: () => number) => void;
}

export const STONE = '#4a4658';
export const MORTAR = '#3a3747';
export const BRICK = '#5d5668';
export const WOOD = '#6b4528';
export const PLANK = '#8a603f';
export const GOLD = '#d9a93f';
export const WALLPAPER = '#c9b49b';

export function stoneFloor(ctx: Ctx, r: () => number, alt = false) {
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

export function bricks(ctx: Ctx, r: () => number, base = BRICK) {
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

export function wallTop(ctx: Ctx, base: string) {
  rect(ctx, 0, 0, T, T, base);
  speckle(ctx, rng(base.length * 97), 0, 0, T, T, [shade(base, 0.03), shade(base, -0.03)], 30);
}

export function wallpaper(ctx: Ctx) {
  rect(ctx, 0, 0, T, T, WALLPAPER);
  for (let x = 3; x < T; x += 8) rect(ctx, x, 0, 2, 26, shade(WALLPAPER, -0.04));
  rect(ctx, 0, 26, T, 6, '#7a5a3e');
  rect(ctx, 0, 26, T, 1, '#9a7552');
}

/** Horizontal floorboards: slight per-board tone, dark gaps, occasional butt joint, grain streaks. */
export function planks(ctx: Ctx, _r?: () => number) {
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

