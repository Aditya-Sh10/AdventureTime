import Phaser from 'phaser';
import type { CharId } from '../art/characters';
import type { Facing } from '@/data/maps';

const IDLE_FRAME = { down: 0, up: 3, side: 6 } as const;
const dirOf = (f: Facing) => (f === 'left' || f === 'right' ? 'side' : f);

/** Walk speed shared by player and follower maths (px/s). */
export const WALK_SPEED = 88;

/** Tile coords → actor world position (feet). */
export const tileToFeet = (tx: number, ty: number, tile: number) => ({ x: tx * tile + tile / 2, y: ty * tile + tile - 2 });

/**
 * A character sprite (origin at the feet) with 4-dir walk/idle.
 * body: 'dynamic' (player), 'static' (NPC you bump into) or 'none' (follower, cutscene figure).
 */
export class Actor {
  readonly sprite: Phaser.Physics.Arcade.Sprite;
  facing: Facing;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    readonly char: CharId,
    facing: Facing = 'down',
    body: 'dynamic' | 'static' | 'none' = 'none',
  ) {
    this.facing = facing;
    if (body === 'dynamic') this.sprite = scene.physics.add.sprite(x, y, char, 0);
    else if (body === 'static') this.sprite = scene.physics.add.staticSprite(x, y, char, 0);
    else this.sprite = scene.add.sprite(x, y, char, 0) as Phaser.Physics.Arcade.Sprite;
    this.sprite.setOrigin(0.5, 0.95);
    if (body === 'dynamic') {
      (this.sprite.body as Phaser.Physics.Arcade.Body).setSize(12, 8).setOffset(6, 26);
    } else if (body === 'static') {
      const b = this.sprite.body as Phaser.Physics.Arcade.StaticBody;
      b.setSize(14, 10).setOffset(5, 24);
    }
    this.idle();
  }

  get x() {
    return this.sprite.x;
  }
  get y() {
    return this.sprite.y;
  }

  face(f: Facing) {
    this.facing = f;
    this.idle();
  }

  walk(f: Facing) {
    this.facing = f;
    this.sprite.setFlipX(f === 'right');
    this.sprite.anims.play(`${this.char}-walk-${dirOf(f)}`, true);
  }

  idle() {
    this.sprite.anims.stop();
    this.sprite.setFlipX(this.facing === 'right');
    this.sprite.setFrame(IDLE_FRAME[dirOf(this.facing)]);
  }

  /** Y-sort: lower on screen draws in front. */
  sortDepth() {
    this.sprite.setDepth(this.sprite.y);
  }

  /** Facing that looks from this actor toward a point. */
  faceToward(x: number, y: number): Facing {
    const dx = x - this.x;
    const dy = y - this.y;
    return Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down';
  }
}
