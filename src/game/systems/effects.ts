import { isChapterId } from '@/data/chapters';
import { ITEMS, isItemId } from '@/data/items';
import { isSongId } from '@/data/music';
import { isPuzzleId } from '@/data/puzzles';
import { isQuestId } from '@/data/quests';
import { gameStore, showToast } from '@/store/gameStore';
import { sfx } from './audio';
import { bus } from './events';
import { session } from './session';

/**
 * ink tag vocabulary (write in .ink as `# cmd:arg`):
 *   portrait:<char>_<expr>   give:<item>   take:<item>   quest:<id>   done (clears quest)   sfx:<name>
 *   music:<song|none>   chapter:<id>   show:<what>   cam:shake|flash   warp:<map>:<spawn> (after close)
 *   end_demo[:<chapter>] (after close; chapter picks the results card)   puzzle:<id> (after close; opens modal)
 * `deferred` = null means "run now" (used when flushing deferred tags on close).
 */
const AFTER_CLOSE = new Set(['warp', 'end_demo', 'puzzle']);

export function applyTag(tag: string, deferred: string[] | null) {
  const [cmd, ...args] = tag.split(':').map((s) => s.trim());
  if (deferred && AFTER_CLOSE.has(cmd)) {
    deferred.push(tag);
    return;
  }
  const s = gameStore.getState();
  switch (cmd) {
    case 'portrait':
      return;
    case 'give': {
      const id = args[0];
      if (!isItemId(id) || s.inventory.includes(id)) return;
      gameStore.setState({ inventory: [...s.inventory, id] });
      showToast({ speaker: '', text: `Received: ${ITEMS[id].name}`, icon: ITEMS[id].icon });
      sfx.play('pickup');
      bus.emit('autosave');
      return;
    }
    case 'take':
      gameStore.setState({ inventory: s.inventory.filter((i) => i !== args[0]) });
      return;
    case 'quest':
      if (!isQuestId(args[0])) return warn(tag);
      gameStore.setState({ quest: args[0], questSetAt: session.playMs, hintLevel: 0 });
      bus.emit('autosave');
      return;
    case 'done':
      gameStore.setState({ quest: null, hintLevel: 0 });
      return;
    case 'sfx':
      sfx.play(args[0]);
      return;
    case 'music':
      if (args[0] === 'none') sfx.music.stop();
      else if (isSongId(args[0])) sfx.music.play(args[0]);
      return;
    case 'chapter':
      if (!isChapterId(args[0])) return warn(tag);
      gameStore.setState({ chapterCard: args[0] });
      return;
    case 'show':
      bus.emit('show', { what: args[0] });
      return;
    case 'cam':
      bus.emit('cam', { fx: args[0] === 'flash' ? 'flash' : 'shake' });
      return;
    case 'warp':
      bus.emit('load-map', { map: args[0], spawn: args[1] });
      return;
    case 'end_demo':
      gameStore.setState({ endOf: args[0] && isChapterId(args[0]) ? args[0] : null });
      bus.emit('end-demo');
      return;
    case 'puzzle':
      if (!isPuzzleId(args[0])) return warn(tag);
      gameStore.setState({ mode: 'puzzle', puzzle: args[0] });
      return;
    default:
      warn(tag);
  }
}

function warn(tag: string) {
  if (import.meta.env.DEV) console.warn(`[ink] unknown/invalid tag: ${tag}`);
}
