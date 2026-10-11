import { dot, rect, shade, type Ctx } from './draw';
import type { Dir, Expr } from './characters';

/** Niffler: fluffy black body, flat duck bill, tiny paws. Sits low in the frame (feet at y≈34). */
export function niffler(ctx: Ctx, ox: number, oy: number, dir: Dir, step: number, expr: Expr) {
  const FUR = '#2a2026';
  const FUR_LIT = '#3e3238';
  const BILL = '#d9a07a';
  const bob = step ? 1 : 0;
  const y = oy + 22 - bob;
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(ox + 5, oy + 33, 14, 2);
  rect(ctx, ox + 5, y + 2, 14, 9, FUR);
  rect(ctx, ox + 6, y + 1, 12, 11, FUR);
  rect(ctx, ox + 7, y, 10, 1, FUR);
  rect(ctx, ox + 7, y + 2, 4, 2, FUR_LIT); // fluff highlight
  // paws, alternating on walk frames
  rect(ctx, ox + 7, oy + 33 - (step === 1 ? 1 : 0), 3, 1, BILL);
  rect(ctx, ox + 14, oy + 33 - (step === 2 ? 1 : 0), 3, 1, BILL);
  if (dir === 'up') {
    rect(ctx, ox + 11, y + 11, 2, 1, FUR_LIT); // tail tuft
    return;
  }
  const happy = expr === 'happy' || expr === 'smug';
  if (dir === 'side') {
    rect(ctx, ox + 1, y + 6, 6, 3, BILL); // bill pokes left
    rect(ctx, ox + 1, y + 8, 6, 1, shade(BILL, -0.12));
    dot(ctx, ox + 8, y + 4, happy ? '#fff2b0' : '#e8e0d0');
    return;
  }
  rect(ctx, ox + 9, y + 6, 6, 4, BILL);
  rect(ctx, ox + 9, y + 9, 6, 1, shade(BILL, -0.12));
  dot(ctx, ox + 10, y + 7, shade(BILL, -0.2)), dot(ctx, ox + 13, y + 7, shade(BILL, -0.2)); // nostrils
  const eye = happy ? '#fff2b0' : '#e8e0d0';
  dot(ctx, ox + 8, y + 4, eye), dot(ctx, ox + 15, y + 4, eye);
  if (expr === 'shock') rect(ctx, ox + 11, y + 10, 2, 1, '#0c0a0e');
}

/** Batman soft toy: squat grey body, cowl with ears, black cape, yellow belt. Sits; "walk" frames just wobble. */
export function batplush(ctx: Ctx, ox: number, oy: number, dir: Dir, step: number, expr: Expr) {
  const GREY = '#6a6a76';
  const COWL = '#1c1c26';
  const CAPE = '#14141c';
  const y = oy + 19 - (step ? 1 : 0);
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(ox + 5, oy + 33, 14, 2);
  rect(ctx, ox + 5, y + 7, 14, 8, CAPE); // cape behind, wider than the body
  rect(ctx, ox + 4, y + 12, 16, 3, CAPE);
  rect(ctx, ox + 7, y + 7, 10, 7, GREY); // body
  rect(ctx, ox + 7, y + 12, 10, 1, '#e8c23c'); // utility belt
  rect(ctx, ox + 7, y + 13, 4, 2, GREY), rect(ctx, ox + 13, y + 13, 4, 2, GREY); // stubby legs
  rect(ctx, ox + 7, y + 15, 4, 1, COWL), rect(ctx, ox + 13, y + 15, 4, 1, COWL);
  // Cowl head with ears.
  rect(ctx, ox + 7, y, 10, 8, COWL);
  rect(ctx, ox + 7, y - 3, 2, 3, COWL), rect(ctx, ox + 15, y - 3, 2, 3, COWL);
  if (dir === 'up') return;
  if (dir === 'side') {
    rect(ctx, ox + 7, y + 5, 4, 3, '#e8c8a8');
    rect(ctx, ox + 8, y + 3, 2, 1, '#f4f4f8');
    return;
  }
  rect(ctx, ox + 9, y + 5, 6, 3, '#e8c8a8'); // jaw
  // Brooding eyes. Happy is the same as brooding, but slightly less.
  const lid = expr === 'happy' || expr === 'soft' ? 0 : 1;
  rect(ctx, ox + 9, y + 3, 2, 1, '#f4f4f8'), rect(ctx, ox + 13, y + 3, 2, 1, '#f4f4f8');
  if (lid) dot(ctx, ox + 9, y + 3, COWL), dot(ctx, ox + 14, y + 3, COWL);
  rect(ctx, ox + 11, y + 7, 2, 1, '#8e4b4b');
  // Bat emblem.
  rect(ctx, ox + 10, y + 9, 4, 1, '#101014'), dot(ctx, ox + 9, y + 8, '#101014'), dot(ctx, ox + 14, y + 8, '#101014');
}

/** Lily: Ishu's golden retriever. Low and wide, floppy darker ears, tongue out when happy, tail always going. */
export function lily(ctx: Ctx, ox: number, oy: number, dir: Dir, step: number, expr: Expr) {
  const FUR = '#d9a24a';
  const LIGHT = '#efc983';
  const DARK = '#b07a32';
  const NOSE = '#2a1a14';
  const happy = expr !== 'annoyed' && expr !== 'shock';
  const bob = step ? 1 : 0;
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(ox + 2, oy + 33, 20, 2);
  if (dir === 'side') {
    // Facing left (flipX = right): head low and forward, tail up and wagging.
    const y = oy + 17 - bob;
    rect(ctx, ox + 20, y + 2 + (step === 1 ? -1 : 1), 3, 6, LIGHT); // tail
    rect(ctx, ox + 6, y + 6, 15, 8, FUR); // body
    rect(ctx, ox + 7, y + 12, 12, 2, LIGHT); // belly fluff
    for (const [x, lift] of [[7, 1], [10, 2], [15, 2], [18, 1]] as const) {
      rect(ctx, ox + x, y + 14, 2, oy + 34 - (y + 14) - (step === lift ? 1 : 0), FUR);
    }
    rect(ctx, ox + 1, y, 8, 8, FUR); // head
    rect(ctx, ox, y + 4, 4, 3, LIGHT); // muzzle
    dot(ctx, ox, y + 4, NOSE);
    rect(ctx, ox + 6, y + 1, 3, 6, DARK); // ear
    dot(ctx, ox + 3, y + 2, NOSE);
    if (happy) rect(ctx, ox + 2, y + 7, 2, 2, '#e8707a');
    return;
  }
  const y = oy + 17 - bob;
  rect(ctx, ox + 6, y + 8, 12, 9, FUR); // body
  for (const [x, lift] of [[7, 1], [15, 2]] as const) rect(ctx, ox + x, y + 12, 3, oy + 34 - (y + 12) - (step === lift ? 1 : 0), FUR);
  if (dir === 'up') {
    rect(ctx, ox + 11 + (step === 1 ? -2 : step === 2 ? 2 : 0), y + 4, 2, 6, LIGHT); // tail, wagging
    rect(ctx, ox + 7, y, 10, 8, FUR);
    rect(ctx, ox + 5, y + 1, 3, 7, DARK), rect(ctx, ox + 16, y + 1, 3, 7, DARK);
    return;
  }
  rect(ctx, ox + 9, y + 9, 6, 7, LIGHT); // chest
  rect(ctx, ox + 7, y + 16, 3, 1, LIGHT), rect(ctx, ox + 15, y + 16, 3, 1, LIGHT); // paws
  rect(ctx, ox + 7, y, 10, 9, FUR); // head
  rect(ctx, ox + 5, y + 1, 3, 7, DARK), rect(ctx, ox + 16, y + 1, 3, 7, DARK); // ears
  rect(ctx, ox + 9, y + 5, 6, 4, LIGHT); // muzzle
  rect(ctx, ox + 11, y + 5, 2, 1, NOSE);
  dot(ctx, ox + 9, y + 3, NOSE), dot(ctx, ox + 14, y + 3, NOSE);
  if (expr === 'soft') rect(ctx, ox + 9, y + 3, 1, 1, DARK), rect(ctx, ox + 14, y + 3, 1, 1, DARK); // eyes closed, content
  if (happy) rect(ctx, ox + 11, y + 9, 2, 3, '#e8707a'); // tongue
  rect(ctx, ox + 11, y + 1, 2, 1, LIGHT); // forehead blaze
}
