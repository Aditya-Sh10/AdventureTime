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
