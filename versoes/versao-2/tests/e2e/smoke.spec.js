import { expect, test } from '@playwright/test';

// Smoke: roda a cada deploy (homologação e produção). Abre o jogo e chega à primeira pergunta.
test('abre o jogo, mostra a versão e inicia a primeira pergunta', async ({ page }) => {
  await page.goto('./');
  await expect(page.locator('h1')).toContainText('BITLHÃO');
  await expect(page.locator('div.chip', { hasText: /^v\d/ })).toBeVisible();
  await page.click('#go');
  await expect(page.locator('.qbox h2')).toBeVisible();
  await expect(page.locator('.opt').first()).toBeVisible();
});
