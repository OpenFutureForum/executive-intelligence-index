import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://openfutureforum.github.io',
  base: '/executive-intelligence-index',
  outDir: './docs',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } }
});
