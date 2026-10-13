import { describe, expect, it } from 'vitest';
import { GATE_ANSWER, GATE_MAX, GATE_MIN, GATE_START, booksFor, feetInches, liveCaption, tease } from '@/data/gate';

describe('height gate', () => {
  it("the answer is 4'11\" and the pencil does not start on it", () => {
    expect(feetInches(GATE_ANSWER)).toBe(`4'11"`);
    expect(GATE_START).not.toBe(GATE_ANSWER);
    expect(GATE_ANSWER).toBeGreaterThan(GATE_MIN);
    expect(GATE_ANSWER).toBeLessThan(GATE_MAX);
  });

  it('formats feet and inches', () => {
    expect(feetInches(48)).toBe(`4'0"`);
    expect(feetInches(64)).toBe(`5'4"`);
    expect(feetInches(78)).toBe(`6'6"`);
  });

  it('stacks a book per two claimed inches over 4\'11"', () => {
    expect(booksFor(GATE_ANSWER)).toBe(0);
    expect(booksFor(55)).toBe(0);
    expect(booksFor(60)).toBe(1);
    expect(booksFor(64)).toBe(3);
  });

  it('every wrong height gets a tease, and repeat tries vary it', () => {
    for (let h = GATE_MIN; h <= GATE_MAX; h++) {
      expect(liveCaption(h).length).toBeGreaterThan(5);
      if (h === GATE_ANSWER) continue;
      expect(tease(h, 0).length).toBeGreaterThan(5);
      expect(tease(h, 0)).not.toBe(tease(h, 1));
    }
  });
});
