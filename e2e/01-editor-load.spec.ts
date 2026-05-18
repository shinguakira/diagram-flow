import { test, expect } from '@playwright/test';
import { gotoEditor, saveScreenshot, toolbar } from './helpers';

test.describe('Editor page load', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage so each test starts from a clean state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('shows toolbar and empty canvas hint', async ({ page }) => {
    await gotoEditor(page);

    // Toolbar buttons are present
    await expect(toolbar.save(page)).toBeVisible();
    await expect(toolbar.load(page)).toBeVisible();
    await expect(toolbar.undo(page)).toBeVisible();
    await expect(toolbar.redo(page)).toBeVisible();
    await expect(toolbar.addNode(page)).toBeVisible();
    await expect(toolbar.clear(page)).toBeVisible();

    // Empty canvas shows the help hint
    await expect(page.getByText('Click anywhere to create a node')).toBeVisible();

    await saveScreenshot(page, '01-empty-editor.png');
  });

  test('undo and redo are disabled on empty canvas', async ({ page }) => {
    await gotoEditor(page);
    await expect(toolbar.undo(page)).toBeDisabled();
    await expect(toolbar.redo(page)).toBeDisabled();
  });
});
