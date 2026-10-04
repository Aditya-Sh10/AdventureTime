import { TILE as T } from '../constants';
import { dot, frame, rect, shade, speckle, type Ctx } from './draw';
import { GOLD, type TileDef } from './tileKit';

/** Chapter 3: the Wizengamot courtroom. Mahogany + gold; the gallery is full of identical wigged spectators. */

const MAHOGANY = '#5a2a1e';
const MAHOG_LIT = '#7a3c28';
const MAHOG_DARK = '#3a1a12';
const PANEL = '#4a2218';

/** Herringbone parquet in dark honey wood. */
function parquet(c: Ctx, r: () => number) {
  rect(c, 0, 0, T, T, '#6e4a2c');
  for (let y = 0; y < T; y += 8) {
    for (let x = 0; x < T; x += 16) {
      const off = (y / 8) % 2 ? 8 : 0;
      rect(c, (x + off) % T, y, 8, 7, '#7d5634');
      rect(c, (x + off + 8) % T, y, 8, 7, '#694428');
    }
    rect(c, 0, y + 7, T, 1, '#4e321c');
  }
  speckle(c, r, 0, 0, T, T, ['#87603a', '#5f3e24'], 16);
}

/** Polished wood front with a gold trim line (benches, desks, rails share it). */
function woodFront(c: Ctx, top: number, base = MAHOGANY) {
  rect(c, 0, top, T, T - top, base);
  rect(c, 0, top, T, 3, shade(base, 0.12));
  rect(c, 0, top + 3, T, 1, GOLD);
  rect(c, 0, T - 3, T, 3, shade(base, -0.15));
}

/** One wigged spectator from behind/above: curly white wig, dark robe shoulders. */
function spectator(c: Ctx, x: number, tone: number) {
  const robe = shade('#1d1b22', tone * 0.05);
  const WIG = '#ece8de';
  const CURL = '#bdb6a6';
  rect(c, x, 15, 12, 7, robe);
  rect(c, x + 2, 3, 8, 3, WIG); // wig crown
  rect(c, x, 5, 12, 10, WIG); // side rolls, wider than the face
  for (let y = 6; y < 15; y += 2)
    (dot(c, x, y, CURL), dot(c, x + 11, y, CURL), dot(c, x + 1, y + 1, CURL), dot(c, x + 10, y + 1, CURL));
  for (let i = 0; i < 3; i++) dot(c, x + 3 + i * 3, 4, CURL);
  rect(c, x + 3, 7, 6, 6, '#d9b48f'); // face, very faceless
  (dot(c, x + 4, 9, '#3a2a2a'), dot(c, x + 7, 9, '#3a2a2a'));
}

function pewBack(c: Ctx, r: () => number) {
  parquet(c, r);
  rect(c, 0, 20, T, 10, MAHOGANY);
  rect(c, 0, 20, T, 2, MAHOG_LIT);
  rect(c, 0, 28, T, 2, MAHOG_DARK);
}

export const COURT_TILES: TileDef[] = [
  { name: 'courtFloor', draw: (c, r) => parquet(c, r) },
  {
    // Mahogany wall panelling with gold mouldings.
    name: 'panelWall',
    solid: true,
    draw: (c) => {
      rect(c, 0, 0, T, T, PANEL);
      frame(c, 3, 3, 26, 22, MAHOG_LIT);
      rect(c, 4, 4, 24, 20, shade(PANEL, -0.04));
      rect(c, 0, 27, T, 5, MAHOG_DARK);
      rect(c, 0, 26, T, 1, GOLD);
    },
  },
  {
    // The Wizengamot crest: a gold "W" over crossed quills.
    name: 'crestWall',
    solid: true,
    draw: (c) => {
      rect(c, 0, 0, T, T, PANEL);
      rect(c, 0, 27, T, 5, MAHOG_DARK);
      rect(c, 0, 26, T, 1, GOLD);
      rect(c, 7, 3, 18, 20, '#2a1a3a');
      frame(c, 7, 3, 18, 20, GOLD);
      for (let i = 0; i < 5; i++) (dot(c, 10 + i, 7 + i * 2, GOLD), dot(c, 22 - i, 7 + i * 2, GOLD));
      rect(c, 15, 11, 2, 6, GOLD);
      dot(c, 16, 9, GOLD);
    },
  },
  {
    // "A very famous bearded man, waving." Sticky note on the frame. (Her dad approves.)
    name: 'leaderPortrait',
    solid: true,
    draw: (c) => {
      rect(c, 0, 0, T, T, PANEL);
      rect(c, 0, 27, T, 5, MAHOG_DARK);
      rect(c, 0, 26, T, 1, GOLD);
      rect(c, 6, 2, 20, 22, GOLD);
      rect(c, 8, 4, 16, 18, '#e9a24a'); // saffron-ish backdrop
      rect(c, 12, 6, 7, 7, '#c99a74'); // face
      rect(c, 11, 5, 9, 2, '#e8e4dc'); // white hair
      rect(c, 12, 11, 7, 4, '#e8e4dc'); // white beard
      rect(c, 10, 15, 11, 7, '#f4efe2'); // kurta
      (rect(c, 20, 9, 2, 6, '#c99a74'), rect(c, 20, 7, 3, 3, '#c99a74')); // waving hand
      rect(c, 4, 20, 7, 7, '#f5e663'); // sticky note
      for (let y = 22; y < 26; y += 2) rect(c, 5, y, 5, 1, '#8a7a2a');
    },
  },
  {
    // Low wooden bar (the rail between dais/court and court/gallery).
    name: 'rail',
    solid: true,
    draw: (c, r) => {
      parquet(c, r);
      rect(c, 0, 12, T, 4, MAHOG_LIT);
      rect(c, 0, 12, T, 1, GOLD);
      for (let x = 3; x < T; x += 8) (rect(c, x, 16, 3, 13, MAHOGANY), rect(c, x, 16, 1, 13, MAHOG_LIT));
      rect(c, 0, 28, T, 2, MAHOG_DARK);
    },
  },
  {
    name: 'dais',
    draw: (c, r) => (parquet(c, r), (c.globalAlpha = 0.35), rect(c, 0, 0, T, T, '#2a1020'), (c.globalAlpha = 1)),
  },
  {
    // Judge's bench, three tiles: left / crest middle / right. Tall, so the judge looms.
    name: 'benchL',
    solid: true,
    draw: (c) => (woodFront(c, 0), frame(c, 6, 8, 22, 16, MAHOG_LIT), rect(c, 0, 0, 3, T, MAHOG_DARK)),
  },
  {
    name: 'benchM',
    solid: true,
    draw: (c) => {
      woodFront(c, 0);
      rect(c, 9, 8, 14, 16, '#2a1a3a');
      frame(c, 9, 8, 14, 16, GOLD);
      // Scales of justice, in gold leaf.
      (rect(c, 15, 10, 2, 11, GOLD), rect(c, 12, 20, 8, 2, GOLD));
      rect(c, 11, 11, 10, 1, GOLD);
      (dot(c, 11, 12, GOLD), dot(c, 20, 12, GOLD));
      (rect(c, 10, 15, 4, 1, GOLD), dot(c, 10, 14, GOLD), dot(c, 13, 14, GOLD));
      (rect(c, 18, 15, 4, 1, GOLD), dot(c, 18, 14, GOLD), dot(c, 21, 14, GOLD));
      (rect(c, 12, 2, 8, 3, '#d8ccb0'), rect(c, 12, 2, 8, 1, '#efe2c2')); // papers on top
    },
  },
  {
    name: 'benchR',
    solid: true,
    draw: (c) => (woodFront(c, 0), frame(c, 4, 8, 22, 16, MAHOG_LIT), rect(c, 29, 0, 3, T, MAHOG_DARK)),
  },
  {
    // Clerk's desk with a sign: "TAREEKH PE TAREEKH" (dates on dates; nothing ever ends).
    name: 'clerkDesk',
    solid: true,
    draw: (c, r) => {
      parquet(c, r);
      woodFront(c, 10);
      rect(c, 4, 2, 24, 10, '#efe2c2');
      frame(c, 4, 2, 24, 10, MAHOG_DARK);
      for (let x = 6; x < 26; x += 4) (rect(c, x, 5, 3, 1, '#7a2a2a'), rect(c, x, 8, 3, 1, '#7a2a2a'));
      (rect(c, 2, 16, 6, 8, '#c9b48a'), rect(c, 3, 14, 6, 3, '#b8a07a')); // stacked files
    },
  },
  {
    // Witness box: a little wooden pen with a gold rail.
    name: 'witnessBox',
    solid: true,
    draw: (c, r) => {
      parquet(c, r);
      rect(c, 2, 8, 28, 22, MAHOGANY);
      rect(c, 2, 8, 28, 3, MAHOG_LIT);
      rect(c, 2, 11, 28, 1, GOLD);
      frame(c, 6, 15, 20, 11, MAHOG_LIT);
      rect(c, 2, 28, 28, 2, MAHOG_DARK);
    },
  },
  {
    // Counsel tables (two tiles), green baize top.
    name: 'counselL',
    solid: true,
    draw: (c, r) => {
      parquet(c, r);
      (rect(c, 0, 8, T, 14, '#2f5a3a'), rect(c, 0, 8, T, 2, '#3f7a4a'));
      (rect(c, 0, 22, T, 3, MAHOGANY), rect(c, 2, 25, 3, 6, MAHOG_DARK));
      (rect(c, 10, 11, 10, 7, '#efe2c2'), rect(c, 14, 11, 1, 7, '#b8a888')); // brief
      rect(c, 23, 10, 2, 8, '#2a2a30'); // quill
    },
  },
  {
    name: 'counselR',
    solid: true,
    draw: (c, r) => {
      parquet(c, r);
      (rect(c, 0, 8, T, 14, '#2f5a3a'), rect(c, 0, 8, T, 2, '#3f7a4a'));
      (rect(c, 0, 22, T, 3, MAHOGANY), rect(c, 27, 25, 3, 6, MAHOG_DARK));
      (rect(c, 4, 12, 9, 5, '#7a2a2a'), rect(c, 6, 10, 9, 4, '#2a3a6a')); // law books
      rect(c, 18, 11, 6, 6, '#d8ccb0');
    },
  },
  {
    // Evidence table: tagged papers and a magnifying glass.
    name: 'evidenceTable',
    solid: true,
    draw: (c, r) => {
      parquet(c, r);
      (rect(c, 1, 8, 30, 14, MAHOGANY), rect(c, 1, 8, 30, 2, MAHOG_LIT));
      (rect(c, 3, 22, 3, 8, MAHOG_DARK), rect(c, 26, 22, 3, 8, MAHOG_DARK));
      (rect(c, 5, 11, 8, 8, '#f1ead8'), rect(c, 11, 10, 3, 3, '#e05a4a')); // tagged parchment
      rect(c, 17, 12, 6, 6, '#c9b48a');
      (frame(c, 22, 9, 5, 5, '#c0c4cc'), rect(c, 26, 14, 2, 3, '#6b4528')); // magnifier
    },
  },
  { name: 'pew', solid: true, draw: (c, r) => pewBack(c, r) },
  {
    // Pew with two wigged spectators. They never turn around.
    name: 'pewCrowd',
    solid: true,
    draw: (c, r) => {
      pewBack(c, r);
      spectator(c, 2, 0);
      spectator(c, 17, 1);
    },
  },
  {
    // Gallery floor with a small folding step-stool on it.
    name: 'stoolFloor',
    draw: (c, r) => {
      parquet(c, r);
      (rect(c, 9, 14, 14, 4, '#9a6a3a'), rect(c, 9, 14, 14, 1, '#c08a52'));
      (rect(c, 10, 18, 2, 8, '#6b4528'), rect(c, 20, 18, 2, 8, '#6b4528'));
      rect(c, 12, 22, 8, 1, '#6b4528');
      rect(c, 12, 15, 7, 2, '#efe2c2'); // label
    },
  },
];
