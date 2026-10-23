#!/usr/bin/env bash
# Funções para escrever no branch gh-pages. Só a pipeline escreve nele (commit manual zera o INT-07).
clonar_pages() {
  local url
  if [ -n "${GITHUB_REPOSITORY:-}" ] && [ -n "${GITHUB_TOKEN:-}" ]; then url="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
  else url=$(git remote get-url origin); fi
  PAGES_DIR=$(mktemp -d)
  if git ls-remote --exit-code --heads "$url" gh-pages > /dev/null 2>&1; then git clone -q --branch gh-pages --single-branch "$url" "$PAGES_DIR"
  else git init -q -b gh-pages "$PAGES_DIR"; git -C "$PAGES_DIR" remote add origin "$url"; fi
}
enviar_pages() { # $1 = mensagem do commit
  git -C "$PAGES_DIR" add -A
  git -C "$PAGES_DIR" -c user.name=esteira -c user.email=esteira@users.noreply.github.com commit -qm "$1" || { echo "nada a publicar"; return 0; }
  git -C "$PAGES_DIR" push -q origin gh-pages || { git -C "$PAGES_DIR" pull -q --rebase origin gh-pages && git -C "$PAGES_DIR" push -q origin gh-pages; }
}
