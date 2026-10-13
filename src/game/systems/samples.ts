import { SAMPLE_URLS, gainOf } from '@/data/sounds';

/**
 * Decoded recorded sounds. Everything is fetched + decoded once when audio unlocks (~750 KB total); until a
 * buffer is ready `play` returns false and the caller falls back to its synth version, so nothing ever waits.
 */
class Samples {
  private buffers = new Map<string, AudioBuffer>();
  private loading = new Map<string, Promise<AudioBuffer | null>>();

  preload(ctx: BaseAudioContext) {
    for (const name of Object.keys(SAMPLE_URLS)) void this.load(ctx, name);
  }

  load(ctx: BaseAudioContext, name: string): Promise<AudioBuffer | null> {
    const url = SAMPLE_URLS[name];
    if (!url) return Promise.resolve(null);
    let p = this.loading.get(name);
    if (!p) {
      p = fetch(url)
        .then((r) => r.arrayBuffer())
        .then((a) => ctx.decodeAudioData(a))
        .then((b) => (this.buffers.set(name, b), b))
        .catch(() => null);
      this.loading.set(name, p);
    }
    return p;
  }

  has(name: string) {
    return name in SAMPLE_URLS;
  }

  /** One-shot at the sample's situational gain × `scale`. False if not (yet) decoded. */
  play(ctx: BaseAudioContext, dest: AudioNode, name: string, scale = 1, rate = 1): boolean {
    const buf = this.buffers.get(name);
    if (!buf) return false;
    const src = ctx.createBufferSource();
    const g = ctx.createGain();
    src.buffer = buf;
    src.playbackRate.value = rate;
    g.gain.value = gainOf(name) * scale;
    src.connect(g).connect(dest);
    src.start();
    return true;
  }
}

export const samples = new Samples();

/**
 * Loops a buffer forever with an `xfade`-second crossfade at each seam (recordings rarely loop cleanly).
 * Returns a stop function. Schedules ahead on a timer like the music sequencer.
 */
export function loopBuffer(ctx: BaseAudioContext, buf: AudioBuffer, dest: AudioNode, gain: number, xfade = 0.9): () => void {
  let next = ctx.currentTime + 0.05;
  const sources: AudioBufferSourceNode[] = [];
  const tick = () => {
    if (next < ctx.currentTime) next = ctx.currentTime + 0.05;
    while (next < ctx.currentTime + 0.25) {
      const src = ctx.createBufferSource();
      const g = ctx.createGain();
      src.buffer = buf;
      g.gain.setValueAtTime(0.0001, next);
      g.gain.linearRampToValueAtTime(gain, next + xfade);
      g.gain.setValueAtTime(gain, next + buf.duration - xfade);
      g.gain.linearRampToValueAtTime(0.0001, next + buf.duration);
      src.connect(g).connect(dest);
      src.start(next);
      src.onended = () => sources.splice(sources.indexOf(src), 1);
      sources.push(src);
      next += buf.duration - xfade;
    }
  };
  tick();
  const timer = window.setInterval(tick, 60);
  return () => {
    window.clearInterval(timer);
    sources.forEach((s) => s.stop());
  };
}
