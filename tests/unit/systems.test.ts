import { describe, expect, it } from 'vitest';
import { evaluate } from '@/game/systems/conditions';
import { hintLevelFor } from '@/game/systems/hints';
import { readSave, SAVE_VERSION, writeSave, type SaveData } from '@/game/systems/save';
import { Dialogue } from '@/game/systems/dialogue';
import { MAPS } from '@/data/maps';
import { LEGEND } from '@/data/maps/legend';
import { QUESTS } from '@/data/quests';
import story from '@/story/main.ink';

describe('conditions', () => {
  const vars: Record<string, unknown> = { a: true, b: false, n: 2 };
  const get = (k: string) => vars[k];
  it('handles truthy, negation, comparisons and &&', () => {
    expect(evaluate(undefined, get)).toBe(true);
    expect(evaluate('a', get)).toBe(true);
    expect(evaluate('!b', get)).toBe(true);
    expect(evaluate('n>=2 && a', get)).toBe(true);
    expect(evaluate('n==3', get)).toBe(false);
    expect(evaluate('missing', get)).toBe(false);
  });
  it('rejects garbage', () => {
    expect(() => evaluate('a ||', get)).toThrow();
  });
});

describe('hints', () => {
  it('escalates at 45/90/150 s', () => {
    expect(hintLevelFor(10_000)).toBe(0);
    expect(hintLevelFor(45_000)).toBe(1);
    expect(hintLevelFor(100_000)).toBe(2);
    expect(hintLevelFor(999_000)).toBe(3);
  });
  it('every quest has 3 hints', () => {
    for (const q of Object.values(QUESTS)) expect(q.hints).toHaveLength(3);
  });
});

describe('save', () => {
  const mem = () => {
    const m = new Map<string, string>();
    return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) };
  };
  const data: SaveData = { v: SAVE_VERSION, map: 'hall', x: 1, y: 2, facing: 'up', ink: '{}', inventory: ['letter'], quest: null, playMs: 5, savedAt: 1 };
  it('round-trips', () => {
    const kv = mem();
    writeSave(data, kv);
    expect(readSave(kv)).toEqual(data);
  });
  it('rejects corrupt or wrong-version saves', () => {
    const kv = mem();
    kv.setItem('bq-save', '{not json');
    expect(readSave(kv)).toBeNull();
    kv.setItem('bq-save', JSON.stringify({ ...data, v: 999 }));
    expect(readSave(kv)).toBeNull();
  });
});

describe('map data integrity', () => {
  const d = new Dialogue(story);
  for (const map of Object.values(MAPS)) {
    it(`${map.id}: rectangular grid, known tiles, valid knots`, () => {
      const w = map.grid[0].length;
      for (const row of map.grid) expect(row.length).toBe(w);
      for (const ch of map.grid.join('')) expect(LEGEND[ch], `tile char "${ch}"`).toBeDefined();
      for (const o of map.objects) {
        if ('knot' in o) expect(d.hasKnot(o.knot), `knot ${o.knot}`).toBe(true);
        expect(o.x).toBeLessThan(w);
        expect(o.y).toBeLessThan(map.grid.length);
      }
    });
  }
});
