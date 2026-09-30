import { isItemId } from '@/data/items';
import { isQuestId } from '@/data/quests';
import { gameStore, initialGame } from '@/store/gameStore';
import { dialogue } from './services';
import { sfx } from './systems/audio';
import { bus } from './systems/events';
import { readSave, SAVE_VERSION, writeSave } from './systems/save';
import { session } from './systems/session';

/** Game lifecycle: title ⇄ new game / continue, autosave, demo end. */

export const START = { map: 'bedroom', spawn: 'start' };
export const TITLE_BG = { map: 'hall', spawn: 'title', attract: true };

let pendingSave = false;

export function initFlow() {
  bus.on('autosave', () => {
    pendingSave = true;
    trySave();
  });
  // Saves requested mid-dialogue run once the player is back in control.
  gameStore.subscribe((s, prev) => {
    if (s.mode === 'play' && prev.mode !== 'play') trySave();
  });
  bus.on('end-demo', () => {
    saveNow();
    gameStore.setState({ mode: 'ended' });
  });
}

function trySave() {
  if (pendingSave && gameStore.getState().mode === 'play') {
    pendingSave = false;
    saveNow();
  }
}

export function saveNow() {
  const pos = session.position?.();
  if (!pos) return;
  const s = gameStore.getState();
  writeSave({
    v: SAVE_VERSION,
    map: session.map,
    ...pos,
    ink: dialogue.saveJson(),
    inventory: s.inventory,
    quest: s.quest,
    playMs: Math.round(session.playMs),
    savedAt: Date.now(),
  });
}

export function newGame() {
  sfx.unlock();
  dialogue.reset();
  session.playMs = 0;
  pendingSave = false;
  gameStore.setState({ ...initialGame, mode: 'play' });
  bus.emit('load-map', START);
}

export function continueGame() {
  const d = readSave();
  if (!d) return newGame();
  sfx.unlock();
  dialogue.loadJson(d.ink);
  session.playMs = d.playMs;
  gameStore.setState({
    ...initialGame,
    mode: 'play',
    inventory: d.inventory.filter(isItemId),
    quest: d.quest && isQuestId(d.quest) ? d.quest : null,
    questSetAt: d.playMs,
  });
  bus.emit('load-map', { map: d.map, pos: { x: d.x, y: d.y, facing: d.facing } });
}

export function quitToTitle() {
  if (gameStore.getState().mode !== 'ended') saveNow();
  session.position = null;
  dialogue.reset(); // title backdrop shows a fresh world; Continue reloads the save
  gameStore.setState({ ...initialGame, mode: 'title' });
  bus.emit('load-map', TITLE_BG);
}
