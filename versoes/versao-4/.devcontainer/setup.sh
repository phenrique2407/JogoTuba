#!/usr/bin/env bash
# Prepara o Codespace: ferramentas da esteira, dependências e navegador do Playwright.
set -uo pipefail
sudo apt-get update -qq && sudo apt-get install -y -qq jq zip unzip ffmpeg pandoc poppler-utils > /dev/null
# O Codespace injeta um GITHUB_TOKEN limitado (sem permissão de workflows/admin).
# Cada pessoa entra com a própria conta do gh (veja docs/PASSOS.md, Passo 0); por isso o token injetado é removido dos terminais.
grep -q 'unset GITHUB_TOKEN' ~/.bashrc || echo 'unset GITHUB_TOKEN' >> ~/.bashrc
if [ -f package-lock.json ]; then npm ci && npx playwright install --with-deps chromium; fi
echo "Codespace pronto."
