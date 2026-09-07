import type { ReactNode } from "react";
import { FoundationDemo, foundationCatalog } from "./foundations/Foundations";
import { PrimitiveDemo, primitiveCatalog } from "./components/Primitives";
import { DataDemo, dataCatalog } from "./data/Data";
import { ChartDemo, chartCatalog } from "./charts/Charts";
import { DiagramDemo, diagramCatalog } from "./diagrams/Diagrams";
import { IconBrowser, iconCatalog } from "./icons/Icons";
import { IllustrationDemo, illustrationCatalog } from "./illustrations/Illustrations";
import { MotionDemo, motionCatalog } from "./motion/Motion";
import { SimulatorDemo, simulatorCatalog } from "./simulations/Simulators";
import type { DemoDescriptor } from "./lib/catalog";

export const groups = [
  { id: "fundamentos", label: "Fundamentos", description: "A linguagem que mantém o sistema coeso.", accent: "blue" },
  { id: "componentes", label: "Componentes", description: "Peças de interface com variantes e estados.", accent: "green" },
  { id: "dados", label: "Tabelas e listas", description: "Estruturas para ler, selecionar e organizar.", accent: "yellow" },
  { id: "graficos", label: "Gráficos", description: "Visualizações SVG com dados demonstrativos.", accent: "blue" },
  { id: "arquitetura", label: "Arquitetura", description: "Notações para explicar sistemas de software.", accent: "red" },
  { id: "icones", label: "Ícones", description: "Uma biblioteca vetorial com nomes e controles.", accent: "green" },
  { id: "ilustracoes", label: "Ilustrações SVG", description: "Cenas originais para histórias técnicas.", accent: "yellow" },
  { id: "movimento", label: "Movimento", description: "Animações controladas, com alternativas acessíveis.", accent: "blue" },
  { id: "simulacoes", label: "Simulações", description: "Interfaces didáticas sem operações reais.", accent: "red" },
] as const;
export type GroupId = typeof groups[number]["id"];
export interface CatalogEntry extends DemoDescriptor {
  key: string;
  group: GroupId;
  component: string;
  snippet: string;
  render: () => ReactNode;
}

function family<Id extends string>(group: GroupId, items: readonly DemoDescriptor<Id>[], component: string, render: (kind: Id) => ReactNode): CatalogEntry[] {
  return items.map(item => ({
    ...item,
    key: `${group}/${item.id}`,
    group,
    component,
    snippet: `import { ${component} } from "hub-editorial-studio";\nimport "hub-editorial-studio/style.css";\n\n<${component} kind="${item.id}" />`,
    render: () => render(item.id),
  }));
}

export const catalog: CatalogEntry[] = [
  ...family("fundamentos", foundationCatalog, "FoundationDemo", kind => <FoundationDemo kind={kind} />),
  ...family("componentes", primitiveCatalog, "PrimitiveDemo", kind => <PrimitiveDemo kind={kind} />),
  ...family("dados", dataCatalog, "DataDemo", kind => <DataDemo kind={kind} />),
  ...family("graficos", chartCatalog, "ChartDemo", kind => <ChartDemo kind={kind} />),
  ...family("arquitetura", diagramCatalog, "DiagramDemo", kind => <DiagramDemo kind={kind} />),
  { id: "biblioteca", key: "icones/biblioteca", group: "icones", label: "Explorador de ícones", description: `${iconCatalog.length} ícones genéricos para interfaces e histórias técnicas.`, component: "IconBrowser", snippet: 'import { IconBrowser } from "hub-editorial-studio";\n\n<IconBrowser />', render: () => <IconBrowser /> },
  ...family("ilustracoes", illustrationCatalog, "IllustrationDemo", kind => <IllustrationDemo kind={kind} />),
  ...family("movimento", motionCatalog, "MotionDemo", kind => <MotionDemo kind={kind} />),
  ...family("simulacoes", simulatorCatalog, "SimulatorDemo", kind => <SimulatorDemo kind={kind} />),
];

export const catalogSummary = { entries: catalog.length, icons: iconCatalog.length, families: groups.length };
