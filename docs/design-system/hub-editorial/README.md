# Hub Editorial Studio: base CSS

Referência visual do Awesome Copilot Adventures, derivada do hub de Paula Silva.
Esta cópia versionada contém a base estática usada pelo site Astro, não o projeto
React/Storybook completo descrito no documento de origem.

## Abrir a referência

Abra [index.html](./index.html), o [catálogo visual](./foundation.html) ou o
[template](./starter.html) no navegador. Esses arquivos usam CSS, JavaScript e
fontes locais; não precisam de instalação de pacotes nem de conexão com uma conta.

O catálogo apresenta exemplos de interface, não medições ou execuções de produtos.
O formulário demonstrativo não envia dados.

## Arquivos reutilizáveis

| Arquivo | Finalidade |
| --- | --- |
| [tokens.css](./tokens.css) | Paleta, temas, tipografia, espaçamento e acessibilidade |
| [components.css](./components.css) | Componentes estáticos com prefixo `he-` |
| [hub.js](./hub.js) | Tema, menu e interações locais do catálogo |
| [showcase.css](./showcase.css) | Apresentação das amostras, dispensável no template |
| [fonts/](./fonts/) | Fontes locais, licença e proveniência |

O site importa `tokens.css` diretamente e implementa sua navegação e suas
simulações em Astro e JavaScript. Não depende de uma biblioteca React publicada.
Diretórios locais ignorados como `dist/`, `lib/` e `node_modules/`, quando presentes,
não fazem parte da publicação e não substituem arquivos-fonte versionados.

Controle o tema com `data-he-theme="light"` ou `data-he-theme="dark"` no elemento
`html`. O prefixo reduz colisões, mas não equivale a Shadow DOM; revise o escopo
antes de importar estilos em outra aplicação.

## Verificar a integração

Na raiz do Awesome Copilot Adventures, com Node.js 24 ou superior:

```bash
npm test
npm run build:site
npm run check:astro
npm run check:site:rendered -- dist
```

Não execute `npm ci`, `npm run storybook` ou os comandos do projeto React nesta
pasta: seus manifestos e fontes não estão incluídos nesta cópia. Consulte o
[guia CSS](../md/Hub_Editorial_Design_System_v1.0.0_2026-09-07.md) para composição e
o [registro do Studio original](../md/Hub_Editorial_Studio_v2.0.0_2026-09-07.md)
para o contexto da referência.

## Limites e licenças

Fontes Inter e JetBrains Mono: [SIL Open Font License 1.1](./fonts/OFL.txt), com
[proveniência](./fonts/SOURCES.txt). Preserve esses arquivos ao redistribuí-las.
Marcas de produto não são a identidade do currículo e não implicam endosso.

Nenhuma nova licença foi atribuída ao código do projeto de origem. Verificações
automatizadas não são certificação WCAG completa nem substituem revisão visual,
semântica e de marca.
