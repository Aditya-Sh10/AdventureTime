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

  it('chapter 2 forest: lantern → tracks → stalker + Lumos → G. note → burrows → Niffler trade → clause 3 → exit', () => {
    d.set('snape_bound', true);
    d.set('ch1_done', true);
    d.set('clauses', 2);
    d.set('fragments', 1);
    d.start('forest_arrive');
    runToEnd(d);
    expect(gameStore.getState()).toMatchObject({ quest: 'c2_lantern', chapterCard: 'ch2' });

    d.start('forest_lantern');
    runToEnd(d);
    expect(d.get('lantern')).toBe(1);
    expect(gameStore.getState().inventory).toContain('lantern');
    expect(gameStore.getState().quest).toBe('c2_tracks');

    for (const k of ['forest_track_1', 'forest_track_2', 'forest_stalker', 'forest_g_note', 'forest_track_3']) {
      d.start(k);
      runToEnd(d);
    }
    expect(d.get('lantern')).toBe(2); // Snape's Lumos
    expect(d.get('tracks')).toBe(3);
    expect(gameStore.getState().quest).toBe('c2_burrows');

    // The Niffler is in whichever burrow is checked third; re-checks don't count.
    d.start('forest_burrow_c');
    runToEnd(d);
    d.start('forest_burrow_c');
    runToEnd(d);
    d.start('forest_burrow_a');
    runToEnd(d);
    expect(d.get('niffler_found')).toBe(false);
    d.start('forest_burrow_b');
    runToEnd(d);
    expect(d.get('niffler_found')).toBe(true);
    expect(gameStore.getState().quest).toBe('c2_niffler');

    d.start('forest_exit'); // not without the coin
    runToEnd(d);
    expect(d.get('ch2_done')).toBe(false);

    d.start('niffler'); // choice 0 = offer an earring
    runToEnd(d);
    expect(gameStore.getState().inventory).toContain('coin4');
    expect(d.get('fragments')).toBe(2);
    expect(d.get('clauses')).toBe(3);
    expect(gameStore.getState().quest).toBe('c2_exit');

    const end = vi.fn();
    const off = bus.on('end-demo', end);
    d.start('forest_exit');
    runToEnd(d);
    off();
    expect(end).toHaveBeenCalledOnce();
    expect(gameStore.getState()).toMatchObject({ endOf: 'ch2', quest: null });
  });

  it('chapter 2: haggling with the Niffler loops back until you trade', () => {
    d.start('niffler');
    d.advance();
    d.advance();
    expect(gameStore.getState().choices.length).toBe(3);
    d.choose(2); // just take the coin → it bites your sleeve → back to the offer
    for (let i = 0; i < 10 && !gameStore.getState().choices.length; i++) d.advance();
    expect(gameStore.getState().choices.length).toBe(2);
    expect(d.get('touched_forbidden')).toBe(1);
  });

  it('chapter 3 court: counsel → evidence → trial (stats) → objection duel → verdict, case 1 + clause 4', () => {
    d.set('snape_bound', true);
    d.set('ch2_done', true);
    d.set('clauses', 3);
    d.set('fragments', 2);
    d.set('touched_forbidden', 2);
    d.start('court_arrive');
    runToEnd(d);
    expect(gameStore.getState()).toMatchObject({ quest: 'c3_counsel', chapterCard: 'ch3' });

    // Evidence is guarded until you have a lawyer, and the bench refuses an unprepared defence.
    d.start('court_stool');
    runToEnd(d);
    expect(d.get('ev_stool')).toBe(false);
    d.start('court_judge');
    runToEnd(d);
    expect(d.get('trial_started')).toBe(false);

    d.start('divisha');
    runToEnd(d);
    expect(d.get('evidence')).toBe(1); // Clause Three counts
    expect(gameStore.getState().quest).toBe('c3_evidence');
    for (const k of ['court_evidence_table', 'court_stool']) {
      d.start(k);
      runToEnd(d);
    }
    expect(gameStore.getState().inventory).toEqual(expect.arrayContaining(['receipt', 'stool']));
    expect(d.get('evidence')).toBe(3);
    expect(gameStore.getState().quest).toBe('c3_trial');

    // The trial reads her stats aloud, then opens the duel after the box closes.
    d.start('court_judge');
    const lines: string[] = [];
    while (gameStore.getState().mode === 'dialogue') {
      const st = gameStore.getState();
      if (st.line) lines.push(st.line.text);
      if (st.choices.length) d.choose(0);
      else d.advance();
    }
    expect(lines.join(' ')).toContain('touched 2 things');
    expect(gameStore.getState()).toMatchObject({ mode: 'puzzle', puzzle: 'trial' });
    gameStore.setState({ mode: 'play', puzzle: null }); // stepped back (Esc)…

    d.start('court_judge'); // …and resumed straight into the duel
    while (gameStore.getState().mode === 'dialogue') d.advance();
    expect(gameStore.getState().puzzle).toBe('trial');
    gameStore.setState({ mode: 'play', puzzle: null });

    const end = vi.fn();
    const off = bus.on('end-demo', end);
    d.start('court_verdict');
    runToEnd(d);
    off();
    expect(gameStore.getState().inventory).toContain('case1');
    expect(d.get('fragments')).toBe(3);
    expect(d.get('clauses')).toBe(4);
    expect(d.get('ch3_done')).toBe(true);
    expect(end).toHaveBeenCalledOnce();
    expect(gameStore.getState()).toMatchObject({ endOf: 'ch3', quest: null });
  });

  it('chapter 4 rift: bat → radar shard → web-zip shard → lantern shard → core, zero + clause 5', () => {
    d.set('snape_bound', true);
    d.set('ch3_done', true);
    d.set('clauses', 4);
    d.set('fragments', 3);
    d.start('rift_arrive');
    runToEnd(d);
    expect(gameStore.getState()).toMatchObject({ quest: 'c4_shards', chapterCard: 'ch4' });

    // The core refuses until all three shards are in; the zip needs the web-shooter first.
    d.start('rift_core');
    runToEnd(d);
    expect(d.get('core_done')).toBe(false);
    const warp = vi.fn();
    const offWarp = bus.on('load-map', warp);
    d.start('q_zip_there');
    runToEnd(d);
    expect(warp).not.toHaveBeenCalled();

    d.start('matt');
    runToEnd(d);
    expect(d.get('radar')).toBe(true);
    d.start('hk_shard');
    runToEnd(d);

    d.start('spidey');
    runToEnd(d);
    expect(gameStore.getState().inventory).toContain('webShooter');
    d.start('q_zip_there');
    runToEnd(d);
    expect(warp).toHaveBeenCalledWith({ map: 'rift', spawn: 'far' });
    offWarp();
    d.start('q_shard');
    runToEnd(d);

    d.start('rapunzel');
    runToEnd(d);
    for (const k of ['tower_lamp_a', 'tower_lamp_b', 'tower_lamp_c']) {
      d.start(k);
      runToEnd(d);
    }
    expect(d.get('shards')).toBe(3);
    expect(gameStore.getState().inventory).toEqual(expect.arrayContaining(['shardRed', 'shardBlue', 'shardGold']));
    expect(gameStore.getState().quest).toBe('c4_core');

    const end = vi.fn();
    const off = bus.on('end-demo', end);
    d.start('rift_core');
    runToEnd(d);
    off();
    const inv = gameStore.getState().inventory;
    expect(inv).toEqual(expect.arrayContaining(['zero', 'batplush']));
    expect(inv).not.toContain('shardRed');
    expect(d.get('fragments')).toBe(4);
    expect(d.get('clauses')).toBe(5);
    expect(end).toHaveBeenCalledOnce();
    expect(gameStore.getState()).toMatchObject({ endOf: 'ch4', quest: null });
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
