/**
 * DEV-only chapter select (title screen, `npm run dev` only): each preset starts a fresh game with the ink
 * VARs a real playthrough would have set by that point — the same setups the e2e tests use.
 */
export interface DevJump {
  label: string;
  map: string;
  spawn: string;
  vars: Record<string, boolean | number>;
}

const done = (...ids: string[]) => Object.fromEntries(ids.map((id) => [id, true]));
const BOUND = done('met_snape', 'snape_bound');

export const DEV_JUMPS: DevJump[] = [
  { label: 'Prologue', map: 'bedroom', spawn: 'start', vars: {} },
  { label: 'Ch1 Hall', map: 'hall', spawn: 'arrive', vars: {} },
  { label: 'Ch1 Library', map: 'library', spawn: 'entry', vars: { ...BOUND, ...done('heard_riddle', 'clue1'), clauses: 1 } },
  {
    label: 'Ch2 Forest',
    map: 'forest',
    spawn: 'edge',
    vars: { ...BOUND, ...done('clue1', 'got_map', 'ch1_done', 'hall_empty_seen'), clauses: 2 },
  },
  {
    label: 'Ch3 Court',
    map: 'court',
    spawn: 'entry',
    vars: { ...BOUND, ...done('got_map', 'ch1_done', 'coin4', 'ch2_done'), clauses: 3, fragments: 2 },
  },
  {
    label: 'Ch4 Rift',
    map: 'rift',
    spawn: 'entry',
    vars: { ...BOUND, ...done('got_map', 'ch1_done', 'ch2_done', 'ch3_done'), lantern: 2, clauses: 4, fragments: 3 },
  },
  {
    label: 'Ch5 Haunted',
    map: 'haunted',
    spawn: 'entry',
    vars: { ...BOUND, ...done('got_map', 'ch1_done', 'ch2_done', 'ch3_done', 'ch4_done'), lantern: 2, clauses: 5, fragments: 4 },
  },
  {
    label: 'Finale',
    map: 'tower',
    spawn: 'entry',
    vars: { ...BOUND, ...done('got_map', 'ch1_done', 'ch2_done', 'ch3_done', 'ch4_done', 'ch5_done'), clauses: 6, fragments: 4 },
  },
];
