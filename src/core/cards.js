import { KEYS, RARITY_W } from './constants.js';
import { pickWeighted } from './weighted.js';

export const passiveSum = (pas, f) => pas.filter((c) => c.f === f).reduce((a, c) => a + c.v, 0);

/** Oferece `n` cartas distintas por pilha de raridade com pesos fixos. Cartas já escolhidas PODEM reaparecer em ofertas seguintes. */
export const offer = (catalog, rng = Math.random, n = 3) => {
  const out = [];
  while (out.length < n) {
    const r = KEYS[pickWeighted(KEYS.map((k) => RARITY_W[k]), rng)];
    const pool = catalog.filter((c) => c.r === r);
    const c = pool[Math.floor(rng() * pool.length)];
    if (c && !out.includes(c)) out.push(c);
  }
  return out;
};

/** Passiva fica na run toda; ativável fica guardada até ser usada. */
export const takeCard = (G, k) => { (k.k === 'p' ? G.pas : G.hand).push(k); };
/** A cada nova escolha de cartas, as ativáveis voltam a poder ser usadas. */
export const unlockHand = (G) => { G.lock = false; };
