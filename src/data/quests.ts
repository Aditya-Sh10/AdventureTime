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
  c2_lantern: {
    title: 'Take the lantern from the stump.',
    hints: [
      'Light, Miss Ishu. You will want some.',
      'Something on a stump nearby is glowing. Lanterns do that.',
      'The glowing stump is just left of where you arrived. Face it and press E.',
    ],
    by: 'snape',
  },
  c2_tracks: {
    title: 'Follow the tiny glowing tracks.',
    hints: [
      'Footprints. Small ones. Follow them, it is not complicated.',
      'The path goes west, then north. The tracks glow by lantern light.',
      'Walk the path west along the bottom, then north up the left side.',
    ],
    by: 'snape',
  },
  c2_follow: {
    title: 'Follow the path east, where the figure stood.',
    hints: [
      'The hooded thing was up the path. That is, regrettably, where we are going.',
      'East along the path. It stood just past the glowing mushrooms.',
      'Follow the path east (right) and check the spot where the figure stood.',
    ],
    by: 'snape',
  },
  c2_burrows: {
    title: 'Search the burrows in the clearing.',
    hints: [
      'Holes. In the ground. Somewhere in there is our stalker.',
      'Three burrows around the moonlit clearing. Check them.',
      'The burrows glow: top-left, top-right and right of the clearing.',
    ],
    by: 'snape',
  },
  c2_niffler: {
    title: 'Get the coin from the Niffler.',
    hints: [
      'It wants something shiny. You are wearing something shiny.',
      'Talk to the Niffler. It is open to negotiation.',
      'Talk to the Niffler by the stump and offer it an earring.',
    ],
    by: 'snape',
  },
  c2_exit: {
    title: 'Follow the Map north out of the forest.',
    hints: [
      'The Map has an opinion. North.',
      'There is a gap in the trees at the top of the clearing.',
      'Walk up through the gap in the trees at the top of the clearing.',
    ],
    by: 'snape',
  },
} satisfies Record<string, QuestDef>;

export type QuestId = keyof typeof QUESTS;
export const isQuestId = (id: string): id is QuestId => id in QUESTS;
