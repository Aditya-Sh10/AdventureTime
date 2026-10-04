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

/** Courtroom duel: each round a claim; pick the exhibit that counters it. Wrong picks cost nothing but pride. */
export interface ObjectionPuzzle {
  kind: 'objection';
  title: string;
  exhibits: { id: string; name: string; desc: string }[];
  rounds: {
    speaker: string;
    claim: string;
    /** Exhibit id that wins the round. */
    answer: string;
    /** What Ishu shouts when she gets it right. */
    objection: string;
    /** Snape's reactions to wrong picks this round, cycled. */
    wrong: string[];
    hint: string;
  }[];
  solved: string;
}

export type Puzzle = CodePuzzle | ObjectionPuzzle;

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
  trial: {
    kind: 'objection',
    title: 'The Wizengamot v. The Seeker',
    exhibits: [
      { id: 'stool', name: 'Folding Step-Stool', desc: '"Property of the Defendant. Required for most shelves."' },
      { id: 'receipt', name: 'Owl-Post Receipt', desc: '"Unblocked: the very next day." Stamped.' },
      { id: 'clause3', name: 'Contract, Clause Three', desc: '"The Guide may NOT tell the Seeker to calm down."' },
    ],
    rounds: [
      {
        speaker: 'Snape',
        claim: 'The defendant tampered with a book on the TOP shelf of the Restricted Section. I saw the shelf. It was disturbed.',
        answer: 'stool',
        objection: 'I am four foot eleven. I cannot reach the top shelf. I cannot reach the MIDDLE shelf.',
        wrong: [
          'That is not relevant to shelves.',
          'Miss Ishu. Think about the top shelf. Think about yourself. Think about the distance between them.',
        ],
        hint: 'How tall is the defendant, exactly? Something in your evidence proves it.',
      },
      {
        speaker: 'Guddu',
        claim: 'She BLOCKED him. G. I saw it. I see everything. I am basically a criminal mastermind.',
        answer: 'receipt',
        objection: 'I unblocked him the very next day. HE was the one who blocked ME back!',
        wrong: [
          'The witness is smirking. That is never a good sign.',
          'Your sister is enjoying this far too much. Show the court what happened AFTER.',
        ],
        hint: 'Who unblocked whom, and when? There is an official record.',
      },
      {
        speaker: 'Snape',
        claim: 'Very well. The prosecution rests. And may I say, Miss Ishu... calm down.',
        answer: 'clause3',
        objection: 'Clause Three! Clause THREE! You are NOT allowed to tell me to calm down! Penalty: being beaten up!',
        wrong: [
          'I am merely suggesting composure.',
          'Is there, perhaps, something in a certain Contract about what I may not say to you.',
        ],
        hint: 'He just told you to calm down. Is he allowed to? Check the Contract.',
      },
    ],
    solved: 'court_verdict',
  },
} satisfies Record<string, Puzzle>;

export type PuzzleId = keyof typeof PUZZLES;
export const isPuzzleId = (id: string): id is PuzzleId => id in PUZZLES;
/** Wrong tries before the modal shows the puzzle's hint. */
export const HINT_AFTER_TRIES = 2;
