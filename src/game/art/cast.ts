/** Character specs for the code-drawn chibi sprites (drawn by characters.ts). Ishu is 2px shorter. Deliberately. */
export type HairStyle =
  | 'wavy' | 'longWavy' | 'fringe' | 'curtains' | 'bun' | 'long' | 'short' | 'hood' | 'wild'
  /** Floor-length. Seventy feet, give or take. */
  | 'rapunzel';

export interface CharSpec {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  top: string;
  bottom: string;
  shoes: string;
  robe?: string;
  tie?: string;
  hat?: string;
  glasses?: boolean | 'round';
  /** Sleeve colour when it differs from the torso (tee over a long-sleeve). */
  sleeves?: string;
  /** Wide-leg trousers. */
  baggy?: boolean;
  /** Sunglasses pushed up on the head. */
  shadesUp?: boolean;
  earrings?: string;
  blush?: boolean;
  beard?: string;
  short?: boolean;
  crop?: boolean;
  /** Face covering: full spider mask (big white eyes) or a black cloth band over the eyes. */
  mask?: 'spider' | 'band';
  /** Non-humanoid: drawn by its own routine in the same 24x36 frame. */
  creature?: 'niffler' | 'batplush';
}

export const CHARACTERS = {
  // Ishu: black wavy shoulder hair, glasses, earrings, crop top, 4'11" (drawn 2px shorter — Snape noticed).
  ishu: {
    skin: '#f1cfae', hair: '#1a1420', hairStyle: 'wavy', top: '#9b1f33', bottom: '#2f3d63', shoes: '#ece6da',
    glasses: true, earrings: '#e9b949', blush: true, short: true, crop: true,
  },
  snape: {
    skin: '#e9dccb', hair: '#0f0d13', hairStyle: 'curtains', top: '#15131a', bottom: '#15131a', shoes: '#08080a',
    robe: '#15131a',
  },
  mcgonagall: {
    skin: '#efd2b8', hair: '#8a8790', hairStyle: 'bun', top: '#1d4a34', bottom: '#1d4a34', shoes: '#1a1a1a',
    robe: '#1d4a34', hat: '#15372a', glasses: true,
  },
  ginny: {
    skin: '#f5d6bd', hair: '#c4471c', hairStyle: 'long', top: '#1d1b22', bottom: '#1d1b22', shoes: '#1a1a1a',
    robe: '#1d1b22', tie: '#a3202e', blush: true,
  },
  // Madam Pince: severe grey bun, plum robes. Communicates mainly in "shh".
  pince: {
    skin: '#e8d6c4', hair: '#7a7480', hairStyle: 'bun', top: '#3d2a4a', bottom: '#3d2a4a', shoes: '#1a1a1a',
    robe: '#3d2a4a',
  },
  student: {
    skin: '#d9a47e', hair: '#3b2618', hairStyle: 'short', top: '#1d1b22', bottom: '#1d1b22', shoes: '#1a1a1a',
    robe: '#1d1b22', tie: '#1f3f8a',
  },
  // The mysterious "G." — always hooded, face in shadow.
  figure: {
    skin: '#0b0910', hair: '#2a2334', hairStyle: 'hood', top: '#2a2334', bottom: '#2a2334', shoes: '#111',
    robe: '#2a2334',
  },
  // Ch2's stalker. Has followed Ishu through the whole forest. For the earrings.
  niffler: {
    skin: '#2a2026', hair: '#2a2026', hairStyle: 'short', top: '#2a2026', bottom: '#2a2026', shoes: '#2a2026',
    creature: 'niffler',
  },
  // Ch3 defence counsel (Ishu's best friend): long wavy hair, black rectangular glasses, red top. The logical one.
  divisha: {
    skin: '#e6b993', hair: '#1c1418', hairStyle: 'longWavy', top: '#b0202c', bottom: '#2a3048', shoes: '#2a2a30',
    glasses: true,
  },
  // Ch3 hostile witness (Ishu's little sister): fringe, round glasses, white tee over black sleeves, baggy jeans,
  // chunky white sneakers, sunglasses on her head. Wannabe baddie.
  guddu: {
    skin: '#ecc8a6', hair: '#22161c', hairStyle: 'fringe', top: '#ecebe6', bottom: '#3a3c46', shoes: '#f4f1ea',
    glasses: 'round', sleeves: '#1d1b22', baggy: true, shadesUp: true,
  },
  // Ch4 Hell's Kitchen: the blind lawyer in the black cloth mask (early, no red suit yet). Listens to everything.
  daredevil: {
    skin: '#e8c8a8', hair: '#4a2c1c', hairStyle: 'short', top: '#18161c', bottom: '#24222a', shoes: '#101012',
    mask: 'band',
  },
  // Ch4 Queens: the friendly neighbourhood one. Red and blue, big white eyes, apologises a lot.
  spidey: {
    skin: '#c0242c', hair: '#c0242c', hairStyle: 'short', top: '#c0242c', bottom: '#1f3f9a', shoes: '#c0242c',
    sleeves: '#1f3f9a', mask: 'spider',
  },
  // Ch4 tower: floor-length golden hair, lilac dress, barefoot, paint on her hands.
  rapunzel: {
    skin: '#f5d6bd', hair: '#f2cf5a', hairStyle: 'rapunzel', top: '#9a6ac0', bottom: '#9a6ac0', shoes: '#f5d6bd',
    robe: '#9a6ac0', blush: true,
  },
  // Ch4 hub: Ishu's own Batman soft toy, somehow in the wrong universe. Sits. Broods. Is soft.
  batplush: {
    skin: '#5a5a66', hair: '#1a1a22', hairStyle: 'short', top: '#5a5a66', bottom: '#5a5a66', shoes: '#5a5a66',
    creature: 'batplush',
  },
} satisfies Record<string, CharSpec>;

export type CharId = keyof typeof CHARACTERS;
export const CHAR_IDS = Object.keys(CHARACTERS) as CharId[];
