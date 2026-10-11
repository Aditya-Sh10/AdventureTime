import type { CharId } from '@/game/art/characters';

/** Dialogue speaker → portrait character + voice blip (Hz, waveform). */
export interface Speaker {
  char?: CharId;
  pitch: number;
  wave: OscillatorType;
}

export const SPEAKERS: Record<string, Speaker> = {
  Snape: { char: 'snape', pitch: 98, wave: 'sawtooth' },
  Ishu: { char: 'ishu', pitch: 392, wave: 'triangle' },
  McGonagall: { char: 'mcgonagall', pitch: 262, wave: 'square' },
  Ginny: { char: 'ginny', pitch: 349, wave: 'triangle' },
  'Madam Pince': { char: 'pince', pitch: 523, wave: 'sine' },
  Violet: { pitch: 440, wave: 'sine' },
  'Sir Cadogan': { pitch: 175, wave: 'square' },
  Owl: { pitch: 587, wave: 'sine' },
  Divisha: { char: 'divisha', pitch: 330, wave: 'triangle' },
  Guddu: { char: 'guddu', pitch: 440, wave: 'square' },
  Niffler: { char: 'niffler', pitch: 740, wave: 'square' },
  Matt: { char: 'daredevil', pitch: 147, wave: 'triangle' },
  'Spider-Man': { char: 'spidey', pitch: 330, wave: 'square' },
  Rapunzel: { char: 'rapunzel', pitch: 494, wave: 'sine' },
  Lily: { char: 'lily', pitch: 620, wave: 'triangle' },
};

export const NARRATOR: Speaker = { pitch: 196, wave: 'sine' };
export const speakerOf = (name: string) => SPEAKERS[name] ?? NARRATOR;
