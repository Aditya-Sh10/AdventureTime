/**
 * Puzzle modals, opened by ink tag `# puzzle:<id>`. On success the modal runs `solved` (an ink knot);
 * cancelling just returns to play. Keep them gentle: she doesn't play games and hates being stuck,
 * so every puzzle shows `hint` after a couple of wrong tries.
 */
export interface CodePuzzle {
  kind: 'code';
  title: string;
  prompt: string;
  /** Characters each wheel cycles through. */
  symbols: string;
  answer: string;
  solved: string;
  /** Snape's reactions to wrong answers, cycled. */
  wrong: string[];
  hint: string;
}

export const PUZZLES = {
  restricted: {
    kind: 'code',
    title: 'The Restricted Section',
    prompt: 'A brass lock with four letter wheels. Engraved above it: "Say the name of the one who was expected."',
    symbols: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    answer: 'ISHU',
    solved: 'restricted_unlocked',
    wrong: [
      'No.',
      'Also no. The lock is beginning to pity you.',
      'Miss Ishu. The books. The numbered books.',
    ],
    hint: 'Book 1, book 2, book 3, book 4. One letter each. In that order.',
  },
} satisfies Record<string, CodePuzzle>;

export type PuzzleId = keyof typeof PUZZLES;
export const isPuzzleId = (id: string): id is PuzzleId => id in PUZZLES;
/** Wrong tries before the modal shows the puzzle's hint. */
export const HINT_AFTER_TRIES = 2;
