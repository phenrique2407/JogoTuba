/** Escapa HTML. Regressão: alternativas como <h1> sumiam da tela por virarem tags. */
export const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
