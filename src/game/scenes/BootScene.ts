import Phaser from 'phaser';
import { CHAR_IDS, FH, FW, characterSheet } from '../art/characters';
import { glowCanvas, owlSheet, sparkCanvas } from '../art/props';
import { tilesetCanvas } from '../art/tiles';
import { TITLE_BG } from '../flow';

/**
 * Generates all demo textures + animations from code (src/game/art/*).
 * When real art lands, load it in a Preload step under the SAME keys and delete the generator call.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create() {
    this.textures.addCanvas('tiles', tilesetCanvas());
    this.textures.addCanvas('glow', glowCanvas());
    this.textures.addCanvas('spark', sparkCanvas());
    this.sheet('owl', owlSheet(), 16, 16, 2);
    this.anims.create({ key: 'owl-tap', frames: this.frames('owl', [0, 1, 0, 0]), frameRate: 4, repeat: -1 });

    for (const id of CHAR_IDS) {
      this.sheet(id, characterSheet(id), FW, FH, 9);
      (['down', 'up', 'side'] as const).forEach((dir, i) => {
        const b = i * 3;
        this.anims.create({ key: `${id}-walk-${dir}`, frames: this.frames(id, [b + 1, b, b + 2, b]), frameRate: 8, repeat: -1 });
      });
    }

    this.scene.start('World', TITLE_BG);
  }

  /** Register a canvas as a texture with numbered frames laid out horizontally. */
  private sheet(key: string, canvas: HTMLCanvasElement, w: number, h: number, n: number) {
    const tex = this.textures.addCanvas(key, canvas)!;
    for (let i = 0; i < n; i++) tex.add(i, 0, i * w, 0, w, h);
  }

  private frames(key: string, idx: number[]) {
    return idx.map((frame) => ({ key, frame }));
  }
}
