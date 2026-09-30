import { useEffect } from 'react';
import { PhaserGame } from '@/game/PhaserGame';
import { gameStore } from '@/store/gameStore';
import { ChapterCard, Hud, ToastView } from '@/ui/Hud';
import { DemoEnd } from '@/ui/DemoEnd';
import { DialogueBox } from '@/ui/DialogueBox';
import { closeMenu, GameMenu, openMenu } from '@/ui/GameMenu';
import { TitleScreen } from '@/ui/TitleScreen';

export default function App() {
  useGlobalKeys();
  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-[#0b0b14] select-none">
      <PhaserGame />
      {/* UI overlay: pointer-events off except on interactive panels */}
      <div className="pointer-events-none absolute inset-0">
        <Hud />
        <ChapterCard />
        <ToastView />
        <DialogueBox />
        <GameMenu />
        <DemoEnd />
        <TitleScreen />
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
