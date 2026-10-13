import { useCallback, useEffect, useState } from 'react';
import { PhaserGame } from '@/game/PhaserGame';
import { gameStore, useGame } from '@/store/gameStore';
import { sfx } from '@/game/systems/audio';
import { ChapterCard, Hud, ToastView } from '@/ui/Hud';
import { DemoEnd } from '@/ui/DemoEnd';
import { DialogueBox } from '@/ui/DialogueBox';
import { BirthdayBanner } from '@/ui/Finale';
import { closeMenu, GameMenu, openMenu } from '@/ui/GameMenu';
import { PuzzleModal } from '@/ui/PuzzleModal';
import { TitleScreen } from '@/ui/TitleScreen';
import { HeightGate, gatePassed } from '@/ui/HeightGate';

export default function App() {
  useGlobalKeys();
  const mode = useGame((s) => s.mode);
  const [passed, setPassed] = useState(gatePassed);
  const onPass = useCallback(() => {
    setPassed(true);
    // The gate was her first click, so audio is unlocked: the window seat gets its music.
    sfx.music.play('home');
    sfx.ambience.play('room');
  }, []);
  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-[#0b0b14] select-none">
      <PhaserGame />
      {/* UI overlay: pointer-events off except on interactive panels */}
      <div className="pointer-events-none absolute inset-0">
        <Hud />
        <ChapterCard />
        <ToastView />
        <BirthdayBanner />
        <DialogueBox />
        <GameMenu />
        <PuzzleModal />
        <DemoEnd />
        {passed ? <TitleScreen /> : mode === 'title' && <HeightGate onPass={onPass} />}
      </div>
    </main>
  );
}

/** Esc toggles the menu; I opens items. Only while playing (never mid-dialogue). */
function useGlobalKeys() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { mode } = gameStore.getState();
      if (e.code === 'Escape') {
        if (mode === 'play') openMenu('system');
        else if (mode === 'menu') closeMenu();
      } else if (e.code === 'KeyI') {
        if (mode === 'play') openMenu('items');
        else if (mode === 'menu' && gameStore.getState().menuTab === 'items') closeMenu();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
