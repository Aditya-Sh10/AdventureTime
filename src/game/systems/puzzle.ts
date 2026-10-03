/** Pure code-lock logic (no React/Phaser) so it can be unit-tested. A code = one index per wheel. */

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
