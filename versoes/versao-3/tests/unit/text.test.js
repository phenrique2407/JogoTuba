import { describe, expect, it } from 'vitest';
import { escapeHtml } from '../../src/core/text.js';

describe('escapeHtml', () => {
  it('REGRESSÃO: alternativas com tags HTML (<h1>, <header>) aparecem como texto', () => {
    expect(escapeHtml('<h1>')).toBe('&lt;h1&gt;');
    expect(['<h1>', '<header>', '<top>', '<p>'].map(escapeHtml).join('')).not.toMatch(/<[a-z]/);
  });
  it('mantém texto comum e escapa & e aspas', () => {
    expect(escapeHtml('DNS')).toBe('DNS');
    expect(escapeHtml('a & "b"')).toBe('a &amp; &quot;b&quot;');
  });
});
