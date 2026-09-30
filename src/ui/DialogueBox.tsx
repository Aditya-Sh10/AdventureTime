import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useGame, type DialogueLine } from '@/store/gameStore';
import { CHARS_PER_SEC, settingsStore } from '@/store/settingsStore';
import { dialogue } from '@/game/services';
import { sfx } from '@/game/systems/audio';
import { speakerOf } from '@/data/speakers';
import { Portrait, resolvePortrait } from './Portrait';

export function DialogueBox() {
  const line = useGame((s) => s.line);
  const choices = useGame((s) => s.choices);
  return (
    <AnimatePresence>
      {line && (
        <motion.div
          data-testid="dialogue"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="panel pointer-events-auto absolute inset-x-0 bottom-3 mx-auto w-[min(94%,920px)] p-3 sm:p-4"
        >
          <Panel key={line.id} line={line} choices={choices} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Remounts per line (keyed by id), so the typewriter starts fresh. */
function Panel({ line, choices }: { line: DialogueLine; choices: string[] }) {
  const full = line.text;
  const cps = CHARS_PER_SEC[settingsStore.getState().textSpeed];
  const [shown, setShown] = useState(cps === Infinity ? full.length : 0);
  const done = shown >= full.length;
  const portrait = resolvePortrait(line.speaker, line.portrait);

  useEffect(() => {
    if (cps === Infinity) return;
    const voice = speakerOf(line.speaker);
    const start = performance.now();
    let raf = 0;
    let last = 0;
    const tick = () => {
      const n = Math.min(full.length, Math.floor(((performance.now() - start) / 1000) * cps));
      if (n > last) {
        if (/\w/.test(full[n - 1] ?? '')) sfx.blip(voice.pitch, voice.wave);
        last = n;
        setShown((s) => Math.max(s, n));
      }
      if (n < full.length) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [full, cps, line.speaker]);

  const next = () => {
    if (!done) setShown(full.length);
    else if (!choices.length) dialogue.advance();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (choices.length && done) {
        const n = Number(e.key);
        if (n >= 1 && n <= choices.length) {
          sfx.play('select');
          dialogue.choose(n - 1);
        }
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
    <div className="flex cursor-pointer gap-3 sm:gap-4" onClick={next}>
      {portrait && <Portrait src={portrait} />}
      <div className="min-w-0 flex-1">
        {line.speaker && <div className="mb-1 font-title text-[10px] tracking-wider text-gold">{line.speaker}</div>}
        <p className={`min-h-[3.2em] text-lg leading-snug sm:text-xl ${line.speaker ? '' : 'italic text-parch/85'}`}>
          {full.slice(0, shown)}
          <span className="invisible">{full.slice(shown)}</span>
        </p>
        {done && choices.length > 0 && (
          <ul className="mt-2 space-y-1">
            {choices.map((c, i) => (
              <li key={c}>
                <button
                  autoFocus={i === 0}
                  className="w-full rounded px-2 py-0.5 text-left text-lg hover:bg-gold/15 hover:text-gold focus:bg-gold/15 focus:text-gold focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    sfx.play('select');
                    dialogue.choose(i);
                  }}
                >
                  <span className="mr-2 text-gold/70">{i + 1}.</span>
                  {c}
                </button>
              </li>
            ))}
          </ul>
        )}
        {done && !choices.length && (
          <div className="mt-1 text-right font-title text-[8px] text-gold/70 motion-safe:animate-pulse">▼</div>
        )}
      </div>
    </div>
  );
}
