import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import gsap from 'gsap';
import { drawChar, CHARACTERS, FH, FW, type CharId } from '@/game/art/characters';
import { makeCanvas } from '@/game/art/draw';
import { sfx } from '@/game/systems/audio';
import { GATE_ANSWER, GATE_HINT_AFTER, GATE_MAX, GATE_MIN, GATE_START, GATE_WELCOME, booksFor, feetInches, liveCaption, tease } from '@/data/gate';
import { useReducedMotion } from './useReducedMotion';

const KEY = 'bq-gate';
/** Passed this browser session already? (sessionStorage: she measures herself once per visit.) */
export function gatePassed(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/** A character's idle frame, cropped to the drawn pixels so the top of the image is the top of the head. */
function spriteURL(id: CharId): { url: string; w: number; h: number } {
  const { c, ctx } = makeCanvas(FW, FH);
  drawChar(ctx, 0, 0, CHARACTERS[id], 'down', 0, 'happy');
  const d = ctx.getImageData(0, 0, FW, FH).data;
  let x0 = FW, y0 = FH, x1 = 0, y1 = 0;
  for (let y = 0; y < FH; y++)
    for (let x = 0; x < FW; x++)
      if (d[(y * FW + x) * 4 + 3] > 200) {
        x0 = Math.min(x0, x);
        y0 = Math.min(y0, y);
        x1 = Math.max(x1, x);
        y1 = Math.max(y1, y);
      }
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const { c: out, ctx: o } = makeCanvas(w, h);
  o.drawImage(c, x0, y0, w, h, 0, 0, w, h);
  return { url: out.toDataURL(), w, h };
}

const BOOK_COLOURS = ['#2f4f8a', '#7a3346', '#3f6b3f', '#c99a3a', '#5a3d6e', '#8a4a2a'];
const DOOR_IN = 84; // the door frame is 7 ft
const span = (n: number) => Math.max(GATE_MIN, Math.min(GATE_MAX, n));

/**
 * The front door, before the title. Password = her height, chosen by sliding a pencil up a growth chart on the
 * door frame. Claim more and books appear under her feet; claim less and she squashes. Only 4'11" opens it.
 */
export function HeightGate({ onPass }: { onPass: () => void }) {
  const [inches, setInches] = useState(GATE_START);
  const [tries, setTries] = useState(0);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const still = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const ruler = useRef<HTMLDivElement | null>(null);
  const ishu = useMemo(() => spriteURL('ishu'), []);
  const lily = useMemo(() => spriteURL('lily'), []);

  useEffect(() => {
    ruler.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const on = () => setView({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  // Geometry: one inch = ppi screen pixels; the floor is the bottom of the scene. Side by side on wide screens;
  // stacked (scene above the card) on narrow ones, where the scene must also fit the width (~86 in + 100px wide).
  const narrow = view.w < 640;
  const ppi = Math.min((narrow ? view.h * 0.42 : Math.min(view.h * 0.7, 620)) / DOOR_IN, (view.w * (narrow ? 0.94 : 0.55) - 100) / 86);
  const lift = Math.max(0, inches - GATE_ANSWER) * ppi;
  const squash = inches < GATE_ANSWER ? inches / GATE_ANSWER : 1;
  const ishuH = GATE_ANSWER * ppi * squash;
  const books = booksFor(inches);
  const caption = liveCaption(inches);

  const unlockAudio = () => sfx.unlock();

  const set = (n: number) => {
    const v = span(n);
    if (v === inches || open) return;
    setInches(v);
    setVerdict(null);
    sfx.play('select');
  };

  const fromPointer = (e: PointerEvent) => {
    const r = ruler.current!.getBoundingClientRect();
    set(Math.round((r.bottom - e.clientY) / ppi));
  };

  const submit = () => {
    if (open) return;
    unlockAudio();
    if (inches === GATE_ANSWER) {
      setOpen(true);
      setVerdict(null);
      return;
    }
    setVerdict(tease(inches, tries));
    setTries((t) => t + 1);
    sfx.play('tap');
    if (!still) {
      gsap.fromTo('[data-door]', { x: -6 }, { x: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.3)' });
      gsap.fromTo('[data-books] > *', { rotation: 0 }, { rotation: (i) => (i % 2 ? 6 : -6), duration: 0.12, yoyo: true, repeat: 3, stagger: 0.03 });
      gsap.fromTo('[data-lily]', { rotation: 0 }, { rotation: 12, duration: 0.25, yoyo: true, repeat: 1, ease: 'power1.inOut' });
    }
  };

  const onKey = (e: KeyboardEvent) => {
    const d = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 6, PageDown: -6 }[e.key];
    if (d) set(inches + d);
    else if (e.key === 'Home') set(GATE_MIN);
    else if (e.key === 'End') set(GATE_MAX);
    else if (e.key === 'Enter') submit();
    else return;
    e.preventDefault();
  };

  // New books drop onto the stack.
  const prevBooks = useRef(books);
  useLayoutEffect(() => {
    if (!still && books > prevBooks.current) gsap.from('[data-books] > :last-child', { y: -30, opacity: 0, duration: 0.35, ease: 'bounce.out' });
    prevBooks.current = books;
  }, [books, still]);

  // The right answer: pencil line, door swings open, warm light floods out, then in we go.
  useLayoutEffect(() => {
    if (!open) return;
    sfx.play('chime');
    try {
      sessionStorage.setItem(KEY, '1');
    } catch {
      /* private mode: she'll just be measured again next time */
    }
    if (still) {
      const id = setTimeout(onPass, 1200);
      return () => clearTimeout(id);
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({ onComplete: onPass })
        .from('[data-mark]', { scaleX: 0, transformOrigin: 'left center', duration: 0.5, ease: 'power2.out' })
        .from('[data-welcome] > *', { opacity: 0, y: 8, stagger: 0.25, duration: 0.4 }, '<0.2')
        .to('[data-lily]', { y: -14, duration: 0.18, yoyo: true, repeat: 3, ease: 'power1.out' }, '<')
        .add(() => sfx.play('door'), '+=0.3')
        .to('[data-door-panel]', { rotationY: -100, duration: 1.1, ease: 'power2.inOut' }, '<')
        .to('[data-glow]', { opacity: 1, duration: 1.2, ease: 'power1.in' }, '<0.3')
        .to(root.current, { opacity: 0, duration: 0.6 }, '+=0.2');
    }, root);
    return () => ctx.revert();
  }, [open, still, onPass]);

  const mark = (n: number) => `calc(${n * ppi}px)`;

  return (
    <div
      ref={root}
      onPointerDown={unlockAudio}
      onKeyDown={(e) => {
        unlockAudio();
        // Enter on a focused button is that button's job; everything else drives the pencil from anywhere.
        if (e.key === 'Enter' && (e.target as HTMLElement).tagName === 'BUTTON') return;
        onKey(e);
      }}
      className="pointer-events-auto absolute inset-0 z-50 flex flex-col items-center justify-start gap-6 overflow-x-hidden overflow-y-auto px-4 py-6 sm:flex-row sm:justify-center sm:gap-[6vw] sm:py-0"
      style={{
        background:
          'linear-gradient(to bottom, transparent 82%, #5c3b26 82%), repeating-linear-gradient(90deg, #3b2440 0 18px, #432a49 18px 26px)',
      }}
      data-testid="height-gate"
    >
      {/* warm light that floods out when the door opens */}
      <div data-glow className="pointer-events-none absolute inset-0 z-10 opacity-0" style={{ background: 'radial-gradient(circle at 35% 55%, #ffe2a8 0%, #f2b866 35%, rgba(242,184,102,0) 75%)' }} />

      {/* the scene: door frame with growth chart, Lily, Ishu (+ books) */}
      <div className="relative flex shrink-0 items-end gap-3" style={{ height: DOOR_IN * ppi + 12 }}>
        <img data-lily aria-hidden src={lily.url} alt="" className="pixel-img origin-bottom" style={{ height: 24 * ppi, width: (24 * ppi * lily.w) / lily.h }} />

        <div data-door aria-hidden className="relative" style={{ width: 34 * ppi, height: DOOR_IN * ppi, perspective: 900 }}>
          <div className="absolute inset-0 rounded-t-sm border-[6px] border-b-0 border-[#6b4528] bg-[#1a0f14]" />
          <div
            data-door-panel
            className="absolute inset-[6px] bottom-0 origin-left rounded-t-[2px] bg-[#7a4a2c] shadow-[inset_0_0_0_3px_#5a3420]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="absolute inset-x-[14%] top-[8%] h-[34%] border-[3px] border-[#5a3420]" />
            <div className="absolute inset-x-[14%] top-[50%] h-[40%] border-[3px] border-[#5a3420]" />
            <div className="absolute top-1/2 right-[10%] h-3 w-3 rounded-full bg-[#e9c46a] shadow-[1px_1px_0_#000]" />
          </div>
        </div>

        {/* growth chart on the jamb: the slider */}
        <div
          role="slider"
          tabIndex={0}
          aria-label="Your height (drag the pencil)"
          aria-valuemin={GATE_MIN}
          aria-valuemax={GATE_MAX}
          aria-valuenow={inches}
          aria-valuetext={`${Math.floor(inches / 12)} feet ${inches % 12} inches`}
          ref={(el) => {
            ruler.current = el;
          }}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            fromPointer(e);
          }}
          onPointerMove={(e) => e.buttons && fromPointer(e)}
          className="relative w-16 cursor-ns-resize touch-none rounded-sm bg-[#d9c093] shadow-[inset_0_0_0_2px_#8a603f] outline-none focus-visible:ring-4 focus-visible:ring-gold"
          style={{ height: DOOR_IN * ppi }}
        >
          {Array.from({ length: GATE_MAX - GATE_MIN + 1 }, (_, i) => {
            const n = GATE_MIN + i;
            const foot = n % 12 === 0;
            const half = n % 6 === 0;
            return (
              <div key={n} className="absolute left-0 h-px bg-[#5a3420]" style={{ bottom: mark(n), width: foot ? '60%' : half ? '40%' : '22%' }}>
                {half && <span className="absolute top-[-7px] left-[calc(100%+2px)] font-title text-[7px] text-[#5a3420]">{feetInches(n)}</span>}
              </div>
            );
          })}
          {tries >= GATE_HINT_AFTER && !open && (
            <div className="absolute right-1 text-[#7a2333]" style={{ bottom: `calc(${mark(GATE_ANSWER)} - 6px)` }} title="Lily marked this one">
              <PawMark />
            </div>
          )}
          {open && (
            <div data-mark className="absolute left-0 h-[3px] w-[140%] bg-[#7a2333]" style={{ bottom: mark(GATE_ANSWER) }}>
              <span className="absolute -top-4 left-full ml-1 font-title text-[8px] whitespace-nowrap text-[#f3e7cc]">ISHU · 14/10</span>
            </div>
          )}
          {/* the pencil */}
          <div className="pointer-events-none absolute inset-x-0 h-[2px] bg-[#2b1d14] transition-[bottom] duration-100" style={{ bottom: mark(inches) }}>
            <span className="absolute top-[-4px] right-full">
              <Pencil />
            </span>
          </div>
        </div>

        <div aria-hidden className="relative flex flex-col items-center" style={{ width: 26 * ppi }}>
          <img
            src={ishu.url}
            alt=""
            className="pixel-img transition-[height,margin] duration-200 ease-out"
            style={{ height: ishuH, width: (GATE_ANSWER * ppi * ishu.w) / ishu.h, marginBottom: 0 }}
          />
          <div data-books className="flex w-full flex-col-reverse items-center" style={{ height: lift }}>
            {Array.from({ length: books }, (_, i) => (
              <div
                key={i}
                className="rounded-[2px] border border-black/40"
                style={{
                  height: lift / books,
                  width: `${88 - (i % 3) * 8}%`,
                  marginLeft: `${(i % 2 ? 6 : -6)}%`,
                  background: BOOK_COLOURS[i % BOOK_COLOURS.length],
                  boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.15)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* the panel */}
      <div className="letter relative z-0 w-full max-w-[380px] rotate-[1deg] rounded-sm px-6 py-5 text-[#2b1d14]">
        <p className="font-pixel text-sm tracking-[0.25em] text-[#6b4528] uppercase">The front door</p>
        <h1 className="mt-2 font-title text-[15px] leading-relaxed text-[#7a2333]">Who goes there?</h1>
        <p className="mt-2 text-lg leading-snug">This door opens for exactly one person. Prove it is you.</p>

        <label className="mt-4 block font-title text-[9px] text-[#6b4528] uppercase">Password: your height</label>
        <div className="mt-1 flex items-center gap-3">
          <button aria-label="One inch shorter" className="letter-btn !px-3" onClick={() => set(inches - 1)} disabled={open}>
            ▼
          </button>
          <output aria-live="polite" className="flex-1 text-center font-title text-2xl text-[#2b1d14] tabular-nums" data-testid="gate-height">
            {feetInches(inches)}
          </output>
          <button aria-label="One inch taller" className="letter-btn !px-3" onClick={() => set(inches + 1)} disabled={open}>
            ▲
          </button>
        </div>
        <p className="mt-2 min-h-[2.6em] text-base leading-snug text-[#6b4528] italic">{open ? '' : caption}</p>

        {verdict && (
          <p role="alert" className="mt-1 rounded border-2 border-[#7a2333]/40 bg-[#7a2333]/10 px-3 py-2 text-lg leading-snug text-[#7a2333]" data-testid="gate-tease">
            {verdict}
          </p>
        )}
        {open && (
          <div data-welcome className="mt-1 space-y-1 text-lg text-[#3f6b3f]">
            {GATE_WELCOME.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        )}

        <button className="letter-btn mt-4 w-full" onClick={submit} disabled={open} data-testid="gate-submit">
          Measure me
        </button>
        <p className="mt-3 text-sm leading-snug text-[#6b4528]">Drag the pencil on the door frame, or use ↑ ↓. Enter to measure.</p>
        {tries > 0 && !open && (
          <p className="mt-1 text-sm text-[#7a2333]/80" aria-live="polite">
            Wrong guesses: {'|'.repeat(Math.min(tries, 12))} {tries >= GATE_HINT_AFTER ? '(Lily has left you a clue on the door frame.)' : ''}
          </p>
        )}
      </div>
    </div>
  );
}

function Pencil() {
  return (
    <svg width="56" height="10" viewBox="0 0 28 5" style={{ shapeRendering: 'crispEdges' }} aria-hidden>
      <rect x="0" y="1" width="3" height="3" fill="#e88a9a" />
      <rect x="3" y="1" width="2" height="3" fill="#c0c0c8" />
      <rect x="5" y="0" width="17" height="5" fill="#e9c46a" />
      <rect x="5" y="2" width="17" height="1" fill="#c99a3a" />
      <rect x="22" y="1" width="3" height="3" fill="#f3d9b0" />
      <rect x="25" y="2" width="3" height="1" fill="#2b1d14" />
    </svg>
  );
}

function PawMark() {
  return (
    <svg width="14" height="14" viewBox="0 0 10 10" fill="currentColor" style={{ shapeRendering: 'crispEdges' }} aria-hidden>
      <rect x="1" y="2" width="2" height="2" />
      <rect x="4" y="0" width="2" height="2" />
      <rect x="7" y="2" width="2" height="2" />
      <rect x="2" y="5" width="6" height="2" />
      <rect x="3" y="7" width="4" height="2" />
    </svg>
  );
}
