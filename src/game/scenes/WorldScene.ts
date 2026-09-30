import Phaser from 'phaser';
import { INTERACT_COOLDOWN_MS, TILE } from '../constants';
import { gameStore } from '@/store/gameStore';
import { dialogue } from '../services';

// Placeholder room (0 floor, 1 wall). Replaced by Tiled JSON maps in Phase 1.
const ROOM = [
  '11111111111111111111',
  '10000000000000000001',
  '10000000000000000001',
  '10001111000000000001',
  '10000000000000000001',
  '10000000000000111001',
  '10000000000000000001',
  '10000000000000000001',
  '10000000000000000001',
  '10000000000000000001',
  '10000000000000000001',
  '11111111111111111111',
].map((row) => [...row].map(Number));

const SPEED = 90;
const INTERACT_RANGE = 28;

export class WorldScene extends Phaser.Scene {
  private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private keys!: Record<'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;
  private interactQueued = false;
  private interactables: { obj: Phaser.GameObjects.Image; knot: string }[] = [];
  private prompt!: Phaser.GameObjects.Text;

  constructor() {
    super('World');
  }

  create() {
    const map = this.make.tilemap({ data: ROOM, tileWidth: TILE, tileHeight: TILE });
    const tiles = map.addTilesetImage('tiles-placeholder')!;
    const layer = map.createLayer(0, tiles, 0, 0)!;
    layer.setCollision(1);

    this.player = this.physics.add.sprite(TILE * 3, TILE * 8, 'player-placeholder');
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, layer);
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    const sign = this.physics.add.staticImage(TILE * 9, TILE * 6, 'sign-placeholder');
    this.physics.add.collider(this.player, sign);
    this.interactables.push({ obj: sign, knot: 'sign' });

    this.prompt = this.add
      .text(0, 0, 'E', { fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#fff' })
      .setOrigin(0.5)
      .setVisible(false);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(this.player, true, 0.15, 0.15);

    const kb = this.input.keyboard!;
    this.keys = kb.addKeys('up,down,left,right,w,a,s,d') as typeof this.keys;
    // Event-driven so sub-frame taps are never missed; consumed in update().
    const queue = () => (this.interactQueued = true);
    kb.on('keydown-E', queue);
    kb.on('keydown-SPACE', queue);
    // Let React UI receive Space/E while dialogue is open.
    kb.removeCapture('SPACE');

    if (import.meta.env.DEV) (window as unknown as { __player: unknown }).__player = this.player;
  }

  update() {
    const { mode, dialogueClosedAt } = gameStore.getState();
    const body = this.player.body;
    const interact = this.interactQueued;
    this.interactQueued = false;
    if (mode !== 'play') {
      body.setVelocity(0);
      this.prompt.setVisible(false);
      return;
    }

    const k = this.keys;
    const x = Number(k.right.isDown || k.d.isDown) - Number(k.left.isDown || k.a.isDown);
    const y = Number(k.down.isDown || k.s.isDown) - Number(k.up.isDown || k.w.isDown);
    body.setVelocity(x, y).velocity.normalize().scale(SPEED);

    const near = this.interactables.find(
      (i) => Phaser.Math.Distance.BetweenPoints(this.player, i.obj) < INTERACT_RANGE + i.obj.height / 2,
    );
    this.prompt.setVisible(!!near);
    if (!near) return;
    this.prompt.setPosition(near.obj.x, near.obj.y - near.obj.height / 2 - 8);

    if (interact && performance.now() - dialogueClosedAt > INTERACT_COOLDOWN_MS) {
      body.setVelocity(0);
      dialogue.start(near.knot);
    }
  }
}
