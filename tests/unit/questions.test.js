import { describe, expect, it } from 'vitest';
import { buildBank, createPicker } from '../../src/core/questions.js';
import { seeded } from '../helpers.js';

const raw = [[0, 0, 'Pergunta de teste?', ['a', 'b', 'c', 'd'], 1], [0, 0, 'Isto é verdade?', true]];
const facts = [[0, 0, 'A porta do HTTP é|80;A porta do HTTPS é|443;A porta do SSH é|22;A porta do FTP é|21']];
const bank = () => buildBank(raw, facts, seeded(5));

describe('buildBank', () => {
  it('cada fato vira 3 perguntas (múltipla escolha, V/F verdadeiro, V/F falso)', () => {
    expect(bank()).toHaveLength(2 + 4 * 3);
  });
  it('a resposta da múltipla escolha aponta para a alternativa correta', () => {
    const mc = bank().find((q) => q.k === 'g0_0' && q.t === 'm');
    expect(mc.o[mc.a]).toBe('80');
    expect(mc.o).toHaveLength(4);
  });
  it('V/F verdadeiro afirma o fato e o falso usa outra resposta', () => {
    const [, v, f] = bank().filter((q) => q.k === 'g0_1');
    expect(v).toMatchObject({ x: 'A porta do HTTPS é 443.', a: 0 });
    expect(f.a).toBe(1);
    expect(f.x).not.toContain('443');
  });
});

describe('createPicker', () => {
  it('não repete fatos até esgotar o tema (sem repetição rápida)', () => {
    const b = bank(), seen = new Set(), pick = createPicker(b, seen, { rng: seeded(9) });
    const G = { theme: 0, used: new Set() }, keys = [];
    for (let i = 0; i < 6; i++) keys.push(pick(G, 0).k);
    expect(new Set(keys).size).toBe(6);
  });
  it('recomeça o ciclo quando todo o tema foi visto', () => {
    const b = bank(), seen = new Set(), pick = createPicker(b, seen, { rng: seeded(2) });
    const G = { theme: 0, used: new Set() };
    for (let i = 0; i < 7; i++) pick(G, 0);
    expect(seen.size).toBe(1);
  });
  it('respeita o tema escolhido e o filtro só V/F', () => {
    const b = [...bank(), { th: 1, d: 0, t: 'm', x: 'Outro tema?', o: ['a', 'b'], a: 0, i: 99, k: 'x1' }];
    const pick = createPicker(b, new Set(), { rng: seeded(4) });
    expect(pick({ theme: 1, used: new Set() }, 0).th).toBe(1);
    expect(pick({ theme: 0, used: new Set() }, 0, true).t).toBe('t');
  });
  it('avisa quando salva as perguntas já vistas (persistência)', () => {
    let salvo = null;
    createPicker(bank(), new Set(), { onSave: (s) => { salvo = s; }, rng: seeded(1) })({ theme: 0, used: new Set() }, 0);
    expect(salvo.size).toBe(1);
  });
});
