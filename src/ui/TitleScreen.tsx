import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGame } from '@/store/gameStore';
import { continueGame, newGame, newGameAt } from '@/game/flow';
import { DEV_JUMPS } from '@/game/devJumps';
import { sfx } from '@/game/systems/audio';
import { hasSave } from '@/game/systems/save';
import { ROOM_TIP } from '@/data/title';
import { CozyScene } from './CozyScene';
import { SettingsPanel } from './SettingsPanel';
import { useReducedMotion } from './useReducedMotion';

type View = 'main' | 'confirm' | 'settings';
interface Item {
  id: string;
  label: string;
  hint: string;
  run: () => void;
}

/**
 * Title: Ishu's window seat at 11:57 PM (CozyScene), and the menu written on a letter pinned to the wall.
 * ↑/↓ or W/S move the paw, Enter picks; Esc backs out of a sub-view. GSAP handles the letter's entrance and
 * the view changes (skipped under reduced motion).
 */
export function TitleScreen() {
  const mode = useGame((s) => s.mode);
  if (mode !== 'title') return null;
  return <Title />;
}

function Title() {
  const [view, setView] = useState<View>('main');
  const canContinue = hasSave();
  const still = useReducedMotion();
  const card = useRef<HTMLDivElement>(null);

  const go = (v: View) => {
    sfx.play(v === 'main' ? 'select' : 'page');
    setView(v);
  };

  const items: Item[] = [
    ...(canContinue ? [{ id: 'continue', label: 'Continue', hint: 'Back to where you fell asleep.', run: continueGame }] : []),
    {
      id: 'new-game',
      label: 'New Game',
      hint: canContinue ? 'Open a brand-new letter.' : 'Open the letter.',
      run: () => (canContinue ? go('confirm') : newGame()),
    },
    { id: 'settings', label: 'Settings', hint: 'Fiddle with the knobs.', run: () => go('settings') },
  ];

  // The letter drops onto the wall, then its lines are written in one by one.
  useLayoutEffect(() => {
    if (still || !card.current) return;
    const ctx = gsap.context(() => {
      gsap.from(card.current, { y: -40, rotation: -6, opacity: 0, duration: 0.7, ease: 'back.out(1.6)' });
      gsap.from('[data-line]', { opacity: 0, x: -8, duration: 0.35, stagger: 0.07, delay: 0.35, ease: 'power2.out' });
    }, card);
    return () => ctx.revert();
  }, [still]);

  // Each view change: the next page settles in.
  useLayoutEffect(() => {
    if (still || !card.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('[data-view]', { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    }, card);
    return () => ctx.revert();
  }, [view, still]);

  useEffect(() => {
    if (view === 'main') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      sfx.play('select');
      setView('main');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view]);

  return (
    <div className="pointer-events-auto absolute inset-0 overflow-hidden bg-ink">
      <CozyScene />

      <div className="pointer-events-none absolute inset-0 flex items-end justify-center p-4 pb-14 sm:items-center sm:justify-end sm:pr-[7vw] sm:pb-4">
        <div ref={card} className={`pointer-events-auto w-full ${view === 'settings' ? 'max-w-[520px]' : 'max-w-[360px]'}`}>
          {view === 'settings' ? (
            <div data-view className="panel max-h-[78dvh] overflow-y-auto rounded-xl p-5 shadow-[6px_6px_0_rgba(0,0,0,0.5)]">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-title text-xs text-gold">Settings</h2>
                <span className="font-pixel text-sm text-parch/60">Esc to close</span>
              </div>
              <SettingsPanel />
              <button className="btn mt-5 w-full" onClick={() => go('main')}>
                Back to the letter
              </button>
            </div>
          ) : (
            <Letter>
              {view === 'main' ? (
                <MenuList items={items} />
              ) : (
                <div data-view className="space-y-4 text-center">
                  <p className="text-lg leading-snug">Start over? Your current adventure will be forgotten. Snape will be delighted.</p>
                  <div className="flex justify-center gap-3">
                    <button data-testid="confirm-new" autoFocus className="letter-btn" onClick={newGame}>
                      Start over
                    </button>
                    <button className="letter-btn" onClick={() => go('main')}>
                      Keep it
                    </button>
                  </div>
                </div>
              )}
            </Letter>
          )}
        </div>
      </div>

      {import.meta.env.DEV && view === 'main' && <DevJumps />}

      <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center font-pixel text-sm text-parch/60">
        ↑ ↓ choose · Enter open · WASD to walk in-game · Headphones recommended
      </p>
    </div>
  );
}

/** The parchment card: title, a line of ink, whatever menu page is showing, and G.'s wax seal. */
function Letter({ children }: { children: React.ReactNode }) {
  return (
    <div className="letter relative rotate-[-1.5deg] rounded-sm px-7 pt-6 pb-7 text-[#2b1d14]">
      <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[#3a1a12] bg-[#a3243a] shadow-[1px_2px_0_#000]" />
      <p data-line className="font-pixel text-sm tracking-[0.25em] text-[#6b4528] uppercase">
        A quest for one person only
      </p>
      <h1 data-line className="mt-3 font-title text-[19px] leading-[1.5] text-[#7a2333] drop-shadow-[2px_2px_0_rgba(233,196,106,0.6)]">
        The Hidden
        <br />
        Treasure
      </h1>
      <div data-line aria-hidden className="my-4 h-[2px] w-full bg-[repeating-linear-gradient(90deg,#6b4528_0_6px,transparent_6px_10px)]" />
      {children}
      <p data-line className="mt-5 font-pixel text-sm leading-snug text-[#6b4528] italic">
        {ROOM_TIP}
      </p>
      <span
        aria-hidden
        className="absolute -right-4 -bottom-4 grid h-14 w-14 rotate-12 place-items-center rounded-full border-2 border-[#5a1220] bg-[#a3243a] font-title text-sm text-[#f3d0a0] shadow-[2px_3px_0_rgba(0,0,0,0.5)]"
      >
        G.
      </span>
    </div>
  );
}

/** Menu lines on the letter. A paw print marks the chosen one; arrows / W S move it, Enter picks. */
function MenuList({ items }: { items: Item[] }) {
  const [sel, setSel] = useState(0);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const d = { ArrowDown: 1, KeyS: 1, ArrowUp: -1, KeyW: -1 }[e.code];
      if (!d) return;
      e.preventDefault();
      sfx.play('select');
      setSel((s) => (s + d + items.length) % items.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [items.length]);

  useEffect(() => {
    btns.current[sel]?.focus({ preventScroll: true });
  }, [sel]);

  return (
    <nav data-view aria-label="Main menu">
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={it.id} data-line>
            <button
              ref={(el) => {
                btns.current[i] = el;
              }}
              data-testid={it.id}
              autoFocus={i === 0}
              onMouseEnter={() => setSel(i)}
              onFocus={() => setSel(i)}
              onClick={it.run}
              className="group flex min-h-11 w-full cursor-pointer items-center gap-3 rounded px-2 text-left outline-none transition-colors duration-150 focus-visible:bg-[#7a2333]/10"
            >
              <Paw on={i === sel} />
              <span className="flex-1">
                <span className={`block font-title text-[13px] transition-colors duration-150 ${i === sel ? 'text-[#7a2333]' : 'text-[#2b1d14]'}`}>{it.label}</span>
                <span className={`block font-pixel text-sm text-[#6b4528] transition-opacity duration-150 ${i === sel ? 'opacity-100' : 'opacity-0'}`}>{it.hint}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Lily's paw print: the menu cursor. */
function Paw({ on }: { on: boolean }) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 10 10"
      className={`shrink-0 transition-all duration-200 ${on ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}
      style={{ shapeRendering: 'crispEdges' }}
      fill="#7a2333"
    >
      <rect x="1" y="2" width="2" height="2" />
      <rect x="4" y="0" width="2" height="2" />
      <rect x="7" y="2" width="2" height="2" />
      <rect x="2" y="5" width="6" height="2" />
      <rect x="3" y="7" width="4" height="2" />
    </svg>
  );
}

function DevJumps() {
  return (
    <div className="absolute top-3 left-3 flex max-w-[60vw] flex-wrap gap-1 font-pixel text-xs" data-testid="dev-jumps">
      <span className="w-full text-parch/60">DEV: jump to (starts a new game, overwrites the save on autosave)</span>
      {DEV_JUMPS.map((j) => (
        <button
          key={j.label}
          className="rounded border border-parch/30 bg-black/40 px-2 py-0.5 text-parch/80 hover:border-gold hover:text-gold"
          onClick={() => newGameAt(j.map, j.spawn, j.vars)}
        >
          {j.label}
        </button>
      ))}
    </div>
  );
}
