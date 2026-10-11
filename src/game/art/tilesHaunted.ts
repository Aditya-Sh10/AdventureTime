import { TILE as T } from '../constants';
import { dot, frame, rect, shade, speckle, type Ctx } from './draw';
import { GOLD, PLANK, type TileDef } from './tileKit';

/**
 * Chapter 5: the Haunted Wing. Grey-green peeling wallpaper, dusty boards, a nursery, a room with a television,
 * the Red Room (Hill House), and the warm Room of Hidden Things at the end. The map is lantern-dark with a cold
 * ambient, so these are drawn mid-tone; the moon and Light2D supply the mood.
 */

const PAPER = '#56604e';
const PAPER_DK = '#3e4638';
const BOARD = '#5a4636';
const RED = '#7a1c22';
const GLOW = '#cfe8ff';

/** Long vertical floorboards (not bricks): dark gaps, staggered end joints, a little grain and dust. */
function boards(c: Ctx, r: () => number, base = BOARD, dust = true) {
  rect(c, 0, 0, T, T, base);
  [0, 8, 16, 24].forEach((x, i) => {
    rect(c, x, 0, 8, T, shade(base, [0, -0.06, 0.04, -0.03][i]));
    rect(c, x + 7, 0, 1, T, shade(base, -0.35)); // gap between boards
    rect(c, x, [11, 25, 4, 18][i], 7, 1, shade(base, -0.3)); // end joint
    rect(c, x + 2, [3, 14, 22, 7][i], 1, 4, shade(base, 0.08)); // grain
  });
  if (dust) speckle(c, r, 0, 0, T, T, [shade(base, 0.14), '#7a7066'], 10);
}

/** Wallpaper face with a stripe, a damp stain and a peeling corner. */
function paper(c: Ctx, r: () => number, base = PAPER) {
  rect(c, 0, 0, T, T, base);
  for (let x = 3; x < T; x += 8) rect(c, x, 0, 2, 26, shade(base, -0.12));
  speckle(c, r, 0, 0, T, 26, [shade(base, 0.08), PAPER_DK], 16);
  rect(c, 0, 26, T, 6, '#2e2620'); // skirting board
  rect(c, 0, 26, T, 1, '#4a3c30');
}

/** 3×5 pixel digits, scaled — the hidden writing only her glasses can see. */
const DIGITS: Record<string, string[]> = {
  '0': ['111', '101', '101', '101', '111'],
  '1': ['010', '110', '010', '010', '111'],
  '4': ['101', '101', '111', '001', '001'],
};
function digits(c: Ctx, text: string, x: number, y: number, color: string, s = 2) {
  [...text].forEach((ch, i) => {
    const rows = DIGITS[ch];
    if (!rows) return;
    rows.forEach((row, ry) => [...row].forEach((on, rx) => on === '1' && rect(c, x + i * 4 * s + rx * s, y + ry * s, s, s, color)));
  });
}

function writing(c: Ctx, r: () => number, text: string, base = PAPER) {
  paper(c, r, base);
  const w = text.length * 8 - 2;
  digits(c, text, 16 - Math.floor(w / 2) + 1, 9, shade(GLOW, -0.4));
  digits(c, text, 16 - Math.floor(w / 2), 8, GLOW);
}

function portrait(c: Ctx, r: () => number, turned: boolean) {
  paper(c, r);
  rect(c, 7, 3, 18, 22, '#3a2a1a');
  frame(c, 7, 3, 18, 22, '#8a6a2a');
  rect(c, 9, 5, 14, 18, '#28302c');
  rect(c, 11, 17, 10, 6, '#1a1a20'); // shoulders
  rect(c, 12, 8, 8, 9, turned ? '#1a1412' : '#c8b8a0'); // a face, or the back of a head
  if (turned) rect(c, 12, 8, 8, 4, '#2a1e18');
  else (dot(c, 14, 11, '#101010'), dot(c, 18, 11, '#101010'), rect(c, 15, 14, 3, 1, '#6a4a40'));
}

export const HAUNTED_TILES: TileDef[] = [
  { name: 'hauntFloor', draw: (c, r) => boards(c, r) },
  { name: 'hauntFloor2', draw: (c, r) => (boards(c, r), rect(c, 6, 12, 9, 5, shade(BOARD, -0.18))) },
  { name: 'hauntTop', solid: true, draw: (c) => (rect(c, 0, 0, T, T, '#1c1a1e'), rect(c, 0, T - 2, T, 2, '#2c2830')) },
  { name: 'hauntWall', solid: true, draw: (c, r) => paper(c, r) },
  {
    // The paper is coming away from the wall, showing the plaster underneath.
    name: 'hauntWallPeel',
    solid: true,
    draw: (c, r) => {
      paper(c, r);
      rect(c, 18, 4, 10, 12, '#8a8478');
      rect(c, 17, 4, 1, 12, PAPER_DK), rect(c, 18, 16, 10, 2, shade(PAPER, -0.3));
    },
  },
  {
    name: 'hauntWindow',
    solid: true,
    draw: (c, r) => {
      paper(c, r);
      rect(c, 7, 3, 18, 21, '#2a2420');
      rect(c, 9, 5, 14, 17, '#1c2a44');
      dot(c, 19, 8, '#e8f0ff'), rect(c, 18, 9, 3, 2, '#c8d8f0'); // the moon
      rect(c, 15, 5, 2, 17, '#2a2420'), rect(c, 9, 12, 14, 2, '#2a2420');
    },
  },
  {
    name: 'hauntDoor',
    solid: true,
    draw: (c, r) => {
      paper(c, r);
      rect(c, 6, 2, 20, 30, '#3a2a1c');
      frame(c, 6, 2, 20, 30, '#22180e');
      rect(c, 9, 5, 14, 10, '#46321f'), rect(c, 9, 18, 14, 11, '#46321f');
      dot(c, 21, 17, GOLD);
    },
  },
  {
    name: 'lockedDoor',
    solid: true,
    draw: (c, r) => {
      paper(c, r);
      rect(c, 6, 2, 20, 30, '#2a2018');
      frame(c, 6, 2, 20, 30, '#14100a');
      rect(c, 5, 14, 22, 3, '#5a5a62'); // chains
      for (let x = 6; x < 26; x += 3) dot(c, x, 15, '#8a8a92');
      rect(c, 14, 15, 5, 6, '#7a6a3a'), dot(c, 16, 18, '#14100a'); // padlock
    },
  },
  {
    // Hill House: the door was not red before.
    name: 'redDoor',
    solid: true,
    draw: (c, r) => {
      paper(c, r);
      rect(c, 6, 2, 20, 30, '#8a1a20');
      frame(c, 6, 2, 20, 30, '#4a0a10');
      rect(c, 9, 5, 14, 10, '#9a2a2e'), rect(c, 9, 18, 14, 11, '#9a2a2e');
      dot(c, 21, 17, GOLD);
    },
  },
  { name: 'hauntPortrait', solid: true, draw: (c, r) => portrait(c, r, false) },
  { name: 'portraitTurned', solid: true, draw: (c, r) => portrait(c, r, true) },
  {
    // Grandfather clock, stopped at three minutes to midnight. It has been 11:57 all night.
    name: 'stoppedClock',
    solid: true,
    draw: (c, r) => {
      paper(c, r);
      rect(c, 9, 1, 14, 31, '#3a2416');
      frame(c, 9, 1, 14, 31, '#22140a');
      rect(c, 11, 3, 10, 10, '#d8d0b8');
      frame(c, 11, 3, 10, 10, GOLD);
      rect(c, 16, 4, 1, 4, '#101010'); // minute hand at :57
      rect(c, 15, 4, 1, 1, '#101010');
      rect(c, 15, 8, 2, 1, '#101010'); // hour hand pointing at 12
      rect(c, 16, 6, 1, 3, '#101010');
      rect(c, 15, 16, 2, 10, '#8a6a2a'), rect(c, 13, 25, 6, 4, GOLD); // pendulum, not moving
    },
  },
  {
    name: 'crib',
    solid: true,
    draw: (c, r) => {
      boards(c, r);
      rect(c, 3, 8, 26, 18, '#d8d0c0');
      rect(c, 5, 10, 22, 14, '#a8b8c8');
      for (let x = 4; x < 29; x += 4) rect(c, x, 6, 2, 22, '#e8e0d0');
      rect(c, 3, 6, 26, 2, '#e8e0d0'), rect(c, 3, 26, 26, 2, '#e8e0d0');
    },
  },
  {
    // A shelf of porcelain dolls. All of them facing the door. All of them.
    name: 'dollShelf',
    solid: true,
    draw: (c, r) => {
      boards(c, r);
      rect(c, 2, 4, 28, 24, '#3a2a1c');
      for (const y of [6, 17]) {
        rect(c, 2, y + 9, 28, 2, '#22180e');
        for (let i = 0; i < 4; i++) {
          const x = 4 + i * 7;
          rect(c, x, y + 3, 5, 6, ['#8a3a4a', '#4a5a8a', '#e8e0d0', '#5a7a4a'][(i + y) % 4]);
          rect(c, x + 1, y, 3, 3, '#f0e0d0');
          dot(c, x + 1, y + 1, '#101010'), dot(c, x + 3, y + 1, '#101010');
        }
      }
    },
  },
  {
    name: 'musicBox',
    solid: true,
    draw: (c, r) => {
      boards(c, r);
      rect(c, 6, 14, 20, 12, '#6a3a2a');
      frame(c, 6, 14, 20, 12, '#3a1a10');
      rect(c, 8, 8, 16, 6, '#7a4a3a'); // lid, open
      rect(c, 15, 6, 2, 8, '#e8e0d0'); // the tiny dancer
      rect(c, 14, 4, 4, 3, '#f0d0d8');
      rect(c, 22, 18, 5, 2, GOLD); // key
    },
  },
  {
    // A mirror fogged from the inside. Someone has written in it with a finger.
    name: 'fogMirror',
    solid: true,
    draw: (c, r) => {
      paper(c, r);
      rect(c, 8, 2, 16, 22, '#6a5a3a');
      rect(c, 10, 4, 12, 18, '#9aa8b0');
      speckle(c, r, 10, 4, 12, 18, ['#b8c4c8', '#c8d0d4'], 30);
      for (let x = 11; x < 21; x += 2) dot(c, x, 9 + (x % 3), '#5a6a72');
      for (let x = 12; x < 20; x += 2) dot(c, x, 14 + (x % 2), '#5a6a72');
    },
  },
  {
    name: 'tv',
    solid: true,
    draw: (c, r) => {
      boards(c, r);
      rect(c, 4, 20, 24, 10, '#2a1e16'); // cabinet
      rect(c, 8, 23, 16, 3, '#1a1a1a'), rect(c, 9, 24, 8, 1, '#3a3a3a'); // the VCR
      rect(c, 5, 3, 22, 17, '#3a3a40');
      rect(c, 7, 5, 18, 13, '#7a8088');
      speckle(c, r, 7, 5, 18, 13, ['#c8ccd0', '#3a3e44', '#e8ecf0'], 70); // static
    },
  },
  {
    // The tape has played. The screen shows a well, in a clearing, waiting.
    name: 'tvWell',
    solid: true,
    draw: (c, r) => {
      boards(c, r);
      rect(c, 4, 20, 24, 10, '#2a1e16');
      rect(c, 8, 23, 16, 3, '#1a1a1a'), rect(c, 9, 24, 8, 1, '#c02020');
      rect(c, 5, 3, 22, 17, '#3a3a40');
      rect(c, 7, 5, 18, 13, '#4a5a5a');
      rect(c, 7, 13, 18, 5, '#2a3a2a');
      rect(c, 12, 10, 8, 5, '#8a8a88'), rect(c, 13, 10, 6, 1, '#1a1a1a'); // the well
      speckle(c, r, 7, 5, 18, 13, ['#8a9090', '#2a3030'], 25);
    },
  },
  {
    // Sinister nod: a box of old film reels, labelled in neat handwriting.
    name: 'filmBox',
    solid: true,
    draw: (c, r) => {
      boards(c, r);
      rect(c, 4, 12, 24, 16, '#8a7050');
      frame(c, 4, 12, 24, 16, '#5a4430');
      rect(c, 10, 17, 12, 5, '#e8e0c8');
      for (const x of [9, 17]) {
        rect(c, x, 4, 8, 8, '#2a2a2e'), frame(c, x, 4, 8, 8, '#5a5a62'), dot(c, x + 3, 7, '#8a8a92');
      }
    },
  },
  { name: 'wall14', solid: true, draw: (c, r) => writing(c, r, '14') },
  { name: 'wall10', solid: true, draw: (c, r) => writing(c, r, '10') },
  { name: 'redFloor', draw: (c, r) => boards(c, r, '#4a1a1c') },
  { name: 'redWall', solid: true, draw: (c, r) => paper(c, r, RED) },
  { name: 'red14', solid: true, draw: (c, r) => writing(c, r, '14', RED) },
  { name: 'red10', solid: true, draw: (c, r) => writing(c, r, '10', RED) },
  {
    // Only her glasses can see this door: an outline of light in the red paper.
    name: 'hiddenDoor',
    solid: true,
    draw: (c, r) => {
      paper(c, r, RED);
      frame(c, 6, 2, 20, 30, GLOW);
      frame(c, 7, 3, 18, 28, shade(GLOW, -0.5));
      dot(c, 21, 17, GLOW);
    },
  },
  {
    // The tall mirror in the Red Room. Only you in it. Usually.
    name: 'redMirror',
    solid: true,
    draw: (c, r) => {
      paper(c, r, RED);
      rect(c, 8, 1, 16, 25, GOLD);
      rect(c, 10, 3, 12, 21, '#2a2a34');
      rect(c, 11, 4, 3, 19, '#4a4a58');
    },
  },
  { name: 'hiddenFloor', draw: (c, r) => boards(c, r, PLANK, false) },
  { name: 'hiddenWall', solid: true, draw: (c, r) => paper(c, r, '#6a4e3a') },
  {
    // Shelves of everything anyone ever lost: jars, books, a lamp, a crown, a frog card, a coin.
    name: 'hiddenShelf',
    solid: true,
    draw: (c) => {
      rect(c, 0, 0, T, T, '#3a2618');
      for (const y of [9, 19, 29]) rect(c, 0, y, T, 2, '#22160c');
      rect(c, 2, 3, 4, 6, '#4a7aa8'), rect(c, 8, 1, 3, 8, '#8a2a2a'), rect(c, 11, 2, 3, 7, '#2a6a3a');
      rect(c, 17, 5, 6, 4, GOLD), dot(c, 18, 4, GOLD), dot(c, 20, 4, GOLD), dot(c, 22, 4, GOLD); // a crown
      rect(c, 25, 4, 5, 5, '#c8b8a0');
      rect(c, 3, 13, 6, 6, '#6a4a8a'), rect(c, 11, 15, 4, 4, GOLD), rect(c, 17, 12, 4, 7, '#e8e0c8');
      rect(c, 23, 14, 6, 5, '#5a3a2a');
      rect(c, 2, 23, 8, 6, '#2a2a2e'), rect(c, 13, 24, 5, 5, '#a8c8a8'), rect(c, 21, 22, 7, 7, '#8a6a4a');
    },
  },
  {
    // A heap of lost things, taller than she is. Most things are.
    name: 'junkPile',
    solid: true,
    draw: (c, r) => {
      boards(c, r, PLANK, false);
      rect(c, 3, 14, 26, 14, '#5a4030');
      rect(c, 6, 8, 20, 8, '#6a4a38');
      rect(c, 11, 3, 10, 6, '#7a5a40');
      rect(c, 5, 16, 6, 5, '#8a2a2a'), rect(c, 14, 10, 5, 4, '#4a7aa8'), rect(c, 20, 18, 6, 6, '#c8b8a0');
      rect(c, 13, 4, 4, 3, GOLD), dot(c, 24, 13, GOLD), dot(c, 8, 12, GOLD);
      rect(c, 12, 20, 7, 2, '#e8e0c8');
    },
  },
];
