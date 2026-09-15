/*
 * Reviewed reference images, not a gallery or a product-availability catalog.
 * Keep this module free of runtime asset imports so Node can test the registry.
 * LessonVisual.astro imports these same originals through Astro's asset pipeline.
 */
export const lessonVisualAssets = {
  'context-assembly': 'assets/images/general/context-assembly.png',
  'context-engineering-workflow': 'assets/images/general/context-engineering-workflow.png',
  'agent-loop': 'assets/images/general/agent-loop.png',
  'tdd-implementation-diagram': 'assets/images/general/tdd-implementation-diagram.png',
  'agents-window-session-target': 'assets/images/general/agents-window-session-target.png'
} as const;

export type LessonVisualId = keyof typeof lessonVisualAssets;

/*
 * Only canonical lesson source paths belong here. Do not infer matches from a
 * filename, directory, role or topic: rubrics and reference pages share those words.
 * Each lesson gets one reference, selected for its actual learning objective.
 */
export const lessonVisuals = {
  // Distinguish session target, role, model and permissions.
  'adventures/00-foundations/portals-of-nexus/README.md': 'agents-window-session-target',
  // Compare context sources; inspect whether scoped instructions were received.
  'adventures/00-foundations/context-mirrors/README.md': 'context-assembly',
  'adventures/01-basics/eldoria-laws/README.md': 'context-assembly',
  // Relate feedback to explicit stop conditions, not guaranteed convergence.
  'adventures/01-basics/tempora-loop/README.md': 'agent-loop',
  // Distinct responsibilities and reviewed handoffs, not built-in agent names.
  'adventures/02-intermediate/stellaris-agents/README.md': 'tdd-implementation-diagram',
  // Compare lifecycle boundaries without treating this drawing as the SDK API.
  'adventures/04-surfaces/automaton-foundry/README.md': 'agent-loop',

  // 01-interface: inspect independent controls, not their screen positions.
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_01_examine_settings_interface.md': 'agents-window-session-target',
  // 02-csharp / 02-python: ground analysis in selected source and tool evidence.
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_02_analyze_document_code.md': 'context-assembly',
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_02_analyze_document_code_py.md': 'context-assembly',
  // 04-xunit / 04-pytest: distinguish test evidence from implementation work.
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_04_develop_unit_tests_xunit.md': 'tdd-implementation-diagram',
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_04_develop_unit_tests_pytest.md': 'tdd-implementation-diagram',
  // 13-greenfield / 14-brownfield: carry requirements and constraints into a plan.
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_13_get-started-spec-driven-development.md': 'context-engineering-workflow',
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_14_implement-spec-driven-development.md': 'context-engineering-workflow',
  // 15-customization: distinguish instruction context from task references.
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_15_configure_customize_github_copilot_vscode.md': 'context-assembly',
  // 16-sdk: reason about tool results, cancellation and application-owned limits.
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_16_develop_ai_enabled_apps_github_copilot_sdk.md': 'agent-loop',
  // 17-modernization: preserve existing constraints through planning and review.
  'mslearn-github-copilot/Instructions/Labs/LAB_AK_17_modernize_existing_app_spec_kit.md': 'context-engineering-workflow'
} as const satisfies Record<string, LessonVisualId>;

/** Unmapped lessons, indexes, rubrics and reference pages deliberately render nothing. */
export function lessonVisualFor(source?: string): LessonVisualId | undefined {
  if (!source || !Object.hasOwn(lessonVisuals, source)) return undefined;
  return lessonVisuals[source as keyof typeof lessonVisuals];
}
