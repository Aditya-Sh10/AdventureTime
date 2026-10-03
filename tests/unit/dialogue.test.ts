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

  it('chapter 1: bind Snape, riddle, clue, figure, library warp', () => {
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

    const warp = vi.fn();
    const offWarp = bus.on('load-map', warp);
    d.start('library_door');
    runToEnd(d);
    offWarp();
    expect(warp).toHaveBeenCalledWith({ map: 'library', spawn: 'entry' });
  });

  it('chapter 1 library: books → gate puzzle → map + clause 2 → empty hall → chapter end', () => {
    d.set('snape_bound', true);
    d.set('clauses', 1);
    d.start('library_arrive');
    runToEnd(d);
    expect(gameStore.getState().quest).toBe('c1_books');

    d.start('library_exit'); // can't leave before the Map
    runToEnd(d);
    for (const k of ['pince', 'book_1', 'book_2', 'book_3']) {
      d.start(k);
      runToEnd(d);
    }
    expect(d.get('books')).toBe(3);
    d.start('book_1'); // re-reading doesn't double count
    runToEnd(d);
    d.start('book_4');
    runToEnd(d);
    expect(d.get('books')).toBe(4);
    expect(gameStore.getState().quest).toBe('c1_gate');

    // The gate opens the puzzle modal only after the box closes.
    d.start('restricted_gate');
    while (gameStore.getState().mode === 'dialogue') d.advance();
    expect(gameStore.getState()).toMatchObject({ mode: 'puzzle', puzzle: 'restricted' });
    gameStore.setState({ mode: 'play', puzzle: null }); // what the modal does on success, then:
    d.start('restricted_unlocked');
    runToEnd(d);
    expect(d.get('restricted_open')).toBe(true);

    d.start('restricted_lectern');
    runToEnd(d);
    expect(gameStore.getState().inventory).toContain('map');
    expect(d.get('clauses')).toBe(2);
    expect(d.get('ch1_done')).toBe(true);
    expect(gameStore.getState().quest).toBe('c1_return');

    const warp = vi.fn();
    const offWarp = bus.on('load-map', warp);
    d.start('library_exit');
    runToEnd(d);
    offWarp();
    expect(warp).toHaveBeenCalledWith({ map: 'hall', spawn: 'library' });

    const end = vi.fn();
    const offEnd = bus.on('end-demo', end);
    d.start('hall_empty');
    runToEnd(d);
    offEnd();
    expect(end).toHaveBeenCalledOnce();
    expect(gameStore.getState()).toMatchObject({ endOf: 'ch1', quest: null });
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
