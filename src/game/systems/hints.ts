import { QUESTS } from '@/data/quests';
import { gameStore, showToast } from '@/store/gameStore';
import { settingsStore } from '@/store/settingsStore';
import { session } from './session';

/** Seconds stuck on an objective before hint level 1/2/3 fires. */
export const HINT_AFTER_S = [45, 90, 150];

export function hintLevelFor(elapsedMs: number) {
  return HINT_AFTER_S.filter((s) => elapsedMs >= s * 1000).length;
}

/** Called every frame while playing. Escalates Snape's nagging; never blocks play. */
export function tickHints() {
  const { quest, questSetAt, hintLevel, mode } = gameStore.getState();
  if (!quest || mode !== 'play' || !settingsStore.getState().hints) return;
  const level = hintLevelFor(session.playMs - questSetAt);
  if (level <= hintLevel) return;
  const q = QUESTS[quest];
  gameStore.setState({ hintLevel: level });
  showToast(
    q.by === 'snape'
      ? { speaker: 'Snape', text: q.hints[level - 1], portrait: level === 3 ? 'snape_annoyed' : 'snape' }
      : { speaker: '', text: q.hints[level - 1] },
  );
}
