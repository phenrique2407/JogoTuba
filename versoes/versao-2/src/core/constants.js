export const TH = ['Redes', 'Front-end', 'Back-end', 'Ciência de Dados', 'DevOps', 'MySQL'];
export const KEYS = ['c', 'r', 'e', 'l'];
export const RN = { c: 'COMUM', r: 'RARA', e: 'ÉPICA', l: 'LENDÁRIA' };
export const DN = ['FÁCIL', 'MÉDIO', 'DIFÍCIL'];
// ===== Parâmetros ajustáveis =====
export const RARITY_W = { c: 60, r: 25, e: 10, l: 5 }; // pesos de raridade (soma 100)
export const DIFF_W = [[70, 25, 5], [40, 40, 20], [20, 45, 35], [10, 35, 55]]; // fácil/médio/difícil por bloco de 5 turnos
export const TIME = [35, 25, 15]; // segundos por pergunta (fácil, médio, difícil)
export const MULT = [1, 1.5, 2]; // multiplicador de pontos por dificuldade da pergunta
export const LIVES = 3;
export const MAXLIFE = 5;
export const PICK_S = 30; // segundos para escolher a carta
export const SPIN_POOL = ['plus', 'x2', 'heal', 'cafe', 'reveal']; // efeitos possíveis da Roleta
