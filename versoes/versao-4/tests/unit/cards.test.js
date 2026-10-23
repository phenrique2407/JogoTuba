import { describe, expect, it } from 'vitest';
import cards from '../../src/content/cards.json';
import { offer, passiveSum, takeCard, unlockHand } from '../../src/core/cards.js';
import { mkG, seq } from '../helpers.js';

describe('catálogo', () => {
  it('tem as 4 raridades e os dois tipos (passiva e ativável)', () => {
    expect(new Set(cards.map((c) => c.r))).toEqual(new Set(['c', 'r', 'e', 'l']));
    expect(new Set(cards.map((c) => c.k))).toEqual(new Set(['p', 'a']));
    expect(cards.length).toBeGreaterThanOrEqual(50);
  });
});
describe('offer', () => {
  it('oferece 3 cartas distintas', () => {
    const o = offer(cards);
    expect(o).toHaveLength(3);
    expect(new Set(o).size).toBe(3);
  });
  it('sorteia a raridade pelos pesos fixos 60/25/10/5', () => {
    // pares (raridade, índice): 0,0 -> comum; 0.99,0 -> lendária; 0.7,0 -> rara
    const o = offer(cards, seq(0, 0, 0.99, 0, 0.7, 0));
    expect(o.map((c) => c.r)).toEqual(['c', 'l', 'r']);
  });
  it('cartas podem se repetir entre ofertas (sorteio não exclui as já escolhidas)', () => {
    const a = offer(cards, seq(0, 0, 0.99, 0, 0.7, 0)), b = offer(cards, seq(0, 0, 0.99, 0, 0.7, 0));
    expect(a[0]).toBe(b[0]);
  });
});
describe('takeCard / passiveSum / unlockHand', () => {
  it('passiva vai para a run toda; ativável fica guardada', () => {
    const G = mkG();
    takeCard(G, { k: 'p', f: 'pts', v: 5 });
    takeCard(G, { k: 'a', f: 'x2', v: 2 });
    expect(G.pas).toHaveLength(1);
    expect(G.hand).toHaveLength(1);
  });
  it('soma passivas repetidas da mesma família', () => {
    expect(passiveSum([{ f: 'pts', v: 5 }, { f: 'pts', v: 10 }, { f: 'tf', v: 1 }], 'pts')).toBe(15);
  });
  it('nova escolha de cartas destrava as ativáveis', () => {
    const G = mkG({ lock: true });
    unlockHand(G);
    expect(G.lock).toBe(false);
  });
});
