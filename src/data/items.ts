export interface ItemDef {
  name: string;
  desc: string;
  icon: string;
}

export const ITEMS = {
  letter: {
    name: 'The Owl-Delivered Letter',
    desc: 'Addressed to "Miss Ishu, The Bedroom, Third Pillow From The Left." Signed only: A.',
    icon: 'letter',
  },
  contract: {
    name: 'The Contract',
    desc: 'The Magically Binding Agreement of Reluctant Guidance. It hums. Snape glares at it a lot.',
    icon: 'contract',
  },
  frogCard: {
    name: 'Chocolate Frog Card: Dumbledore',
    desc: 'Albus Dumbledore, looking pleased with himself. On the back, in fresh ink: a large "1", and "A."',
    icon: 'frogCard',
  },
  map: {
    name: 'The Map',
    desc: 'Blank parchment that draws itself as you go. One corner stays stubbornly empty, except for a small "?".',
    icon: 'map',
  },
} satisfies Record<string, ItemDef>;

export type ItemId = keyof typeof ITEMS;
export const isItemId = (id: string): id is ItemId => id in ITEMS;
