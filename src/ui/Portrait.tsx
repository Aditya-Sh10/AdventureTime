import { CHARACTERS, portraitURL, type CharId, type Expr } from '@/game/art/characters';
import { speakerOf } from '@/data/speakers';

const EXPRS: Expr[] = ['neutral', 'annoyed', 'smug', 'shock', 'soft', 'happy'];

/** Resolve an ink portrait tag (`snape_annoyed`) or fall back to the speaker's character. */
export function resolvePortrait(speaker: string, tag?: string): string | null {
  const [id, expr] = (tag ?? '').split('_');
  const char = (id && id in CHARACTERS ? id : speakerOf(speaker).char) as CharId | undefined;
  if (!char) return null;
  return portraitURL(char, EXPRS.includes(expr as Expr) ? (expr as Expr) : 'neutral');
}

export function Portrait({ src, size = 96 }: { src: string; size?: number }) {
  return (
    <div
      className="shrink-0 overflow-hidden rounded-md border-2 border-gold/60 bg-gradient-to-b from-[#2a2238] to-[#161120]"
      style={{ width: size, height: size }}
    >
      <img src={src} alt="" className="pixel-img h-full w-full object-contain" draggable={false} />
    </div>
  );
}
