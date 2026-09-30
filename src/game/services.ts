import { Dialogue } from './systems/dialogue';
import prologue from '@/story/prologue.ink';

/** Shared singletons used by both Phaser scenes and React UI. */
export const dialogue = new Dialogue(prologue);
