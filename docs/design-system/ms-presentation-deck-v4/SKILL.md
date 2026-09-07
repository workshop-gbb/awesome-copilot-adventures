---
name: ms-presentation-deck
description: "Cria e atualiza qualquer tipo de deck HTML no padrão paulasilva-ms: executivo, keynote, técnico, workshop, treinamento, vendas, proposta, data story, relatório, demo ou catálogo. O deck é trilíngue, offline, com speaker notes e presenter view. A narrativa e a composição são escolhidas pelo conteúdo, com diversidade validada de gráficos, diagramas, SVGs, ícones, tabelas, formas, animações, simulações e interações. Use SEMPRE que a Paula pedir deck, apresentação, slides, briefing, talk ou material visual para audiência, inclusive derivados em PDF ou PPTX."
---

# ms-presentation-deck (v4.0.0)

Sistema adaptativo de apresentações para Paula Silva. O padrão visual continua reconhecível, mas
nenhum deck nasce clonando a narrativa, a sequência ou a diagramação de um deck anterior. O conteúdo
define a forma; o catálogo fornece o repertório; os gates garantem qualidade e diversidade.

## Promessa central

1. **Qualquer tipo de deck.** Executivo, keynote, técnico, workshop, treinamento, vendas, proposta,
   data story, relatório, demo, portfólio ou catálogo.
2. **Uma fonte da verdade.** O entregável padrão é um HTML trilíngue, offline, com speaker notes,
   presenter view, navegação e acessibilidade.
3. **Design orientado ao conteúdo.** Datas viram timeline; proporções viram chart; troca entre atores
   vira sequence; arquitetura vira diagram; produto em uso vira simulation; decisão praticável vira
   interactive.
4. **Diversidade com coerência.** O deck alterna famílias e arquétipos visuais, mas nunca inventa
   dados, fluxos ou interfaces para cumprir quota.
5. **Alto padrão verificável.** Nada é entregue sem QA nas três línguas, contact sheets completas e
   o censo adaptativo de variedade.
6. **Referência não é slide pronto.** Imagens de diagramas, gráficos, tabelas, código ou explicações
   servem apenas de referência. Reconstruir o conteúdo como SVG/HTML nativo, com nova composição,
   rótulos trilíngues, fonte e animação semântica quando útil. Esta regra vale para todos os temas,
   perfis e revisões, não só para o exemplo que originou o pedido.

## O que mudou na v4.0.0

- `Deck(profile=...)` registra o tipo de apresentação: `executive`, `keynote`, `technical`,
  `workshop`, `training`, `sales`, `proposal`, `data-story`, `report`, `portfolio`, `demo`,
  `catalog` ou `standard`.
- Todo slide de conteúdo recebe `data-ps-family`, `data-ps-archetype` e, quando aplicável,
  `data-ps-hero`.
- Gráficos, diagramas e cenas publicam seu subtipo (`data-chart-kind`, `data-diagram-kind`,
  `data-scene-kind`).
- `census.py` mede famílias, arquétipos, repetição consecutiva e cadência de heróis. Os limites
  mudam com o tamanho e o perfil do deck.
- A regra agora é **uma composição dominante por slide**, não "um único componente". Um chart pode
  ter KPI e fonte; uma simulation pode ter um insight rail; um hero statement pode ter evidências.
- O deck BTG permanece apenas como artefato histórico. A referência de repertório é o
  `showcase_master_multi.html`; a referência de processo é esta skill.
- `audit.py` deixou de exigir conteúdo específico de GitHub Copilot e passou a ser aplicável a
  qualquer tema.

## Perfis

| `profile` | Quando usar | Espinha narrativa |
|---|---|---|
| `executive` | decisão, alinhamento, aprovação | contexto, sinal, opções, recomendação, decisão |
| `keynote` | palco, visão, mudança de perspectiva | tensão, reframe, prova, experiência, chamada |
| `technical` | arquitetura, engenharia, deep dive | sistema, mecanismo, fluxo, falhas, operação |
| `workshop` | sessão prática facilitada | orientar, demonstrar, praticar, discutir, aplicar |
| `training` | ensinar e verificar compreensão | objetivo, conceito, exemplo, exercício, check |
| `sales` / `proposal` | oportunidade e proposta | contexto do cliente, dor, valor, prova, plano |
| `data-story` | argumento guiado por dados | pergunta, contexto, padrão, driver, implicação |
| `report` / `portfolio` | status, governança, resultado | scorecard, progresso, risco, decisão, roadmap |
| `demo` | mostrar produto ou fluxo em uso | problema, caminho feliz, edge case, integração |
| `catalog` | biblioteca de padrões | agrupamento por família; exceção consciente de cadência |

Detalhes em `references/adaptive-decks.md`.

## Estrutura proporcional

| Slides de conteúdo | Estrutura recomendada |
|---:|---|
| 4 a 7 | capa, narrativa contínua, fechamento; sem agenda ou divider obrigatório |
| 8 a 15 | 2 ou 3 atos; agenda opcional |
| 16 a 35 | agenda e 3 a 6 partes |
| 36 ou mais | agenda e 5 a 10 partes, com checkpoints e resumos |

`who()` é opcional. Use quando o material circular sem a apresentadora ou a sala não souber quem
está falando. Em workshop conduzido por ela, a atribuição do fechamento é suficiente.

## Contrato de diversidade

- **Uma mensagem e uma composição dominante por slide.** Elementos de apoio são permitidos se
  reforçam a mesma conclusão.
- **Escolha semântica antes de variedade.** Nunca criar um gráfico sem dados, uma arquitetura sem
  relação real, uma simulação sem comportamento ou uma foto decorativa só para variar.
- **No máximo dois slides consecutivos do mesmo arquétipo** e, em apresentações comuns, três da
  mesma família. Perfis `data-story`, `report`, `portfolio` e `catalog` têm limites próprios.
- **Herói cedo.** Cada parte relevante apresenta uma cena, simulação, interação, statement forte ou
  composição explicitamente marcada como `hero=True` nos dois primeiros slides de conteúdo.
- **Rotação de mecanismo.** Quando houver quatro ou mais partes, preferir mais de uma família de
  herói: motion, simulation, interactive, diagram, media ou editorial.
- **Metas proporcionais**, aplicadas por `census.py`:

| Conteúdo | Famílias mínimas | Arquétipos mínimos |
|---:|---:|---:|
| até 5 | 2 | 3 |
| 6 a 10 | 3 | 4 |
| 11 a 20 | 4 | 6 |
| 21 a 35 | 5 | 8 |
| 36 a 60 | 6 | 11 |
| 61 ou mais | 7 | 14 |

Famílias disponíveis: editorial, data, process, structured, diagram, motion, simulation,
interactive, media e technical.

## Workflow

1. **Definir o perfil e a audiência.** Escolher `Deck(profile=...)`, duração, contexto de uso,
   decisão esperada e nível técnico.
2. **Fatos primeiro.** Capacidades de produto vêm de documentação oficial atual. Dados têm fonte,
   período, universo e amostra. Não inventar configuração, benchmark ou comportamento.
   Ao receber uma imagem técnica, identificar as entidades, relações, decisões e dados na fonte
   antes de redesenhar. Não estimar valores por pixels nem ampliar/cortar a imagem para usá-la
   como slide. Se os dados não estiverem disponíveis, usar um esquema conceitual explicitamente
   identificado, sem apresentar uma medição inventada.
3. **Escolher a narrativa.** Ler `references/adaptive-decks.md` e selecionar uma espinha adequada ao
   objetivo, sem copiar a ordem de outro deck.
4. **Montar o storyboard.** Para cada slide registrar: mensagem, evidência, pergunta visual,
   família, arquétipo, herói, fonte e interação.
5. **Escolher as formas e a experiência.** Abrir `assets/showcase_master_multi.html` e consultar:
   `patterns.md`, `ux-design.md`, `components.md`, `charts.md`, `diagrams.md`, `scenes.md`,
   `simulations.md` e `interactives.md`.
6. **Verificar cobertura antes de construir.** Alternar famílias, evitar séries de cards e planejar
   os heróis. Um deck de dados varia o tipo de chart; um workshop varia demonstração, prática,
   simulação e feedback.
7. **Construir com o builder.**

```python
from deck_builder import Deck
import components as C
from diagram_kit import Diagram

D = Deck(
    version='1.0.0',
    title=('EN', 'PT', 'ES'),
    file_stem='TopicCamelCase',
    profile='technical',
)
D.cover(line1, line2)
D.agenda()
D.part('I', 'red', title3, eyebrow3, subtitle3, notes3)

diagram = Diagram('request', 1120, 470, kind='request-path')
# ... zones, nodes and connectors ...
D.content(
    'red', eyebrow3, title3, diagram.render(), notes3,
    family='diagram', archetype='request-path', hero=True,
)
D.closing(close1, close2, code_title='quick rule', code_lines=[...])
D.write(topic_dir='decks/topic')
```

Componentes conhecidos são classificados automaticamente. Um layout customizado deve declarar
`family=` e `archetype=`; use `hero=True` quando ele for o momento principal da parte.

8. **Gerar e validar, um job por vez.**

```bash
python build_<topic>.py
python scripts/qa_deck.py deck.html
python scripts/audit_typo.py deck.html pt-BR,es,en
python scripts/diag_fill.py deck.html en
python scripts/audit_svg.py deck.html
python scripts/audit.py deck.html
python scripts/audit_ux.py deck.html
python scripts/census.py deck.html
python scripts/shots.py deck.html pt-BR shots/
```

9. **Olhar todas as contact sheets.** Screenshots são tiradas após 4200 ms. Verificar sobreposição,
   ritmo, repetição visual, labels, contraste, estado final de animação e legibilidade da língua
   mais longa.
10. **Entregar o HTML e parar.** PDF, público single-locale e PPTX só quando pedidos.

## Padrão visual em uma tela

- Palco 1280x720, 1160px úteis, Inter + JetBrains Mono embutidas.
- Dois fundos: light e dark. Sem gradiente de fundo ou glow decorativo.
- No modo escuro, palco, divisórias, fechamento e área externa usam o mesmo preto
  (`--ps-color-dark-bg: #000000`), sem faixa lateral ou mudança de tom. O tema claro mantém
  a mesma continuidade. Isso não transforma texto ou ícones em preto no fundo escuro.
- Capa: duas frases completas, a segunda azul, nada além do título.
- Capa, agenda, divisórias e fechamento usam os componentes estruturais de Hooks
  (`ps-deck-structure="hooks-v1"`), tanto nos temas existentes quanto nos futuros.
  O padrão é da moldura visual, não da narrativa, dos títulos ou da ordem dos slides.
- Agenda e dividers só quando a extensão da narrativa justificar.
- Divider: barras romanas, título em uma linha e subtítulo.
- Fechamento: título, tagline, contato e quick rule; sem bloco genérico de próximo passo.
- Cor comunica significado; a paleta Microsoft é o código, não decoração.
- Arquitetura, fluxo, sequência e dependência são diagramas com ícones oficiais.
- Diagramas e gráficos de referência são reconstruídos, nunca colados como imagens, nem mesmo
  quando a imagem original é oficial. Texto e relações precisam permanecer legíveis, completos
  e traduzíveis no palco. Retrato, marca oficial, fotografia contextual e screenshot usado como
  evidência factual de produto são ativos distintos; não classificar um diagrama como fotografia
  para passar no gate.
- Charts respondem a uma pergunta e exibem valores; imagens têm alt, fonte e propósito.
- Simulações mostram mecanismo real; interações atualizam no primeiro clique e não dão spoiler.
- Movimento termina antes do screenshot final, respeita reduced motion e não pisca acima de 2 Hz.
- Contraste é critério de aprovação: 4,5:1 no texto comum; 3:1 em texto grande e gráficos/controles
  significativos. Nada preto sobre fundo escuro. Marcas usam variante oficial adequada ou suporte
  neutro de contraste, nunca recoloração arbitrária ou filtro que inverte a imagem inteira.
- Variedade precisa ser perceptível na composição: alternar mecanismos, simulações, gráficos,
  diagramas, ilustrações nativas, exercícios, formas e sínteses. Mídia e vídeo só entram quando
  explicam algo e têm evidência/fallback. Passar no censo não autoriza uma sequência visualmente
  repetitiva de caixas, tabelas ou cards.

## Identidade

- Sem em dash no deck.
- Quando citado, **GitHub Copilot** sempre por extenso.
- Cargo: `Developer Solutions Advisor, Software Latam Leader`.
- Time: `Data & AI, Global Black Belt at Microsoft Americas`.
- Contato Microsoft: `paulasilva@microsoft.com`.
- Paleta: `#F25022`, `#7FBA00`, `#FFB900`, `#00A4EF`.
- Marca Microsoft no canal corporativo. `assets/paulasilva-logo.png` apenas no canal pessoal.

## Referências e ativos

- `references/adaptive-decks.md`: perfis, narrativas e cobertura visual.
- `references/visual-standard.md`: padrão visual e gates.
- `references/patterns.md`: repertório de composições e diagramacao.
- `references/ux-design.md`: UX, acessibilidade, mídia, interação e design didático.
- `assets/showcase_master_multi.html`: catálogo master de componentes, charts, diagramas, cenas,
  simulações, interações, mídia e código.
- `assets/example_deck_hooks_lifecycle_multi.html`: referência de workshop técnico completo.
- `assets/example_deck_btg_multi.html`: exemplo histórico, não template.
- `scripts/visual_taxonomy.py`: taxonomia compartilhada pelo builder e pelo censo.
- `scripts/census.py`: diversidade, repetição e heróis.
- `scripts/audit_ux.py`: foco, teclado, mídia acessível, feedback e reduced motion.
- `scripts/upgrade_v4.py`: migração sem alteração visual de decks v3 para metadados e UX v4.

## Regras de manutenção

1. Corrigir defeitos no kit ou no gate, não com CSS isolado no slide.
2. Novo componente precisa de classe própria, entrada no catálogo e classificação na taxonomia.
3. Novo chart, diagram ou scene publica seu subtipo.
4. Um gate que reprova o showcase sem motivo semântico está errado; um showcase que precisa burlar
   o gate deve declarar `profile='catalog'`.
5. Um deck de referência demonstra possibilidades; nunca determina a narrativa de outro deck.
6. Deck legado que precisa passar os gates v4 usa `upgrade_v4.py`; não se desabilita o gate.
7. Cada tema em `decks/<tema>/` mantém somente o HTML completo atual, com versão e data
   no nome. Versões anteriores ficam no `archive/` do próprio tema. A pasta `pptx/` fica
   reservada para exportações futuras por idioma; não gerar derivados sem solicitação.
8. Audiências diferentes que exigem decks distintos ficam em temas separados. Um HTML
   somente em português ou um tema ainda sem conteúdo é uma pendência, nunca um deck
   trilíngue aprovado.
9. Publicar com `D.write(topic_dir="decks/<tema>")`: o builder verifica a estrutura,
   preserva a versão anterior no archive e recusa sobrescrever a mesma versão com
   conteúdo diferente. `audit.py` verifica também o contrato estrutural de Hooks e
   a correspondência real entre agenda e divisórias.
10. `audit_ux.py` exige propósito explícito para imagens (`data-ps-asset-kind`: `portrait`, `brand`,
    `photo` ou `product-evidence`) e rejeita referências técnicas coladas ou sem classificação.
    Os componentes de mídia aceitam SVG autoral inline; imagens raster legítimas exigem
    `asset_kind=`. Declarar uma exceção não substitui a inspeção visual. Não alterar versões
    arquivadas para fazê-las passar; reconstruir e publicar uma nova versão.
