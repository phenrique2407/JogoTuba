# Changelog

Formato: Keep a Changelog + SemVer.

## [1.0.0] - 2026-10-12 - Entrega final
- INT-09 triagem como código (triagem.sh) e pacote de submissão gerado pela pipeline
- INT-10 relatório técnico e roteiro do pitch
- Revisão humana do banco de perguntas e dos registros (AI-USAGE, THIRD_PARTY)

## [0.3.0] - 2026-10-11 - Produção, entrega progressiva e monitoramento
- INT-07 produção em /releases/<sha>/, canário ou azul-verde, rollback automático e rollback.yml
- INT-08 monitoramento a cada 15 min, alertas como Issues, painel /status/ e métricas DORA

## [0.2.0] - 2026-10-10 - Qualidade e segurança
- INT-04 pirâmide de testes completa (unidade, integração e E2E) com cobertura mínima de 70% em src/core
- INT-05 gitleaks, npm audit, SBOM e Dependabot; homologação com E2E

## [0.1.0] - 2026-10-09 - Esqueleto andando
- INT-01 repositório e fluxo Git (README, branching, SQUAD, template de PR)
- INT-02 GDD como código (docs/gdd.md -> GDD.pdf na pipeline)
- INT-03 esteira mínima (lint, testes, build) e publicação em /hml/
- INT-06 build reprodutível: version.json, build.zip + SHA-256, GitHub Release por tag
- Jogo jogável: núcleo em src/core, conteúdo em JSON validado no build
