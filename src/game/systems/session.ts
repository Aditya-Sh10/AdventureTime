/** Mutable per-run values that change every frame (kept out of the store to avoid re-renders). */
export const session = {
  playMs: 0,
  map: 'bedroom',
  /** Registered by WorldScene so save() can read the live player position. */
  position: null as null | (() => { x: number; y: number; facing: string }),
};
