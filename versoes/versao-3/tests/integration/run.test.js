import { describe, expect, it } from 'vitest';
import cards from '../../src/content/cards.json';
import questions from '../../src/content/questions.json';
import { offer, takeCard, unlockHand } from '../../src/core/cards.js';
import { blockDifficulty, calcPoints, isOver, newGame, resolveWrong, useActive } from '../../src/core/game.js';
import { buildBank, createPicker } from '../../src/core/questions.js';
import { seeded } from '../helpers.js';

describe('partida completa simulada (núcleo + conteúdo real)', () => {
  it('roguelike puro: dois acertos para cada erro até as vidas acabarem, com cartas a cada 5 turnos', () => {
    const rng = seeded(21), bank = buildBank(questions.raw, questions.facts, rng);
    const pick = createPicker(bank, new Set(), { rng });
    const G = newGame({ theme: 4, diff: 1 });
    let escolhas = 0, guardouAtivavel = false;
    while (!isOver(G) && G.turn < 500) {
      G.turn++;
      const q = pick(G, blockDifficulty(G.turn, rng));
      G.c = { q, rem: [], shield: false, mult: 1, pct: 0, quick: false, fixed: 0, t: G.lim, lim: G.lim, done: false, rev: false };
      if (G.hand.length && rng() < 0.5) { useActive(G, 0, { pickQ: (d, tf) => pick(G, d, tf), catalog: cards, rng }); guardouAtivavel = true; }
      if (G.turn % 3 !== 0) { G.score += calcPoints(G, G.c); G.ok++; G.st++; } else { resolveWrong(G, G.c, rng); G.st = 0; }
      G.c.done = true;
      if (!isOver(G) && G.turn % 5 === 0) { unlockHand(G); takeCard(G, offer(cards, rng)[0]); escolhas++; }
    }
    expect(isOver(G)).toBe(true);
    expect(G.turn).toBeLessThan(500);
    expect(G.score).toBeGreaterThan(0);
    expect(escolhas).toBeGreaterThanOrEqual(1);
    expect(typeof guardouAtivavel).toBe('boolean');
  });
});
