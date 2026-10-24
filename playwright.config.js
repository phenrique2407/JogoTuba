import { defineConfig } from '@playwright/test';

const base = process.env.BASE_URL; // homologação, release ou produção; sem ela, sobe o dist/ local
export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['junit', { outputFile: 'reports/e2e-junit.xml' }]],
  use: { baseURL: (base ?? 'http://127.0.0.1:4173/').replace(/\/?$/, '/'), headless: true, reducedMotion: 'reduce' },
  webServer: base ? undefined : { command: 'npx serve dist -l 4173', url: 'http://127.0.0.1:4173/', reuseExistingServer: true },
});
