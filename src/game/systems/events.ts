/** Typed event bus between systems, Phaser scenes and React (framework-free, unit-testable). */
export interface GameEvents {
  /** Load a map (restarts WorldScene). pos overrides spawn (used by Continue). */
  'load-map': { map: string; spawn?: string; pos?: { x: number; y: number; facing: string }; attract?: boolean };
  /** Ink state changed: re-evaluate `when` conditions on map objects. */
  refresh: void;
  /** Scripted beats from ink tags. */
  show: { what: string };
  cam: { fx: 'shake' | 'flash' };
  'end-demo': void;
  /** Request a save at the next safe point (flow.ts handles it). */
  autosave: void;
}

type Handler<T> = (payload: T) => void;

class Bus {
  private handlers = new Map<keyof GameEvents, Set<Handler<never>>>();

  on<K extends keyof GameEvents>(type: K, fn: Handler<GameEvents[K]>) {
    if (!this.handlers.has(type)) this.handlers.set(type, new Set());
    this.handlers.get(type)!.add(fn as Handler<never>);
    return () => this.off(type, fn);
  }

  off<K extends keyof GameEvents>(type: K, fn: Handler<GameEvents[K]>) {
    this.handlers.get(type)?.delete(fn as Handler<never>);
  }

  emit<K extends keyof GameEvents>(type: K, ...payload: GameEvents[K] extends void ? [] : [GameEvents[K]]) {
    for (const fn of [...(this.handlers.get(type) ?? [])]) (fn as Handler<unknown>)(payload[0]);
  }
}

export const bus = new Bus();
