#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Uso: bash scripts/abrir-pr-versao.sh <url-repo.git> <1|2|3|4>" >&2
  exit 2
fi
REMOTE="$1"
VERSION="$2"
case "$VERSION" in
  1) OWNER="Pedro Henrique"; OWNER_GH="phenrique2407"; REVIEWER="pedrinque-dev"; TAG="v0.1.0" ;;
  2) OWNER="Pedro Augusto"; OWNER_GH="pedrinque-dev"; REVIEWER="vitorio-motta"; TAG="v0.2.0" ;;
  3) OWNER="Vitorio Motta"; OWNER_GH="vitorio-motta"; REVIEWER="Bladecvill"; TAG="v0.3.0" ;;
  4) OWNER="Vinicius"; OWNER_GH="Bladecvill"; REVIEWER="phenrique2407"; TAG="v1.0.0" ;;
  *) echo "Versão deve ser 1, 2, 3 ou 4." >&2; exit 2 ;;
esac

command -v git >/dev/null || { echo "Git não encontrado." >&2; exit 1; }
command -v gh >/dev/null || { echo "GitHub CLI (gh) não encontrado." >&2; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "Autentique o GitHub CLI com: gh auth login"; exit 1; }
ACTUAL="$(gh api user --jq .login)"
if [[ "$ACTUAL" != "$OWNER_GH" ]]; then
  echo "Conta autenticada: $ACTUAL; versão $VERSION exige $OWNER_GH ($OWNER)." >&2
  echo "Autentique o responsável correto com 'gh auth login' e tente novamente." >&2
  exit 1
fi

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SRC="$ROOT/versoes/versao-$VERSION"
WORK="$ROOT/.pr-work/versao-$VERSION"
BRANCH="entrega/versao-$VERSION-$TAG"
[[ -d "$SRC" ]] || { echo "Pasta não encontrada: $SRC" >&2; exit 1; }
if [[ -e "$WORK" ]]; then
  echo "Pasta de trabalho já existe: $WORK" >&2
  echo "Para evitar sobrescrever trabalho, remova-a conscientemente e execute de novo." >&2
  exit 1
fi
mkdir -p "$(dirname "$WORK")"
git clone "$REMOTE" "$WORK"
cd "$WORK"
git fetch origin
git switch main
git pull --ff-only origin main
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  echo "Branch remota já existe: $BRANCH" >&2; exit 1
fi
git switch -c "$BRANCH"
mkdir -p "versoes/versao-$VERSION"
cp -a "$SRC/." "versoes/versao-$VERSION/"
git config user.name "$OWNER"
git config user.email "${OWNER_GH}@users.noreply.github.com"
git add "versoes/versao-$VERSION"
if git diff --cached --quiet; then
  echo "Nenhuma alteração para commitar." >&2; exit 1
fi
git commit -m "chore: entrega versão $VERSION ($TAG)"
git push -u origin "$BRANCH"
gh pr create --base main --head "$BRANCH" \
  --title "Versão $VERSION — $TAG" \
  --body "Responsável: $OWNER (@$OWNER_GH). Revisor solicitado: @$REVIEWER.

Entrega do snapshot em versoes/versao-$VERSION/. Consulte PASSO-A-PASSO.md e README.md para escopo, comandos e evidências. A solicitação de revisão não substitui a aprovação humana." \
  --reviewer "$REVIEWER"
echo "PR criado. Confirme a solicitação de revisão e aguarde aprovação humana: $(gh pr view --json url --jq .url)"
