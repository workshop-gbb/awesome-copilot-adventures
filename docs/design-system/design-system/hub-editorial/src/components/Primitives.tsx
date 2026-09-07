import { useId, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Check, ChevronRight, CircleAlert, Copy, Info, LoaderCircle, Search, Settings, X } from "lucide-react";
import { DemoFrame } from "./DemoFrame";
import "./primitives.css";

export const primitiveCatalog = [
  { id: "buttons", label: "Botões", description: "Hierarquia de ações, variantes, ícones e estados nativos." },
  { id: "badges", label: "Badges e tags", description: "Metadados e estados com texto, não apenas cor." },
  { id: "cards", label: "Cards editoriais", description: "Cards pautados, trilhas e painéis de conteúdo." },
  { id: "fields", label: "Campos de formulário", description: "Texto, email, senha, busca, textarea e select." },
  { id: "selection", label: "Controles de seleção", description: "Checkbox, radio, switch e range com labels." },
  { id: "navigation", label: "Navegação", description: "Breadcrumbs, paginação e navegação por etapas." },
  { id: "tabs", label: "Tabs", description: "Abas com setas, Home, End e painéis associados." },
  { id: "accordion", label: "Accordion", description: "Disclosure nativo com conteúdo acessível por teclado." },
  { id: "dialog", label: "Dialog", description: "Modal nativo com foco contido, Escape e confirmação local." },
  { id: "drawer", label: "Drawer", description: "Painel lateral modal, sem alterar configurações reais." },
  { id: "toast", label: "Toast", description: "Feedback explícito e dispensável, sem expiração forçada." },
  { id: "alerts", label: "Alertas", description: "Informação, sucesso, atenção e erro com ícones e texto." },
  { id: "progress", label: "Progresso", description: "Progresso determinado, etapas e estado ocupado." },
  { id: "skeleton", label: "Skeleton", description: "Estrutura de carregamento com alternativa textual." },
  { id: "empty", label: "Estado vazio", description: "Contexto, motivo e uma ação para retomar." },
  { id: "avatars", label: "Avatares", description: "Identidade por iniciais e agrupamento com nomes acessíveis." },
  { id: "tooltip", label: "Tooltip", description: "Ajuda no hover e no foco, dispensável com Escape." },
  { id: "code", label: "Código e atalhos", description: "Blocos de código, seleção manual e teclas de atalho." },
  { id: "stepper", label: "Stepper", description: "Fluxo sequencial com avanço, retorno e recomeço." },
] as const;

export type PrimitiveKind = typeof primitiveCatalog[number]["id"];
export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "quiet" | "danger";
  busy?: boolean;
}

export function Button({ variant = "secondary", busy = false, disabled, className = "", children, ...props }: ButtonProps) {
  return <button {...props} type={props.type ?? "button"} className={`he-button he-button--${variant} ${className}`} disabled={disabled || busy} aria-busy={busy || undefined}>{busy && <LoaderCircle size={16} aria-hidden="true" />}{children}</button>;
}

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return <span className="he-status-badge" data-tone={tone}>{children}</span>;
}

export function Alert({ tone = "info", title, children }: { tone?: Tone; title: string; children: ReactNode }) {
  const Icon = tone === "success" ? Check : tone === "danger" || tone === "warning" ? CircleAlert : Info;
  return <div className="he-alert" data-tone={tone}><Icon size={20} aria-hidden="true" /><div><strong>{title}</strong><p>{children}</p></div></div>;
}

function ButtonExamples() {
  const [message, setMessage] = useState("Acione um botão para testar o feedback local.");
  return <><div className="he-component-row">
    <Button variant="primary" onClick={() => setMessage("Ação principal demonstrada; nenhuma operação externa foi executada.")}>Ação principal <ChevronRight size={16} aria-hidden="true" /></Button>
    <Button onClick={() => setMessage("Ação secundária demonstrada.")}>Secundária</Button>
    <Button variant="quiet" onClick={() => setMessage("Ação discreta demonstrada.")}>Discreta</Button>
    <Button variant="danger" onClick={() => setMessage("Exemplo de ação destrutiva. Nada foi excluído.")}>Excluir — exemplo</Button>
    <Button disabled>Desabilitado</Button><Button busy>Processando — amostra</Button>
    <Button aria-label="Configurações de exemplo" onClick={() => setMessage("Configurações de exemplo selecionadas.")}><Settings size={18} aria-hidden="true" /></Button>
  </div><p className="he-live-status" role="status">{message}</p></>;
}

function FormExamples() {
  const id = useId();
  const [submitted, setSubmitted] = useState(false);
  return <form className="he-form-grid" onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
    <label className="he-field-label">Nome do projeto<input className="he-field" required placeholder="Meu projeto de exemplo" autoComplete="off" /></label>
    <label className="he-field-label">Email fictício<input className="he-field" type="email" required placeholder="nome@exemplo.com" autoComplete="off" /></label>
    <label className="he-field-label">Senha de exemplo<input className="he-field" type="password" autoComplete="new-password" placeholder="Não use uma senha real" /></label>
    <label className="he-field-label">Busca<input className="he-field" type="search" placeholder="Texto de busca local" /></label>
    <label className="he-field-label">Formato<select className="he-field"><option>Artigo</option><option>Playbook</option><option>Ferramenta</option></select></label>
    <label className="he-field-label">Campo desabilitado<input className="he-field" value="Somente demonstração" disabled /></label>
    <label className="he-field-label he-form-grid__wide">Descrição<textarea className="he-field" rows={3} maxLength={240} aria-describedby={`${id}-hint`} /><span className="he-help" id={`${id}-hint`}>Até 240 caracteres. Nenhum dado é enviado ou salvo.</span></label>
    <label className="he-field-label">Amostra de erro<input className="he-field" value="valor inválido" readOnly aria-invalid="true" aria-describedby={`${id}-error`} /><span className="he-error" id={`${id}-error`}>Exemplo: explique como corrigir o valor.</span></label>
    <div className="he-form-grid__wide he-component-row"><Button type="submit" variant="primary">Validar localmente</Button><Button type="reset" onClick={() => setSubmitted(false)}>Limpar</Button></div>
    <p className="he-live-status he-form-grid__wide" role="status">{submitted ? "Validação nativa concluída. Demonstração local, sem envio ou armazenamento." : "Use somente dados fictícios neste formulário de exemplo."}</p>
  </form>;
}

function SelectionExamples() {
  const id = useId();
  const [enabled, setEnabled] = useState(false);
  const [size, setSize] = useState(50);
  return <div className="he-form-grid">
    <fieldset className="he-choice-group"><legend>Formatos de exemplo</legend>{["Artigos", "Diagramas", "Ferramentas"].map((label, index) => <label className="he-choice" key={label}><input type="checkbox" defaultChecked={index === 0} />{label}</label>)}</fieldset>
    <fieldset className="he-choice-group"><legend>Densidade</legend>{["Confortável", "Compacta"].map((label, index) => <label className="he-choice" key={label}><input type="radio" name={`${id}-density`} defaultChecked={index === 0} />{label}</label>)}</fieldset>
    <label className="he-choice"><input type="checkbox" role="switch" checked={enabled} onChange={event => setEnabled(event.target.checked)} />Notificações locais {enabled ? "ativadas" : "desativadas"}</label>
    <label className="he-field-label">Intensidade da amostra: {size}%<input className="he-range" type="range" min={0} max={100} step={10} value={size} onChange={event => setSize(Number(event.target.value))} /></label>
  </div>;
}

export function Tabs({ items }: { items: readonly { label: string; content: ReactNode }[] }) {
  const id = useId();
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="he-tabs"><div role="tablist" aria-label="Detalhes do componente" className="he-tabs__list">{items.map((item, index) =>
    <button key={item.label} type="button" ref={node => { refs.current[index] = node; }} role="tab" id={`${id}-tab-${index}`} aria-selected={index === active} aria-controls={`${id}-panel-${index}`} tabIndex={index === active ? 0 : -1} onClick={() => setActive(index)} onKeyDown={event => {
      const next = event.key === "ArrowRight" ? (index + 1) % items.length : event.key === "ArrowLeft" ? (index + items.length - 1) % items.length : event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : null;
      if (next !== null) { event.preventDefault(); setActive(next); refs.current[next]?.focus(); }
    }}>{item.label}</button>)}</div>{items.map((item, index) => <div key={item.label} role="tabpanel" tabIndex={0} id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={index !== active} className="he-tabs__panel">{item.content}</div>)}</div>;
}

function OverlayExample({ drawer = false }: { drawer?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const id = useId();
  const [message, setMessage] = useState("");
  return <>
    <Button variant="primary" onClick={() => dialog.current?.showModal()}>Abrir {drawer ? "painel lateral" : "dialog"}</Button>
    <dialog ref={dialog} className={`he-dialog ${drawer ? "he-dialog--drawer" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="he-dialog__header"><h3 id={`${id}-title`}>{drawer ? "Configuração demonstrativa" : "Confirmar exemplo"}</h3><Button aria-label="Fechar" onClick={() => dialog.current?.close()}><X size={18} aria-hidden="true" /></Button></div>
      <p>Este é um componente local. Nenhuma configuração real será alterada.</p>
      {drawer && <label className="he-field-label">Nome da visualização<input className="he-field" defaultValue="Minha visualização" /></label>}
      <form method="dialog" className="he-component-row"><Button type="submit">Cancelar</Button><Button type="submit" variant="primary" onClick={() => setMessage("Confirmação local registrada apenas na interface.")}>Confirmar exemplo</Button></form>
    </dialog>
    <p className="he-live-status" role="status">{message}</p>
  </>;
}

function ToastExample() {
  const [visible, setVisible] = useState(false);
  return <><Button onClick={() => setVisible(true)}>Mostrar notificação</Button>{visible && <div className="he-toast"><div role="status"><strong>Exemplo concluído.</strong><p>Notificação local, sem operação externa.</p></div><Button aria-label="Dispensar notificação" onClick={() => setVisible(false)}><X size={18} aria-hidden="true" /></Button></div>}</>;
}

function ProgressExample() {
  const [value, setValue] = useState(40);
  return <div className="he-component-stack"><label className="he-field-label">Progresso de demonstração: {value}%<progress max={100} value={value} className="he-progress" /></label><div className="he-component-row"><Button disabled={value === 0} onClick={() => setValue(Math.max(0, value - 20))}>Retornar</Button><Button disabled={value === 100} onClick={() => setValue(Math.min(100, value + 20))}>Avançar</Button><Button onClick={() => setValue(0)}>Recomeçar</Button></div><p className="he-live-status" role="status">{value === 100 ? "Sequência demonstrativa concluída." : "Progresso manual: nenhuma tarefa está sendo executada."}</p></div>;
}

function TooltipExample() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const id = useId();
  return <><div className="he-tooltip-anchor" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}><Button aria-label="Ação de cópia demonstrativa" aria-describedby={open ? id : undefined} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={event => { if (event.key === "Escape") setOpen(false); }} onClick={() => setMessage("Exemplo acionado. Nenhum conteúdo foi copiado.")}><Copy size={18} aria-hidden="true" /></Button>{open && <span className="he-tooltip" role="tooltip" id={id}>Ação de exemplo. Escape dispensa esta ajuda.</span>}</div><p className="he-live-status" role="status">{message}</p></>;
}

function StepperExample() {
  const [step, setStep] = useState(0);
  const labels = ["Contexto", "Composição", "Revisão", "Conclusão"];
  return <><ol className="he-stepper">{labels.map((label, index) => <li key={label} aria-current={step === index ? "step" : undefined}><span>{index < step ? <Check size={16} aria-hidden="true" /> : index + 1}</span>{label}</li>)}</ol><p className="he-live-status" role="status">Etapa {step + 1}: {labels[step]}. Fluxo demonstrativo.</p><div className="he-component-row"><Button disabled={step === 0} onClick={() => setStep(step - 1)}>Anterior</Button><Button variant="primary" disabled={step === 3} onClick={() => setStep(step + 1)}>Próxima etapa</Button><Button onClick={() => setStep(0)}>Recomeçar</Button></div></>;
}

function NavigationExample() {
  const [page, setPage] = useState(1);
  return <div className="he-component-stack"><nav aria-label="Breadcrumb"><ol className="he-breadcrumb"><li><a href="#componentes/navigation">Biblioteca</a></li><li><ChevronRight size={14} aria-hidden="true" /> Componentes</li><li aria-current="page"><ChevronRight size={14} aria-hidden="true" /> Navegação</li></ol></nav><nav className="he-component-row" aria-label="Páginas da amostra"><Button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</Button>{[1, 2, 3].map(value => <Button key={value} variant={value === page ? "primary" : "secondary"} aria-current={value === page ? "page" : undefined} aria-label={`Página ${value}`} onClick={() => setPage(value)}>{value}</Button>)}<Button disabled={page === 3} onClick={() => setPage(page + 1)}>Próxima</Button></nav><p role="status" className="he-live-status">Página demonstrativa {page} de 3.</p></div>;
}

function CodeExample() {
  const field = useRef<HTMLTextAreaElement>(null);
  return <div className="he-component-stack"><label className="he-field-label">Trecho reutilizável<textarea ref={field} className="he-field he-code-input" rows={6} readOnly value={'import { Button } from "hub-editorial-studio";\n\n<Button variant="primary" onClick={handleAction}>\n  Continuar\n</Button>'} /></label><div className="he-component-row"><Button onClick={() => { field.current?.focus(); field.current?.select(); }}>Selecionar código</Button><span>Copie com <kbd>Ctrl</kbd> + <kbd>C</kbd> ou <kbd>⌘</kbd> + <kbd>C</kbd>.</span></div><p className="he-help">Após instalar o pacote construído. Defina handleAction na sua aplicação.</p></div>;
}

export function PrimitiveDemo({ kind }: { kind: PrimitiveKind }) {
  const descriptor = primitiveCatalog.find(item => item.id === kind);
  if (!descriptor) throw new Error(`Componente desconhecido: ${kind}`);
  const examples: Record<PrimitiveKind, ReactNode> = {
    buttons: <ButtonExamples />,
    badges: <div className="he-component-stack"><div className="he-component-row"><Badge>Rascunho</Badge><Badge tone="info">Em revisão</Badge><Badge tone="success">Concluído</Badge><Badge tone="warning">Atenção</Badge><Badge tone="danger">Erro</Badge></div><div className="he-badges"><span className="he-badge">Guia</span><span className="he-badge">SVG</span><span className="he-badge">TypeScript</span></div></div>,
    cards: <div className="he-grid"><article className="he-card" data-he-accent="blue"><p className="he-card__kicker">Editorial</p><h3 className="he-card__title">Hierarquia antes da decoração.</h3><p className="he-card__description">Um card com introdução, contexto e metadados.</p><div className="he-card__meta">Amostra sem ação</div></article><article className="he-path" data-he-accent="green"><p className="he-card__kicker">Trilha</p><h3 className="he-card__title">Um caminho de leitura.</h3><p>Raio de 12 px, espaço generoso e uma cor por intenção.</p><Badge tone="success">Exemplo</Badge></article></div>,
    fields: <FormExamples />,
    selection: <SelectionExamples />,
    navigation: <NavigationExample />,
    tabs: <Tabs items={[{ label: "Visão geral", content: <p>Contexto e intenção do componente.</p> }, { label: "Uso", content: <p>Use as setas, Home e End para navegar entre abas.</p> }, { label: "Acessibilidade", content: <p>O painel está associado à aba ativa por identificadores únicos.</p> }]} />,
    accordion: <div>{["Quando usar este padrão?", "Como adaptar a composição?", "O que verificar antes de publicar?"].map((title, index) => <details className="he-details" key={title} open={index === 0}><summary>{title}</summary><p>{["Use para revelar detalhes sem sobrecarregar a leitura principal.", "Mantenha a hierarquia, os tokens e as mensagens de estado.", "Teste teclado, contraste, responsividade e conteúdo real."][index]}</p></details>)}</div>,
    dialog: <OverlayExample />,
    drawer: <OverlayExample drawer />,
    toast: <ToastExample />,
    alerts: <div className="he-component-stack"><Alert title="Informação" tone="info">Contexto útil para a próxima ação.</Alert><Alert title="Confirmação — amostra" tone="success">Só use após a operação realmente terminar.</Alert><Alert title="Atenção" tone="warning">Explique a condição que exige cuidado.</Alert><Alert title="Erro — amostra" tone="danger">Informe o problema conhecido e a próxima ação.</Alert></div>,
    progress: <ProgressExample />,
    skeleton: <div className="he-component-stack" aria-busy="true"><span className="he-muted">Amostra estática de carregamento, sem requisição em andamento.</span><div className="he-skeleton" aria-hidden="true" /><div className="he-skeleton he-skeleton--short" aria-hidden="true" /><div className="he-skeleton he-skeleton--block" aria-hidden="true" /></div>,
    empty: <EmptyExample />,
    avatars: <div className="he-component-row" role="list" aria-label="Colaboradores fictícios">{["Ana Exemplo", "Bruno Exemplo", "Carla Exemplo", "Diego Exemplo"].map((name, index) => <div className="he-avatar-item" role="listitem" key={name}><span className="he-avatar" data-tone={index % 2 ? "info" : "success"} aria-hidden="true">{name.split(" ").map(part => part[0]).join("")}</span><span>{name}</span></div>)}</div>,
    tooltip: <TooltipExample />,
    code: <CodeExample />,
    stepper: <StepperExample />,
  };
  return <DemoFrame title={descriptor.label} description={descriptor.description}>{examples[kind]}</DemoFrame>;
}

function EmptyExample() {
  const [hasItem, setHasItem] = useState(false);
  return hasItem ? <div className="he-component-stack"><Alert title="Item demonstrativo" tone="success">Um item foi adicionado apenas ao estado local deste exemplo.</Alert><Button onClick={() => setHasItem(false)}>Voltar ao estado vazio</Button></div> : <div className="he-empty-state"><Search size={32} aria-hidden="true" /><h3>Nenhum item por aqui.</h3><p>Explique por que esta área está vazia e como continuar.</p><Button variant="primary" onClick={() => setHasItem(true)}>Adicionar exemplo local</Button></div>;
}
