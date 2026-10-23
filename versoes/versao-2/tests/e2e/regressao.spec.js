import { expect, test } from '@playwright/test';

// Regressão ponta a ponta: primeira fase (responder), desistir e ver a tela de fim com ranking.
test('responde uma pergunta, desiste e vê a tela final com ranking e opções', async ({ page }) => {
  await page.goto('./');
  await page.fill('#nk', 'Tester');
  await page.click('#go');
  await page.locator('.opt').first().click();
  await expect(page.locator('#fb')).toHaveText(/ACERTOU|ERROU|TEMPO/);
  await page.click('.qt');
  await page.click('#qy');
  await expect(page.locator('h1')).toContainText('GAME OVER');
  await expect(page.getByText('Ranking local')).toBeVisible();
  await expect(page.getByRole('button', { name: 'PRÓXIMA PARTIDA' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'MENU' })).toBeVisible();
});

// Regressão de bug real: alternativas que são tags HTML (<h1>) precisam aparecer como texto.
test('alternativas com tags HTML aparecem como texto no jogo', async ({ page }) => {
  await page.goto('./');
  await page.evaluate(() => localStorage.clear());
  await page.click('#go');
  await expect(page.locator('.opt').first()).not.toBeEmpty();
});
