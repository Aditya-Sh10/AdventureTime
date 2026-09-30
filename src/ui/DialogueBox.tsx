import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useGame, type DialogueLine } from '@/store/gameStore';
import { dialogue } from '@/game/services';

const CHARS_PER_SEC = 45; // TODO: from settings store (text speed)

export function DialogueBox() {
  const line = useGame((s) => s.line);
  const choices = useGame((s) => s.choices);
  return (
    <AnimatePresence>
      {line && (
        <motion.div
          data-testid="dialogue"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-auto absolute inset-x-0 bottom-4 mx-auto w-[min(92%,900px)] rounded-lg border-2 border-amber-200/70 bg-slate-950/90 p-4 font-pixel text-amber-50 shadow-xl"
        >
          <Panel key={line.id} line={line} choices={choices} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Remounts per line (keyed by id), so the typewriter starts fresh. */
function Panel({ line, choices }: { line: DialogueLine; choices: string[] }) {
  const [shown, setShown] = useState(0);
  const full = line.text;
  const done = shown >= full.length;

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const n = Math.floor(((performance.now() - start) / 1000) * CHARS_PER_SEC);
      setShown((s) => Math.max(s, n));
      if (n < full.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [full]);

  const next = () => (done ? !choices.length && dialogue.advance() : setShown(full.length));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (choices.length && done) {
        const n = Number(e.key);
        if (n >= 1 && n <= choices.length) dialogue.choose(n - 1);
        return;
      }
      if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
        e.preventDefault();
        if (!done) setShown(full.length);
        else if (!choices.length) dialogue.advance();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choices, done, full]);

  return (
    <div onClick={next}>
      {line.speaker && <div className="mb-1 font-title text-xs text-amber-300">{line.speaker}</div>}
      <p className="min-h-[3.5em] text-lg leading-snug">{full.slice(0, shown)}</p>
      {done && choices.length > 0 && (
        <ul className="mt-2 space-y-1">
          {choices.map((c, i) => (
            <li key={c}>
              <button
                className="text-left hover:text-amber-300 focus:text-amber-300 focus:outline-none"
                onClick={(e) => {
                  e.stopPropagation();
                  dialogue.choose(i);
                }}
              >
                {i + 1}. {c}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
