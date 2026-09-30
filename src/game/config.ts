import Phaser from 'phaser';
import { GAME_H, GAME_W } from './constants';
import { BootScene } from './scenes/BootScene';
import { WorldScene } from './scenes/WorldScene';

export function createGameConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: GAME_W,
    height: GAME_H,
    pixelArt: true,
    backgroundColor: '#0b0b14',
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    physics: { default: 'arcade', arcade: { debug: false } },
    fps: { target: 60, min: 30 },
    scene: [BootScene, WorldScene],
  };
}
