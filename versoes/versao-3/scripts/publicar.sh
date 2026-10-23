#!/usr/bin/env bash
# Uso: publicar.sh hml <build.zip>   |   publicar.sh release <build.zip> <sha7>
set -euo pipefail
cd "$(dirname "$0")/.."
. scripts/lib-pages.sh
alvo=${1:?hml|release}; zip=$(realpath "${2:?build.zip}"); sha=${3:-}
who=${GITHUB_ACTOR:-local}; curto=$(echo "${GITHUB_SHA:-local}" | cut -c1-7)
clonar_pages; d=$PAGES_DIR
case "$alvo" in
  hml) rm -rf "$d/hml"; mkdir -p "$d/hml"; unzip -q "$zip" -d "$d/hml"; msg="hml: $curto por $who" ;;
  release)
    [ -n "$sha" ] || { echo "informe o sha"; exit 1; }
    if [ -d "$d/releases/$sha" ]; then echo "release $sha já publicada (imutável)"; else mkdir -p "$d/releases/$sha"; unzip -q "$zip" -d "$d/releases/$sha"; fi
    msg="release: $sha por $who" ;;
  *) echo "uso: publicar.sh hml|release"; exit 1 ;;
esac
cp pages/index.html "$d/index.html"
if [ -f pages/status/index.html ]; then mkdir -p "$d/status"; cp pages/status/index.html "$d/status/index.html"; fi
[ -f "$d/rollout.json" ] || echo '{"estavel":"","anterior":"","canario":"","percentual":0}' > "$d/rollout.json"
touch "$d/.nojekyll"
enviar_pages "$msg"
