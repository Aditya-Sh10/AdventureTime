import { Story } from 'inkjs';
import { SPEAKERS } from '@/data/speakers';
import { gameStore, type DialogueLine } from '@/store/gameStore';
import { applyTag } from './effects';
import { bus } from './events';

/**
 * Ink bridge. One Story for the whole game (src/story/main.ink INCLUDEs chapters) so all flags/stats live in
 * ink VARs and save as one JSON blob. Lines: `Speaker: text`; tags: see effects.ts.
 */
export class Dialogue {
  private story: Story;
  /** Tags that must run after the box closes (warps, endings). */
  private deferred: string[] = [];

  constructor(storyJson: object) {
    this.story = new Story(JSON.stringify(storyJson));
    this.story.BindExternalFunction('has', (id: string) => gameStore.getState().inventory.includes(id as never), true);
  }

  get(name: string): unknown {
    return this.story.variablesState.$(name);
  }

  set(name: string, value: string | number | boolean) {
    this.story.variablesState.$(name, value);
  }

  hasKnot(name: string) {
    return this.story.KnotContainerWithName(name) !== null;
  }

  reset() {
    this.story.ResetState();
    this.deferred = [];
  }

  saveJson() {
    return this.story.state.ToJson();
  }

  loadJson(json: string) {
    this.story.state.LoadJson(json);
  }

  start(knot: string) {
    if (gameStore.getState().mode === 'dialogue') return;
    this.story.ChoosePathString(knot);
    gameStore.setState({ mode: 'dialogue', line: null, choices: [] });
    this.advance();
  }

  /** Show next line, or choices, or close. */
  advance(): void {
    if (this.story.canContinue) {
      const raw = (this.story.Continue() ?? '').trim();
      const tags = this.story.currentTags ?? [];
      for (const t of tags) applyTag(t, this.deferred);
      bus.emit('refresh');
      if (!raw) return this.advance();
      gameStore.setState({ line: parseLine(raw, tags), choices: [] });
      if (!this.story.canContinue && this.story.currentChoices.length) {
        gameStore.setState({ choices: this.story.currentChoices.map((c) => c.text) });
      }
      return;
    }
    if (this.story.currentChoices.length) return; // waiting on choose()
    this.close();
  }

  choose(index: number) {
    this.story.ChooseChoiceIndex(index);
    gameStore.setState({ choices: [] });
    this.advance();
  }

  close() {
    const { mode } = gameStore.getState();
    gameStore.setState({
      mode: mode === 'dialogue' ? 'play' : mode,
      line: null,
      choices: [],
      dialogueClosedAt: performance.now(),
    });
    const run = this.deferred.splice(0);
    for (const t of run) applyTag(t, null);
    bus.emit('refresh');
  }
}

let lineId = 0;

/** `Speaker: text` only when Speaker is registered in data/speakers.ts; anything else is narration. */
export function parseLine(raw: string, tags: string[]): DialogueLine {
  const m = /^([^:]{1,24}):\s*(.*)$/.exec(raw);
  const portrait = tags.find((t) => t.startsWith('portrait:'))?.slice(9).trim();
  const id = ++lineId;
  const name = m?.[1].trim();
  if (m && name && name in SPEAKERS) return { id, speaker: name, text: m[2], portrait };
  return { id, speaker: '', text: raw, portrait };
}
