/**
 * WebAudio building blocks shared by sfx, music and ambience. All sound in the game is synthesised here
 * (no files), so every voice is a tone or a filtered noise burst routed into a caller-owned bus.
 */

let noiseCache: AudioBuffer | null = null;

/** 4s of white noise, reused for every burst/bed (slicing a shared buffer is free; allocating isn't). */
export function noiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  if (noiseCache && noiseCache.sampleRate === ctx.sampleRate) return noiseCache;
  const buf = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  noiseCache = buf;
  return buf;
}

export interface ToneOpts {
  type?: OscillatorType;
  gain?: number;
  /** Seconds from now. */
  at?: number;
  slideTo?: number;
  attack?: number;
}

/** One enveloped oscillator note: quick attack, exponential decay over `dur`. */
export function tone(ctx: BaseAudioContext, dest: AudioNode, freq: number, dur: number, o: ToneOpts = {}) {
  const t = ctx.currentTime + (o.at ?? 0);
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = o.type ?? 'sine';
  osc.frequency.setValueAtTime(freq, t);
  if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(o.slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime((o.gain ?? 0.1) + 0.0001, t + (o.attack ?? 0.01));
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(dest);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export interface BurstOpts {
  gain?: number;
  at?: number;
  filter?: BiquadFilterType;
  freq?: number;
  q?: number;
  /** Envelope: 'decay' fades out from the hit, 'swell' rises then falls (wind gusts, whispers). */
  shape?: 'decay' | 'swell';
}

/** A filtered noise hit: footsteps, crackles, doors, gusts. */
export function burst(ctx: BaseAudioContext, dest: AudioNode, dur: number, o: BurstOpts = {}) {
  const t = ctx.currentTime + (o.at ?? 0);
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer(ctx);
  const f = ctx.createBiquadFilter();
  f.type = o.filter ?? 'lowpass';
  f.frequency.value = o.freq ?? 1200;
  f.Q.value = o.q ?? 0.8;
  const g = ctx.createGain();
  const peak = (o.gain ?? 0.3) + 0.0001;
  g.gain.setValueAtTime(0.0001, t);
  if (o.shape === 'swell') {
    g.gain.exponentialRampToValueAtTime(peak, t + dur * 0.5);
  } else {
    g.gain.exponentialRampToValueAtTime(peak, t + 0.005);
  }
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(dest);
  // Random slice of the shared buffer so repeated hits don't sound identical (gusts run up to 3.5s).
  src.start(t, Math.random() * Math.max(0, 3.9 - dur), dur + 0.05);
}

/** Note name → Hz ("A4" = 440, "F#3", "Bb2"). */
export function noteHz(name: string): number {
  const m = /^([A-G])([#b]?)(\d)$/.exec(name);
  if (!m) return 0;
  const base = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 }[m[1] as 'C'];
  const acc = m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0;
  const semis = base + acc + (Number(m[3]) - 4) * 12;
  return 440 * 2 ** (semis / 12);
}
