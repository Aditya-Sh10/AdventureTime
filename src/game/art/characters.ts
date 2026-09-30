import { dot, frame, makeCanvas, rect, shade, type Ctx } from './draw';

/**
 * Code-drawn chibi characters (demo art). Frame 24x36, feet at y≈34.
 * Sheet layout per character: [down0,down1,down2, up0,up1,up2, side0,side1,side2] — side faces LEFT (flipX for right).
 */
export const FW = 24;
export const FH = 36;
export type Dir = 'down' | 'up' | 'side';
export type Expr = 'neutral' | 'annoyed' | 'smug' | 'shock' | 'soft' | 'happy';
type HairStyle = 'wavy' | 'curtains' | 'bun' | 'long' | 'short' | 'hood' | 'wild';

export interface CharSpec {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  top: string;
  bottom: string;
  shoes: string;
  robe?: string;
  tie?: string;
  hat?: string;
  glasses?: boolean;
  earrings?: string;
  blush?: boolean;
  beard?: string;
  short?: boolean;
  crop?: boolean;
}

export const CHARACTERS = {
  // Ishu: black wavy shoulder hair, glasses, earrings, crop top, 4'11" (drawn 2px shorter — Snape noticed).
  ishu: {
    skin: '#f1cfae', hair: '#1a1420', hairStyle: 'wavy', top: '#9b1f33', bottom: '#2f3d63', shoes: '#ece6da',
    glasses: true, earrings: '#e9b949', blush: true, short: true, crop: true,
  },
  snape: {
    skin: '#e9dccb', hair: '#0f0d13', hairStyle: 'curtains', top: '#15131a', bottom: '#15131a', shoes: '#08080a',
    robe: '#15131a',
  },
  mcgonagall: {
    skin: '#efd2b8', hair: '#8a8790', hairStyle: 'bun', top: '#1d4a34', bottom: '#1d4a34', shoes: '#1a1a1a',
    robe: '#1d4a34', hat: '#15372a', glasses: true,
  },
  ginny: {
    skin: '#f5d6bd', hair: '#c4471c', hairStyle: 'long', top: '#1d1b22', bottom: '#1d1b22', shoes: '#1a1a1a',
    robe: '#1d1b22', tie: '#a3202e', blush: true,
  },
  student: {
    skin: '#d9a47e', hair: '#3b2618', hairStyle: 'short', top: '#1d1b22', bottom: '#1d1b22', shoes: '#1a1a1a',
    robe: '#1d1b22', tie: '#1f3f8a',
  },
  // The mysterious "A." — always hooded, face in shadow.
  figure: {
    skin: '#0b0910', hair: '#2a2334', hairStyle: 'hood', top: '#2a2334', bottom: '#2a2334', shoes: '#111',
    robe: '#2a2334',
  },
} satisfies Record<string, CharSpec>;

export type CharId = keyof typeof CHARACTERS;
export const CHAR_IDS = Object.keys(CHARACTERS) as CharId[];

const EYE = '#1d1726';
const MOUTH = '#8e4b4b';

/** Draw one frame at (ox, oy). step: 0 idle, 1/2 walk. */
export function drawChar(ctx: Ctx, ox: number, oy: number, s: CharSpec, dir: Dir, step: number, expr: Expr = 'neutral') {
  ctx.save();
  ctx.translate(ox, oy);
  const sh = s.short ? 2 : 0;
  const headY = 7 + sh;
  const torsoY = 20 + sh;
  const torsoH = s.short ? 7 : 8;
  const legY = torsoY + torsoH;
  const legH = 34 - legY;
  const side = dir === 'side';

  // shadow
  ctx.fillStyle = 'rgba(0,0,0,0.28)';
  ctx.fillRect(6, 33, 12, 2);
  ctx.fillRect(7, 32, 10, 1);

  if (s.hairStyle === 'hood') {
    cloak(ctx, s.robe ?? s.hair, torsoY, side, step);
    head(ctx, s, dir, headY, expr);
    ctx.restore();
    return;
  }

  // legs / robe skirt
  if (s.robe) {
    const lift = (n: number) => (step === n ? 1 : 0);
    if (side) {
      rect(ctx, 8, legY, 8, legH - 1, s.robe);
      rect(ctx, step === 1 ? 7 : 9, 33 - lift(1), 4, 1, s.shoes);
      rect(ctx, step === 2 ? 13 : 11, 33 - lift(2), 4, 1, s.shoes);
    } else {
      rect(ctx, 6, legY, 12, legH - 1, s.robe);
      rect(ctx, 6, legY + legH - 2, 12, 1, shade(s.robe, -0.05));
      rect(ctx, 8, 33 - lift(1), 3, 1, s.shoes);
      rect(ctx, 13, 33 - lift(2), 3, 1, s.shoes);
    }
  } else if (side) {
    const [a, b] = step === 0 ? [10, 12] : step === 1 ? [8, 13] : [13, 8];
    leg(ctx, a, legY, legH, s, 0);
    leg(ctx, b, legY, legH, s, 0);
  } else {
    leg(ctx, 8, legY, legH, s, step === 1 ? 1 : 0);
    leg(ctx, 13, legY, legH, s, step === 2 ? 1 : 0);
  }

  // torso
  const body = s.robe ?? s.top;
  if (side) {
    rect(ctx, 9, torsoY, 6, torsoH, body);
    if (s.crop) {
      rect(ctx, 9, torsoY + torsoH - 3, 6, 1, s.skin);
      rect(ctx, 9, torsoY + torsoH - 2, 6, 2, s.bottom);
    }
    const swing = step === 1 ? -1 : step === 2 ? 1 : 0;
    rect(ctx, 11 + swing, torsoY + 1, 2, 5, shade(body, -0.06));
    rect(ctx, 11 + swing, torsoY + 6, 2, 1, s.skin);
  } else {
    rect(ctx, 7, torsoY, 10, torsoH, body);
    rect(ctx, 7, torsoY, 10, 1, shade(body, 0.06));
    if (s.crop) {
      rect(ctx, 8, torsoY + torsoH - 3, 8, 1, s.skin);
      rect(ctx, 7, torsoY + torsoH - 2, 10, 2, s.bottom);
    }
    if (s.tie && dir === 'down') rect(ctx, 11, torsoY, 2, 4, s.tie);
    if (s.robe && dir === 'down' && !s.tie) {
      for (let y = torsoY + 1; y < torsoY + torsoH; y += 2) dot(ctx, 12, y, shade(s.robe, 0.12)); // buttons
    }
    const l = step === 1 ? 1 : step === 2 ? -1 : 0;
    arm(ctx, 5, torsoY + 1 + l, body, s.skin);
    arm(ctx, 17, torsoY + 1 - l, body, s.skin);
  }

  head(ctx, s, dir, headY, expr);
  ctx.restore();
}

/** Floor-length cloak that flares toward the hem (hooded figure). */
function cloak(ctx: Ctx, color: string, top: number, side: boolean, step: number) {
  const bottom = 34;
  for (let y = top; y < bottom; y++) {
    const t = (y - top) / (bottom - top);
    const w = Math.round((side ? 8 : 10) + t * (side ? 5 : 7));
    const sway = step && y > bottom - 5 ? (step === 1 ? -1 : 1) : 0;
    rect(ctx, 12 - Math.floor(w / 2) + sway, y, w, 1, color);
  }
  rect(ctx, 11, top + 2, 1, bottom - top - 3, shade(color, -0.05)); // fold
  rect(ctx, 14, top + 4, 1, bottom - top - 6, shade(color, 0.05));
}

function leg(ctx: Ctx, x: number, y: number, h: number, s: CharSpec, lift: number) {
  rect(ctx, x, y, 3, h - 1 - lift, s.bottom);
  rect(ctx, x, y + h - 1 - lift, 3, 1, s.shoes);
}

function arm(ctx: Ctx, x: number, y: number, sleeve: string, skin: string) {
  rect(ctx, x, y, 2, 5, shade(sleeve, -0.04));
  rect(ctx, x, y + 5, 2, 1, skin);
}

function head(ctx: Ctx, s: CharSpec, dir: Dir, y: number, expr: Expr) {
  const hair = s.hair;
  const hi = shade(hair, 0.12);
  const side = dir === 'side';

  // hair behind head (long styles)
  if (!side && dir === 'down') {
    if (s.hairStyle === 'wavy') for (let i = 0; i < 12; i++) rect(ctx, i % 4 < 2 ? 4 : 5, y + 2 + i, 3, 1, hair), rect(ctx, i % 4 < 2 ? 17 : 16, y + 2 + i, 3, 1, hair);
    if (s.hairStyle === 'long') rect(ctx, 5, y + 2, 14, 16, hair);
  }

  // face/skull
  if (side) {
    rect(ctx, 8, y, 9, 13, s.skin);
    rect(ctx, 7, y + 1, 11, 11, s.skin);
    dot(ctx, 6, y + 8, s.skin); // nose
    if (s.hairStyle === 'curtains') rect(ctx, 5, y + 8, 2, 1, s.skin); // a nose of considerable authority
  } else {
    rect(ctx, 7, y, 10, 13, s.skin);
    rect(ctx, 6, y + 1, 12, 11, s.skin);
  }

  if (dir === 'down') face(ctx, s, y, expr);
  if (side) {
    const e = y + 7;
    rect(ctx, 8, e, 1, 2, EYE);
    if (s.glasses) {
      frame(ctx, 7, e - 1, 4, 4, '#2c2433');
      rect(ctx, 11, e, 4, 1, '#2c2433');
    }
    dot(ctx, 8, e + 3, MOUTH);
    if (s.blush) dot(ctx, 9, e + 2, '#e79a93');
  }

  // hair on top
  switch (s.hairStyle) {
    case 'wavy':
      if (dir === 'up') {
        rect(ctx, 5, y - 1, 14, 14, hair);
        for (let i = 0; i < 6; i++) rect(ctx, i % 2 ? 4 : 5, y + 11 + i, 15 - (i % 2), 1, hair);
      } else if (side) {
        rect(ctx, 7, y - 1, 11, 3, hair);
        rect(ctx, 12, y + 1, 7, 12, hair);
        for (let i = 0; i < 5; i++) rect(ctx, i % 2 ? 12 : 13, y + 13 + i, 6, 1, hair);
        rect(ctx, 7, y + 2, 4, 1, hair);
      } else {
        rect(ctx, 6, y - 1, 12, 3, hair);
        rect(ctx, 5, y, 14, 3, hair);
        rect(ctx, 6, y + 3, 6, 1, hair); // side-swept fringe
        rect(ctx, 6, y + 4, 3, 1, hair);
        rect(ctx, 15, y + 3, 3, 2, hair);
      }
      rect(ctx, 8, y - 1, 4, 1, hi);
      break;
    case 'long':
      if (dir === 'up') rect(ctx, 5, y - 1, 14, 20, hair);
      else if (side) rect(ctx, 7, y - 1, 11, 3, hair), rect(ctx, 12, y + 1, 7, 17, hair);
      else rect(ctx, 6, y - 1, 12, 3, hair), rect(ctx, 5, y, 14, 3, hair), rect(ctx, 5, y + 3, 2, 12, hair), rect(ctx, 17, y + 3, 2, 12, hair);
      rect(ctx, 9, y - 1, 4, 1, hi);
      break;
    case 'curtains':
      if (dir === 'up') rect(ctx, 5, y - 1, 14, 16, hair);
      else if (side) rect(ctx, 7, y - 1, 11, 4, hair), rect(ctx, 11, y + 1, 7, 14, hair), rect(ctx, 7, y + 3, 2, 3, hair);
      else {
        rect(ctx, 6, y - 1, 12, 3, hair);
        rect(ctx, 5, y, 3, 15, hair);
        rect(ctx, 16, y, 3, 15, hair);
        rect(ctx, 7, y + 2, 4, 2, hair);
        rect(ctx, 13, y + 2, 4, 2, hair);
      }
      break;
    case 'bun':
      rect(ctx, 6, y - 1, 12, 3, hair);
      rect(ctx, 9, y - 4, 6, 3, hair);
      if (dir === 'up') rect(ctx, 6, y, 12, 10, hair);
      else if (side) rect(ctx, 12, y + 1, 5, 6, hair);
      else rect(ctx, 6, y + 2, 2, 4, hair), rect(ctx, 16, y + 2, 2, 4, hair);
      break;
    case 'short':
      rect(ctx, 6, y - 1, 12, 4, hair);
      if (dir === 'up') rect(ctx, 6, y, 12, 9, hair);
      else if (side) rect(ctx, 11, y + 1, 7, 6, hair);
      else rect(ctx, 6, y + 3, 2, 3, hair), rect(ctx, 16, y + 3, 2, 3, hair);
      break;
    case 'wild':
      rect(ctx, 5, y - 2, 14, 5, hair);
      if (dir === 'up') rect(ctx, 5, y, 14, 11, hair);
      break;
    case 'hood': {
      // Rounded hood with a peak, narrower than the shoulders so it reads as a person.
      const r = s.robe ?? hair;
      dot(ctx, side ? 14 : 12, y - 4, r);
      rect(ctx, 9, y - 3, 6, 1, r);
      rect(ctx, 7, y - 2, 10, 1, r);
      rect(ctx, 6, y - 1, 12, 14, r);
      rect(ctx, 7, y - 2, 6, 1, shade(r, 0.1));
      if (dir === 'down') {
        rect(ctx, 8, y + 3, 8, 8, '#07060a');
        rect(ctx, 9, y + 2, 6, 1, '#07060a');
        dot(ctx, 10, y + 6, '#6d6284');
        dot(ctx, 13, y + 6, '#6d6284');
      } else if (side) {
        rect(ctx, 6, y + 3, 4, 8, '#07060a');
        dot(ctx, 7, y + 6, '#6d6284');
      }
      break;
    }
  }

  if (s.beard && dir !== 'up') rect(ctx, side ? 7 : 8, y + 10, side ? 5 : 8, 6, s.beard);

  if (s.earrings && dir === 'down') {
    dot(ctx, 5, y + 10, s.earrings);
    dot(ctx, 18, y + 10, s.earrings);
    dot(ctx, 5, y + 11, s.earrings);
    dot(ctx, 18, y + 11, s.earrings);
  } else if (s.earrings && side) {
    dot(ctx, 13, y + 10, s.earrings), dot(ctx, 13, y + 11, s.earrings);
  }

  if (s.hat) {
    const h = s.hat;
    rect(ctx, 3, y - 1, 18, 2, h);
    rect(ctx, 7, y - 3, 10, 2, h);
    rect(ctx, 9, y - 5, 7, 2, h);
    rect(ctx, side ? 13 : 12, y - 7, 3, 2, h);
    rect(ctx, 7, y - 2, 10, 1, shade(h, 0.15));
  }
}

function face(ctx: Ctx, s: CharSpec, y: number, expr: Expr) {
  const e = y + 7;
  const brow = shade(s.hair, 0.05);
  switch (expr) {
    case 'shock':
      rect(ctx, 9, e - 1, 1, 3, EYE), rect(ctx, 14, e - 1, 1, 3, EYE);
      rect(ctx, 11, e + 3, 2, 2, '#5a2b2b');
      break;
    case 'soft':
      rect(ctx, 8, e + 1, 2, 1, EYE), rect(ctx, 14, e + 1, 2, 1, EYE);
      dot(ctx, 10, e + 3, MOUTH), rect(ctx, 11, e + 4, 2, 1, MOUTH), dot(ctx, 13, e + 3, MOUTH);
      break;
    case 'happy':
      dot(ctx, 8, e + 1, EYE), dot(ctx, 9, e, EYE), dot(ctx, 10, e + 1, EYE);
      dot(ctx, 13, e + 1, EYE), dot(ctx, 14, e, EYE), dot(ctx, 15, e + 1, EYE);
      rect(ctx, 10, e + 3, 4, 1, MOUTH), rect(ctx, 11, e + 4, 2, 1, MOUTH);
      break;
    default:
      rect(ctx, 9, e, 1, 2, EYE), rect(ctx, 14, e, 1, 2, EYE);
  }
  if (expr === 'annoyed') {
    dot(ctx, 8, e - 2, brow), dot(ctx, 9, e - 1, brow), dot(ctx, 14, e - 1, brow), dot(ctx, 15, e - 2, brow);
    rect(ctx, 10, e + 3, 4, 1, MOUTH);
  } else if (expr === 'smug') {
    rect(ctx, 8, e - 2, 2, 1, brow), rect(ctx, 14, e - 3, 2, 1, brow);
    rect(ctx, 11, e + 3, 2, 1, MOUTH), dot(ctx, 13, e + 2, MOUTH);
  } else if (expr === 'neutral') {
    rect(ctx, 11, e + 3, 2, 1, MOUTH);
  }
  if (s.glasses) {
    frame(ctx, 7, e - 1, 4, 4, '#2c2433');
    frame(ctx, 13, e - 1, 4, 4, '#2c2433');
    rect(ctx, 11, e, 2, 1, '#2c2433');
  }
  if (s.blush) dot(ctx, 7, e + 3, '#e79a93'), dot(ctx, 16, e + 3, '#e79a93');
}

/** Full 9-frame sheet canvas for a character. */
export function characterSheet(id: CharId) {
  const { c, ctx } = makeCanvas(FW * 9, FH);
  const dirs: Dir[] = ['down', 'up', 'side'];
  dirs.forEach((d, di) => [0, 1, 2].forEach((st) => drawChar(ctx, (di * 3 + st) * FW, 0, CHARACTERS[id], d, st)));
  return c;
}

const portraitCache = new Map<string, string>();

/** Head-and-shoulders portrait as a data URL (for React dialogue). Crops the top of a down-facing idle frame. */
export function portraitURL(id: CharId, expr: Expr = 'neutral') {
  const key = `${id}_${expr}`;
  const hit = portraitCache.get(key);
  if (hit) return hit;
  const spec: CharSpec = CHARACTERS[id];
  const { c: full, ctx } = makeCanvas(FW, FH);
  drawChar(ctx, 0, 0, spec, 'down', 0, expr);
  // Tight square around the head (hats need the top rows).
  const size = spec.hat ? 24 : 20;
  const y0 = spec.hat ? 0 : 3 + (spec.short ? 2 : 0);
  const x0 = (FW - size) / 2;
  const { c, ctx: out } = makeCanvas(size, size);
  out.drawImage(full, x0, y0, size, size, 0, 0, size, size);
  const url = c.toDataURL();
  portraitCache.set(key, url);
  return url;
}
