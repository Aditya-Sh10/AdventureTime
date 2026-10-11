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
