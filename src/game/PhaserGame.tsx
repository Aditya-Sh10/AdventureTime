import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './config';

/** Mounts Phaser once. React never re-renders inside the game loop. */
export function PhaserGame() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const game = new Phaser.Game(createGameConfig(host.current!));
    return () => game.destroy(true);
  }, []);

  return <div ref={host} className="absolute inset-0" data-testid="game" />;
}
