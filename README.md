# SHOW DO BITLHÃO

Repositório: https://github.com/phenrique2407/JogoTuba · Site: https://phenrique2407.github.io/JogoTuba/

Squad: Pedro Henrique Dias Brito · Pedro Augusto Lombardi da Costa · Vitório Fraga Motta · Vinícius Rodrigues Vilaça (Faculdade SENAI, 2º ADS, 09–12/10/2026).

Roguelike de perguntas de TI (inspirado no Jogo do Milhão, com cartas estilo Clover Pit e estética cyberfunk) criado para o **Desafio Arcade**: um protótipo gamificado que facilita o acesso à educação em tecnologia, **entregue por uma esteira CI/CD completa** no GitHub (Actions + Pages).

## Codespaces
O repositório traz `.devcontainer/` (Node 22, gh, jq, ffmpeg, pandoc e Chromium do Playwright). *Code → Codespaces → Create codespace on main* e siga `docs/PASSOS.md`. Para ver o jogo: `npm run build && npm run serve` e abra a porta 4173 na aba **Ports**.

## Rodar o jogo e os testes
```bash
npm ci
npm run build && npm run serve   # http://localhost:4173
npm test                          # unidade + integração (Vitest)
npm run test:ci                   # + valida JSON + cobertura + JUnit em reports/
npm run e2e                       # E2E (Playwright; antes: npx playwright install chromium)
npm run lint
```
Sem build: abra `dist/index.html` direto no navegador (funciona offline).

## Arquitetura
```
src/core/      regras puras do jogo (vidas, tempo, cartas, pontuação, sorteios)  -> testadas (>=70% de cobertura)
src/content/   cards.json (80 cartas) e questions.json (perguntas e fatos)       -> validados no build
src/main.js    interface (DOM/áudio), consome o núcleo
scripts/       build, validação, publicar.sh, rollout.sh, triagem.sh, dora.mjs ...
pages/         carregador (rollout.json) e painel /status/
.github/       esteira.yml, rollback.yml, monitor.yml
```
O banco de perguntas junta perguntas escritas à mão e variações geradas de "fatos" (cada fato vira múltipla escolha, V/F verdadeiro e V/F falso). O sorteio lembra as perguntas já vistas (localStorage) e só repete quando o tema inteiro foi visto.

## Fluxo Git (branching)
GitHub Flow com `feature/*` curtas: `main` protegida (PR + 1 revisão + CI verde) → merge → `deploy-hml` → aprovação → `deploy-prd`. Commits no padrão **Conventional Commits** (`feat:`, `fix:`, `ci:`, `docs:`, `test:`). Versionamento **SemVer** com tags anotadas (`git tag -a v1.0.0 -m "..."`). **Ninguém** escreve à mão no `gh-pages`.

## Esteira
Para a publicação rápida do Caminho A, gere `dist/index.html` com `npm ci && npm run build` e mantenha esse arquivo e `.nojekyll` na raiz da branch `main`. Em **Settings → Pages**, selecione **Deploy from a branch → `main` / `(root)`**. Tags `vX.Y.Z` continuam gerando a GitHub Release e o pacote de submissão pelo workflow `esteira`.

## Privacidade (LGPD)
O jogo **não coleta dado pessoal**. Apelido, recorde e ranking ficam apenas no `localStorage` do navegador. Não há telemetria.

## Documentos
`docs/gdd.md` (GDD) · `docs/relatorio.md` (relatório técnico) · `THIRD_PARTY.md` · `AI-USAGE.md` · `LICENSE` (MIT)
