import { CHARACTERS } from './cast';
import { CASTLE_WINDOWS, CLOCK, LAMP, MOON, STARS, SW, WIN, pixelLine } from './cozyRoom';
import { rect, type Ctx } from './draw';

/** Everything that moves on the title screen. Mutated by ui/CozyScene.tsx (clicks, timers), read by drawFrame. */
export interface CozyState {
  /** Mouse position, -1..1 on each axis (sky parallax). */
  mx: number;
  my: number;
  lilyAwakeUntil: number;
  hearts: { x: number; born: number }[];
  ishuLookUntil: number;
  owlAt: number | null;
  shootAt: number | null;
  steamPuffUntil: number;
  lampOn: boolean;
  clockWobbleUntil: number;
  hoverLily: boolean;
  /** Idle motion off (settings.reducedMotion / prefers-reduced-motion): only direct reactions animate. */
  still: boolean;
}

export const newCozyState = (): CozyState => ({
  mx: 0, my: 0, lilyAwakeUntil: 0, hearts: [], ishuLookUntil: 0, owlAt: null, shootAt: null,
  steamPuffUntil: 0, lampOn: true, clockWobbleUntil: 0, hoverLily: false, still: false,
});

export interface CozyLayers {
  sky: HTMLCanvasElement;
  room: HTMLCanvasElement;
  vignette: HTMLCanvasElement;
}

// Jeans a shade lighter than in-game so her knees don't vanish into the night outside the window.
const ISHU = { ...CHARACTERS.ishu, bottom: '#41558c' };
const FUR = '#d9a24a';
const FUR_LIGHT = '#efc983';
const FUR_DARK = '#b07a32';
const NOSE = '#2a1a14';
const INK = '#1a1420';
const BULBS = ['#ffd27a', '#ff9a8a', '#9ad8ff', '#c6ff9a'];

const wave = (t: number, speed: number, phase = 0) => Math.sin(t * speed + phase);
/** 0 or 1, flipping smoothly with a sine — a one-pixel "breath". */
const breath = (t: number, speed: number, phase = 0) => (wave(t, speed, phase) > 0.2 ? 1 : 0);

/** Ishu on the window seat, back to the frame, knees up, reading the letter. Origin = where she sits. */
function drawIshu(ctx: Ctx, t: number, st: CozyState) {
  const bx = 34;
  const by = 84;
  const b = st.still ? 0 : breath(t, 1.6);
  const looking = t < st.ishuLookUntil;
  const glance = !st.still && !looking && t % 17 > 14.5; // every so often she peeks at Lily
  const blink = !st.still && t % 4.3 < 0.13;
  // legs: knees up, feet on the cushion
  rect(ctx, bx + 4, by - 8, 12, 5, ISHU.bottom);
  rect(ctx, bx + 14, by - 12, 5, 11, ISHU.bottom);
  rect(ctx, bx + 18, by - 3, 5, 3, ISHU.shoes);
  // torso (crop top), sitting into the cushion
  const ty = by - 19 - b;
  rect(ctx, bx, ty, 9, 10, ISHU.top);
  rect(ctx, bx + 1, ty + 10, 8, 2, ISHU.skin);
  rect(ctx, bx, ty + 12, 9, 5 + b, ISHU.bottom);
  // the letter on her knees (turns a page now and then)
  const flip = !st.still && t % 11 < 0.5;
  const ly = by - 21 - (looking ? 2 : 0);
  rect(ctx, bx + 11, ly, 9, 8, '#f3e6c4');
  if (flip) rect(ctx, bx + 15, ly - 1, 5, 9, '#fff6dc');
  else for (let y = ly + 2; y < ly + 7; y += 2) rect(ctx, bx + 12, y, 6, 1, '#b9a682');
  rect(ctx, bx + 17, ly + 5, 2, 2, '#a3243a'); // wax seal
  // arm + hands holding it
  rect(ctx, bx + 5, ty + 5, 7, 2, ISHU.skin);
  rect(ctx, bx + 10, ly + 6, 2, 2, ISHU.skin);
  // head
  const hy = ty - 13 - (looking ? 1 : 0);
  rect(ctx, bx - 2, hy, 13, 13, ISHU.hair); // hair mass (back + top)
  rect(ctx, bx - 3, hy + 6, 4, 11, ISHU.hair); // wavy hair down the back
  rect(ctx, bx - 4, hy + 10, 2, 5, ISHU.hair);
  rect(ctx, bx + 3, hy + 3, 8, 10, ISHU.skin); // face (side, looking right/down)
  rect(ctx, bx + 2, hy + 1, 9, 3, ISHU.hair); // fringe
  const eyeY = hy + (looking ? 6 : glance ? 6 : 7);
  const eyeX = bx + (glance ? 9 : 8);
  rect(ctx, bx + 6, hy + 5, 5, 4, '#2a2030'); // glasses
  rect(ctx, bx + 7, hy + 6, 3, 2, '#c9d8e8');
  if (blink) rect(ctx, bx + 7, eyeY, 3, 1, INK);
  else rect(ctx, eyeX, eyeY, 1, 1, INK);
  rect(ctx, bx + 9, hy + 10, 1, 1, '#e48a8a'); // blush
  rect(ctx, bx + 10, hy + 11, 1, 1, looking ? '#b04050' : '#c46a6a'); // mouth (smiles when looking up)
  if (looking) rect(ctx, bx + 9, hy + 11, 1, 1, '#b04050');
  rect(ctx, bx + 3, hy + 9, 1, 2, ISHU.earrings!); // earring
}

/** Lily asleep on the rug, head on her paws; lifts her head and wags when woken. Origin = rug centre-left. */
function drawLily(ctx: Ctx, t: number, st: CozyState) {
  const lx = 162;
  const ly = 124;
  const awake = t < st.lilyAwakeUntil;
  const b = st.still ? 0 : breath(t, 1.2, 1);
  // shadow
  ctx.fillStyle = 'rgba(30,10,20,0.35)';
  ctx.fillRect(lx - 6, ly - 1, 46, 2);
  // tail: thumps on the rug while asleep, sweeps fast when awake
  const tailUp = awake ? Math.floor(t * 9) % 2 === 0 : !st.still && t % 6.5 < 0.7 && Math.floor(t * 6) % 2 === 0;
  if (tailUp) rect(ctx, lx + 34, ly - 11, 3, 2, FUR_LIGHT), rect(ctx, lx + 36, ly - 13, 4, 2, FUR_LIGHT);
  else rect(ctx, lx + 34, ly - 4, 8, 2, FUR_LIGHT);
  // body (rises a pixel with each breath)
  rect(ctx, lx + 8, ly - 10 - b, 26, 8 + b, FUR);
  rect(ctx, lx + 10, ly - 11 - b, 22, 1, FUR);
  rect(ctx, lx + 10, ly - 3, 22, 2, FUR_LIGHT);
  rect(ctx, lx + 27, ly - 6, 7, 5, FUR_DARK); // folded hind leg
  rect(ctx, lx - 2, ly - 3, 11, 2, FUR_LIGHT); // front paws
  // head: resting on paws, or lifted when awake
  const hy = ly - 11 - (awake ? 5 : 0);
  rect(ctx, lx - 4, hy, 12, 8, FUR);
  rect(ctx, lx - 8, hy + 3, 5, 4, FUR_LIGHT); // muzzle
  rect(ctx, lx - 8, hy + 3, 1, 1, NOSE);
  const twitch = st.hoverLily || (!st.still && t % 9 < 0.25);
  rect(ctx, lx + 3, hy + 1 - (twitch ? 1 : 0), 4, 7, FUR_DARK); // floppy ear
  if (awake) {
    rect(ctx, lx - 1, hy + 2, 1, 2, NOSE); // eye open
    rect(ctx, lx - 6, hy + 7, 2, 3, '#e8707a'); // tongue
  } else {
    rect(ctx, lx - 2, hy + 3, 2, 1, NOSE); // eye shut
    if (!st.still) {
      // z z z drifting up
      const k = (t % 3) / 3;
      const zx = lx - 4 + Math.round(k * 6);
      const zy = hy - 3 - Math.round(k * 12);
      ctx.globalAlpha = 1 - k;
      rect(ctx, zx, zy, 3, 1, '#f3e7cc'), rect(ctx, zx + 1, zy + 1, 1, 1, '#f3e7cc'), rect(ctx, zx, zy + 2, 3, 1, '#f3e7cc');
      ctx.globalAlpha = 1;
    }
  }
  // hearts after a pat
  st.hearts = st.hearts.filter((h) => t - h.born < 1.6);
  for (const h of st.hearts) {
    const k = (t - h.born) / 1.6;
    const x = Math.round(h.x + wave(t, 6, h.born) * 2);
    const y = Math.round(hy - 4 - k * 18);
    ctx.globalAlpha = 1 - k;
    rect(ctx, x, y, 2, 1, '#ff6b81'), rect(ctx, x + 3, y, 2, 1, '#ff6b81'), rect(ctx, x, y + 1, 5, 2, '#ff6b81'), rect(ctx, x + 1, y + 3, 3, 1, '#ff6b81'), rect(ctx, x + 2, y + 4, 1, 1, '#ff6b81');
    ctx.globalAlpha = 1;
  }
}

function drawSkyFx(ctx: Ctx, t: number, st: CozyState, ox: number, oy: number) {
  // stars
  for (const s of STARS) {
    const a = st.still ? 0.8 : 0.45 + 0.55 * Math.max(0, wave(t, s.s, s.p));
    ctx.globalAlpha = a;
    rect(ctx, s.x + ox, s.y + oy, 1, 1, '#fff6dc');
  }
  ctx.globalAlpha = 1;
  // moon with a soft halo
  const mx = MOON.x + ox;
  const my = MOON.y + oy;
  ctx.fillStyle = 'rgba(244,236,200,0.08)';
  ctx.beginPath(), ctx.arc(mx, my, MOON.r + 6, 0, 6.29), ctx.fill();
  for (let y = -MOON.r; y <= MOON.r; y++) {
    const w = Math.round(Math.sqrt(MOON.r * MOON.r - y * y));
    rect(ctx, mx - w, my + y, w * 2, 1, '#f4ecc8');
  }
  rect(ctx, mx - 3, my - 2, 2, 2, '#ddd2a6'), rect(ctx, mx + 2, my + 2, 3, 2, '#ddd2a6');
  // drifting clouds
  for (const [i, y] of [[0, 24], [1, 42]] as const) {
    const span = 140;
    const x = Math.round(((t * (st.still ? 0 : 1.5 + i) + i * 70) % span) - 30) + ox;
    ctx.fillStyle = 'rgba(160,170,220,0.12)';
    ctx.fillRect(x, y + oy, 22, 3), ctx.fillRect(x + 4, y - 2 + oy, 12, 2);
  }
  // castle windows flicker
  CASTLE_WINDOWS.forEach(([x, y], i) => {
    if (st.still || wave(t, 0.7 + i * 0.13, i) > -0.7) rect(ctx, x + ox, y + oy, 1, 1, '#f6c35a');
  });
  // shooting star (click the moon)
  if (st.shootAt !== null) {
    const k = (t - st.shootAt) / 0.9;
    if (k > 1) st.shootAt = null;
    else {
      const x = Math.round(100 - k * 60) + ox;
      const y = Math.round(18 + k * 22) + oy;
      for (let i = 0; i < 8; i++) {
        ctx.globalAlpha = (1 - i / 8) * (1 - k * 0.6);
        rect(ctx, x + i, y - Math.round(i * 0.4), 1, 1, '#fff6dc');
      }
      ctx.globalAlpha = 1;
    }
  }
  // the owl, letter in its talons, crossing the window
  if (st.owlAt !== null) {
    const k = (t - st.owlAt) / 6;
    if (k > 1) st.owlAt = null;
    else {
      const x = Math.round(WIN.x1 + 6 - k * (WIN.x1 - WIN.x0 + 20)) + ox;
      const y = Math.round(34 + wave(t, 5) * 2) + oy;
      const up = Math.floor(t * 8) % 2 === 0;
      rect(ctx, x, y, 4, 4, '#6b4a33');
      rect(ctx, x - 3, y + (up ? -2 : 2), 3, 2, '#5a3d29'), rect(ctx, x + 4, y + (up ? -2 : 2), 3, 2, '#5a3d29');
      rect(ctx, x + 1, y + 1, 1, 1, '#f6c35a');
      rect(ctx, x + 1, y + 4, 3, 2, '#f3e6c4');
    }
  }
}

function drawFairyLights(ctx: Ctx, t: number, st: CozyState) {
  const dim = st.lampOn ? 1 : 1.35;
  for (let i = 0, x = 22; x <= 112; x += 7, i++) {
    const u = (x - 22) / 90;
    const y = Math.round(9 + 6 * Math.sin(Math.PI * u));
    const a = st.still ? 0.9 : 0.55 + 0.45 * Math.max(0, wave(t, 1.3, i * 1.7));
    ctx.globalAlpha = Math.min(1, a * dim * 0.35);
    rect(ctx, x - 1, y - 1, 4, 4, BULBS[i % 4]);
    ctx.globalAlpha = Math.min(1, a * dim);
    rect(ctx, x, y, 2, 2, BULBS[i % 4]);
  }
  ctx.globalAlpha = 1;
  for (let x = 22; x < 112; x++) rect(ctx, x, Math.round(8 + 6 * Math.sin((Math.PI * (x - 22)) / 90)), 1, 1, '#2a1a20');
}

function drawLampMugClock(ctx: Ctx, t: number, st: CozyState) {
  // lamp
  rect(ctx, LAMP.x - 3, 84, 6, 5, '#c9a14a'), rect(ctx, LAMP.x - 1, 80, 2, 4, '#c9a14a');
  for (let y = 0; y < 10; y++) rect(ctx, LAMP.x - 5 - Math.floor(y / 2), LAMP.shadeY + y, 10 + Math.floor(y / 2) * 2, 1, st.lampOn ? (y < 3 ? '#f2d07a' : '#e9b949') : '#8a6a3a');
  // mug + steam
  rect(ctx, 132, 85, 5, 5, '#e9e2d0'), rect(ctx, 137, 86, 1, 3, '#e9e2d0'), rect(ctx, 133, 85, 3, 1, '#6b3a22');
  const puff = t < st.steamPuffUntil;
  if (!st.still || puff) {
    for (let i = 0; i < (puff ? 7 : 3); i++) {
      const k = ((t * (puff ? 1.6 : 0.6) + i / (puff ? 7 : 3)) % 1);
      ctx.globalAlpha = (1 - k) * 0.55;
      rect(ctx, 134 + Math.round(wave(t * 2 + i, 1.7) * (1 + k * 2)), 83 - Math.round(k * (puff ? 18 : 12)), 1, 2, '#f3e7cc');
    }
    ctx.globalAlpha = 1;
  }
  // clock: always 11:57, the night before. Second hand is real.
  const wob = t < st.clockWobbleUntil ? Math.round(wave(t, 30)) : 0;
  const cx = CLOCK.x + wob;
  ctx.fillStyle = '#6b4528';
  ctx.beginPath(), ctx.arc(cx, CLOCK.y, CLOCK.r + 1, 0, 6.29), ctx.fill();
  ctx.fillStyle = '#efe0bd';
  ctx.beginPath(), ctx.arc(cx, CLOCK.y, CLOCK.r - 1, 0, 6.29), ctx.fill();
  for (let h = 0; h < 12; h += 3) {
    const a = (h / 12) * Math.PI * 2;
    rect(ctx, Math.round(cx + Math.sin(a) * 6), Math.round(CLOCK.y - Math.cos(a) * 6), 1, 1, '#6b4528');
  }
  const hand = (frac: number, len: number, col: string) => {
    const a = frac * Math.PI * 2;
    pixelLine(ctx, cx, CLOCK.y, Math.round(cx + Math.sin(a) * len), Math.round(CLOCK.y - Math.cos(a) * len), col);
  };
  hand(11.95 / 12, 4, '#2a1a20');
  hand(57 / 60, 6, '#2a1a20');
  hand((Math.floor(Date.now() / 1000) % 60) / 60, 6, '#a3243a');
}

/** Lamp light pooled on the scene (or moonlight only, if Ishu's lamp has been switched off). */
function drawLight(ctx: Ctx, t: number, st: CozyState) {
  if (st.lampOn) {
    const f = st.still ? 0 : wave(t, 7) * 1.5 + wave(t, 2.3);
    const g = ctx.createRadialGradient(LAMP.x, LAMP.shadeY + 8, 4, LAMP.x, LAMP.shadeY + 30, 95 + f);
    g.addColorStop(0, 'rgba(255,196,120,0.2)');
    g.addColorStop(1, 'rgba(255,196,120,0)');
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, SW, 144);
    ctx.globalCompositeOperation = 'source-over';
  } else {
    ctx.fillStyle = 'rgba(8,10,30,0.45)';
    ctx.fillRect(0, 0, SW, 144);
  }
}

export function drawFrame(ctx: Ctx, L: CozyLayers, t: number, st: CozyState) {
  const ox = st.still ? 0 : Math.round(st.mx * 2);
  const oy = st.still ? 0 : Math.round(st.my * 1);
  ctx.drawImage(L.sky, ox - 2, oy - 1);
  drawSkyFx(ctx, t, st, ox, oy);
  ctx.drawImage(L.room, 0, 0);
  drawFairyLights(ctx, t, st);
  drawLampMugClock(ctx, t, st);
  drawLily(ctx, t, st);
  drawIshu(ctx, t, st);
  drawLight(ctx, t, st);
  ctx.drawImage(L.vignette, 0, 0);
}
