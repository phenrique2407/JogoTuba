import { KEYS } from './constants.js';

export const validateCards = (cards) => {
  const e = [], ids = new Set();
  if (!Array.isArray(cards) || !cards.length) return ['cards.json: lista vazia'];
  cards.forEach((c, i) => {
    const w = `cards[${i}]`;
    if (!c.id || ids.has(c.id)) e.push(`${w}: id ausente ou duplicado`);
    ids.add(c.id);
    if (!KEYS.includes(c.r)) e.push(`${w}: raridade inválida (${c.r})`);
    if (!['p', 'a'].includes(c.k)) e.push(`${w}: tipo inválido (${c.k})`);
    if (!c.name || !c.ic || !c.desc) e.push(`${w}: nome, ícone ou descrição ausente`);
    if (typeof c.v !== 'number') e.push(`${w}: valor numérico ausente`);
  });
  return e;
};

/** Valida uma pergunta já montada ({th,d,t,x,o,a}); usada no banco e no eval/golden.jsonl. */
export const validateQuestionObj = (q, nThemes = 6) => {
  const e = [];
  if (!(q.th >= 0 && q.th < nThemes)) e.push('tema inválido');
  if (![0, 1, 2].includes(q.d)) e.push('dificuldade inválida');
  if (typeof q.x !== 'string' || q.x.length < 5) e.push('enunciado ausente');
  if (q.t === 'm') { if (!Array.isArray(q.o) || q.o.length < 3 || q.o.length > 4 || new Set(q.o).size !== q.o.length) e.push('alternativas inválidas'); }
  else if (q.t === 't') { if (!Array.isArray(q.o) || q.o.length !== 2) e.push('V/F deve ter 2 opções'); }
  else e.push('tipo inválido');
  if (!Number.isInteger(q.a) || q.a < 0 || q.a >= (q.o?.length ?? 0)) e.push('índice da resposta inválido');
  return e;
};

export const validateQuestions = ({ raw, facts }, nThemes = 6) => {
  const e = [];
  (raw || []).forEach((q, i) => {
    const mc = Array.isArray(q[3]);
    const obj = { th: q[0], d: q[1], x: q[2], t: mc ? 'm' : 't', o: mc ? q[3] : ['V', 'F'], a: mc ? q[4] : q[3] ? 0 : 1 };
    if (!mc && typeof q[3] !== 'boolean') e.push(`raw[${i}]: V/F precisa de booleano`);
    validateQuestionObj(obj, nThemes).forEach((m) => e.push(`raw[${i}]: ${m}`));
  });
  (facts || []).forEach(([th, d, s], i) => {
    if (!(th >= 0 && th < nThemes) || ![0, 1, 2].includes(d)) e.push(`facts[${i}]: tema/dificuldade inválidos`);
    const pares = String(s).split(';').map((x) => x.split('|'));
    if (pares.length < 2 || pares.some((p) => p.length !== 2 || !p[0].trim() || !p[1].trim())) e.push(`facts[${i}]: use "enunciado|resposta;..." com 2+ pares`);
  });
  if (!raw?.length && !facts?.length) e.push('questions.json: sem perguntas');
  return e;
};
