import { settingsStore } from '@/store/settingsStore';
import { Ambience } from './ambience';
import { Music } from './music';
import { samples } from './samples';
import { variants } from '@/data/sounds';
import { burst, tone } from './synth';

/**
 * Game audio. `play(name)` uses the recorded sample (data/sounds.ts) when one exists and is decoded, else the
 * synthesised version below — so ink `# sfx:name` tags work either way. Music and ambience live on their own
 * buses so the settings sliders apply live.
 */
/** Synth-only names first; the rest are recordings (with a synth stand-in where it matters). */
export const SFX_NAMES = [
  'chime', 'tap', 'door', 'whoosh', 'sting', 'pickup', 'boom', 'select', 'open', 'sigh', 'firework',
  'map', 'draught', 'scream', 'owl', 'gavel', 'objection', 'thwip', 'vhs', 'musicbox', 'woof', 'chest', 'page',
] as const;
export type SfxName = (typeof SFX_NAMES)[number];
/** Recordings without a dedicated synth version borrow the closest one while loading / if missing. */
const SYNTH_STANDIN: Partial<Record<SfxName, SfxName>> = {
  map: 'whoosh', draught: 'whoosh', scream: 'sting', owl: 'tap', gavel: 'boom', objection: 'boom', thwip: 'whoosh',
  vhs: 'sigh', chest: 'open', page: 'open',
};
export type Surface = 'stone' | 'wood' | 'carpet' | 'grass' | 'metal';

class Sfx {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private musicOut: GainNode | null = null;
  private ambOut: GainNode | null = null;
  private lastBlip = 0;
  readonly music = new Music(() => (this.ctx && this.musicOut ? { ctx: this.ctx, out: this.musicOut } : null));
  readonly ambience = new Ambience(() => (this.ctx && this.ambOut ? { ctx: this.ctx, out: this.ambOut } : null));

  /** Must be called from a user gesture (New Game / Continue click). */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.out = this.ctx.createGain();
      this.out.connect(this.ctx.destination);
      this.musicOut = this.ctx.createGain();
      this.musicOut.connect(this.ctx.destination);
      this.ambOut = this.ctx.createGain();
      this.ambOut.connect(this.ctx.destination);
      this.applyVolumes();
      settingsStore.subscribe(() => this.applyVolumes());
      samples.preload(this.ctx);
    }
    void this.ctx.resume();
  }

  private applyVolumes() {
    const s = settingsStore.getState();
    const t = this.ctx?.currentTime ?? 0;
    this.musicOut?.gain.setTargetAtTime(s.master * s.music * 1.6 /* score gains are authored low so chords never clip */, t, 0.05);
    this.ambOut?.gain.setTargetAtTime(s.master * s.sfx, t, 0.05);
  }

  private vol() {
    const s = settingsStore.getState();
    return s.master * s.sfx;
  }

  private tone(freq: number, dur: number, type: OscillatorType, gain: number, at = 0, slideTo?: number) {
    if (this.ctx && this.out) tone(this.ctx, this.out, freq, dur, { type, gain: gain * this.vol(), at, slideTo });
  }

  private noise(dur: number, gain: number, at = 0, lowpass = 1200) {
    if (this.ctx && this.out) burst(this.ctx, this.out, dur, { gain: gain * this.vol(), at, freq: lowpass });
  }

  /** Animal-Crossing-style voice blip per few characters. */
  blip(pitch: number, wave: OscillatorType) {
    if (!settingsStore.getState().voices || !this.ctx) return;
    const now = performance.now();
    if (now - this.lastBlip < 55) return;
    this.lastBlip = now;
    this.tone(pitch * (0.94 + Math.random() * 0.12), 0.05, wave, 0.05);
  }

  /** One footfall; pitch/filter jitter so a walk never sounds like a loop. */
  step(surface: Surface, quiet = false) {
    const ctx = this.ctx;
    if (!ctx || !this.out) return;
    const v = this.vol() * (quiet ? 0.45 : 1) * 1.1;
    const j = 0.85 + Math.random() * 0.3;
    const d = this.out;
    if (surface === 'grass' || surface === 'wood') {
      const vs = variants('step-' + surface);
      const pick = vs[Math.floor(Math.random() * vs.length)];
      if (pick && samples.play(ctx, d, pick, v, 0.92 + Math.random() * 0.16)) return;
    }
    switch (surface) {
      case 'stone':
        burst(ctx, d, 0.06, { filter: 'bandpass', freq: 900 * j, q: 1.2, gain: 0.22 * v });
        break;
      case 'wood':
        burst(ctx, d, 0.07, { filter: 'lowpass', freq: 650 * j, gain: 0.2 * v });
        tone(ctx, d, 130 * j, 0.07, { type: 'triangle', gain: 0.05 * v, slideTo: 100 });
        break;
      case 'carpet':
        burst(ctx, d, 0.08, { filter: 'lowpass', freq: 380 * j, gain: 0.16 * v });
        break;
      case 'grass':
        burst(ctx, d, 0.11, { filter: 'bandpass', freq: 2800 * j, q: 0.7, gain: 0.07 * v, shape: 'swell' });
        break;
      case 'metal':
        burst(ctx, d, 0.04, { filter: 'highpass', freq: 1800 * j, gain: 0.08 * v });
        tone(ctx, d, 880 * j, 0.12, { gain: 0.015 * v });
        break;
    }
  }

  play(name: string) {
    if (!this.ctx || !this.out) return;
    if (samples.play(this.ctx, this.out, name, this.vol(), name === 'firework' ? 0.9 + Math.random() * 0.2 : 1)) return;
    this.synth((SYNTH_STANDIN[name as SfxName] ?? name) as SfxName);
  }

  private synth(name: SfxName) {
    switch (name) {
      case 'chime':
        [784, 988, 1319].forEach((f, i) => this.tone(f, 0.5, 'sine', 0.12, i * 0.09));
        break;
      case 'pickup':
        this.tone(660, 0.12, 'square', 0.06), this.tone(990, 0.2, 'square', 0.06, 0.08);
        break;
      case 'tap':
        [0, 0.35, 0.7].forEach((d) => this.noise(0.05, 0.5, d, 2500));
        break;
      case 'door':
        this.noise(0.5, 0.35, 0, 400), this.tone(90, 0.4, 'sawtooth', 0.05, 0, 60);
        break;
      case 'whoosh':
        this.noise(0.8, 0.4, 0, 1800), this.tone(200, 0.8, 'sine', 0.08, 0, 900);
        break;
      case 'sting':
        this.tone(311, 1.2, 'sawtooth', 0.05), this.tone(330, 1.2, 'sawtooth', 0.05), this.tone(55, 1.4, 'sine', 0.2);
        break;
      case 'boom':
        this.noise(1.2, 0.8, 0, 300), this.tone(60, 1, 'sine', 0.3, 0, 30);
        break;
      case 'select':
        this.tone(880, 0.06, 'square', 0.04);
        break;
      case 'open':
        this.tone(523, 0.08, 'triangle', 0.08), this.tone(784, 0.12, 'triangle', 0.08, 0.06);
        break;
      case 'sigh':
        this.noise(0.9, 0.18, 0, 700);
        break;
      case 'firework':
        // Distant thump, then a crackling tail.
        this.noise(0.5, 0.35, 0, 250), this.tone(90, 0.4, 'sine', 0.12, 0, 45);
        for (let i = 0; i < 6; i++) this.noise(0.03, 0.12, 0.15 + Math.random() * 0.5, 4000);
        break;
    }
  }
}

export const sfx = new Sfx();
