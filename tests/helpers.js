/** rng determinístico: devolve os valores em ordem (e recomeça ao acabar). */
export const seq = (...v) => { let i = 0; return () => v[i++ % v.length]; };
/** rng pseudoaleatório com semente (LCG). */
export const seeded = (s = 1) => () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296;
export const mkG = (o = {}) => ({ pas: [], hand: [], st: 0, ok: 0, lives: 3, lock: false, used: new Set(), ...o });
export const mkC = (o = {}) => ({ q: { d: 0, t: 'm', o: ['a', 'b', 'c', 'd'], a: 1 }, t: 35, lim: 35, quick: false, fixed: 0, pct: 0, mult: 1, rem: [], done: false, ...o });
