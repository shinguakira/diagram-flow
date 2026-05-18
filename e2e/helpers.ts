import { Page, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SCREENSHOTS_DIR = path.join(__dirname, 'screenshots');

/** Selector for the diagram canvas SVG element. */
export const CANVAS_SELECTOR = 'svg.cursor-crosshair';

/** Navigate to the editor page and wait for it to be ready. */
export async function gotoEditor(page: Page) {
  await page.goto('/editor');
  await expect(page.locator(CANVAS_SELECTOR)).toBeVisible();
}

/** Click an empty area of the SVG canvas to create a node at (x, y). */
export async function clickCanvas(page: Page, x: number, y: number) {
  const svg = page.locator(CANVAS_SELECTOR);
  await svg.click({ position: { x, y } });
}

/** Save a named screenshot to the screenshots directory. */
export async function saveScreenshot(page: Page, filename: string) {
  await page.screenshot({
    path: path.join(SCREENSHOTS_DIR, filename),
    fullPage: false,
  });
}

/** Toolbar button locators by aria-label / tooltip text. */
export const toolbar = {
  save:    (page: Page) => page.getByRole('button', { name: 'Save diagram' }),
  load:    (page: Page) => page.getByRole('button', { name: 'Load diagram' }),
  undo:    (page: Page) => page.getByRole('button', { name: 'Undo' }),
  redo:    (page: Page) => page.getByRole('button', { name: 'Redo' }),
  addNode: (page: Page) => page.getByRole('button', { name: 'Add node' }),
  clear:   (page: Page) => page.getByRole('button', { name: 'Clear diagram' }),
};
