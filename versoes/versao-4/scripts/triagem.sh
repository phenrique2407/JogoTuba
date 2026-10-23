#!/usr/bin/env bash
# Triagem como código: reproduz a triagem técnica do regulamento (item 7.1) antes da entrega (INT-09).
# Uso: bash scripts/triagem.sh [pasta=submissao]   (PRAZO=2026-10-09T19:00:00-03:00 opcional)
set -uo pipefail
PASTA=${1:-submissao}
falhas=0
ok()  { echo "  [OK]    $1"; }
nok() { echo "  [FALHA] $1"; falhas=$((falhas + 1)); }

echo "1. Prazo"
if [ -n "${PRAZO:-}" ]; then [ "$(date +%s)" -le "$(date -d "$PRAZO" +%s)" ] && ok "dentro do prazo" || nok "prazo vencido"; else ok "PRAZO não configurado (pulado)"; fi

echo "2. Squad completo"
n=$(grep -cE '^\| *[0-9]+ *\|' SQUAD.md || true)
[ "$n" -eq 4 ] && ok "4 integrantes em SQUAD.md" || nok "SQUAD.md com $n integrantes (precisa de 4)"

echo "3. GDD"
if pdfinfo "$PASTA/GDD.pdf" > /dev/null 2>&1; then
  ok "GDD.pdf abre"
  txt=$(pdftotext "$PASTA/GDD.pdf" - 2> /dev/null)
  for s in Premissa Gênero Mecânicas Referências; do echo "$txt" | grep -qi "$s" && ok "seção $s" || nok "GDD sem a seção $s"; done
else nok "GDD.pdf ausente ou corrompido"; fi

echo "4. Build pública"
URL=$(tr -d '[:space:]' < "$PASTA/LINK_DO_JOGO.txt" 2> /dev/null || true)
[ -n "$URL" ] && [ "$(curl -s -L -o /dev/null -w '%{http_code}' "$URL")" = "200" ] && ok "$URL responde 200" || nok "URL fora do ar ou LINK_DO_JOGO.txt vazio"
BASE_URL="$URL" npx playwright test tests/e2e/smoke.spec.js > /dev/null 2>&1 && ok "smoke E2E passou" || nok "smoke E2E falhou"

echo "5. Build offline"
unzip -l "$PASTA/build.zip" 2> /dev/null | grep -q 'index.html' && ok "build.zip contém index.html" || nok "build.zip inválido"
unzip -l "$PASTA/build.zip" 2> /dev/null | grep -q 'LEIA-ME.txt' && ok "LEIA-ME.txt dentro do build.zip" || nok "build.zip sem LEIA-ME.txt"
[ "$(stat -c %s "$PASTA/build.zip" 2> /dev/null || echo 99999999)" -lt 26214400 ] && ok "build.zip abaixo de 25 MB" || nok "build.zip com 25 MB ou mais"

echo "6. Vídeo"
d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$PASTA/pitch.mp4" 2> /dev/null | cut -d. -f1)
[ -n "$d" ] && [ "$d" -le 90 ] && ok "pitch.mp4 com ${d}s" || nok "pitch.mp4 ausente ou acima de 90 s (${d:-?}s)"

echo "7. Manifesto SHA-256"
(cd "$PASTA" && sha256sum GDD.pdf LINK_DO_JOGO.txt build.zip pitch.mp4 > MANIFESTO.sha256 2> /dev/null) && ok "MANIFESTO.sha256 gerado" || nok "falha ao gerar o manifesto (arquivo faltando)"

[ "$falhas" -eq 0 ] && { echo "TRIAGEM APROVADA"; exit 0; } || { echo "TRIAGEM REPROVADA: $falhas falha(s)"; exit 1; }
