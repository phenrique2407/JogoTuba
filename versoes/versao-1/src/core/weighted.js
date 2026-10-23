/** Sorteia um índice de `w` proporcional aos pesos. `rng` devolve [0,1). */
export const pickWeighted = (w, rng = Math.random) => {
  const total = w.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < w.length; i++) if ((r -= w[i]) < 0) return i;
  return w.length - 1;
};
export const shuffle = (a, rng = Math.random) => a.map((x) => [rng(), x]).sort((u, v) => u[0] - v[0]).map((x) => x[1]);
