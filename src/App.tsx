import { PhaserGame } from '@/game/PhaserGame';
import { DialogueBox } from '@/ui/DialogueBox';
import { TitleScreen } from '@/ui/TitleScreen';

export default function App() {
  return (
    <main className="relative h-dvh w-dvw overflow-hidden bg-slate-950">
      <PhaserGame />
      {/* UI overlay: pointer-events off except on interactive panels */}
      <div className="pointer-events-none absolute inset-0">
        <TitleScreen />
        <DialogueBox />
      </div>
    </main>
  );
}
