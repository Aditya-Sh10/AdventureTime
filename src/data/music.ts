/**
 * Chiptune score, played by systems/music.ts. Original compositions except `birthday` (public domain).
 * Notes: one token per 8th-note step — `C5`, `F#3`, `Bb2`; `-` holds the previous note; `.` is a rest.
 * All tracks of a song loop together, so pad them to the same length.
 */

export type SongId = 'home' | 'castle' | 'forest' | 'court' | 'rift' | 'tower' | 'birthday';

export interface Track {
  wave: OscillatorType;
  gain: number;
  /** 'pluck' decays fast (music box, arps); 'hold' sustains for the note's written length. */
  env: 'pluck' | 'hold';
  notes: string;
}

export interface Song {
  /** Quarter-note BPM; one step is an 8th. */
  bpm: number;
  tracks: Track[];
}

export const isSongId = (s: string | undefined): s is SongId => !!s && s in SONGS;

const rep = (s: string, n: number) => Array(n).fill(s).join(' ');

export const SONGS: Record<SongId, Song> = {
  // Prologue: her room, a quiet evening. C · Am · F · G.
  home: {
    bpm: 84,
    tracks: [
      {
        wave: 'triangle',
        gain: 0.11,
        env: 'hold',
        notes:
          'E5 - D5 C5 - - G4 - A4 - C5 E5 - - D5 C5 D5 - C5 A4 - - F4 G4 B4 - - G4 - - . . ' +
          'E5 - G5 - E5 D5 C5 - C5 - E5 - D5 C5 A4 - A4 - C5 - F5 - E5 D5 D5 - - B4 - - G4 -',
      },
      {
        wave: 'sine',
        gain: 0.16,
        env: 'pluck',
        notes: rep('C3 - . C3 G2 - . G2 A2 - . A2 E2 - . E2 F2 - . F2 C3 - . C3 G2 - . G2 D3 - . B2', 2),
      },
    ],
  },

  // Castle (hall, library): a curious little waltz in A minor.
  castle: {
    bpm: 104,
    tracks: [
      {
        wave: 'sine',
        gain: 0.12,
        env: 'pluck',
        notes:
          'E5 - A5 - C6 - C6 - A5 - F5 - E5 - G5 - C6 D6 B5 - - - G#5 - ' +
          'A5 - C6 - E6 - F6 - E6 - D6 - B5 - G#5 - E5 - A5 - - - . .',
      },
      {
        wave: 'triangle',
        gain: 0.13,
        env: 'pluck',
        notes:
          'A2 - E3 - A3 - F2 - C3 - F3 - C3 - G3 - C4 - E2 - B2 - G#3 - ' +
          'A2 - E3 - A3 - D3 - A3 - D4 - E2 - B2 - G#3 - A2 - E3 - A2 -',
      },
    ],
  },

  // Forbidden forest: a low ostinato in D dorian, melody barely there.
  forest: {
    bpm: 76,
    tracks: [
      {
        wave: 'sine',
        gain: 0.06,
        env: 'pluck',
        notes: 'D4 F4 A4 F4 D4 F4 A4 F4 C4 E4 G4 E4 C4 E4 G4 E4 Bb3 D4 F4 D4 Bb3 D4 F4 D4 C4 E4 G4 E4 C4 E4 G4 E4',
      },
      {
        wave: 'triangle',
        gain: 0.09,
        env: 'hold',
        notes: '. . A4 - - - . . . . G4 - E4 - . . . . F4 - - D4 - . . . E4 - - - . .',
      },
      { wave: 'sine', gain: 0.16, env: 'hold', notes: 'D2 - - - - - - - C2 - - - - - - - Bb1 - - - - - - - C2 - - - - - - -' },
    ],
  },

  // Wizengamot: brisk courtroom bounce in G minor.
  court: {
    bpm: 126,
    tracks: [
      {
        wave: 'square',
        gain: 0.06,
        env: 'hold',
        notes: 'D5 - Bb4 - G4 . D5 Eb5 D5 - C5 Bb4 - - G4 - A4 - C5 - F5 - Eb5 D5 C5 - A4 - F#4 - D4 -',
      },
      {
        wave: 'triangle',
        gain: 0.17,
        env: 'pluck',
        notes: 'G2 G3 G2 G3 G2 G3 D3 F3 Eb2 Eb3 Eb2 Eb3 Eb2 Eb3 Bb2 D3 F2 F3 F2 F3 F2 F3 C3 Eb3 D2 D3 D2 D3 F#2 A2 C3 D3',
      },
    ],
  },

  // Multiverse rift: neon arps in E minor.
  rift: {
    bpm: 112,
    tracks: [
      {
        wave: 'square',
        gain: 0.03,
        env: 'pluck',
        notes: 'E4 G4 B4 E5 B4 G4 E4 G4 C4 E4 G4 C5 G4 E4 C4 E4 G4 B4 D5 G5 D5 B4 G4 B4 D4 F#4 A4 D5 A4 F#4 D4 F#4',
      },
      { wave: 'triangle', gain: 0.09, env: 'hold', notes: 'B4 - - - - - - - C5 - - - G4 - - - D5 - - - B4 - - - A4 - - - F#4 - - -' },
      {
        wave: 'triangle',
        gain: 0.13,
        env: 'pluck',
        notes: 'E2 E2 E3 E2 E2 E2 E3 E2 C2 C2 C3 C2 C2 C2 C3 C2 G2 G2 G3 G2 G2 G2 G3 G2 D2 D2 D3 D2 D2 D2 D3 D2',
      },
    ],
  },

  // Astronomy tower, before midnight: slow, starry, F major.
  tower: {
    bpm: 70,
    tracks: [
      {
        wave: 'sine',
        gain: 0.07,
        env: 'pluck',
        notes: 'F4 A4 C5 A4 F5 C5 A4 C5 D4 F4 A4 F4 D5 A4 F4 A4 Bb3 D4 F4 D4 Bb4 F4 D4 F4 C4 E4 G4 E4 C5 G4 E4 G4',
      },
      { wave: 'triangle', gain: 0.09, env: 'hold', notes: 'C5 - - - A4 - - - F5 - - - D5 - - - D5 - C5 - Bb4 - - - C5 - - - - - . .' },
      { wave: 'sine', gain: 0.14, env: 'hold', notes: 'F2 - - - - - - - D2 - - - - - - - Bb1 - - - - - - - C2 - - - - - - -' },
    ],
  },

  // Midnight. Music box, 3/4. (Traditional — public domain.)
  birthday: {
    bpm: 96,
    tracks: [
      {
        wave: 'sine',
        gain: 0.16,
        env: 'pluck',
        notes:
          'G4 G4 A4 - G4 - C5 - B4 - - - G4 G4 A4 - G4 - D5 - C5 - - - G4 G4 ' +
          'G5 - E5 - C5 - B4 - A4 - F5 F5 E5 - C5 - D5 - C5 - - - . . . . . . . . . .',
      },
      {
        wave: 'triangle',
        gain: 0.1,
        env: 'pluck',
        notes:
          '. . C3 - G3 - E3 - G2 - D3 - B2 - G2 - F3 - B2 - C3 - G3 - E3 - ' +
          'C3 - Bb3 - E3 - F2 - C3 - A3 - C3 - E3 - G2 - C3 - - - . . . . . . . . . .',
      },
    ],
  },
};
