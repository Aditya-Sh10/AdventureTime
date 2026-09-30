import { settingsStore } from '@/store/settingsStore';

/**
 * Demo SFX synthesised with WebAudio (no files needed). Real OGG assets will be added via Howler later —
 * keep the `play(name)` API so ink `# sfx:name` tags keep working.
 */
export type SfxName = 'chime' | 'tap' | 'door' | 'whoosh' | 'sting' | 'pickup' | 'boom' | 'select' | 'open' | 'sigh';

class Sfx {
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private lastBlip = 0;

  /** Must be called from a user gesture (New Game / Continue click). */
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.out = this.ctx.createGain();
      this.out.connect(this.ctx.destination);
    }
    void this.ctx.resume();
  }

  private vol() {
    const s = settingsStore.getState();
    return s.master * s.sfx;
  }

  private tone(freq: number, dur: number, type: OscillatorType, gain: number, delay = 0, slideTo?: number) {
    const ctx = this.ctx;
    if (!ctx || !this.out) return;
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain * this.vol() + 0.0001, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.out);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  private noise(dur: number, gain: number, delay = 0, lowpass = 1200) {
    const ctx = this.ctx;
    if (!ctx || !this.out) return;
    const t = ctx.currentTime + delay;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = lowpass;
    const g = ctx.createGain();
    g.gain.value = gain * this.vol();
    src.connect(f).connect(g).connect(this.out);
    src.start(t);
  }

  /** Animal-Crossing-style voice blip per few characters. */
  blip(pitch: number, wave: OscillatorType) {
    if (!settingsStore.getState().voices || !this.ctx) return;
    const now = performance.now();
    if (now - this.lastBlip < 55) return;
    this.lastBlip = now;
    this.tone(pitch * (0.94 + Math.random() * 0.12), 0.05, wave, 0.05);
  }

  play(name: string) {
    if (!this.ctx) return;
    switch (name as SfxName) {
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
    }
  }
}

export const sfx = new Sfx();
