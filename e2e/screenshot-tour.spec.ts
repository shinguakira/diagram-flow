/**
 * Screenshot tour for README / user manual.
 * Run with: npm run e2e:screenshots
 * Output: e2e/screenshots/
 */
import { test } from '@playwright/test';
import { gotoEditor, saveScreenshot, toolbar, clickCanvas, CANVAS_SELECTOR } from './helpers';

test.use({ viewport: { width: 1280, height: 800 } });

test('screenshot tour', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());

  // 1. Empty editor
  await gotoEditor(page);
  await saveScreenshot(page, 'tour-01-empty-editor.png');

  // 2. One node added via toolbar
  await toolbar.addNode(page).click();
  await saveScreenshot(page, 'tour-02-first-node.png');

  // 3. Multiple nodes added by clicking canvas
  const svg = page.locator(CANVAS_SELECTOR);
  const box = await svg.boundingBox();
  if (box) {
    await clickCanvas(page, box.width * 0.7, box.height * 0.3);
    await clickCanvas(page, box.width * 0.3, box.height * 0.7);
    await clickCanvas(page, box.width * 0.7, box.height * 0.7);
  }
  await saveScreenshot(page, 'tour-03-multiple-nodes.png');

  // 4. After undo (remove last node)
  await toolbar.undo(page).click();
  await saveScreenshot(page, 'tour-04-after-undo.png');

  // 5. After redo
  await toolbar.redo(page).click();
  await saveScreenshot(page, 'tour-05-after-redo.png');

  // 6. Save toast
  await toolbar.save(page).click();
  await page.waitForSelector('text=Diagram saved to local storage!', { timeout: 3000 });
  await saveScreenshot(page, 'tour-06-save-toast.png');

  // 7. Clear confirmation dialog
  await toolbar.clear(page).click();
  await page.waitForSelector('text=Clear Diagram', { timeout: 3000 });
  await saveScreenshot(page, 'tour-07-clear-dialog.png');

  // Dismiss the dialog
  await page.getByRole('button', { name: 'Cancel' }).click();

  // 8. Load from storage
  await toolbar.load(page).click();
  await page.waitForSelector('text=Diagram loaded from local storage!', { timeout: 3000 });
  await saveScreenshot(page, 'tour-08-load-success.png');
});
