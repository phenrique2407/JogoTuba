---
title: "SHOW DO BITLHÃO — Game Design Document"
subtitle: "Versão 1.0.0"
author: "Pedro Henrique Dias Brito, Pedro Augusto Lombardi da Costa, Vitório Fraga Motta, Vinícius Rodrigues Vilaça"
---

# 1. Premissa
Muita gente não começa em tecnologia por não saber por onde ir ou por achar o estudo chato. **SHOW DO BITLHÃO** transforma o estudo em um programa de auditório arcade: perguntas de TI, um apresentador sarcástico e cartas que mudam a run. Público-alvo: iniciantes e estudantes de tecnologia (ensino técnico e superior). Problema atacado: o acesso a conteúdo de TI de forma curta, divertida e gratuita, direto no navegador.

# 2. Gênero e plataforma
Quiz roguelike com cartas (deckbuilding leve). Plataforma: **web estática** (desktop e celular), jogada só com clique/toque; funciona offline pelo `build.zip`.

# 3. Mecânicas-core
- **Loop principal:** responder perguntas em sequência; a cada 5 perguntas escolher 1 de 3 cartas (30 s); repetir até acabarem as vidas.
- **Vitória e derrota:** roguelike puro; não há vitória final. A partida termina quando as 3 vidas acabam (cartas ativáveis guardadas são descartadas). Meta: maior pontuação e recorde pessoal.
- **Tempo:** 35 s (fácil), 25 s (médio), 15 s (difícil), escolhido antes da partida. Tempo esgotado conta como erro.
- **Perguntas:** múltipla escolha (4 alternativas) ou verdadeiro/falso; temas: Redes, Front-end, Back-end, Ciência de Dados, DevOps e MySQL (uma matéria ou todas).
- **Pontuação:** 100 × dificuldade (1, 1,5, 2) × bônus de velocidade (proporcional ao tempo restante), ajustada pelas cartas.
- **Progressão:** a dificuldade sorteada sobe a cada bloco de 5 perguntas; cartas escolhidas moldam a run.
- **Cartas (80):** quatro raridades (comum 60%, rara 25%, épica 10%, lendária 5%). *Passivas* duram a run toda; *ativáveis* são de uso único e só uma pode ser usada por pergunta. Exemplos: Café com Leite, Trevo de 4 Folhas, Jackpot 777, Aposta Arriscada, Fênix.
- **O que se aprende:** a cada bloco o jogador revê conceitos de uma área de TI (portas e protocolos, tags e CSS, Python e Java, estatística, Git e CI/CD, SQL); cada resposta errada mostra a correta.
- **Perfil e ranking:** apelido livre, recorde e ranking local no navegador, sem senha, e-mail ou dado pessoal.

# 4. Referências
| Referência | Uso | Autoria / licença |
|------------|-----|-------------------|
| Jogo do Milhão | Formato de perguntas e apresentador | Inspiração (nenhum material copiado) |
| Clover Pit | Cartas com sorte, risco e sinergia | Inspiração (nenhum material copiado) |
| Jet Set Radio, Bomb Rush Cyberfunk, Persona, Sonic Adventure | Estética e música | Inspiração; áudio sintetizado por código |
| Regulamento Framework Arcade | Requisitos do protótipo | Framework Tecnologia em Softwares |


# 5. Esteira
```
commit -> PR (revisão + CI) -> main -> ci -> /hml/ (E2E) -> aprovação -> /releases/<sha>/ -> canário -> smoke -> 100%
                                                              ^ rollback automático se o smoke falhar
monitoramento (15 min) -> alertas (Issues) -> /status/ + DORA -> melhoria -> próximo commit
```
Repositório: https://github.com/phenrique2407/JogoTuba
