#!/usr/bin/env bash
# Gera docs/GDD.pdf a partir de docs/gdd.md (INT-02). Requer pandoc + xelatex + poppler-utils.
set -euo pipefail
cd "$(dirname "$0")/.."
VERSION=${VERSION:-$(node -p "require('./package.json').version")}
tmp=$(mktemp -d)
sed "s/{{VERSION}}/$VERSION/g; s/{{DATA}}/$(date +%F)/g" docs/gdd.md > "$tmp/gdd.md"
pandoc "$tmp/gdd.md" -o docs/GDD.pdf --pdf-engine=xelatex -V geometry:margin=2cm -V mainfont="DejaVu Sans"
pdfinfo docs/GDD.pdf > /dev/null && echo "GDD.pdf ok (v$VERSION)"
