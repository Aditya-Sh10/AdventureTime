import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { gameStore, useGame } from '@/store/gameStore';
import { HINT_AFTER_TRIES, PUZZLES, type CodePuzzle } from '@/data/puzzles';
import { dialogue } from '@/game/services';
import { sfx } from '@/game/systems/audio';
import { isSolved, newCode, spin } from '@/game/systems/puzzle';

/** Generic puzzle shell, opened by ink `# puzzle:<id>`. Only the code-lock variant exists so far. */
export function PuzzleModal() {
  const id = useGame((s) => s.puzzle);
  const mode = useGame((s) => s.mode);
  if (mode !== 'puzzle' || !id) return null;
  return <CodeLock key={id} p={PUZZLES[id]} />;
}

const SOLVE_DELAY_MS = 750;

function close(knot?: string) {
  gameStore.setState({ mode: 'play', puzzle: null, dialogueClosedAt: performance.now() });
  if (knot) dialogue.start(knot);
}

function CodeLock({ p }: { p: CodePuzzle }) {
  const n = p.symbols.length;
  const [code, setCode] = useState(() => newCode(p.answer.length));
  const [sel, setSel] = useState(0);
  const [tries, setTries] = useState(0);
  const [solved, setSolved] = useState(false);

  const turn = (i: number, dir: number) => {
    if (solved) return;
    sfx.play('tap');
    setSel(i);
    setCode((c) => spin(c, i, dir, n));
  };

  const submit = () => {
    if (solved) return;
    if (isSolved(code, p.symbols, p.answer)) {
      setSolved(true);
      sfx.play('chime');
      // Let the wheels flash gold before the story continues (also keeps this Enter press from advancing it).
      window.setTimeout(() => close(p.solved), SOLVE_DELAY_MS);
    } else {
      sfx.play('sigh');
      setTries((t) => t + 1);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (solved) return;
      const key = e.key.toUpperCase();
      if (e.code === 'Escape') close();
      else if (e.code === 'Enter') submit();
      else if (e.code === 'ArrowLeft' || e.code === 'Backspace') setSel((s) => Math.max(0, s - 1));
      else if (e.code === 'ArrowRight') setSel((s) => Math.min(code.length - 1, s + 1));
      else if (e.code === 'ArrowUp') turn(sel, -1);
      else if (e.code === 'ArrowDown') turn(sel, 1);
      else if (key.length === 1 && p.symbols.includes(key)) {
        // Typing sets the selected wheel and moves on: friendlier than spinning for a non-gamer.
        sfx.play('tap');
        setCode((c) => c.map((v, i) => (i === sel ? p.symbols.indexOf(key) : v)));
        setSel((s) => Math.min(code.length - 1, s + 1));
      } else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const quip = tries > 0 ? p.wrong[(tries - 1) % p.wrong.length] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/60 p-4"
      data-testid="puzzle"
    >
      <motion.div
        key={tries}
        animate={tries ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
        transition={{ duration: 0.35 }}
        className="panel flex w-[min(94vw,560px)] flex-col items-center gap-4 p-5 text-center"
      >
        <h2 className="font-title text-sm text-gold">{p.title}</h2>
        <p className="text-lg italic text-parch/85">{p.prompt}</p>
        <div className="flex gap-3">
          {code.map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <button className="px-3 text-gold/80 hover:text-gold" aria-label="previous letter" onClick={() => turn(i, -1)}>
                ▲
              </button>
              <button
                onClick={() => setSel(i)}
                data-testid={`wheel-${i}`}
                className={`flex h-14 w-12 items-center justify-center rounded border-2 font-title text-xl transition-colors ${
                  solved ? 'border-gold bg-gold text-ink' : i === sel ? 'border-gold text-gold' : 'border-parch/30 text-parch'
                }`}
              >
                {p.symbols[v]}
              </button>
              <button className="px-3 text-gold/80 hover:text-gold" aria-label="next letter" onClick={() => turn(i, 1)}>
                ▼
              </button>
            </div>
          ))}
        </div>
        <p className="min-h-[1.5em] text-lg" data-testid="puzzle-quip">
          {solved ? 'Click.' : quip && <span className="text-parch/90"><span className="text-gold">Snape:</span> {quip}</span>}
        </p>
        {!solved && tries >= HINT_AFTER_TRIES && <p className="text-lg text-gold/80">{p.hint}</p>}
        <div className="flex gap-3">
          <button className="btn" onClick={submit} disabled={solved}>
            Try it
          </button>
          <button className="btn opacity-70" onClick={() => close()} disabled={solved}>
            Step back
          </button>
        </div>
        <p className="text-sm text-parch/50">Type letters · ↑↓ spin · ←→ move · Enter to try · Esc to leave</p>
      </motion.div>
    </motion.div>
  );
}
