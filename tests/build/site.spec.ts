import { test, expect } from '@playwright/test';
const browserTest = process.env.CODEX_SANDBOX === 'seatbelt' ? test.skip : test;

browserTest('home page is substantive and accessible by landmarks', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Open Executive Intelligence Index/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Trace executive ideas');
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

browserTest('collection filtering and truthful empty state work', async ({ page }) => {
  await page.goto('/people/');
  await expect(page.getByLabel('Search this collection')).toBeVisible();
  await expect(page.getByText(/No people have passed publication review yet/)).toBeVisible();
});

test('public discovery and release artifacts exist without fixtures', async ({ request }) => {
  for (const item of ['/robots.txt','/sitemap-index.xml','/feed.xml','/data/catalog.json','/data/release-manifest.json','/pagefind/pagefind.js']) expect((await request.get(item)).ok(), item).toBe(true);
  const catalog = await (await request.get('/data/catalog.json')).text();
  expect(catalog).not.toContain('fix-person-'); expect(catalog).not.toContain('staging/batches');
});
