export const CHAPTERS = {
  prologue: { kicker: 'Prologue', title: 'The Letter' },
  ch1: { kicker: 'Chapter One', title: 'The Castle' },
} as const;

export type ChapterId = keyof typeof CHAPTERS;
export const isChapterId = (id: string): id is ChapterId => id in CHAPTERS;

/** Contract clauses, unlocked one per chapter via ink VAR `clauses`. */
export const CLAUSES = [
  'The Guide shall accompany the Seeker until the Hidden Treasure is found. The Guide may not resign, retire, feign illness, or "go and brew something."',
];
