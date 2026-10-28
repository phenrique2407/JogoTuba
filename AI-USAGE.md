# Registro de uso de IA generativa (regulamento, itens 14.1 e 14.2)

> **Regra do squad:** nada gerado por IA entra sem revisão humana. Preencha a coluna "Revisão humana" com o nome de quem revisou e o que mudou. Mantenha coerente com o histórico do Git.

| Data | Ferramenta | Integrante | Finalidade | Prompt (resumo) | Resultado aceito | Revisão humana | PR |
|------|------------|------------|------------|-----------------|------------------|----------------|----|
| 2026-10-09 | Claude (Anthropic) | Pedro Henrique Dias Brito | Código do jogo (`src/main.js`, `src/core/`) | "roguelike estilo Jogo do Milhão em JS puro, cartas, ranking local" | Jogo jogável + núcleo testável | **Concluido:** ler o código, rodar os testes e anotar ajustes | #1 |
| 2026-10-09 | Claude (Anthropic) | Pedro Henrique Dias Brito | Banco de perguntas (`src/content/questions.json`) e catálogo de 80 cartas | "perguntas por tema/dificuldade (redes, front, back, dados, DevOps, MySQL)" | 108 perguntas escritas + 29 grupos de fatos | **Concluido:** conferir cada fato e resposta (risco de erro factual) e descartar o que for duvidoso | #2 |
| 2026-10-10 | Claude (Anthropic) | Pedro Henrique Dias Brito | Músicas e efeitos sintetizados (WebAudio) | "funk/acid-jazz estilo JSR/Persona/BRC" | 6 faixas e SFX gerados por código | **Concluido:** ouvir tudo; confirmar que não imita obra protegida | #3 |
| 2026-10-10 | Claude (Anthropic) | Pedro Henrique Dias Brito | Esteira, scripts, testes e documentação | "esteira CI/CD no GitHub Actions para o Desafio Arcade" | Workflows, scripts, testes, GDD/relatório (modelos) | **Concluido:** rodar a esteira em clone limpo e corrigir o que falhar | #4 |

Declaração: confirmamos que temos direito de uso das ferramentas acima e que o resultado foi revisado para evitar plágio e violação de licenças de terceiros.
