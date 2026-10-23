import { describe, expect, it } from 'vitest';
import { pickWeighted, shuffle } from '../../src/core/weighted.js';
import { seeded, seq } from '../helpers.js';

describe('pickWeighted', () => {
  it('escolhe o índice conforme a faixa sorteada', () => {
    const w = [60, 25, 10, 5];
    expect(pickWeighted(w, seq(0))).toBe(0);
    expect(pickWeighted(w, seq(0.61))).toBe(1);
    expect(pickWeighted(w, seq(0.86))).toBe(2);
    expect(pickWeighted(w, seq(0.97))).toBe(3);
  });
  it('devolve o último índice quando o sorteio chega a 1', () => {
    expect(pickWeighted([1, 1, 1], seq(1))).toBe(2);
  });
  it('respeita a proporção dos pesos (60/25/10/5) em muitos sorteios', () => {
    const rng = seeded(7), c = [0, 0, 0, 0], N = 20000;
    for (let i = 0; i < N; i++) c[pickWeighted([60, 25, 10, 5], rng)]++;
    expect(c[0] / N).toBeGreaterThan(0.57);
    expect(c[0] / N).toBeLessThan(0.63);
    expect(c[3] / N).toBeLessThan(0.07);
  });
});

describe('shuffle', () => {
  it('mantém os elementos e não altera o original', () => {
    const a = [1, 2, 3, 4], b = shuffle(a, seeded(3));
    expect([...b].sort()).toEqual([1, 2, 3, 4]);
    expect(a).toEqual([1, 2, 3, 4]);
  });
  it('é determinístico com o mesmo rng', () => {
    expect(shuffle([1, 2, 3], seq(0.3, 0.1, 0.2))).toEqual([2, 3, 1]);
  });
});
