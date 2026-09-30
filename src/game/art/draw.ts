/** Tiny canvas helpers for code-generated demo pixel art (replaced by real assets later, same texture keys). */
export type Ctx = CanvasRenderingContext2D;

export function makeCanvas(w: number, h: number) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  return { c, ctx };
}

export function rect(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

export function dot(ctx: Ctx, x: number, y: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, 1, 1);
}

/** 1px outline rectangle. */
export function frame(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  rect(ctx, x, y, w, 1, color);
  rect(ctx, x, y + h - 1, w, 1, color);
  rect(ctx, x, y, 1, h, color);
  rect(ctx, x + w - 1, y, 1, h, color);
}

/** Deterministic PRNG so generated art is identical every boot. */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Lighten (amt>0) or darken (amt<0) a #rrggbb colour. */
export function shade(hex: string, amt: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + 255 * amt)));
  const r = f(n >> 16);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/** Scatter single-pixel specks for texture. */
export function speckle(ctx: Ctx, rnd: () => number, x: number, y: number, w: number, h: number, colors: string[], n: number) {
  for (let i = 0; i < n; i++) {
    dot(ctx, x + Math.floor(rnd() * w), y + Math.floor(rnd() * h), colors[Math.floor(rnd() * colors.length)]);
  }
}
