---
title: "Relatório técnico — SHOW DO BITLHÃO"
---
> Até **12 páginas** em PDF (exporte deste arquivo com Pandoc/Word). Todo print precisa ter **data** e **link**.

# 1. Arquitetura da esteira e decisões
_Cole o diagrama do README. Para cada decisão: o que escolhemos, alternativas descartadas e por quê (ex.: canário × azul-verde; Pages × VM; Playwright × Cypress)._

# 2. Evidências por integrável
| INT | Evidência (link + data) |
|-----|-------------------------|
| 01 Git | PRs revisados, tags, branch protegida: |
| 02 GDD | `docs/gdd.md`, GDD.pdf da release: |
| 03 CI/CD | execução verde a partir de clone limpo, tempo até HML: |
| 04 Testes | JUnit, cobertura em `src/core/`, E2E: |
| 05 Segurança | gitleaks, npm audit, SBOM, THIRD_PARTY, AI-USAGE: |
| 06 Release | GitHub Release, build.zip + SHA-256: |
| 07 Ambientes | histórico do gh-pages, rollout.json, rollback cronometrado: |
| 08 Monitoramento | alertas (Issues), painel /status/: |
| 09 Pacote | `triagem.sh` com TRIAGEM APROVADA: |
| 10 Pitch | pitch.mp4 (duração): |

# 3. Bug real capturado por teste
Alternativas como `<h1>` desapareciam da tela (viravam tags HTML). Corrigido com `escapeHtml` e coberto por `tests/unit/text.test.js` e pelo E2E de regressão. _Acrescentem outros que acharem durante o projeto._

# 4. Métricas DORA
_Cole `status/dora.json`. Compare o lead time com a linha de base da Carparts (**11 dias**). Registre UMA decisão de melhoria tomada a partir das métricas e o efeito dela._

# 5. Retrospectiva (com dados)
O que funcionou · o que não funcionou · o que mudaríamos.
_Limite conhecido: execuções agendadas do GitHub Actions podem atrasar alguns minutos._

# 6. Contribuição de cada integrante
| Integrante | Papel | Integráveis com commits | PRs (colar os links) |
|------------|-------|-------------------------|----------------------|
| Pedro Henrique Dias Brito | Desenvolvimento e Qualidade (criou o jogo) | 01, 02, 03, 04, 06 | PRs da Versão 1: |
| Pedro Augusto Lombardi da Costa | SRE e Segurança | 03, 04, 05 | PRs da Versão 2: |
| Vitório Fraga Motta | Plataforma e Release | 03, 07, 08 | PRs da Versão 3: |
| Vinícius Rodrigues Vilaça | Produto e Game Design | 02, 05, 09, 10 | PRs da Versão 4: |
