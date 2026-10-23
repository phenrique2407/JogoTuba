import { describe, expect, it } from 'vitest';
import { calcPoints } from '../../src/core/game.js';
import { mkC, mkG } from '../helpers.js';

const q = (d, t = 'm') => ({ d, t });
describe('calcPoints', () => {
  it('fácil com o tempo cheio: 100 × 1 × bônus 2 = 200', () => {
    expect(calcPoints(mkG(), mkC({ q: q(0) }))).toBe(200);
  });
  it('multiplica pela dificuldade (sem bônus de tempo): ×1, ×1,5 e ×2', () => {
    expect(calcPoints(mkG(), mkC({ q: q(0), t: 0 }))).toBe(100);
    expect(calcPoints(mkG(), mkC({ q: q(1), t: 0 }))).toBe(150);
    expect(calcPoints(mkG(), mkC({ q: q(2), t: 0 }))).toBe(200);
  });
  it('bônus de velocidade é proporcional ao tempo restante', () => {
    expect(calcPoints(mkG(), mkC({ q: q(0), t: 17.5 }))).toBe(150);
  });
  it('pergunta rápida vale pontos fixos, sem bônus de tempo', () => {
    expect(calcPoints(mkG(), mkC({ quick: true, fixed: 50, t: 35 }))).toBe(50);
  });
  it('passivas: +% geral, V/F e difícil', () => {
    const G = mkG({ pas: [{ f: 'pts', v: 10 }, { f: 'tf', v: 20 }, { f: 'hard', v: 50 }] });
    expect(calcPoints(G, mkC({ q: q(0), t: 0 }))).toBe(110);
    expect(calcPoints(G, mkC({ q: q(0, 't'), t: 0 }))).toBe(130);
    expect(calcPoints(G, mkC({ q: q(2), t: 0 }))).toBe(320);
  });
  it('combo cresce com a sequência de acertos (limite de 10)', () => {
    const G = mkG({ pas: [{ f: 'combo', v: 4 }], st: 5 });
    expect(calcPoints(G, mkC({ q: q(0), t: 0 }))).toBe(120);
    G.st = 99;
    expect(calcPoints(G, mkC({ q: q(0), t: 0 }))).toBe(140);
  });
  it('jackpot multiplica só no 7º acerto', () => {
    const G = mkG({ pas: [{ f: 'jp', v: 3 }], ok: 5 });
    expect(calcPoints(G, mkC({ q: q(0), t: 0 }))).toBe(100);
    G.ok = 6;
    expect(calcPoints(G, mkC({ q: q(0), t: 0 }))).toBe(300);
  });
  it('cofrinho soma pontos fixos e a carta ×2 dobra a pergunta', () => {
    expect(calcPoints(mkG({ pas: [{ f: 'bank', v: 25 }] }), mkC({ q: q(0), t: 0 }))).toBe(125);
    expect(calcPoints(mkG(), mkC({ q: q(0), t: 0, mult: 2 }))).toBe(200);
  });
});
