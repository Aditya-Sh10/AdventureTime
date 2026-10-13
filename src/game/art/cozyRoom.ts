import { makeCanvas, rect, rng, type Ctx } from './draw';

/**
 * Title-screen set: Ishu's window seat at 11:57 PM. 256x144 virtual pixels, scaled up with `pixelated`.
 * Static parts are pre-rendered once (sky, room with a transparent window, vignette); cozyActors.ts draws the
 * moving parts on top each frame. Coordinates here are shared with the hit-tests in ui/CozyScene.tsx.
 */
export const SW = 256;
export const SH = 144;

export const WIN = { x0: 24, x1: 110, y0: 12, y1: 84, cx: 67 } as const;
export const MOON = { x: 92, y: 30, r: 7 } as const;
export const CLOCK = { x: 236, y: 22, r: 9 } as const;
export const LAMP = { x: 128, shadeY: 70 } as const;
export const FLOOR_Y = 112;

const WALL = '#3b2440';
const STRIPE = '#432a49';
const PANEL = '#4a2f2a';
const PANEL_DARK = '#3a241f';
const FLOOR = '#5c3b26';
const FLOOR_LINE = '#4a2f1e';
const FRAME = '#6b4528';
const FRAME_LIGHT = '#8a603f';
const CUSHION = '#9b2f45';
const CUSHION_LIGHT = '#b8435a';
const SEAT = '#5a3a26';

/** Top edge of the arched window at column x (outer frame). */
export function archTop(x: number) {
  const u = (x - WIN.cx) / (WIN.cx - WIN.x0);
  return Math.round(WIN.y0 + 20 * (1 - Math.sqrt(Math.max(0, 1 - u * u))));
}

/** Night sky + castle silhouette, a bit wider than the window so it can drift with the mouse (parallax). */
export function skyCanvas() {
  const { c, ctx } = makeCanvas(SW, SH);
  for (let y = 0; y < WIN.y1; y++) {
    const k = y / WIN.y1;
    const r = Math.round(13 + 26 * k);
    const g = Math.round(18 + 30 * k);
    const b = Math.round(48 + 58 * k);
    rect(ctx, 0, y, SW, 1, `rgb(${r},${g},${b})`);
  }
  // Hogwarts on the horizon: towers, a long hall, the Astronomy Tower tallest of all.
  const CASTLE = '#0a0b1a';
  rect(ctx, 0, 76, SW, 10, '#0d1022');
  const towers: [number, number, number][] = [
    [34, 66, 4], [40, 70, 10], [50, 60, 4], [56, 68, 14], [70, 52, 4], [76, 64, 8], [86, 58, 5], [93, 69, 12],
  ];
  for (const [x, y, w] of towers) {
    rect(ctx, x, y, w, 84 - y, CASTLE);
    if (w <= 5) rect(ctx, x + Math.floor(w / 2) - 1, y - 4, 2, 4, CASTLE), rect(ctx, x + Math.floor(w / 2) - 2, y - 2, 4, 2, CASTLE); // spires
  }
  return c;
}

/** Fixed star field inside the window (twinkled per frame). */
export const STARS = (() => {
  const r = rng(1410);
  return Array.from({ length: 28 }, () => ({ x: 28 + Math.floor(r() * 78), y: 16 + Math.floor(r() * 44), p: r() * 6.28, s: 0.6 + r() * 1.8 }));
})();

/** Lit castle windows (flicker per frame). */
export const CASTLE_WINDOWS: [number, number][] = [[42, 73], [46, 74], [58, 71], [62, 75], [72, 57], [78, 68], [80, 72], [88, 62], [96, 73], [100, 72]];

/** The room, with the window left transparent so the sky shows through. */
export function roomCanvas() {
  const { c, ctx } = makeCanvas(SW, SH);
  const r = rng(14);
  // wallpaper with soft stripes and tiny sprigs
  rect(ctx, 0, 0, SW, FLOOR_Y, WALL);
  for (let x = 0; x < SW; x += 8) rect(ctx, x, 0, 3, FLOOR_Y, STRIPE);
  for (let i = 0; i < 70; i++) rect(ctx, Math.floor(r() * SW), Math.floor(r() * 90), 1, 1, '#5a3a5e');
  // wainscot + skirting
  rect(ctx, 0, 96, SW, 16, PANEL);
  for (let x = 4; x < SW; x += 22) rect(ctx, x, 99, 18, 10, PANEL_DARK), rect(ctx, x + 1, 100, 16, 8, PANEL);
  rect(ctx, 0, 95, SW, 1, FRAME_LIGHT);
  rect(ctx, 0, 110, SW, 2, PANEL_DARK);
  // floorboards
  rect(ctx, 0, FLOOR_Y, SW, SH - FLOOR_Y, FLOOR);
  for (let y = FLOOR_Y + 5; y < SH; y += 6) rect(ctx, 0, y, SW, 1, FLOOR_LINE);
  for (let y = FLOOR_Y; y < SH; y += 6) for (let x = (y * 7) % 31; x < SW; x += 31) rect(ctx, x, y, 1, 6, FLOOR_LINE);

  // window frame (outer arch), then punch the glass out
  for (let x = WIN.x0; x <= WIN.x1; x++) rect(ctx, x, archTop(x), 1, WIN.y1 - archTop(x), FRAME);
  for (let x = WIN.x0 + 3; x <= WIN.x1 - 3; x++) ctx.clearRect(x, archTop(x) + 3, 1, WIN.y1 - 3 - (archTop(x) + 3));
  rect(ctx, WIN.cx - 1, archTop(WIN.cx) + 3, 3, WIN.y1 - archTop(WIN.cx) - 6, FRAME); // mullion
  rect(ctx, WIN.x0 + 3, 50, WIN.x1 - WIN.x0 - 5, 2, FRAME); // transom
  rect(ctx, WIN.x0 + 1, WIN.y1 - 3, WIN.x1 - WIN.x0 - 1, 1, FRAME_LIGHT); // sill highlight

  // window seat: cushion, pillow, wooden base
  rect(ctx, 20, 84, 96, 8, CUSHION);
  rect(ctx, 20, 84, 96, 2, CUSHION_LIGHT);
  rect(ctx, 20, 92, 96, 20, SEAT);
  for (let x = 24; x < 112; x += 23) rect(ctx, x, 95, 19, 13, '#4a2f1e'), rect(ctx, x + 1, 96, 17, 11, SEAT);
  // cushions: a soft one at the far end, a big one behind Ishu's back (so she reads against the night sky)
  rect(ctx, 98, 78, 11, 7, '#a8784a'), rect(ctx, 99, 77, 9, 1, '#a8784a'), rect(ctx, 99, 79, 9, 4, '#b98a58'), rect(ctx, 103, 80, 1, 1, '#7a5233');
  rect(ctx, 22, 61, 11, 24, '#b5506a'), rect(ctx, 23, 60, 9, 1, '#b5506a'), rect(ctx, 23, 62, 3, 21, '#c96a82'), rect(ctx, 26, 72, 2, 2, '#8a3a50');

  // side table with books (lamp + mug are animated)
  rect(ctx, 117, 89, 24, 3, FRAME_LIGHT);
  rect(ctx, 119, 92, 2, 20, FRAME), rect(ctx, 136, 92, 2, 20, FRAME);
  rect(ctx, 119, 103, 19, 2, FRAME);
  const BOOKS = ['#2f4f8a', '#7a3346', '#3f6b3f', '#c99a3a'];
  BOOKS.forEach((col, i) => rect(ctx, 121 + (i % 2), 99 - i * 2, 14 - i, 2, col));
  rect(ctx, 122, 106, 13, 5, '#7a3346'), rect(ctx, 123, 107, 11, 1, '#e9c46a');

  // rug
  for (let y = -9; y <= 9; y++) {
    const w = Math.round(40 * Math.sqrt(1 - (y / 9.5) ** 2));
    rect(ctx, 182 - w, 124 + y, w * 2, 1, Math.abs(y) >= 8 || Math.abs(w) <= 2 ? '#c9a14a' : y % 4 === 0 ? '#93415a' : '#7a3346');
  }
  // framed acceptance letter (prologue nod), and the clock face is drawn live
  rect(ctx, 140, 40, 16, 20, FRAME), rect(ctx, 142, 42, 12, 16, '#efe0bd');
  for (let y = 45; y < 56; y += 3) rect(ctx, 144, y, 8, 1, '#a08a66');
  rect(ctx, 149, 54, 3, 3, '#a3243a');
  return c;
}

/** Warm vignette: darkens the edges so the eye lands on the window seat. */
export function vignetteCanvas() {
  const { c, ctx } = makeCanvas(SW, SH);
  const g = ctx.createRadialGradient(110, 80, 40, 128, 72, 170);
  g.addColorStop(0, 'rgba(10,6,14,0)');
  g.addColorStop(1, 'rgba(10,6,14,0.55)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SW, SH);
  return c;
}

/** Pixel line (no anti-aliasing) for clock hands. */
export function pixelLine(ctx: Ctx, x0: number, y0: number, x1: number, y1: number, color: string) {
  const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
  for (let i = 0; i <= n; i++) rect(ctx, Math.round(x0 + ((x1 - x0) * i) / n), Math.round(y0 + ((y1 - y0) * i) / n), 1, 1, color);
}
