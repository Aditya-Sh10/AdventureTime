import { useEffect, useRef, useState } from 'react';
import { drawFrame, newCozyState, type CozyLayers } from '@/game/art/cozyActors';
import { CLOCK, LAMP, MOON, SH, SW, WIN, roomCanvas, skyCanvas, vignetteCanvas } from '@/game/art/cozyRoom';
import { sfx } from '@/game/systems/audio';
import { ISHU_LINES } from '@/data/title';
import { useReducedMotion } from './useReducedMotion';

const FRAME_MS = 1000 / 30; // pixel art at 30fps looks the same and costs half

type Hot = 'lily' | 'ishu' | 'moon' | 'lamp' | 'mug' | 'clock' | 'sky' | null;

function hitTest(x: number, y: number): Hot {
  if (x >= 152 && x <= 206 && y >= 106 && y <= 127) return 'lily';
  if (x >= 26 && x <= 58 && y >= 48 && y <= 86) return 'ishu';
  if (Math.hypot(x - MOON.x, y - MOON.y) <= MOON.r + 4) return 'moon';
  if (Math.hypot(x - CLOCK.x, y - CLOCK.y) <= CLOCK.r + 2) return 'clock';
  if (x >= 130 && x <= 139 && y >= 80 && y <= 91) return 'mug';
  if (x >= LAMP.x - 10 && x <= LAMP.x + 10 && y >= LAMP.shadeY - 1 && y <= 89) return 'lamp';
  if (x > WIN.x0 + 3 && x < WIN.x1 - 3 && y > 14 && y < WIN.y1 - 3) return 'sky';
  return null;
}

/**
 * The title backdrop: Ishu's window seat, Lily asleep on the rug. Canvas is 256x144, CSS-scaled to cover the
 * screen (object-fit: cover), so pointer coordinates are mapped back through the same crop.
 */
export function CozyScene() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const state = useRef(newCozyState());
  /** Scene clock origin, shared by the render loop and click reactions. */
  const t0 = useRef(0);
  const still = useReducedMotion();
  // Portrait screens can't fit the whole room: keep Ishu's window seat in frame rather than the lamp.
  const [posX, setPosX] = useState(() => (window.innerWidth < window.innerHeight ? 0.1 : 0.5));
  useEffect(() => {
    const on = () => setPosX(window.innerWidth < window.innerHeight ? 0.1 : 0.5);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const [bubble, setBubble] = useState<{ text: string; key: number; left: number; top: number } | null>(null);

  useEffect(() => {
    state.current.still = still;
  }, [still]);

  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    const layers: CozyLayers = { sky: skyCanvas(), room: roomCanvas(), vignette: vignetteCanvas() };
    const st = state.current;
    t0.current = performance.now();
    let raf = 0;
    let last = 0;
    let nextOwl = 6 + Math.random() * 8;
    let nextStar = 12 + Math.random() * 10;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < FRAME_MS) return;
      last = now;
      const t = (now - t0.current) / 1000;
      if (!st.still && t > nextOwl) {
        st.owlAt ??= t;
        nextOwl = t + 22 + Math.random() * 14;
      }
      if (!st.still && t > nextStar) {
        st.shootAt ??= t;
        nextStar = t + 18 + Math.random() * 16;
      }
      drawFrame(ctx, layers, t, st);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  /** Screen → virtual pixel, through object-fit: cover at object-position (posX, 50%). */
  const toVirtual = (e: React.PointerEvent) => {
    const r = canvas.current!.getBoundingClientRect();
    const s = Math.max(r.width / SW, r.height / SH);
    return { x: (e.clientX - r.left - (r.width - SW * s) * posX) / s, y: (e.clientY - r.top - (r.height - SH * s) / 2) / s, r, s };
  };

  const onMove = (e: React.PointerEvent) => {
    const { x, y, r } = toVirtual(e);
    const st = state.current;
    st.mx = ((e.clientX - r.left) / r.width) * 2 - 1;
    st.my = ((e.clientY - r.top) / r.height) * 2 - 1;
    const hot = hitTest(x, y);
    st.hoverLily = hot === 'lily';
    canvas.current!.style.cursor = hot ? 'pointer' : 'default';
  };

  const onClick = (e: React.PointerEvent) => {
    const { x, y, r, s } = toVirtual(e);
    const st = state.current;
    const now = (performance.now() - t0.current) / 1000;
    switch (hitTest(x, y)) {
      case 'lily': {
        const wasAsleep = now >= st.lilyAwakeUntil;
        st.lilyAwakeUntil = now + 4;
        st.hearts.push({ x: 158 + Math.round(Math.random() * 6), born: now });
        if (wasAsleep) sfx.play('woof');
        break;
      }
      case 'ishu':
        st.ishuLookUntil = now + 3.2;
        // Anchor above her head, through the same object-fit: cover crop as the canvas.
        setBubble({
          text: ISHU_LINES[Math.floor(Math.random() * ISHU_LINES.length)],
          key: now,
          left: (r.width - SW * s) * posX + 44 * s,
          top: (r.height - SH * s) / 2 + 46 * s,
        });
        sfx.play('page');
        break;
      case 'moon':
        st.shootAt = now;
        sfx.play('chime');
        break;
      case 'lamp':
        st.lampOn = !st.lampOn;
        sfx.play('tap');
        break;
      case 'mug':
        st.steamPuffUntil = now + 1.6;
        break;
      case 'clock':
        st.clockWobbleUntil = now + 0.5;
        sfx.play('tap');
        break;
      case 'sky':
        if (st.owlAt === null) {
          st.owlAt = now;
          sfx.play('owl');
        }
        break;
    }
  };

  useEffect(() => {
    if (!bubble) return;
    const id = setTimeout(() => setBubble(null), 3000);
    return () => clearTimeout(id);
  }, [bubble]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <canvas
        ref={canvas}
        width={SW}
        height={SH}
        onPointerMove={onMove}
        onPointerDown={onClick}
        className="pixel-img h-full w-full object-cover"
        style={{ touchAction: 'manipulation', objectPosition: `${posX * 100}% 50%` }}
      />
      {bubble && <SpeechBubble key={bubble.key} text={bubble.text} left={bubble.left} top={bubble.top} />}
    </div>
  );
}

function SpeechBubble({ text, left, top }: { text: string; left: number; top: number }) {
  return (
    <div
      className="cozy-pop pointer-events-none absolute max-w-[220px] -translate-y-full rounded-md border-2 border-ink bg-parch px-3 py-1.5 font-pixel text-base leading-snug text-ink shadow-[3px_3px_0_#000]"
      style={{ left, top }}
    >
      {text}
      <span className="absolute -bottom-[7px] left-4 h-3 w-3 rotate-45 border-r-2 border-b-2 border-ink bg-parch" />
    </div>
  );
}
