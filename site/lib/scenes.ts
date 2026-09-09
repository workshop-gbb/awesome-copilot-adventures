/*
 * Mechanism scenes: finite, replayable SVG explanations with a complete motion-free state.
 * Ported from the deck skill's causal_scenes.py so the site and the workshop decks teach the same
 * six mechanisms with the same trilingual wording. Motion is armed by data-active="true" on the
 * figure (assets/site/scenes.js) and disabled entirely under prefers-reduced-motion.
 */
import { iconSvg, type IconName } from './icons';

export type SceneLocale = 'en' | 'pt-br' | 'es';
export type SceneKind = 'agent-anatomy' | 'feedback-loop' | 'verification-gate' | 'context-assembly' | 'prefix-reuse' | 'parallel-ownership'
  | 'harness-surfaces' | 'instruction-precedence' | 'skill-loading' | 'agent-handoff' | 'mcp-connection';
export type SceneColor = 'blue' | 'green' | 'yellow' | 'red';
/** Trilingual text in the order [en, pt-br, es], matching the deck skill tuples. */
type L3 = readonly [string, string, string];
interface SceneSpec {
  title: L3;
  description: L3;
  labels: Record<string, L3>;
  captions: readonly (readonly [L3, L3, SceneColor])[];
}
export interface SceneLabels { kicker: string; replay: string; }

const LOCALE_INDEX: Record<SceneLocale, 0 | 1 | 2> = { en: 0, 'pt-br': 1, es: 2 };
const COLORS: Record<SceneColor, string> = {
  blue: 'var(--he-blue-ink)', green: 'var(--he-green-ink)', yellow: 'var(--he-yellow-ink)', red: 'var(--he-red-ink)'
};

export const SCENES: Record<SceneKind, SceneSpec> = {
  'agent-anatomy': {
    title: ['An agent combines a model and a harness.', 'Um agente combina modelo e harness.', 'Un agente combina modelo y harness.'],
    description: [
      'An agent contains a model and its harness. A circle identifies the model; a surrounding control system contains context, tools, permissions and evidence. This is composition, not execution order.',
      'Um agente reúne modelo e harness. O círculo identifica o modelo; o sistema de controle reúne contexto, tools, permissões e evidência. É composição, não ordem de execução.',
      'Un agente reúne modelo y harness. El círculo identifica el modelo; el sistema de control reúne contexto, tools, permisos y evidencia. Es composición, no orden de ejecución.'
    ],
    labels: {
      agent: ['AGENT', 'AGENTE', 'AGENTE'],
      model: ['Model', 'Modelo', 'Modelo'],
      proposes: ['proposes', 'propõe', 'propone'],
      harness: ['HARNESS', 'HARNESS', 'HARNESS'],
      context: ['Context', 'Contexto', 'Contexto'],
      contextSub: ['select what matters', 'selecionar o que importa', 'seleccionar lo relevante'],
      tools: ['Tools', 'Tools', 'Tools'],
      toolsSub: ['execute the action', 'executar a ação', 'ejecutar la acción'],
      permission: ['Permissions', 'Permissões', 'Permisos'],
      permissionSub: ['define the boundary', 'definir o limite', 'definir el límite'],
      evidence: ['Evidence', 'Evidência', 'Evidencia'],
      evidenceSub: ['verify the outcome', 'verificar o resultado', 'verificar el resultado']
    },
    captions: [
      [['One part reasons', 'Uma parte raciocina', 'Una parte razona'], ['Model capability matters, but it does not execute a tool by itself.', 'A capacidade do modelo importa, mas ele não executa uma tool sozinho.', 'La capacidad del modelo importa, pero no ejecuta una tool por sí solo.'], 'blue'],
      [['The system acts', 'O sistema age', 'El sistema actúa'], ['The harness turns a proposed action into controlled execution.', 'O harness transforma uma ação proposta em execução controlada.', 'El harness convierte una acción propuesta en ejecución controlada.'], 'yellow'],
      [['The team governs', 'O time governa', 'El equipo gobierna'], ['You own instructions, acceptance criteria, budgets and handoffs.', 'Você governa instruções, critérios de aceite, orçamentos e transferências.', 'Usted gobierna instrucciones, criterios de aceptación, presupuestos y traspasos.'], 'green']
    ]
  },
  'feedback-loop': {
    title: ['Evidence changes the next iteration.', 'A evidência muda a próxima iteração.', 'La evidencia cambia la siguiente iteración.'],
    description: [
      'Context reaches the model, the harness runs requested tools, and their results return as context. The return path completes the loop.',
      'O contexto chega ao modelo, o harness executa as tools solicitadas e os resultados voltam como contexto. O retorno fecha o loop.',
      'El contexto llega al modelo, el harness ejecuta las tools solicitadas y los resultados vuelven como contexto. El retorno cierra el ciclo.'
    ],
    labels: {
      scope: ['THE HARNESS ORCHESTRATES THE ROUND', 'O HARNESS ORQUESTRA A RODADA', 'EL HARNESS ORQUESTA LA RONDA'],
      context: ['Context', 'Contexto', 'Contexto'],
      contextSub: ['what the model sees', 'o que o modelo vê', 'lo que ve el modelo'],
      model: ['Model', 'Modelo', 'Modelo'],
      modelSub: ['proposes an action', 'propõe uma ação', 'propone una acción'],
      tools: ['Tools', 'Tools', 'Tools'],
      toolsSub: ['the harness executes', 'o harness executa', 'el harness ejecuta'],
      result: ['Result', 'Resultado', 'Resultado'],
      resultSub: ['output or failure', 'saída ou falha', 'salida o fallo'],
      return: ['NEW EVIDENCE, NEXT ROUND', 'NOVA EVIDÊNCIA, PRÓXIMA RODADA', 'NUEVA EVIDENCIA, SIGUIENTE RONDA']
    },
    captions: [
      [['Propose', 'Propor', 'Proponer'], ['The model requests an action; it does not execute it.', 'O modelo solicita uma ação; ele não a executa.', 'El modelo solicita una acción; no la ejecuta.'], 'blue'],
      [['Execute', 'Executar', 'Ejecutar'], ["Tools run inside the harness's permission boundaries.", 'As tools rodam nos limites de permissão do harness.', 'Las tools operan dentro de los permisos del harness.'], 'yellow'],
      [['Observe', 'Observar', 'Observar'], ['A result changes the next request, not the model weights.', 'O resultado muda a próxima requisição, não os pesos do modelo.', 'El resultado cambia la próxima solicitud, no los pesos del modelo.'], 'green']
    ]
  },
  'verification-gate': {
    title: ['A check creates a decision, not a decoration.', 'Uma checagem cria uma decisão, não um enfeite.', 'Una comprobación crea una decisión, no un adorno.'],
    description: [
      'A proposed change is checked. Passing enables review; failure returns actionable evidence for repair. These are alternative paths, not measured outcomes.',
      'Uma mudança é verificada. Sucesso permite revisão; falha devolve evidência acionável para correção. São caminhos alternativos, não resultados medidos.',
      'Se verifica un cambio. El éxito permite revisión; el fallo devuelve evidencia para corregir. Son rutas alternativas, no resultados medidos.'
    ],
    labels: {
      scope: ['TWO OUTCOMES, ONE EXPLICIT CONTRACT', 'DOIS RESULTADOS, UM CONTRATO EXPLÍCITO', 'DOS RESULTADOS, UN CONTRATO EXPLÍCITO'],
      change: ['Change', 'Mudança', 'Cambio'],
      changeSub: ['a proposed artifact', 'um artefato proposto', 'un artefacto propuesto'],
      check: ['Verification', 'Verificação', 'Verificación'],
      checkSub: ['tests, types, schema', 'testes, tipos, schema', 'pruebas, tipos, schema'],
      pass: ['Ready for review', 'Pronto para revisão', 'Listo para revisión'],
      passSub: ['checks passed', 'checagens passaram', 'comprobaciones aprobadas'],
      fail: ['Repair with evidence', 'Corrigir com evidência', 'Corregir con evidencia'],
      failSub: ['failure + bounded retry', 'falha + tentativa limitada', 'fallo + intento limitado']
    },
    captions: [
      [['Independent signal', 'Sinal independente', 'Señal independiente'], ['A failing test is stronger evidence than asking the author again.', 'Um teste falhando vale mais que perguntar de novo ao autor.', 'Una prueba fallida aporta más que preguntar de nuevo al autor.'], 'blue'],
      [['Actionable failure', 'Falha acionável', 'Fallo accionable'], ['Return the error and the next useful action, within a budget.', 'Devolva o erro e a próxima ação útil, dentro de um orçamento.', 'Devuelva el error y la siguiente acción útil, con un presupuesto.'], 'red'],
      [['Review still matters', 'A revisão continua', 'La revisión continúa'], ['Passing a local check does not replace required CI checks.', 'Passar na checagem local não substitui checks obrigatórios na CI.', 'Aprobar una comprobación local no sustituye los checks de CI.'], 'green']
    ]
  },
  'context-assembly': {
    title: ['Context is assembled before the model is called.', 'O contexto é montado antes de chamar o modelo.', 'El contexto se prepara antes de llamar al modelo.'],
    description: [
      'Four context layers assemble into a request: instructions, tool definitions, relevant files and conversation. The diagram is schematic, not a token allocation chart.',
      'Quatro camadas formam a requisição: instruções, definições de tools, arquivos relevantes e conversa. O esquema não representa proporções de tokens.',
      'Cuatro capas forman la solicitud: instrucciones, definiciones de tools, archivos relevantes y conversación. El esquema no representa proporciones de tokens.'
    ],
    labels: {
      scope: ['REQUEST ASSEMBLY', 'MONTAGEM DA REQUISIÇÃO', 'MONTAJE DE LA SOLICITUD'],
      system: ['Instructions', 'Instruções', 'Instrucciones'],
      tools: ['Tool definitions', 'Definições de tools', 'Definiciones de tools'],
      files: ['Relevant files', 'Arquivos relevantes', 'Archivos relevantes'],
      history: ['Conversation + results', 'Conversa + resultados', 'Conversación + resultados'],
      model: ['Model', 'Modelo', 'Modelo'],
      modelSub: ['a finite window', 'uma janela finita', 'una ventana finita']
    },
    captions: [
      [['Keep stable', 'Manter estável', 'Mantener estable'], ['Short, versioned instructions preserve the operating rules.', 'Instruções curtas e versionadas preservam as regras de trabalho.', 'Instrucciones breves y versionadas preservan las reglas de trabajo.'], 'blue'],
      [['Load on demand', 'Carregar sob demanda', 'Cargar bajo demanda'], ['Expose relevant tools and files, not the entire repository.', 'Exponha tools e arquivos relevantes, não o repositório inteiro.', 'Exponga tools y archivos relevantes, no todo el repositorio.'], 'green'],
      [['Budget the history', 'Orçar o histórico', 'Presupuestar el historial'], ['Conversation grows. Compaction trades detail for space.', 'A conversa cresce. Compaction troca detalhe por espaço.', 'La conversación crece. Compaction cambia detalle por espacio.'], 'yellow']
    ]
  },
  'prefix-reuse': {
    title: ['An unchanged prefix can be reused.', 'Um prefixo estável pode ser reutilizado.', 'Un prefijo estable puede reutilizarse.'],
    description: [
      'Two consecutive requests share instructions, tools and stable context; only the final user content changes. Equal blocks denote equality, not measured sizes or a guaranteed cache hit.',
      'Duas requisições compartilham instruções, tools e contexto estável; só o conteúdo final muda. Blocos iguais indicam igualdade, não tamanhos medidos nem cache hit garantido.',
      'Dos solicitudes comparten instrucciones, tools y contexto estable; solo cambia el contenido final. Bloques iguales indican igualdad, no tamaños medidos ni cache hit garantizado.'
    ],
    labels: {
      scope: ['SAME PREFIX, DIFFERENT SUFFIX', 'MESMO PREFIXO, OUTRO SUFIXO', 'MISMO PREFIJO, OTRO SUFIJO'],
      first: ['Request A', 'Requisição A', 'Solicitud A'],
      second: ['Request B', 'Requisição B', 'Solicitud B'],
      instructions: ['Instructions', 'Instruções', 'Instrucciones'],
      tools: ['Tools', 'Tools', 'Tools'],
      stable: ['Stable context', 'Contexto estável', 'Contexto estable'],
      changeA: ['Task / result A', 'Tarefa / resultado A', 'Tarea / resultado A'],
      changeB: ['Task / result B', 'Tarefa / resultado B', 'Tarea / resultado B'],
      shared: ['EXACT PREFIX MATCH', 'PREFIXO EXATAMENTE IGUAL', 'PREFIJO EXACTAMENTE IGUAL']
    },
    captions: [
      [['Preserve the prefix', 'Preservar o prefixo', 'Preservar el prefijo'], ['Early changes can invalidate reuse of everything after them.', 'Mudar o início pode invalidar o reuso do que vem depois.', 'Cambiar el inicio puede invalidar el reuso de lo que sigue.'], 'blue'],
      [['Append the variable', 'Acrescentar o variável', 'Añadir lo variable'], ['Keep newly loaded tools and task content after stable context.', 'Mantenha tools recém-carregadas e a tarefa após o contexto estável.', 'Mantenga las tools recién cargadas y la tarea después del contexto estable.'], 'yellow'],
      [['Measure real hits', 'Medir hits reais', 'Medir hits reales'], ['Retention and discounts depend on the model and provider.', 'Retenção e descontos dependem do modelo e do provedor.', 'La retención y los descuentos dependen del modelo y del proveedor.'], 'green']
    ]
  },
  'parallel-ownership': {
    title: ['Separate work, then integrate explicitly.', 'Separe o trabalho e integre explicitamente.', 'Separe el trabajo e integre explícitamente.'],
    description: [
      'A parent delegates three bounded tasks with separate contexts. The results converge at an explicit integration and verification step, not an automatic merge.',
      'Um pai delega três tarefas delimitadas com contextos próprios. Os resultados convergem para integração e verificação explícitas, não um merge automático.',
      'Un padre delega tres tareas delimitadas con contextos propios. Los resultados convergen en integración y verificación explícitas, no en un merge automático.'
    ],
    labels: {
      parent: ['Parent', 'Pai', 'Padre'],
      parentSub: ['scope + owner', 'escopo + dono', 'alcance + responsable'],
      map: ['Investigate', 'Investigar', 'Investigar'],
      mapSub: ['question + evidence', 'pergunta + evidência', 'pregunta + evidencia'],
      build: ['Implement', 'Implementar', 'Implementar'],
      buildSub: ['exclusive file ownership', 'posse exclusiva dos arquivos', 'propiedad exclusiva de archivos'],
      check: ['Verify', 'Verificar', 'Verificar'],
      checkSub: ['independent check', 'checagem independente', 'comprobación independiente'],
      integrate: ['Integrate', 'Integrar', 'Integrar'],
      integrateSub: ['review + checks', 'revisão + checagens', 'revisión + comprobaciones']
    },
    captions: [
      [['Delegate a boundary', 'Delegar um limite', 'Delegar un límite'], ['Give each task a clear output and a named owner.', 'Dê uma saída clara e um dono definido a cada tarefa.', 'Asigne una salida clara y un responsable a cada tarea.'], 'blue'],
      [['Do not overlap writes', 'Não sobrepor escritas', 'No solapar escrituras'], ['Separate contexts do not isolate a shared filesystem.', 'Contextos separados não isolam um filesystem compartilhado.', 'Los contextos separados no aíslan un filesystem compartido.'], 'red'],
      [['Integrate the results', 'Integrar os resultados', 'Integrar los resultados'], ['Parallel completion is not evidence that the combined change works.', 'Terminar em paralelo não prova que a mudança combinada funciona.', 'Terminar en paralelo no prueba que el cambio combinado funciona.'], 'green']
    ]
  },
  'harness-surfaces': {
    title: ['One harness, several product surfaces.', 'Um harness, várias superfícies de produto.', 'Un harness, varias superficies de producto.'],
    description: [
      'The editor, the terminal, a cloud session and an application built with the SDK are surfaces over the same agent harness. The harness plans the turn, routes tools, enforces limits and records evidence; the selected model depends on the surface, the account and the organization policy.',
      'O editor, o terminal, uma sessão na nuvem e um aplicativo feito com o SDK são superfícies sobre o mesmo harness. O harness planeja o turno, roteia tools, aplica limites e registra evidência; o modelo selecionado depende da superfície, da conta e da política da organização.',
      'El editor, la terminal, una sesión en la nube y una aplicación creada con el SDK son superficies sobre el mismo harness. El harness planifica el turno, enruta tools, aplica límites y registra evidencia; el modelo seleccionado depende de la superficie, la cuenta y la política de la organización.'
    ],
    labels: {
      surfaces: ['PRODUCT SURFACES', 'SUPERFÍCIES DE PRODUTO', 'SUPERFICIES DE PRODUCTO'],
      editor: ['Editor', 'Editor', 'Editor'],
      editorSub: ['chat and agent sessions', 'chat e sessões de agente', 'chat y sesiones de agente'],
      cli: ['Terminal', 'Terminal', 'Terminal'],
      cliSub: ['command line agent', 'agente de linha de comando', 'agente de línea de comandos'],
      cloud: ['Cloud session', 'Sessão na nuvem', 'Sesión en la nube'],
      cloudSub: ['remote environment', 'ambiente remoto', 'entorno remoto'],
      sdk: ['Your application', 'Seu aplicativo', 'Su aplicación'],
      sdkSub: ['built with the SDK', 'feito com o SDK', 'creado con el SDK'],
      harness: ['AGENT HARNESS', 'HARNESS DO AGENTE', 'HARNESS DEL AGENTE'],
      chip1: ['Context and memory', 'Contexto e memória', 'Contexto y memoria'],
      chip2: ['Tool routing', 'Roteamento de tools', 'Enrutado de tools'],
      chip3: ['Limits and recovery', 'Limites e recuperação', 'Límites y recuperación'],
      chip4: ['Evidence', 'Evidência', 'Evidencia'],
      model: ['Selected model', 'Modelo selecionado', 'Modelo seleccionado'],
      modelSub: ['surface, account and policy decide', 'superfície, conta e política decidem', 'superficie, cuenta y política deciden']
    },
    captions: [
      [['The surface is not the role', 'A superfície não é o papel', 'La superficie no es el rol'], ['Ask, Plan and Agent are responsibilities. They can run on any of these surfaces.', 'Ask, Plan e Agent são responsabilidades. Elas podem rodar em qualquer uma dessas superfícies.', 'Ask, Plan y Agent son responsabilidades. Pueden ejecutarse en cualquiera de estas superficies.'], 'blue'],
      [['The harness holds the rules', 'O harness guarda as regras', 'El harness guarda las reglas'], ['Permissions, limits and recorded evidence live in the harness, not in the prompt.', 'Permissões, limites e evidência registrada vivem no harness, não no prompt.', 'Permisos, límites y evidencia registrada viven en el harness, no en el prompt.'], 'yellow'],
      [['Availability varies', 'A disponibilidade varia', 'La disponibilidad varía'], ['Check the official documentation for the surface, account and policy you actually use.', 'Confira a documentação oficial da superfície, conta e política que você realmente usa.', 'Consulte la documentación oficial de la superficie, cuenta y política que realmente usa.'], 'green']
    ]
  },
  'instruction-precedence': {
    title: ['Instructions apply on their own. A prompt is invoked.', 'Instruções se aplicam sozinhas. Um prompt é invocado.', 'Las instrucciones se aplican solas. Un prompt se invoca.'],
    description: [
      'Repository instructions and path-specific instructions are attached automatically to a matching request. A prompt file is a task template that someone runs deliberately. Everything merges into one assembled request; discovery and precedence differ by surface, so verify them against the official documentation.',
      'Instruções de repositório e instruções por caminho são anexadas automaticamente a uma requisição compatível. Um arquivo de prompt é um modelo de tarefa que alguém executa deliberadamente. Tudo é mesclado em uma única requisição; descoberta e precedência variam por superfície, então verifique na documentação oficial.',
      'Las instrucciones de repositorio y las instrucciones por ruta se adjuntan automáticamente a una solicitud compatible. Un archivo de prompt es una plantilla de tarea que alguien ejecuta deliberadamente. Todo se combina en una sola solicitud; el descubrimiento y la precedencia varían por superficie, verifíquelos en la documentación oficial.'
    ],
    labels: {
      scope: ['WHAT REACHES THE REQUEST', 'O QUE CHEGA À REQUISIÇÃO', 'LO QUE LLEGA A LA SOLICITUD'],
      repo: ['Repository instructions', 'Instruções do repositório', 'Instrucciones del repositorio'],
      repoSub: ['automatic', 'automáticas', 'automáticas'],
      path: ['Path-specific instructions', 'Instruções por caminho', 'Instrucciones por ruta'],
      pathSub: ['automatic, when files match', 'automáticas, quando os arquivos casam', 'automáticas, cuando los archivos coinciden'],
      prompt: ['Prompt file', 'Arquivo de prompt', 'Archivo de prompt'],
      promptSub: ['invoked by a person', 'invocado por uma pessoa', 'invocado por una persona'],
      request: ['Your request', 'Sua solicitação', 'Su solicitud'],
      requestSub: ['the task of the moment', 'a tarefa do momento', 'la tarea del momento'],
      merged: ['One assembled request', 'Uma requisição montada', 'Una solicitud montada'],
      mergedSub: ['rules first, task last', 'regras primeiro, tarefa por último', 'reglas primero, tarea al final']
    },
    captions: [
      [['Durable, not clever', 'Duráveis, não espertas', 'Duraderas, no ingeniosas'], ['Write testable rules such as run this command after changing that folder.', 'Escreva regras testáveis, como executar este comando depois de mudar aquela pasta.', 'Escriba reglas verificables, como ejecutar este comando tras cambiar esa carpeta.'], 'blue'],
      [['Manual is a different tool', 'Manual é outra ferramenta', 'Lo manual es otra herramienta'], ['A prompt file repeats a task on demand; it is not a place for permanent conventions.', 'Um arquivo de prompt repete uma tarefa sob demanda; não é lugar para convenções permanentes.', 'Un archivo de prompt repite una tarea a demanda; no es lugar para convenciones permanentes.'], 'yellow'],
      [['Verify the surface', 'Verifique a superfície', 'Verifique la superficie'], ['Discovery and precedence can differ between Copilot features. Confirm before relying on them.', 'Descoberta e precedência podem variar entre recursos do Copilot. Confirme antes de depender delas.', 'El descubrimiento y la precedencia pueden variar entre funciones de Copilot. Confírmelo antes de depender de ellas.'], 'green']
    ]
  },
  'skill-loading': {
    title: ['A skill is loaded when it becomes relevant.', 'Uma skill é carregada quando fica relevante.', 'Una skill se carga cuando es relevante.'],
    description: [
      'A library can hold many skills. The task determines which one is loaded into the request; the rest stay on disk. A skill supplies expertise, never extra permission.',
      'Uma biblioteca pode ter muitas skills. A tarefa determina qual é carregada na requisição; as demais permanecem em disco. Uma skill fornece expertise, nunca permissão extra.',
      'Una biblioteca puede tener muchas skills. La tarea determina cuál se carga en la solicitud; las demás quedan en disco. Una skill aporta experiencia, nunca permisos adicionales.'
    ],
    labels: {
      library: ['SKILL LIBRARY', 'BIBLIOTECA DE SKILLS', 'BIBLIOTECA DE SKILLS'],
      skillA: ['Release checklist', 'Checklist de release', 'Checklist de release'],
      skillB: ['Accessibility review', 'Revisão de acessibilidade', 'Revisión de accesibilidad'],
      skillC: ['Data migration', 'Migração de dados', 'Migración de datos'],
      skillD: ['Incident report', 'Relato de incidente', 'Informe de incidente'],
      task: ['The task', 'A tarefa', 'La tarea'],
      taskSub: ['review this screen for accessibility', 'revisar a acessibilidade desta tela', 'revisar la accesibilidad de esta pantalla'],
      window: ['THE REQUEST', 'A REQUISIÇÃO', 'LA SOLICITUD'],
      loaded: ['Accessibility review', 'Revisão de acessibilidade', 'Revisión de accesibilidad'],
      loadedSub: ['loaded: it matches the task', 'carregada: combina com a tarefa', 'cargada: coincide con la tarea'],
      resting: ['The others stay on disk', 'As outras ficam em disco', 'Las demás quedan en disco']
    },
    captions: [
      [['Relevance decides', 'A relevância decide', 'La relevancia decide'], ['Name the skill for the situation it serves, so the match is obvious.', 'Nomeie a skill pela situação que ela atende, para o encaixe ficar óbvio.', 'Nombre la skill por la situación que atiende, para que la coincidencia sea obvia.'], 'blue'],
      [['A window has a budget', 'A janela tem orçamento', 'La ventana tiene presupuesto'], ['Loading every skill spends the space that evidence and code need.', 'Carregar todas as skills gasta o espaço que a evidência e o código precisam.', 'Cargar todas las skills gasta el espacio que necesitan la evidencia y el código.'], 'yellow'],
      [['Expertise, not authority', 'Expertise, não autoridade', 'Experiencia, no autoridad'], ['A skill explains how to do something well. Permission still comes from the harness.', 'Uma skill explica como fazer algo bem. A permissão continua vindo do harness.', 'Una skill explica cómo hacer algo bien. El permiso sigue viniendo del harness.'], 'red']
    ]
  },
  'agent-handoff': {
    title: ['A custom agent hands off work with an artifact.', 'Um agente personalizado passa o trabalho com um artefato.', 'Un agente personalizado entrega el trabajo con un artefacto.'],
    description: [
      'Each custom agent declares its role, its tools and its instructions. Work moves between them through a named artifact, so the next agent starts from something inspectable instead of a conversation.',
      'Cada agente personalizado declara seu papel, suas tools e suas instruções. O trabalho passa entre eles por um artefato nomeado, então o próximo agente começa de algo inspecionável, não de uma conversa.',
      'Cada agente personalizado declara su rol, sus tools y sus instrucciones. El trabajo pasa entre ellos mediante un artefacto nombrado, así el siguiente agente parte de algo inspeccionable y no de una conversación.'
    ],
    labels: {
      scope: ['ROLE, TOOLS, INSTRUCTIONS, HANDOFF', 'PAPEL, TOOLS, INSTRUÇÕES, HANDOFF', 'ROL, TOOLS, INSTRUCCIONES, HANDOFF'],
      first: ['Investigator', 'Investigador', 'Investigador'],
      firstSub: ['read-only tools', 'tools somente de leitura', 'tools de solo lectura'],
      artifactOne: ['Findings with citations', 'Achados com citações', 'Hallazgos con citas'],
      second: ['Planner', 'Planejador', 'Planificador'],
      secondSub: ['no write access', 'sem acesso de escrita', 'sin acceso de escritura'],
      artifactTwo: ['Plan with acceptance criteria', 'Plano com critérios de aceite', 'Plan con criterios de aceptación'],
      third: ['Builder', 'Construtor', 'Constructor'],
      thirdSub: ['edits inside one scope', 'edita dentro de um escopo', 'edita dentro de un alcance'],
      note: ['EACH HANDOFF IS A FILE SOMEONE CAN READ', 'CADA HANDOFF É UM ARQUIVO QUE ALGUÉM PODE LER', 'CADA HANDOFF ES UN ARCHIVO QUE ALGUIEN PUEDE LEER']
    },
    captions: [
      [['Least authority per role', 'Menor autoridade por papel', 'Mínima autoridad por rol'], ['An investigator that cannot write cannot accidentally change the repository.', 'Um investigador que não escreve não altera o repositório por acidente.', 'Un investigador que no escribe no puede alterar el repositorio por accidente.'], 'blue'],
      [['The artifact is the contract', 'O artefato é o contrato', 'El artefacto es el contrato'], ['Name what the previous step must produce before the next one starts.', 'Nomeie o que a etapa anterior precisa produzir antes de a próxima começar.', 'Nombre lo que debe producir el paso anterior antes de que empiece el siguiente.'], 'yellow'],
      [['A handoff is reviewable', 'Um handoff é revisável', 'Un handoff es revisable'], ['You can disagree with a plan on disk. You cannot review a conversation that vanished.', 'Você pode discordar de um plano em disco. Não dá para revisar uma conversa que sumiu.', 'Puede discrepar de un plan en disco. No puede revisar una conversación que desapareció.'], 'green']
    ]
  },
  'mcp-connection': {
    title: ['An MCP server publishes tools the harness can call.', 'Um servidor MCP publica tools que o harness pode chamar.', 'Un servidor MCP publica tools que el harness puede llamar.'],
    description: [
      'The harness connects to a declared server, lists what it offers, and only then can call one of its tools. The server runs with its own credentials and boundary; adding it is a permission decision, not only a configuration line.',
      'O harness conecta a um servidor declarado, lista o que ele oferece e só então pode chamar uma de suas tools. O servidor roda com credenciais e limites próprios; adicioná-lo é uma decisão de permissão, não apenas uma linha de configuração.',
      'El harness se conecta a un servidor declarado, lista lo que ofrece y solo entonces puede llamar una de sus tools. El servidor se ejecuta con credenciales y límites propios; añadirlo es una decisión de permisos, no solo una línea de configuración.'
    ],
    labels: {
      scope: ['DECLARE, DISCOVER, THEN CALL', 'DECLARAR, DESCOBRIR, DEPOIS CHAMAR', 'DECLARAR, DESCUBRIR, LUEGO LLAMAR'],
      harness: ['Harness', 'Harness', 'Harness'],
      harnessSub: ['holds the permission boundary', 'guarda o limite de permissão', 'guarda el límite de permisos'],
      discover: ['1 · list what it offers', '1 · listar o que ele oferece', '1 · listar lo que ofrece'],
      call: ['2 · call one tool', '2 · chamar uma tool', '2 · llamar una tool'],
      server: ['MCP server', 'Servidor MCP', 'Servidor MCP'],
      serverSub: ['reviewed, bounded, disposable', 'revisado, delimitado, descartável', 'revisado, acotado, desechable'],
      tools: ['Tools and resources', 'Tools e recursos', 'Tools y recursos'],
      toolsSub: ['named, typed, documented', 'nomeadas, tipadas, documentadas', 'nombradas, tipadas, documentadas'],
      system: ['Real system', 'Sistema real', 'Sistema real'],
      systemSub: ['its own credentials', 'credenciais próprias', 'credenciales propias']
    },
    captions: [
      [['Discovery comes first', 'A descoberta vem primeiro', 'El descubrimiento va primero'], ['The harness cannot call a tool it has not been told about.', 'O harness não chama uma tool sobre a qual não foi informado.', 'El harness no puede llamar una tool de la que no se le informó.'], 'blue'],
      [['A server is a boundary', 'Um servidor é um limite', 'Un servidor es un límite'], ['It runs with its own access. Review what it can reach before you enable it.', 'Ele roda com o próprio acesso. Revise o que ele alcança antes de habilitar.', 'Se ejecuta con su propio acceso. Revise a qué llega antes de habilitarlo.'], 'red'],
      [['Keep it disposable', 'Mantenha descartável', 'Manténgalo desechable'], ['Configure it in a lab workspace you can delete, not across every project.', 'Configure em um workspace de laboratório que você pode apagar, não em todo projeto.', 'Configúrelo en un workspace de laboratorio que pueda borrar, no en todos los proyectos.'], 'yellow']
    ]
  }
};

export const sceneKinds = Object.keys(SCENES) as SceneKind[];

function esc(value: string): string {
  return value.replace(/[&<>"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character] as string);
}
const text = (x: number, y: number, label: string, cls = 'sc-label', anchor = 'start') =>
  `<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(label)}</text>`;
const reveal = (body: string, at: number) => `<g class="sc-reveal" style="--at:${at}s">${body}</g>`;
function node(x: number, y: number, w: number, h: number, label: string, sub: string, color: SceneColor, icon: IconName, at: number): string {
  const cc = COLORS[color];
  // Text is centred on the node so the same helper works for a 62px chip and a 96px card.
  const middle = y + h / 2;
  const titleY = sub ? middle - 3 : middle + 8;
  return reveal(
    `<rect class="sc-node" x="${x}" y="${y}" width="${w}" height="${h}" rx="12" style="--cc:${cc}"/>`
    + iconSvg(icon, x + 18, titleY - 21, 28, cc) + text(x + 58, titleY, label, 'sc-title')
    + (sub ? text(x + 18, middle + 21, sub, 'sc-sub') : ''), at);
}
function wire(path: string, color: SceneColor, at: number, uid: string, packet = false): string {
  const cc = COLORS[color];
  let markup = `<path class="sc-wire" d="${path}" pathLength="100" style="--cc:${cc};--at:${at}s" marker-end="url(#${uid}-${color})"/>`;
  if (packet) markup += `<circle class="sc-packet" r="4.5" style="--cc:${cc};--at:${at + 0.1}s;offset-path:path('${path}')"/>`;
  return markup;
}
type Labels = Record<string, string>;
const DRAW: Record<SceneKind, (labels: Labels, uid: string) => string> = {
  'agent-anatomy': (l) =>
    `<rect class="sc-frame" x="20" y="22" width="1080" height="332" rx="20"/>`
    + text(44, 50, l.agent, 'sc-kicker')
    + reveal(`<circle cx="220" cy="202" r="92" class="sc-node" style="--cc:${COLORS.blue};stroke-width:2"/>`
      + iconSvg('spark', 204, 134, 32, COLORS.blue) + text(220, 204, l.model, 'sc-title', 'middle') + text(220, 231, l.proposes, 'sc-sub', 'middle'), 0.15)
    + reveal(`<text x="370" y="218" class="sc-title" text-anchor="middle" style="font-size:52px">+</text>`, 0.55)
    + reveal(`<rect class="sc-frame" x="438" y="60" width="640" height="274" rx="16"/>` + text(462, 87, l.harness, 'sc-kicker'), 0.8)
    + node(458, 110, 276, 90, l.context, l.contextSub, 'blue', 'file', 1.08)
    + node(780, 110, 276, 90, l.tools, l.toolsSub, 'yellow', 'terminal', 1.46)
    + node(458, 226, 276, 90, l.permission, l.permissionSub, 'red', 'shield', 1.84)
    + node(780, 226, 276, 90, l.evidence, l.evidenceSub, 'green', 'test', 2.22),
  'feedback-loop': (l, uid) => {
    const parts = [text(20, 28, l.scope, 'sc-kicker')];
    const stations: [string, string, SceneColor, IconName][] = [['context', 'contextSub', 'blue', 'file'], ['model', 'modelSub', 'blue', 'spark'], ['tools', 'toolsSub', 'yellow', 'terminal'], ['result', 'resultSub', 'green', 'test']];
    stations.forEach(([key, sub, color, icon], i) => {
      const x = 20 + i * 280;
      if (i) parts.push(wire(`M${x - 44} 128 H${x - 8}`, color, 0.36 + i * 0.5, uid, true));
      parts.push(node(x, 82, 236, 96, l[key], l[sub], color, icon, 0.12 + i * 0.56));
    });
    parts.push(wire('M978 182 V274 H138 V186', 'green', 2.42, uid, true));
    parts.push(reveal(text(558, 320, l.return, 'sc-label', 'middle'), 2.92));
    return parts.join('');
  },
  'verification-gate': (l, uid) =>
    text(20, 28, l.scope, 'sc-kicker')
    + wire('M260 182 H350', 'blue', 0.6, uid, true)
    + wire('M620 182 H680 V87 H758', 'green', 2.5, uid, true)
    + wire('M620 182 H680 V280 H758', 'red', 1.65, uid, true)
    + node(20, 136, 240, 94, l.change, l.changeSub, 'blue', 'code', 0.12)
    + node(360, 136, 260, 94, l.check, l.checkSub, 'yellow', 'test', 0.95)
    + node(768, 40, 330, 94, l.pass, l.passSub, 'green', 'check-circle', 2.78)
    + node(768, 233, 330, 94, l.fail, l.failSub, 'red', 'wrench', 1.92),
  'context-assembly': (l, uid) => {
    const parts = [`<rect class="sc-frame" x="20" y="16" width="744" height="328" rx="14"/>`, text(44, 46, l.scope, 'sc-kicker')];
    const layers: [string, SceneColor][] = [['system', 'blue'], ['tools', 'blue'], ['files', 'green'], ['history', 'yellow']];
    layers.forEach(([key, color], i) => {
      const y = 67 + i * 64;
      parts.push(reveal(`<rect class="sc-zone" x="40" y="${y}" width="704" height="48" rx="7" style="--cc:${COLORS[color]}"/>` + text(61, y + 31, l[key], 'sc-title'), 0.16 + i * 0.5));
    });
    parts.push(wire('M774 183 H834', 'blue', 2.26, uid, true));
    parts.push(node(846, 136, 250, 96, l.model, l.modelSub, 'blue', 'spark', 2.65));
    return parts.join('');
  },
  'prefix-reuse': (l, uid) => {
    const parts = [text(20, 28, l.scope, 'sc-kicker')];
    [84, 217].forEach((y, row) => {
      parts.push(reveal(text(20, y + 33, l[row === 0 ? 'first' : 'second'], 'sc-sub'), 0.12 + row * 1.15));
      const blocks: [number, number, string][] = [[156, 230, 'instructions'], [400, 152, 'tools'], [566, 240, 'stable'], [838, 264, row === 0 ? 'changeA' : 'changeB']];
      blocks.forEach(([x, w, key], i) => {
        const color: SceneColor = i === 3 ? 'yellow' : 'blue';
        parts.push(reveal(`<rect class="sc-zone" x="${x}" y="${y}" width="${w}" height="64" rx="8" style="--cc:${COLORS[color]}"/>` + text(x + w / 2, y + 38, l[key], 'sc-label', 'middle'), 0.25 + row * 1.15 + i * 0.18));
      });
    });
    parts.push(wire('M156 298 V314 H804 V298', 'green', 2.64, uid));
    parts.push(reveal(text(480, 343, l.shared, 'sc-label', 'middle'), 2.9));
    return parts.join('');
  },
  'parallel-ownership': (l, uid) => {
    const parts: string[] = [];
    const tasks: [string, string, SceneColor][] = [['map', 'mapSub', 'blue'], ['build', 'buildSub', 'blue'], ['check', 'checkSub', 'green']];
    tasks.forEach(([key, sub, color], i) => {
      const y = 24 + i * 120;
      parts.push(wire(`M244 187 H286 V${y + 46} H330`, color, 0.52 + i * 0.25, uid, true));
      parts.push(wire(`M714 ${y + 46} H768 V187 H818`, 'green', 1.7 + i * 0.35, uid, true));
      parts.push(node(340, y, 374, 92, l[key], l[sub], color, i < 2 ? 'file' : 'test', 0.82 + i * 0.3));
    });
    parts.push(node(20, 141, 224, 96, l.parent, l.parentSub, 'blue', 'agent', 0.12));
    parts.push(node(828, 141, 270, 96, l.integrate, l.integrateSub, 'green', 'branch', 2.92));
    return parts.join('');
  },
  'harness-surfaces': (l, uid) => {
    const parts = [text(20, 26, l.surfaces, 'sc-kicker')];
    const surfaces: [string, string, SceneColor, IconName][] = [
      ['editor', 'editorSub', 'blue', 'code'], ['cli', 'cliSub', 'blue', 'terminal'],
      ['cloud', 'cloudSub', 'blue', 'cloud'], ['sdk', 'sdkSub', 'blue', 'puzzle']
    ];
    surfaces.forEach(([key, sub, color, icon], i) => {
      const x = 20 + i * 276;
      parts.push(node(x, 40, 252, 86, l[key], l[sub], color, icon, 0.12 + i * 0.16));
      parts.push(wire(`M${x + 126} 126 V152`, 'blue', 0.7 + i * 0.1, uid));
    });
    parts.push(reveal(`<rect class="sc-zone" x="20" y="152" width="1080" height="116" rx="14" style="--cc:${COLORS.yellow}"/>`
      + text(44, 180, l.harness, 'sc-kicker'), 1.2));
    const chips = ['chip1', 'chip2', 'chip3', 'chip4'];
    chips.forEach((key, i) => {
      const x = 44 + i * 258;
      parts.push(reveal(`<rect class="sc-node" x="${x}" y="196" width="234" height="52" rx="9" style="--cc:${COLORS.yellow}"/>`
        + text(x + 117, 227, l[key], 'sc-label', 'middle'), 1.5 + i * 0.16));
    });
    parts.push(wire('M560 268 V296', 'green', 2.3, uid, true));
    parts.push(node(410, 296, 300, 62, l.model, l.modelSub, 'green', 'spark', 2.55));
    return parts.join('');
  },
  'instruction-precedence': (l, uid) => {
    const parts = [text(20, 26, l.scope, 'sc-kicker')];
    const sources: [string, string, SceneColor, IconName][] = [
      ['repo', 'repoSub', 'blue', 'docs'], ['path', 'pathSub', 'blue', 'folder'],
      ['prompt', 'promptSub', 'yellow', 'send'], ['request', 'requestSub', 'green', 'chat']
    ];
    sources.forEach(([key, sub, color, icon], i) => {
      const y = 44 + i * 76;
      parts.push(node(20, y, 400, 64, l[key], l[sub], color, icon, 0.14 + i * 0.34));
      parts.push(wire(`M420 ${y + 32} C520 ${y + 32} 540 187 620 187`, color, 0.5 + i * 0.34, uid, true));
    });
    parts.push(reveal(`<circle cx="640" cy="187" r="9" fill="${COLORS.green}"/>`, 1.9));
    parts.push(wire('M652 187 H690', 'green', 2.0, uid));
    parts.push(node(700, 140, 400, 94, l.merged, l.mergedSub, 'green', 'layers', 2.2));
    return parts.join('');
  },
  'skill-loading': (l, uid) => {
    const parts = [text(20, 26, l.library, 'sc-kicker')];
    const skills = ['skillA', 'skillB', 'skillC', 'skillD'];
    skills.forEach((key, i) => {
      const y = 44 + i * 76;
      const match = i === 1;
      const color: SceneColor = match ? 'green' : 'blue';
      parts.push(reveal(`<rect class="sc-node" x="20" y="${y}" width="300" height="58" rx="10" style="--cc:${match ? COLORS.green : 'var(--rule-2)'}"/>`
        + iconSvg('puzzle', 38, y + 17, 24, match ? COLORS.green : 'var(--ink-3)')
        + text(74, y + 36, l[key], 'sc-label'), 0.12 + i * 0.2));
      if (match) parts.push(wire(`M320 ${y + 29} C480 ${y + 29} 560 176 700 176`, color, 1.5, uid, true));
    });
    parts.push(reveal(text(20, 356, l.resting, 'sc-sub'), 2.6));
    parts.push(node(370, 236, 300, 84, l.task, l.taskSub, 'blue', 'target', 0.95));
    parts.push(wire('M520 236 V206 H700', 'blue', 1.2, uid, true));
    parts.push(reveal(`<rect class="sc-frame" x="700" y="44" width="400" height="264" rx="16"/>`
      + text(724, 74, l.window, 'sc-kicker'), 1.35));
    parts.push(node(724, 132, 352, 96, l.loaded, l.loadedSub, 'green', 'check-circle', 1.95));
    return parts.join('');
  },
  'agent-handoff': (l, uid) => {
    const parts = [text(20, 26, l.scope, 'sc-kicker')];
    const roles: [string, string, SceneColor, IconName][] = [
      ['first', 'firstSub', 'blue', 'eye'], ['second', 'secondSub', 'yellow', 'note'], ['third', 'thirdSub', 'green', 'wrench']
    ];
    roles.forEach(([key, sub, color, icon], i) => {
      const x = 20 + i * 380;
      parts.push(node(x, 60, 320, 92, l[key], l[sub], color, icon, 0.14 + i * 0.62));
      if (i < 2) {
        parts.push(wire(`M${x + 320} 106 H${x + 380}`, color, 0.6 + i * 0.62, uid, true));
        const artifact = i === 0 ? 'artifactOne' : 'artifactTwo';
        parts.push(reveal(`<rect class="sc-zone" x="${x + 96}" y="196" width="316" height="60" rx="10" style="--cc:${COLORS[color]}"/>`
          + iconSvg('file', x + 116, 214, 24, COLORS[color])
          + text(x + 152, 232, l[artifact], 'sc-label'), 0.95 + i * 0.62));
        parts.push(wire(`M${x + 160} 152 V196`, color, 0.85 + i * 0.62, uid));
        parts.push(wire(`M${x + 350} 256 V292 H${x + 540} V152`, color, 1.15 + i * 0.62, uid, true));
      }
    });
    parts.push(reveal(text(560, 344, l.note, 'sc-kicker', 'middle'), 2.5));
    return parts.join('');
  },
  'mcp-connection': (l, uid) => {
    const parts = [text(20, 26, l.scope, 'sc-kicker')];
    parts.push(node(20, 128, 300, 96, l.harness, l.harnessSub, 'blue', 'agent', 0.14));
    parts.push(wire('M320 156 H560', 'blue', 0.7, uid, true));
    parts.push(reveal(text(440, 146, l.discover, 'sc-label', 'middle'), 0.9));
    parts.push(wire('M560 200 H320', 'green', 1.35, uid, true));
    parts.push(reveal(text(440, 226, l.call, 'sc-label', 'middle'), 1.5));
    // The frame is the server's own boundary; the system it reaches sits outside that boundary.
    parts.push(reveal(`<rect class="sc-frame" x="560" y="44" width="336" height="272" rx="16"/>`, 0.5));
    parts.push(node(584, 68, 288, 92, l.server, l.serverSub, 'red', 'plug', 1.0));
    parts.push(node(584, 196, 288, 92, l.tools, l.toolsSub, 'yellow', 'toolkit', 1.6));
    parts.push(wire('M872 114 H884 V174 H912', 'red', 2.0, uid));
    parts.push(node(912, 128, 196, 92, l.system, l.systemSub, 'red', 'server', 2.25));
    return parts.join('');
  }
};

let counter = 0;
/** Render one mechanism scene as a complete <figure>; labels, description and captions follow the locale. */
export function renderScene(kind: SceneKind, locale: SceneLocale, ui: SceneLabels, id?: string): string {
  const spec = SCENES[kind];
  if (!spec) throw new Error(`Unknown mechanism scene: ${kind}`);
  const index = LOCALE_INDEX[locale];
  const uid = id || `scene-${kind}-${++counter}`;
  const labels: Labels = Object.fromEntries(Object.entries(spec.labels).map(([key, values]) => [key, values[index]]));
  const markers = (Object.keys(COLORS) as SceneColor[]).map(color =>
    `<marker id="${uid}-${color}" viewBox="0 0 12 12" refX="10" refY="6" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 2 L10 6 L2 10" fill="none" stroke="${COLORS[color]}" stroke-width="1.8"/></marker>`).join('');
  const captions = spec.captions.map(([title, body, color], i) =>
    `<div class="he-scene__caption" style="--cc:${COLORS[color]};--i:${i}"><b>${esc(title[index])}</b><p>${esc(body[index])}</p></div>`).join('');
  return `<figure class="he-scene" data-scene data-scene-kind="${kind}">`
    + `<div class="he-scene__head"><div><p class="eyebrow">${esc(ui.kicker)}</p><p class="he-scene__title" id="${uid}-title">${esc(spec.title[index])}</p></div>`
    + `<button type="button" class="quiet-button he-scene__replay" data-scene-replay data-site-control hidden>${esc(ui.replay)}</button></div>`
    + `<div class="he-scene__stage"><svg class="scn" viewBox="0 0 1120 366" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="${uid}-title ${uid}-desc">`
    + `<desc id="${uid}-desc">${esc(spec.description[index])}</desc><defs>${markers}</defs>${DRAW[kind](labels, uid)}</svg></div>`
    + `<figcaption class="he-scene__captions">${captions}</figcaption></figure>`;
}

/** Insert scene markup after the lesson's cover illustration block, or before the first section heading. */
export function injectAfterCover(html: string, insert: string): string {
  const details = html.indexOf('</details>');
  if (details >= 0) return `${html.slice(0, details + 10)}${insert}${html.slice(details + 10)}`;
  const cover = html.match(/<p>\s*<img[\s\S]*?<\/p>/);
  if (cover && cover.index !== undefined) {
    const end = cover.index + cover[0].length;
    return `${html.slice(0, end)}${insert}${html.slice(end)}`;
  }
  const heading = html.indexOf('<h2');
  return heading >= 0 ? `${html.slice(0, heading)}${insert}${html.slice(heading)}` : `${html}${insert}`;
}
