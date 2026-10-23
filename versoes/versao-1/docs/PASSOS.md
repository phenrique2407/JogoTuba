# PASSOS: o que cada um faz, em ordem (GitHub Codespaces)

**[MANUAL]** = vocês fazem à mão (nem a esteira nem a IA fazem). Tudo foi planejado para 4 dias, **uma versão por dia**. Todo o trabalho de terminal é feito **no Codespace**, sem instalar nada no computador.

| Dia | Versão | Responsável | Tag ao terminar |
|-----|--------|-------------|-----------------|
| 09/10 | Versão 1 | **Pedro Henrique** (Dev e Qualidade) | v0.1.0 |
| 10/10 | Versão 2 | **Pedro Augusto** (SRE e Segurança) | v0.2.0 |
| 11/10 | Versão 3 | **Vitório** (Plataforma e Release) | v0.3.0 |
| 12/10 | Versão 4 | **Vinícius** (Produto e Game Design) | v1.0.0 |

Cada versão já contém a anterior. Quem pega a versão seguinte começa pelo `git pull` da `main` (o `pr.sh` já faz isso).

## Passo 0: todos, uma vez por Codespace
1. **[MANUAL]** Aceite o convite de colaborador (e-mail do GitHub). Em https://github.com/phenrique2407/JogoWeb: **Code → Codespaces → Create codespace on main** (máquina 2-core). *(Prefere o seu computador? `gh repo clone phenrique2407/JogoWeb`, mas aí precisa instalar Node 22, jq, ffmpeg e rodar `bash .devcontainer/setup.sh`.)* Ao terminar o dia, *Stop codespace* (o plano grátis dá cerca de 60 h/mês numa 2-core).
2. No terminal do Codespace, entre com a **sua** conta (o token injetado pelo Codespace não pode mexer em workflows nem em configurações):
   ```bash
   unset GITHUB_TOKEN
   gh auth login -h github.com -p https -s workflow -s repo -w   # abra o link e digite o código
   gh auth setup-git
   ```
3. Salve os usuários do GitHub do squad (Pedro Henrique, Pedro Augusto, Vitório e Vinícius; já estão preenchidos):
   ```bash
   cat >> ~/.bashrc <<'X'
   export GH_PH=phenrique2407 GH_PA=pedrinque-dev GH_VM=vitorio-motta GH_VV=Bladecvill
   X
   source ~/.bashrc
   ```
4. Arraste o **seu zip** para o Explorer do VS Code (ou botão direito → *Upload*) e extraia (troque N pelo número da versão):
   ```bash
   mkdir -p ~/v/N && unzip -qo versao-N_*.zip -d ~/v/N && export SRC=~/v/N/show-do-bitlhao
   ```
   (Em terminal novo, rode só o `export SRC=...` de novo. Os `.zip` são ignorados pelo Git.)

## Como cada PR é feito (vale para todos)
- **Criar:** um comando `bash $SRC/scripts/pr.sh ...` (já está pronto em cada seção) cria a branch, copia só os arquivos do PR, faz o commit, o push e abre o PR pedindo revisão.
- **Revisar:** o revisor abre o PR no github.com → *Files changed* → *Review changes* → **Approve**. Ninguém aprova o próprio PR.
- **Se o CI falhar:** corrija na mesma branch (`git add`, `git commit -m "fix: ..."`, `git push`).
- **Mergear (só com aprovação e CI verde):** `gh pr merge --squash --delete-branch && git switch main && git pull`.
- Nunca escreva à mão no branch `gh-pages` e não altere datas de commit (o Git guarda a data real).

---

## Pedro Henrique: Versão 1 (09/10) → v0.1.0
0. **[MANUAL]** O repositório já existe: https://github.com/phenrique2407/JogoWeb (público, branch `main`). Em Settings → Collaborators convide os 3 colegas (escrita) e o professor (leitura). Abra o Codespace (**Code → Codespaces → Create codespace on main**) e faça o **Passo 0** (com `N=1`). Rode `ls`: se houver arquivos de uma versão antiga do jogo (ex.: `index.html`), remova-os dentro do PR1 com `git rm`.
1. **PR1** (revisor Vinícius):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/esqueleto "chore: esqueleto do repositório" $GH_VV README.md LICENSE SQUAD.md .gitignore package.json package-lock.json eslint.config.js CHANGELOG.md THIRD_PARTY.md AI-USAGE.md .github/pull_request_template.md .devcontainer scripts/pr.sh
   ```
   Depois do merge: **Ctrl/Cmd+Shift+P → "Codespaces: Rebuild Container"** (aplica o `.devcontainer`; leva alguns minutos). Refaça `export SRC=...` e o login do `gh` se pedir.
2. **PR2** (revisor Vitório):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/nucleo "feat: núcleo do jogo, conteúdo e build" $GH_VM src vitest.config.js tests/helpers.js tests/unit/weighted.test.js tests/unit/scoring.test.js tests/unit/text.test.js scripts/build.mjs scripts/validate-content.mjs
   ```
3. **PR3** (revisor Pedro Augusto):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/gdd "docs: GDD v1 e geração do PDF" $GH_PA docs/gdd.md docs/PASSOS.md scripts/gdd.sh
   ```
4. **[MANUAL]** Settings → Actions → General → Workflow permissions → **Read and write**.
5. Configurar o repositório (cria variáveis, label `alerta`, branch `observabilidade` e environments; o revisor da produção é o Vitório):
   ```bash
   bash $SRC/scripts/setup-repo.sh phenrique2407/JogoWeb $GH_VM
   ```
6. **PR4** (revisor Vitório):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/esteira "ci: esteira mínima, publicação em /hml/ e release" $GH_VM .github/workflows/esteira.yml scripts/lib-pages.sh scripts/publicar.sh scripts/setup-repo.sh pages
   ```
7. Depois do merge, em **Actions** confira `ci` e `deploy-hml` verdes.
8. **[MANUAL]** Settings → Pages → *Deploy from a branch* → `gh-pages` / root (a branch só existe depois do 1º `deploy-hml`).
9. Travar a `main` (PR + 1 revisão + check `ci`): `bash scripts/setup-repo.sh phenrique2407/JogoWeb $GH_VM protecao`
10. `git tag -a v0.1.0 -m "Esqueleto andando" && git push origin v0.1.0`. **[MANUAL]** Edite as notas da Release (Releases → Edit).
11. **[MANUAL]** Em `THIRD_PARTY.md`, preencha autoria e licença do `apresentador.png`: `git switch -c feature/licenca-apresentador`, edite, `git commit -am "docs: licença do apresentador"`, `git push -u origin HEAD`, `gh pr create --fill --reviewer $GH_VV`.
12. Para **ver o jogo** no Codespace: `npm ci && npm run build && npm run serve` e abra a porta 4173 na aba **Ports**.

## Pedro Augusto: Versão 2 (10/10) → v0.2.0
0. Passo 0 (com `N=2`).
1. **PR5** (revisor Pedro Henrique):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/testes "test: pirâmide de unidade e integração" $GH_PH tests/unit tests/integration eval vitest.config.js
   ```
   Confira no Codespace: `npm ci && npm run test:ci`.
2. **PR6** (revisor Vinícius):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/e2e "test: E2E de smoke e regressão" $GH_VV tests/e2e playwright.config.js
   ```
   **[MANUAL]** Na mesma branch, rode `npm run build && npm run e2e` (os E2E nunca rodaram; o Chromium já vem no Codespace). Corrija o que falhar com novos commits.
3. **PR7** (revisor Vitório):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/seguranca "ci: gitleaks, audit, SBOM, Dependabot e E2E em homologação" $GH_VM .gitleaks.toml .github/dependabot.yml .github/workflows/esteira.yml
   ```
   **[MANUAL]** Antes: `npm audit --omit=dev` para ver se há vulnerabilidade crítica.
4. Depois do merge, em Actions confira gitleaks, audit, SBOM e E2E em `/hml/` verdes.
5. `git switch main && git pull && git tag -a v0.2.0 -m "Qualidade e segurança" && git push origin v0.2.0`
6. **[MANUAL]** Anote para o relatório o bug real capturado por teste (alternativas `<h1>` sumindo: `tests/unit/text.test.js` e o E2E de regressão).

## Vitório: Versão 3 (11/10) → v0.3.0
0. Passo 0 (com `N=3`).
1. **PR8** (revisor Pedro Augusto):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/producao "feat: produção, entrega progressiva e rollback" $GH_PA scripts/rollout.sh .github/workflows/rollback.yml .github/workflows/esteira.yml
   ```
2. **[MANUAL]** Settings → Environments → `producao`: confirme que você é o revisor. Quando o `deploy-prd` pedir, clique em *Review deployments → Approve*.
3. Confira: `deploy-prd` verde, `https://phenrique2407.github.io/JogoWeb/rollout.json` com `estavel` preenchido e o jogo abrindo na raiz do site.
4. **PR9** (revisor Pedro Henrique):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/monitoramento "feat: monitoramento, alertas e DORA" $GH_PH .github/workflows/monitor.yml scripts/dora.mjs pages
   ```
5. **[MANUAL]** Todos: Watch → *All activity* no repositório (para receber os alertas). Rode *Actions → monitor → Run workflow* e abra `/status/`.
6. **[MANUAL]** Ensaio do rollback cronometrado (meta < 5 min): PR com defeito que passe nos testes (ex.: pontuação zerada em `src/core/game.js`, ajustando o teste de propósito) → aprove em produção → *Actions → rollback → Run workflow* → confira o `rollout.json` e o jogo voltando. Depois `git revert` por PR.
7. `git switch main && git pull && git tag -a v0.3.0 -m "Produção e monitoramento" && git push origin v0.3.0`
8. **[MANUAL]** Deixe o monitor rodando; Vinícius usará as métricas DORA no relatório.

## Vinícius: Versão 4 (12/10) → v1.0.0
0. Passo 0 (com `N=4`).
1. **[MANUAL]** Grave o `pitch.mp4` (até 90 s) seguindo `docs/roteiro-pitch.md`: gameplay da **produção**, legendas, trilha com licença registrada, consentimento de quem aparece. Arraste o arquivo para a pasta `submissao/` do Codespace (crie a pasta se preciso).
2. **PR10** (revisor Pedro Augusto). O `pr.sh` mescla a pasta e **mantém o seu `pitch.mp4`**:
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/pacote "feat: triagem como código e pacote de submissão" $GH_PA scripts/triagem.sh submissao .github/workflows/esteira.yml
   git rm -q submissao/LEIA-ME-PITCH.txt && git commit -m "chore: remove aviso do pitch" && git push
   ```
3. **PR11** (revisor Pedro Henrique):
   ```bash
   bash $SRC/scripts/pr.sh $SRC feature/relatorio "docs: relatório técnico e roteiro do pitch" $GH_PH docs/relatorio.md docs/roteiro-pitch.md
   ```
   **[MANUAL]** Na mesma branch, preencha `docs/relatorio.md`: prints **com data**, links, métricas do `status/dora.json` comparadas a 11 dias, **uma decisão de melhoria** e o efeito, retrospectiva e links dos PRs de cada um. Exporte em PDF (até 12 páginas): `pandoc docs/relatorio.md -o relatorio.pdf --pdf-engine=xelatex` (precisa de `sudo apt-get install -y texlive-xetex lmodern`) ou copie para um editor de texto.
4. **PR12** (revisor Vitório). **[MANUAL]** Revise cada pergunta e carta de `src/content/*.json` (o banco foi gerado por IA e ninguém conferiu), troque "PENDENTE" (AI-USAGE.md) e "PREENCHER" (THIRD_PARTY.md) pelos nomes e ajustes reais, e substitua os wireframes ASCII de `docs/gdd.md` por telas reais:
   ```bash
   git switch main && git pull && git switch -c feature/revisao
   # ...edite os arquivos...
   git add -A && git commit -m "docs: revisão humana das perguntas e do AI-USAGE" && git push -u origin HEAD
   gh pr create --fill --reviewer $GH_VM
   ```
5. **[MANUAL]** Teste de clone limpo: `git clone https://github.com/phenrique2407/JogoWeb.git /tmp/teste && cd /tmp/teste && npm ci && npm run lint && npm run test:ci && npm run build`.
6. `git switch main && git pull && git tag -a v1.0.0 -m "Entrega final" && git push origin v1.0.0`. Espere `ci` → `release` → `pacote`: o job `pacote` precisa terminar com **TRIAGEM APROVADA** e anexa o `submissao.zip` à Release.
7. **[MANUAL]** Baixe a **ficha de entrega** (`.txt` gerada na seção 10 do documento da avaliação) e anexe no AVA com o relatório em PDF e os links. Depois do `v1.0.0` só entra `fix:` por PR.
8. **[MANUAL]** Ensaie a apresentação com os 4 falando: 10 min de apresentação, 5 de demonstração ao vivo (falha injetada e rollback, quem conduz é o Vitório) e 5 de perguntas.

---

## Resumo do que é só de vocês (checklist)
- [ ] Convidar colegas e professor para o repositório `phenrique2407/JogoWeb`; os colegas aceitam o convite
- [ ] Criar o Codespace e entrar com `gh auth login` (Passo 0)
- [ ] Settings: Workflow permissions *Read and write*, Pages (`gh-pages`), environment `producao` com revisor
- [ ] Todos assistindo o repositório (alertas)
- [ ] Autoria e licença do `apresentador.png`
- [ ] Rodar o E2E antes de mergear o PR6 (nunca foi executado)
- [ ] Ensaio do rollback cronometrado
- [ ] Gravar o `pitch.mp4`
- [ ] Revisão humana das perguntas e cartas; AI-USAGE e THIRD_PARTY sem pendências
- [ ] Telas reais no GDD
- [ ] Relatório técnico em PDF com prints datados, DORA e retrospectiva
- [ ] Ficha de entrega no AVA e apresentação ensaiada

## Problemas comuns no Codespaces
| Sintoma | Solução |
|---------|---------|
| `refusing to allow ... workflow` no push | Refaça o login: `unset GITHUB_TOKEN; gh auth login -s workflow -s repo -w; gh auth setup-git` |
| `gh` diz que o token do ambiente está em uso | `unset GITHUB_TOKEN` (o `.devcontainer` já faz isso em terminais novos) |
| `pr.sh`: "não existe nesta versão" | Confira `echo $SRC` e se extraiu o zip da **sua** versão |
| Codespace sem Chromium/jq | *Codespaces: Rebuild Container* (ou `bash .devcontainer/setup.sh`) |
| Não consigo criar Codespace | Você precisa ser colaborador com acesso de escrita; aceite o convite |
| E2E em `/hml/` falha logo após o deploy | Pages ainda propagando; o job já espera a `version.json`, rode de novo |
| `npm audit` reprova | Atualize pelo PR do Dependabot |
| `gitleaks` reprova | Revogue o segredo **na hora**; só apagar o arquivo não basta |
