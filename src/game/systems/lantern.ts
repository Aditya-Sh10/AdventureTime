/**
 * Lantern darkness (pure maths; WorldScene owns the Light2D light). Radius grows with the ink VAR `lantern`
 * (0 = none, 1 = lantern, 2 = + Snape's Lumos, 3 = full) and breathes slightly so the dark feels alive.
 */
export const LANTERN_RADII = [36, 84, 118, 150] as const;

export function lanternRadius(level: number) {
  const i = Math.max(0, Math.min(LANTERN_RADII.length - 1, Math.floor(level) || 0));
  return LANTERN_RADII[i];
}

/** Flame wobble multiplier around 1 (±6%); flat when reduced motion is on. */
export function lanternFlicker(timeMs: number, reducedMotion: boolean) {
  if (reducedMotion) return 1;
  return 1 + 0.04 * Math.sin(timeMs * 0.009) + 0.02 * Math.sin(timeMs * 0.031 + 1.3);
}
