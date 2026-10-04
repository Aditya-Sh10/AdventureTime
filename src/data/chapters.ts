export interface ChapterDef {
  kicker: string;
  title: string;
  /** Results card shown by `# end_demo:<chapter>`. `next` = [map, spawn] for its Continue button. */
  outro?: { kicker: string; headline: string; snape: string; next?: readonly [string, string] };
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
      next: ['forest', 'edge'],
    },
  },
  ch2: {
    kicker: 'Chapter Two',
    title: 'The Forbidden Forest',
    outro: {
      kicker: 'Chapter Two complete',
      headline: 'The court will now come to order...',
      snape: 'Snape: You survived a forest and a Niffler. My expectations remain underground, but slightly less deep.',
      next: ['court', 'entry'],
    },
  },
  ch3: {
    kicker: 'Chapter Three',
    title: 'The Wizengamot',
    outro: {
      kicker: 'Chapter Three complete',
      headline: 'Something neon is leaking through the walls...',
      snape: 'Snape: Not guilty. I maintain that the court was misled by a step-stool.',
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
  'The Seeker may tell the Guide to calm down. The Guide may NOT tell the Seeker to calm down. Penalty: being beaten up. (The author writes from experience.)',
  'In any dispute between the Seeker and the Author, the Seeker is right. (Counsel has advised the Author. The Author has been blocked before. He knows.)',
];
