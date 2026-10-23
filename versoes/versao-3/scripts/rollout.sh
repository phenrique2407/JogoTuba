#!/usr/bin/env bash
# Entrega progressiva = editar o rollout.json do gh-pages (rollback é trocar o ponteiro, sem recompilar).
#   rollout.sh canario <sha> [pct]   abre o canário (o primeiro deploy já vira estável)
#   rollout.sh azulverde <sha>       vira a chave de uma vez
#   rollout.sh promover              canário vira estável (100%)
#   rollout.sh rollback              remove o canário ou volta estavel para anterior
set -euo pipefail
cd "$(dirname "$0")/.."
. scripts/lib-pages.sh
acao=${1:?acao}; sha=${2:-}; pct=${3:-10}
clonar_pages; f="$PAGES_DIR/rollout.json"
[ -f "$f" ] || echo '{"estavel":"","anterior":"","canario":"","percentual":0}' > "$f"
case "$acao" in
  canario)   jq --arg s "$sha" --argjson p "$pct" 'if .estavel=="" then .estavel=$s else .canario=$s | .percentual=$p end' "$f" > "$f.new" ;;
  azulverde) jq --arg s "$sha" '.anterior=.estavel | .estavel=$s | .canario="" | .percentual=0' "$f" > "$f.new" ;;
  promover)  jq 'if .canario=="" then . else .anterior=.estavel | .estavel=.canario | .canario="" | .percentual=0 end' "$f" > "$f.new" ;;
  rollback)  jq 'if .canario!="" then .canario="" | .percentual=0 else .estavel=(if .anterior!="" then .anterior else .estavel end) end' "$f" > "$f.new" ;;
  *) echo "acao invalida"; exit 1 ;;
esac
mv "$f.new" "$f"; cat "$f"
enviar_pages "rollout: $acao $sha por ${GITHUB_ACTOR:-local}"
