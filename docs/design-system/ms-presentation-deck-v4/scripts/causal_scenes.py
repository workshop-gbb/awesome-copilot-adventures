"""Causal scenes: finite, replayable explanations with a complete motion-free state."""

from html import escape
from visual_layer import svg_icon


CSS = """
.causal-scene { width:100%; margin-top:12px; }
.causal-scene svg.scn { display:block; width:100%; height:auto; overflow:visible; }
.causal-scene .causal-node { fill:var(--ps-color-paper); stroke:var(--cc); stroke-width:1.7; }
.causal-scene .causal-title { font:600 21px var(--ps-font-sans); fill:var(--ps-color-ink); }
.causal-scene .causal-sub { font:400 15px var(--ps-font-sans); fill:var(--ps-color-ink-2); }
.causal-scene .causal-label { font:500 16px var(--ps-font-mono); fill:var(--ps-color-ink-2); }
.causal-scene .causal-kicker { font:600 13px var(--ps-font-mono); letter-spacing:.08em; fill:var(--ps-color-ink-3); }
.causal-scene .causal-wire { fill:none; stroke:var(--cc); stroke-width:2.5; stroke-linecap:round; stroke-linejoin:round; }
.causal-scene .causal-frame { fill:none; stroke:var(--ps-color-rule-2); stroke-width:1.5; }
.causal-scene .causal-zone { fill:color-mix(in srgb,var(--cc) 7%,var(--ps-color-paper)); stroke:var(--cc); stroke-width:1.3; }
.causal-scene .causal-packet { opacity:0; offset-rotate:0deg; fill:var(--cc); }
.causal-scene__captions { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:26px; margin-top:14px; }
.causal-scene__caption { min-width:0; border-top:2px solid var(--cc); padding-top:12px; }
.causal-scene__caption b { display:block; font-size:18px; font-weight:600; margin-bottom:6px; color:var(--ps-color-ink); }
.causal-scene__caption p { margin:0; font-size:15px; line-height:1.45; color:var(--ps-color-ink-2); }
@media (prefers-reduced-motion:no-preference) {
  .slide[data-active="true"] .causal-scene .causal-reveal {
    animation:causalReveal .48s cubic-bezier(.22,1,.36,1) var(--at,0s) both;
  }
  .slide[data-active="true"] .causal-scene .causal-wire {
    animation:causalDraw .52s cubic-bezier(.22,1,.36,1) var(--at,0s) both;
  }
  .slide[data-active="true"] .causal-scene .causal-packet {
    animation:causalPacket .62s ease-in-out var(--at,0s) both;
  }
}
@keyframes causalReveal {
  from { opacity:0; transform:translateY(9px); }
  to { opacity:1; transform:translateY(0); }
}
@keyframes causalDraw { from { stroke-dasharray:100; stroke-dashoffset:100; } to { stroke-dasharray:100; stroke-dashoffset:0; } }
@keyframes causalPacket {
  0% { opacity:0; offset-distance:0%; }
  12% { opacity:1; }
  88% { opacity:1; }
  100% { opacity:0; offset-distance:100%; }
}
@media (prefers-reduced-motion:reduce) {
  .causal-scene .causal-reveal { opacity:1; transform:none; animation:none; }
  .causal-scene .causal-wire { stroke-dasharray:none; stroke-dashoffset:0; animation:none; }
  .causal-scene .causal-packet { display:none; animation:none; }
}
"""

COLORS = {color: f"var(--ps-text-{color})" for color in ("blue", "green", "yellow", "red")}

SCENES = {
    "agent-anatomy": {
        "title": ("An agent combines a model and a harness.", "Um agente combina modelo e harness.", "Un agente combina modelo y harness."),
        "description": (
            "An agent contains a model and its harness. A circle identifies the model; a surrounding control system contains context, tools, permissions and evidence. This is composition, not execution order.",
            "Um agente reúne modelo e harness. O círculo identifica o modelo; o sistema de controle reúne contexto, tools, permissões e evidência. É composição, não ordem de execução.",
            "Un agente reúne modelo y harness. El círculo identifica el modelo; el sistema de control reúne contexto, tools, permisos y evidencia. Es composición, no orden de ejecución.",
        ),
        "labels": {
            "agent": ("AGENT", "AGENTE", "AGENTE"),
            "model": ("Model", "Modelo", "Modelo"),
            "proposes": ("proposes", "propõe", "propone"),
            "harness": ("HARNESS", "HARNESS", "HARNESS"),
            "context": ("Context", "Contexto", "Contexto"),
            "contextSub": ("select what matters", "selecionar o que importa", "seleccionar lo relevante"),
            "tools": ("Tools", "Tools", "Tools"),
            "toolsSub": ("execute the action", "executar a ação", "ejecutar la acción"),
            "permission": ("Permissions", "Permissões", "Permisos"),
            "permissionSub": ("define the boundary", "definir o limite", "definir el límite"),
            "evidence": ("Evidence", "Evidência", "Evidencia"),
            "evidenceSub": ("verify the outcome", "verificar o resultado", "verificar el resultado"),
        },
        "captions": [
            (("One part reasons", "Uma parte raciocina", "Una parte razona"), ("Model capability matters, but it does not execute a tool by itself.", "A capacidade do modelo importa, mas ele não executa uma tool sozinho.", "La capacidad del modelo importa, pero no ejecuta una tool por sí solo."), "blue"),
            (("The system acts", "O sistema age", "El sistema actúa"), ("The harness turns a proposed action into controlled execution.", "O harness transforma uma ação proposta em execução controlada.", "El harness convierte una acción propuesta en ejecución controlada."), "yellow"),
            (("The team governs", "O time governa", "El equipo gobierna"), ("You own instructions, acceptance criteria, budgets and handoffs.", "Você governa instruções, critérios de aceite, orçamentos e transferências.", "Usted gobierna instrucciones, criterios de aceptación, presupuestos y traspasos."), "green"),
        ],
    },
    "feedback-loop": {
        "title": ("Evidence changes the next iteration.", "A evidência muda a próxima iteração.", "La evidencia cambia la siguiente iteración."),
        "description": (
            "Context reaches the model, the harness runs requested tools, and their results return as context. The return path completes the loop.",
            "O contexto chega ao modelo, o harness executa as tools solicitadas e os resultados voltam como contexto. O retorno fecha o loop.",
            "El contexto llega al modelo, el harness ejecuta las tools solicitadas y los resultados vuelven como contexto. El retorno cierra el ciclo.",
        ),
        "labels": {
            "scope": ("THE HARNESS ORCHESTRATES THE ROUND", "O HARNESS ORQUESTRA A RODADA", "EL HARNESS ORQUESTA LA RONDA"),
            "context": ("Context", "Contexto", "Contexto"),
            "contextSub": ("what the model sees", "o que o modelo vê", "lo que ve el modelo"),
            "model": ("Model", "Modelo", "Modelo"),
            "modelSub": ("proposes an action", "propõe uma ação", "propone una acción"),
            "tools": ("Tools", "Tools", "Tools"),
            "toolsSub": ("the harness executes", "o harness executa", "el harness ejecuta"),
            "result": ("Result", "Resultado", "Resultado"),
            "resultSub": ("output or failure", "saída ou falha", "salida o fallo"),
            "return": ("NEW EVIDENCE, NEXT ROUND", "NOVA EVIDÊNCIA, PRÓXIMA RODADA", "NUEVA EVIDENCIA, SIGUIENTE RONDA"),
        },
        "captions": [
            (("Propose", "Propor", "Proponer"), ("The model requests an action; it does not execute it.", "O modelo solicita uma ação; ele não a executa.", "El modelo solicita una acción; no la ejecuta."), "blue"),
            (("Execute", "Executar", "Ejecutar"), ("Tools run inside the harness's permission boundaries.", "As tools rodam nos limites de permissão do harness.", "Las tools operan dentro de los permisos del harness."), "yellow"),
            (("Observe", "Observar", "Observar"), ("A result changes the next request, not the model weights.", "O resultado muda a próxima requisição, não os pesos do modelo.", "El resultado cambia la próxima solicitud, no los pesos del modelo."), "green"),
        ],
    },
    "verification-gate": {
        "title": ("A check creates a decision, not a decoration.", "Uma checagem cria uma decisão, não um enfeite.", "Una comprobación crea una decisión, no un adorno."),
        "description": (
            "A proposed change is checked. Passing enables review; failure returns actionable evidence for repair. These are alternative paths, not measured outcomes.",
            "Uma mudança é verificada. Sucesso permite revisão; falha devolve evidência acionável para correção. São caminhos alternativos, não resultados medidos.",
            "Se verifica un cambio. El éxito permite revisión; el fallo devuelve evidencia para corregir. Son rutas alternativas, no resultados medidos.",
        ),
        "labels": {
            "scope": ("TWO OUTCOMES, ONE EXPLICIT CONTRACT", "DOIS RESULTADOS, UM CONTRATO EXPLÍCITO", "DOS RESULTADOS, UN CONTRATO EXPLÍCITO"),
            "change": ("Change", "Mudança", "Cambio"),
            "changeSub": ("a proposed artifact", "um artefato proposto", "un artefacto propuesto"),
            "check": ("Verification", "Verificação", "Verificación"),
            "checkSub": ("tests, types, schema", "testes, tipos, schema", "pruebas, tipos, schema"),
            "pass": ("Ready for review", "Pronto para revisão", "Listo para revisión"),
            "passSub": ("checks passed", "checagens passaram", "comprobaciones aprobadas"),
            "fail": ("Repair with evidence", "Corrigir com evidência", "Corregir con evidencia"),
            "failSub": ("failure + bounded retry", "falha + tentativa limitada", "fallo + intento limitado"),
        },
        "captions": [
            (("Independent signal", "Sinal independente", "Señal independiente"), ("A failing test is stronger evidence than asking the author again.", "Um teste falhando vale mais que perguntar de novo ao autor.", "Una prueba fallida aporta más que preguntar de nuevo al autor."), "blue"),
            (("Actionable failure", "Falha acionável", "Fallo accionable"), ("Return the error and the next useful action, within a budget.", "Devolva o erro e a próxima ação útil, dentro de um orçamento.", "Devuelva el error y la siguiente acción útil, con un presupuesto."), "red"),
            (("Review still matters", "A revisão continua", "La revisión continúa"), ("Passing a local check does not replace required CI checks.", "Passar na checagem local não substitui checks obrigatórios na CI.", "Aprobar una comprobación local no sustituye los checks de CI."), "green"),
        ],
    },
    "context-assembly": {
        "title": ("Context is assembled before the model is called.", "O contexto é montado antes de chamar o modelo.", "El contexto se prepara antes de llamar al modelo."),
        "description": (
            "Four context layers assemble into a request: instructions, tool definitions, relevant files and conversation. The diagram is schematic, not a token allocation chart.",
            "Quatro camadas formam a requisição: instruções, definições de tools, arquivos relevantes e conversa. O esquema não representa proporções de tokens.",
            "Cuatro capas forman la solicitud: instrucciones, definiciones de tools, archivos relevantes y conversación. El esquema no representa proporciones de tokens.",
        ),
        "labels": {
            "scope": ("REQUEST ASSEMBLY", "MONTAGEM DA REQUISIÇÃO", "MONTAJE DE LA SOLICITUD"),
            "system": ("Instructions", "Instruções", "Instrucciones"),
            "tools": ("Tool definitions", "Definições de tools", "Definiciones de tools"),
            "files": ("Relevant files", "Arquivos relevantes", "Archivos relevantes"),
            "history": ("Conversation + results", "Conversa + resultados", "Conversación + resultados"),
            "model": ("Model", "Modelo", "Modelo"),
            "modelSub": ("a finite window", "uma janela finita", "una ventana finita"),
        },
        "captions": [
            (("Keep stable", "Manter estável", "Mantener estable"), ("Short, versioned instructions preserve the operating rules.", "Instruções curtas e versionadas preservam as regras de trabalho.", "Instrucciones breves y versionadas preservan las reglas de trabajo."), "blue"),
            (("Load on demand", "Carregar sob demanda", "Cargar bajo demanda"), ("Expose relevant tools and files, not the entire repository.", "Exponha tools e arquivos relevantes, não o repositório inteiro.", "Exponga tools y archivos relevantes, no todo el repositorio."), "green"),
            (("Budget the history", "Orçar o histórico", "Presupuestar el historial"), ("Conversation grows. Compaction trades detail for space.", "A conversa cresce. Compaction troca detalhe por espaço.", "La conversación crece. Compaction cambia detalle por espacio."), "yellow"),
        ],
    },
    "prefix-reuse": {
        "title": ("An unchanged prefix can be reused.", "Um prefixo estável pode ser reutilizado.", "Un prefijo estable puede reutilizarse."),
        "description": (
            "Two consecutive requests share instructions, tools and stable context; only the final user content changes. Equal blocks denote equality, not measured sizes or a guaranteed cache hit.",
            "Duas requisições compartilham instruções, tools e contexto estável; só o conteúdo final muda. Blocos iguais indicam igualdade, não tamanhos medidos nem cache hit garantido.",
            "Dos solicitudes comparten instrucciones, tools y contexto estable; solo cambia el contenido final. Bloques iguales indican igualdad, no tamaños medidos ni cache hit garantizado.",
        ),
        "labels": {
            "scope": ("SAME PREFIX, DIFFERENT SUFFIX", "MESMO PREFIXO, OUTRO SUFIXO", "MISMO PREFIJO, OTRO SUFIJO"),
            "first": ("Request A", "Requisição A", "Solicitud A"),
            "second": ("Request B", "Requisição B", "Solicitud B"),
            "instructions": ("Instructions", "Instruções", "Instrucciones"),
            "tools": ("Tools", "Tools", "Tools"),
            "stable": ("Stable context", "Contexto estável", "Contexto estable"),
            "changeA": ("Task / result A", "Tarefa / resultado A", "Tarea / resultado A"),
            "changeB": ("Task / result B", "Tarefa / resultado B", "Tarea / resultado B"),
            "shared": ("EXACT PREFIX MATCH", "PREFIXO EXATAMENTE IGUAL", "PREFIJO EXACTAMENTE IGUAL"),
        },
        "captions": [
            (("Preserve the prefix", "Preservar o prefixo", "Preservar el prefijo"), ("Early changes can invalidate reuse of everything after them.", "Mudar o início pode invalidar o reuso do que vem depois.", "Cambiar el inicio puede invalidar el reuso de lo que sigue."), "blue"),
            (("Append the variable", "Acrescentar o variável", "Añadir lo variable"), ("Keep newly loaded tools and task content after stable context.", "Mantenha tools recém-carregadas e a tarefa após o contexto estável.", "Mantenga las tools recién cargadas y la tarea después del contexto estable."), "yellow"),
            (("Measure real hits", "Medir hits reais", "Medir hits reales"), ("Retention and discounts depend on the model and provider.", "Retenção e descontos dependem do modelo e do provedor.", "La retención y los descuentos dependen del modelo y del proveedor."), "green"),
        ],
    },
    "parallel-ownership": {
        "title": ("Separate work, then integrate explicitly.", "Separe o trabalho e integre explicitamente.", "Separe el trabajo e integre explícitamente."),
        "description": (
            "A parent delegates three bounded tasks with separate contexts. The results converge at an explicit integration and verification step, not an automatic merge.",
            "Um pai delega três tarefas delimitadas com contextos próprios. Os resultados convergem para integração e verificação explícitas, não um merge automático.",
            "Un padre delega tres tareas delimitadas con contextos propios. Los resultados convergen en integración y verificación explícitas, no en un merge automático.",
        ),
        "labels": {
            "parent": ("Parent", "Pai", "Padre"),
            "parentSub": ("scope + owner", "escopo + dono", "alcance + responsable"),
            "map": ("Investigate", "Investigar", "Investigar"),
            "mapSub": ("question + evidence", "pergunta + evidência", "pregunta + evidencia"),
            "build": ("Implement", "Implementar", "Implementar"),
            "buildSub": ("exclusive file ownership", "posse exclusiva dos arquivos", "propiedad exclusiva de archivos"),
            "check": ("Verify", "Verificar", "Verificar"),
            "checkSub": ("independent check", "checagem independente", "comprobación independiente"),
            "integrate": ("Integrate", "Integrar", "Integrar"),
            "integrateSub": ("review + checks", "revisão + checagens", "revisión + comprobaciones"),
        },
        "captions": [
            (("Delegate a boundary", "Delegar um limite", "Delegar un límite"), ("Give each task a clear output and a named owner.", "Dê uma saída clara e um dono definido a cada tarefa.", "Asigne una salida clara y un responsable a cada tarea."), "blue"),
            (("Do not overlap writes", "Não sobrepor escritas", "No solapar escrituras"), ("Separate contexts do not isolate a shared filesystem.", "Contextos separados não isolam um filesystem compartilhado.", "Los contextos separados no aíslan un filesystem compartido."), "red"),
            (("Integrate the results", "Integrar os resultados", "Integrar los resultados"), ("Parallel completion is not evidence that the combined change works.", "Terminar em paralelo não prova que a mudança combinada funciona.", "Terminar en paralelo no prueba que el cambio combinado funciona."), "green"),
        ],
    },
}


def _text(x, y, label, cls="causal-label", anchor="start"):
    return f'<text x="{x}" y="{y}" class="{cls}" text-anchor="{anchor}">{label}</text>'


def _reveal(body, at):
    return f'<g class="causal-reveal" style="--at:{at}s">{body}</g>'


def _node(x, y, w, h, label, sub, color, icon, at):
    color = COLORS[color]
    mark = svg_icon(icon, x + 18, y + 20, 28, color if icon.startswith("i-") else None)
    return _reveal(
        f'<rect class="causal-node" x="{x}" y="{y}" width="{w}" height="{h}" rx="12" style="--cc:{color}"/>'
        + mark + _text(x + 58, y + 40, label, "causal-title")
        + _text(x + 18, y + 70, sub, "causal-sub"), at,
    )


def _wire(path, color, at, uid, packet=False):
    cc = COLORS[color]
    wire = (
        f'<path class="causal-wire" d="{path}" pathLength="100" '
        f'style="--cc:{cc};--at:{at}s" marker-end="url(#{uid}-{color})"/>'
    )
    if packet:
        wire += (
            f'<circle class="causal-packet" r="4.5" style="--cc:{cc};--at:{at + .1}s;'
            f'offset-path:path(\'{path}\')"/>'
        )
    return wire


def _anatomy(labels, uid):
    return (
        f'<rect class="causal-frame" x="20" y="22" width="1080" height="332" rx="20"/>'
        + _text(44, 50, labels["agent"], "causal-kicker")
        + _reveal(
            f'<circle cx="220" cy="202" r="92" fill="var(--ps-color-paper)" stroke="{COLORS["blue"]}" stroke-width="2"/>'
            + svg_icon("i-spark", 204, 134, 32, COLORS["blue"])
            + _text(220, 204, labels["model"], "causal-title", "middle")
            + _text(220, 231, labels["proposes"], "causal-sub", "middle"), .15)
        + _reveal('<text x="370" y="218" class="causal-title" text-anchor="middle" style="font-size:52px">+</text>', .55)
        + _reveal(f'<rect class="causal-frame" x="438" y="60" width="640" height="274" rx="16"/>'
                  + _text(462, 87, labels["harness"], "causal-kicker"), .8)
        + _node(458, 110, 276, 90, labels["context"], labels["contextSub"], "blue", "i-file", 1.08)
        + _node(780, 110, 276, 90, labels["tools"], labels["toolsSub"], "yellow", "i-terminal", 1.46)
        + _node(458, 226, 276, 90, labels["permission"], labels["permissionSub"], "red", "i-shield", 1.84)
        + _node(780, 226, 276, 90, labels["evidence"], labels["evidenceSub"], "green", "i-test", 2.22)
    )


def _feedback(labels, uid):
    p = [_text(20, 28, labels["scope"], "causal-kicker")]
    for i, (key, sub, color, icon) in enumerate((
        ("context", "contextSub", "blue", "i-file"),
        ("model", "modelSub", "blue", "i-spark"),
        ("tools", "toolsSub", "yellow", "i-terminal"),
        ("result", "resultSub", "green", "i-test"),
    )):
        x = 20 + i * 280
        if i:
            p.append(_wire(f"M{x - 44} 128 H{x - 8}", color, .36 + i * .5, uid, True))
        p.append(_node(x, 82, 236, 96, labels[key], labels[sub], color, icon, .12 + i * .56))
    p.append(_wire("M978 182 V274 H138 V186", "green", 2.42, uid, True))
    p.append(_reveal(_text(558, 320, labels["return"], "causal-label", "middle"), 2.92))
    return "".join(p)


def _verification(labels, uid):
    return (
        _text(20, 28, labels["scope"], "causal-kicker")
        + _wire("M260 182 H350", "blue", .6, uid, True)
        + _wire("M620 182 H680 V87 H758", "green", 2.5, uid, True)
        + _wire("M620 182 H680 V280 H758", "red", 1.65, uid, True)
        + _node(20, 136, 240, 94, labels["change"], labels["changeSub"], "blue", "i-code", .12)
        + _node(360, 136, 260, 94, labels["check"], labels["checkSub"], "yellow", "i-test", .95)
        + _node(768, 40, 330, 94, labels["pass"], labels["passSub"], "green", "i-check", 2.78)
        + _node(768, 233, 330, 94, labels["fail"], labels["failSub"], "red", "i-wrench", 1.92)
    )


def _context(labels, uid):
    p = [f'<rect class="causal-frame" x="20" y="16" width="744" height="328" rx="14"/>',
         _text(44, 46, labels["scope"], "causal-kicker")]
    for i, (key, color) in enumerate((("system", "blue"), ("tools", "blue"), ("files", "green"), ("history", "yellow"))):
        y = 67 + i * 64
        p.append(_reveal(
            f'<rect class="causal-zone" x="40" y="{y}" width="704" height="48" rx="7" style="--cc:{COLORS[color]}"/>'
            + _text(61, y + 31, labels[key], "causal-title"), .16 + i * .5,
        ))
    p.append(_wire("M774 183 H834", "blue", 2.26, uid, True))
    p.append(_node(846, 136, 250, 96, labels["model"], labels["modelSub"], "blue", "i-spark", 2.65))
    return "".join(p)


def _prefix(labels, uid):
    p = [_text(20, 28, labels["scope"], "causal-kicker")]
    for row, y in enumerate((84, 217)):
        p.append(_reveal(_text(20, y + 33, labels["first" if row == 0 else "second"], "causal-sub"), .12 + row * 1.15))
        for i, (x, w, key) in enumerate(((156, 230, "instructions"), (400, 152, "tools"), (566, 240, "stable"), (838, 264, "changeA" if row == 0 else "changeB"))):
            color = "yellow" if i == 3 else "blue"
            p.append(_reveal(
                f'<rect class="causal-zone" x="{x}" y="{y}" width="{w}" height="64" rx="8" style="--cc:{COLORS[color]}"/>'
                + _text(x + w / 2, y + 38, labels[key], "causal-label", "middle"), .25 + row * 1.15 + i * .18,
            ))
    p.append(_wire("M156 298 V314 H804 V298", "green", 2.64, uid))
    p.append(_reveal(_text(480, 343, labels["shared"], "causal-label", "middle"), 2.9))
    return "".join(p)


def _parallel(labels, uid):
    p = []
    for i, (key, sub, color) in enumerate((("map", "mapSub", "blue"), ("build", "buildSub", "blue"), ("check", "checkSub", "green"))):
        y = 24 + i * 120
        p.append(_wire(f"M244 187 H286 V{y + 46} H330", color, .52 + i * .25, uid, True))
        p.append(_wire(f"M714 {y + 46} H768 V187 H818", "green", 1.7 + i * .35, uid, True))
        p.append(_node(340, y, 374, 92, labels[key], labels[sub], color, "i-file" if i < 2 else "i-test", .82 + i * .3))
    p.append(_node(20, 141, 224, 96, labels["parent"], labels["parentSub"], "blue", "gh-copilot", .12))
    p.append(_node(828, 141, 270, 96, labels["integrate"], labels["integrateSub"], "green", "i-branch", 2.92))
    return "".join(p)


DRAW = {
    "agent-anatomy": _anatomy,
    "feedback-loop": _feedback,
    "verification-gate": _verification,
    "context-assembly": _context,
    "prefix-reuse": _prefix,
    "parallel-ownership": _parallel,
}


def render(deck, kind):
    """Return one named scene; labels, descriptions and captions follow the deck locale."""
    if kind not in SCENES:
        raise ValueError(f"Unknown causal scene: {kind}")
    deck.component_style("causal-scenes", CSS)
    spec = SCENES[kind]
    key = deck.nk()
    uid = f"causal-{key}"

    def text(name, values, tag="span"):
        return f'<{tag} {deck.reg(f"{key}.{name}", *values)}>{escape(values[0])}</{tag}>'

    labels = {name: text(name, values, "tspan") for name, values in spec["labels"].items()}
    markers = "".join(
        f'<marker id="{uid}-{color}" viewBox="0 0 12 12" refX="10" refY="6" '
        f'markerWidth="6" markerHeight="6" orient="auto-start-reverse">'
        f'<path d="M2 2 L10 6 L2 10" fill="none" stroke="{cc}" stroke-width="1.8"/></marker>'
        for color, cc in COLORS.items()
    )
    captions = "".join(
        f'<div class="causal-scene__caption" style="--cc:{COLORS[color]}">'
        f'<b>{text(f"cap{i}title", title)}</b><p>{text(f"cap{i}body", body)}</p></div>'
        for i, (title, body, color) in enumerate(spec["captions"])
    )
    return (
        f'<div class="scene causal-scene"><svg class="scn" data-scene-kind="{kind}" '
        f'viewBox="0 0 1120 366" xmlns="http://www.w3.org/2000/svg" role="img" '
        f'aria-labelledby="{uid}-title {uid}-desc">'
        f'<title id="{uid}-title" {deck.reg(f"{key}.name", *spec["title"])}>{escape(spec["title"][0])}</title>'
        f'<desc id="{uid}-desc" {deck.reg(f"{key}.description", *spec["description"])}>{escape(spec["description"][0])}</desc>'
        f'<defs>{markers}</defs>{DRAW[kind](labels, uid)}</svg>'
        f'<div class="causal-scene__captions">{captions}</div></div>'
    )
