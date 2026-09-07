import { useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, BookOpen, Menu, Moon, RotateCcw, Search, Sun, X } from "lucide-react";
import { Button } from "./components/Primitives";
import { catalog, catalogSummary, groups, type CatalogEntry } from "./catalog";
import { normalizeQuery } from "./data/table-model";
import type { Theme } from "./lib/catalog";

const storybookUrl = import.meta.env.DEV ? "http://127.0.0.1:6006/" : `${import.meta.env.BASE_URL}storybook/index.html`;

function Navigation({ selected, onNavigate }: { selected: string; onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const id = useId();
  const needle = normalizeQuery(query);
  const matches = catalog.filter(entry => normalizeQuery(`${entry.label} ${entry.description} ${entry.group}`).includes(needle));
  return <>
    <label className="he-side-search" htmlFor={id}><Search size={16} aria-hidden="true" /><span className="he-sr-only">Buscar no catálogo</span><input id={id} type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar no catálogo" /></label>
    <nav className="he-side-nav" aria-label="Catálogo de componentes">
      <a className="he-side-nav__overview" href="#visao-geral" aria-current={selected === "visao-geral" ? "page" : undefined} onClick={onNavigate}>Visão geral <span>{catalogSummary.entries}</span></a>
      {groups.map(group => {
        const entries = matches.filter(entry => entry.group === group.id);
        return entries.length ? <section key={group.id}><h2>{group.label}<span>{entries.length}</span></h2>{entries.map(entry => <a key={entry.key} href={`#${entry.key}`} data-catalog-key={entry.key} data-catalog-group={entry.group} aria-current={selected === entry.key ? "page" : undefined} onClick={onNavigate}>{entry.label}</a>)}</section> : null;
      })}
      {!matches.length && <p className="he-side-nav__empty" role="status">Nenhum padrão encontrado. Tente outro termo.</p>}
    </nav>
    <div className="he-side-footer"><p>Hub Editorial · 2.0.0</p><span>Independente do site de produção.</span></div>
  </>;
}

function Overview() {
  return <>
    <section className="he-studio-hero he-inverse">
      <p className="he-eyebrow">Uma linguagem para histórias técnicas.</p>
      <h1>Do componente<br />à arquitetura.</h1>
      <p className="he-studio-hero__lead">Uma biblioteca editorial para construir interfaces, explicar sistemas e demonstrar jornadas. Cores, componentes, gráficos e simulações na mesma linguagem visual.</p>
      <div className="he-actions"><a className="he-button he-button--primary" href="#fundamentos/colors">Explorar os fundamentos <ArrowUpRight size={16} aria-hidden="true" /></a><a className="he-button" href={storybookUrl}>Abrir Storybook <BookOpen size={16} aria-hidden="true" /></a></div>
      <div className="he-studio-hero__index"><div><strong>{catalogSummary.families}</strong><span>Famílias</span></div><div><strong>{catalogSummary.entries}</strong><span>Entradas no catálogo</span></div><div><strong>{catalogSummary.icons}</strong><span>Ícones genéricos</span></div><div><strong>SVG</strong><span>Gráficos e diagramas</span></div></div>
    </section>
    <section className="he-studio-section" aria-labelledby="families-title"><p className="he-label">Explore por intenção</p><h2 id="families-title">Tudo conectado.<br />Cada peça com um propósito.</h2><p className="he-studio-section__lead">Este é um catálogo amplo e extensível, não uma promessa de cobrir todas as notações possíveis. As famílias e exemplos disponíveis estão enumerados abaixo.</p><div className="he-family-grid">{groups.map((group, index) => {
      const entries = catalog.filter(entry => entry.group === group.id);
      return <a className="he-family-card" data-he-accent={group.accent} href={`#${entries[0].key}`} key={group.id}><span className="he-family-card__index">{String(index + 1).padStart(2, "0")}</span><h3>{group.label}</h3><p>{group.description}</p><div><span>{entries.length} {entries.length === 1 ? "entrada" : "entradas"}</span><ArrowUpRight size={18} aria-hidden="true" /></div></a>;
    })}</div></section>
    <section className="he-studio-principles"><div><p className="he-label">Reutilizar, sem reinventar.</p><h2>O mesmo formato.<br />Outras histórias.</h2></div><ul><li><strong>Controles reais.</strong> Explore estados, temas, passos e datasets locais.</li><li><strong>Fontes e vetores locais.</strong> Sem dependência de serviços de imagem ou fontes.</li><li><strong>Conteúdo honesto.</strong> Números e interfaces simuladas estão identificados.</li><li><strong>Sem contas conectadas.</strong> As demonstrações não executam comandos nem alteram recursos.</li></ul></section>
  </>;
}

function EntryView({ entry }: { entry: CatalogEntry }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [width, setWidth] = useState("full");
  const [reset, setReset] = useState(0);
  const code = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const group = groups.find(item => item.id === entry.group);
  return <article className="he-entry" data-entry-key={entry.key}>
    <div className="he-entry__heading"><p className="he-label">{group?.label} / {entry.component}</p><h1>{entry.label}</h1><p>{entry.description}</p></div>
    <div className="he-entry-toolbar">
      <div className="he-entry-tabs" role="group" aria-label="Modo da amostra"><Button variant={tab === "preview" ? "primary" : "secondary"} aria-pressed={tab === "preview"} onClick={() => setTab("preview")}>Exemplo</Button><Button variant={tab === "code" ? "primary" : "secondary"} aria-pressed={tab === "code"} onClick={() => setTab("code")}>Código</Button></div>
      <label htmlFor={`${id}-width`}>Largura da amostra<select id={`${id}-width`} value={width} onChange={event => setWidth(event.target.value)}><option value="full">Disponível</option><option value="768">768 px</option><option value="375">375 px</option></select></label>
      <Button onClick={() => setReset(value => value + 1)}><RotateCcw size={15} aria-hidden="true" /> Reiniciar amostra</Button>
    </div>
    {tab === "preview" ? <div className="he-preview-stage"><div className="he-preview-frame" style={{ maxWidth: width === "full" ? "100%" : `${width}px` }} key={`${entry.key}-${reset}`}>{entry.render()}</div></div> : <section className="he-entry-code"><label className="he-field-label" htmlFor={`${id}-code`}>Uso do componente React<textarea id={`${id}-code`} ref={code} className="he-field he-code-input" rows={7} readOnly value={entry.snippet} /></label><div className="he-component-row"><Button onClick={() => { code.current?.focus(); code.current?.select(); }}>Selecionar código</Button><span className="he-help">Copie com Ctrl+C ou ⌘C.</span></div><p className="he-help">Construa e instale o pacote local antes de usar esse import. O código está disponível no diretório src do kit.</p></section>}
    <div className="he-entry-notes"><p><strong>Contrato de uso.</strong> Preserve labels, estados, foco e tokens. Valide novamente quando substituir cores ou dados.</p><p><strong>Escopo.</strong> Demonstrações locais; não representam produtos em operação, dados reais ou uma certificação de acessibilidade.</p><a href={storybookUrl}>Explorar propriedades e documentação no Storybook <ArrowUpRight size={15} aria-hidden="true" /></a></div>
  </article>;
}

export default function App() {
  const [selected, setSelected] = useState(() => window.location.hash.slice(1) || "visao-geral");
  const [theme, setTheme] = useState<Theme>("light");
  const menu = useRef<HTMLDialogElement>(null);
  const main = useRef<HTMLElement>(null);
  useEffect(() => { document.documentElement.dataset.heTheme = theme; }, [theme]);
  useEffect(() => {
    const update = () => { setSelected(window.location.hash.slice(1) || "visao-geral"); menu.current?.close(); window.scrollTo({ top: 0 }); main.current?.focus({ preventScroll: true }); };
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);
  const entry = catalog.find(item => item.key === selected);
  useEffect(() => { document.title = `${entry?.label ?? (selected === "visao-geral" ? "Showcase" : "Não encontrado")} — Hub Editorial Studio`; }, [entry, selected]);
  return <>
    <a className="he-skip" href="#he-studio-main" onClick={event => { event.preventDefault(); main.current?.focus(); }}>Pular para o conteúdo</a>
    <header className="he-studio-header"><a href="#visao-geral" className="he-brand"><span className="he-mark" aria-hidden="true"><i /><i /><i /><i /></span><span>Hub Editorial <span className="he-studio-brand-extra">Studio</span></span></a><span className="he-studio-header__label">DESIGN SYSTEM / 2.0</span><div className="he-studio-header__tools"><Button className="he-studio-menu-toggle" aria-label="Abrir catálogo" aria-haspopup="dialog" onClick={() => menu.current?.showModal()}><Menu size={18} aria-hidden="true" /></Button><Button aria-label={theme === "light" ? "Ativar tema escuro" : "Ativar tema claro"} aria-pressed={theme === "dark"} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={17} aria-hidden="true" /> : <Sun size={17} aria-hidden="true" />}<span className="he-studio-theme-label">{theme === "light" ? "Escuro" : "Claro"}</span></Button><a className="he-button he-button--primary he-studio-storybook-link" href={storybookUrl}>Storybook <ArrowUpRight size={15} aria-hidden="true" /></a></div></header>
    <div className="he-studio-layout"><aside className="he-studio-sidebar"><Navigation selected={selected} /></aside><main id="he-studio-main" className="he-studio-main" ref={main} tabIndex={-1}>{selected === "visao-geral" ? <Overview /> : entry ? <EntryView key={entry.key} entry={entry} /> : <section className="he-entry"><h1>Padrão não encontrado.</h1><p>O identificador não faz parte deste catálogo. Escolha uma entrada na navegação.</p><a className="he-button" href="#visao-geral">Voltar à visão geral</a></section>}<footer className="he-studio-footer"><p>Hub Editorial Studio · Conteúdo demonstrativo · PT-BR</p><p>Sistema visual próprio, derivado do hub de Paula Silva. Sem alteração no site de produção.</p></footer></main></div>
    <dialog ref={menu} className="he-studio-nav-dialog" aria-label="Navegar no catálogo"><div className="he-studio-nav-dialog__heading"><strong>Catálogo</strong><Button aria-label="Fechar catálogo" onClick={() => menu.current?.close()}><X size={18} aria-hidden="true" /></Button></div><Navigation selected={selected} onNavigate={() => menu.current?.close()} /></dialog>
  </>;
}
