#!/usr/bin/env bash
# Configura o repositório no GitHub (rode UMA vez, com `gh auth login` feito e o repositório público já criado).
# Uso: scripts/setup-repo.sh <dono/repo> <usuario-revisor-da-producao> [protecao]
#   1) sem o 3º argumento: variáveis, label, branch observabilidade e environments (rode antes de mergear a esteira)
#   2) com "protecao": só protege a main (rode DEPOIS que o job `ci` rodar uma vez, senão o check obrigatório trava os PRs)
set -euo pipefail
R=${1:?dono/repo}; REV=${2:?usuário revisor da produção}
if [ "${3:-}" = "protecao" ]; then
  gh api -X PUT "repos/$R/branches/main/protection" --input - > /dev/null <<'JSON'
{"required_status_checks":{"strict":true,"contexts":["ci"]},"enforce_admins":false,"required_pull_request_reviews":{"required_approving_review_count":1},"restrictions":null}
JSON
  echo "main protegida (PR + 1 revisão + check ci)."; exit 0
fi
OWNER=${R%%/*}; NAME=${R##*/}
gh variable set SITE_URL --body "https://${OWNER}.github.io/${NAME}" -R "$R"
gh variable set ESTRATEGIA --body "canario" -R "$R" # ou azulverde
gh label create alerta --color B60205 --description "Alertas do monitoramento" -R "$R" 2> /dev/null || true
# branch órfã de observabilidade (dados das sondas)
tmp=$(mktemp -d); git -C "$tmp" init -q -b observabilidade; mkdir -p "$tmp/status"; echo "data,alvo,codigo,tempo" > "$tmp/status/sondas.csv"
git -C "$tmp" add -A; git -C "$tmp" -c user.name=setup -c user.email=setup@users.noreply.github.com commit -qm "observabilidade: início"
git -C "$tmp" push -q "https://github.com/$R.git" observabilidade
# environments (produção exige revisor)
gh api -X PUT "repos/$R/environments/homologacao" > /dev/null
RID=$(gh api "users/$REV" -q .id)
gh api -X PUT "repos/$R/environments/producao" --input - > /dev/null <<JSON
{"reviewers":[{"type":"User","id":$RID}]}
JSON
echo "Pronto. Depois do 1º deploy-hml (cria o gh-pages): gh api -X POST repos/$R/pages -f 'source[branch]=gh-pages' -f 'source[path]=/'"
