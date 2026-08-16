import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['.astro/**', 'docs/**', 'node_modules/**', 'exports/**'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,ts,mts,cts}'],
    languageOptions: { globals: { process: 'readonly', URL: 'readonly', Buffer: 'readonly', console: 'readonly', fetch: 'readonly', AbortSignal: 'readonly' } }
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' }
  }
);
