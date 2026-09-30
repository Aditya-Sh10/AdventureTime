import { Dialogue } from './systems/dialogue';
import story from '@/story/main.ink';

/** Shared singletons used by both Phaser scenes and React UI. */
export const dialogue = new Dialogue(story);

// DEV-only hooks for e2e tests and console debugging.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  void import('./systems/events').then(({ bus }) => Object.assign(window, { __dialogue: dialogue, __bus: bus }));
}
