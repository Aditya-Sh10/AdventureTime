import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Dialogue, parseLine } from '@/game/systems/dialogue';
import { bus } from '@/game/systems/events';
import { gameStore, initialGame } from '@/store/gameStore';
import story from '@/story/main.ink';

/** Advance through lines, picking choice `pick` whenever choices appear, until the dialogue closes. */
function runToEnd(d: Dialogue, pick = 0, max = 80) {
  for (let i = 0; i < max && gameStore.getState().mode === 'dialogue'; i++) {
    if (gameStore.getState().choices.length) d.choose(pick);
    else d.advance();
  }
  expect(gameStore.getState().mode).toBe('play');
}

describe('parseLine', () => {
  it('splits known speakers and reads portrait tag', () => {
    expect(parseLine('Snape: No.', ['portrait:snape'])).toMatchObject({ speaker: 'Snape', text: 'No.', portrait: 'snape' });
  });
  it('treats unknown "X:" prefixes as narration', () => {
    expect(parseLine('Tucked behind it: a card.', [])).toMatchObject({ speaker: '', text: 'Tucked behind it: a card.' });
  });
});

describe('story (main.ink) via Dialogue', () => {
  let d: Dialogue;
  beforeEach(() => {
    gameStore.setState({ ...initialGame, mode: 'play' });
    d = new Dialogue(story);
  });

  it('prologue: opening → owl letter → frame warp to hall', () => {
    d.start('p_opening');
    runToEnd(d);
    expect(gameStore.getState().quest).toBe('p_window');
    expect(gameStore.getState().chapterCard).toBe('prologue');

    d.start('room_window');
    runToEnd(d, 0);
    expect(gameStore.getState().inventory).toContain('letter');
    expect(gameStore.getState().quest).toBe('p_frame');

    const warp = vi.fn();
    const off = bus.on('load-map', warp);
    d.start('room_frame');
    // warp must wait until the dialogue closes
    while (gameStore.getState().mode === 'dialogue') {
      expect(warp).not.toHaveBeenCalled();
      if (gameStore.getState().choices.length) d.choose(0);
      else d.advance();
    }
    off();
    expect(warp).toHaveBeenCalledWith({ map: 'hall', spawn: 'arrive' });
  });

  it('chapter 1: bind Snape, riddle, clue, figure, demo end', () => {
    d.start('hall_intro');
    runToEnd(d);
    expect(d.get('snape_bound')).toBe(true);
    expect(gameStore.getState().inventory).toContain('contract');
    expect(gameStore.getState().quest).toBe('c1_clue');

    d.start('banner_red'); // before the riddle: nothing found
    runToEnd(d);
    expect(d.get('clue1')).toBe(false);

    d.start('cauldron');
    runToEnd(d);
    d.start('cauldron');
    runToEnd(d);
    expect(d.get('touched_forbidden')).toBe(2);

    d.start('portrait_violet');
    runToEnd(d);
    expect(d.get('heard_riddle')).toBe(true);

    const show = vi.fn();
    const offShow = bus.on('show', show);
    d.start('banner_red');
    runToEnd(d);
    offShow();
    expect(show).toHaveBeenCalledWith({ what: 'figure' });
    expect(d.get('clue1')).toBe(true);
    expect(gameStore.getState().inventory).toContain('frogCard');
    expect(gameStore.getState().quest).toBe('c1_library');

    const end = vi.fn();
    const offEnd = bus.on('end-demo', end);
    d.start('library_door');
    runToEnd(d);
    offEnd();
    expect(end).toHaveBeenCalledOnce();
  });

  it('saves and restores all ink state', () => {
    d.start('hall_intro');
    runToEnd(d);
    const json = d.saveJson();
    const d2 = new Dialogue(story);
    d2.loadJson(json);
    expect(d2.get('snape_bound')).toBe(true);
    expect(d2.get('clauses')).toBe(1);
  });
});
