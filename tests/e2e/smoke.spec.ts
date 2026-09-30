import { expect, test } from '@playwright/test';

type P = { x: number; y: number };
const pos = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const p = (window as unknown as { __player: P }).__player;
    return { x: p.x, y: p.y };
  });

test('boots, moves, opens dialogue', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.getByTestId('new-game').click();
  await page.waitForFunction(() => 'hidden' !== document.visibilityState && !!(window as any).__player);

  const a = await pos(page);
  await page.keyboard.down('d');
  await page.waitForTimeout(400);
  await page.keyboard.up('d');
  const b = await pos(page);
  expect(b.x).toBeGreaterThan(a.x + 10);

  // walk to sign (9*32, 6*32) from spawn: teleport for determinism
  await page.evaluate(() => {
    const p = (window as any).__player;
    p.setPosition(9 * 32, 6 * 32 + 30);
  });
  await page.waitForTimeout(100);
  await page.keyboard.press('e');
  await expect(page.getByTestId('dialogue')).toBeVisible();
  const box = page.getByTestId('dialogue');
  await expect(box).toContainText('Snape');

  // skip typewriter + advance until choices appear, pick 2, close
  for (let i = 0; i < 8 && !(await box.getByRole('button').count()); i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(80);
  }
  await page.keyboard.press('2');
  await expect(box).toContainText('discarded');
  await page.keyboard.press('Space'); // finish typewriter
  await page.keyboard.press('Space'); // close
  await expect(box).toBeHidden();
  await page.waitForTimeout(300);
  await expect(box).toBeHidden(); // did not instantly re-open
  expect(errors).toEqual([]);
});
