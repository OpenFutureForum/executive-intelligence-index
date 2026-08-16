import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/build',
  webServer: {
    command: 'node scripts/serve-docs.mjs',
    port: 4173,
    reuseExistingServer: true
  },
  use: { baseURL: 'http://127.0.0.1:4173/executive-intelligence-index/', headless: true }
});
