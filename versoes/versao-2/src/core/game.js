import { DIFF_W, LIVES, MAXLIFE, MULT, SPIN_POOL, TIME } from './constants.js';
import { passiveSum } from './cards.js';
import { pickWeighted } from './weighted.js';

export const newGame = ({ theme = -1, diff = 1 } = {}) => ({
  theme, diff, lim: TIME[diff], lives: LIVES, score: 0, turn: 0, ok: 0, st: 0,
  pas: [], hand: [], lock: false, used: new Set(), quit: false, pause: false,
});

/** Roguelike puro: a partida só acaba quando as vidas chegam a zero (carta ativável guardada é descartada). */
export const isOver = (G) => G.lives <= 0;

/** Dificuldade sorteada com pesos que sobem a cada bloco de 5 turnos. */
export const blockDifficulty = (turn, rng = Math.random) => pickWeighted(DIFF_W[Math.min(3, Math.floor((turn - 1) / 5))], rng);

/** Pontos de um acerto: 100 × dificuldade × bônus de tempo, ajustados pelas cartas. */
export const calcPoints = (G, c) => {
  const q = c.q, pv = (f) => passiveSum(G.pas, f);
  let pts;
  if (c.quick) pts = c.fixed;
  else {
    const bonus = 1 + (c.t / c.lim) * (1 + pv('spd') / 100);
    pts = 100 * MULT[q.d] * bonus * (1 + (pv('pts') + (q.t === 't' ? pv('tf') : 0) + (q.d === 2 ? pv('hard') : 0) + c.pct) / 100);
  }
  pts *= (1 + (pv('combo') * Math.min(G.st || 0, 10)) / 100) * c.mult;
  if ((G.ok + 1) % 7 === 0) G.pas.filter((x) => x.f === 'jp').forEach((x) => { pts *= x.v; });
  return Math.round(pts + pv('bank'));
};

/** Erro ou tempo esgotado: escudo/trevo salvam a vida; aposta custa vida extra; Fênix revive uma vez. */
export const resolveWrong = (G, c, rng = Math.random) => {
  let saved = null;
  if (c.shield) saved = 'escudo';
  else if (rng() * 100 < passiveSum(G.pas, 'luck')) saved = 'trevo';
  if (saved) return { saved, lost: 0, revived: false };
  const lost = 1 + (c.bet ? 1 : 0);
  G.lives -= lost;
  let revived = false;
  const ph = G.pas.find((x) => x.f === 'phx');
  if (G.lives <= 0 && ph) { G.pas.splice(G.pas.indexOf(ph), 1); G.lives = ph.v; revived = true; }
  return { saved, lost, revived };
};

/** Usa uma carta ativável antes de responder. Só uma por pergunta: usar bloqueia as demais até a próxima escolha de cartas. */
export const useActive = (G, i, { pickQ, catalog, rng = Math.random }) => {
  const c = G.c;
  if (G.lock || !c || c.done || !G.hand[i]) return null;
  let k = G.hand[i];
  G.hand.splice(i, 1);
  G.lock = true;
  let spin = null;
  if (k.f === 'spin') {
    const pool = SPIN_POOL.filter((f) => catalog.some((x) => x.f === f && x.r === k.r));
    const f = pool[Math.floor(rng() * pool.length)];
    k = catalog.find((x) => x.f === f && x.r === k.r);
    spin = k.name;
  }
  const q = c.q;
  switch (k.f) {
    case 'cafe': {
      c.shield = true;
      if (q.t === 'm') {
        const w = q.o.map((_, j) => j).filter((j) => j !== q.a && !c.rem.includes(j));
        for (let n = 0; n < k.v && w.length; n++) c.rem.push(w.splice(Math.floor(rng() * w.length), 1)[0]);
      }
      break;
    }
    case 'shield': c.shield = true; c.pct += k.v; break;
    case 'skip': c.q = pickQ(0, true); c.quick = true; c.fixed = k.v; c.rem = []; c.rev = false; break;
    case 'plus': c.t += k.v; c.lim += k.v; break;
    case 'heal': G.lives = Math.min(MAXLIFE, G.lives + k.v); break;
    case 'x2': c.mult *= k.v; break;
    case 'reroll': G.used.delete(q); c.q = pickQ(q.d); c.rem = []; c.pct += k.v; break;
    case 'reveal': c.rev = true; if (k.v > 1) c.mult *= k.v; break;
    case 'bet': c.mult *= k.v; c.bet = true; break;
    case 'freeze': c.frz = (c.frz || 0) + k.v; break;
  }
  return { card: k, spin };
};
