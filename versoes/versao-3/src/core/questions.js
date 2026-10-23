import { shuffle } from './weighted.js';

const V = ['Verdadeiro', 'Falso'];

/**
 * Monta o banco: perguntas escritas à mão (raw) + perguntas geradas a partir de fatos.
 * Cada fato "enunciado|resposta" vira 3 perguntas: múltipla escolha, V/F verdadeiro e V/F falso.
 */
export const buildBank = (raw, facts, rng = Math.random) => {
  const bank = raw.map((q) => (Array.isArray(q[3])
    ? { th: q[0], d: q[1], t: 'm', x: q[2], o: q[3], a: q[4] }
    : { th: q[0], d: q[1], t: 't', x: q[2], o: V, a: q[3] ? 0 : 1 }));
  const byTheme = {};
  facts.forEach(([th, , s]) => { (byTheme[th] ||= []).push(...s.split(';').map((x) => x.split('|')[1])); });
  facts.forEach(([th, d, s], g) => {
    const F = s.split(';').map((x) => x.split('|'));
    F.forEach(([p, a], f) => {
      let pool = shuffle([...new Set(F.map((x) => x[1]))].filter((x) => x !== a), rng);
      if (pool.length < 3) pool = pool.concat(shuffle([...new Set(byTheme[th])].filter((x) => x !== a && !pool.includes(x)), rng));
      pool = pool.slice(0, 3);
      const o = shuffle([a, ...pool], rng), k = `g${g}_${f}`;
      bank.push(
        { th, d, t: 'm', x: `Complete: ${p} …`, o, a: o.indexOf(a), k },
        { th, d, t: 't', x: `${p} ${a}.`, o: V, a: 0, k },
        { th, d, t: 't', x: `${p} ${pool[0]}.`, o: V, a: 1, k },
      );
    });
  });
  bank.forEach((q, i) => { q.i = i; q.k ||= `q${i}`; });
  return bank;
};

/**
 * Sorteador sem repetição: lembra as perguntas já vistas (`seen`, persistido entre partidas)
 * e só recomeça quando todas as perguntas do tema foram vistas. Variações do mesmo fato compartilham a chave `k`.
 */
export const createPicker = (bank, seen, { onSave = () => {}, rng = Math.random } = {}) => (G, d, tfOnly = false) => {
  const ok = (q) => (G.theme < 0 || q.th === G.theme) && (!tfOnly || q.t === 't');
  const fresh = (q) => ok(q) && !seen.has(q.k) && !G.used.has(q);
  let p = bank.filter((q) => fresh(q) && q.d === d);
  if (!p.length) p = bank.filter(fresh);
  if (!p.length) {
    bank.forEach((q) => { if (ok(q)) seen.delete(q.k); });
    G.used.clear();
    p = bank.filter((q) => ok(q) && q.d === d);
    if (!p.length) p = bank.filter(ok);
  }
  const q = p[Math.floor(rng() * p.length)];
  G.used.add(q);
  seen.add(q.k);
  onSave(seen);
  return q;
};
