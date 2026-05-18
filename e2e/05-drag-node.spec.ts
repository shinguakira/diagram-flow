import { test, expect } from '@playwright/test';
import { gotoEditor, saveScreenshot, toolbar, CANVAS_SELECTOR } from './helpers';

test.describe('Node dragging', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await gotoEditor(page);
  });

  test('dragging a node changes its position', async ({ page }) => {
    const svg = page.locator(CANVAS_SELECTOR);
    await toolbar.addNode(page).click();

    const rect = svg.locator('rect').first();
    const box = await rect.boundingBox();
    expect(box).not.toBeNull();

    const startX = box!.x + box!.width / 2;
    const startY = box!.y + box!.height / 2;
    const endX = startX + 150;
    const endY = startY + 100;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(endX, endY, { steps: 10 });
    await page.mouse.up();

    const movedBox = await rect.boundingBox();
    expect(movedBox).not.toBeNull();
    // The node should have moved noticeably
    expect(Math.abs(movedBox!.x - box!.x)).toBeGreaterThan(50);

    await saveScreenshot(page, '11-node-dragged.png');
  });
});
