import { describe, expect, it } from 'vitest';
import { SONGS, isSongId } from '@/data/music';
import { MAPS } from '@/data/maps';
import { parseTrack } from '@/game/systems/music';
import { noteHz } from '@/game/systems/synth';
import { surfaceOf } from '@/game/systems/footsteps';

describe('music score', () => {
  it('converts note names', () => {
    expect(noteHz('A4')).toBeCloseTo(440);
    expect(noteHz('C4')).toBeCloseTo(261.63, 1);
    expect(noteHz('Bb2')).toBeCloseTo(116.54, 1);
    expect(noteHz('F#3')).toBeCloseTo(185, 0);
  });

  it('parses holds and rests', () => {
    const { events, steps } = parseTrack('C4 - - . E4 .');
    expect(steps).toBe(6);
    expect(events.map((e) => [e.step, e.len])).toEqual([[0, 3], [4, 1]]);
  });

  for (const [id, song] of Object.entries(SONGS)) {
    it(`${id}: every note is valid and all tracks loop together`, () => {
      const parsed = song.tracks.map((t) => parseTrack(t.notes));
      for (const p of parsed) for (const e of p.events) expect(e.hz, id).toBeGreaterThan(20);
      expect(new Set(parsed.map((p) => p.steps)).size, `${id} track lengths ${parsed.map((p) => p.steps)}`).toBe(1);
    });
  }

  it('every map names a known song (or none) and an ambience', () => {
    for (const m of Object.values(MAPS)) {
      if (m.music) expect(isSongId(m.music), m.id).toBe(true);
      expect(m.ambience, m.id).toBeTruthy();
    }
  });
});

describe('footsteps', () => {
  it('maps floor tiles to surfaces', () => {
    expect(surfaceOf('grass')).toBe('grass');
    expect(surfaceOf('carpetL')).toBe('carpet');
    expect(surfaceOf('planks')).toBe('wood');
    expect(surfaceOf('riftBridge')).toBe('metal');
    expect(surfaceOf('stone')).toBe('stone');
    expect(surfaceOf(undefined)).toBe('stone');
  });
});
