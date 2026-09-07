import type { CSSProperties } from "react";
import { DemoFrame } from "../components/DemoFrame";
import { Alert } from "../components/Primitives";
import "./foundations.css";

export const foundationCatalog = [
  { id: "colors", label: "Cores e temas", description: "A paleta pessoal do site, com papéis semânticos e temas." },
  { id: "typography", label: "Tipografia", description: "Inter para narrativa; JetBrains Mono para metadados e código." },
  { id: "spacing", label: "Espaçamento", description: "Uma escala explícita para repetir o ritmo editorial." },
  { id: "layout", label: "Grid e layout", description: "Containers, largura de leitura e grades fluidas." },
  { id: "surfaces", label: "Superfícies e bordas", description: "Filetes, cards retos, trilhas arredondadas e destaque discreto." },
  { id: "accessibility", label: "Acessibilidade", description: "Contratos de contraste, foco, texto alternativo e movimento." },
] as const;
export type FoundationKind = typeof foundationCatalog[number]["id"];
const colors = [
  { id: "red", name: "Vermelho", hex: "#FF3133", usage: "Destaques e categorias" },
  { id: "green", name: "Verde", hex: "#7ED956", usage: "Trilhas e pontos de partida" },
  { id: "blue", name: "Azul", hex: "#39B8FF", usage: "Conexão e navegação" },
  { id: "yellow", name: "Amarelo", hex: "#FFDE59", usage: "Ênfase e marca-texto" },
] as const;

export function FoundationDemo({ kind }: { kind: FoundationKind }) {
  const descriptor = foundationCatalog.find(item => item.id === kind);
  if (!descriptor) throw new Error(`Fundamento desconhecido: ${kind}`);
  return <DemoFrame title={descriptor.label} description={descriptor.description}>
    {kind === "colors" ? <div className="he-component-stack">
      <div className="he-foundation-swatches">{colors.map(color => <article key={color.id}><div className="he-foundation-swatch" style={{ background: `var(--he-${color.id}-500)` }} /><div className="he-foundation-swatch__body"><h3>{color.name}</h3><code>{color.hex}</code><p>{color.usage}</p></div></article>)}</div>
      <Alert title="Primitivos não são papéis de texto" tone="info">Use as cores vivas como acentos. Para texto, use --he-muted, --he-link e os papéis --he-*-ink. Esta não é a paleta oficial do Fluent UI.</Alert>
      <div className="he-foundation-neutrals">{["bg", "paper", "bg-alt", "ink", "ink-2", "muted", "rule"].map(token => <div key={token}><span style={{ background: `var(--he-${token})` }} /><code>--he-{token}</code></div>)}</div>
    </div> : kind === "typography" ? <div className="he-foundation-types">
      <div><code>Display / Inter 300</code><p className="he-foundation-display">Clareza por princípio.</p></div>
      <div><code>Seção / Inter 400</code><p className="he-foundation-heading">Espaço para compreender.</p></div>
      <div><code>Card / Inter 500 / 20 px</code><p className="he-card__title">Uma ideia, um próximo passo.</p></div>
      <div><code>Corpo / Inter 400 / 16 px</code><p>Use hierarquia, entrelinha confortável e conteúdo direto para organizar a leitura.</p></div>
      <div><code>Rótulo / JetBrains Mono 500 / 12 px</code><p className="he-card__kicker">Guia / Plataforma / Recursos</p></div>
      <p className="he-help">As fontes latinas são locais. Não há dependência de Google Fonts em tempo de execução.</p>
    </div> : kind === "spacing" ? <div className="he-component-stack"><div className="he-space-specimens">{[4, 8, 12, 16, 24, 32, 48, 64, 72, 112].map(value => <div key={value}><span style={{ height: value }} /><code>{value} px</code></div>)}</div><p>Escala nomeada nova, extraída de medidas recorrentes do site. Seções: 112 px no desktop e 72 px no mobile.</p></div> : kind === "layout" ? <div className="he-component-stack"><div className="he-layout-specimen"><div>Container máximo: 1240 px</div><div>Gutters: 72 / 32 / 20 px</div><div>Leitura: até 680 px</div></div><div className="he-grid">{["Narrativa", "Trilhas", "Catálogo"].map(text => <div className="he-layout-cell" key={text}>{text}</div>)}</div><p className="he-help">Não há um grid obrigatório de 12 colunas. Use minmax e grids fluidos, respeitando o conteúdo.</p></div> : kind === "surfaces" ? <div className="he-grid"><article className="he-card" data-he-accent="blue"><h3>Editorial</h3><p>Raio 0. Bordas de 1 px, sem sombra por padrão.</p></article><article className="he-path" data-he-accent="green"><h3>Trilha</h3><p>Raio 12 px. Sombra discreta apenas na interação.</p></article><article className="he-path he-inverse"><h3>Superfície escura</h3><p>Um bloco escuro continua escuro nos dois temas.</p></article></div> : <div className="he-component-stack"><Alert title="Contraste verificado por combinação" tone="info">Texto discreto #686864 sobre #F7F7F5: aproximadamente 5,22:1. Isso não é uma certificação do produto inteiro.</Alert><ul className="he-content-list"><li>Alvos interativos de pelo menos 44 × 44 px neste kit.</li><li>Foco visível, teclado, nomes acessíveis e rótulos para estados.</li><li>SVG com título, descrição e alternativa textual quando necessário.</li><li>Movimento sob controle: iniciar, pausar e respeitar a preferência do sistema.</li><li>Dados e simulações sempre identificados como demonstração.</li><li>Não comunicar significado somente por cor ou ícone.</li></ul></div>}
  </DemoFrame>;
}

export type CustomProperties = CSSProperties & { [key: `--${string}`]: string | number };
