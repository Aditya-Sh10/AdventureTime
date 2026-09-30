import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gameStore, useGame } from '@/store/gameStore';
import { QUESTS } from '@/data/quests';
import { CHAPTERS } from '@/data/chapters';
import { iconURL } from '@/game/art/props';
import { Portrait, resolvePortrait } from './Portrait';

/** Objective line + controls hint. Hidden on title/end screens. */
export function Hud() {
  const mode = useGame((s) => s.mode);
  const quest = useGame((s) => s.quest);
  const mapName = useGame((s) => s.mapName);
  if (mode === 'title' || mode === 'ended') return null;

  return (
    <>
      <div className="absolute left-3 top-3 max-w-[60%] font-pixel text-parch drop-shadow-[0_2px_0_#000]">
        <div className="text-xs uppercase tracking-[0.25em] text-parch/60">{mapName}</div>
        <AnimatePresence mode="wait">
          {quest && (
            <motion.div
              key={quest}
              data-testid="objective"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="mt-1 text-lg leading-tight"
            >
              <span className="text-gold">✦ </span>
              {QUESTS[quest].title}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute right-3 top-3 font-pixel text-sm text-parch/45">Esc menu · I items</div>
    </>
  );
}

/** Non-blocking notifications: item received, Snape's hint nags. */
export function ToastView() {
  const toast = useGame((s) => s.toast);
  useEffect(() => {
    if (!toast) return;
    const id = toast.id;
    const t = setTimeout(() => gameStore.getState().toast?.id === id && gameStore.setState({ toast: null }), 5000);
    return () => clearTimeout(t);
  }, [toast]);
  const portrait = toast?.speaker ? resolvePortrait(toast.speaker, toast.portrait) : null;

  return (
    <div className="absolute inset-x-0 top-14 flex justify-center px-4">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            data-testid="toast"
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -16, opacity: 0 }}
            className="panel flex max-w-lg items-center gap-3 px-3 py-2 text-lg"
          >
            {portrait && <Portrait src={portrait} size={48} />}
            {toast.icon && <img src={iconURL(toast.icon)} alt="" className="pixel-img h-8 w-8" />}
            <span>
              {toast.speaker && <span className="mr-2 font-title text-[9px] text-gold">{toast.speaker}</span>}
              {toast.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ChapterCard() {
  const card = useGame((s) => s.chapterCard);
  useEffect(() => {
    if (!card) return;
    const t = setTimeout(() => gameStore.setState({ chapterCard: null }), 3200);
    return () => clearTimeout(t);
  }, [card]);

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          key={card}
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          animate={{ opacity: 1, letterSpacing: '0.2em' }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
          className="absolute inset-x-0 top-[18%] text-center drop-shadow-[0_3px_0_#000]"
        >
          <div className="font-pixel text-lg uppercase text-parch/80">{CHAPTERS[card].kicker}</div>
          <div className="mt-2 font-title text-xl text-gold sm:text-3xl">{CHAPTERS[card].title}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
