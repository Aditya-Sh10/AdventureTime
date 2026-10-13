import type { MapDef } from './types';

/**
 * Chapter 4: the Multiverse Rift. Dark (lantern) void; a neon hub with the cracked rift core in the middle and three
 * tears: red → a Hell's Kitchen rooftop (left), blue → Queens rooftops split by a gap (top), gold → a painted tower
 * top (right). One shard from each → the core folds into a "0".
 */
const S = (n: number) => ' '.repeat(n);

export const rift: MapDef = {
  id: 'rift',
  name: 'The Multiverse Rift',
  chapter: 'ch4',
  music: 'rift',
  ambience: 'rift',
  ambient: 0x2a2044,
  lantern: true,
  grid: [
    S(32),
    S(10) + '77777777' + S(3) + '77777777' + S(3),
    S(10) + '66^66666' + S(3) + '66666866' + S(3),
    S(10) + '66666666' + S(3) + '66966666' + S(3),
    S(10) + '66666666' + S(3) + '66666666' + S(3),
    S(10) + '66666666' + S(3) + '66666666' + S(3),
    S(10) + '77777677' + S(3) + '77777777' + S(3),
    S(15) + '4' + S(16),
    ' ' + '77777777' + S(6) + '2' + S(7) + '"$""@"$"' + ' ',
    ' ' + '68666666' + S(2) + '0000000000' + S(2) + '||||||||' + ' ',
    ' ' + '66666696' + S(2) + '0100000000' + S(2) + '||||||||' + ' ',
    ' ' + '66666666' + S(2) + '0000000000' + S(2) + '||||||||' + ' ',
    ' ' + '66666666' + '3-' + '0000000000' + '-5' + '||||||||' + ' ',
    ' ' + '6^666666' + S(2) + '0000(00000' + S(2) + '||||||||' + ' ',
    ' ' + '66666666' + S(2) + '0000000010' + S(2) + '||||||||' + ' ',
    ' ' + '66666666' + S(2) + '0)00000000' + S(2) + '||||||||' + ' ',
    ' ' + '77777777' + S(2) + '0000000000' + S(11),
    S(11) + '0000000000' + S(11),
    S(11) + '0000000000' + S(11),
    S(32),
  ],
  spawns: { entry: [15, 18, 'up'], near: [17, 4, 'left'], far: [21, 4, 'right'], title: [15, 15, 'down'] },
  markers: { figure: [19, 10] },
  objects: [
    { kind: 'trigger', id: 'arrive', x: 13, y: 17, w: 5, h: 2, knot: 'rift_arrive', when: '!rift_seen' },
    // Hub: the core, the soft toy on it, and Majnu bhai's painting.
    { kind: 'npc', id: 'bat', char: 'batplush', x: 16, y: 13, facing: 'down', knot: 'rift_bat', when: '!core_done' },
    { kind: 'spot', id: 'core', x: 15, y: 13, knot: 'rift_core', glow: 'shards>=3 && !core_done' },
    { kind: 'spot', id: 'majnu', x: 12, y: 15, knot: 'rift_majnu' },
    // Hell's Kitchen: dark until Matt teaches radar sense; then red echoes outline what was hidden.
    { kind: 'npc', id: 'matt', char: 'daredevil', x: 5, y: 11, facing: 'left', knot: 'matt' },
    { kind: 'spot', id: 'hkTower', x: 2, y: 9, knot: 'hk_tower', glow: 'radar && !sai_seen' },
    { kind: 'spot', id: 'hkChimney', x: 2, y: 13, knot: 'hk_chimney' },
    { kind: 'spot', id: 'hkShard', x: 7, y: 14, knot: 'hk_shard', when: 'radar && !shard_red', glow: 'radar' },
    // Queens: Spider-Man on the near roof; the gap is crossed by web (spots sit over the gap's edge tiles).
    { kind: 'npc', id: 'spidey', char: 'spidey', x: 12, y: 4, facing: 'right', knot: 'spidey' },
    { kind: 'spot', id: 'zipThere', x: 18, y: 3, h: 3, knot: 'q_zip_there', glow: 'web && !shard_blue' },
    { kind: 'spot', id: 'zipBack', x: 20, y: 3, h: 3, knot: 'q_zip_back', glow: 'shard_blue' },
    { kind: 'spot', id: 'graffiti', x: 26, y: 2, knot: 'q_graffiti' },
    { kind: 'spot', id: 'qShard', x: 27, y: 4, knot: 'q_shard', when: '!shard_blue', glow: 'web' },
    // The tower: Rapunzel, three lanterns to release, a door nobody talks about.
    { kind: 'npc', id: 'rapunzel', char: 'rapunzel', x: 27, y: 11, facing: 'down', knot: 'rapunzel' },
    { kind: 'prop', id: 'lampA', x: 24, y: 10, sprite: 'lantern', when: '!lamp_a' },
    { kind: 'prop', id: 'lampB', x: 30, y: 10, sprite: 'lantern', when: '!lamp_b' },
    { kind: 'prop', id: 'lampC', x: 25, y: 14, sprite: 'lantern', when: '!lamp_c' },
    { kind: 'spot', id: 'lampA', x: 24, y: 10, knot: 'tower_lamp_a', when: '!lamp_a', glow: 'met_rapunzel' },
    { kind: 'spot', id: 'lampB', x: 30, y: 10, knot: 'tower_lamp_b', when: '!lamp_b', glow: 'met_rapunzel' },
    { kind: 'spot', id: 'lampC', x: 25, y: 14, knot: 'tower_lamp_c', when: '!lamp_c', glow: 'met_rapunzel' },
    { kind: 'spot', id: 'bruno', x: 27, y: 8, knot: 'tower_bruno' },
    { kind: 'spot', id: 'sun', x: 24, y: 8, knot: 'tower_sun' },
    // Lights: neon hub, a glow at each tear, city light over Queens, warm tower. Hell's Kitchen gets none.
    { kind: 'light', id: 'hubPink', x: 13, y: 11, radius: 220, color: 0xff3cc8, intensity: 1.5, flicker: true },
    { kind: 'light', id: 'hubCyan', x: 18.5, y: 16, radius: 220, color: 0x3ce8ff, intensity: 1.4, flicker: true },
    { kind: 'light', id: 'hubCore', x: 15.5, y: 13.5, radius: 120, color: 0xb070ff, intensity: 1.2, flicker: true },
    { kind: 'light', id: 'tearRed', x: 9.5, y: 12.5, radius: 90, color: 0xff3448, intensity: 1.3, flicker: true },
    { kind: 'light', id: 'tearBlue', x: 15.5, y: 7.5, radius: 90, color: 0x3c8cff, intensity: 1.3, flicker: true },
    { kind: 'light', id: 'tearGold', x: 22.5, y: 12.5, radius: 90, color: 0xffc23c, intensity: 1.3, flicker: true },
    { kind: 'light', id: 'cityNear', x: 13.5, y: 3.5, radius: 160, color: 0x7a9cff, intensity: 0.9 },
    { kind: 'light', id: 'cityFar', x: 25, y: 3.5, radius: 160, color: 0x7a9cff, intensity: 0.9 },
    { kind: 'light', id: 'tower', x: 27, y: 12, radius: 170, color: 0xffb070, intensity: 1, flicker: true },
    { kind: 'light', id: 'radarTower', x: 2.5, y: 9.5, radius: 70, color: 0xff2030, intensity: 1.4, flicker: true, when: 'radar' },
    { kind: 'light', id: 'radarChimney', x: 2.5, y: 13.5, radius: 60, color: 0xff2030, intensity: 1.2, flicker: true, when: 'radar' },
    { kind: 'light', id: 'radarShard', x: 7.5, y: 14.5, radius: 80, color: 0xff2030, intensity: 1.6, flicker: true, when: 'radar && !shard_red' },
    { kind: 'light', id: 'lampA', x: 24.5, y: 9, radius: 100, color: 0xffc23c, intensity: 1.3, flicker: true, when: 'lamp_a' },
    { kind: 'light', id: 'lampB', x: 30.5, y: 9, radius: 100, color: 0xffc23c, intensity: 1.3, flicker: true, when: 'lamp_b' },
    { kind: 'light', id: 'lampC', x: 25.5, y: 13, radius: 100, color: 0xffc23c, intensity: 1.3, flicker: true, when: 'lamp_c' },
    { kind: 'light', id: 'core', x: 15.5, y: 13.5, radius: 200, color: 0xffffff, intensity: 1.2, flicker: true, when: 'core_done' },
  ],
};
