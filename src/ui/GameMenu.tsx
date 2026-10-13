import { useState } from 'react';
import { motion } from 'motion/react';
import { gameStore, useGame, type MenuTab } from '@/store/gameStore';
import { ITEMS, type ItemId } from '@/data/items';
import { CLAUSES } from '@/data/chapters';
import { iconURL } from '@/game/art/props';
import { dialogue } from '@/game/services';
import { quitToTitle, saveNow } from '@/game/flow';
import { sfx } from '@/game/systems/audio';
import { SettingsPanel } from './SettingsPanel';

const TABS: { id: MenuTab; label: string }[] = [
  { id: 'items', label: 'Items' },
  { id: 'settings', label: 'Settings' },
  { id: 'system', label: 'Game' },
];

export function GameMenu() {
  const mode = useGame((s) => s.mode);
  const tab = useGame((s) => s.menuTab);
  if (mode !== 'menu') return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pointer-events-auto absolute inset-0 flex items-center justify-center bg-black/55 p-4"
      onClick={closeMenu}
    >
      <div
        data-testid="menu"
        className="panel flex max-h-[90vh] w-[min(94vw,760px)] flex-col p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex gap-2 border-b border-gold/30 pb-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`rounded px-3 py-1 font-title text-[10px] ${tab === t.id ? 'bg-gold text-ink' : 'text-parch/80 hover:text-gold'}`}
              onClick={() => gameStore.setState({ menuTab: t.id })}
            >
              {t.label}
            </button>
          ))}
          <button className="ml-auto font-title text-[10px] text-parch/60 hover:text-gold" onClick={closeMenu}>
            Esc ✕
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto">
          {tab === 'items' && <Inventory />}
          {tab === 'settings' && <SettingsPanel />}
          {tab === 'system' && <SystemPanel />}
        </div>
      </div>
    </motion.div>
  );
}

export function openMenu(tab: MenuTab) {
  sfx.play('open');
  gameStore.setState({ mode: 'menu', menuTab: tab });
}

export function closeMenu() {
  gameStore.setState({ mode: 'play', dialogueClosedAt: performance.now() });
}

function Inventory() {
  const inv = useGame((s) => s.inventory);
  const [sel, setSel] = useState<ItemId | null>(inv[0] ?? null);
  const item = sel ? ITEMS[sel] : null;
  const clauses = Number(dialogue.get('clauses') ?? 0);

  if (!inv.length) return <p className="py-8 text-center text-lg text-parch/60">Your pockets are empty. For now.</p>;
  return (
    <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
      <div className="grid grid-cols-4 content-start gap-2">
        {inv.map((id) => (
          <button
            key={id}
            title={ITEMS[id].name}
            onClick={() => setSel(id)}
            className={`flex h-16 w-16 items-center justify-center rounded border-2 ${sel === id ? 'border-gold bg-gold/15' : 'border-parch/20 hover:border-gold/60'}`}
          >
            <img src={iconURL(ITEMS[id].icon)} alt={ITEMS[id].name} className="pixel-img h-10 w-10" />
          </button>
        ))}
      </div>
      {item && (
        <div className="text-lg">
          <h3 className="font-title text-xs leading-relaxed text-gold">{item.name}</h3>
          <p className="mt-2 text-parch/90">{item.desc}</p>
          {sel === 'contract' && (
            <ol className="mt-3 space-y-2 border-l-2 border-gold/40 pl-3">
              {CLAUSES.slice(0, clauses).map((c, i) => (
                <li key={i}>
                  <span className="font-title text-[9px] text-gold">Clause {i + 1}. </span>
                  {c}
                </li>
              ))}
              <li className="text-parch/40">The rest of the scroll is blank. For now.</li>
            </ol>
          )}
        </div>
      )}
    </div>
  );
}


function SystemPanel() {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <button className="btn w-64" onClick={closeMenu}>
        Resume
      </button>
      <button
        className="btn w-64"
        onClick={() => {
          saveNow();
          setSaved(true);
        }}
      >
        {saved ? 'Saved ✓' : 'Save'}
      </button>
      <button className="btn w-64" onClick={quitToTitle}>
        Save & quit to title
      </button>
      <p className="mt-2 text-center text-base text-parch/50">The game also saves automatically at every new objective and room.</p>
    </div>
  );
}
