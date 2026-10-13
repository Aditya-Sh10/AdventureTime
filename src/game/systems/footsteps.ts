import type { Surface } from './audio';

/** Pixels walked per footfall (walk anim is ~2 steps per 40px). */
export const STRIDE_PX = 20;

const BY_NAME: [RegExp, Surface][] = [
  [/^(grass|path|roots|ferns|mushrooms|bush|burrow)$/, 'grass'],
  [/^(carpet[LR]|rug)$/, 'carpet'],
  [/^(planks|hauntFloor|redFloor|hiddenFloor|stoolFloor|courtFloor|dais|roof)$/, 'wood'],
  [/^rift/, 'metal'],
];

/** Which footstep sound a floor tile makes. Anything unlisted is stone (it's a castle). */
export function surfaceOf(tileName: string | undefined): Surface {
  if (!tileName) return 'stone';
  for (const [re, s] of BY_NAME) if (re.test(tileName)) return s;
  return 'stone';
}
