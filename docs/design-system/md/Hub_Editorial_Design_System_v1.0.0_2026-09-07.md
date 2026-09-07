---
title: "Hub Editorial Design System"
description: "Guia em português para replicar a linguagem visual do site de Paula Silva com um kit independente."
author: "Paula Silva"
date: "2026-09-07"
version: "1.0.0"
status: "review"
tags: ["design-system", "editorial", "css", "acessibilidade", "pt-br"]
---

# Hub Editorial Design System

Uma base reutilizável de cores, tipografia, componentes e composição, extraída do site de Paula Silva sem alterar sua implementação atual.

## Histórico de versões

| Versão | Data | Autora | Alteração |
|---|---|---|---|
| 1.0.0 | 2026-09-07 | Paula Silva | Extração e kit independente |

## Sumário

- [1. Qual é o design system do site?](#1-qual-é-o-design-system-do-site)
- [2. Princípios visuais](#2-princípios-visuais)
- [3. Fundamentos e tokens](#3-fundamentos-e-tokens)
- [4. Componentes e contratos](#4-componentes-e-contratos)
- [5. Como reutilizar](#5-como-reutilizar)
- [6. Comportamento e acessibilidade](#6-comportamento-e-acessibilidade)
- [7. Briefing para uma nova página](#7-briefing-para-uma-nova-página)
- [8. Validação e manutenção](#8-validação-e-manutenção)
- [9. Fontes, identidade e limites](#9-fontes-identidade-e-limites)
- [Referências](#referências)

## 1. Qual é o design system do site?

O site utiliza um **sistema visual próprio, editorial e tecnológico**, implementado principalmente em [CSS global][source-css] e no [layout Astro][source-layout]. O projeto tem Astro e React, mas não depende de Fluent UI, Material UI, Bootstrap ou shadcn/ui para esse visual, conforme o [manifesto de dependências][source-package].

**Hub Editorial** é o nome proposto para esta extração; não é o nome de uma biblioteca já publicada. A paleta pessoal usa quatro famílias de cor, mas seus valores não devem ser apresentados como a paleta oficial da Microsoft ou do Fluent UI.

O kit preserva o formato, não a identidade pessoal: hero escuro, contraste editorial, tipografia leve, metadados monoespaçados, faixas temáticas e grades pautadas. Não inclui o retrato, o mascote, a assinatura visual original, os dados, o conteúdo editorial ou as integrações de produção.

### 1.1 Entregáveis

| Arquivo | Papel | Reutilização |
|---|---|---|
| [foundation.html][showcase] | Catálogo visual da base CSS | Consultar padrões |
| [starter.html][starter] | Página completa de exemplo | Duplicar e adaptar |
| [tokens.css][tokens] | Valores e papéis semânticos | Base do sistema |
| [components.css][components] | Componentes reutilizáveis | Importar após os tokens |
| [hub.js][behavior] | Aprimoramentos opcionais | Tema, menu e demonstrações |
| [showcase.css][showcase-css] | Estilos do catálogo | Não exigido pelo template |
| [fonts/][fonts] | Fontes locais e licenças | Manter junto ao CSS |

São arquivos estáticos, sem instalação de framework, gerenciador de pacotes ou etapa de build para abrir o kit. Nenhum arquivo do site atual importa esses estilos.

## 2. Princípios visuais

1. **Conteúdo antes do efeito.** Use títulos leves, mensagens diretas e largura de leitura controlada. Evite transformar cada bloco em um painel decorativo.
2. **Ritmo editorial.** Separe capítulos com espaço e filetes de 1 px. Alterne narrativa, lista pautada, trilhas e catálogo.
3. **Cor com função.** Escolha uma cor por categoria ou seção. Reserve tons vivos para acentos, não para parágrafos sobre fundo claro.
4. **Duas vozes tipográficas.** Use Inter para o conteúdo e JetBrains Mono para rótulos, navegação, código e metadados.
5. **Contraste de superfícies.** Mantenha o hero e o fechamento escuros, inclusive no tema claro. Intercale superfícies neutras e faixas suaves.
6. **Geometria intencional.** Cards editoriais retos; cards de trilha com raio de 12 px; formas circulares apenas em elementos de identidade.

Evite gradientes decorativos extensos, sombras em todos os cards, botões sempre em formato de pílula e excesso de ícones. A faixa final de quatro cores e o efeito de marca-texto são exceções específicas, não uma licença para colorir todas as superfícies.

## 3. Fundamentos e tokens

### 3.1 Paleta original

Os valores desta tabela foram extraídos de [global.css][source-css]. Os nomes recebem o prefixo `--he-` no kit para reduzir colisões.

| Família | 50 | 100 | 500 | 700 |
|---|---|---|---|---|
| Vermelho | `#FFECEC` | `#FFD2D2` | `#FF3133` | `#C2191B` |
| Verde | `#EFFAE8` | `#D9F3C8` | `#7ED956` | `#3E8C20` |
| Azul | `#E7F5FF` | `#C9E9FF` | `#39B8FF` | `#0B6FAF` |
| Amarelo | `#FFF9DD` | `#FFF1B0` | `#FFDE59` | `#9C7E00` |

Use `--he-blue-500`, por exemplo, como valor primitivo. Para texto ou estado, prefira o papel semântico correspondente, como `--he-link` ou `--he-blue-ink`.

### 3.2 Neutros e temas

| Papel | Tema claro | Tema escuro |
|---|---|---|
| `--he-ink` | `#1A1A1A` | `#F0F0F0` |
| `--he-ink-2` | `#3A3A3A` | `#C7C7C2` |
| `--he-paper` | `#FFFFFF` | `#1C1C1A` |
| `--he-bg` | `#FCFCFB` | `#141414` |
| `--he-bg-alt` | `#F7F7F5` | `#191917` |
| `--he-rule` | `#E5E5E0` | `#2E2E2A` |
| `--he-rule-2` | `#CECEC7` | `#3A3A36` |

O hero preserva a superfície própria `#101012`, o texto principal `#F4F4F2` e o texto secundário `#BDBDB8`. A classe `he-inverse` cria um bloco escuro independente do tema da página.

### 3.3 Ajustes novos de contraste

A paleta original não é uma garantia de contraste para qualquer combinação. No kit, os valores vivos foram preservados e novos papéis de texto foram adicionados.

| Papel no tema claro | Original relacionado | Valor do kit |
|---|---|---|
| Texto discreto `--he-muted` | `#737373` | `#686864` |
| Texto verde `--he-green-ink` | `#3E8C20` | `#2D6817` |
| Texto amarelo `--he-yellow-ink` | `#9C7E00` | `#6A5500` |
| Texto azul `--he-blue-ink` | `#0B6FAF` | Sem alteração |
| Texto vermelho `--he-red-ink` | `#C2191B` | Sem alteração |

O valor original discreto permanece em `--he-ink-3-source` somente como referência. Não o escolha automaticamente para texto.

Exemplo medido com a fórmula de luminância relativa da [WCAG][wcag-contrast]: `#737373` sobre `#F7F7F5` resulta em aproximadamente **4,42:1**; o papel novo `#686864`, sobre o mesmo fundo, resulta em **5,22:1**. O verde original `#3E8C20` sobre branco resulta em **4,22:1**; `#2D6817`, em **6,77:1**.

Esses cálculos verificam pares específicos, não certificam o produto inteiro. Bordas decorativas claras não devem ser o único delimitador de um campo: use `--he-control-border` nos controles.

### 3.4 Tipografia

| Uso | Fonte / peso | Desktop | Mobile até 760 px |
|---|---|---|---|
| Hero | Inter / 300 | `clamp(40px, 5.4vw, 74px)` | `clamp(34px, 10.4vw, 44px)` |
| Seção | Inter / 400 | `clamp(28px, 3.6vw, 42px)` | `clamp(26px, 7.4vw, 32px)` |
| Título de card | Inter / 500 | 20 px | 18,5 px |
| Texto do hero | Inter / 400 | 18,5 px | 16,5 px |
| Corpo do kit | Inter / 400 | 16 px / 1,6 | 16 px / 1,6 |
| Rótulo do kit | JetBrains Mono / 500 | 12 px | 12 px |

Hero: entrelinha `1.04` e tracking `-0.035em`. Seção: entrelinha `1.14` e tracking `-0.025em`. Rótulos: tracking `0.12em`, texto curto e caixa alta quando útil.

Os rótulos de 12 px são uma **normalização nova**: o site possui diversos rótulos entre 9,5 e 11 px. O corpo do site parte de 16 px / 1,55 e chega a 15,5 px no mobile; o kit mantém 16 px / 1,6 para leitura e não tenta reproduzir esses detalhes menores literalmente.

### 3.5 Layout, espaço e movimento

| Regra | Valor | Origem |
|---|---|---|
| Container máximo | 1240 px, incluindo padding | Site |
| Padding lateral | 72 / 32 / 20 px | Site |
| Largura de leitura | Até 680 px | Site |
| Seções | 112 px; 72 px até 760 px | Site |
| Header desktop | Mínimo de 64 px no kit | Site usa altura de 64 px |
| Card editorial | Reto, filetes de 1 px | Site |
| Card de trilha | Raio 12 px, topo de 3 px | Site |
| Sombra da trilha | `0 12px 28px rgb(26 26 26 / 8%)` | Site |
| Curva de animação | `cubic-bezier(0.2, 0, 0, 1)` | Site |
| Transições comuns | 150–200 ms | Site |
| Alvo interativo mínimo | 44 × 44 px | Padronização do kit |

Breakpoints efetivos do kit:

- **1080 px:** navegação vira menu quando JavaScript está disponível.
- **980 px:** padding lateral passa de 72 para 32 px.
- **920 px:** hero e formulário passam para uma coluna.
- **760 px:** tipografia e seções usam medidas mobile; catálogo usa uma coluna.
- **560 px:** padding lateral passa para 20 px.

O formulário original muda em 820 px; no kit ele acompanha o hero em 920 px para simplificar a composição. Esses números são condições CSS explícitas: variáveis CSS não funcionam como condições de `@media`.

A escala nomeada de espaço é nova: `4, 8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96, 112 px`. Ela organiza medidas recorrentes; detalhes específicos, como padding de card de 30 px, continuam explícitos.

Não existe um grid obrigatório de 12 colunas no site. Use CSS Grid fluido; a régua de 12 divisões do catálogo é somente uma ilustração.

## 4. Componentes e contratos

| Componente | Classe principal | Contrato |
|---|---|---|
| Escopo visual | `he` | Aplicar no body ou wrapper |
| Container | `he-container` | Largura e padding responsivos |
| Header | `he-header` | Marca, navegação e ferramentas |
| Hero escuro | `he-hero he-inverse` | Um H1 e mensagem central |
| Seção | `he-section` | Label, H2 e introdução |
| Faixa temática | `he-band` | Uma família de cor |
| Catálogo | `he-grid he-grid--ruled` | Cards editoriais pautados |
| Card | `he-card` | Um link sem ações aninhadas |
| Trilha | `he-path` | Artigo com links próprios |
| Lista pautada | `he-ledger` | Títulos significativos |
| Botão | `he-button` | Ação com estado de foco |
| Campo | `he-field` | Label e mensagens associadas |
| Fechamento | `he-footer he-inverse` | CTA e links úteis |

Use `data-he-accent="red|green|blue|yellow"` em cards e faixas. O componente resolve a cor de texto correta para o tema por meio de `--he-accent-ink`.

Exemplo de card reutilizável:

```html
<a class="he-card" data-he-accent="blue" href="./guia.html">
  <span class="he-card__kicker">Guia</span>
  <h3 class="he-card__title">Um título que explica o conteúdo.</h3>
  <p class="he-card__description">Uma descrição curta e concreta.</p>
  <div class="he-card__meta">
    <span>Ler o guia</span>
    <span class="he-card__arrow" aria-hidden="true">&#8599;</span>
  </div>
</a>
```

O destino `guia.html` desse trecho é ilustrativo: crie a página ou troque pelo recurso real. No template completo, todos os links locais apontam para seções ou arquivos fornecidos.

### 4.1 Estados

- **Padrão:** hierarquia e affordance legíveis sem hover.
- **Hover:** alteração discreta de superfície ou borda; trilhas sobem 2 px.
- **Foco:** contorno de 2 px, offset de 3 px e cor adequada ao tema.
- **Ativo:** filtro com `aria-pressed="true"` e borda explícita.
- **Desabilitado:** atributo nativo `disabled`; não usar apenas opacidade.
- **Ocupado:** `aria-busy` quando houver operação real; a amostra visual é identificada como exemplo.
- **Vazio:** mensagem visível e ação para limpar filtros.
- **Erro:** mensagem textual, `aria-invalid` e associação por `aria-describedby`.
- **Confirmação:** `role="status"`; só confirmar ações realmente realizadas.

## 5. Como reutilizar

### 5.1 Abrir o pacote

1. Extraia o ZIP.
2. Abra [design-system/hub-editorial/foundation.html][showcase] para consultar os componentes da base CSS.
3. Abra [design-system/hub-editorial/starter.html][starter] para ver uma página sem os elementos de documentação.
4. Duplique o template e edite a cópia.

Preserve as pastas `design-system/` e `md/` juntas para que os links de documentação continuem funcionando. A página em si precisa apenas do HTML, dos dois CSS, das fontes locais e, opcionalmente, do JavaScript.

Não é necessário executar o site original. Os exemplos também abrem diretamente por `file://`, sem servidor.

### 5.2 Ordem de inclusão

Inclua os recursos no `head`:

```html
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="./tokens.css">
<link rel="stylesheet" href="./components.css">
<script src="./hub.js" defer></script>
```

Defina idioma, tema e escopo:

```html
<html lang="pt-BR" data-he-theme="light">
  <body class="he">
    <!-- Conteúdo da sua página -->
  </body>
</html>
```

O JavaScript não é obrigatório para a composição visual. Em outra aplicação, é possível usar somente os tokens e reimplementar os comportamentos com o framework local.

### 5.3 Adaptar a marca

Troque nome, textos, figura do hero e destinos dos links. A figura fornecida é uma composição abstrata; não é a marca pessoal de Paula Silva nem um logotipo oficial de fornecedor.

Para ajustes, carregue uma folha própria **depois** dos CSS do kit. Recalcule o contraste quando alterar cores.

```css
:root {
  --he-container: 1240px;
  --he-reading-width: 640px;
}

.minha-campanha {
  --he-accent: var(--he-blue-500);
  --he-accent-ink: var(--he-blue-ink);
}
```

Não transforme os exemplos de estado em um backend simulado. Se houver cadastro, busca remota ou autenticação, implemente contratos, validação no servidor, privacidade e feedback reais.

### 5.4 Levar para Astro ou React

- **Astro:** extraia o markup estático em componentes e reutilize as classes.
- **React:** converta `class` em `className` e controle tema, menu e filtros com estado do framework.
- **Outros frameworks:** mantenha o contrato visual, sem precisar transportar a implementação original do site.

Não inicialize `hub.js` e um controlador React sobre os mesmos elementos. O script do kit inicializa uma vez após o carregamento e não oferece lifecycle para SPA ou navegação com substituição de DOM.

O prefixo `he-` reduz colisões, mas não cria isolamento completo: `tokens.css` define valores no elemento raiz e `.he` aplica estilos aos descendentes. Em uma aplicação existente, revise o escopo e o tema antes de importar globalmente.

## 6. Comportamento e acessibilidade

O kit começa no tema claro, como o HTML do site de referência. O botão alterna os temas somente na página atual; não grava preferências, cookies ou dados em storage.

O menu usa botão nativo, `aria-controls`, `aria-expanded` e `hidden`. Escape fecha e devolve o foco ao botão; mudança para desktop reexibe a navegação. É um disclosure de navegação, não um diálogo modal.

Os filtros funcionam com teclado, combinam categoria e texto e anunciam a contagem. A busca normaliza maiúsculas e acentos. Não há requisição remota.

O formulário demonstra validação de **formato**, não existência de email, inscrição ou entrega. O fieldset começa desabilitado e só é habilitado depois que o bloqueio de envio e o tratamento local estão registrados; o campo não tem `name` e nenhum valor é enviado, salvo ou registrado em logs.

Sem JavaScript, a navegação fica expandida, os cards permanecem visíveis e o formulário explica sua indisponibilidade. Com movimento reduzido, as transições e deslocamentos decorativos são removidos.

Ao adaptar:

- Preserve um H1, hierarquia de títulos, landmarks e link para pular ao conteúdo.
- Use texto ou ícone com nome acessível para comunicar estados; não dependa só de cor.
- Use os números esmaecidos somente como decoração, com `aria-hidden="true"`.
- Teste 320 px, zoom, teclado e conteúdo real, inclusive títulos longos.
- Verifique contraste dos pares finais; preserve a legibilidade de campos e foco.
- Não anuncie conformidade WCAG completa apenas porque o kit passou nos testes descritos.

## 7. Briefing para uma nova página

Forneça este briefing junto com os arquivos do kit ao GitHub Copilot ou a outra ferramenta:

```text
Crie uma página usando o kit Hub Editorial fornecido.
Reutilize tokens.css e components.css; não troque o design system.

Preserve Inter, JetBrains Mono, hero escuro #101012, neutros claros,
acentos #FF3133 / #7ED956 / #39B8FF / #FFDE59, container 1240 px,
filetes de 1 px, cards editoriais retos e trilhas com raio de 12 px.

Componha cabeçalho compacto, hero, narrativa, trilhas, catálogo
e fechamento escuro. Use uma cor por categoria e títulos leves.

Use papéis semânticos de texto, temas claro/escuro, foco visível,
alvos de 44 px, navegação acessível e movimento reduzido.

Adapte marca e conteúdo ao projeto. Não invente métricas,
depoimentos ou integrações. Identifique todas as demonstrações.
Teste estados, teclado, responsividade e contraste.
```

## 8. Validação e manutenção

Antes de publicar uma adaptação, execute esta verificação:

1. Abra catálogo e template com e sem JavaScript.
2. Teste desktop e mobile, inclusive 320 px e os limites dos breakpoints.
3. Alterne os temas; confirme que o hero permanece escuro.
4. Navegue com Tab e Escape; confirme que o menu oculto não recebe foco.
5. Combine busca e categoria, produza um resultado vazio e limpe os filtros.
6. Teste o formulário vazio, inválido, válido e o reset.
7. Confira links locais, carregamento das fontes e ausência de requisições inesperadas.
8. Recalcule contraste e verifique movimento reduzido.

Este pacote é uma extração versionada, não sincronização automática com o site. Mude tokens na fonte CSS, atualize as amostras do catálogo e este guia na mesma revisão e repita a verificação após alterações.

## 9. Fontes, identidade e limites

O kit inclui os recortes latinos de **Inter variável, pesos 300–700**, e **JetBrains Mono variável, pesos 400–600**, obtidos do Google Fonts. Eles cobrem o conteúdo em português usado nos exemplos, sem chamadas externas em tempo de execução.

As duas fontes usam a **SIL Open Font License 1.1**. Preserve [OFL.txt][font-license] e [SOURCES.txt][font-sources] ao redistribuí-las. Para outros alfabetos ou itálicos, obtenha os arquivos correspondentes de fontes oficiais; não presuma que estes recortes cobrem qualquer idioma.

O pacote não concede direitos sobre fotografias, nomes, marcas ou conteúdos de terceiros. Nenhuma nova licença foi atribuída ao código do repositório de origem; as licenças incluídas aqui se aplicam às fontes.

Fora do escopo: biblioteca de componentes React publicada, arquivo Figma, backend, analytics, internacionalização completa, deploy e migração do site atual.

## Referências

1. [Site de referência: Agentic DevOps Hub][source-site].
2. [CSS global: tokens, componentes e breakpoints][source-css].
3. [Layout Astro: fontes, cabeçalho e fechamento][source-layout].
4. [Página inicial: composição e conteúdo][source-home].
5. [Manifesto de dependências do projeto][source-package].
6. [WCAG: Understanding Contrast (Minimum)][wcag-contrast].
7. [WCAG: Understanding Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html).
8. [Inter: licença OFL](https://github.com/google/fonts/blob/main/ofl/inter/OFL.txt).
9. [JetBrains Mono: licença OFL](https://github.com/google/fonts/blob/main/ofl/jetbrainsmono/OFL.txt).

As referências ao código apontam para o repositório original e podem evoluir. Os valores documentados representam a inspeção local e visual feita em 7 de setembro de 2026.

[showcase]: ../design-system/hub-editorial/foundation.html
[starter]: ../design-system/hub-editorial/starter.html
[tokens]: ../design-system/hub-editorial/tokens.css
[components]: ../design-system/hub-editorial/components.css
[behavior]: ../design-system/hub-editorial/hub.js
[showcase-css]: ../design-system/hub-editorial/showcase.css
[fonts]: ../design-system/hub-editorial/fonts/
[font-license]: ../design-system/hub-editorial/fonts/OFL.txt
[font-sources]: ../design-system/hub-editorial/fonts/SOURCES.txt
[source-site]: https://agenticdevopsplatform.ai
[source-css]: https://github.com/paulanunes85/paula-site/blob/main/src/styles/global.css
[source-layout]: https://github.com/paulanunes85/paula-site/blob/main/src/layouts/Base.astro
[source-home]: https://github.com/paulanunes85/paula-site/blob/main/src/pages/index.astro
[source-package]: https://github.com/paulanunes85/paula-site/blob/main/package.json
[wcag-contrast]: https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
