/**
 * The front door: "password" = her height. Only 4'11" opens it (GDD §0; height jokes are allowed, nothing else
 * about her body). Heights are whole inches.
 */

export const GATE_MIN = 48; // 4'0"
export const GATE_MAX = 78; // 6'6"
export const GATE_ANSWER = 59; // 4'11"
/** Where the pencil starts: generously optimistic, so the first move is honesty. */
export const GATE_START = 64; // 5'4"

export const feetInches = (inches: number) => `${Math.floor(inches / 12)}'${inches % 12}"`;

/** Books stacked under her feet to reach a claimed height (2 inches a book, rounded up). */
export const booksFor = (inches: number) => Math.max(0, Math.ceil((inches - GATE_ANSWER) / 2));

/** Live caption while the pencil moves: the door frame's running commentary. */
export function liveCaption(inches: number): string {
  if (inches === GATE_ANSWER) return 'The pencil hovers over a very familiar mark.';
  if (inches < GATE_ANSWER - 4) return 'Crouching does not count, Miss Ishu.';
  if (inches < GATE_ANSWER) return 'Hm. Slouching?';
  const b = booksFor(inches);
  if (inches >= 73) return `${b} books. That is a bookcase. You are standing on a bookcase.`;
  return b === 1 ? 'One book has appeared under your feet. Interesting.' : `${b} books have appeared under your feet. Curious.`;
}

/** What the door says when you press "Measure me" with the wrong height. Indexed by how far off, then cycled. */
export function tease(inches: number, attempt: number): string {
  const pick = (lines: string[]) => lines[attempt % lines.length];
  if (inches < GATE_ANSWER - 4)
    return pick(['Selling yourself short? That is shorter than even you, which is an achievement.', 'Nobody is that short. Not even you. Try again.']);
  if (inches < GATE_ANSWER) return pick(['So close. A whisker under. The door is a stickler for whiskers.', 'Stand up straight. The door can tell.']);
  if (inches === 60) return pick(['Five foot? The door has seen you. The door remembers.', 'Rounding up by one inch. Bold. The door is unmoved.']);
  if (inches <= 63) return pick(['Rounding up, are we? Those inches are imaginary.', 'The door checked. Those inches are on loan from someone taller.']);
  if (inches <= 67) return pick(['And I am the Minister for Magic.', 'The door has filed a formal complaint about these inches.']);
  if (inches <= 72) return pick(['At that height you could reach the top shelf. You cannot reach the top shelf.', 'Lying to a magical door is a crime. Probably.']);
  return pick(['Ah. Hagrid. Welcome, Hagrid. Please mind your head.', 'The door has stopped taking you seriously.']);
}

/** Said when it is right. */
export const GATE_WELCOME = ['4\'11". Exactly as the records say.', 'Welcome home, Miss Ishu.'];

/** After this many wrong tries, Lily leaves a paw print at the right mark. */
export const GATE_HINT_AFTER = 3;
