import { TILE as T } from '../constants';
import { dot, frame, rect, shade, speckle, type Ctx } from './draw';
import { GOLD, bricks, type TileDef } from './tileKit';

/**
 * Chapter 4: the Multiverse Rift. A neon hub floating in the void, plus three borrowed universes:
 * a Hell's Kitchen rooftop (tar, brick, water tower), Queens rooftops (same kit, bluer), and a painted tower top.
 * The map is dark (lantern) so these stay mid-tone; Light2D does the neon.
 */

const GRID = '#2a1c48';
const SEAM = '#5a3488';
const NEON = '#ff3cc8';
const CYAN = '#3ce8ff';
const TAR = '#34303a';
const TOWER = '#7a6a8a';

function riftFloor(c: Ctx, r: () => number, seam = false) {
  rect(c, 0, 0, T, T, GRID);
  rect(c, 0, 0, T, 1, SEAM);
  rect(c, 0, 0, 1, T, SEAM);
  speckle(c, r, 0, 0, T, T, ['#34245a', '#22163a'], 18);
  if (seam) {
    // A crack in reality, glowing faintly at the edges.
    const pts = [[4, 26], [9, 20], [13, 21], [18, 14], [22, 15], [27, 7]] as const;
    for (const [x, y] of pts) (rect(c, x, y, 4, 1, NEON), dot(c, x, y + 1, shade(NEON, -0.3)));
  }
}

function tear(c: Ctx, r: () => number, color: string) {
  riftFloor(c, r);
  // A swirling ring with a hole of another universe in it (reads as a doorway, not a pickup).
  for (let a = 0; a < 64; a++) {
    const t = (a / 64) * Math.PI * 2;
    const x = 16 + Math.round(Math.cos(t) * 12);
    const y = 16 + Math.round(Math.sin(t) * 13);
    rect(c, x - 1, y - 1, 3, 3, a % 8 < 4 ? color : shade(color, -0.25));
  }
  rect(c, 7, 6, 18, 20, shade(color, -0.6));
  rect(c, 5, 9, 22, 14, shade(color, -0.6));
  for (let i = 0; i < 3; i++) rect(c, 9 + i * 2, 12 + i * 3, 10 - i * 2, 1, shade(color, -0.15)); // swirl
  speckle(c, r, 8, 8, 16, 16, ['#ffffff', color], 6);
}

function roof(c: Ctx, r: () => number, base = TAR) {
  rect(c, 0, 0, T, T, base);
  speckle(c, r, 0, 0, T, T, [shade(base, 0.05), shade(base, -0.06), '#2a2730'], 40);
  rect(c, 0, 31, T, 1, shade(base, -0.1)); // tar seams line up into roofing sheets
  rect(c, 21, 0, 1, T, shade(base, -0.08));
}

function towerFloor(c: Ctx, r: () => number) {
  rect(c, 0, 0, T, T, TOWER);
  rect(c, 0, 15, T, 1, '#5c4f6c');
  rect(c, 0, 31, T, 1, '#5c4f6c');
  rect(c, 11, 0, 1, 15, '#5c4f6c');
  rect(c, 23, 16, 1, 15, '#5c4f6c');
  speckle(c, r, 0, 0, T, T, ['#8a7a9a', '#6c5c7c'], 22);
}

export const RIFT_TILES: TileDef[] = [
  { name: 'riftFloor', draw: (c, r) => riftFloor(c, r) },
  { name: 'riftSeam', draw: (c, r) => riftFloor(c, r, true) },
  {
    // Neon bridge planks over nothing.
    name: 'riftBridge',
    draw: (c) => {
      rect(c, 0, 0, T, T, '#07060a');
      rect(c, 4, 0, 24, T, '#3a2460');
      for (let y = 0; y < T; y += 6) rect(c, 4, y, 24, 1, SEAM);
      rect(c, 4, 0, 1, T, CYAN), rect(c, 27, 0, 1, T, CYAN);
    },
  },
  {
    name: 'riftBridgeH',
    draw: (c) => {
      rect(c, 0, 0, T, T, '#07060a');
      rect(c, 0, 4, T, 24, '#3a2460');
      for (let x = 0; x < T; x += 6) rect(c, x, 4, 1, 24, SEAM);
      rect(c, 0, 4, T, 1, CYAN), rect(c, 0, 27, T, 1, CYAN);
    },
  },
  { name: 'tearRed', draw: (c, r) => tear(c, r, '#ff3448') },
  { name: 'tearBlue', draw: (c, r) => tear(c, r, '#3c8cff') },
  { name: 'tearGold', draw: (c, r) => tear(c, r, '#ffc23c') },
  { name: 'roof', draw: (c, r) => roof(c, r) },
  {
    name: 'parapet',
    solid: true,
    draw: (c, r) => {
      bricks(c, r, '#6a3a30');
      rect(c, 0, 0, T, 4, '#8a8690'); // concrete coping
      rect(c, 0, 4, T, 1, '#5a5660');
    },
  },
  {
    name: 'waterTower',
    solid: true,
    draw: (c, r) => {
      roof(c, r);
      rect(c, 5, 22, 2, 9, '#2a2420'), rect(c, 25, 22, 2, 9, '#2a2420'), rect(c, 15, 22, 2, 9, '#2a2420');
      rect(c, 4, 6, 24, 17, '#6e4a30');
      for (let x = 6; x < 28; x += 4) rect(c, x, 6, 1, 17, '#58381f');
      rect(c, 4, 10, 24, 1, '#3a3a40'), rect(c, 4, 18, 24, 1, '#3a3a40');
      rect(c, 6, 2, 20, 4, '#4a3a2a'), rect(c, 10, 0, 12, 2, '#4a3a2a');
    },
  },
  {
    name: 'skylight',
    solid: true,
    draw: (c, r) => {
      roof(c, r);
      rect(c, 5, 6, 22, 20, '#55525c');
      rect(c, 7, 8, 18, 16, '#1c2a44');
      rect(c, 15, 8, 2, 16, '#55525c'), rect(c, 7, 15, 18, 2, '#55525c');
      dot(c, 10, 11, '#8ab0ff'), dot(c, 20, 19, '#8ab0ff');
    },
  },
  {
    name: 'chimney',
    solid: true,
    draw: (c, r) => {
      roof(c, r);
      rect(c, 8, 4, 16, 24, '#7a3a2c');
      for (let y = 8; y < 28; y += 6) rect(c, 8, y, 16, 1, '#4e2218');
      rect(c, 6, 2, 20, 4, '#8a8690');
      rect(c, 10, 3, 12, 2, '#1a161c');
    },
  },
  { name: 'towerFloor', draw: (c, r) => towerFloor(c, r) },
  {
    // Stone wall she has painted every inch of: vines and little flowers.
    name: 'towerWall',
    solid: true,
    draw: (c) => {
      rect(c, 0, 0, T, T, '#5a4a6e');
      rect(c, 0, 27, T, 5, '#3e3250');
      for (let i = 0; i < 6; i++) rect(c, 3 + i * 5, 4 + ((i * 7) % 15), 2, 8, '#4a8a4e');
      for (let i = 0; i < 5; i++) (dot(c, 4 + i * 6, 6 + ((i * 11) % 16), '#ff9ac8'), dot(c, 6 + i * 6, 14 + ((i * 5) % 9), '#ffd84a'));
    },
  },
  {
    // A painted sun with wavy rays, the tower's favourite motif.
    name: 'sunWall',
    solid: true,
    draw: (c) => {
      rect(c, 0, 0, T, T, '#5a4a6e');
      rect(c, 0, 27, T, 5, '#3e3250');
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        rect(c, 16 + Math.round(Math.cos(a) * 10) - 1, 13 + Math.round(Math.sin(a) * 10) - 1, 3, 3, '#e8a63a');
      }
      rect(c, 11, 8, 10, 10, '#ffd84a');
      rect(c, 10, 10, 12, 6, '#ffd84a');
      rect(c, 13, 11, 6, 4, '#ff9a3a');
    },
  },
  {
    name: 'brunoDoor',
    solid: true,
    draw: (c) => {
      rect(c, 0, 0, T, T, '#5a4a6e');
      rect(c, 0, 27, T, 5, '#3e3250');
      rect(c, 7, 4, 18, 23, '#2e5a3a');
      frame(c, 7, 4, 18, 23, '#1a3a24');
      rect(c, 9, 7, 14, 6, '#d8cfa8'); // the sign nobody reads aloud
      for (let x = 10; x < 22; x += 2) dot(c, x, 10, '#2a2a30');
      dot(c, 21, 17, GOLD);
    },
  },
  {
    // Cracked core pedestal with three empty sockets.
    name: 'riftCore',
    solid: true,
    draw: (c, r) => {
      riftFloor(c, r);
      rect(c, 4, 10, 24, 18, '#2a1f3e');
      rect(c, 4, 10, 24, 2, '#4a3a6a');
      rect(c, 6, 26, 20, 2, '#120a1e');
      for (const [x, col] of [[8, '#ff3448'], [15, '#3c8cff'], [22, '#ffc23c']] as const) {
        rect(c, x - 1, 15, 4, 4, '#07060a'), frame(c, x - 1, 15, 4, 4, shade(col, -0.3));
      }
      rect(c, 12, 20, 1, 6, NEON), dot(c, 13, 22, NEON), dot(c, 14, 23, NEON);
    },
  },
  {
    // Majnu bhai's masterpiece, floating in the void on an easel. A horse. Very confident.
    name: 'majnuPainting',
    solid: true,
    draw: (c, r) => {
      riftFloor(c, r);
      rect(c, 8, 22, 2, 9, '#6b4528'), rect(c, 22, 22, 2, 9, '#6b4528');
      rect(c, 3, 3, 26, 20, GOLD);
      rect(c, 5, 5, 22, 16, '#cfe3f0');
      rect(c, 5, 16, 22, 5, '#8ab060');
      rect(c, 10, 9, 11, 5, '#7a4a2a'); // horse body
      rect(c, 19, 6, 4, 5, '#7a4a2a'); // head, held high
      rect(c, 11, 14, 1, 4, '#5a3418'), rect(c, 19, 14, 1, 4, '#5a3418');
      rect(c, 8, 10, 2, 3, '#3a2010');
      dot(c, 21, 7, '#101010');
    },
  },
];
