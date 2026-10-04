import { dot, frame, makeCanvas, rect } from './draw';

/** Owl, 2 frames (16x16 each): perched / tapping. */
export function owlSheet() {
  const { c, ctx } = makeCanvas(32, 16);
  for (let f = 0; f < 2; f++) {
    const x = f * 16;
    const lean = f ? 1 : 0;
    rect(ctx, x + 4 - lean, 4, 8, 10, '#8a6a4a');
    rect(ctx, x + 5 - lean, 6, 6, 7, '#c9ab86');
    rect(ctx, x + 4 - lean, 3, 8, 3, '#8a6a4a');
    dot(ctx, x + 6 - lean, 5, '#f7d046'), dot(ctx, x + 9 - lean, 5, '#f7d046');
    dot(ctx, x + 7 - lean, 7, '#e8a13a');
    rect(ctx, x + 5, 14, 2, 1, '#e8a13a'), rect(ctx, x + 9, 14, 2, 1, '#e8a13a');
    rect(ctx, x + 11 - lean, 8, 2, 4, '#6d5238'); // letter tucked under wing
    rect(ctx, x + 12 - lean, 9, 3, 2, '#efe2c2');
  }
  return c;
}

/** Restricted Section gate: iron bars + lock plate, 32x32 (drawn over floor, so transparent gaps). */
export function gateCanvas() {
  const { c, ctx } = makeCanvas(32, 32);
  rect(ctx, 0, 2, 32, 3, '#4a4a58');
  rect(ctx, 0, 27, 32, 3, '#4a4a58');
  for (let x = 2; x < 32; x += 5) rect(ctx, x, 0, 2, 32, '#6a6a7a'), dot(ctx, x, 0, '#9a9aaa');
  rect(ctx, 11, 12, 10, 9, '#8a6a2a');
  frame(ctx, 11, 12, 10, 9, '#d9a93f');
  rect(ctx, 15, 15, 2, 3, '#1a1a1a');
  return c;
}

/**
 * Lit brass lantern sitting on the forest stump. 16x32 with the lantern in the top half, so the default prop
 * placement (centre 18px into the tile) seats it on the stump's top face.
 */
export function lanternCanvas() {
  const { c, ctx } = makeCanvas(16, 32);
  rect(ctx, 6, 0, 4, 2, '#8a6a2a');
  rect(ctx, 4, 2, 8, 2, '#c79a4a');
  rect(ctx, 4, 4, 8, 8, '#3a2a1a');
  rect(ctx, 5, 5, 6, 6, '#f7b733');
  rect(ctx, 7, 6, 2, 4, '#fff2b0');
  rect(ctx, 3, 12, 10, 2, '#c79a4a');
  rect(ctx, 9, 3, 4, 3, '#efe2c2'); // G.'s note tied to the handle
  return c;
}

/** Soft radial glow, used for "interactable/important" pulses. */
export function glowCanvas() {
  const { c, ctx } = makeCanvas(48, 48);
  const g = ctx.createRadialGradient(24, 24, 2, 24, 24, 24);
  g.addColorStop(0, 'rgba(255,236,160,0.9)');
  g.addColorStop(1, 'rgba(255,236,160,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 48, 48);
  return c;
}

/** 4x4 sparkle for particles. */
export function sparkCanvas() {
  const { c, ctx } = makeCanvas(4, 4);
  rect(ctx, 1, 0, 2, 4, '#fff6c8');
  rect(ctx, 0, 1, 4, 2, '#fff6c8');
  return c;
}

type IconDraw = (ctx: CanvasRenderingContext2D) => void;
const ICONS: Record<string, IconDraw> = {
  letter: (ctx) => {
    rect(ctx, 1, 4, 14, 9, '#efe2c2');
    frame(ctx, 1, 4, 14, 9, '#a8946a');
    for (let i = 0; i < 6; i++) dot(ctx, 2 + i, 5 + i, '#a8946a'), dot(ctx, 13 - i, 5 + i, '#a8946a');
    rect(ctx, 7, 9, 3, 3, '#a3202e');
  },
  contract: (ctx) => {
    rect(ctx, 3, 2, 10, 12, '#efe2c2');
    rect(ctx, 2, 1, 12, 2, '#c9b48a');
    rect(ctx, 2, 13, 12, 2, '#c9b48a');
    for (let y = 5; y < 12; y += 2) rect(ctx, 5, y, 6, 1, '#6a5a3a');
    rect(ctx, 9, 11, 3, 2, '#3a2a6a');
  },
  map: (ctx) => {
    rect(ctx, 1, 3, 14, 11, '#e6d6b0');
    rect(ctx, 1, 3, 2, 11, '#c9b48a'), rect(ctx, 13, 3, 2, 11, '#c9b48a');
    for (let i = 0; i < 4; i++) dot(ctx, 4 + i * 2, 6 + (i % 2) * 2, '#6a3a2a'); // dotted path
    rect(ctx, 11, 9, 2, 2, '#a3202e'); // you are here
    dot(ctx, 5, 11, '#3a2a6a'), dot(ctx, 6, 12, '#3a2a6a');
  },
  frogCard: (ctx) => {
    rect(ctx, 3, 1, 10, 14, '#c79a4a');
    rect(ctx, 4, 2, 8, 9, '#3a2a5a');
    rect(ctx, 6, 3, 4, 3, '#e9dccb');
    rect(ctx, 6, 6, 4, 4, '#d8d8e0'); // a beard of great wisdom
    rect(ctx, 5, 12, 6, 2, '#efe2c2');
  },
  lantern: (ctx) => {
    rect(ctx, 6, 1, 4, 2, '#8a6a2a');
    rect(ctx, 4, 3, 8, 2, '#c79a4a');
    rect(ctx, 4, 5, 8, 7, '#3a2a1a');
    rect(ctx, 5, 6, 6, 5, '#f7b733');
    rect(ctx, 7, 7, 2, 3, '#fff2b0');
    rect(ctx, 3, 12, 10, 2, '#c79a4a');
  },
  coin4: (ctx) => {
    rect(ctx, 3, 2, 10, 12, '#d9a93f');
    rect(ctx, 2, 4, 12, 8, '#d9a93f');
    frame(ctx, 3, 3, 10, 10, '#a8781f');
    rect(ctx, 6, 5, 1, 4, '#6a4a10'), rect(ctx, 6, 8, 4, 1, '#6a4a10'), rect(ctx, 9, 5, 1, 6, '#6a4a10'); // "4"
  },
  receipt: (ctx) => {
    rect(ctx, 4, 1, 8, 14, '#f1ead8');
    for (let x = 4; x < 12; x += 2) dot(ctx, x, 14, '#c9b48a'); // torn edge
    for (let y = 3; y < 10; y += 2) rect(ctx, 5, y, 5, 1, '#8a7a5a');
    rect(ctx, 6, 10, 5, 3, '#a3202e'); // "APPROVED"-style stamp
    dot(ctx, 7, 11, '#f1ead8'), dot(ctx, 9, 11, '#f1ead8');
  },
  stool: (ctx) => {
    rect(ctx, 2, 4, 12, 3, '#9a6a3a');
    rect(ctx, 2, 4, 12, 1, '#c08a52');
    rect(ctx, 3, 7, 2, 7, '#6b4528'), rect(ctx, 11, 7, 2, 7, '#6b4528');
    rect(ctx, 5, 10, 6, 1, '#6b4528');
  },
  case1: (ctx) => {
    rect(ctx, 2, 2, 12, 12, '#7a2a2a');
    rect(ctx, 2, 2, 12, 2, '#9a3a3a');
    rect(ctx, 4, 6, 8, 6, '#efe2c2');
    rect(ctx, 7, 7, 2, 4, '#3a2a1a'), dot(ctx, 6, 8, '#3a2a1a'); // "1"
    rect(ctx, 12, 1, 2, 4, '#d9a93f'); // gold ribbon
  },
};

const iconCache = new Map<string, string>();
export function iconURL(id: string) {
  const hit = iconCache.get(id);
  if (hit) return hit;
  const { c, ctx } = makeCanvas(16, 16);
  (ICONS[id] ?? ICONS.letter)(ctx);
  const url = c.toDataURL();
  iconCache.set(id, url);
  return url;
}
