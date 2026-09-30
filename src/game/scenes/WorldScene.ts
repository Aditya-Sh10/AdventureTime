import Phaser from 'phaser';
import { GAME_H, GAME_W, INTERACT_COOLDOWN_MS, TILE } from '../constants';
import { SOLID_TILES, TILE_INDEX } from '../art/tiles';
import { Actor, WALK_SPEED, tileToFeet } from '../entities/Actor';
import { dialogue } from '../services';
import { evaluate } from '../systems/conditions';
import { bus, type GameEvents } from '../systems/events';
import { tickHints } from '../systems/hints';
import { session } from '../systems/session';
import { MAPS, type Facing, type MapDef, type MapObject } from '@/data/maps';
import { LEGEND } from '@/data/maps/legend';
import { gameStore } from '@/store/gameStore';
import { settingsStore } from '@/store/settingsStore';

type WorldData = GameEvents['load-map'];
type Obj<K extends MapObject['kind']> = Extract<MapObject, { kind: K }>;

type Dyn =
  | { kind: 'npc'; def: Obj<'npc'>; actor: Actor; on: boolean }
  | { kind: 'spot'; def: Obj<'spot'>; rect: Phaser.Geom.Rectangle; glow?: Phaser.GameObjects.Image; on: boolean }
  | { kind: 'trigger'; def: Obj<'trigger'>; rect: Phaser.Geom.Rectangle; inside: boolean; on: boolean }
  | { kind: 'prop'; def: Obj<'prop'>; sprite: Phaser.GameObjects.Sprite; on: boolean }
  | { kind: 'light'; def: Obj<'light'>; light: Phaser.GameObjects.Light | null; phase: number; on: boolean };

const PROBE = 16; // px in front of the feet used to pick what you're facing
const FOLLOW_GAP = 11; // trail points (~2px apart) between player and follower
const DIRS: Record<Facing, [number, number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
const get = (name: string) => dialogue.get(name);

export class WorldScene extends Phaser.Scene {
  private def!: MapDef;
  private player: Actor | null = null;
  private follower: Actor | null = null;
  private trail: { x: number; y: number }[] = [];
  private objs: Dyn[] = [];
  private layer!: Phaser.Tilemaps.TilemapLayer;
  private keys!: Record<'up' | 'down' | 'left' | 'right' | 'w' | 'a' | 's' | 'd', Phaser.Input.Keyboard.Key>;
  private interactQueued = false;
  private prompt!: Phaser.GameObjects.Text;
  private lit = false;
  private leaving = false;

  constructor() {
    super('World');
  }

  init() {
    // Scene instances are reused across restarts: reset per-map state.
    this.player = null;
    this.follower = null;
    this.trail = [];
    this.objs = [];
    this.interactQueued = false;
    this.leaving = false;
  }

  create(data: WorldData) {
    const def = MAPS[data.map] ?? MAPS.bedroom;
    this.def = def;
    this.lit = settingsStore.getState().lighting && this.renderer.type === Phaser.WEBGL;
    this.buildMap(def);
    if (!data.attract) this.spawnPlayer(def, data);
    for (const o of def.objects) this.addObject(o);
    this.refresh();
    this.setupCamera(data);
    this.setupInput();

    this.prompt = this.add
      .text(0, 0, '!', { fontFamily: '"Press Start 2P"', fontSize: '8px', color: '#ffe9a8', stroke: '#1a1320', strokeThickness: 3 })
      .setOrigin(0.5, 1)
      .setDepth(10_000)
      .setVisible(false);

    const offs = [
      bus.on('refresh', () => this.refresh()),
      bus.on('load-map', (d) => this.leave(d)),
      bus.on('show', ({ what }) => this.show(what)),
      bus.on('cam', ({ fx }) => this.camFx(fx)),
    ];
    const cleanup = () => offs.splice(0).forEach((off) => off());
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
    this.events.once(Phaser.Scenes.Events.DESTROY, cleanup);

    gameStore.setState({ mapName: def.name });
    if (this.player) {
      session.map = def.id;
      bus.emit('autosave');
    }
    if (import.meta.env.DEV) Object.assign(window, { __player: this.player?.sprite, __scene: this });
  }

  // ---------- build ----------

  private buildMap(def: MapDef) {
    const data = def.grid.map((row) => [...row].map((ch) => TILE_INDEX[LEGEND[ch] ?? 'void']));
    const map = this.make.tilemap({ data, tileWidth: TILE, tileHeight: TILE });
    const ts = map.addTilesetImage('tiles', 'tiles', TILE, TILE, 0, 0)!;
    this.layer = map.createLayer(0, ts, 0, 0)!;
    this.layer.setCollision(SOLID_TILES);
    if (this.lit) {
      this.layer.setPipeline('Light2D');
      this.lights.enable().setAmbientColor(def.ambient);
    }
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }

  private spawnPlayer(def: MapDef, data: WorldData) {
    const [sx, sy, sf] = def.spawns[data.spawn ?? Object.keys(def.spawns)[0]] ?? [1, 1, 'down'];
    const p = data.pos ?? { ...tileToFeet(sx, sy, TILE), facing: sf };
    this.player = new Actor(this, p.x, p.y, 'ishu', p.facing as Facing, 'dynamic');
    this.player.sprite.setCollideWorldBounds(true);
    this.physics.add.collider(this.player.sprite, this.layer);
    this.lightUp(this.player.sprite);
    const pl = this.player;
    session.position = () => ({ x: pl.x, y: pl.y, facing: pl.facing });
  }

  private addObject(o: MapObject) {
    const rectOf = (x: number, y: number, w = 1, h = 1) => new Phaser.Geom.Rectangle(x * TILE, y * TILE, w * TILE, h * TILE);
    switch (o.kind) {
      case 'npc': {
        const { x, y } = tileToFeet(o.x, o.y, TILE);
        const actor = new Actor(this, x, y, o.char, o.facing ?? 'down', 'static');
        actor.sortDepth();
        this.lightUp(actor.sprite);
        if (this.player) this.physics.add.collider(this.player.sprite, actor.sprite);
        this.objs.push({ kind: 'npc', def: o, actor, on: true });
        break;
      }
      case 'spot': {
        const rect = rectOf(o.x, o.y, o.w, o.h);
        let glow: Phaser.GameObjects.Image | undefined;
        if (o.glow) {
          glow = this.add.image(rect.centerX, rect.centerY, 'glow').setBlendMode(Phaser.BlendModes.ADD).setDepth(rect.bottom);
          if (!settingsStore.getState().reducedMotion) {
            this.tweens.add({ targets: glow, alpha: { from: 0.35, to: 0.9 }, scale: { from: 0.9, to: 1.15 }, yoyo: true, repeat: -1, duration: 900 });
          }
        }
        this.objs.push({ kind: 'spot', def: o, rect, glow, on: true });
        break;
      }
      case 'trigger':
        this.objs.push({ kind: 'trigger', def: o, rect: rectOf(o.x, o.y, o.w, o.h), inside: false, on: true });
        break;
      case 'prop': {
        const sprite = this.add.sprite(o.x * TILE + TILE / 2, o.y * TILE + 18, o.sprite).setDepth(1);
        sprite.play('owl-tap');
        this.lightUp(sprite);
        this.objs.push({ kind: 'prop', def: o, sprite, on: true });
        break;
      }
      case 'light': {
        const light = this.lit
          ? this.lights.addLight(o.x * TILE + TILE / 2, o.y * TILE + TILE / 2, o.radius, o.color, o.intensity ?? 1)
          : null;
        this.objs.push({ kind: 'light', def: o, light, phase: Math.random() * 10, on: true });
        break;
      }
    }
  }

  private lightUp(obj: Phaser.GameObjects.Sprite) {
    if (this.lit) obj.setPipeline('Light2D');
  }

  private setupCamera(data: WorldData) {
    const cam = this.cameras.main;
    const mw = this.layer.width;
    const mh = this.layer.height;
    const bx = mw < GAME_W ? -(GAME_W - mw) / 2 : 0;
    const by = mh < GAME_H ? -(GAME_H - mh) / 2 : 0;
    cam.setBounds(bx, by, Math.max(mw, GAME_W), Math.max(mh, GAME_H));
    cam.setRoundPixels(true);
    if (this.player) cam.startFollow(this.player.sprite, true, 0.12, 0.12);
    else {
      const [tx, ty] = this.def.spawns[data.spawn ?? ''] ?? [mw / TILE / 2, mh / TILE / 2];
      cam.centerOn(tx * TILE + TILE / 2, ty * TILE + TILE / 2);
    }
    cam.fadeIn(400, 5, 4, 10);
  }

  private setupInput() {
    const kb = this.input.keyboard!;
    this.keys = kb.addKeys('up,down,left,right,w,a,s,d') as typeof this.keys;
    // Let React UI receive Space/Enter while dialogue/menus are open.
    kb.removeCapture('SPACE,ENTER');
    // Event-driven so sub-frame taps are never missed; consumed in update().
    const queue = () => (this.interactQueued = true);
    kb.on('keydown-E', queue);
    kb.on('keydown-SPACE', queue);
    kb.on('keydown-ENTER', queue);
  }

  // ---------- state sync ----------

  /** Re-evaluate every `when` against ink state (called after each dialogue line/close). */
  private refresh() {
    for (const o of this.objs) {
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
          break;
        case 'light':
          if (o.light) o.light.intensity = o.on ? (o.def.intensity ?? 1) : 0;
          break;
      }
    }
    if (this.player && !this.follower && get('snape_bound')) this.spawnFollower();
  }

  private spawnFollower() {
    const npc = this.objs.find((o) => o.kind === 'npc' && o.def.char === 'snape');
    const p = this.player!;
    const [dx, dy] = DIRS[p.facing];
    const x = npc?.kind === 'npc' ? npc.actor.x : p.x - dx * 22;
    const y = npc?.kind === 'npc' ? npc.actor.y : p.y - dy * 22;
    this.follower = new Actor(this, x, y, 'snape', 'down');
    this.lightUp(this.follower.sprite);
    this.follower.sortDepth();
  }

  // ---------- frame ----------

  update(time: number, delta: number) {
    this.flicker(time);
    const p = this.player;
    if (!p || this.leaving) return;
    const st = gameStore.getState();
    const interact = this.interactQueued;
    this.interactQueued = false;
    const body = p.sprite.body as Phaser.Physics.Arcade.Body;

    if (st.mode !== 'play') {
      body.setVelocity(0);
      p.idle();
      this.follower?.idle();
      this.prompt.setVisible(false);
      return;
    }

    session.playMs += delta;
    tickHints();
    this.move(p, body);
    this.follow(delta);
    this.checkTriggers(p);
    if (gameStore.getState().mode !== 'play') return;

    const target = this.probe(p);
    this.prompt.setVisible(!!target);
    if (target) this.prompt.setPosition(target.x, target.y);
    if (target && interact && performance.now() - st.dialogueClosedAt > INTERACT_COOLDOWN_MS) {
      body.setVelocity(0);
      p.idle();
      target.actor?.face(target.actor.faceToward(p.x, p.y));
      dialogue.start(target.knot);
    }
  }

  private move(p: Actor, body: Phaser.Physics.Arcade.Body) {
    const k = this.keys;
    const x = Number(k.right.isDown || k.d.isDown) - Number(k.left.isDown || k.a.isDown);
    const y = Number(k.down.isDown || k.s.isDown) - Number(k.up.isDown || k.w.isDown);
    body.setVelocity(x, y);
    body.velocity.normalize().scale(WALK_SPEED);
    if (!x && !y) {
      p.idle();
    } else {
      // On diagonals keep the current facing if it's one of the two pressed directions.
      const h: Facing | null = x ? (x < 0 ? 'left' : 'right') : null;
      const v: Facing | null = y ? (y < 0 ? 'up' : 'down') : null;
      const f = h && v ? (p.facing === h || p.facing === v ? p.facing : h) : (h ?? v)!;
      p.walk(f);
    }
    p.sortDepth();
  }

  private follow(delta: number) {
    const f = this.follower;
    const p = this.player!;
    if (!f) return;
    const last = this.trail[this.trail.length - 1];
    if (!last || Math.hypot(p.x - last.x, p.y - last.y) >= 2) {
      this.trail.push({ x: p.x, y: p.y });
      if (this.trail.length > 80) this.trail.shift();
    }
    const target = this.trail[Math.max(0, this.trail.length - 1 - FOLLOW_GAP)];
    const dx = target.x - f.x;
    const dy = target.y - f.y;
    const dist = Math.hypot(dx, dy);
    // Walk pace normally; hurry (up to 3x) when left far behind.
    const step = (WALK_SPEED * Phaser.Math.Clamp(dist / 30, 1.1, 3) * delta) / 1000;
    if (dist > 1.5 && this.trail.length > FOLLOW_GAP) {
      const k = Math.min(1, step / dist);
      f.sprite.setPosition(f.x + dx * k, f.y + dy * k);
      f.walk(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down');
    } else if (f.sprite.anims.isPlaying) {
      f.face(f.faceToward(p.x, p.y));
    }
    f.sortDepth();
  }

  private checkTriggers(p: Actor) {
    for (const o of this.objs) {
      if (o.kind !== 'trigger') continue;
      const inside = o.on && o.rect.contains(p.x, p.y - 3);
      if (inside && !o.inside && gameStore.getState().mode === 'play') {
        o.inside = true;
        (p.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(0);
        p.idle();
        dialogue.start(o.def.knot);
        return;
      }
      o.inside = inside;
    }
  }

  /** What is the player facing? Returns prompt position + knot. */
  private probe(p: Actor): { x: number; y: number; knot: string; actor?: Actor } | null {
    const [dx, dy] = DIRS[p.facing];
    const px = p.x + dx * PROBE;
    const py = p.y - 4 + dy * PROBE;
    const actors: [Actor, string][] = [];
    for (const o of this.objs) if (o.kind === 'npc' && o.on) actors.push([o.actor, o.def.knot]);
    if (this.follower) actors.push([this.follower, 'snape_talk']);
    for (const [a, knot] of actors) {
      if (Math.abs(a.x - px) < 13 && Math.abs(a.y - 6 - py) < 14) return { x: a.x, y: a.y - 36, knot, actor: a };
    }
    for (const o of this.objs) {
      if (o.kind !== 'spot' || !o.on) continue;
      const r = o.rect;
      if (px >= r.x - 4 && px <= r.right + 4 && py >= r.y - 4 && py <= r.bottom + 4) {
        return { x: Phaser.Math.Clamp(px, r.x + 6, r.right - 6), y: r.y + 2, knot: o.def.knot };
      }
    }
    return null;
  }

  private flicker(time: number) {
    if (!this.lit || settingsStore.getState().reducedMotion) return;
    for (const o of this.objs) {
      if (o.kind !== 'light' || !o.light || !o.on || !o.def.flicker) continue;
      const base = o.def.intensity ?? 1;
      o.light.intensity = base * (0.88 + 0.08 * Math.sin(time * 0.011 + o.phase) + 0.04 * Math.sin(time * 0.037 + o.phase * 3));
    }
  }

  // ---------- scripted beats ----------

  private leave(d: WorldData) {
    if (this.leaving) return;
    this.leaving = true;
    (this.player?.sprite.body as Phaser.Physics.Arcade.Body | undefined)?.setVelocity(0);
    this.cameras.main.fadeOut(300, 5, 4, 10);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.restart(d));
  }

  private show(what: string) {
    const m = this.def.markers?.[what];
    if (!m || what !== 'figure') return;
    const { x, y } = tileToFeet(m[0], m[1], TILE);
    const fig = new Actor(this, x, y, 'figure', 'right');
    fig.sortDepth();
    fig.sprite.setAlpha(0);
    this.tweens.chain({
      targets: fig.sprite,
      tweens: [
        { alpha: 1, duration: 450 },
        { alpha: 1, duration: 1300 },
        { alpha: 0, duration: 180 },
      ],
      onComplete: () => fig.sprite.destroy(),
    });
  }

  private camFx(fx: 'shake' | 'flash') {
    const reduced = settingsStore.getState().reducedMotion;
    if (fx === 'shake' && !reduced) this.cameras.main.shake(260, 0.006);
    if (fx === 'flash') this.cameras.main.flash(reduced ? 200 : 500, 255, 240, 200);
  }
}
