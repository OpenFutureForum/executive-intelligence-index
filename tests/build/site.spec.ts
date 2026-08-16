import { test, expect } from '@playwright/test';
const browserTest = process.env.CODEX_SANDBOX === 'seatbelt' ? test.skip : test;

browserTest('home page is substantive and accessible by landmarks', async ({ page }) => {
  await page.goto('./');
  await expect(page).toHaveTitle(/Open Executive Intelligence Index/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Trace executive ideas');
  await expect(page.getByRole('navigation', { name: 'Primary navigation' })).toBeVisible();
  await expect(page.getByRole('main')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

browserTest('collection filtering and truthful empty state work', async ({ page }) => {
  await page.goto('people/');
  await expect(page.getByLabel('Search this collection')).toBeVisible();
  await expect(page.getByText(/No people have passed publication review yet/)).toBeVisible();
});

test('public discovery and release artifacts exist without fixtures', async ({ request }) => {
  for (const item of ['robots.txt','sitemap-index.xml','feed.xml','data/catalog.json','data/release-manifest.json','pagefind/pagefind.js']) expect((await request.get(item)).ok(), item).toBe(true);
  const catalog = await (await request.get('data/catalog.json')).text();
  expect(catalog).not.toContain('fix-person-'); expect(catalog).not.toContain('staging/batches');
});

test('approved pilot counts and readable source evidence agree', async ({ request }) => {
  const catalog = await (await request.get('data/catalog.json')).json();
  expect(catalog.generated_for_release).toBe('0.2.0');
  expect(catalog.records['book-works']).toHaveLength(8);
  expect(catalog.records['book-editions']).toHaveLength(11);
  expect(catalog.records.sources).toHaveLength(20);
  expect(catalog.records.statements).toHaveLength(100);
  expect(catalog.records.propositions).toHaveLength(0);
  const sourcePage = await request.get('sources/source-BATCH-2026-005-009/');
  expect(sourcePage.ok()).toBe(true);
  expect(await sourcePage.text()).toContain('Source-located statements');
});
