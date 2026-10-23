# Versão 1 — v0.1.0

## Atribuição
- **Responsável / autor do PR:** Pedro Henrique (`phenrique2407`)
- **Revisor obrigatório do PR:** Pedro Augusto (`pedrinque-dev`)
- **Escopo desta versão:** `versoes/versao-1/`

## Passo a passo
1. Instale Git, Node.js 22+, npm e GitHub CLI (`gh`).
2. Na raiz do repositório consolidado, execute `npm` apenas dentro desta pasta: `cd versoes/versao-1`.
3. Instale dependências com `npm ci`.
4. Execute `npm run lint`, `npm run validate` e `npm run test:ci`.
5. Gere o jogo com `npm run build`; os arquivos estáticos são produzidos em `dist/`.
6. Para executar localmente: `npm run serve` e abra `http://localhost:4173`.
7. Para a versão 2 ou posterior, rode também `npm run e2e` após `npx playwright install chromium` (ou `npx playwright install --with-deps chromium` em Linux).
8. Leia o `README.md` original desta versão e os documentos de `docs/` para detalhes específicos de pipeline, deploy, monitoramento e entrega.

## O que esta versão entrega
núcleo do jogo, conteúdo educativo, build web, validação e testes unitários; base para GDD e integração contínua.

Consulte também `../README.md` para a matriz de critérios da avaliação e os comandos de PR.
