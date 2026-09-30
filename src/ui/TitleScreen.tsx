import { motion } from 'motion/react';
import { gameStore, useGame } from '@/store/gameStore';

export function TitleScreen() {
  const mode = useGame((s) => s.mode);
  if (mode !== 'title') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-8 bg-slate-950/85 text-amber-50"
    >
      <h1 className="font-title text-center text-2xl leading-relaxed text-amber-200 md:text-4xl">The Hidden Treasure</h1>
      <button
        data-testid="new-game"
        autoFocus
        className="font-title rounded border-2 border-amber-200 px-6 py-3 text-sm hover:bg-amber-200 hover:text-slate-950"
        onClick={() => gameStore.getState().setMode('play')}
      >
        New Game
      </button>
    </motion.div>
  );
}
