/** Pure puzzle logic (no React/Phaser) so it can be unit-tested. Code lock: a code = one index per wheel. */

export function newCode(length: number): number[] {
  return Array.from({ length }, () => 0);
}

/** Rotate wheel `i` by `dir` (±1), wrapping around `size` symbols. */
export function spin(code: readonly number[], i: number, dir: number, size: number): number[] {
  const next = [...code];
  next[i] = (((next[i] + dir) % size) + size) % size;
  return next;
}

export function codeText(code: readonly number[], symbols: string) {
  return code.map((n) => symbols[n]).join('');
}

export function isSolved(code: readonly number[], symbols: string, answer: string) {
  return codeText(code, symbols) === answer.toUpperCase();
}

/** Objection duel progress: which round, and wrong picks in the current round. */
export interface DuelState {
  round: number;
  tries: number;
  done: boolean;
}

export const newDuel = (): DuelState => ({ round: 0, tries: 0, done: false });

/** Apply a pick. Right → next round (tries reset); wrong → same round, one more try. */
export function pickExhibit(s: DuelState, pick: string, answers: readonly string[]): { state: DuelState; correct: boolean } {
  if (s.done) return { state: s, correct: false };
  if (pick !== answers[s.round]) return { state: { ...s, tries: s.tries + 1 }, correct: false };
  const round = s.round + 1;
  return { state: { round, tries: 0, done: round >= answers.length }, correct: true };
}
