/**
 * Recorded sound effects (src/sounds/sfx, cut + loudness-normalised to ~-18 dB active RMS from the raw files in
 * src/sounds — see ASSETS.md). `gain` sets each one's level for its situation, relative to the synth sounds and
 * music. A name with no file here falls back to the synthesised version in systems/audio.ts.
 */

const files = import.meta.glob<string>('../sounds/sfx/*.mp3', { eager: true, query: '?url', import: 'default' });

/** name (file stem) → URL */
export const SAMPLE_URLS: Record<string, string> = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [path.slice(path.lastIndexOf('/') + 1, -4), url]),
);

export const SAMPLE_GAIN: Record<string, number> = {
  // UI + rewards: present but never louder than the dialogue blips
  select: 0.18,
  pickup: 0.32,
  chime: 0.35,
  open: 0.38,
  page: 0.4,
  // world
  door: 0.4,
  map: 0.32,
  chest: 0.5,
  owl: 0.3,
  woof: 0.45,
  thwip: 0.45,
  sigh: 0.45,
  // drama
  draught: 0.5,
  sting: 0.55,
  boom: 0.55,
  scream: 0.38,
  gavel: 0.45,
  objection: 0.6,
  vhs: 0.4,
  musicbox: 0.35,
  // finale: under the birthday music box
  firework: 0.28,
  // footsteps (per step; Snape's are scaled down again in audio.ts)
  'step-grass': 0.22,
  'step-wood': 0.16,
  // ambience loops
  'amb-fire': 0.9,
  'amb-forest': 0.15,
};

/** Footstep variants present on disk, e.g. step-grass → [step-grass-1 … step-grass-4]. */
export function variants(prefix: string): string[] {
  return Object.keys(SAMPLE_URLS).filter((k) => k.startsWith(prefix + '-'));
}

export const gainOf = (name: string) => SAMPLE_GAIN[name] ?? SAMPLE_GAIN[name.replace(/-\d+$/, '')] ?? 0.4;
