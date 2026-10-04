import type Phaser from 'phaser';
import { TILE } from '../constants';
import { Actor, tileToFeet } from '../entities/Actor';
import type { MapDef } from '@/data/maps';
import { settingsStore } from '@/store/settingsStore';

/** Scripted beats fired by ink tags (`# show:figure`, `# cam:shake|flash`). */

/** The hooded "G." appears at the map's `figure` marker, lingers, then snaps out of existence. */
export function showFigure(scene: Phaser.Scene, def: MapDef, what: string) {
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
