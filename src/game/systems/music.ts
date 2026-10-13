import { FILE_SONGS, SONGS, type FileSong, type Song, type SongId } from '@/data/music';
import { noteHz, tone } from './synth';

/** One note event: `step` within the loop, length in steps. */
export interface NoteEvent {
  step: number;
  hz: number;
  len: number;
}

/** Parses a track string into note events; `-` extends the previous note, `.` is silence. */
export function parseTrack(notes: string): { events: NoteEvent[]; steps: number } {
  const tokens = notes.trim().split(/\s+/);
  const events: NoteEvent[] = [];
  let last: NoteEvent | null = null;
  tokens.forEach((tok, step) => {
    if (tok === '-') {
      if (last) last.len++;
    } else if (tok === '.') {
      last = null;
    } else {
      last = { step, hz: noteHz(tok), len: 1 };
      events.push(last);
    }
  });
  return { events, steps: tokens.length };
}

interface Playing {
  id: SongId;
  gain: GainNode;
  timer: number;
}

const LOOKAHEAD_S = 0.25;
const TICK_MS = 60;
const FADE_S = 1.2;
/** Overlap between repeats of a recorded loop, so the seam is a crossfade, not a cut. */
const XFADE_S = 0.9;
const buffers = new Map<string, Promise<AudioBuffer>>();

/**
 * Step sequencer for the chiptune score. Schedules a quarter-second ahead on a timer so the beat stays tight
 * even when the main thread hitches; switching songs crossfades.
 */
export class Music {
  private current: Playing | null = null;

  constructor(private bus: () => { ctx: AudioContext; out: GainNode } | null) {}

  get playing(): SongId | null {
    return this.current?.id ?? null;
  }

  play(id: SongId | null) {
    if (id === this.playing) return;
    this.fadeOut();
    const b = this.bus();
    if (!id || !b) return;
    const gain = b.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, b.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(1, b.ctx.currentTime + FADE_S);
    gain.connect(b.out);
    const file = FILE_SONGS[id];
    const playing: Playing = { id, gain, timer: 0 };
    this.current = playing;
    if (file) this.loadAndLoop(b.ctx, playing, file);
    else playing.timer = this.schedule(b.ctx, gain, SONGS[id as keyof typeof SONGS]);
  }

  stop() {
    this.fadeOut();
  }

  private fadeOut() {
    const c = this.current;
    if (!c) return;
    this.current = null;
    window.clearInterval(c.timer);
    const t = c.gain.context.currentTime;
    c.gain.gain.cancelScheduledValues(t);
    c.gain.gain.setValueAtTime(c.gain.gain.value, t);
    c.gain.gain.exponentialRampToValueAtTime(0.0001, t + FADE_S);
    window.setTimeout(() => c.gain.disconnect(), (FADE_S + 0.6) * 1000);
  }

  private loadAndLoop(ctx: AudioContext, playing: Playing, file: FileSong) {
    let p = buffers.get(file.url);
    if (!p) {
      p = fetch(file.url)
        .then((r) => r.arrayBuffer())
        .then((a) => ctx.decodeAudioData(a));
      buffers.set(file.url, p);
    }
    p.then((buf) => {
      if (this.current !== playing) return; // switched maps while it was decoding
      let next = ctx.currentTime + 0.05;
      const tick = () => {
        if (next < ctx.currentTime) next = ctx.currentTime + 0.05;
        while (next < ctx.currentTime + LOOKAHEAD_S) {
          const src = ctx.createBufferSource();
          const g = ctx.createGain();
          src.buffer = buf;
          g.gain.setValueAtTime(0.0001, next);
          g.gain.linearRampToValueAtTime(file.gain, next + XFADE_S);
          g.gain.setValueAtTime(file.gain, next + buf.duration - XFADE_S);
          g.gain.linearRampToValueAtTime(0.0001, next + buf.duration);
          src.connect(g).connect(playing.gain);
          src.start(next);
          next += buf.duration - XFADE_S;
        }
      };
      tick();
      playing.timer = window.setInterval(tick, TICK_MS);
    }).catch(() => buffers.delete(file.url));
  }

  private schedule(ctx: AudioContext, dest: GainNode, song: Song): number {
    const stepS = 30 / song.bpm;
    const tracks = song.tracks.map((t) => ({ t, ...parseTrack(t.notes) }));
    const loop = Math.max(...tracks.map((t) => t.steps));
    // Index events by step once, so each tick is a lookup, not a scan.
    const byStep: { hz: number; dur: number; t: (typeof tracks)[number]['t'] }[][] = Array.from({ length: loop }, () => []);
    for (const tr of tracks) {
      for (const e of tr.events) {
        const dur = tr.t.env === 'pluck' ? Math.max(0.35, e.len * stepS * 1.4) : e.len * stepS * 0.95;
        byStep[e.step].push({ hz: e.hz, dur, t: tr.t });
      }
    }
    let step = 0;
    let next = ctx.currentTime + 0.1;
    const tick = () => {
      // Background tabs throttle timers to ~1s: skip ahead rather than fire every missed note at once.
      if (next < ctx.currentTime) next = ctx.currentTime + 0.05;
      while (next < ctx.currentTime + LOOKAHEAD_S) {
        const at = next - ctx.currentTime;
        for (const n of byStep[step]) {
          tone(ctx, dest, n.hz, n.dur, { type: n.t.wave, gain: n.t.gain, at, attack: n.t.env === 'hold' ? 0.03 : 0.006 });
        }
        step = (step + 1) % loop;
        next += stepS;
      }
    };
    tick();
    return window.setInterval(tick, TICK_MS);
  }
}
