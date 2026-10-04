import Phaser from 'phaser';
import { TILE } from '../constants';
import { TILE_INDEX } from '../art/tiles';
import { Actor, tileToFeet } from '../entities/Actor';
import { dialogue } from '../services';
import { evaluate } from '../systems/conditions';
import type { Facing, MapDef, MapObject } from '@/data/maps';
import { settingsStore } from '@/store/settingsStore';

type Obj<K extends MapObject['kind']> = Extract<MapObject, { kind: K }>;

/** A map object brought to life: its definition plus the Phaser things that represent it. */
export type Dyn =
  | { kind: 'npc'; def: Obj<'npc'>; actor: Actor; on: boolean }
  | { kind: 'spot'; def: Obj<'spot'>; rect: Phaser.Geom.Rectangle; glow?: Phaser.GameObjects.Image; on: boolean }
  | { kind: 'trigger'; def: Obj<'trigger'>; rect: Phaser.Geom.Rectangle; inside: boolean; on: boolean }
  | { kind: 'prop'; def: Obj<'prop'>; sprite: Phaser.GameObjects.Sprite; on: boolean }
  | { kind: 'light'; def: Obj<'light'>; light: Phaser.GameObjects.Light | null; phase: number; on: boolean }
  | { kind: 'tile'; def: Obj<'tile'>; base: number; swap: number; on: boolean };

/** What the builders need from the scene. */
export interface MapCtx {
  scene: Phaser.Scene;
  def: MapDef;
  layer: Phaser.Tilemaps.TilemapLayer;
  lit: boolean;
  player: Actor | null;
}

export interface ProbeHit {
  x: number;
  y: number;
  knot: string;
  actor?: Actor;
}

const PROBE = 16; // px in front of the feet used to pick what you're facing
export const DIRS: Record<Facing, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const get = (name: string) => dialogue.get(name);

export function lightUp(lit: boolean, obj: Phaser.GameObjects.Sprite) {
  if (lit) obj.setPipeline('Light2D');
}

export function buildObject(ctx: MapCtx, o: MapObject): Dyn {
  const { scene, player, lit } = ctx;
  const rectOf = (x: number, y: number, w = 1, h = 1) =>
    new Phaser.Geom.Rectangle(x * TILE, y * TILE, w * TILE, h * TILE);
  switch (o.kind) {
    case 'npc': {
      const { x, y } = tileToFeet(o.x, o.y, TILE);
      const actor = new Actor(scene, x, y, o.char, o.facing ?? 'down', 'static');
      actor.sortDepth();
      lightUp(lit, actor.sprite);
      if (player) scene.physics.add.collider(player.sprite, actor.sprite);
      return { kind: 'npc', def: o, actor, on: true };
    }
    case 'spot': {
      const rect = rectOf(o.x, o.y, o.w, o.h);
      let glow: Phaser.GameObjects.Image | undefined;
      if (o.glow) {
        glow = scene.add
          .image(rect.centerX, rect.centerY, 'glow')
          .setBlendMode(Phaser.BlendModes.ADD)
          .setDepth(rect.bottom);
        if (ctx.def.lantern) glow.setTint(0xffc860); // warm "will-o'-wisp" gold reads better than cream in the dark
        if (!settingsStore.getState().reducedMotion) {
          scene.tweens.add({
            targets: glow,
            alpha: { from: 0.35, to: 0.9 },
            scale: { from: 0.9, to: 1.15 },
            yoyo: true,
            repeat: -1,
            duration: 900,
          });
        }
      }
      return { kind: 'spot', def: o, rect, glow, on: true };
    }
    case 'trigger':
      return { kind: 'trigger', def: o, rect: rectOf(o.x, o.y, o.w, o.h), inside: false, on: true };
    case 'prop': {
      const solid = o.solid ?? false;
      const sprite = scene.add.sprite(o.x * TILE + TILE / 2, o.y * TILE + (solid ? TILE / 2 : 18), o.sprite);
      sprite.setDepth(solid ? (o.y + 1) * TILE : 1);
      if (o.sprite === 'owl') sprite.play('owl-tap');
      if (solid) {
        scene.physics.add.existing(sprite, true);
        if (player) scene.physics.add.collider(player.sprite, sprite);
      }
      lightUp(lit, sprite);
      return { kind: 'prop', def: o, sprite, on: true };
    }
    case 'light': {
      const light = lit
        ? scene.lights.addLight(o.x * TILE + TILE / 2, o.y * TILE + TILE / 2, o.radius, o.color, o.intensity ?? 1)
        : null;
      return { kind: 'light', def: o, light, phase: Math.random() * 10, on: true };
    }
    case 'tile': {
      const base = ctx.layer.getTileAt(o.x, o.y)?.index ?? -1;
      return { kind: 'tile', def: o, base, swap: TILE_INDEX[o.tile] ?? base, on: false };
    }
  }
}

/** Re-evaluate every `when` against ink state (called after each dialogue line/close). */
export function refreshObjects(objs: Dyn[], layer: Phaser.Tilemaps.TilemapLayer) {
  for (const o of objs) {
    o.on = evaluate(o.def.when, get);
    switch (o.kind) {
      case 'npc':
        o.actor.sprite.setVisible(o.on);
        (o.actor.sprite.body as Phaser.Physics.Arcade.StaticBody).enable = o.on;
        break;
      case 'spot':
        o.glow?.setVisible(o.on && evaluate(o.def.glow, get));
        break;
      case 'prop':
        o.sprite.setVisible(o.on);
        if (o.sprite.body) (o.sprite.body as Phaser.Physics.Arcade.StaticBody).enable = o.on;
        break;
      case 'light':
        if (o.light) o.light.intensity = o.on ? (o.def.intensity ?? 1) : 0;
        break;
      case 'tile':
        layer.putTileAt(o.on ? o.swap : o.base, o.def.x, o.def.y);
        break;
    }
  }
}

/** The first trigger the player just stepped into (edge-detected), or null. */
export function enteredTrigger(objs: Dyn[], p: Actor): Obj<'trigger'> | null {
  for (const o of objs) {
    if (o.kind !== 'trigger') continue;
    const inside = o.on && o.rect.contains(p.x, p.y - 3);
    if (inside && !o.inside) {
      o.inside = true;
      return o.def;
    }
    o.inside = inside;
  }
  return null;
}

/** What is the player facing? Returns prompt position + knot. */
export function probe(objs: Dyn[], p: Actor, follower: Actor | null): ProbeHit | null {
  const [dx, dy] = DIRS[p.facing];
  const px = p.x + dx * PROBE;
  const py = p.y - 4 + dy * PROBE;
  const actors: [Actor, string][] = [];
  for (const o of objs) if (o.kind === 'npc' && o.on) actors.push([o.actor, o.def.knot]);
  if (follower) actors.push([follower, 'snape_talk']);
  for (const [a, knot] of actors) {
    if (Math.abs(a.x - px) < 13 && Math.abs(a.y - 6 - py) < 14) return { x: a.x, y: a.y - 36, knot, actor: a };
  }
  for (const o of objs) {
    if (o.kind !== 'spot' || !o.on) continue;
    const r = o.rect;
    if (px >= r.x - 4 && px <= r.right + 4 && py >= r.y - 4 && py <= r.bottom + 4) {
      return { x: Phaser.Math.Clamp(px, r.x + 6, r.right - 6), y: r.y + 2, knot: o.def.knot };
    }
  }
  return null;
}

export function flickerLights(objs: Dyn[], time: number) {
  for (const o of objs) {
    if (o.kind !== 'light' || !o.light || !o.on || !o.def.flicker) continue;
    const base = o.def.intensity ?? 1;
    o.light.intensity =
      base * (0.88 + 0.08 * Math.sin(time * 0.011 + o.phase) + 0.04 * Math.sin(time * 0.037 + o.phase * 3));
  }
}
