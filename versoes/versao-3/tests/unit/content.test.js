import { describe, expect, it } from 'vitest';
import { validateCards, validateQuestionObj, validateQuestions } from '../../src/core/content.js';

const ok = { id: 'x0', f: 'x', k: 'p', r: 'c', name: 'A', ic: '★', v: 1, desc: 'd' };
describe('validateCards', () => {
  it('aceita carta válida e recusa raridade/tipo inválidos e ids repetidos', () => {
    expect(validateCards([ok])).toEqual([]);
    expect(validateCards([{ ...ok, r: 'z' }])[0]).toMatch(/raridade/);
    expect(validateCards([ok, ok])[0]).toMatch(/duplicado/);
    expect(validateCards([{ ...ok, k: 'q' }])[0]).toMatch(/tipo/);
  });
});
describe('validateQuestions', () => {
  it('recusa múltipla escolha com índice fora das alternativas', () => {
    expect(validateQuestions({ raw: [[0, 0, 'Pergunta?', ['a', 'b', 'c', 'd'], 9]], facts: [] }).join()).toMatch(/índice/);
  });
  it('recusa V/F sem booleano e fato mal formado', () => {
    expect(validateQuestions({ raw: [[0, 0, 'Verdade?', 'sim']], facts: [] }).join()).toMatch(/booleano/);
    expect(validateQuestions({ raw: [], facts: [[0, 0, 'sem separador']] }).join()).toMatch(/enunciado\|resposta/);
  });
  it('valida pergunta já montada', () => {
    expect(validateQuestionObj({ th: 0, d: 0, t: 'm', x: 'Pergunta?', o: ['a', 'b', 'c', 'd'], a: 0 })).toEqual([]);
    expect(validateQuestionObj({ th: 9, d: 5, t: 'z', x: '', o: [], a: 0 }).length).toBeGreaterThan(2);
  });
});
