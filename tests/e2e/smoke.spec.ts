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
  expect(errors).toEqual([]);
});
