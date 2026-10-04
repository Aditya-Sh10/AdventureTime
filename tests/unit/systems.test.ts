import { describe, expect, it } from 'vitest';
import { evaluate } from '@/game/systems/conditions';
import { hintLevelFor } from '@/game/systems/hints';
import { readSave, SAVE_VERSION, writeSave, type SaveData } from '@/game/systems/save';
import { Dialogue } from '@/game/systems/dialogue';
import { MAPS } from '@/data/maps';
import { LEGEND } from '@/data/maps/legend';
import { QUESTS } from '@/data/quests';
import { PUZZLES } from '@/data/puzzles';
import { CHAPTERS, CLAUSES } from '@/data/chapters';
import { TILE_INDEX } from '@/game/art/tiles';
import { LANTERN_RADII, lanternFlicker, lanternRadius } from '@/game/systems/lantern';
import { codeText, isSolved, newCode, newDuel, pickExhibit, spin } from '@/game/systems/puzzle';
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
        if (o.kind === 'tile') expect(TILE_INDEX[o.tile], `tile ${o.tile}`).toBeDefined();
        expect(o.x).toBeLessThan(w);
        expect(o.y).toBeLessThan(map.grid.length);
      }
    });
  }
});

describe('story ↔ data integrity', () => {
  const d = new Dialogue(story);
  const sources = import.meta.glob<string>('/src/story/*.ink', { query: '?raw', import: 'default', eager: true });
  // Story lines only: main.ink's header comments document the tags with placeholder args.
  const ink = Object.values(sources)
    .join('\n')
    .split('\n')
    .filter((l) => !l.trim().startsWith('//'))
    .join('\n');

  it('every # warp:<map>:<spawn> targets a real map + spawn', () => {
    const warps = [...ink.matchAll(/#\s*warp:(\w+):(\w+)/g)];
    expect(warps.length).toBeGreaterThan(0);
    for (const [, map, spawn] of warps) expect(MAPS[map]?.spawns[spawn], `${map}:${spawn}`).toBeDefined();
  });

  it('every # puzzle:<id> exists and its solved knot exists', () => {
    for (const [, id] of ink.matchAll(/#\s*puzzle:(\w+)/g)) expect(PUZZLES[id as keyof typeof PUZZLES], id).toBeDefined();
    for (const p of Object.values(PUZZLES)) {
      expect(d.hasKnot(p.solved), p.solved).toBe(true);
      if (p.kind === 'code') expect([...p.answer].every((c) => p.symbols.includes(c))).toBe(true);
      else for (const r of p.rounds) expect(p.exhibits.some((e) => e.id === r.answer), r.answer).toBe(true);
    }
  });

  it('every legend tile is drawn, and every chapter Continue targets a real map + spawn', () => {
    for (const name of Object.values(LEGEND)) expect(TILE_INDEX[name], name).toBeDefined();
    for (const ch of Object.values(CHAPTERS)) {
      const next = 'outro' in ch ? (ch.outro as { next?: readonly [string, string] }).next : undefined;
      if (next) expect(MAPS[next[0]]?.spawns[next[1]], next.join(':')).toBeDefined();
    }
  });

  it('a clause exists for every ~ clauses = N', () => {
    for (const [, n] of ink.matchAll(/~\s*clauses\s*=\s*(\d+)/g)) expect(CLAUSES.length).toBeGreaterThanOrEqual(Number(n));
  });
});

describe('code lock', () => {
  const S = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  it('spins with wrap-around and checks the answer', () => {
    let c = newCode(4);
    c = spin(c, 0, -1, S.length);
    expect(codeText(c, S)).toBe('ZAAA');
    c = spin(c, 0, 1, S.length);
    expect(codeText(c, S)).toBe('AAAA');
    const ishu = [...'ISHU'].map((ch) => S.indexOf(ch));
    expect(isSolved(ishu, S, 'ishu')).toBe(true);
    expect(isSolved(c, S, 'ISHU')).toBe(false);
  });
});

describe('objection duel', () => {
  const answers = ['stool', 'receipt', 'clause3'];
  it('wrong picks stay on the round and count tries; right picks advance and reset tries', () => {
    let s = newDuel();
    let r = pickExhibit(s, 'receipt', answers);
    expect(r.correct).toBe(false);
    expect(r.state).toMatchObject({ round: 0, tries: 1, done: false });
    s = pickExhibit(r.state, 'stool', answers).state;
    expect(s).toMatchObject({ round: 1, tries: 0, done: false });
    s = pickExhibit(s, 'receipt', answers).state;
    r = pickExhibit(s, 'clause3', answers);
    expect(r.correct).toBe(true);
    expect(r.state.done).toBe(true);
    // finished duels ignore further picks
    expect(pickExhibit(r.state, 'clause3', answers)).toMatchObject({ correct: false, state: r.state });
  });
});

describe('lantern', () => {
  it('maps ink levels to radii, clamped, and grows', () => {
    expect(lanternRadius(0)).toBe(LANTERN_RADII[0]);
    expect(lanternRadius(2)).toBeGreaterThan(lanternRadius(1));
    expect(lanternRadius(99)).toBe(LANTERN_RADII[LANTERN_RADII.length - 1]);
    expect(lanternRadius(-3)).toBe(LANTERN_RADII[0]);
    expect(lanternRadius(Number.NaN)).toBe(LANTERN_RADII[0]);
  });
  it('flickers within ±6%, flat with reduced motion', () => {
    for (let t = 0; t < 5000; t += 37) {
      const f = lanternFlicker(t, false);
      expect(f).toBeGreaterThanOrEqual(0.94);
      expect(f).toBeLessThanOrEqual(1.06);
    }
    expect(lanternFlicker(1234, true)).toBe(1);
  });
});
