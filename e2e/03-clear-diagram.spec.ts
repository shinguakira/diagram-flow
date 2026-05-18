import { test, expect } from '@playwright/test';
import { gotoEditor, saveScreenshot, toolbar, CANVAS_SELECTOR } from './helpers';

test.describe('Clear diagram', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await gotoEditor(page);
  });

  test('clear button opens confirmation dialog', async ({ page }) => {
    await toolbar.addNode(page).click();
    await toolbar.clear(page).click();

    const dialog = page.getByRole('alertdialog').or(page.getByRole('dialog'));
    await expect(dialog).toBeVisible();
    await expect(page.getByText('Clear Diagram')).toBeVisible();

    await saveScreenshot(page, '06-clear-dialog.png');
  });

  test('confirming clear removes all nodes', async ({ page }) => {
    const svg = page.locator(CANVAS_SELECTOR);
    await toolbar.addNode(page).click();
    await toolbar.addNode(page).click();
    await expect(svg.locator('rect')).toHaveCount(2);

    await toolbar.clear(page).click();
    await page.getByRole('button', { name: 'Clear' }).click();

    await expect(svg.locator('rect')).toHaveCount(0);
    await expect(page.getByText('Click anywhere to create a node')).toBeVisible();

    await saveScreenshot(page, '07-after-clear.png');
  });

  test('cancelling clear keeps nodes intact', async ({ page }) => {
    const svg = page.locator(CANVAS_SELECTOR);
    await toolbar.addNode(page).click();

    await toolbar.clear(page).click();
    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(svg.locator('rect')).toHaveCount(1);
  });
});
