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
} satisfies Record<string, QuestDef>;

export type QuestId = keyof typeof QUESTS;
export const isQuestId = (id: string): id is QuestId => id in QUESTS;
