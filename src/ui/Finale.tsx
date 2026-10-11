import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { CREDITS, MESSAGE, finaleStats } from '@/data/finale';
import { dialogue } from '@/game/services';
import { quitToTitle } from '@/game/flow';
import { bus } from '@/game/systems/events';
import { session } from '@/game/systems/session';
import { useGame } from '@/store/gameStore';

/** "Happy Birthday, Ishu" over the fireworks (`# show:birthday`). Stays up while the finale dialogue plays. */
export function BirthdayBanner() {
  const [on, setOn] = useState(false);
  const ended = useGame((s) => s.mode === 'ended');
  useEffect(() => {
    const offShow = bus.on('show', ({ what }) => what === 'birthday' && setOn(true));
    const offMap = bus.on('load-map', () => setOn(false));
    return () => (offShow(), offMap());
  }, []);
  return (
    <AnimatePresence>
      {on && !ended && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
          className="absolute inset-x-0 top-[10%] text-center"
          data-testid="birthday-banner"
        >
          <h1 className="font-title text-2xl leading-relaxed text-gold drop-shadow-[0_2px_0_#120e18] sm:text-4xl">
            Happy Birthday, Ishu <span className="text-[#ff4c6a]">♥</span>
          </h1>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const PAGES = ['stats', 'message', 'credits'] as const;

/** The real ending (`# end_demo:finale`): stats → the personal message → credits. */
export function FinaleEnd() {
  const [page, setPage] = useState(0);
  const which = PAGES[page];
  const last = page === PAGES.length - 1;
  const stats = finaleStats((v) => dialogue.get(v), session.playMs);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.6 }}
      className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-y-auto bg-black/80 px-4 py-8 text-parch"
      data-testid="finale-end"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={which}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.6 }}
          className="flex w-full flex-col items-center gap-6"
        >
          {which === 'stats' && (
            <>
              <p className="font-title text-sm uppercase tracking-[0.3em] text-gold sm:text-lg">The Hidden Treasure</p>
              <ul className="panel w-[min(94vw,600px)] space-y-2 p-5 text-lg" data-testid="finale-stats">
                {stats.map((s) => (
                  <li key={s.label} className="flex items-baseline justify-between gap-4">
                    <span>
                      {s.label}
                      {s.note && <span className="text-parch/55 italic"> ({s.note})</span>}
                    </span>
                    <span className="shrink-0 font-title text-sm text-gold">{s.value}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {which === 'message' && (
            <div className="panel w-[min(94vw,640px)] space-y-4 p-6 text-xl leading-relaxed" data-testid="finale-message">
              {MESSAGE.lines.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
              <p className="text-right text-gold">{MESSAGE.signed}</p>
            </div>
          )}
          {which === 'credits' && (
            <div className="w-[min(94vw,600px)] space-y-3 text-center font-pixel text-lg text-parch/85">
              <p className="font-title text-sm text-gold">Credits</p>
              {CREDITS.map((c) => (
                <p key={c}>{c}</p>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex gap-3">
        {!last && (
          <button className="btn" onClick={() => setPage(page + 1)} autoFocus data-testid="finale-next">
            Next
          </button>
        )}
        {last && (
          <button className="btn" onClick={quitToTitle} autoFocus>
            Back to title
          </button>
        )}
      </div>
    </motion.div>
  );
}
