import { describe, expect, it } from 'vitest';
import questions from '../../src/content/questions.json';
import { buildBank } from '../../src/core/questions.js';
import { validateQuestionObj } from '../../src/core/content.js';
import { seeded } from '../helpers.js';

describe('banco de perguntas real', () => {
  const bank = buildBank(questions.raw, questions.facts, seeded(11));
  it('tem 500+ perguntas, todas válidas, com a resposta certa dentro das alternativas', () => {
    expect(bank.length).toBeGreaterThanOrEqual(500);
    bank.forEach((q) => expect(validateQuestionObj(q)).toEqual([]));
  });
  it('cobre os 6 temas nas 3 dificuldades, com variedade suficiente', () => {
    for (let th = 0; th < 6; th++) for (let d = 0; d < 3; d++) expect(bank.filter((q) => q.th === th && q.d === d).length).toBeGreaterThanOrEqual(6);
  });
});
