import { expect, test, type Page } from '@playwright/test';

/** End-to-end: title → prologue (owl, letter, frame) → hall → Snape bound → objective. Uses DEV hooks. */

const dlg = (page: Page) => page.getByTestId('dialogue');

/** Advance dialogue (Space) and pick the first choice whenever choices show, until it closes. */
async function finishDialogue(page: Page, max = 60) {
  for (let i = 0; i < max && (await dlg(page).count()); i++) {
    const choice = dlg(page).getByRole('button');
    if (await choice.count()) await choice.first().click();
    else await page.keyboard.press('Space');
    await page.waitForTimeout(60);
  }
  await expect(dlg(page)).toBeHidden();
}

/** Stand one tile below a wall object and face it. */
async function standBelow(page: Page, tx: number, ty: number) {
  await page.evaluate(([x, y]) => (window as any).__player.setPosition(x * 32 + 16, (y + 2) * 32 - 4), [tx, ty]);
  await page.keyboard.down('w');
  await page.waitForTimeout(120);
  await page.keyboard.up('w');
  await page.waitForTimeout(250); // interact cooldown after the previous dialogue
}

test('prologue → chapter 1 opening', async ({ page }) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('new-game').click();

  // opening narration fires on spawn
  await expect(dlg(page)).toBeVisible();
  await finishDialogue(page);
  await expect(page.getByTestId('objective')).toContainText('tapping');

  // movement works
  const x0 = await page.evaluate(() => (window as any).__player.x);
  await page.keyboard.down('d');
  await page.waitForTimeout(300);
  await page.keyboard.up('d');
  expect(await page.evaluate(() => (window as any).__player.x)).toBeGreaterThan(x0 + 10);

  // owl at the window → letter
  await standBelow(page, 5, 1);
  await page.keyboard.press('e');
  await expect(dlg(page)).toContainText('owl', { ignoreCase: true });
  await finishDialogue(page);
  await expect(page.getByTestId('objective')).toContainText('glowing');

  // glowing frame → warp to the hall → Snape intro
  await standBelow(page, 2, 1);
  await page.keyboard.press('e');
  await expect(dlg(page)).toContainText('glowing');
  await finishDialogue(page);
  await expect(dlg(page)).toContainText('Entrance Hall', { timeout: 5000 });
  await finishDialogue(page);
  await expect(page.getByTestId('objective')).toContainText('first clue');
  expect(await page.evaluate(() => (window as any).__dialogue.get('snape_bound'))).toBe(true);

  // menu opens/closes
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('menu')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('menu')).toBeHidden();

  // progress was autosaved → Continue appears on the title
  await page.reload();
  await expect(page.getByTestId('continue')).toBeVisible();
  expect(errors).toEqual([]);
});

/** Stand one tile right of an object and face it (left). */
async function standRightOf(page: Page, tx: number, ty: number) {
  await page.evaluate(([x, y]) => (window as any).__player.setPosition((x + 1) * 32 + 16, (y + 1) * 32 - 4), [tx, ty]);
  await page.keyboard.down('a');
  await page.waitForTimeout(120);
  await page.keyboard.up('a');
  await page.waitForTimeout(250);
}

async function inspect(page: Page, expectText: string | RegExp) {
  await page.keyboard.press('e');
  await expect(dlg(page)).toContainText(expectText);
  await finishDialogue(page);
}

async function walk(page: Page, key: string, ms: number) {
  await page.keyboard.down(key);
  await page.waitForTimeout(ms);
  await page.keyboard.up(key);
}

test('chapter 1 library: books → code lock → map → empty hall → chapter end', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('new-game').click();
  await expect(dlg(page)).toBeVisible();
  await finishDialogue(page);

  // Jump to the end of the hall section (covered by the first test).
  await page.evaluate(() => {
    const w = window as any;
    for (const v of ['met_snape', 'snape_bound', 'heard_riddle', 'clue1']) w.__dialogue.set(v, true);
    w.__dialogue.set('clauses', 1);
    w.__bus.emit('load-map', { map: 'hall', spawn: 'library' });
  });
  await page.waitForTimeout(900);
  await walk(page, 'a', 400); // into the west archway
  await inspect(page, 'Library');
  await page.waitForTimeout(900);

  // arrival beat fires a few steps in
  await page.keyboard.down('a');
  await expect(dlg(page)).toBeVisible();
  await page.keyboard.up('a');
  await finishDialogue(page);
  await expect(page.getByTestId('objective')).toContainText('four glowing books');

  for (const [x, y] of [[8, 3], [12, 5], [8, 9], [17, 1]]) {
    await standBelow(page, x, y);
    await inspect(page, 'glowing book');
  }
  await expect(page.getByTestId('objective')).toContainText('Restricted Section');

  // code lock: a wrong try, then her name
  await standRightOf(page, 5, 6);
  await inspect(page, 'RESTRICTED SECTION');
  await expect(page.getByTestId('puzzle')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('puzzle-quip')).toContainText('No.');
  await page.keyboard.type('ishu');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('puzzle')).toBeHidden({ timeout: 3000 });
  await expect(dlg(page)).toContainText('lock clicks');
  await finishDialogue(page);
  expect(await page.evaluate(() => (window as any).__dialogue.get('restricted_open'))).toBe(true);

  // walk through the open gate to the lectern
  await page.evaluate(() => (window as any).__player.setPosition(6 * 32 + 16, 7 * 32 - 4));
  await walk(page, 'a', 500);
  expect(await page.evaluate(() => (window as any).__player.x)).toBeLessThan(5 * 32 + 16);
  await standBelow(page, 2, 3);
  await inspect(page, 'parchment');
  expect(await page.evaluate(() => (window as any).__dialogue.get('clauses'))).toBe(2);

  // back to the hall → it's empty → chapter end card
  await page.evaluate(() => (window as any).__player.setPosition(20 * 32 + 16, 7 * 32 - 4));
  await walk(page, 'd', 400);
  await finishDialogue(page);
  await page.waitForTimeout(900);
  await page.keyboard.down('d');
  await expect(dlg(page)).toContainText('empty', { timeout: 4000 });
  await page.keyboard.up('d');
  await finishDialogue(page);
  await expect(page.getByTestId('demo-end')).toContainText('Chapter One complete');

  // Continue → the forest (chapter 2 arrival fires on spawn)
  await page.getByTestId('card-continue').click();
  await expect(dlg(page)).toContainText('castle doors', { timeout: 5000 });
  await finishDialogue(page);
  await expect(page.getByTestId('objective')).toContainText('lantern');
  expect(errors).toEqual([]);
});

test('chapter 2 forest: lantern → tracks → stalker → G. note → burrows → Niffler → chapter end', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('new-game').click();
  await expect(dlg(page)).toBeVisible();
  await finishDialogue(page);

  // Jump to the end of chapter 1 (covered above).
  await page.evaluate(() => {
    const w = window as any;
    for (const v of ['met_snape', 'snape_bound', 'clue1', 'got_map', 'ch1_done', 'hall_empty_seen']) w.__dialogue.set(v, true);
    w.__dialogue.set('clauses', 2);
    w.__bus.emit('load-map', { map: 'forest', spawn: 'edge' });
  });
  await expect(dlg(page)).toContainText('castle doors', { timeout: 5000 });
  await finishDialogue(page);

  await standRightOf(page, 14, 18);
  await inspect(page, 'lantern');
  await expect(page.getByTestId('objective')).toContainText('tracks');
  await standRightOf(page, 10, 14);
  await inspect(page, 'Footprints');
  await standRightOf(page, 4, 9);
  await inspect(page, 'footprints');

  // stalker beat fires on walking into the north path
  await page.evaluate(() => (window as any).__player.setPosition(8 * 32 + 16, 6 * 32 - 4));
  await expect(dlg(page)).toContainText('lantern', { timeout: 3000 });
  await finishDialogue(page);
  expect(await page.evaluate(() => (window as any).__dialogue.get('lantern'))).toBe(2);

  await standBelow(page, 19, 4);
  await inspect(page, 'parchment');
  await standRightOf(page, 21, 5);
  await inspect(page, 'clearing');
  await expect(page.getByTestId('objective')).toContainText('burrows');

  await standBelow(page, 22, 3);
  await inspect(page, 'peer in');
  await standBelow(page, 28, 3);
  await inspect(page, 'peer in');
  await standBelow(page, 27, 6);
  await inspect(page, 'launches');
  await expect(page.getByTestId('objective')).toContainText('coin');

  await standBelow(page, 25, 5);
  await inspect(page, 'earrings'); // first choice = offer an earring
  expect(await page.evaluate(() => (window as any).__dialogue.get('clauses'))).toBe(3);

  await page.evaluate(() => (window as any).__player.setPosition(24 * 32 + 16, 3 * 32 - 4));
  await walk(page, 'w', 600);
  await expect(dlg(page)).toContainText('gavel', { timeout: 3000 });
  await finishDialogue(page);
  await expect(page.getByTestId('demo-end')).toContainText('Chapter Two complete');

  // Continue → the courtroom (chapter 3 arrival fires on spawn)
  await page.getByTestId('card-continue').click();
  await expect(dlg(page)).toContainText('gavel', { timeout: 5000 });
  await finishDialogue(page);
  await expect(page.getByTestId('objective')).toContainText('counsel');
  expect(errors).toEqual([]);
});

test('chapter 3 court: counsel → evidence → trial → objection duel → verdict', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('new-game').click();
  await expect(dlg(page)).toBeVisible();
  await finishDialogue(page);

  // Jump to the start of chapter 3 (chapters 1-2 covered above).
  await page.evaluate(() => {
    const w = window as any;
    for (const v of ['met_snape', 'snape_bound', 'got_map', 'ch1_done', 'coin4', 'ch2_done']) w.__dialogue.set(v, true);
    w.__dialogue.set('clauses', 3);
    w.__dialogue.set('fragments', 2);
    w.__bus.emit('load-map', { map: 'court', spawn: 'entry' });
  });
  await expect(dlg(page)).toContainText('gavel', { timeout: 5000 });
  await finishDialogue(page);

  await standBelow(page, 6, 6);
  await inspect(page, 'defence table');
  await expect(page.getByTestId('objective')).toContainText('evidence');
  await standBelow(page, 8, 6);
  await inspect(page, 'tagged exhibits');
  await standBelow(page, 2, 11);
  await inspect(page, 'step-stool');
  await expect(page.getByTestId('objective')).toContainText('bench');

  // the trial, then the duel: one wrong exhibit, then the right one each round
  await standBelow(page, 10, 3);
  await inspect(page, 'charges');
  await expect(page.getByTestId('puzzle')).toBeVisible();
  await page.keyboard.press('2');
  await expect(page.getByTestId('puzzle-quip')).toContainText('not relevant');
  for (const [key, next] of [['1', 'Next claim'], ['2', 'Next claim'], ['3', 'Hear the verdict']]) {
    await page.keyboard.press(key);
    await expect(page.getByTestId('objection')).toContainText(next);
    await page.keyboard.press('Enter');
  }
  await expect(page.getByTestId('puzzle')).toBeHidden({ timeout: 3000 });
  await expect(dlg(page)).toContainText('silent');
  await finishDialogue(page);
  expect(await page.evaluate(() => (window as any).__dialogue.get('clauses'))).toBe(4);
  await expect(page.getByTestId('demo-end')).toContainText('Chapter Three complete');

  // Continue → the multiverse rift (chapter 4 arrival fires on spawn)
  await page.getByTestId('card-continue').click();
  await expect(dlg(page)).toContainText('crack in the courtroom wall', { timeout: 5000 });
  await finishDialogue(page);
  await expect(page.getByTestId('objective')).toContainText('shards');
  expect(errors).toEqual([]);
});

test('chapter 4 rift: radar → web-zip → lanterns → core → chapter end', async ({ page }) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('new-game').click();
  await expect(dlg(page)).toBeVisible();
  await finishDialogue(page);

  await page.evaluate(() => {
    const w = window as any;
    for (const v of ['met_snape', 'snape_bound', 'got_map', 'ch1_done', 'ch2_done', 'ch3_done']) w.__dialogue.set(v, true);
    w.__dialogue.set('lantern', 2);
    w.__dialogue.set('clauses', 4);
    w.__dialogue.set('fragments', 3);
    w.__bus.emit('load-map', { map: 'rift', spawn: 'entry' });
  });
  await expect(dlg(page)).toContainText('crack in the courtroom wall', { timeout: 5000 });
  await finishDialogue(page);

  // Hell's Kitchen: Matt → radar → the shard appears by the parapet
  await standBelow(page, 5, 11);
  await inspect(page, 'black cloth mask');
  expect(await page.evaluate(() => (window as any).__dialogue.get('radar'))).toBe(true);
  await standBelow(page, 7, 14);
  await inspect(page, 'crystal shard');

  // Queens: Spider-Man → web-shooter → zip across the gap → shard
  await standBelow(page, 12, 4);
  await inspect(page, 'red-and-blue');
  await page.evaluate(() => (window as any).__player.setPosition(17 * 32 + 16, 5 * 32 - 4));
  await walk(page, 'd', 150);
  await page.waitForTimeout(250);
  await inspect(page, 'flick your wrist');
  await expect.poll(() => page.evaluate(() => Math.floor((window as any).__player.x / 32)), { timeout: 5000 }).toBe(21);
  await standBelow(page, 27, 4);
  await inspect(page, 'blue shard');

  // The tower: Rapunzel → three lanterns → gold shard
  await standBelow(page, 27, 11);
  await inspect(page, 'frying pan');
  for (const [x, y] of [[24, 10], [30, 10], [25, 14]]) {
    await standBelow(page, x, y);
    await inspect(page, 'lantern');
  }
  expect(await page.evaluate(() => (window as any).__dialogue.get('shards'))).toBe(3);
  await expect(page.getByTestId('objective')).toContainText('core');

  // Core → zero, clause 5, chapter card
  await standBelow(page, 15, 13);
  await inspect(page, 'sockets');
  expect(await page.evaluate(() => (window as any).__dialogue.get('clauses'))).toBe(5);
  await expect(page.getByTestId('demo-end')).toContainText('Chapter Four complete');
  expect(errors).toEqual([]);
});

/** Stand one tile above a floor-level object (e.g. a room's bottom door) and face it (down). */
async function standAbove(page: Page, tx: number, ty: number) {
  await page.evaluate(([x, y]) => (window as any).__player.setPosition(x * 32 + 16, y * 32 - 4), [tx, ty]);
  await page.keyboard.down('s');
  await page.waitForTimeout(120);
  await page.keyboard.up('s');
  await page.waitForTimeout(250);
}

test('chapter 5 haunted: nursery lens → tape → red door → date + mirror → Lily → chapter end', async ({ page }) => {
  test.setTimeout(150_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('new-game').click();
  await expect(dlg(page)).toBeVisible();
  await finishDialogue(page);

  await page.evaluate(() => {
    const w = window as any;
    for (const v of ['met_snape', 'snape_bound', 'got_map', 'ch1_done', 'ch2_done', 'ch3_done', 'ch4_done']) w.__dialogue.set(v, true);
    w.__dialogue.set('lantern', 2);
    w.__dialogue.set('clauses', 5);
    w.__dialogue.set('fragments', 4);
    w.__bus.emit('load-map', { map: 'haunted', spawn: 'entry' });
  });
  await expect(dlg(page)).toContainText('The Map led you here', { timeout: 5000 });
  await finishDialogue(page);
  const tileY = () => page.evaluate(() => Math.floor((window as any).__player.y / 32));

  // Nursery: the fogged mirror turns her glasses into a lens; "14" under the window.
  await standBelow(page, 15, 12);
  await inspect(page, 'music box');
  await expect.poll(tileY, { timeout: 5000 }).toBe(7);
  await standBelow(page, 14, 2);
  await inspect(page, 'fogged');
  expect(await page.evaluate(() => (window as any).__dialogue.get('lens'))).toBe(true);
  await standBelow(page, 18, 2);
  await inspect(page, 'glasses catch');
  await standAbove(page, 15, 9);
  await inspect(page, 'corridor');
  await expect.poll(tileY, { timeout: 5000 }).toBe(13);

  // TV room: the tape, then the "10" the lens can see.
  await standBelow(page, 5, 12);
  await inspect(page, 'Blue light');
  await expect.poll(tileY, { timeout: 5000 }).toBe(7);
  await standBelow(page, 3, 4);
  await inspect(page, 'VCR');
  await standBelow(page, 7, 2);
  await inspect(page, 'Scratched into');
  await standAbove(page, 5, 9);
  await inspect(page, 'corridor');
  await expect(page.getByTestId('objective')).toContainText('middle door');

  // Room swap: the middle door is red now → the Red Room.
  await expect.poll(tileY, { timeout: 5000 }).toBe(13);
  await standBelow(page, 15, 12);
  await inspect(page, 'red');
  await expect(dlg(page)).toContainText('Red. The walls', { timeout: 5000 });
  await finishDialogue(page);
  await standBelow(page, 24, 2);
  await inspect(page, '14 · 10');
  await standBelow(page, 28, 2);
  await inspect(page, 'tall mirror');
  await standBelow(page, 26, 2);
  await page.keyboard.press('e');
  await expect(dlg(page)).toContainText('outline brightens');
  await finishDialogue(page);

  // The Room of Hidden Things: Lily, clause 6, chapter card.
  await expect(dlg(page)).toContainText('Warm', { timeout: 5000 });
  await finishDialogue(page, 120);
  expect(await page.evaluate(() => (window as any).__dialogue.get('clauses'))).toBe(6);
  await expect(page.getByTestId('demo-end')).toContainText('Chapter Five complete');
  expect(errors).toEqual([]);
});

test('finale: chest code 1410 → fireworks + banner → G. reveal → stats → message → credits', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByTestId('new-game').click();
  await expect(dlg(page)).toBeVisible();
  await finishDialogue(page);

  await page.evaluate(() => {
    const w = window as any;
    for (const v of ['met_snape', 'snape_bound', 'got_map', 'ch1_done', 'ch2_done', 'ch3_done', 'ch4_done', 'ch5_done']) w.__dialogue.set(v, true);
    w.__dialogue.set('clauses', 6);
    w.__dialogue.set('fragments', 4);
    w.__bus.emit('load-map', { map: 'tower', spawn: 'entry' });
  });
  await expect(dlg(page)).toContainText('open air', { timeout: 5000 });
  await finishDialogue(page);

  // The chest: a wrong try, then her birthday.
  await standBelow(page, 11, 5);
  await inspect(page, 'four wheels');
  await expect(page.getByTestId('puzzle')).toBeVisible();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('puzzle-quip')).toContainText('No.');
  await page.keyboard.type('1410');
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('puzzle')).toBeHidden({ timeout: 3000 });
  await expect(dlg(page)).toContainText('lock clicks open');
  await finishDialogue(page, 150);
  await expect(page.getByTestId('birthday-banner')).toContainText('Happy Birthday, Ishu');
  expect(await page.evaluate(() => (window as any).__dialogue.get('hood_down'))).toBe(true);

  await expect(page.getByTestId('finale-stats')).toContainText("A normal person's time");
  await page.getByTestId('finale-next').click();
  await expect(page.getByTestId('finale-message')).toBeVisible();
  await page.getByTestId('finale-next').click();
  await expect(page.getByTestId('finale-end')).toContainText('Made for Ishu');
  expect(errors).toEqual([]);
});
