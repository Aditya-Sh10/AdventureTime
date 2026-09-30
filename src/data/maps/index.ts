import { bedroom } from './bedroom';
import { hall } from './hall';
import type { MapDef } from './types';

export const MAPS: Record<string, MapDef> = { bedroom, hall };
export type { MapDef, MapObject, Facing } from './types';
