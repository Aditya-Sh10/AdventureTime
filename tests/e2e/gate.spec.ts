import { expect, test } from '@playwright/test';

/** The front door: only 4'11" gets in; wrong heights are teased; then the cozy title + settings work. */
test('height gate → cozy title → settings', async ({ page }) => {
  test.setTimeout(60_000);
  const shots = process.env.SHOT_DIR;
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  const gate = page.getByTestId('height-gate');
  const height = page.getByTestId('gate-height');
  await expect(gate).toBeVisible();
  await expect(height).toHaveText(`5'4"`);
  if (shots) await page.screenshot({ path: `${shots}/01-gate.png` });

  // Lie: 5'4" → teased, still locked.
  await page.getByTestId('gate-submit').click();
  await expect(page.getByTestId('gate-tease')).toBeVisible();
  await expect(gate).toBeVisible();
  if (shots) await page.screenshot({ path: `${shots}/02-gate-tease.png` });

  // Too short: arrow keys move the pencil from anywhere on the gate.
  await page.getByRole('slider', { name: /height/i }).focus();
  for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowDown');
  await expect(height).toHaveText(`4'6"`);
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('gate-tease')).toBeVisible();
  await page.getByTestId('gate-submit').click(); // third wrong try → Lily's paw-print hint
  if (shots) await page.screenshot({ path: `${shots}/03-gate-hint.png` });

  // The truth.
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowUp');
  await expect(height).toHaveText(`4'11"`);
  await page.getByTestId('gate-submit').click();
  if (shots) {
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${shots}/04-gate-open.png` });
  }
  await expect(gate).toBeHidden({ timeout: 8000 });

  // Title: the letter menu over the window seat.
  await expect(page.getByTestId('new-game')).toBeVisible();
  await page.waitForTimeout(1500);
  if (shots) await page.screenshot({ path: `${shots}/05-title.png` });
  await page.keyboard.press('ArrowDown');
  await expect(page.getByTestId('settings')).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByTestId('settings-panel')).toBeVisible();
  await page.waitForTimeout(500);
  if (shots) await page.screenshot({ path: `${shots}/06-settings.png` });
  const music = page.getByRole('slider', { name: 'Music' });
  await music.focus();
  const before = Number(await music.getAttribute('aria-valuenow'));
  await page.keyboard.press('ArrowLeft');
  await expect(music).toHaveAttribute('aria-valuenow', String(before - 10));
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('new-game')).toBeVisible();

  // Reload in the same session: the door remembers her.
  await page.reload();
  await expect(page.getByTestId('new-game')).toBeVisible();
  await expect(gate).toBeHidden();
  expect(errors).toEqual([]);
});
