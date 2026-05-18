import { test, expect } from '@playwright/test';
import { gotoEditor, clickCanvas, saveScreenshot, toolbar, CANVAS_SELECTOR } from './helpers';

test.describe('Adding nodes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await gotoEditor(page);
  });

  test('clicking empty canvas creates a node', async ({ page }) => {
    const svg = page.locator(CANVAS_SELECTOR);
    const box = await svg.boundingBox();
    expect(box).not.toBeNull();

    // Click near the center of the canvas
    await clickCanvas(page, box!.width / 2, box!.height / 2);

    // A rect (node) should appear in the SVG
    await expect(svg.locator('rect')).toHaveCount(1);
    // The node label text should be visible
    await expect(svg.locator('text').filter({ hasText: 'New Node' })).toBeVisible();

    // Empty hint should be gone
    await expect(page.getByText('Click anywhere to create a node')).not.toBeVisible();

    await saveScreenshot(page, '02-single-node.png');
  });

  test('toolbar Add Node button creates a node', async ({ page }) => {
    await toolbar.addNode(page).click();
    const svg = page.locator(CANVAS_SELECTOR);
    await expect(svg.locator('rect')).toHaveCount(1);

    await saveScreenshot(page, '03-node-via-toolbar.png');
  });

  test('multiple nodes can be added', async ({ page }) => {
    const svg = page.locator(CANVAS_SELECTOR);
    const box = await svg.boundingBox();
    expect(box).not.toBeNull();

    await clickCanvas(page, 200, 200);
    await clickCanvas(page, 500, 200);
    await clickCanvas(page, 350, 400);

    await expect(svg.locator('rect')).toHaveCount(3);

    await saveScreenshot(page, '04-multiple-nodes.png');
  });

  test('undo removes the last added node', async ({ page }) => {
    const svg = page.locator(CANVAS_SELECTOR);
    await toolbar.addNode(page).click();
    await expect(svg.locator('rect')).toHaveCount(1);

    await toolbar.undo(page).click();
    await expect(svg.locator('rect')).toHaveCount(0);
    await expect(page.getByText('Click anywhere to create a node')).toBeVisible();
  });

  test('redo restores an undone node', async ({ page }) => {
    const svg = page.locator(CANVAS_SELECTOR);
    await toolbar.addNode(page).click();
    await toolbar.undo(page).click();
    await expect(svg.locator('rect')).toHaveCount(0);

    await toolbar.redo(page).click();
    await expect(svg.locator('rect')).toHaveCount(1);

    await saveScreenshot(page, '05-undo-redo.png');
  });
});
