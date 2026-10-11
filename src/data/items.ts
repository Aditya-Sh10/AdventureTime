export interface ItemDef {
  name: string;
  desc: string;
  icon: string;
}

export const ITEMS = {
  letter: {
    name: 'The Owl-Delivered Letter',
    desc: 'Addressed to "Miss Ishu, The Bedroom, Third Pillow From The Left." Signed only: G.',
    icon: 'letter',
  },
  contract: {
    name: 'The Contract',
    desc: 'The Magically Binding Agreement of Reluctant Guidance. It hums. Snape glares at it a lot.',
    icon: 'contract',
  },
  frogCard: {
    name: 'Chocolate Frog Card: Dumbledore',
    desc: 'Albus Dumbledore, looking pleased with himself. On the back, in fresh ink: a large "1", and "G."',
    icon: 'frogCard',
  },
  map: {
    name: 'The Map',
    desc: 'Blank parchment that draws itself as you go. One corner stays stubbornly empty, except for a small "?".',
    icon: 'map',
  },
  lantern: {
    name: 'Brass Lantern',
    desc: 'Left on a stump in the Forbidden Forest. The note said: "For the short one. Hold it high. G."',
    icon: 'lantern',
  },
  coin4: {
    name: "Niffler's Gold Coin",
    desc: 'Traded for one earring. Heavy, warm, and stamped with a large "4", and "G."',
    icon: 'coin4',
  },
  receipt: {
    name: 'Owl-Post Receipt',
    desc: 'Official record. "Seeker: unblocked the Author, the very next day. Author: had already blocked her back." Stamped.',
    icon: 'receipt',
  },
  stool: {
    name: 'Folding Step-Stool',
    desc: 'Label: "Property of the Defendant. Required for most shelves, some chairs, and all hugs."',
    icon: 'stool',
  },
  case1: {
    name: 'Case File No. 1',
    desc: 'The Wizengamot v. The Seeker. Verdict: not guilty. "Case No. 1" is stamped large on the cover, and "G." on the back.',
    icon: 'case1',
  },
  webShooter: {
    name: 'Spare Web-Shooter',
    desc: `Lent by a very polite Spider-Man. "Please give it back. Or don't. I have, like, nine."`,
    icon: 'webShooter',
  },
  shardRed: {
    name: 'Red Shard',
    desc: "From a Hell's Kitchen rooftop. You could only find it with your glasses off, which is a sentence.",
    icon: 'shardRed',
  },
  shardBlue: {
    name: 'Blue Shard',
    desc: 'From a Queens rooftop, across a gap you crossed on a web. Snape has asked you not to bring it up.',
    icon: 'shardBlue',
  },
  shardGold: {
    name: 'Gold Shard',
    desc: 'Drifted down out of the sky with the lanterns. Still warm.',
    icon: 'shardGold',
  },
  zero: {
    name: 'The Zero',
    desc: 'The rift, folded small: a ring of light you can hold. It is very clearly a "0". On the inside, tiny: "G."',
    icon: 'zero',
  },
  batplush: {
    name: 'Batman Soft Toy',
    desc: 'Yours. Found brooding on the edge of the multiverse. Tag: "Wrong universe. Right owner."',
    icon: 'batplush',
  },
} satisfies Record<string, ItemDef>;

export type ItemId = keyof typeof ITEMS;
export const isItemId = (id: string): id is ItemId => id in ITEMS;
