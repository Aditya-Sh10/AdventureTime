import type { CharId } from '@/game/art/characters';
import type { ChapterId } from '../chapters';

export type Facing = 'down' | 'up' | 'left' | 'right';

/** `when`: ink-variable condition — 'var', '!var', 'var>=2', 'var==1' (see systems/conditions.ts). */
interface Base {
  id: string;
  /** tile coords */
  x: number;
  y: number;
  when?: string;
}

export type MapObject =
  | (Base & { kind: 'npc'; char: CharId; knot: string; facing?: Facing })
  /** Inspectable area (press E). `glow` condition adds a pulsing highlight. */
  | (Base & { kind: 'spot'; knot: string; w?: number; h?: number; glow?: string })
  /** Fires its knot when the player walks in (edge-triggered). */
  | (Base & { kind: 'trigger'; knot: string; w?: number; h?: number })
  /** Decorative sprite; `solid` props block movement while shown (e.g. a gate that opens via `when`). */
  | (Base & { kind: 'prop'; sprite: 'owl' | 'gate' | 'lantern'; solid?: boolean })
  | (Base & { kind: 'light'; radius: number; color: number; intensity?: number; flicker?: boolean })
  /** Swaps the grid tile at (x, y) for `tile` (art/tiles.ts name) while `when` holds, e.g. a torch going out. */
  | (Base & { kind: 'tile'; tile: string });

export interface MapDef {
  id: string;
  name: string;
  chapter: ChapterId;
  /** One char per tile; see legend.ts */
  grid: string[];
  /** Per-map char → tile overrides on top of the shared LEGEND (single chars are scarce). */
  legend?: Record<string, string>;
  /** Light2D ambient colour */
  ambient: number;
  /** Dark map: a light follows the player; its radius comes from the ink VAR `lantern` (systems/lantern.ts). */
  lantern?: boolean;
  spawns: Record<string, [number, number, Facing]>;
  /** Named points for scripted events (e.g. `show:figure`). */
  markers?: Record<string, [number, number]>;
  objects: MapObject[];
}
