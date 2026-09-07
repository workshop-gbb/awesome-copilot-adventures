# Changelog of the standard, v2.0.0 to v4.0.0

Kept for the reasoning behind the rules. The current standard is in `visual-standard.md`; where this file and that one disagree, the standard wins (no watermark, no glow, bars numerals, one-line divider titles, generated decks).

## What's new in v4.0.0 (2026-09-04)

- The skill is content- and deck-type adaptive. Reference decks are catalogs, not narrative
  templates.
- `Deck(profile=...)` supports executive, keynote, technical, workshop, training, sales, proposal,
  data-story, report, portfolio, demo, catalog, and standard profiles.
- Every content slide publishes visual family, archetype, and optional hero metadata.
- Charts, diagrams, and scenes publish their exact subtype.
- `census.py` validates size-aware family coverage, archetype coverage, repetition, and hero cadence
  instead of applying one raw 25 percent rule to every deck.
- `audit.py` no longer requires GitHub Copilot or deck-specific vocabulary in unrelated decks.
- "One component per slide" became "one dominant composition per slide", allowing evidence modules
  that reinforce the same conclusion.
- `audit_ux.py` enforces accessible images, video, SVGs, keyboard focus, live feedback, safe links,
  reduced motion, and viewport behavior.
- The showcase adds wide image, statement plus image, and before/after image comparison patterns.
- `upgrade_v4.py` adds v4 profile, taxonomy, accessible SVG names, live regions, and video transcript
  metadata to legacy generated decks without changing their visual content.

## What's new in v3.1.0 (2026-09-04)

Eight defects Paula found by eye in the Hooks Lifecycle deck, plus the review that followed. Every
one was fixed in the kit or in a gate, never on the slide, so no deck can reintroduce it. Reference:
`assets/example_deck_hooks_lifecycle_multi.html` (70 slides, three locales).

| Change | Detail |
|---|---|
| **One numeral system, agenda and divider** | The agenda rows used JetBrains Mono roman numerals while the dividers used the bar glyphs, so the promise the agenda makes and the divider that keeps it did not look like the same object. `roman_bars.roman_inline(numeral, h=34)` renders the divider glyphs at row scale, and `Deck._agenda_html()` uses it. `agenda--5` shrinks them to 28px. |
| **A zone owns its label band** | `Diagram.LABEL_BAND = 30`: no node may start inside the top 30px of a zone, because the zone label lives there and a longer language covers it (Paula caught "EM QUALQUER LUGAR" under the `subagentStart · Stop` card). `Diagram.render()` prints a build-time WARN naming node and zone; `audit_svg.py` TOUCH no longer exempts `zl` and `lanel` labels from node rectangles. A band 74px tall has no room for both: make the zone taller. |
| **A centred label may not leave its frame** | `audit_svg.py` OVERFLOW only measured escape past the right and bottom edges, so a pill label wider than its rounded rect on BOTH sides passed ("stdout → decision"). It now measures the widest escape on any side. Components stop taking hard-coded pill widths: `scenes_kit.PILL` grows to fit its label around the same centre. |
| **A framed box may not hide its own content** | `qa_deck.py` gained a `clip` check: any bordered or paper box whose `scrollHeight` exceeds its client height fails. This is the general form of the fixed-`min-height` and clipped-code defects of v3.0.0. |
| **The product mark never breaks a kicker** | `decorateProductNames()` skips any element whose computed `text-transform` is `uppercase` and whose text is 34 characters or shorter. A chip label, rubric key or phase tag is one typographic unit; the injected mark was splitting "COMPATÍVEL COM CLAUDE" over three lines. Marks belong on prose headings. |
| **Sequence is a diagram shape, not a tab strip** | Two IDEs speaking two dialects was a `C.tabs` with a paragraph in each panel, which shows the facts but not the exchange. It is now `Diagram.lifeline` / `activation` / `message` / `selfmsg`, read top to bottom, payload named on every arrow. `message(..., dashed=True)` switches to `.c--dashed`, because the draw animation owns `stroke-dasharray` and an inline dash array was silently ignored. |
| **An interactive answers with a mechanism** | Paula on the old decision simulator: "não entendi nada dessa imagem, confuso, não dá pra saber reconstruir". A picker plus three abstract bars gives a verdict nobody can rebuild. New `C.chainsim`: the call walks a visible chain of controls, the stage that stops it lights up in its own colour, controls the chosen policy does not have are dashed and greyed, stages after the stop read "never reached", and the verdict carries its reason. |
| **`window.I18N` must be published** | The bug the audit found. `runtime.js` resolves translatable attributes (`data-*-k`) through `window.I18N`, but the skeleton declared the bundle as a top level `const`, which is not a property of `window`. `tr()` and `retranslate()` had been silently falling back to their English `data-*` attributes: every interactive turned monolingual the moment its slide was left and re-entered, in all three locales. One line in the skeleton: `window.I18N = I18N;`. |
| **Gates must see the end of the animation** | `shots.py` waits 4200ms, not 2600ms, so contact sheets and audits look at the final state. A scene whose last beat lands after that has a dead beat: scene II now finishes at ~3.1s instead of ~3.8s. |
| **A node that can stop the flow looks like one** | `kind='block'` plus `color=` tints and outlines a node in its own colour (`.dg .n--block`). Without it a legend entry like "can block" names a distinction the diagram never draws. |
| **The Who slide is optional** | It belongs where the room does not know who is speaking: a deck sent ahead, a broad internal audience, an asset that circulates without her. In a workshop she is about to run it spends the first minute on the speaker instead of the subject. `Deck.who()` is simply not called, and the closing slide carries the attribution. |

## What's new in v2.6.0 (2026-09-04)

Revisao do uso do canvas nos slides estruturais, com o deck GitHub Copilot Hooks Lifecycle v3.1.1
como referencia (`assets/example_deck_hooks_lifecycle_multi.html`). Veredito da Paula sobre o
divider anterior: "esta muito poluido". O que vale agora:

| Change | Detail |
|---|---|
| **Divider = algarismo, titulo, subtitulo. Nada mais.** | O divider e um slide escuro com TRES elementos: `.section-number` (algarismo romano em JetBrains Mono Light, 320px, na cor da parte), `.section-title` (76.8px) e `.subtitle` (22px, ate duas linhas, `max-width: 1040px`). O bloco fica centralizado verticalmente pelo `justify-content: center` do `.slide` e ocupa a altura util inteira. **Proibido no divider:** eyebrow (o texto azul em mono acima do algarismo), `.chaprail` (o trilho de numerais romanos no rodape), story-chip, "Parte N de IX", faixa de slides da parte, lista de temas, anel ou qualquer grafico. Esta regra substitui as linhas "Divider sem lista de temas" e "Algarismo do divider e cabecalho, nao poster" da v2.5.0 e o `.chaprail` da v2.3.0. |
| **Capa: uma so forma, medida** | O padrao e a capa do deck BTG (`assets/example_deck_btg_multi.html`): `<h1 class="title">` com EXATAMENTE duas linhas, cada uma uma frase completa terminada em ponto, a primeira em tinta e a segunda em `.accent-blue` (#00A4EF). Tipografia fixa: Inter **Medium (500)**, 82px, `line-height: 1.06`, `letter-spacing: -0.02em`, `white-space: nowrap` por linha, bloco centralizado verticalmente. Nao e semibold: a capa BTG medida em screenshot da Paula tem haste de 0.112 da altura da caixa, que e Inter 500 (600 daria 0.127). Nenhum outro elemento na capa. Quatro linhas, ou "GitHub Copilot" sozinho na primeira linha, nao sao a capa: o produto entra no Sobre e na agenda. Fontes SEMPRE embutidas em base64 (`harden_deck.py`): um deck que carrega Inter do Google Fonts cai em Helvetica/SF quando a rede bloqueia, e a capa aparece "com outra fonte". `fitTitleLines()` continua como rede de seguranca, mas uma capa que precisa dele nas tres linguas esta com a frase longa demais: reescreva a frase. |
| **Capa final (fechamento) enche o canvas ate a margem** | Slide escuro: eyebrow "Closing" (unico lugar onde o eyebrow azul continua), titulo em duas linhas (segunda no accent), tagline em italico, e abaixo uma grade `1fr 480px`: a esquerda duas colunas (Contato: nome, cargo, time, e-mail corporativo; Proximo passo: acao da plateia, sub-linha, "Published data · versao"), a direita um `.code-block` "quick rule" com tres ou quatro passos. O code-block termina na margem inferior do palco: e ele que preenche o canto que antes ficava vazio. |
| **Canvas cheio nos slides de conteudo** | Todo slide se mede pelo estado final da animacao: o conteudo desce ate ~60px da borda inferior. Slide curto ganha `slide--roomy` (tipo e respiro crescem) ou `slide--airy`; nunca um bloco pequeno flutuando no meio do palco. Slide que estoura ganha `slide--snug`, nunca tipo menor que 13px. |
| **Navegacao entre partes** | Com o `.chaprail` fora, a navegacao por capitulo e a agenda: linhas `<a class="ag" data-goto="N">` e a tecla `A`. O `AGENDA_INDEX` e os `data-goto` continuam gerados a partir da posicao real dos dividers. |
| **Censo reconhece o divider pelo algarismo** | `census.py` classifica DIVIDER por `class="section-number"` (e por `dvd__rom` em decks antigos). |


## What's new in v2.5.0 (2026-09-04)

Um deck de 118 slides voltou com o veredito "esta tudo muito monotono, muito igual". O diagnostico
foi objetivo: 47 dos 118 slides eram a MESMA grade de `.card` com texto dentro. O deck BTG, usado
como referencia de qualidade, tem quase um componente por slide. Isso virou regra.

| Change | Detail |
|---|---|
| **Um componente por slide, nunca a grade generica** | `.card` em grade e o fallback, nao o padrao. Antes de escrever um slide, pergunte que forma o conteudo tem: datas viram **linha do tempo**; fato mais consequencia vira **livro-razao** de duas colunas; camadas de defesa viram **zonas empilhadas com veredito por zona**; etapas com custo crescente viram **funil de largura decrescente**; sintoma mais correcao vira **par vermelho sobre verde**; explicacao de diagrama vira **mosaico de facetas coloridas**. Se tres slides seguidos usam o mesmo componente, dois deles estao errados. Gate: rodar o censo de arquetipos e nao aceitar mais de 25% dos slides no mesmo. |
| **Censo de arquetipos, antes de entregar** | `scripts/census.py` classifica cada slide pelo que ele realmente usa e conta a distribuicao. Qualquer arquetipo acima de 25% do deck e sinal de monotonia, e `--list <ARQUETIPO>` imprime a fila de trabalho do proximo lote. Rodar junto com os outros gates. |
| **Cor como codigo, nao como enfeite** | Cada dimensao recorrente ganha UMA cor fixa no deck inteiro, e ela nao muda de slide para slide: componentes azul, relacoes verde, decisoes violeta, nao funcionais teal, trade-offs ambar, riscos vermelho. A plateia aprende o codigo uma vez e le os cinco diagramas seguintes sem legenda. Sintoma sempre vermelho, correcao sempre verde. |
| **Divider sem lista de temas** (substituido em v2.6.0: sem story-chip e sem grafico) | O divider carrega algarismo, titulo, subtitulo em uma linha e o story-chip. **Nunca a lista dos temas da parte**: ela repete a agenda, briga com o trilho de capitulos no rodape e, com quatro itens de texto, empurra tudo para baixo. O que enche o canvas do divider e um grafico MUDO (anel de nove segmentos com o da parte atual no accent, desenhado em sequencia, orbita girando), nao mais texto. |
| **Algarismo do divider e cabecalho, nao poster** (REVOGADO em v2.6.0: o algarismo volta a ser poster, 320px, e o cabecalho sai) | O algarismo de 300px consome metade da altura util e joga titulo e subtitulo contra o rodape. Forma correta: linha de cabecalho com algarismo em 52px, filete, "Parte N de IX" e a faixa de slides da parte, tudo alinhado pela mesma baseline. |
| **Bloco didatico `.why`** | Todo slide de conceito fecha com tres respostas curtas, em cores semanticas: **por que isso importa** (azul), **o impacto na pratica** (verde) e **exemplo concreto** (ambar) ou **a armadilha** (vermelho). E o que transforma um slide de definicao em um slide que a plateia consegue usar. Tres colunas, 13px, nunca mais que tres linhas por bloco. |
| **Icone semantico em todo card** | O icone entra num `<span class="cico">` ANTES do `<h3>`, num grid de duas colunas de 22px, entao nao custa altura nenhuma. Nunca dentro do `<h3>`: `decorateProductNames()` ignora elemento que ja tem svg dentro, e a marca do produto para de aparecer. Rotulos `.k` usam o wrapper `.kico`. |
| **Paragrafo corrido que era lista** | Texto do tipo "A, sem shell B, saida estruturada C Falha tipica: D" e uma lista que perdeu os separadores na conversao. Vira `.attr`, uma fileira de chips, com o ultimo em vermelho quando e a falha tipica. Procurar por frases com mais de duas maiusculas internas. |
| **Colisao de nome de classe** | Antes de criar um componente, `grep -c '\.<nome> {' deck.html`. Um `.sim` novo caiu em cima de um `.sim` que ja existia como grid e o terminal renderizou deitado. Prefixo curto e proprio (`tsim`, `dvd`, `spt`, `apt`). |
| **`transform` do CSS anula o `transform` do SVG** | Marca posicionada com `transform="translate(x,y)"` no proprio `<g>` que recebe `transform: scale()` por keyframe salta para a origem. Sempre dois grupos: o externo com o translate, o interno com a classe animada. |
| **Orcamento de style inline** | Componente novo com `style="--cor:X;--i:N"` em cada item estoura o teto de 350 rapido. Cor vira classe utilitaria (`.c--blue` define `--cc`), stagger vira `nth-child`. Uma variavel de cor por deck (`--cc`), nao uma por componente. |
| **Reconstruir o slide, nunca remendar** | Trocar "o miolo" de um slide por regex deixa markup antigo para tras e o slide passa de 720. A operacao correta e reconstruir: abertura, eyebrow, titulo, lead, corpo novo. Helper `rebuild(html, idx, body)`. Depois de qualquer troca, conferir que o arquetipo antigo sumiu. |
| **Extrair card com contagem, nao com regex** | `.card` tem `<div>` aninhado (o `.kico` com svg). Regex com lookahead perde ou junta cards. Usar um extrator que conta abertura e fechamento de `div`. |
| **Insercao de slide e permutacao completa** | Inserir slides quebra `data-goto` da agenda e dos trilhos, as faixas "slides X a Y", o `AGENDA_INDEX`, as chaves `sN` das notas E as referencias "para o slide N" dentro do texto das notas. Tudo recalculado por script a partir da posicao real dos dividers, nunca digitado. |
| **Heroi por parte** | Cada parte do deck ganha pelo menos um slide-heroi: cena SVG animada, simulacao fiel de terminal, interativo sem spoiler ou calculadora. Um deck de nove partes com quatro herois ainda esta monotono. |

### O censo de arquetipos

`python scripts/census.py deck.html` imprime a distribuicao e falha (exit 1) quando um arquetipo
passa de 25% do deck. `--list <ARQUETIPO>` lista os slides daquele arquetipo. O nucleo:

```python
def kind(x):
    for c, n in [('dvd__rom','DIVIDER'), ('class="section-number"','DIVIDER'), ('cover2','CAPA'), ('class="who','SOBRE'),
                 ('class="agenda','AGENDA'), ('data-run=','INTERATIVO'),
                 ('class="scene"','CENA'), ('class="dg"','DIAGRAMA')]:
        if c in x: return n
    k = []
    if '<table' in x or 'class="dt"' in x: k.append('tabela')
    if 'class="card' in x: k.append('cards')
    return ' + '.join(k) or 'OUTRO'
```

## What's new in v2.4.0 (2026-09-03)

Um deck entregue apareceu com a capa cortada na direita em pt-BR. A QA nao pegou porque media com a fonte errada e nao tinha gate horizontal. Tudo abaixo virou regra.

| Change | Detail |
|---|---|
| **Medir com a fonte real, sempre** | O deck carrega Inter e JetBrains Mono. Se o ambiente de QA nao tem essas fontes instaladas (sem rede para fonts.googleapis.com), o Chromium mede com fallback e TODA medida, horizontal e vertical, e ficcao. Instalar antes de qualquer QA: `npm pack @fontsource/inter @fontsource/jetbrains-mono`, converter os woff2 latin para ttf com fonttools, jogar em `~/.fonts`, `fc-cache -f`. Conferir com `fc-list` + `grep -c Inter`. |
| **Fontes embutidas no deck** | O HTML entregue carrega Inter (300-700) e JetBrains Mono (400-600), subset latin, como `@font-face` base64 no lugar do link do Google Fonts (~250 KB). O deck fica identico offline, em workshop sem wifi, e a QA mede o que a plateia ve. Aplicado por `scripts/harden_deck.py`. |
| **Gate horizontal (`audit_width.py`)** | `qa_overflow.py` so compara `scrollHeight` vs `clientHeight`: uma linha `white-space: nowrap` mais larga que a caixa NUNCA aparece ali, porque o bounding box fica do tamanho da coluna e o texto e simplesmente cortado. `scripts/audit_width.py` mede os dois casos por slide e por lingua: `scroll` (`scrollWidth > clientWidth`) e `rect` (caixa fora do palco). Rodar nas 3 linguas junto com `qa_overflow.py`. |
| **Capa que nunca corta (`fitTitleLines()`)** | A regra "cada frase em uma linha, 82px, medir nas 3 linguas" agora e automatica: se qualquer linha do titulo de capa (ou de um bloco `[data-fitlines]`) nao couber, o bloco INTEIRO encolhe junto, todas as linhas no mesmo tamanho, ate caber. Roda no `setLocale`, no `goToSlide` e de novo em `document.fonts.ready`. Nenhuma lingua corta, nunca. |
| **NBSP que solta (`relaxNbsp()`)** | Os NBSP que evitam orfas viram um bloco indivisivel; em coluna estreita (passo de flow, rail, card de 150-260px) esse bloco fica maior que a caixa e o texto e cortado. `relaxNbsp()` solta os NBSP um a um, no slide ativo, ate o texto caber. |
| **CSS de guarda horizontal** | `grid-auto-columns: minmax(0, 1fr)` (nunca `1fr` puro, que tem piso de min-content), `min-width: 0` em todo filho de grid, `max-width: 100%` no lugar de `1280px` (a area util e 1160px), `overflow-wrap: break-word` nos textos de coluna estreita. |
| **`slide--snug`** | Modificador de ajuste fino vertical: padding do slide, margens de eyebrow e titulo, linhas de tabela, cards, rail, code-block e watch. E a ferramenta padrao para os overflows de 5 a 25 px que so aparecem em pt-BR e es. |
| **Ordem do CSS importa** | O bloco de guarda entra como o ULTIMO `<style>` do documento. Dentro do `<head>` ele perde para o bloco de densidade 720p, que tem a mesma especificidade e vem depois. |
| **QA sozinha** | Rodar QA com PPTX ou outro job pesado em paralelo produz falso positivo: com CPU disputada a animacao nao assenta em 3 s e o script mede o estado intermediario. Um job por vez. |
| **Tolerancia** | `sh` ate 722 com `worst=None` e folga de padding, nao corte: nada de conteudo fica escondido. Acima disso, corrigir. |
| **Orfas com medida** | `audit_orphans.py` ignora caixa com menos de 260px, ignora capa e fechamento (cada linha e uma frase deliberada) e so acusa "duas palavras" quando a ultima linha ocupa menos de 45% da medida. |
| **Nunca `pkill -f`** | Mata o proprio shell que chamou. Matar por PID. |

## What's new in v2.3.0 (2026-09-02)

Lessons from the Anthropic on Azure GTM deck (`assets/example_deck_anthropic_on_azure_multi.html`, 94 slides, twelve diagrams, the reference for technical and compete decks). All of them are rules now.

| Change | Detail |
|---|---|
| **Flows and differences are drawn** | Any slide that explains architecture, a request path, a sequence, identity, data residency, a data layer, "where does X run" or product-vs-platform is an SVG diagram with nodes, zones, connectors and a legend, built with the helpers in `scripts/diagrams.py`. Never a table of chips or text boxes. Tables stay for numeric comparisons, positioning matrices and FAQs. Read `references/diagrams.md` before drawing anything. |
| **Official icons, always, in the content** | Every product or service in a diagram carries its official icon inside the node (Azure architecture icons, GitHub Octicons and brand marks, Anthropic/Claude marks, Databricks), from the sprite `assets/icons-sprite.svg` (41 symbols, inlined once as `#psIcons`). Never a hand-drawn or approximated logo; a missing icon gets a neutral glyph, never an invention. In prose, the engine's `decorateProductNames()` puts the icon next to the first occurrence of the product name in card titles, table first cells, rubrics and chips. The decorator never duplicates an icon that already sits beside the name. |
| **Diagram craft** | Connector labels never on the line (7px above, or 8px right of a vertical); connectors never cross a zone label; node text carries `data-w` and `fitDiagramText()` compresses only when the measured text overflows; legend on every diagram; entrance in sequence (`--d`), solid connectors draw, dashed fade, one traveling dot on an invisible track; all tokens, so dark slides need no extra rule. Gates: `qa_overflow`, `audit_arrows` and the duplicate-icon check, three locales, `QA_FULL=4`. |
| **Clickable agenda** (chapter rail REMOVED in v2.6.0) | The Agenda slide has clickable rows (`<a class="ag" data-goto="N">`) that open on the chapter divider; `A` returns to the agenda; dividers carry no `.chaprail` any more; a single `[data-goto]` click delegation in the engine serves both. Ranges and `data-goto` are generated from divider positions, never typed. |
| **No slide counter** | The chrome shows only the brand. `.deck-controls { display: none !important; }`; the `#counter` element stays in the DOM for `goToSlide()` and the QA scripts. Progress line stays. |
| **Notes follow the slide** | Inserting, moving or reordering slides is a permutation applied by script: notes re-keyed, "slide NN" references remapped, end-of-chapter transitions rotated, spelled numerals swapped with the roman ones, agenda ranges and rails regenerated. Never edit numbers by hand. |
| **PPTX in Segoe, fully editable, faithful** | Every text run uses the Segoe family (`Segoe UI`, `Segoe UI Semibold`, `Segoe UI Light`); mono runs use `Cascadia Mono`. The PPTX is the HTML deck native: same order, texts, colors, positions and notes; every card a shape, every table a table, every diagram a group of native shapes, every icon a small PNG from the sprite. Nothing flattened. Visual QA by contact sheet against the HTML. |
| **Narrative order** | Compete before closing: the client compares before signing. Internal-only slides go to the last chapter, before the closing slide, never in the middle of a client-facing chapter. |

## What's new in v2.2.2 (2026-09-03)

- **Animated SVG scenes.** Reference `references/svg-animation.md`: the CSS-on-inline-SVG recipe (no library, no JS). Entrance beats chained with `animation-delay`, ambient loops afterwards, `.slide[data-active="true"]` as the trigger so it replays on return, gradients for depth, `<clipPath>` for a horizon. **Hard rule: SVG `<text>` never wraps** — any label longer than a few words goes in an absolutely positioned HTML overlay above the SVG.
- **Icon system, two sprites.** `assets/icons_extra.py` adds 30 line icons on the same 24x24 stroke system, used with `ico("name")`. `assets/brand_sprite.html` carries the official product marks, used with `bico("name")`; ids are namespaced per symbol so the same mark can be inlined many times without gradient collisions. Put a brand mark only where it disambiguates a provider; use line icons everywhere else.

## What's new in v2.2.1 (2026-09-02)

- **Facts before slides.** Any slide that names a product capability (hooks, custom agents, subagents, model selection) is written from the official docs fetched on the day (code.visualstudio.com/docs/agents/*, docs.github.com/en/copilot/reference/*). Never invent config fields.
- **Repeat-audience pattern.** Agenda rows carry a tag per part: "novo hoje" / "recap · sessão X" / "X visto · novo: Y". Recap slides drop to ~1 min in the notes.

## What's new in v2.2.0 (2026-09-01)

Lessons from the BTG Pactual deck (`assets/example_deck_btg_multi.html`, the reference for Microsoft-facing decks). All of them are rules now.

| Change | Detail |
|---|---|
| **Palco fixo 16:9 escalado** | `.deck` e 1280x720 fixo, centralizado e escalado com `transform: scale(min(vw/1280, vh/720))`. A composicao validada em 1280x720 e a mesma em qualquer tela ou projetor. Brand, switcher e hints escalam junto. `body` recebe a cor do slide ativo. Nunca usar `vw`/`vh` em fontes de slide. |
| **Chrome minimo** | Barra superior so com a marca (18px, opacity .85), SEM nome/cargo. Seletor de idioma visivel SO na capa (`body[data-on-cover]` via MutationObserver). Sem passador de slides, sem botao REPLAY. Navegacao por teclado (setas, O, N, F). |
| **Marca por canal** | Deck Microsoft-facing (cliente, evento): marca = 4-square Microsoft, discreta, no header, no favicon; nunca o `</.>` pessoal nem canais pessoais. Deck do canal pessoal: `</.>`. `Microsoft Americas` e permitido na linha de time. |
| **Capa e Sobre** | Capa = so titulo em duas linhas (segunda em azul), 82px, cada frase em uma linha. Sem eyebrow, subtitulo, tags, grafo decorativo, logo grande, metadados ou data. Slide 2 = "Sobre": foto circular (base64), eyebrow, titulo "Quem fez isso, e por que.", citacao com barra azul, 2 paragrafos sobre o CONTEUDO do deck, linha de contato so com o e-mail corporativo. |
| **Dividers** | Sem eyebrow: so o algarismo romano colorido, titulo e subtitulo. Agenda usa o mesmo algarismo colorido. (v2.6.0: sem story-chip, sem chaprail, sem lista de temas, sem grafico.) |
| **Tipografia sem orfas** | `text-wrap: balance` em titulos, subtitulos, legendas, paragrafos e descricoes de card; spans dentro de cards viram `display:block`. Frases que nao podem quebrar recebem NBSP. Verificar com `scripts/audit_orphans.py` nas 3 linguas. |
| **Setas nunca sobre texto** | Em SVGs, conectores comecam/terminam com folga em relacao aos rotulos; caminhos de `animateMotion` sao invisiveis e separados do desenho. Verificar com `scripts/audit_arrows.py`. |
| **Interativos sem spoiler** | Nada pre-selecionado: toggles neutros, checkboxes desligados, painel de resultado vazio ate a 1a resposta e atualizando a cada clique (nunca "so no fim"). Regra do assessment: degrau = numero de SIM, proximo passo = primeiro NAO. Contador "n / 5" enquanto incompleto. |
| **Simulacoes fieis** | Chat/terminal com barra de rolagem visivel e auto-scroll a cada caractere digitado, para a ultima mensagem nunca cortar. Hooks (preToolUse) aparecem ARMADOS no inicio da execucao e o bloqueio no fim; no painel de estado o no de hooks fica logo abaixo do orchestrator. Marcas de veredito sobre area vazia, nunca sobre o conteudo. |
| **Anel do harness** | `.ring-live`: segmentos com `stroke-linecap: butt` e gap uniforme sobre trilha cinza, `pathLength="100"` + dashoffset para desenhar em sequencia, nucleo com scale-in, orbita tracejada girando e um ponto percorrendo o anel. Nunca `stroke-linecap: round` em arcos adjacentes. |
| **Canvas cheio** | Auditar cada slide em contact sheet no estado FINAL da animacao (`QA_FULL=4`). Cards com metade vazia ganham um bloco de fechamento; listas curtas crescem em fonte/padding; paineis com buraco no meio reorganizam. |
| **Vocabulario** | Termos em ingles que a plateia conhece: `gate` e `hook`; nunca "portao"/"compuerta". Narrativa de eficiencia: tokens, consumo, tradeoff, loop saudavel, harness > modelo; nunca fatura, billing, creditos, US$, custo por PR (use tokens por PR). **Excecao (v2.5.0):** num deck cujo ASSUNTO e a plataforma, o nome real do produto (AI Credits, Claude Consumption Units) e fato tecnico e pode aparecer; a proibicao vale para a narrativa de eficiencia, nao para nomear o produto. Nomes de dominio do exemplo devem ser do repositorio (`fees.instructions.md`, `src/fees/**`). |
| **Reprise numerica** | O slide de callback da historia repete os numeros do gancho em uma regua antes -> depois (valor antigo riscado em vermelho, novo em verde). |

## What's new in v2.1.0 (2026-07-01)

| Change | Detail |
|---|---|
| **Clone-first obrigatorio** | Todo deck NASCE clonando o esqueleto canonico (`assets/example_deck_multi.html`, ou o ultimo deck aprovado da mesma familia quando for atualizacao) e removendo o conteudo, com o engine intacto. Criar CSS ou JS de deck do zero e proibido: e a causa raiz comprovada de decks fora do padrao. |
| **Pattern research obrigatorio** | Antes de desenhar qualquer slide: abrir `assets/showcase.html`, o example deck e ate 2 decks anteriores da mesma familia. Layout novo entra no `showcase.html` como pattern documentado na mesma entrega. |
| **audit.py estrutural** | Namespace de tokens (todo custom property do `:root` comeca com `--ps-`), I18N aninhado (chaves flat reprovam), favicon presente, teto de 350 inline styles em elementos de conteudo. |

## What's new in v2.0.0 (2026-06-10)

| Change | Detail |
|---|---|
| **Logo** | O logo pessoal arredondado `</.>` (paleta `#FF3133 / #7ED956 / #FFDE59 / #39B8FF`) no deck do canal pessoal. |
| **Favicon** | Todo deck HTML embute o favicon como data URI. |
| Acentos inalterados | A paleta Microsoft continua sendo a paleta de ACENTOS dos slides. So a marca mudou. |
