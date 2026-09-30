import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';
import { useStore } from 'zustand';

export type TextSpeed = 'slow' | 'normal' | 'fast' | 'instant';
export type Scare = 'full' | 'reduced' | 'gentle';

export interface Settings {
  textSpeed: TextSpeed;
  master: number;
  sfx: number;
  music: number;
  voices: boolean;
  reducedMotion: boolean;
  scare: Scare;
  hints: boolean;
  lighting: boolean;
  set: (patch: Partial<Omit<Settings, 'set'>>) => void;
}

export const CHARS_PER_SEC: Record<TextSpeed, number> = { slow: 25, normal: 45, fast: 80, instant: Infinity };

export const settingsStore = createStore<Settings>()(
  persist(
    (set) => ({
      textSpeed: 'normal',
      master: 0.8,
      sfx: 0.8,
      music: 0.6,
      voices: true,
      reducedMotion: false,
      scare: 'full',
      hints: true,
      lighting: true,
      set: (patch) => set(patch),
    }),
    { name: 'bq-settings', version: 1 },
  ),
);

export const useSettings = <T,>(selector: (s: Settings) => T) => useStore(settingsStore, selector);
