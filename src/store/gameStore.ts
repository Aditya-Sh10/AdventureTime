import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

/** UI mode decides who owns input: Phaser (play) or React (everything else). */
export type UiMode = 'title' | 'play' | 'dialogue' | 'paused';

export interface DialogueLine {
  /** Increments per line so UI can reset its typewriter. */
  id: number;
  speaker: string;
  text: string;
  portrait?: string;
}

export interface GameState {
  mode: UiMode;
  line: DialogueLine | null;
  choices: string[];
  /** ms timestamp of last dialogue close; Phaser ignores interact briefly after it. */
  dialogueClosedAt: number;
  setMode: (mode: UiMode) => void;
}

/** Vanilla store so Phaser scenes can read/write without React. */
export const gameStore = createStore<GameState>()((set) => ({
  mode: 'title',
  line: null,
  choices: [],
  dialogueClosedAt: 0,
  setMode: (mode) => set({ mode }),
}));

export const useGame = <T,>(selector: (s: GameState) => T) => useStore(gameStore, selector);
