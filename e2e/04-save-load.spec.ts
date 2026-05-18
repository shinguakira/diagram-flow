import { test, expect } from '@playwright/test';
import { gotoEditor, saveScreenshot, toolbar, CANVAS_SELECTOR } from './helpers';

test.describe('Save and Load', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await gotoEditor(page);
  });

  test('save shows success toast', async ({ page }) => {
    await toolbar.addNode(page).click();
    await toolbar.save(page).click();

    await expect(page.getByText('Diagram saved to local storage!')).toBeVisible();

    await saveScreenshot(page, '08-save-toast.png');
  });

  test('load with no saved data shows info toast', async ({ page }) => {
    await toolbar.load(page).click();
    await expect(page.getByText('No saved diagram found')).toBeVisible();
  });

  test('saved nodes are restored after reload', async ({ page }) => {
    const svg = page.locator(CANVAS_SELECTOR);

    // Add 2 nodes and save
    await toolbar.addNode(page).click();
    await toolbar.addNode(page).click();
    await expect(svg.locator('rect')).toHaveCount(2);
    await toolbar.save(page).click();

    // Reload the page
    await page.reload();
    await expect(svg.locator('rect')).toHaveCount(2);

    await saveScreenshot(page, '09-restored-after-reload.png');
  });

  test('load button restores saved diagram', async ({ page }) => {
    const svg = page.locator(CANVAS_SELECTOR);

    // Save a diagram with nodes
    await toolbar.addNode(page).click();
    await toolbar.save(page).click();

    // Clear and verify empty
    await toolbar.clear(page).click();
    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(svg.locator('rect')).toHaveCount(0);

    // Load and verify nodes come back
    await toolbar.load(page).click();
    await expect(svg.locator('rect')).toHaveCount(1);
    await expect(page.getByText('Diagram loaded from local storage!')).toBeVisible();

    await saveScreenshot(page, '10-load-success.png');
  });
});
