---
title: "Hub Editorial Studio"
description: "Storybook e showcase independentes para interfaces, dados, arquitetura, SVGs, animações e simulações."
author: "Paula Silva"
date: "2026-09-07"
version: "2.0.0"
status: "review"
tags: ["design-system", "storybook", "react", "svg", "arquitetura", "pt-br"]
---

# Hub Editorial Studio

Uma biblioteca de componentes e narrativas visuais para criar experiências consistentes com o formato editorial do site de Paula Silva, sem alterar o site de produção.

> [!NOTE]
> Este documento descreve o projeto de origem. O Awesome Copilot Adventures
> inclui apenas a [base CSS estática](../hub-editorial/README.md), não os manifestos,
> fontes React, testes ou Storybook completos. Os comandos e famílias descritos
> abaixo não representam funcionalidades instaladas nesta cópia. Para consultar
> a referência local, abra o [catálogo CSS](../hub-editorial/foundation.html).

## Histórico de versões

| Versão | Data | Autora | Alteração |
|---|---|---|---|
| 2.0.0 | 2026-09-07 | Paula Silva | Projeto React/TypeScript independente, Storybook e showcase ampliado |
| 1.0.0 | 2026-09-07 | Paula Silva | Base estática de tokens, componentes CSS e template |

## Sumário

- [1. O que este pacote é](#1-o-que-este-pacote-é)
- [2. Abrir o showcase e o Storybook](#2-abrir-o-showcase-e-o-storybook)
- [3. Famílias do catálogo](#3-famílias-do-catálogo)
- [4. Como escolher uma visualização](#4-como-escolher-uma-visualização)
- [5. Simulações e movimento](#5-simulações-e-movimento)
- [6. Reutilizar e criar stories](#6-reutilizar-e-criar-stories)
- [7. Qualidade, dados e marcas](#7-qualidade-dados-e-marcas)
- [8. Publicar o pacote estático](#8-publicar-o-pacote-estático)
- [Referências](#referências)

## 1. O que este pacote é

**Hub Editorial Studio** amplia o kit CSS para um projeto independente com duas experiências:

- **Showcase:** exploração visual por família, busca, temas, limite de largura da amostra, código e reinicialização.
- **Storybook real:** stories React, controles de propriedades, documentação automática e painel de acessibilidade.

A base visual continua própria: Inter, JetBrains Mono, hero escuro, neutros quentes, divisórias finas e quatro cores de destaque. Ela não é Fluent UI, Material UI ou uma reprodução de outro design system.

O catálogo reúne tipos comuns e permite expansão. “Completo” aqui significa que as famílias entregues têm implementação, exemplos e contratos; não significa abranger todas as variantes matemáticas, notações formais ou interfaces de produto existentes.

Consulte também o [guia da base CSS](./Hub_Editorial_Design_System_v1.0.0_2026-09-07.md), que distingue os valores extraídos do site das normalizações de contraste e espaçamento.

## 2. Abrir o showcase e o Storybook

No projeto de origem completo, os comandos abaixo requerem Node.js 22.12 ou superior.
A configuração era independente do site Astro. Nesta cópia, siga as
[instruções da base estática](../hub-editorial/README.md) em vez desses comandos.

```bash
cd output/design-system/hub-editorial
npm ci
npm run dev
```

Acesse `http://127.0.0.1:5177`.

Em outro terminal:

```bash
cd output/design-system/hub-editorial
npm run storybook
```

Acesse `http://127.0.0.1:6006`.

Os servidores escutam apenas na interface local. Não há acesso a contas Azure ou GitHub. O Storybook foi configurado sem telemetria de uso e sem consulta de atualização no comando de desenvolvimento.

### 2.1 Consulta sem servidor de desenvolvimento

```bash
npm run build:all
npm run preview
```

O showcase construído fica em `http://127.0.0.1:4177` e o Storybook em `http://127.0.0.1:4177/storybook/`.

O conteúdo construído não precisa de internet para executar as demonstrações. Aplicações com módulos JavaScript precisam de um servidor HTTP local; não abra o novo showcase ou o Storybook por `file://`.

A [base CSS](../hub-editorial/foundation.html) e o [template HTML](../hub-editorial/starter.html) continuam disponíveis nesta cópia para abertura direta.

## 3. Famílias do catálogo

O menu do showcase enumera os exemplos disponíveis; as contagens são calculadas a partir do registro de componentes, não digitadas como métricas promocionais.

| Família | Conteúdo | Interações e saída |
|---|---|---|
| Fundamentos | Cores, temas, tipografia, espaço, layout, superfícies, acessibilidade | Inspeção de tokens e amostras |
| Componentes | Botões, badges, cards, formulários, seleção, navegação, tabs, disclosures, overlays e feedback | Estados reais de interface |
| Tabelas e listas | Tabelas, ordenação, seleção, busca, paginação, hierarquia, timeline, checklist e quadro | Transformações locais dos dados |
| Gráficos | Formas de comparação, tendência, distribuição, composição, relação e planejamento | SVG, legenda e alternativa textual |
| Arquitetura | Vistas estruturais, comportamentais, de dados, entrega, implantação e confiança | SVG e fonte editável draw.io |
| Ícones | Conceitos de interface e desenvolvimento; assets de produto quando permitidos | Busca, controles e exportação |
| Ilustrações SVG | Cenas técnicas originais e escaláveis | Imagem vetorial, sem screenshots |
| Movimento | Transições e animações demonstrativas | Iniciar, pausar ou reiniciar |
| Simulações | VS Code, GitHub Copilot CLI, Azure Portal e GitHub | Jornadas locais por etapas |

### 3.1 Componentes básicos

A biblioteca cobre hierarquia de botões, estados ocupado e desabilitado, tags, badges semânticos, cards editoriais e cards de trilha.

Formulários demonstram campos de texto, email, senha fictícia, busca, textarea, select, checkbox, radio, switch e range. Mensagens distinguem validação de formato de qualquer operação real.

Navegação e feedback incluem breadcrumbs, paginação, abas, accordion, dialog, drawer, toast, alertas, progresso, skeleton, vazio, avatares, tooltip, código e stepper.

### 3.2 Tabelas e listas

A tabela permite buscar, ordenar texto e números, selecionar linhas e paginar. A seleção geral se aplica às linhas visíveis; seleções feitas em outras páginas permanecem até limpeza explícita.

As variantes de tabela incluem densidade compacta, vazio, carregamento, erro e rolagem contida em tela pequena. Estados de falha e retomada são exemplos locais, não respostas de uma API.

As listas incluem não ordenada, ordenada, definição, interativa, árvore com disclosures, timeline, atividades, checklist e Kanban com movimentação por botões.

## 4. Como escolher uma visualização

### 4.1 Gráficos

Escolha primeiro a pergunta:

| Pergunta | Família de visualização |
|---|---|
| Quais categorias são maiores? | Barras, agrupamento e empilhamento |
| Como uma série evolui? | Linha e área |
| Como um total se divide? | Pizza, donut e treemap |
| Como os valores se distribuem? | Histograma e box plot |
| Como variáveis se relacionam? | Dispersão e bolhas |
| Onde há intensidade? | Heatmap |
| Como dimensões se comparam? | Radar |
| Como contribuições alteram um total? | Waterfall |
| Como etapas reduzem uma população? | Funil |
| Qual é o estado em uma escala? | Gauge |
| Como atividades se organizam no tempo? | Gantt |

Nem todos os gráficos aceitam o mesmo tipo de dado. Não use uma contagem categórica como se fosse uma distribuição, nem um número de exemplo como evidência financeira ou de produtividade.

Preserve unidades, escalas, domínio, legenda, contexto temporal e valores negativos quando aplicáveis. Pizza e composição exigem um total coerente; box plot e histograma exigem uma distribuição; diagramas de fluxo exigem relações, não categorias soltas.

Os dados entregues são sintéticos e identificados como demonstração. Ao substituí-los, documente fonte, período, unidade, amostra e limites. Não preserve a narrativa do exemplo se os dados reais não a sustentarem.

### 4.2 Diagramas de software

Use diferentes vistas em vez de concentrar toda a arquitetura em um único desenho:

| Vista | Pergunta |
|---|---|
| C4 contexto | Quem usa o sistema e com quais sistemas ele se relaciona? |
| C4 containers | Quais unidades executáveis ou armazenamentos compõem o sistema? |
| C4 componentes | Como uma unidade se organiza internamente? |
| Classes | Quais tipos, atributos e relações estruturais existem? |
| Sequência | Quem troca mensagens, em qual ordem? |
| Atividade ou fluxo | Quais passos e decisões compõem um processo? |
| Estados | Quais estados e transições são permitidos? |
| Entidade-relacionamento | Quais entidades, chaves e cardinalidades compõem os dados? |
| Implantação | Onde os elementos são executados, em uma hipótese explícita? |
| Fluxo de dados | Que informação cruza cada elemento? |
| Rede e confiança | Quais fronteiras e transições precisam ser explicadas? |
| Entrega | Quais etapas e dependências compõem o pipeline? |

Os modelos são genéricos e ilustrativos. Eles não descrevem a infraestrutura real deste site nem comprovam que um produto está implantado.

O SVG é uma saída de publicação. O arquivo `.drawio` é uma fonte editável; preserve seus elementos e relações, não substitua o arquivo por uma imagem colada no editor.

Ao adaptar um desenho, inclua propósito, audiência, escopo, responsável, versão, data, estado e legenda. Só use “aprovado” ou “implementado” quando houver evidência.

## 5. Simulações e movimento

### 5.1 Interfaces didáticas

As quatro famílias têm objetivos diferentes:

- **VS Code:** explicar a jornada entre explorer, arquivo, editor e painel.
- **GitHub Copilot CLI:** demonstrar uma conversa e sua sequência no terminal, sem executar comandos.
- **Azure Portal:** apresentar um fluxo de navegação e estados de recursos fictícios.
- **GitHub:** explicar o contexto de repositório, pull request e verificações usando dados demonstrativos.

Elas não são screenshots, clones pixel a pixel, ambientes autenticados ou emuladores completos. Não há garantia de equivalência com uma versão específica das interfaces ou sintaxe de CLI.

Use controles de reprodução, pausa, avanço, retorno e reinício para conduzir a narrativa. Cenários de erro demonstram como explicar a falha e retomar sem inventar um resultado bem-sucedido.

### 5.2 Regras de movimento

Movimento deve explicar continuidade, causalidade ou estado. Não deve competir com a narrativa.

- Não reproduza automaticamente sequências longas.
- Ofereça pausa e reinício para movimento contínuo.
- Respeite `prefers-reduced-motion`.
- Mantenha o avanço manual disponível.
- Não use flashes, tremores intensos ou animação como único sinal de estado.
- Não anuncie cada quadro ou caractere em regiões `aria-live`.

## 6. Reutilizar e criar stories

### 6.1 Consumir o pacote local

```bash
npm run build:library
npm pack
```

Instale o `.tgz` gerado na aplicação de destino. O pacote é local e privado; o kit não publica nada em um registry.

```tsx
import { Button, DataTable } from "hub-editorial-studio";
import "hub-editorial-studio/style.css";

export function ResourcePage() {
  return (
    <main className="he">
      <Button variant="primary">Continuar</Button>
      <DataTable density="comfortable" />
    </main>
  );
}
```

O exemplo de tabela usa dados sintéticos por padrão. Passe dados reais tipados e ações próprias quando integrar à sua aplicação.

Os componentes assumem os tokens do kit. O CSS é prefixado, mas define variáveis na raiz; revise o escopo em aplicações que já tenham outro sistema visual.

Copie os assets necessários de `public/` para a aplicação de destino. Preserve os arquivos de fonte e as licenças, inclusive quando empacotar os SVGs.

### 6.2 Adicionar uma nova entrada

1. Escolha a família e a pergunta que o componente resolve.
2. Crie um componente tipado e reutilize os tokens.
3. Adicione um descritor com `id`, `label` e `description`.
4. Registre a entrada no catálogo, quando a família não a incorporar automaticamente.
5. Crie uma story com nome estático, argumentos e controles.
6. Cubra os estados aplicáveis e acrescente testes focados.
7. Atualize a documentação e repita os builds.

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Primitives";

const meta = {
  title: "Componentes/Button",
  component: Button,
  tags: ["autodocs"],
  args: { children: "Continuar", variant: "primary" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Principal: Story = {};
export const Desabilitado: Story = { args: { disabled: true } };
```

Use nomes estáticos para que o índice do Storybook represente os exemplos de fato. Não gere apenas uma lista de nomes sem implementação.

### 6.3 Storybook não é backend

As ações registradas pelo Storybook documentam interação; não confirmam execução de uma operação real. Ao integrar APIs, trate autenticação, autorização, validação, privacidade, cancelamento, estados intermediários e falhas fora das demonstrações.

## 7. Qualidade, dados e marcas

### 7.1 Acessibilidade

O addon de acessibilidade auxilia a inspeção; sua presença não certifica o kit.

Revise nomes acessíveis, ordem de foco, Escape em overlays, relações entre tabs e painéis, navegação em tabelas, contraste dos pares finais, texto alternativo para SVGs e alternativas para movimento.

Uma área de prévia estreita limita o canvas; o teste final de responsividade deve usar uma viewport real. Diagramas densos podem precisar de uma vista separada ou de zoom, não apenas redução de toda a tipografia.

### 7.2 Assets oficiais

Não confunda:

- Ícones genéricos de interface com logotipos de produto.
- Octicons com a marca corporativa do GitHub.
- Ícones de arquitetura Azure com permissão irrestrita de marketing.
- Um asset oficial com evidência de implantação ou endosso.

Assets oficiais incluídos devem preservar o desenho original, cores, proporção, rótulo e proveniência. Quando a permissão não é clara, use texto ou uma forma neutra claramente identificada; não crie um logotipo parecido.

Os registros de origem e licenças ficam junto à biblioteca visual. A marca standalone antiga do GitHub Copilot não deve ser reutilizada.

### 7.3 Dados honestos

Todos os números das demonstrações precisam ser tratados como sintéticos. Contagens de entradas do próprio catálogo são calculadas a partir dos arquivos de implementação.

Não transforme datasets de exemplo em benchmarks, estimativas de ROI, resultados de clientes ou estatísticas de mercado.

## 8. Publicar o pacote estático

```bash
npm run test
npm run build:all
npm run test:browser
```

Sirva `dist/` em um servidor estático. O build inclui o showcase e o Storybook em `/storybook/`; os caminhos do showcase são relativos para permitir hospedagem sob um subdiretório.

`build:all` deve ser executado na ordem definida. Rodar o build do showcase sozinho recria `dist/`, removendo uma cópia anterior do Storybook desse diretório; reconstrua-o antes de distribuir.

Este trabalho não cria infraestrutura, não publica o site e não muda sua hospedagem. O site de produção continua em Azure Static Web Apps.

Antes de distribuir:

- Confira as licenças e o inventário de assets.
- Remova dados reais que tenham sido adicionados aos exemplos.
- Verifique todos os links e downloads.
- Revise os SVGs e as fontes editáveis dos diagramas.
- Faça a inspeção visual em tema claro e escuro.
- Execute a verificação de teclado e viewport pequena.

## Referências

- [Arquivos disponíveis e limites desta cópia](../hub-editorial/README.md).
- [Base visual documentada](./Hub_Editorial_Design_System_v1.0.0_2026-09-07.md).
- [Site de referência](https://agenticdevopsplatform.ai).
- [Documentação do Storybook](https://storybook.js.org/docs).
- [Azure Architecture Center: ícones](https://learn.microsoft.com/en-us/azure/architecture/icons/).
- [Microsoft: criação de diagramas de arquitetura](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/design-diagrams).
- [GitHub: orientação de marca](https://brand.github.com/).
- [WCAG: contraste mínimo](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
