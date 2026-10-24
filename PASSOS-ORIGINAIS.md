# PASSOS (versão rápida): 1 zip, 4 pessoas, 4 rodadas

**Só existe 1 zip: `versao-4_v1_0_0.zip`** (já tem tudo). Ignorem os outros três.
Cada rodada tem **4 PRs em paralelo, um por pessoa**, em arquivos diferentes (não dá conflito). Cada pessoa faz **1 PR por rodada** e **revisa 1 PR por rodada**. No fim de 4 rodadas, cada um fez 4 PRs e 4 revisões.

**[MANUAL]** = só gente pode fazer (a esteira não faz).

| Rodada | Tema | Tag ao fechar |
|--------|------|---------------|
| 0 | Esqueleto + Codespace | (nenhuma) |
| 1 | Código, conteúdo, build, testes unitários | `v0.1.0` |
| 2 | Testes integração/E2E, segurança, publicação, triagem | `v0.2.0` |
| 3 | Workflows (esteira, rollback, monitor) + docs | `v0.3.0` |
| 4 | Revisão humana, pitch, relatório | `v1.0.0` |

**Anel de revisão (fixo):** Pedro Henrique → revisado por Pedro Augusto → revisado por Vitório → revisado por Vinícius → revisado por Pedro Henrique.
Ou seja: **PH** pede revisão a **PA**; **PA** a **VM**; **VM** a **VV**; **VV** a **PH**.

---

## Passo 0: todos, uma vez (5 min)

1. **[MANUAL] PH** (dono): em *Settings → Collaborators* convide os 3 colegas (escrita) e o professor (leitura). Os colegas aceitam o e-mail.
2. Todos: no GitHub, **Code → Codespaces → Create codespace on main**.
3. No terminal do Codespace (copie o bloco **da sua pessoa**):

```bash
unset GITHUB_TOKEN
gh auth login -h github.com -p https -s workflow -s repo -w
gh auth setup-git
```

```bash
# --- PH ---
echo 'export GH_PH=phenrique2407 GH_PA=pedrinque-dev GH_VM=vitorio-motta GH_VV=Bladecvill REV=pedrinque-dev' >> ~/.bashrc
# --- PA ---
echo 'export GH_PH=phenrique2407 GH_PA=pedrinque-dev GH_VM=vitorio-motta GH_VV=Bladecvill REV=vitorio-motta' >> ~/.bashrc
# --- VM ---
echo 'export GH_PH=phenrique2407 GH_PA=pedrinque-dev GH_VM=vitorio-motta GH_VV=Bladecvill REV=Bladecvill' >> ~/.bashrc
# --- VV ---
echo 'export GH_PH=phenrique2407 GH_PA=pedrinque-dev GH_VM=vitorio-motta GH_VV=Bladecvill REV=phenrique2407' >> ~/.bashrc
```
(rode **só a linha da sua pessoa**, depois `source ~/.bashrc`). A variável `REV` é o seu revisor: assim os comandos abaixo são **iguais para todos**.

4. Arraste `versao-4_v1_0_0.zip` para o Explorer do VS Code e rode:
```bash
mkdir -p ~/v && unzip -qo versao-4_*.zip -d ~/v && export SRC=~/v/show-do-bitlhao
```
(terminal novo: rode só o `export SRC=...`)

## Como funciona cada PR (igual sempre)
- **Criar:** o comando `bash $SRC/scripts/pr.sh ...` faz branch, copia os arquivos, commit, push e abre o PR com revisor.
- **Revisar:** abra o PR no github.com → *Files changed* → *Review changes* → **Approve**. Quem revisa dá uma olhada de verdade (o professor vai ver).
- **Mergear (o próprio autor, depois do approve):**
  `gh pr merge --squash --delete-branch && git switch main && git pull`
- **Se o CI falhar:** corrija na mesma branch (`git commit -m "fix: ..."` + `git push`).
- **Regra de ouro:** só comece a rodada N+1 quando os 4 PRs da rodada N estiverem mergeados. Dentro da rodada, ninguém espera ninguém.

---

## Rodada 0: esqueleto (só PH, enquanto os outros fazem o Passo 0)

**PH:**
```bash
ls   # se houver arquivo antigo do jogo (ex.: index.html), remova com git rm dentro do PR
bash $SRC/scripts/pr.sh $SRC feature/esqueleto "chore: esqueleto do repositório" $REV README.md LICENSE SQUAD.md .gitignore package.json package-lock.json eslint.config.js CHANGELOG.md THIRD_PARTY.md AI-USAGE.md .github/pull_request_template.md .devcontainer scripts/pr.sh
```
PA aprova, PH mergeia. Depois *Ctrl/Cmd+Shift+P → "Codespaces: Rebuild Container"* (**todos**, para vir Node, jq, Chromium). Refaça `export SRC=...`.

---

## Rodada 1: código, conteúdo, build, unitários → tag `v0.1.0`

| Quem | Comando |
|------|---------|
| **PH** (núcleo) | `bash $SRC/scripts/pr.sh $SRC feature/nucleo "feat: núcleo do jogo" $REV src/core src/main.js src/index.template.html src/LEIA-ME.txt` |
| **PA** (conteúdo) | `bash $SRC/scripts/pr.sh $SRC feature/conteudo "feat: perguntas, cartas e validação" $REV src/content src/assets scripts/validate-content.mjs vitest.config.js tests/helpers.js` |
| **VM** (build e GDD) | `bash $SRC/scripts/pr.sh $SRC feature/build "feat: build e GDD" $REV scripts/build.mjs scripts/gdd.sh docs/gdd.md` |
| **VV** (unitários) | `bash $SRC/scripts/pr.sh $SRC feature/unitarios "test: testes unitários" $REV tests/unit` |

Todos aprovam o seu par e mergeiam. Depois, **PH**:
```bash
git switch main && git pull && npm ci && npm run test:ci && npm run build
git tag -a v0.1.0 -m "Núcleo e testes unitários" && git push origin v0.1.0
```

---

## Rodada 2: qualidade, segurança, publicação → tag `v0.2.0`

| Quem | Comando |
|------|---------|
| **PH** (integração) | `bash $SRC/scripts/pr.sh $SRC feature/integracao "test: integração e golden set" $REV tests/integration eval` |
| **PA** (E2E e segurança) | `bash $SRC/scripts/pr.sh $SRC feature/e2e-seguranca "test: E2E, gitleaks e Dependabot" $REV tests/e2e playwright.config.js .gitleaks.toml .github/dependabot.yml` |
| **VM** (publicação) | `bash $SRC/scripts/pr.sh $SRC feature/publicacao "feat: scripts de publicação e rollout" $REV scripts/lib-pages.sh scripts/publicar.sh scripts/setup-repo.sh scripts/rollout.sh pages` |
| **VV** (triagem e DORA) | `bash $SRC/scripts/pr.sh $SRC feature/triagem "feat: triagem como código e DORA" $REV scripts/triagem.sh scripts/dora.mjs submissao` |

**[MANUAL] PA**, na mesma branch, **antes de mergear**: `npm ci && npm run build && npm run e2e`. Os E2E nunca rodaram; corrija o que falhar com commits novos. Rode também `npm audit --omit=dev`.

Depois de tudo mergeado, **PH** (admin do repo):
1. **[MANUAL]** *Settings → Actions → General → Workflow permissions → Read and write*.
2. Configurar variáveis, branch `observabilidade` e environments (revisor da produção: Vitório):
   ```bash
   git switch main && git pull
   bash scripts/setup-repo.sh phenrique2407/JogoWeb $GH_VM
   git tag -a v0.2.0 -m "Qualidade, segurança e publicação" && git push origin v0.2.0
   ```

---

## Rodada 3: workflows e docs → tag `v0.3.0`

| Quem | Comando |
|------|---------|
| **PH** (esteira) | `bash $SRC/scripts/pr.sh $SRC feature/esteira "ci: esteira, hml, produção e release" $REV .github/workflows/esteira.yml` |
| **PA** (rollback) | `bash $SRC/scripts/pr.sh $SRC feature/rollback "feat: workflow de rollback" $REV .github/workflows/rollback.yml` |
| **VM** (monitor) | `bash $SRC/scripts/pr.sh $SRC feature/monitor "feat: monitoramento e alertas" $REV .github/workflows/monitor.yml` |
| **VV** (docs) | `bash $SRC/scripts/pr.sh $SRC feature/docs "docs: passos, relatório e roteiro do pitch" $REV docs/PASSOS.md docs/relatorio.md docs/roteiro-pitch.md` |

**Ordem de merge:** PA, VM e VV primeiro; **esteira (PH) por último** (assim ela roda uma vez só, com tudo no lugar).

Depois da esteira:
1. Em *Actions*: `ci` e `deploy-hml` verdes. **[MANUAL] VM** clica *Review deployments → Approve* no `deploy-prd`.
2. **[MANUAL] PH:** *Settings → Pages → Deploy from a branch → `gh-pages` / root*.
3. **PH** trava a `main`: `bash scripts/setup-repo.sh phenrique2407/JogoWeb $GH_VM protecao`
4. **[MANUAL] Todos:** *Watch → All activity* (alertas).
5. **PH:** `git switch main && git pull && git tag -a v0.3.0 -m "Esteira, produção e monitoramento" && git push origin v0.3.0`
   (o job `pacote` fica **vermelho** nas tags v0.x porque ainda não há `pitch.mp4`. É esperado.)
6. Ver o jogo no Codespace: `npm ci && npm run build && npm run serve` e abra a porta 4173.

---

## Rodada 4: o que é só humano → tag `v1.0.0`

Cada um fica com uma parte (já com a `main` protegida: PR e aprovação obrigatórios):

| Quem | Tarefa | PR |
|------|--------|-----|
| **PH** | Preencher `THIRD_PARTY.md` (autoria/licença do `apresentador.png`, trilha) e trocar **PENDENTE** em `AI-USAGE.md` por nomes e ajustes reais. Substituir wireframes ASCII do `docs/gdd.md` por telas reais. | `feature/licencas` |
| **PA** | Revisar **cada pergunta** de `src/content/questions.json` (foi gerada por IA, ninguém conferiu). Corrigir erros e rodar `npm run validate`. | `feature/revisao-perguntas` |
| **VM** | Revisar **cada carta** de `src/content/cards.json`. Fazer o **ensaio do rollback cronometrado** (meta < 5 min): PR com defeito que passe nos testes → aprovar em produção → *Actions → rollback → Run workflow* → `git revert` por PR. Anotar tempos. | `feature/revisao-cartas` |
| **VV** | Gravar `pitch.mp4` (até 90 s, ver `docs/roteiro-pitch.md`; gameplay da produção, legendas, trilha licenciada, consentimento). Preencher `docs/relatorio.md` (prints **com data**, `status/dora.json`, 1 decisão de melhoria, retrospectiva). | `feature/pitch-relatorio` |

Para os PRs da rodada 4 (editar à mão, sem `pr.sh`):
```bash
git switch main && git pull && git switch -c feature/NOME
# ...edite...
git add -A && git commit -m "docs: ..." && git push -u origin HEAD
gh pr create --fill --reviewer $REV
```
**VV** (pitch): arraste o `pitch.mp4` para `submissao/` e inclua `git rm submissao/LEIA-ME-PITCH.txt` no mesmo PR.

### Fechamento (todos juntos, 20 min)
1. Teste de clone limpo (**PH**): `git clone https://github.com/phenrique2407/JogoWeb.git /tmp/teste && cd /tmp/teste && npm ci && npm run lint && npm run test:ci && npm run build`
2. **PH** cria a tag final:
   `git switch main && git pull && git tag -a v1.0.0 -m "Entrega final" && git push origin v1.0.0`
   Esperem `ci → release → pacote`. O `pacote` tem que terminar com **TRIAGEM APROVADA**.
3. **[MANUAL] VV**: baixa a ficha de entrega (`.txt`), exporta o relatório em PDF (até 12 páginas) e anexa tudo no AVA com os links.
4. Depois de `v1.0.0`, só entra `fix:` por PR.
5. **[MANUAL]** Ensaio da apresentação: 10 min apresentação, 5 min demo ao vivo (falha injetada + rollback, quem conduz é o Vitório), 5 min perguntas.

---

## Checklist rápido
- [ ] Rodada 0 (PH) mergeada + Rebuild Container (todos)
- [ ] Rodada 1: 4 PRs mergeados + tag v0.1.0
- [ ] Rodada 2: 4 PRs mergeados + E2E rodado + `setup-repo.sh` + tag v0.2.0
- [ ] Rodada 3: 4 PRs mergeados (esteira por último) + Pages + proteção + tag v0.3.0
- [ ] Rodada 4: 4 PRs mergeados (perguntas, cartas, licenças, pitch/relatório)
- [ ] Rollback ensaiado e cronometrado
- [ ] Tag v1.0.0 com TRIAGEM APROVADA
- [ ] Ficha + relatório PDF no AVA; apresentação ensaiada

## Problemas comuns
| Sintoma | Solução |
|---------|---------|
| `refusing to allow ... workflow` no push | `unset GITHUB_TOKEN; gh auth login -s workflow -s repo -w; gh auth setup-git` |
| `pr.sh`: "não existe nesta versão" | Confira `echo $SRC` (tem que ser `~/v/show-do-bitlhao`) |
| `pr.sh` falha em `git switch main` | Commit ou descarte o que sobrou: `git status` |
| PR não pode mergear (check `ci` pendente) | Espere o `ci` ficar verde; se falhar, `fix:` na mesma branch |
| E2E em `/hml/` falha logo após o deploy | Pages ainda propagando; rode de novo |
| `npm audit` reprova | Atualize pelo PR do Dependabot |
| `gitleaks` reprova | Revogue o segredo **na hora**; só apagar o arquivo não basta |
| Sem Chromium/jq | *Codespaces: Rebuild Container* ou `bash .devcontainer/setup.sh` |
