import js from '@eslint/js';

const globals = Object.fromEntries(['window', 'document', 'localStorage', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'console', 'process', 'URL', 'fetch', 'navigator', 'location', '__VERSION__'].map((g) => [g, 'readonly']));

export default [
  { ignores: ['dist/**', 'coverage/**', 'reports/**', 'node_modules/**', 'test-results/**', 'playwright-report/**'] },
  js.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2022, sourceType: 'module', globals },
    rules: { 'no-sparse-arrays': 'off', 'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }], 'no-empty': 'off' },
  },
];
