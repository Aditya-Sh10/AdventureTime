import Phaser from 'phaser';
import { TILE } from '../constants';

/** Generates placeholder textures until real art arrives (see .claude/docs/ASSETS.md). */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    const g = this.make.graphics({}, false);
    // tileset: 0 floor, 1 wall
    g.fillStyle(0x2a2440).fillRect(0, 0, TILE, TILE);
    g.lineStyle(1, 0x352e52).strokeRect(0.5, 0.5, TILE - 1, TILE - 1);
    g.fillStyle(0x4b3f2f).fillRect(TILE, 0, TILE, TILE);
    g.fillStyle(0x5e503b).fillRect(TILE, 0, TILE, 6);
    g.generateTexture('tiles-placeholder', TILE * 2, TILE);
    g.clear();

    g.fillStyle(0xd94f70).fillRect(0, 0, 14, 20);
    g.fillStyle(0xf2d0a9).fillRect(3, 2, 8, 7);
    g.generateTexture('player-placeholder', 14, 20);
    g.clear();

    g.fillStyle(0xc9a227).fillRect(0, 0, 18, 14);
    g.fillStyle(0x6b4f1d).fillRect(7, 14, 4, 8);
    g.generateTexture('sign-placeholder', 18, 22);
    g.destroy();

    this.scene.start('World');
  }
}
