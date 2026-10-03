export interface ChapterDef {
  kicker: string;
  title: string;
  /** Results card shown by `# end_demo:<chapter>` (until the next chapter exists). */
  outro?: { kicker: string; headline: string; snape: string };
}

export const CHAPTERS = {
  prologue: { kicker: 'Prologue', title: 'The Letter' },
  ch1: {
    kicker: 'Chapter One',
    title: 'The Castle',
    outro: {
      kicker: 'Chapter One complete',
      headline: 'The Forbidden Forest awaits...',
      snape: 'Snape: Adequate. Do not let it go to your head. It has such a short way to go.',
    },
  },
} satisfies Record<string, ChapterDef>;

export type ChapterId = keyof typeof CHAPTERS;
export const isChapterId = (id: string): id is ChapterId => id in CHAPTERS;
export const chapterDef = (id: ChapterId): ChapterDef => CHAPTERS[id];

/** Contract clauses, unlocked one per chapter via ink VAR `clauses`. */
export const CLAUSES = [
  'The Guide shall accompany the Seeker until the Hidden Treasure is found. The Guide may not resign, retire, feign illness, or "go and brew something."',
  'The Guide shall remark upon the Seeker\'s height no more than once per room. (Note: the Guide has already exceeded this.)',
];
