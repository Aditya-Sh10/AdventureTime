import { TILE as T } from '../constants';
import { dot, frame, rect, shade, speckle, type Ctx } from './draw';
import { GOLD, type TileDef } from './tileKit';

/**
 * Finale: the top of the Astronomy Tower. Cosy, not scary (she's afraid of heights): a wide stone platform, a
 * chest-high wall all the way round, no visible drop. Night sky with stars instead of an edge.
 */

const STONE = '#6a6680';
const NIGHT = '#0e1030';

/** Big square flagstones (four per tile, each a slightly different shade) — not bricks. */
function towerStone(c: Ctx, r: () => number, alt = false) {
  const shades = alt ? [-0.04, 0.03, 0.05, -0.07] : [0.02, -0.06, -0.02, 0.05];
  shades.forEach((s, i) => rect(c, (i % 2) * 16, Math.floor(i / 2) * 16, 16, 16, shade(STONE, s)));
  rect(c, 15, 0, 2, T, shade(STONE, -0.3)), rect(c, 0, 15, T, 2, shade(STONE, -0.3));
  rect(c, 0, 0, 1, T, shade(STONE, 0.1)), rect(c, 0, 0, T, 1, shade(STONE, 0.1));
  speckle(c, r, 0, 0, T, T, [shade(STONE, 0.1), shade(STONE, -0.12)], 18);
}

function sky(c: Ctx, r: () => number) {
  rect(c, 0, 0, T, T, NIGHT);
  speckle(c, r, 0, 0, T, T, ['#2a2c5a', '#1a1c44'], 10);
  for (let i = 0; i < 3; i++) dot(c, Math.floor(r() * T), Math.floor(r() * T), r() > 0.5 ? '#ffffff' : '#c8d0ff');
  if (r() > 0.7) {
    const x = 4 + Math.floor(r() * 24);
    const y = 4 + Math.floor(r() * 24);
    rect(c, x - 1, y, 3, 1, '#fff6c8'), rect(c, x, y - 1, 1, 3, '#fff6c8'); // a brighter, twinkly one
  }
}

export const TOWER_TILES: TileDef[] = [
  { name: 'towerStone', draw: (c, r) => towerStone(c, r) },
  { name: 'towerStone2', draw: (c, r) => towerStone(c, r, true) },
  { name: 'skyStars', solid: true, draw: (c, r) => sky(c, r) },
  {
    // Chest-high crenellated wall: the only thing between her and the view, and it is plenty.
    name: 'battlement',
    solid: true,
    draw: (c, r) => {
      sky(c, r);
      rect(c, 0, 10, T, 22, '#5a5670');
      rect(c, 2, 2, 12, 9, '#5a5670'), rect(c, 18, 2, 12, 9, '#5a5670');
      rect(c, 2, 2, 12, 2, '#7a7690'), rect(c, 18, 2, 12, 2, '#7a7690'), rect(c, 0, 10, 2, 2, '#7a7690');
      rect(c, 14, 10, 4, 2, '#7a7690'), rect(c, 30, 10, 2, 2, '#7a7690');
      for (let y = 16; y < T; y += 7) rect(c, 0, y, T, 1, '#46425a');
      rect(c, 10, 16, 1, 7, '#46425a'), rect(c, 22, 23, 1, 7, '#46425a');
    },
  },
  {
    name: 'telescope',
    solid: true,
    draw: (c, r) => {
      towerStone(c, r);
      rect(c, 15, 18, 2, 10, '#3a2a1c');
      rect(c, 9, 27, 14, 2, '#3a2a1c');
      for (let i = 0; i < 10; i++) rect(c, 8 + Math.round(i * 1.5), 16 - i, 4, 4, i < 7 ? '#b08a3a' : GOLD); // brass tube, tilted up
      rect(c, 22, 5, 5, 5, '#d8b860');
      dot(c, 24, 7, '#1a1c3a');
    },
  },
  {
    name: 'chest',
    solid: true,
    draw: (c, r) => {
      towerStone(c, r);
      rect(c, 4, 12, 24, 16, '#6b4528');
      rect(c, 4, 8, 24, 6, '#7a5232');
      rect(c, 4, 8, 24, 1, '#8a6040');
      for (const x of [8, 22]) rect(c, x, 8, 2, 20, '#4a4a52');
      rect(c, 4, 14, 24, 1, '#3a2414');
      rect(c, 13, 13, 6, 6, GOLD);
      frame(c, 13, 13, 6, 6, '#8a6a2a');
      for (let i = 0; i < 4; i++) dot(c, 14 + i, 16, '#3a2414'); // the four wheels
    },
  },
  {
    // Lid up, nothing inside. Spectacularly nothing.
    name: 'chestOpen',
    solid: true,
    draw: (c, r) => {
      towerStone(c, r);
      rect(c, 4, 2, 24, 9, '#7a5232'); // lid, thrown back
      rect(c, 4, 2, 24, 1, '#8a6040');
      rect(c, 4, 14, 24, 14, '#6b4528');
      rect(c, 6, 12, 20, 6, '#1a120c'); // the empty inside
      for (const x of [8, 22]) rect(c, x, 14, 2, 14, '#4a4a52');
      rect(c, 13, 18, 6, 4, GOLD);
      dot(c, 12, 15, '#3a3030'), dot(c, 20, 16, '#3a3030'); // dust
    },
  },
];
