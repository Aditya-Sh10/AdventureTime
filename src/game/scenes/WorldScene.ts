import Phaser from 'phaser';
import { GAME_H, GAME_W, INTERACT_COOLDOWN_MS, TILE } from '../constants';
import { SOLID_TILES, TILE_INDEX, TILE_NAMES } from '../art/tiles';
import { Actor, WALK_SPEED, tileToFeet } from '../entities/Actor';
import { dialogue } from '../services';
import { bus, type GameEvents } from '../systems/events';
import { tickHints } from '../systems/hints';
import { lanternFlicker, lanternRadius } from '../systems/lantern';
import { sfx } from '../systems/audio';
import { STRIDE_PX, surfaceOf } from '../systems/footsteps';
import { session } from '../systems/session';
import { DIRS, buildObject, enteredTrigger, flickerLights, lightUp, probe, refreshObjects, type Dyn } from './mapObjects';
import { camFx, showFigure } from './worldFx';
import { MAPS, type Facing, type MapDef } from '@/data/maps';
import { legendOf } from '@/data/maps/legend';
import { gameStore } from '@/store/gameStore';
import { settingsStore } from '@/store/settingsStore';

type WorldData = GameEvents['load-map'];
const FOLLOW_GAP = 11; // trail points (~2px apart) between player and follower
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
  private lantern: Phaser.GameObjects.Light | null = null;
  private lanternR = 0;
  /** Pixels walked since the last footfall (player / Snape). */
  private stepAcc = 0;
  private followStepAcc = 0;

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
    this.lantern = null;
    this.lanternR = 0;
    this.stepAcc = 0;
    this.followStepAcc = 0;
  }

  create(data: WorldData) {
    const def = MAPS[data.map] ?? MAPS.bedroom;
    this.def = def;
    this.lit = settingsStore.getState().lighting && this.renderer.type === Phaser.WEBGL;
    this.buildMap(def);
    if (!data.attract) this.spawnPlayer(def, data);
    // Same song across maps (hall → library) keeps playing; the title backdrop is silent.
    sfx.music.play(data.attract ? null : (def.music ?? null));
    sfx.ambience.play(data.attract ? null : (def.ambience ?? null));
    if (def.lantern && this.lit && this.player) {
      this.lantern = this.lights.addLight(this.player.x, this.player.y, lanternRadius(0), 0xffc878, 1.4);
    }
    const ctx = { scene: this, def, layer: this.layer, lit: this.lit, player: this.player };
    this.objs = def.objects.map((o) => buildObject(ctx, o));
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
      bus.on('show', ({ what }) => showFigure(this, this.def, what)),
      bus.on('cam', ({ fx }) => camFx(this, fx)),
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
    const legend = legendOf(def);
    const data = def.grid.map((row) => [...row].map((ch) => TILE_INDEX[legend[ch] ?? 'void']));
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
    lightUp(this.lit, this.player.sprite);
    const pl = this.player;
    session.position = () => ({ x: pl.x, y: pl.y, facing: pl.facing });
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

  private refresh() {
    refreshObjects(this.objs, this.layer);
    if (this.player && !this.follower && get('snape_bound')) this.spawnFollower();
  }

  private spawnFollower() {
    const npc = this.objs.find((o) => o.kind === 'npc' && o.def.char === 'snape');
    const p = this.player!;
    const [dx, dy] = DIRS[p.facing];
    // Stand beside her, not behind: after a door warp she faces up, and "behind" put his 36px sprite
    // in front of hers (he doesn't move until she does, so cutscenes hid her entirely).
    const free = (x: number, y: number) => !this.layer.getTileAtWorldXY(x, y - 4)?.collides;
    const spot = [
      [p.x - 26, p.y],
      [p.x + 26, p.y],
      [p.x - dx * 22, p.y - dy * 22],
    ].find(([x, y]) => free(x, y)) ?? [p.x, p.y];
    const [x, y] = npc?.kind === 'npc' ? [npc.actor.x, npc.actor.y] : spot;
    this.follower = new Actor(this, x, y, 'snape', 'down');
    this.follower.face(this.follower.faceToward(p.x, p.y));
    lightUp(this.lit, this.follower.sprite);
    this.follower.sortDepth();
  }

  // ---------- frame ----------

  update(time: number, delta: number) {
    this.flicker(time);
    const p = this.player;
    if (!p || this.leaving) return;
    this.followLantern(p, time, delta);
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
    this.move(p, body, delta);
    this.follow(delta);
    this.checkTriggers(p);
    if (gameStore.getState().mode !== 'play') return;

    const target = probe(this.objs, p, this.follower);
    this.prompt.setVisible(!!target);
    if (target) this.prompt.setPosition(target.x, target.y);
    if (target && interact && performance.now() - st.dialogueClosedAt > INTERACT_COOLDOWN_MS) {
      body.setVelocity(0);
      p.idle();
      target.actor?.face(target.actor.faceToward(p.x, p.y));
      dialogue.start(target.knot);
    }
  }

  private move(p: Actor, body: Phaser.Physics.Arcade.Body, delta: number) {
    const k = this.keys;
    const x = Number(k.right.isDown || k.d.isDown) - Number(k.left.isDown || k.a.isDown);
    const y = Number(k.down.isDown || k.s.isDown) - Number(k.up.isDown || k.w.isDown);
    body.setVelocity(x, y);
    body.velocity.normalize().scale(WALK_SPEED);
    if (!x && !y) {
      p.idle();
      this.stepAcc = STRIDE_PX * 0.6; // first footfall comes quickly when she sets off again
    } else {
      this.stepAcc += (WALK_SPEED * delta) / 1000;
      if (this.stepAcc >= STRIDE_PX) {
        this.stepAcc -= STRIDE_PX;
        sfx.step(this.surfaceAt(p.x, p.y));
      }
      // On diagonals keep the current facing if it's one of the two pressed directions.
      const h: Facing | null = x ? (x < 0 ? 'left' : 'right') : null;
      const v: Facing | null = y ? (y < 0 ? 'up' : 'down') : null;
      const f = h && v ? (p.facing === h || p.facing === v ? p.facing : h) : (h ?? v)!;
      p.walk(f);
    }
    p.sortDepth();
  }

  private surfaceAt(x: number, y: number) {
    const t = this.layer.getTileAtWorldXY(x, y - 2);
    return surfaceOf(t ? TILE_NAMES[t.index] : undefined);
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
      this.followStepAcc += dist * k;
      if (this.followStepAcc >= STRIDE_PX * 1.15) {
        this.followStepAcc = 0;
        sfx.step(this.surfaceAt(f.x, f.y), true);
      }
      f.walk(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'left' : 'right') : dy < 0 ? 'up' : 'down');
    } else if (f.sprite.anims.isPlaying) {
      f.face(f.faceToward(p.x, p.y));
    }
    f.sortDepth();
  }

  private checkTriggers(p: Actor) {
    const hit = enteredTrigger(this.objs, p);
    if (!hit || gameStore.getState().mode !== 'play') return;
    (p.sprite.body as Phaser.Physics.Arcade.Body).setVelocity(0);
    p.idle();
    dialogue.start(hit.knot);
  }

  /** Lantern rides at hand height; radius eases toward the ink level so upgrades bloom instead of popping. */
  private followLantern(p: Actor, time: number, delta: number) {
    const l = this.lantern;
    if (!l) return;
    const target = lanternRadius(Number(get('lantern') ?? 0));
    this.lanternR += (target - this.lanternR) * Math.min(1, delta / 250);
    l.setPosition(p.x, p.y - 14);
    l.radius = this.lanternR * lanternFlicker(time, settingsStore.getState().reducedMotion);
  }

  private flicker(time: number) {
    if (this.lit && !settingsStore.getState().reducedMotion) flickerLights(this.objs, time);
  }

  // ---------- transitions ----------

  private leave(d: WorldData) {
    if (this.leaving) return;
    this.leaving = true;
    (this.player?.sprite.body as Phaser.Physics.Arcade.Body | undefined)?.setVelocity(0);
    this.cameras.main.fadeOut(300, 5, 4, 10);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => this.scene.restart(d));
  }
}
