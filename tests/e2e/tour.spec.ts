import { test, type Page } from '@playwright/test';

/** Screenshot tour for eyeballing art/UI (not assertions). Run: SHOT_DIR=<dir> npx playwright test tour */
const OUT = process.env.SHOT_DIR ?? 'test-results/shots';

const skipDialogue = async (page: Page, max = 60) => {
  for (let i = 0; i < max && (await page.getByTestId('dialogue').count()); i++) {
    const choice = page.getByTestId('dialogue').getByRole('button');
    if (await choice.count()) await choice.first().click();
    else await page.keyboard.press('Space');
    await page.waitForTimeout(90);
  }
};
const run = (page: Page, knot: string) => page.evaluate((k) => (window as any).__dialogue.start(k), knot);

test('visual tour', async ({ page }) => {
  test.skip(!process.env.SHOT_DIR, 'screenshot tour: set SHOT_DIR to run');
  test.setTimeout(420_000);
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.waitForTimeout(800);
  await page.getByTestId('new-game').click();
  await page.waitForTimeout(600);
  await skipDialogue(page);
  await page.evaluate(() => (window as any).__bus.emit('load-map', { map: 'hall', spawn: 'arrive' }));
  await page.waitForTimeout(1500);
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(600);
  }
  await page.screenshot({ path: `${OUT}/10-portrait.png` });
  await skipDialogue(page);
  await run(page, 'portrait_violet');
  await skipDialogue(page);
  // stand under the Gryffindor banner (6,1)
  await page.evaluate(() => (window as any).__player.setPosition(6 * 32 + 16, 3 * 32 - 4));
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/11-banner-glow.png` });
  await run(page, 'banner_red');
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(160);
    if (await page.getByText('someone in a hood').count()) break;
  }
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/12-figure.png` });
  await skipDialogue(page);

  // --- Library ---
  const warp = (map: string, spawn: string) => page.evaluate(([m, sp]) => (window as any).__bus.emit('load-map', { map: m, spawn: sp }), [map, spawn]);
  const at = (x: number, y: number) => page.evaluate(([tx, ty]) => (window as any).__player.setPosition(tx * 32 + 16, (ty + 1) * 32 - 4), [x, y]);
  await page.evaluate(() => (window as any).__dialogue.set('library_seen', true));
  await warp('library', 'entry');
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/20-library-east.png` });
  await at(10, 6);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/21-library-aisles.png` });
  await at(7, 6);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/22-library-gate.png` });
  await run(page, 'pince');
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/23-pince.png` });
  await skipDialogue(page);
  await page.evaluate(() => (window as any).__dialogue.set('books', 4));
  await page.evaluate(() => (window as any).__dialogue.start('restricted_gate'));
  await skipDialogue(page);
  await page.waitForTimeout(400);
  await page.keyboard.type('ish');
  await page.keyboard.press('Enter');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/24-codelock-hint.png` });
  await page.keyboard.press('Escape');
  await run(page, 'restricted_unlocked');
  await skipDialogue(page);
  await at(3, 6);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/25-restricted.png` });
  await run(page, 'restricted_lectern');
  await skipDialogue(page);
  await warp('hall', 'library');
  await page.waitForTimeout(800);
  await skipDialogue(page);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/26-hall-empty.png` });
  await skipDialogue(page);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/27-chapter-end.png` });

  // --- Forest ---
  await page.evaluate(() => (window as any).__dialogue.set('ch1_done', true));
  await warp('forest', 'edge');
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/30-forest-dark.png` });
  await skipDialogue(page);
  await run(page, 'forest_lantern');
  await skipDialogue(page);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/31-forest-lantern.png` });
  await at(9, 14);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/32-forest-path.png` });
  await at(9, 5);
  await page.waitForTimeout(400);
  await skipDialogue(page);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/33-forest-lumos.png` });
  await page.evaluate(() => (window as any).__dialogue.set('track3', true));
  await at(25, 6);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/34-forest-clearing.png` });
  await page.evaluate(() => {
    const d = (window as any).__dialogue;
    d.set('burrows', 2);
    d.start('forest_burrow_a');
  });
  await skipDialogue(page);
  await at(25, 7);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/35-niffler.png` });
  await run(page, 'niffler');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/36-niffler-portrait.png` });
  await skipDialogue(page);
  await run(page, 'forest_exit');
  await skipDialogue(page);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/37-ch2-end.png` });

  // --- Courtroom ---
  await page.getByTestId('card-continue').click();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/40-court-arrive.png` });
  await skipDialogue(page);
  await at(6, 7);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/41-court-floor.png` });
  await run(page, 'divisha');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${OUT}/42-divisha.png` });
  await skipDialogue(page);
  await at(17, 5);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/43-court-witness.png` });
  await run(page, 'guddu');
  await page.waitForTimeout(400);
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/44-guddu.png` });
  await skipDialogue(page);
  await at(3, 10);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/45-court-gallery.png` });
  await page.evaluate(() => {
    const d = (window as any).__dialogue;
    d.set('evidence', 3);
    d.set('trial_started', true);
    d.start('court_judge');
  });
  await skipDialogue(page);
  await page.waitForTimeout(600);
  await page.keyboard.press('2');
  await page.keyboard.press('2');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/46-duel-hint.png` });
  await page.keyboard.press('1');
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${OUT}/47-objection.png` });
  await page.keyboard.press('Escape');
  await at(10, 4);
  await page.waitForTimeout(800);
  await run(page, 'court_verdict');
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(160);
    if (await page.getByText('hooded figure leans').count()) break;
  }
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/48-court-figure.png` });
  await skipDialogue(page);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/49-ch3-end.png` });

  // --- Multiverse rift ---
  await page.evaluate(() => (window as any).__dialogue.set('lantern', 2));
  await page.getByTestId('card-continue').click();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/50-rift-arrive.png` });
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(160);
    if (await page.getByText('safety-pinned').count()) break;
  }
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/51-bat.png` });
  await skipDialogue(page);
  await at(14, 14);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/52-hub.png` });
  await at(6, 11);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/53-hk-dark.png` });
  await run(page, 'matt');
  await page.waitForTimeout(400);
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/54-matt.png` });
  await skipDialogue(page);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/55-hk-radar.png` });
  await at(13, 4);
  await page.waitForTimeout(1200);
  await run(page, 'spidey');
  await page.waitForTimeout(400);
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/56-spidey.png` });
  await skipDialogue(page);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/57-queens.png` });
  await at(26, 10);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/58-tower.png` });
  await run(page, 'rapunzel');
  await page.waitForTimeout(400);
  await page.keyboard.press('Space');
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/59-rapunzel.png` });
  await skipDialogue(page);
  await page.evaluate(() => {
    const d = (window as any).__dialogue;
    for (const v of ['lamp_a', 'lamp_b', 'lamp_c']) d.set(v, true);
    (window as any).__bus.emit('refresh');
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/60-lanterns.png` });
  await at(15, 15);
  await page.waitForTimeout(800);
  await page.evaluate(() => (window as any).__dialogue.set('shards', 3));
  await run(page, 'rift_core');
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(160);
    if (await page.getByText('hooded figure, asleep').count()) break;
  }
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/61-rift-figure.png` });
  await skipDialogue(page);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/62-ch4-end.png` });

  // --- Haunted wing ---
  await page.getByTestId('card-continue').click();
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `${OUT}/70-haunt-arrive.png` });
  await skipDialogue(page);
  await at(15, 14);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/71-corridor.png` });
  await page.evaluate(() => (window as any).__bus.emit('load-map', { map: 'haunted', spawn: 'nurseryIn' }));
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/72-nursery.png` });
  await run(page, 'nursery_mirror');
  await skipDialogue(page);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/73-nursery-lens.png` });
  await page.evaluate(() => (window as any).__bus.emit('load-map', { map: 'haunted', spawn: 'tvIn' }));
  await page.waitForTimeout(1500);
  await run(page, 'tv_tape');
  for (let i = 0; i < 20; i++) {
    const choice = page.getByTestId('dialogue').getByRole('button');
    if (await choice.count()) await choice.first().click();
    else await page.keyboard.press('Space');
    await page.waitForTimeout(160);
    if (await page.getByText('AT THE GLASS').count()) break;
  }
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/74-tape-scare.png` });
  await skipDialogue(page);
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${OUT}/75-tv-room.png` });
  await page.evaluate(() => (window as any).__bus.emit('load-map', { map: 'haunted', spawn: 'tvOut' }));
  await page.waitForTimeout(1500);
  await at(15, 13);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/76-red-door.png` });
  await page.evaluate(() => (window as any).__bus.emit('load-map', { map: 'haunted', spawn: 'redIn' }));
  await page.waitForTimeout(1500);
  await skipDialogue(page);
  await page.evaluate(() => (window as any).__dialogue.set('date_seen', true));
  await page.evaluate(() => (window as any).__bus.emit('refresh'));
  await at(27, 4);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/77-red-room.png` });
  await run(page, 'red_mirror');
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(140);
    if (await page.getByText('close enough to touch').count()) break;
  }
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/78-red-figure.png` });
  await skipDialogue(page);
  await page.evaluate(() => (window as any).__bus.emit('load-map', { map: 'haunted', spawn: 'hidden' }));
  await page.waitForTimeout(1500);
  for (let i = 0; i < 20; i++) {
    const choice = page.getByTestId('dialogue').getByRole('button');
    if (await choice.count()) await choice.first().click();
    else await page.keyboard.press('Space');
    await page.waitForTimeout(140);
    if (await page.getByText('sits on your feet').count()) break;
  }
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/79-lily.png` });
  await skipDialogue(page, 120);
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${OUT}/80-ch5-end.png` });
});
