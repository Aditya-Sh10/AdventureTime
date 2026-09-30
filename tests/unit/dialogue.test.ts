import { beforeEach, describe, expect, it } from 'vitest';
import { Dialogue, parseLine } from '@/game/systems/dialogue';
import { gameStore } from '@/store/gameStore';
import prologue from '@/story/prologue.ink';

describe('parseLine', () => {
  it('splits speaker and reads portrait tag', () => {
    expect(parseLine('Snape: No.', ['portrait:snape'])).toMatchObject({ speaker: 'Snape', text: 'No.', portrait: 'snape' });
  });
  it('treats lines without speaker as narration', () => {
    expect(parseLine('It is dark.', [])).toMatchObject({ speaker: '', text: 'It is dark.', portrait: undefined });
  });
});

describe('Dialogue (ink bridge)', () => {
  let d: Dialogue;
  beforeEach(() => {
    gameStore.setState({ mode: 'play', line: null, choices: [] });
    d = new Dialogue(prologue);
  });

  it('runs the sign knot through a choice and closes', () => {
    d.start('sign');
    expect(gameStore.getState().mode).toBe('dialogue');
    expect(gameStore.getState().line?.speaker).toBe('Snape');
    d.advance();
    d.advance();
    expect(gameStore.getState().choices).toEqual(['Read the sign', 'Apologise']);
    d.choose(1);
    expect(gameStore.getState().line?.text).toMatch(/discarded/);
    d.advance();
    expect(gameStore.getState().mode).toBe('play');
  });

  it('remembers state across visits', () => {
    d.start('sign');
    d.advance();
    d.advance();
    d.choose(0);
    d.advance();
    d.advance();
    d.start('sign');
    expect(gameStore.getState().line?.text).toMatch(/2 times/);
  });
});
