// Conteúdo inválido quebra o build (INT-04). Uso: node scripts/validate-content.mjs
import { readFileSync } from 'node:fs';
import { validateCards, validateQuestions } from '../src/core/content.js';

const ler = (f) => JSON.parse(readFileSync(new URL(`../src/content/${f}`, import.meta.url), 'utf8'));
const erros = [...validateCards(ler('cards.json')), ...validateQuestions(ler('questions.json'))];
if (erros.length) { console.error(`Conteúdo inválido:\n${erros.join('\n')}`); process.exit(1); }
console.log('Conteúdo válido.');
