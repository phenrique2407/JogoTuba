import { describe, expect, it } from 'vitest';
import cards from '../../src/content/cards.json';
import { blockDifficulty, isOver, newGame, resolveWrong, useActive } from '../../src/core/game.js';
import { mkC, mkG, seq } from '../helpers.js';

const card = (f, r = 'c') => cards.find((c) => c.f === f && c.r === r);
const use = (G, i = 0, extra = {}) => useActive(G, i, { pickQ: () => ({ d: 0, t: 't', o: ['V', 'F'], a: 0 }), catalog: cards, ...extra });

describe('partida', () => {
  it('começa com 3 vidas e o tempo por dificuldade (35/25/15 s)', () => {
    expect(newGame({ diff: 0 })).toMatchObject({ lives: 3, lim: 35 });
    expect(newGame({ diff: 1 }).lim).toBe(25);
    expect(newGame({ diff: 2 }).lim).toBe(15);
  });
  it('só termina com vidas zeradas, mesmo com ativável guardada', () => {
    const G = newGame();
    G.hand.push(card('x2'));
    expect(isOver(G)).toBe(false);
    G.lives = 0;
    expect(isOver(G)).toBe(true);
  });
  it('a dificuldade sobe a cada bloco de 5 turnos', () => {
    expect(blockDifficulty(1, seq(0.99))).toBe(2); // pesos 70/25/5
    expect(blockDifficulty(1, seq(0))).toBe(0);
    expect(blockDifficulty(20, seq(0))).toBe(0);
    expect(blockDifficulty(20, seq(0.5))).toBe(2); // pesos 10/35/55
  });
});

describe('resolveWrong', () => {
  it('erro custa uma vida', () => {
    const G = mkG();
    expect(resolveWrong(G, mkC())).toMatchObject({ lost: 1, saved: null });
    expect(G.lives).toBe(2);
  });
  it('escudo e trevo salvam a vida', () => {
    const G = mkG({ pas: [{ f: 'luck', v: 40 }] });
    expect(resolveWrong(G, mkC({ shield: true })).saved).toBe('escudo');
    expect(resolveWrong(G, mkC(), seq(0)).saved).toBe('trevo');
    expect(resolveWrong(G, mkC(), seq(0.99)).lost).toBe(1);
  });
  it('aposta custa vida extra', () => {
    const G = mkG();
    resolveWrong(G, mkC({ bet: true }));
    expect(G.lives).toBe(1);
  });
  it('Fênix revive uma única vez e se gasta', () => {
    const G = mkG({ lives: 1, pas: [{ f: 'phx', v: 2 }] });
    expect(resolveWrong(G, mkC()).revived).toBe(true);
    expect(G.lives).toBe(2);
    expect(G.pas).toHaveLength(0);
  });
});

describe('useActive', () => {
  it('só uma carta ativável por pergunta: usar bloqueia as demais até a próxima escolha', () => {
    const G = mkG({ c: mkC(), hand: [card('x2'), card('plus')] });
    expect(use(G)).not.toBeNull();
    expect(G.lock).toBe(true);
    expect(use(G)).toBeNull();
    expect(G.hand).toHaveLength(1);
  });
  it('Café com Leite descarta alternativas erradas e protege a vida', () => {
    const G = mkG({ c: mkC(), hand: [card('cafe', 'r')] });
    use(G);
    expect(G.c.rem).toHaveLength(2);
    expect(G.c.rem).not.toContain(1);
    expect(G.c.shield).toBe(true);
  });
  it('em V/F, Café com Leite só protege', () => {
    const G = mkG({ c: mkC({ q: { d: 0, t: 't', o: ['V', 'F'], a: 0 } }), hand: [card('cafe')] });
    use(G);
    expect(G.c.rem).toHaveLength(0);
    expect(G.c.shield).toBe(true);
  });
  it('Pular troca por pergunta rápida; Trocar sorteia outra da mesma dificuldade', () => {
    const G = mkG({ c: mkC(), hand: [card('skip')] });
    use(G);
    expect(G.c).toMatchObject({ quick: true, fixed: 30 });
    const H = mkG({ c: mkC(), hand: [card('reroll', 'r')] });
    use(H, 0, { pickQ: (d) => ({ d, t: 't', o: ['V', 'F'], a: 1 }) });
    expect(H.c.q.a).toBe(1);
    expect(H.c.pct).toBe(10);
  });
  it('Vida Extra respeita o máximo de 5; Mais Tempo e Pausa somam', () => {
    const G = mkG({ lives: 5, c: mkC(), hand: [card('heal')] });
    use(G);
    expect(G.lives).toBe(5);
    const H = mkG({ lives: 2, c: mkC(), hand: [card('heal', 'e')] });
    use(H);
    expect(H.lives).toBe(4);
    const P = mkG({ c: mkC(), hand: [card('plus')] });
    use(P);
    expect(P.c.t).toBe(45);
    const F = mkG({ c: mkC(), hand: [card('freeze')] });
    use(F);
    expect(F.c.frz).toBe(5);
  });
  it('Aposta, Pontos em Dobro e Revelação alteram a pergunta', () => {
    const A = mkG({ c: mkC(), hand: [card('bet')] });
    use(A);
    expect(A.c).toMatchObject({ bet: true, mult: 2 });
    const B = mkG({ c: mkC(), hand: [card('reveal', 'l')] });
    use(B);
    expect(B.c).toMatchObject({ rev: true, mult: 1.5 });
  });
  it('Roleta aplica um efeito aleatório e informa qual', () => {
    const G = mkG({ c: mkC(), hand: [card('spin')] });
    const r = use(G, 0, { rng: seq(0) });
    expect(r.spin).toBeTruthy();
    expect(G.lock).toBe(true);
  });
  it('não usa carta com a pergunta já respondida', () => {
    expect(use(mkG({ c: mkC({ done: true }), hand: [card('x2')] }))).toBeNull();
  });
});
