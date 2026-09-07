# Hub Editorial Studio

Design system independente em React e TypeScript, com Storybook, showcase, componentes, visualizações SVG e simulações didáticas. Derivado da linguagem editorial do hub de Paula Silva; não modifica o projeto Astro.

## Iniciar

Requer Node.js 22.12 ou superior.

```bash
npm ci
npm run dev
```

Showcase: `http://127.0.0.1:5177`.

Em outro terminal, inicie o Storybook:

```bash
npm run storybook
```

Storybook: `http://127.0.0.1:6006`. Os servidores são locais e falham se a porta estiver ocupada, em vez de substituir outro processo.

## Construir e verificar

```bash
npm run test
npm run build:all
npm run test:browser
npm run preview
```

- `dist/`: showcase pronto para servir.
- `dist/storybook/`: Storybook estático.
- `lib/`: biblioteca ES module, CSS e declarações TypeScript.
- `test-results/`: evidência gerada pela verificação no navegador.

O preview do pacote construído usa `http://127.0.0.1:4177`; o Storybook está em `/storybook/`.

`build:all` executa primeiro o showcase, depois o Storybook e por fim a biblioteca. Executar apenas `build` posteriormente recria o diretório `dist/`; execute novamente `build-storybook` para repor o Storybook nesse diretório.

## Reutilizar componentes

Construa a biblioteca e crie um pacote local:

```bash
npm run build:library
npm pack
```

Instale o arquivo `.tgz` gerado na aplicação de destino. Não existe publicação automática nem dependência de um pacote público com esse nome.

```tsx
import { Button, ChartDemo } from "hub-editorial-studio";
import "hub-editorial-studio/style.css";

export function Example() {
  return (
    <main className="he">
      <Button variant="primary">Continuar</Button>
      <ChartDemo kind="line" />
    </main>
  );
}
```

Controle o tema com `data-he-theme="light"` ou `data-he-theme="dark"` no elemento `html`. O prefixo `he-` reduz colisões; não equivale a Shadow DOM. Revise o escopo antes de importar o CSS em uma aplicação existente.

Os assets públicos, incluindo ícones oficiais quando presentes, acompanham o pacote em `public/`. Copie-os para a área pública da aplicação de destino preservando os caminhos e as condições de uso. As simulações não devem ser conectadas a contas ou serviços reais sem uma implementação própria.

## Organização

- `tokens.css`, `components.css`: base visual independente de framework.
- `src/foundations/`: cores, tipografia, espaço, layout e acessibilidade.
- `src/components/`: peças de interface e estados.
- `src/data/`: tabelas, listas e modelos de dados.
- `src/charts/`: gráficos SVG.
- `src/diagrams/`: diagramas de software e fontes editáveis.
- `src/icons/`, `src/illustrations/`: biblioteca vetorial.
- `src/motion/`, `src/simulations/`: movimento e jornadas didáticas.
- `.storybook/`: configuração, temas, controles e documentação.
- `foundation.html`, `starter.html`: kit CSS original, que ainda abre diretamente no navegador.

O showcase React e o Storybook precisam ser servidos por HTTP, mesmo sem internet. Para consulta sem Node, use um servidor estático com o conteúdo construído de `dist/`; para o kit CSS básico, abra `foundation.html`.

## Limites e licenças

Os números são sintéticos e as interfaces de produto são simulações locais identificadas. Nenhum comando, implantação, autenticação, gravação em conta ou envio de formulário real é executado. O kit não declara equivalência exata com uma versão atual de VS Code, GitHub Copilot CLI, Azure Portal ou GitHub.

Fontes locais Inter e JetBrains Mono: [SIL Open Font License 1.1](./fonts/OFL.txt), com [proveniência](./fonts/SOURCES.txt). Ícones de produto, quando incluídos, mantêm as condições dos fornecedores; não são a marca do kit e não implicam endosso. Consulte os registros em `public/brand/` e as licenças em `public/licenses/`.

Nenhuma nova licença foi atribuída ao código do repositório original. Verificações automatizadas não são certificação WCAG completa nem substituem revisão visual, semântica e de marca.
