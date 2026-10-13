import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HINT_AFTER_TRIES, type ObjectionPuzzle } from '@/data/puzzles';
import { sfx } from '@/game/systems/audio';
import { newDuel, pickExhibit } from '@/game/systems/puzzle';

/**
 * Courtroom duel (`kind: 'objection'`): a claim is read out; present the exhibit that counters it.
 * Forgiving by design: wrong picks only earn a Snape quip, and the round's hint shows after a couple of misses.
 */
export function ObjectionDuel({ p, onClose }: { p: ObjectionPuzzle; onClose: (knot?: string) => void }) {
  const answers = p.rounds.map((r) => r.answer);
  const [duel, setDuel] = useState(newDuel);
  const [sel, setSel] = useState(0);
  // Round whose OBJECTION! is on screen (waiting for Continue), else null.
  const [won, setWon] = useState<number | null>(null);
  const [lastWrong, setLastWrong] = useState(0);

  const shown = won ?? duel.round;
  const round = p.rounds[Math.min(shown, p.rounds.length - 1)];

  const present = (i: number) => {
    if (won !== null) return;
    setSel(i);
    const { state, correct } = pickExhibit(duel, p.exhibits[i].id, answers);
    if (correct) {
      sfx.play('objection');
      setWon(duel.round);
    } else {
      sfx.play('sigh');
      setLastWrong((n) => n + 1);
    }
    setDuel(state);
  };

  const proceed = () => {
    if (won === null) return;
    sfx.play('select');
    if (duel.done) onClose(p.solved);
    else setWon(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const n = Number(e.key);
      if (e.code === 'Escape') onClose();
      else if (won !== null && (e.code === 'Enter' || e.code === 'Space')) proceed();
      else if (won !== null) return;
      else if (n >= 1 && n <= p.exhibits.length) present(n - 1);
      else if (e.code === 'ArrowLeft') setSel((s) => Math.max(0, s - 1));
      else if (e.code === 'ArrowRight') setSel((s) => Math.min(p.exhibits.length - 1, s + 1));
      else if (e.code === 'Enter') present(sel);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const quip = won === null && duel.tries > 0 ? round.wrong[(duel.tries - 1) % round.wrong.length] : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/65 p-4"
      data-testid="puzzle"
    >
      <motion.div
        key={lastWrong}
        animate={lastWrong ? { x: [0, -8, 8, -5, 5, 0] } : undefined}
        transition={{ duration: 0.35 }}
        className="panel relative flex w-[min(94vw,640px)] flex-col items-center gap-4 overflow-hidden p-5 text-center"
      >
        <h2 className="font-title text-sm text-gold">{p.title}</h2>
        <p className="text-sm text-parch/60" data-testid="duel-round">
          Claim {shown + 1} of {p.rounds.length}
        </p>
        <p className="min-h-[3em] text-lg text-parch" data-testid="duel-claim">
          <span className="text-gold">{round.speaker}:</span> {round.claim}
        </p>

        <div className="grid w-full grid-cols-3 gap-3">
          {p.exhibits.map((ex, i) => (
            <button
              key={ex.id}
              onClick={() => present(i)}
              disabled={won !== null}
              data-testid={`exhibit-${ex.id}`}
              className={`flex flex-col gap-1 rounded border-2 p-2 text-left transition-colors ${
                i === sel ? 'border-gold bg-gold/10' : 'border-parch/25 hover:border-parch/60'
              }`}
            >
              <span className="font-title text-[10px] text-gold">
                {i + 1}. {ex.name}
              </span>
              <span className="text-base leading-tight text-parch/80">{ex.desc}</span>
            </button>
          ))}
        </div>

        <p className="min-h-[1.5em] text-lg" data-testid="puzzle-quip">
          {quip && (
            <span className="text-parch/90">
              <span className="text-gold">Snape:</span> {quip}
            </span>
          )}
        </p>
        {won === null && duel.tries >= HINT_AFTER_TRIES && <p className="text-lg text-gold/80">{round.hint}</p>}
        {won === null && (
          <p className="text-sm text-parch/50">1–3 or click to present · ←→ + Enter · Esc to step back</p>
        )}

        {won !== null && (
          <motion.div
            key={won}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-ink p-6"
            data-testid="objection"
          >
            <motion.span
              initial={{ scale: 2.4, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: -4, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 380, damping: 16 }}
              className="font-title text-3xl text-[#ff5a4a] [text-shadow:3px_3px_0_#1a1320]"
            >
              OBJECTION!
            </motion.span>
            <p className="text-lg text-parch">
              <span className="text-gold">Ishu:</span> {p.rounds[won].objection}
            </p>
            <button className="btn" onClick={proceed} data-testid="duel-continue">
              {duel.done ? 'Hear the verdict' : 'Next claim'}
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
