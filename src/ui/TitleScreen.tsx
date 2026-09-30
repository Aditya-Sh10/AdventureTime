import { useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '@/store/gameStore';
import { continueGame, newGame } from '@/game/flow';
import { hasSave } from '@/game/systems/save';
import { SettingsPanel } from './GameMenu';

export function TitleScreen() {
  const mode = useGame((s) => s.mode);
  const [view, setView] = useState<'main' | 'confirm' | 'settings'>('main');
  if (mode !== 'title') return null;
  const canContinue = hasSave();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-10 bg-gradient-to-b from-black/70 via-black/40 to-black/80 px-4 text-parch"
    >
      <div className="text-center">
        <p className="mb-4 font-pixel text-lg tracking-[0.3em] text-parch/70">A QUEST FOR ONE PERSON ONLY</p>
        <h1 className="font-title text-2xl leading-relaxed text-gold drop-shadow-[0_3px_0_#000] sm:text-4xl">
          The Hidden
          <br />
          Treasure
        </h1>
      </div>

      {view === 'main' && (
        <div className="flex flex-col items-stretch gap-3">
          {canContinue && (
            <button data-testid="continue" autoFocus className="btn" onClick={continueGame}>
              Continue
            </button>
          )}
          <button
            data-testid="new-game"
            autoFocus={!canContinue}
            className="btn"
            onClick={() => (canContinue ? setView('confirm') : newGame())}
          >
            New Game
          </button>
          <button className="btn" onClick={() => setView('settings')}>
            Settings
          </button>
        </div>
      )}

      {view === 'confirm' && (
        <div className="panel flex max-w-sm flex-col items-center gap-4 p-5 text-center text-lg">
          <p>Start over? Your current progress will be overwritten.</p>
          <div className="flex gap-3">
            <button data-testid="confirm-new" autoFocus className="btn" onClick={newGame}>
              Start over
            </button>
            <button className="btn" onClick={() => setView('main')}>
              Back
            </button>
          </div>
        </div>
      )}

      {view === 'settings' && (
        <div className="panel w-[min(92vw,520px)] p-5">
          <SettingsPanel />
          <button className="btn mt-4 w-full" onClick={() => setView('main')}>
            Back
          </button>
        </div>
      )}

      <p className="absolute bottom-4 font-pixel text-sm text-parch/50">
        WASD / Arrows to move · E / Space to interact · Esc for menu · Headphones recommended
      </p>
    </motion.div>
  );
}
