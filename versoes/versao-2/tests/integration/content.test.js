import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import cards from '../../src/content/cards.json';
import questions from '../../src/content/questions.json';
import { validateCards, validateQuestionObj, validateQuestions } from '../../src/core/content.js';

describe('conteúdo real (JSON) × validadores', () => {
  it('cards.json e questions.json passam no esquema', () => {
    expect(validateCards(cards)).toEqual([]);
    expect(validateQuestions(questions)).toEqual([]);
  });
  it('eval/golden.jsonl: exemplos de formato aprovado para conteúdo gerado por IA', () => {
    const linhas = readFileSync(new URL('../../eval/golden.jsonl', import.meta.url), 'utf8').trim().split('\n');
    expect(linhas.length).toBeGreaterThanOrEqual(4);
    linhas.forEach((l) => expect(validateQuestionObj(JSON.parse(l))).toEqual([]));
  });
});
