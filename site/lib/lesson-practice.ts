import catalog from '../../mslearn-github-copilot/catalog.json';

/*
 * Which studio simulation a lesson should practice. The previous filename regular expression sent
 * most lessons to the same generic workflow demo; this registry names the match explicitly and
 * falls back to the workflow only when no closer match exists.
 */
export type PracticeTopic = 'workflow' | 'context' | 'verification' | 'evidence';

const adventureTopics: Record<string, PracticeTopic> = {
  'portals-of-nexus': 'workflow',
  'context-mirrors': 'context',
  'eldoria-laws': 'context',
  'tempora-loop': 'workflow',
  'algora-skills': 'context',
  'stellaris-agents': 'workflow',
  'stonevale-guardrails': 'verification',
  'cartographer-mcp': 'workflow',
  'lumoria-graph': 'context',
  'mythos-parallel': 'workflow',
  'automaton-foundry': 'evidence',
  'cloud-citadel': 'evidence',
  'terminal-gate': 'evidence',
  'convergence-of-three-realms': 'verification'
};

const labGroupTopics: Record<string, PracticeTopic> = {
  'Preparation': 'workflow',
  'Core workflow': 'verification',
  'Engineering practice': 'verification',
  'Collaboration': 'evidence',
  'Spec-driven development': 'workflow',
  'Agent customization': 'context'
};

// Lessons are addressed by repository path, so labs are matched through their catalog file name.
const labTopics = new Map<string, PracticeTopic>(
  catalog.labs.map(lab => [lab.file, labGroupTopics[lab.group] || 'workflow'])
);

export function practiceTopicFor(source?: string): PracticeTopic {
  if (!source) return 'workflow';
  const file = source.split('/').at(-1) as string;
  if (labTopics.has(file)) return labTopics.get(file) as PracticeTopic;
  const slug = source.match(/^adventures\/[^/]+\/([^/]+)\//)?.[1];
  if (slug && adventureTopics[slug]) return adventureTopics[slug];
  return 'workflow';
}
