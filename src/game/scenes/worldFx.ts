import type Phaser from 'phaser';
import { TILE } from '../constants';
import { Actor, tileToFeet } from '../entities/Actor';
import type { MapDef } from '@/data/maps';
import { settingsStore } from '@/store/settingsStore';
import { sfx } from '../systems/audio';

/** Scripted beats fired by ink tags (`# show:figure|fireworks`, `# cam:shake|flash`). */

const FIREWORK_COLOURS = [0xffc23c, 0xff4c6a, 0x4cc8ff, 0x9cff6a, 0xff7ae0, 0xfff6c8];

/**
 * Finale fireworks: a burst every ~0.65s somewhere in the top half of the view, until the scene restarts.
 * ~36 sparks × ~1.5s life / 0.65s keeps it under ~90 alive (budget: 150). Unlit, so they glow over Light2D.
 */
export function fireworks(scene: Phaser.Scene) {
  const reduced = settingsStore.getState().reducedMotion;
  const em = scene.add.particles(0, 0, 'spark', {
    speed: { min: 60, max: 190 },
    lifespan: { min: 1000, max: 1700 },
    gravityY: 55,
    scale: { start: 2.4, end: 0.4 },
    alpha: { start: 1, end: 0 },
    blendMode: 'ADD',
    emitting: false,
  });
  em.setDepth(100_000);
  let i = 0;
  const burst = () => {
    const v = scene.cameras.main.worldView;
    em.setParticleTint(FIREWORK_COLOURS[i++ % FIREWORK_COLOURS.length]);
    // Every other burst pops, so the birthday music box isn't buried.
    if (i % 2) sfx.play('firework');
    em.explode(reduced ? 18 : 36, v.x + v.width * (0.12 + Math.random() * 0.76), v.y + v.height * (0.08 + Math.random() * 0.4));
  };
  burst();
  scene.time.addEvent({ delay: reduced ? 1100 : 650, loop: true, callback: burst });
}

/** The hooded "G." appears at the map's `figure` marker, lingers, then snaps out of existence. */
export function showFigure(scene: Phaser.Scene, def: MapDef, what: string) {
  if (what === 'fireworks') return fireworks(scene);
  const m = def.markers?.[what];
  if (!m || what !== 'figure') return;
  const { x, y } = tileToFeet(m[0], m[1], TILE);
  const fig = new Actor(scene, x, y, 'figure', 'right');
  fig.sortDepth();
  fig.sprite.setAlpha(0);
  scene.tweens.chain({
    targets: fig.sprite,
    tweens: [
      { alpha: 1, duration: 450 },
      { alpha: 1, duration: 1300 },
      { alpha: 0, duration: 180 },
    ],
    onComplete: () => fig.sprite.destroy(),
  });
}

export function camFx(scene: Phaser.Scene, fx: 'shake' | 'flash') {
  const reduced = settingsStore.getState().reducedMotion;
  if (fx === 'shake' && !reduced) scene.cameras.main.shake(260, 0.006);
  if (fx === 'flash') scene.cameras.main.flash(reduced ? 200 : 500, 255, 240, 200);
}
