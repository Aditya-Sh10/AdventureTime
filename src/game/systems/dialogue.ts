import { Story } from 'inkjs';
import { gameStore, type DialogueLine } from '@/store/gameStore';

/**
 * Ink bridge. Lines use `Speaker: text` convention; tags `# portrait:snape_annoyed`.
 * One Story per ink file; knots are dialogue entry points.
 */
export class Dialogue {
  private story: Story;

  constructor(storyJson: object) {
    this.story = new Story(JSON.stringify(storyJson));
  }

  get vars() {
    return this.story.variablesState;
  }

  start(knot: string) {
    this.story.ChoosePathString(knot);
    gameStore.setState({ mode: 'dialogue' });
    this.advance();
  }

  /** Show next line, or choices, or close. */
  advance(): void {
    if (this.story.canContinue) {
      const raw = (this.story.Continue() ?? '').trim();
      if (!raw) return this.advance();
      gameStore.setState({ line: parseLine(raw, this.story.currentTags ?? []), choices: [] });
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
    gameStore.setState({ mode: 'play', line: null, choices: [], dialogueClosedAt: performance.now() });
  }
}

let lineId = 0;

export function parseLine(raw: string, tags: string[]): DialogueLine {
  const m = /^([^:]{1,24}):\s*(.*)$/.exec(raw);
  const portrait = tags.find((t) => t.startsWith('portrait:'))?.slice(9).trim();
  const id = ++lineId;
  return m ? { id, speaker: m[1].trim(), text: m[2], portrait } : { id, speaker: '', text: raw, portrait };
}
