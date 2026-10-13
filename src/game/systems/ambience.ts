import { settingsStore } from '@/store/settingsStore';
import { burst, tone } from './synth';

export type AmbienceId = 'room' | 'castle' | 'library' | 'forest' | 'court' | 'rift' | 'haunted' | 'tower';

type Ctx = AudioContext;
type Ev = { every: [number, number]; play: (c: Ctx, d: AudioNode) => void; scary?: boolean };
interface Profile {
  /** Sustained oscillators (hums). Slightly detuned pairs beat against each other. */
  drone?: { hz: number[]; type: OscillatorType; gain: number };
  events: Ev[];
}

const r = (a: number, b: number) => a + Math.random() * (b - a);

const crackle: Ev['play'] = (c, d) => {
  for (let i = 0; i < 2 + Math.floor(r(0, 3)); i++) burst(c, d, 0.03, { filter: 'highpass', freq: 2500, gain: r(0.04, 0.1), at: r(0, 0.35) });
};
const drip: Ev['play'] = (c, d) => {
  tone(c, d, r(1200, 1600), 0.12, { gain: 0.035, slideTo: 800 });
  tone(c, d, r(1200, 1600), 0.12, { gain: 0.012, slideTo: 800, at: 0.28 });
};
const cricket: Ev['play'] = (c, d) => {
  const hz = r(4000, 4600);
  for (let i = 0; i < 3; i++) tone(c, d, hz, 0.03, { gain: 0.012, at: i * 0.055 });
};
const bird: Ev['play'] = (c, d) => {
  for (let i = 0; i < 2 + Math.floor(r(0, 2)); i++) tone(c, d, r(2400, 2900), 0.08, { gain: 0.02, slideTo: r(3200, 3800), at: i * 0.13 });
};
const owl: Ev['play'] = (c, d) => {
  tone(c, d, 392, 0.35, { gain: 0.045, slideTo: 370, attack: 0.08 });
  tone(c, d, 392, 0.55, { gain: 0.045, slideTo: 340, attack: 0.08, at: 0.5 });
};
const twig: Ev['play'] = (c, d) => burst(c, d, 0.05, { filter: 'highpass', freq: 1800, gain: 0.12 });
const cough: Ev['play'] = (c, d) => {
  burst(c, d, 0.14, { filter: 'bandpass', freq: 700, q: 2, gain: 0.05 });
  burst(c, d, 0.12, { filter: 'bandpass', freq: 650, q: 2, gain: 0.035, at: 0.22 });
};
const paper: Ev['play'] = (c, d) => burst(c, d, 0.22, { filter: 'bandpass', freq: 3500, q: 1.5, gain: 0.04, shape: 'swell' });
const zap: Ev['play'] = (c, d) => {
  tone(c, d, r(1200, 1800), 0.18, { gain: 0.02, slideTo: r(2800, 3600) });
  tone(c, d, r(600, 900), 0.4, { type: 'triangle', gain: 0.015, at: 0.1 });
};
const creak: Ev['play'] = (c, d) => tone(c, d, r(120, 170), r(0.5, 0.9), { type: 'sawtooth', gain: 0.01, slideTo: r(80, 100), attack: 0.15 });
const whisper: Ev['play'] = (c, d) => burst(c, d, 1.6, { filter: 'bandpass', freq: r(1800, 2600), q: 4, gain: 0.04, shape: 'swell' });
const thud: Ev['play'] = (c, d) => {
  tone(c, d, 70, 0.5, { gain: 0.1, slideTo: 40 });
  burst(c, d, 0.3, { filter: 'lowpass', freq: 200, gain: 0.15 });
};
const gust: Ev['play'] = (c, d) => burst(c, d, r(2, 3.5), { filter: 'bandpass', freq: r(450, 700), gain: 0.05, shape: 'swell' });

const PROFILES: Record<AmbienceId, Profile> = {
  room: { events: [{ every: [2, 6], play: cricket }, { every: [9, 20], play: bird }] },
  castle: {
    events: [{ every: [0.4, 1.6], play: crackle }, { every: [6, 14], play: drip }],
  },
  library: {
    events: [{ every: [0.3, 1.2], play: crackle }, { every: [8, 18], play: paper }],
  },
  forest: {
    events: [{ every: [0.8, 3], play: cricket }, { every: [14, 30], play: owl }, { every: [10, 25], play: twig, scary: true }],
  },
  court: {
    events: [{ every: [10, 22], play: cough }, { every: [6, 14], play: paper }],
  },
  rift: { drone: { hz: [55, 55.7, 110.4], type: 'sine', gain: 0.05 }, events: [{ every: [3, 8], play: zap }] },
  haunted: {
    drone: { hz: [49, 51.3], type: 'sine', gain: 0.06 },
    events: [
      { every: [7, 16], play: creak },
      { every: [18, 40], play: whisper, scary: true },
      { every: [25, 50], play: thud, scary: true },
    ],
  },
  tower: { events: [{ every: [18, 35], play: gust }] },
};

/**
 * Per-map soundscape: an optional low drone plus randomly-timed one-shots. No looping noise beds: a swelling
 * noise loop reads as ocean surf, not wind (playtest feedback). `scary` events honour settings.scare.
 */
export class Ambience {
  private id: AmbienceId | null = null;
  private gain: GainNode | null = null;
  private nodes: AudioScheduledSourceNode[] = [];
  private timers: number[] = [];

  constructor(private bus: () => { ctx: AudioContext; out: GainNode } | null) {}

  play(id: AmbienceId | null) {
    if (id === this.id) return;
    this.stop();
    const b = this.bus();
    if (!id || !b) return;
    this.id = id;
    const { ctx } = b;
    const p = PROFILES[id];
    const g = (this.gain = ctx.createGain());
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(1, ctx.currentTime + 2);
    g.connect(b.out);

    for (const hz of p.drone?.hz ?? []) {
      const o = ctx.createOscillator();
      const og = ctx.createGain();
      o.type = p.drone!.type;
      o.frequency.value = hz;
      og.gain.value = p.drone!.gain;
      o.connect(og).connect(g);
      o.start();
      this.nodes.push(o);
    }
    for (const ev of p.events) this.loop(ctx, g, ev);
  }

  private loop(ctx: AudioContext, dest: GainNode, ev: Ev) {
    const t = window.setTimeout(() => {
      const scare = settingsStore.getState().scare;
      if (!ev.scary || scare === 'full' || (scare === 'reduced' && Math.random() < 0.5)) ev.play(ctx, dest);
      this.timers = this.timers.filter((x) => x !== t);
      if (this.gain === dest) this.loop(ctx, dest, ev);
    }, r(ev.every[0], ev.every[1]) * 1000);
    this.timers.push(t);
  }

  stop() {
    this.timers.forEach((t) => window.clearTimeout(t));
    this.timers = [];
    const g = this.gain;
    const nodes = this.nodes;
    this.nodes = [];
    this.gain = null;
    this.id = null;
    if (!g) return;
    const t = g.context.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(g.gain.value, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    window.setTimeout(() => {
      nodes.forEach((n) => n.stop());
      g.disconnect();
    }, 1500);
  }
}
