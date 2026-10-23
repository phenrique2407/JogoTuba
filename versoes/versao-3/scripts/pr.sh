#!/usr/bin/env bash
# Cria um PR a partir de arquivos de uma versão (pasta do zip extraído). Funciona no Codespaces e local.
# Uso (dentro do clone):  bash $SRC/scripts/pr.sh $SRC <branch> "<mensagem>" <revisor-github> <arquivo-ou-pasta>...
# Pastas são MESCLADAS (arquivos extras que você já tenha nelas, como submissao/pitch.mp4, são mantidos).
set -euo pipefail
src=$(realpath "${1:?pasta da versão}"); branch=${2:?branch}; msg=${3:?mensagem}; revisor=${4:-}; shift 4
git switch main -q
git pull -q --ff-only || true
git switch -c "$branch"
for f in "$@"; do
  [ -e "$src/$f" ] || { echo "não existe nesta versão: $f"; exit 1; }
  if [ -d "$src/$f" ]; then mkdir -p "$f"; cp -r "$src/$f/." "$f/"; else mkdir -p "$(dirname "$f")"; cp "$src/$f" "$f"; fi
  git add "$f"
done
git commit -q -m "$msg"
git push -q -u origin "$branch"
args=(--base main --head "$branch" --title "$msg" --body "Aplicação da versão do pacote. Revisão pedida a @${revisor:-quem-revisa}.")
[ -n "$revisor" ] && args+=(--reviewer "$revisor")
gh pr create "${args[@]}"
echo "PR criado. Depois da aprovação e do CI verde: gh pr merge --squash --delete-branch && git switch main && git pull"
