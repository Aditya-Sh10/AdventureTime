import { z } from 'zod';

/** Bump + add a migration in readSave() whenever the schema changes. */
export const SAVE_VERSION = 1;
const KEY = 'bq-save';

export const SaveSchema = z.object({
  v: z.literal(SAVE_VERSION),
  map: z.string(),
  x: z.number(),
  y: z.number(),
  facing: z.string(),
  /** Full ink story state JSON (all flags, stats, visit counts). */
  ink: z.string(),
  inventory: z.array(z.string()),
  quest: z.string().nullable(),
  playMs: z.number(),
  savedAt: z.number(),
});
export type SaveData = z.infer<typeof SaveSchema>;

type KV = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;

function storage(): KV | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function writeSave(data: SaveData, kv: KV | null = storage()) {
  try {
    kv?.setItem(KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function readSave(kv: KV | null = storage()): SaveData | null {
  try {
    const raw = kv?.getItem(KEY);
    if (!raw) return null;
    const parsed = SaveSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

export const hasSave = (kv: KV | null = storage()) => readSave(kv) !== null;

export function clearSave(kv: KV | null = storage()) {
  try {
    kv?.removeItem(KEY);
  } catch {
    /* storage blocked: nothing to clear */
  }
}
