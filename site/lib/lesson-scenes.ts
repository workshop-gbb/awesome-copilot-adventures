import type { SceneKind } from './scenes';

/*
 * Which mechanism scene opens each lesson, keyed by repository source path. The scene is injected
 * after the cover illustration in every locale, so a lesson shows the mechanism it teaches before
 * the prose explains it. A lesson without an entry renders unchanged.
 */
export const lessonScenes: Record<string, SceneKind> = {
  'adventures/00-foundations/portals-of-nexus/README.md': 'agent-anatomy',
  'adventures/00-foundations/context-mirrors/README.md': 'context-assembly',
  'adventures/01-basics/eldoria-laws/README.md': 'instruction-precedence',
  'adventures/01-basics/tempora-loop/README.md': 'feedback-loop',
  'adventures/02-intermediate/algora-skills/README.md': 'skill-loading',
  'adventures/02-intermediate/stellaris-agents/README.md': 'agent-handoff',
  'adventures/02-intermediate/stonevale-guardrails/README.md': 'verification-gate',
  'adventures/03-advanced/cartographer-mcp/README.md': 'mcp-connection',
  'adventures/03-advanced/mythos-parallel/README.md': 'parallel-ownership',
  'adventures/04-surfaces/terminal-gate/README.md': 'harness-surfaces',
  // QA placement while the caching lesson is written; remove when it moves to its own adventure.
  'adventures/04-surfaces/cloud-citadel/README.md': 'prefix-reuse'
};
