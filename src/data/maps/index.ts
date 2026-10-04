import { bedroom } from './bedroom';
import { forest } from './forest';
import { hall } from './hall';
import { library } from './library';
import type { MapDef } from './types';

export const MAPS: Record<string, MapDef> = { bedroom, hall, library, forest };
export type { MapDef, MapObject, Facing } from './types';
