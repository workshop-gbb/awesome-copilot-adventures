import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, Check, ChevronRight, File, Folder } from "lucide-react";
import { Alert, Badge, Button } from "../components/Primitives";
import { DemoFrame } from "../components/DemoFrame";
import { syntheticDataNotice } from "../lib/catalog";
import { filterAndSortRows, pageRows, sampleRows, type ResourceRow, type SortColumn, type SortDirection } from "./table-model";
import "./data.css";

export const dataCatalog = [
  { id: "table", label: "Tabela de recursos", description: "Busca, ordenação, seleção e paginação operantes." },
  { id: "table-compact", label: "Tabela compacta", description: "Mais densidade sem reduzir os alvos de interação." },
  { id: "table-empty", label: "Tabela vazia", description: "Um estado sem linhas e uma ação local de demonstração." },
  { id: "table-loading", label: "Tabela carregando", description: "Skeleton e estado ocupado com texto alternativo." },
  { id: "table-error", label: "Tabela com erro", description: "Feedback de falha e retomada explicitamente simulada." },
  { id: "table-responsive", label: "Tabela responsiva", description: "Rolagem contida e acesso por teclado em telas pequenas." },
  { id: "list-bullets", label: "Lista não ordenada", description: "Itens relacionados sem ordem obrigatória." },
  { id: "list-ordered", label: "Lista ordenada", description: "Passos com uma sequência significativa." },
  { id: "list-definitions", label: "Lista de definições", description: "Termos e descrições com semântica dl/dt/dd." },
  { id: "list-interactive", label: "Lista interativa", description: "Seleção de item e painel de detalhes local." },
  { id: "list-tree", label: "Árvore de arquivos", description: "Hierarquia navegável com disclosures nativos." },
  { id: "list-timeline", label: "Timeline", description: "Sequência temporal fictícia com rótulos explícitos." },
  { id: "list-activity", label: "Feed de atividades", description: "Eventos demonstrativos com autoria fictícia." },
  { id: "list-checklist", label: "Checklist", description: "Progresso calculado a partir da seleção real." },
  { id: "kanban", label: "Kanban", description: "Movimento local entre colunas com ações acessíveis." },
] as const;

export type DataKind = typeof dataCatalog[number]["id"];
export type TableState = "ready" | "empty" | "loading" | "error";

export interface DataTableProps {
  rows?: readonly ResourceRow[];
  state?: TableState;
  density?: "comfortable" | "compact";
}

export function DataTable({ rows = sampleRows, state = "ready", density = "comfortable" }: DataTableProps) {
  const [query, setQuery] = useState("");
  const [column, setColumn] = useState<SortColumn>("name");
  const [direction, setDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [currentState, setCurrentState] = useState(state);
  const [message, setMessage] = useState("");
  const allBox = useRef<HTMLInputElement>(null);
  const id = useId();
  useEffect(() => { setCurrentState(state); setMessage(""); }, [state]);
  const filtered = useMemo(() => filterAndSortRows(currentState === "empty" ? [] : rows, query, column, direction), [currentState, rows, query, column, direction]);
  const paged = pageRows(filtered, page, size);
  const visibleSelected = paged.rows.filter(row => selected.has(row.id)).length;
  useEffect(() => {
    if (allBox.current) allBox.current.indeterminate = visibleSelected > 0 && visibleSelected < paged.rows.length;
  }, [visibleSelected, paged.rows.length]);
  const sort = (next: SortColumn) => {
    setDirection(next === column && direction === "asc" ? "desc" : "asc");
    setColumn(next);
    setPage(1);
  };
  const toggleRow = (rowId: string) => setSelected(previous => {
    const next = new Set(previous);
    if (next.has(rowId)) next.delete(rowId); else next.add(rowId);
    return next;
  });
  if (currentState === "error") return <div className="he-component-stack"><Alert tone="danger" title="Não foi possível carregar — exemplo">Falha de demonstração. Nenhuma API foi consultada.</Alert><Button onClick={() => { setCurrentState("ready"); setMessage("Exemplo retomado localmente; nenhuma requisição foi enviada."); }}>Retomar a demonstração</Button></div>;
  if (currentState === "loading") return <div className="he-component-stack"><div aria-busy="true" aria-label="Tabela em carregamento demonstrativo"><p>Amostra estática de carregamento.</p>{[0, 1, 2].map(value => <div className="he-skeleton he-table-skeleton" aria-hidden="true" key={value} />)}</div><Button onClick={() => { setCurrentState("ready"); setMessage("Dados fictícios exibidos localmente."); }}>Exibir dados de exemplo</Button></div>;
  return <div className="he-data-table" data-density={density}>
    <div className="he-table-toolbar">
      <label className="he-field-label" htmlFor={`${id}-search`}>Buscar recursos<input id={`${id}-search`} className="he-field" type="search" value={query} placeholder="Nome, formato ou estado" onChange={event => { setQuery(event.target.value); setPage(1); }} /></label>
      <label className="he-field-label" htmlFor={`${id}-page-size`}>Linhas por página<select id={`${id}-page-size`} className="he-field" value={size} onChange={event => { setSize(Number(event.target.value)); setPage(1); }}><option value={5}>5</option><option value={10}>10</option></select></label>
      <Button onClick={() => { setQuery(""); setSelected(new Set()); setPage(1); }}>Limpar filtros e seleção</Button>
    </div>
    <p className="he-help" id={`${id}-scroll`}>Em telas pequenas, role a tabela horizontalmente. A região também aceita foco por teclado.</p>
    <div className="he-table-scroll" role="region" aria-label="Tabela de recursos demonstrativos" aria-describedby={`${id}-scroll`} tabIndex={0}>
      <table className="he-table">
        <caption>Catálogo fictício. A coluna “Itens” contém valores sintéticos.</caption>
        <thead><tr>
          <th scope="col"><label className="he-table-check"><input ref={allBox} type="checkbox" disabled={!paged.rows.length} checked={paged.rows.length > 0 && visibleSelected === paged.rows.length} aria-label="Selecionar todas as linhas visíveis" onChange={event => setSelected(previous => { const next = new Set(previous); for (const row of paged.rows) { if (event.target.checked) next.add(row.id); else next.delete(row.id); } return next; })} /></label></th>
          {([["name", "Recurso"], ["format", "Formato"], ["status", "Estado"], ["items", "Itens"]] as const).map(([key, label]) => <th key={key} scope="col" aria-sort={column === key ? direction === "asc" ? "ascending" : "descending" : "none"}><button type="button" onClick={() => sort(key)}>{label}{column === key && (direction === "asc" ? <ArrowUp size={14} aria-hidden="true" /> : <ArrowDown size={14} aria-hidden="true" />)}</button></th>)}
        </tr></thead>
        <tbody>{paged.rows.map(row => <tr key={row.id} data-selected={selected.has(row.id)}><td><label className="he-table-check"><input type="checkbox" checked={selected.has(row.id)} aria-label={`Selecionar ${row.name}`} onChange={() => toggleRow(row.id)} /></label></td><th scope="row">{row.name}</th><td>{row.format}</td><td><Badge tone={row.status === "Pronto" ? "success" : row.status === "Em revisão" ? "info" : "neutral"}>{row.status}</Badge></td><td className="he-table__number">{row.items}</td></tr>)}
          {paged.rows.length === 0 && <tr><td colSpan={5} className="he-table__empty">Nenhum recurso encontrado. {currentState === "empty" ? <Button onClick={() => setCurrentState("ready")}>Mostrar dados de exemplo</Button> : <Button onClick={() => { setQuery(""); setPage(1); }}>Limpar busca</Button>}</td></tr>}
        </tbody>
      </table>
    </div>
    <div className="he-table-footer"><p role="status">{filtered.length} recursos · {selected.size} selecionados · Página {paged.currentPage} de {paged.pages}</p><nav className="he-component-row" aria-label="Paginação da tabela"><Button disabled={paged.currentPage === 1} onClick={() => setPage(paged.currentPage - 1)}>Anterior</Button><Button disabled={paged.currentPage === paged.pages} onClick={() => setPage(paged.currentPage + 1)}>Próxima</Button></nav></div>
    {message && <p className="he-live-status" role="status">{message}</p>}
  </div>;
}

const listItems = ["Definir a intenção da página", "Organizar o conteúdo", "Revisar estados e acessibilidade", "Publicar somente após validação"];

function InteractiveList() {
  const [active, setActive] = useState(0);
  return <div className="he-list-split"><ul className="he-interactive-list">{listItems.map((label, index) => <li key={label}><button type="button" aria-pressed={index === active} onClick={() => setActive(index)}>{label}<ChevronRight size={16} aria-hidden="true" /></button></li>)}</ul><div className="he-list-detail" role="status"><p className="he-card__kicker">Item selecionado</p><h3>{listItems[active]}</h3><p>Detalhes demonstrativos deste passo. Nada é enviado a outro sistema.</p></div></div>;
}

function Checklist() {
  const [checked, setChecked] = useState<Set<number>>(() => new Set());
  return <div className="he-component-stack"><ul className="he-plain-list">{listItems.map((item, index) => <li key={item}><label className="he-choice"><input type="checkbox" checked={checked.has(index)} onChange={() => setChecked(previous => { const next = new Set(previous); if (next.has(index)) next.delete(index); else next.add(index); return next; })} />{item}</label></li>)}</ul><p role="status">{checked.size} de {listItems.length} itens marcados nesta demonstração.</p><Button onClick={() => setChecked(new Set())}>Limpar checklist</Button></div>;
}

function Kanban() {
  const [stages, setStages] = useState([0, 0, 1]);
  const labels = ["Planejar", "Em andamento", "Concluído"];
  const tasks = ["Organizar tokens", "Revisar componentes", "Documentar padrões"];
  const [message, setMessage] = useState("");
  return <><div className="he-kanban">{labels.map((label, stage) => <section className="he-kanban__column" key={label}><h3>{label}</h3>{tasks.map((task, index) => stages[index] === stage && <article className="he-kanban__card" key={task}><p>{task}</p><Badge>{stage === 2 ? "Finalizado" : "Demonstração"}</Badge><div className="he-component-row"><Button aria-label={`Retornar ${task}`} disabled={stage === 0} onClick={() => { setStages(previous => previous.map((value, cursor) => cursor === index ? value - 1 : value)); setMessage(`${task}: ${labels[stage - 1]}.`); }}>Voltar</Button><Button aria-label={`Avançar ${task}`} disabled={stage === 2} onClick={() => { setStages(previous => previous.map((value, cursor) => cursor === index ? value + 1 : value)); setMessage(`${task}: ${labels[stage + 1]}.`); }}>Avançar</Button></div></article>)}</section>)}</div><p role="status" className="he-live-status">{message || "Mova os cards com botões; não é necessário arrastar."}</p><Button onClick={() => { setStages([0, 0, 1]); setMessage("Quadro demonstrativo reiniciado."); }}>Reiniciar quadro</Button></>;
}

export function DataDemo({ kind }: { kind: DataKind }) {
  const descriptor = dataCatalog.find(item => item.id === kind);
  if (!descriptor) throw new Error(`Padrão de dados desconhecido: ${kind}`);
  return <DemoFrame title={descriptor.label} description={descriptor.description} note={syntheticDataNotice}>
    {kind.startsWith("table") ? <DataTable density={kind === "table-compact" ? "compact" : "comfortable"} state={kind === "table-empty" ? "empty" : kind === "table-loading" ? "loading" : kind === "table-error" ? "error" : "ready"} /> : kind === "list-bullets" ? <ul className="he-content-list">{listItems.map(item => <li key={item}>{item}</li>)}</ul> : kind === "list-ordered" ? <ol className="he-content-list">{listItems.map(item => <li key={item}>{item}</li>)}</ol> : kind === "list-definitions" ? <dl className="he-definition-list"><div><dt>Token</dt><dd>Uma decisão visual nomeada e reutilizável.</dd></div><div><dt>Componente</dt><dd>Uma peça de interface com contrato e estados.</dd></div><div><dt>Padrão</dt><dd>Uma composição de peças orientada a uma necessidade.</dd></div></dl> : kind === "list-interactive" ? <InteractiveList /> : kind === "list-tree" ? <div className="he-file-tree"><details open><summary><Folder size={17} aria-hidden="true" /> projeto-exemplo</summary><details open><summary><Folder size={17} aria-hidden="true" /> src</summary><p><File size={16} aria-hidden="true" /> App.tsx</p><p><File size={16} aria-hidden="true" /> tokens.css</p></details><details><summary><Folder size={17} aria-hidden="true" /> docs</summary><p><File size={16} aria-hidden="true" /> guia.md</p></details></details></div> : kind === "list-timeline" ? <ol className="he-timeline-list">{listItems.map((item, index) => <li key={item}><span className="he-timeline-list__point" aria-hidden="true" /><time dateTime={`2026-01-0${index + 1}`}>0{index + 1}.01.2026 · Data fictícia</time><h3>{item}</h3><p>Etapa ilustrativa de um processo editorial.</p></li>)}</ol> : kind === "list-activity" ? <ul className="he-activity-list">{["Pessoa A criou um rascunho", "Pessoa B revisou um componente", "Pessoa C concluiu o checklist"].map((item, index) => <li key={item}><span className="he-activity-list__icon" aria-hidden="true"><Check size={18} /></span><div><strong>{item}</strong><p>Evento fictício {index + 1}, sem vínculo com contas reais.</p></div></li>)}</ul> : kind === "list-checklist" ? <Checklist /> : <Kanban />}
  </DemoFrame>;
}
