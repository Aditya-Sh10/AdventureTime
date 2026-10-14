import { CLAUSES } from './chapters';

/** End-screen content: funny stats (GDD §0 Q68), the personal message (Q66), credits. */

export interface FinaleStat {
  label: string;
  value: string;
  note?: string;
}

/** "1h 07m" / "42m". Never less than a minute: nobody finishes this in seconds, not even a normal person. */
export function formatPlayTime(ms: number) {
  const mins = Math.max(1, Math.round(ms / 60000));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m`;
}

/** A normal person is always a little faster. They can reach the top shelves. */
export const NORMAL_PERSON_FACTOR = 0.85;

export function finaleStats(get: (name: string) => unknown, playMs: number): FinaleStat[] {
  const n = (v: string) => Number(get(v) ?? 0);
  return [
    { label: 'Your time', value: formatPlayTime(playMs) },
    { label: "A normal person's time", value: formatPlayTime(playMs * NORMAL_PERSON_FACTOR), note: 'they could reach the top shelves' },
    { label: 'Objects touched after being told not to', value: String(n('touched_forbidden')) },
    { label: 'Times Snape sighed', value: String(n('snape_sighs')) },
    { label: 'House points, awarded under protest', value: String(n('house_points')) },
    { label: 'Universes visited', value: '4', note: 'you were short in all of them' },
    { label: 'Dogs in this game', value: '1', note: 'the correct number' },
    { label: 'Times G. fell asleep on the job', value: '5' },
    { label: 'Contract clauses', value: `${n('clauses')} of ${CLAUSES.length}` },
  ];
}

/** The personal message (QUESTIONS Q66), shown after the stats. Written by Adi; never invent it. */
export const MESSAGE = {
  lines: ['Happiesst Birthday Princess'],
  signed: '— G.',
};

export const CREDITS = [
  'Made for Ishu, for her birthday, by Adi (G.)',
  'Fonts: Pixelify Sans and Press Start 2P (SIL Open Font License)',
  'Built with Phaser, React, ink (inkle), Vite',
  'Harry Potter, Marvel, Disney, The Ring and friends belong to their owners. This is a fan-made, one-person, non-commercial birthday present.',
  'No goldfish were harmed. One was mildly embarrassed.',
];
