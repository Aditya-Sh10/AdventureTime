import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import type { ItemId } from '@/data/items';
import type { QuestId } from '@/data/quests';
import type { ChapterId } from '@/data/chapters';
import type { PuzzleId } from '@/data/puzzles';

/** UI mode decides who owns input: Phaser (play) or React (everything else). */
export type UiMode = 'title' | 'play' | 'dialogue' | 'menu' | 'puzzle' | 'ended';
export type MenuTab = 'items' | 'settings' | 'system';

export interface DialogueLine {
  /** Increments per line so UI can reset its typewriter. */
  id: number;
  speaker: string;
  text: string;
  portrait?: string;
}

export interface Toast {
  id: number;
  speaker: string;
  text: string;
  portrait?: string;
  icon?: string;
}

export interface GameState {
  mode: UiMode;
  menuTab: MenuTab;
  line: DialogueLine | null;
  choices: string[];
  /** ms timestamp of last dialogue close; Phaser ignores interact briefly after it. */
  dialogueClosedAt: number;
  inventory: ItemId[];
  quest: QuestId | null;
  /** session.playMs when the quest was set (hint timing). */
  questSetAt: number;
  hintLevel: number;
  toast: Toast | null;
  chapterCard: ChapterId | null;
  mapName: string;
  /** Open puzzle modal (mode 'puzzle'). */
  puzzle: PuzzleId | null;
  /** Chapter whose results card is showing (mode 'ended'); null = generic demo end. */
  endOf: ChapterId | null;
  setMode: (mode: UiMode) => void;
}

export const initialGame = {
  mode: 'title' as UiMode,
  menuTab: 'items' as MenuTab,
  line: null,
  choices: [],
  dialogueClosedAt: 0,
  inventory: [],
  quest: null,
  questSetAt: 0,
  hintLevel: 0,
  toast: null,
  chapterCard: null,
  mapName: '',
  puzzle: null as PuzzleId | null,
  endOf: null as ChapterId | null,
};

/** Vanilla store so Phaser scenes and systems can read/write without React. */
export const gameStore = createStore<GameState>()((set) => ({
  ...initialGame,
  setMode: (mode) => set({ mode }),
}));

export const useGame = <T,>(selector: (s: GameState) => T) => useStore(gameStore, selector);

let toastId = 0;
export function showToast(t: Omit<Toast, 'id'>) {
  gameStore.setState({ toast: { ...t, id: ++toastId } });
}
