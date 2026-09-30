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
  test.setTimeout(120_000);
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
});
