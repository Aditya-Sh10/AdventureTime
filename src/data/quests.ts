/** Objectives shown in the HUD. hints escalate: vague → specific → explicit (see systems/hints.ts). */
export interface QuestDef {
  title: string;
  hints: [string, string, string];
  /** Who delivers hints. Narrator before Snape is bound. */
  by: 'snape' | 'narrator';
}

export const QUESTS = {
  p_window: {
    title: 'Something is tapping on the window.',
    hints: ['Tap. Tap. Tap.', 'The tapping is coming from the window.', 'Walk up to the window and press E.'],
    by: 'narrator',
  },
  p_frame: {
    title: 'Your framed Hogwarts letter is glowing.',
    hints: [
      'Something on the wall is glowing. Subtle.',
      'The framed letter. On the wall. Glowing.',
      'Stand below the golden frame (top-left) and press E.',
    ],
    by: 'narrator',
  },
  c1_clue: {
    title: 'Find the first clue. (Ask the portraits.)',
    hints: [
      'Portraits, Miss Ishu. The ones on the walls. Talking.',
      'The portraits gossip. One of them saw where the clue was hidden.',
      'Ask the portrait of Violet, top right. Then check the banner she describes.',
    ],
    by: 'snape',
  },
  c1_library: {
    title: 'Go to the Library. (West archway.)',
    hints: [
      'The Library. You have heard of libraries.',
      'The archway on the west wall. Where the hooded thing stood. Yes. That one.',
      'Walk through the dark archway on the left wall.',
    ],
    by: 'snape',
  },
  c1_books: {
    title: 'Find the four glowing books.',
    hints: [
      'Books, Miss Ishu. In a library. The challenge is staggering.',
      'Four of them are glowing. Check the shelves, the aisles, and the top wall.',
      'Glowing books: middle-left aisle, middle-right aisle, the bottom-left aisle, and the top wall near the window.',
    ],
    by: 'snape',
  },
  c1_gate: {
    title: 'Open the Restricted Section gate.',
    hints: [
      'The gate wants a word. You have been collecting letters. Connect these facts.',
      'Four books, four letters, numbered one to four. Put them in order.',
      'Go to the iron gate on the left and enter the letters in book order.',
    ],
    by: 'snape',
  },
  c1_map: {
    title: 'Look at the lectern in the Restricted Section.',
    hints: [
      'You opened a forbidden gate and then stopped. Bold.',
      'There is a lectern in there. With parchment on it.',
      'Walk to the lectern in the top-left of the Restricted Section and press E.',
    ],
    by: 'snape',
  },
  c1_return: {
    title: 'Head back to the Entrance Hall.',
    hints: [
      'The way you came in. It still exists.',
      'The archway on the east wall of the Library.',
      'Walk through the archway on the right side of the Library.',
    ],
    by: 'snape',
  },
} satisfies Record<string, QuestDef>;

export type QuestId = keyof typeof QUESTS;
export const isQuestId = (id: string): id is QuestId => id in QUESTS;
