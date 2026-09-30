import { motion } from 'motion/react';
import { useGame } from '@/store/gameStore';
import { dialogue } from '@/game/services';
import { quitToTitle } from '@/game/flow';
import { session } from '@/game/systems/session';

/** End-of-demo summary. Becomes the per-chapter results card in the full game. */
export function DemoEnd() {
  const mode = useGame((s) => s.mode);
  if (mode !== 'ended') return null;
  const n = (v: string) => Number(dialogue.get(v) ?? 0);
  const mins = Math.max(1, Math.round(session.playMs / 60000));
  const stats = [
    ['Objects touched after being told not to', n('touched_forbidden')],
    ['Times Snape sighed', n('snape_sighs')],
    ['House points earned', n('house_points')],
    ['Minutes spent in Hogwarts', mins],
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      className="pointer-events-auto absolute inset-0 flex flex-col items-center justify-center gap-8 bg-black/85 px-4 text-parch"
      data-testid="demo-end"
    >
      <div className="text-center">
        <p className="font-pixel text-lg uppercase tracking-[0.3em] text-parch/60">End of the demo</p>
        <h2 className="mt-3 font-title text-lg leading-relaxed text-gold sm:text-2xl">The Library awaits...</h2>
      </div>
      <ul className="panel w-[min(92vw,520px)] space-y-2 p-5 text-lg">
        {stats.map(([label, value]) => (
          <li key={label} className="flex justify-between gap-4">
            <span>{label}</span>
            <span className="font-title text-sm text-gold">{value}</span>
          </li>
        ))}
      </ul>
      <p className="max-w-md text-center text-lg italic text-parch/70">Snape: I have seen worse. Recently, even.</p>
      <button className="btn" onClick={quitToTitle}>
        Back to title
      </button>
    </motion.div>
  );
}
