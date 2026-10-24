# Critérios de aceite — extraídos de `Avaliação.html`

Fonte de verdade: arquivo `Avaliação.html` entregue pelo usuário. Este checklist explicita os requisitos técnicos e as evidências necessárias. Marque como concluído somente após conferir evidência real; presença de arquivo não prova aprovação.

## Componente A — 10 integráveis (70% da nota)

| ID | Peso | Evidência principal | Critérios verificáveis |
|---|---:|---|---|
| INT-01 — Repositório e fluxo Git | 10% | Histórico, PRs revisados, tags, `SQUAD.md` | Repositório único; 4 integrantes colaboradores e professor leitor; `main` protegida (PR + 1 revisão + CI verde); branching documentado; Conventional Commits; tags SemVer anotadas (incluindo `v0.1.0` e `v1.0.0`); nome/RA/papel dos 4 em `SQUAD.md`; `.gitignore` sem build/segredos; ≥10 PRs revisados por pessoa diferente; cada integrante contribui em ≥3 integráveis; histórico entre tags legível. |
| INT-02 — GDD como código | 8% | `docs/gdd.md` → `GDD.pdf` | Premissa e problema de acesso à educação em tecnologia; público-alvo; gênero/plataforma; loop, vitória/derrota, progressão e aprendizado por fase; referências com autoria/licença; wireframes/telas de menu, HUD e fim; seção Esteira com diagrama e link do repositório; PDF gerado por pipeline, arquivado e válido; versão/data do GDD coerentes com a release. |
| INT-03 — Pipeline CI/CD | 15% | `.github/workflows/esteira.yml` e execução verde em clone limpo | Em `ubuntu-latest`: `npm ci` com lockfile, lint, unidade/integração, JUnit/cobertura; gitleaks, `npm audit`, SBOM; build, GDD PDF e `build.zip`; artefatos em cada execução; deploy `/hml/` + E2E; produção por environment `producao` com revisor; rollout, smoke e rollback; dispara em push/PR; `ci` como status check obrigatório; secrets/variables para credenciais; permissões mínimas por job; push até HML ≤15 min; nenhum passo manual exceto aprovação de produção. |
| INT-04 — Testes automatizados | 12% | JUnit, cobertura, Playwright | Lógica pura em `src/core/`; cobertura ≥70%; ≥15 testes unitários, ≥3 de integração e ≥2 cenários E2E; conteúdo JSON inválido quebra build; regressão abre jogo, inicia, completa fase 1 e exibe fim; E2E em HML e smoke em produção; falha bloqueia merge; pelo menos um bug real capturado e corrigido com teste de regressão citado no relatório; `eval/golden.jsonl` se conteúdo Opal/AI Studio for usado. |
| INT-05 — Segurança, licenças e IA | 10% | gitleaks, `npm audit`, SBOM, `THIRD_PARTY.md`, `AI-USAGE.md`, `LICENSE` | gitleaks no pipeline (idealmente pre-commit); `npm audit --omit=dev` falha em vulnerabilidade crítica; Dependabot ativo; SBOM CycloneDX/SPDX anexado à release; inventário de cada biblioteca/ativo com autor, link e licença; registro de ferramenta, finalidade, resumo do prompt, resultado aceito e revisão humana; relatórios disponíveis; nenhum ativo sem licença compatível; registro de IA consistente com Git. Credencial real no repositório exige revogação; plágio/ativo sem autorização é eliminatório. |
| INT-06 — Release versionada e empacotada | 10% | `build.zip`, SHA-256, `version.json`, GitHub Release | `npm ci` + `npm run build` reproduzem `dist/` sem passos manuais; `dist/version.json` contém SemVer, SHA e data; versão visível discretamente no jogo; `build.zip` + checksum em CI; cada tag gera GitHub Release com ZIP, checksum, SBOM, GDD PDF e notas revisadas; ZIP funciona offline; dois builds do mesmo commit têm conteúdo igual exceto data em `version.json`; hash em produção igual ao da release; pacote <25 MB. |
| INT-07 — Ambientes, rollout e rollback | 12% | `gh-pages`, `/hml/`, `/releases/<sha>/`, `rollout.json` | `gh-pages` como origem do Pages e escrita apenas pela pipeline; HML com build aprovado; releases imutáveis por SHA; carregador lê `rollout.json` (`estavel`, `anterior`, `canario`, `percentual`); canário ~10% ou azul-verde; versão fixa durante a sessão; falha de smoke aciona rollback automático; workflow manual `rollback.yml`; histórico registra autor/motivo; ensaio com defeito real, rollback <5 min e sem indisponibilidade. Alteração manual de produção é eliminatória para INT-07. |
| INT-08 — Monitoramento, alertas e DORA | 10% | `monitor.yml`, Issues, `/status/`, `scripts/dora.mjs` | Sondas a cada 15 min para produção/HML registram HTTP, latência e versão em `status/sondas.csv` na branch `observabilidade`; alertas `JogoForaDoAr` (não 200) e `LatenciaAlta` (>2s) como Issues com label `alerta`, fechamento automático quando normal; painel `/status/` com disponibilidade, latência, versão, percentual de canário e DORA; quatro métricas calculadas a partir do GitHub: frequência de deploy, lead time, taxa de falha e tempo de recuperação; comparação com baseline Carparts de 11 dias; decisão de melhoria e efeito documentados; registrar atrasos de schedule como limitação. |
| INT-09 — Build pública e pacote de submissão | 8% | `submissao/`, `triagem.sh` verde, URL pública, ZIP, manifesto | Pacote inclui `GDD.pdf`, `LINK_DO_JOGO.txt`, `build.zip` (com `index.html` e instruções offline), `pitch.mp4`, `MANIFESTO.sha256`; URL responde 200 e smoke passa; `pdfinfo` valida PDF com quatro seções obrigatórias; `ffprobe` confirma vídeo ≤90s; `SQUAD.md` lista exatamente 4 integrantes; prazo configurado não venceu; triagem executada e aprovada. Para concurso, compartilhar pasta Drive com acesso solicitado e testar em janela anônima. |
| INT-10 — Vídeo pitch e relatório | 5% | `pitch.mp4`, relatório técnico PDF até 12 páginas | Vídeo ≤90s apresenta proposta, conceito e diferencial; gameplay real da produção; trilha/imagens licenciadas e inventariadas; legendas; relatório descreve arquitetura e alternativas, evidências datadas e links por integrável, métricas DORA, retrospectiva honesta e PRs/contribuição dos quatro. |

## Componente B — banca (30% da nota)
- **Inovação e originalidade — 25%:** mecânica ensina tecnologia além de um quiz com pontos; diferencial claro.
- **Viabilidade técnica e execução — 25%:** demonstração ao vivo commit → produção, falha injetada, alerta e rollback; solução sustentável.
- **Qualidade do protótipo/jogabilidade — 30%:** colega joga 3 minutos sem explicação, entende, se diverte e aprende; sem bugs bloqueantes.
- **Apresentação — 20%:** clareza, tempo, divisão da fala entre quatro, qualidade do vídeo e respostas.

## Nota e fator individual
Nota = `(0,7 × componente A + 0,3 × componente B) × F`. Cada integrável tem nota 0–10 ponderada pelos pesos acima. Integrável ausente ou não funcional recebe 0–2. `F=1,0` se a pessoa tem commits e PRs revisados em ≥3 integráveis e participa da banca; `F=0,8` com contribuição em 2; `F=0,5` com contribuição em 1 ou nenhum.

## Relação com os critérios do plano de ensino
1. CI/CD: INT-03 e INT-07.
2. Git/rastreabilidade: INT-01.
3. Pipeline build/test/deploy: INT-03 e INT-05.
4. Docker/Kubernetes: parcial nesta avaliação, representado por artefato imutável (INT-06) e ambientes promovidos (INT-07); containers/orquestração fora do escopo.
5. Testes automatizados: INT-04.
6. Canary/blue-green e rollback: INT-07 + banca.
7. Monitoramento/observabilidade: INT-08.
8. Esteira completa: INT-09 + banca.
9. Requisitos de negócio/equipe: INT-02.
10. Comunicação visual: INT-10 + banca.
11. Pensamento analítico/resultados: INT-08 + retrospectiva.
12. Colaboração: INT-01 + fator individual.

## Requisitos transversais, regulamento e cronograma
- Tema: protótipo gamificado que facilite acesso à educação em tecnologia, com público-alvo e problema explícitos.
- Materiais do concurso: GDD, build jogável web/mobile e vídeo de até 90s. Link/arquivo corrompido, fora do ar ou atraso pode desclassificar na triagem.
- Squad de 4 pessoas fixas, com nome, RA e papel; cada integrante contribui no Git.
- Não coletar nome, e-mail, idade, localização ou dados identificáveis. Ranking, se existir, usa apelido local; telemetria apenas anônima/agregada, explicada no README.
- IA é permitida, mas uso relevante registrado e revisão humana obrigatória. Nada de imitar marcas/personagens/obras protegidas; autoria e licença dos ativos devem estar documentadas.
- O cronograma original indica prévia 05/10/2026, entrega/banca 09/10/2026 e prazo opcional do concurso 21/10/2026 às 23h59 (Brasília). Como essas datas podem já ter passado, verificar o prazo efetivo com o docente antes de usar a triagem para uma nova entrega.
- Depois de `v1.0.0`, somente correções `fix:` por PR e pipeline completa.
