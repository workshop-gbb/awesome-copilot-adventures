const fs = require('fs');
const path = require('path');
const { markdownFiles } = require('./repository-files');
const { fencedBlocks } = require('./markdown-helpers');

const root = path.resolve(__dirname, '..');
const curriculum = path.join(root, 'adventures');
const expectedLevels = [
  '00-foundations',
  '01-basics',
  '02-intermediate',
  '03-advanced',
  '04-surfaces',
  '99-capstone'
];
const expectedAdventures = {
  '00-foundations': ['context-mirrors', 'portals-of-nexus'],
  '01-basics': ['eldoria-laws', 'tempora-loop'],
  '02-intermediate': ['algora-skills', 'stellaris-agents', 'stonevale-guardrails'],
  '03-advanced': ['cartographer-mcp', 'lumoria-graph', 'mythos-parallel'],
  '04-surfaces': ['automaton-foundry', 'cloud-citadel', 'terminal-gate'],
  '99-capstone': ['convergence-of-three-realms']
};

const failures = [];
let adventureCount = 0;
const adventureDiagrams = new Set();
const adventureObjectives = new Set();

if (!fs.existsSync(curriculum)) {
  failures.push('adventures/ does not exist');
} else {
  for (const level of expectedLevels) {
    const levelPath = path.join(curriculum, level);
    if (!fs.existsSync(levelPath)) {
      failures.push(`Missing curriculum level: adventures/${level}`);
      continue;
    }

    const actualAdventures = fs.readdirSync(levelPath, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .sort();
    const expectedForLevel = expectedAdventures[level].slice().sort();
    if (JSON.stringify(actualAdventures) !== JSON.stringify(expectedForLevel)) {
      failures.push(`Unexpected adventure set in adventures/${level}`);
    }

    for (const slug of expectedForLevel) {
      const adventurePath = path.join(levelPath, slug);
      for (const required of ['README.md', 'rubric.md']) {
        if (!fs.existsSync(path.join(adventurePath, required))) {
          failures.push(`Missing ${required} in adventures/${level}/${slug}`);
        }
      }
      adventureCount++;
      const readmePath = path.join(adventurePath, 'README.md');
      if (fs.existsSync(readmePath)) {
        const content = fs.readFileSync(readmePath, 'utf8');
        const hero = `assets/images/adventures/${slug}-hero.svg`;
        const kit = `assets/lab-kits/adventures/${slug}.zip`;
        if (!content.includes(hero) || !fs.existsSync(path.join(root, hero))) {
          failures.push(`Missing linked original hero for ${slug}`);
        }
        if (!content.includes(kit) || !fs.existsSync(path.join(root, kit))) {
          failures.push(`Missing linked learner ZIP for ${slug}`);
        }
        for (const block of fencedBlocks(content).filter(block => block.language === 'mermaid')) {
          adventureDiagrams.add(block.code);
        }
        adventureObjectives.add(content.match(/## Learning objectives\n([\s\S]*?)(?=\n## )/)?.[1]?.trim());
        const requiredSections = [
          '## Official references',
          '## Story',
          '## Learning objectives',
          '## Prerequisites',
          '## Ask → Plan → Agent workflow',
          '## Guided mission',
          '## Intentional failure',
          '## Independent challenge',
          '## Evidence checklist',
          '## Reset instructions',
          '```mermaid'
        ];
        // The status, verification date and capability are declared in frontmatter and rendered as
        // the lesson briefing in every language, instead of being repeated as a prose callout.
        for (const field of ['status:', 'last_verified:', 'primary_capability:', 'level:', 'slug:']) {
          if (!/^---\n[\s\S]*?\n---/.exec(content)?.[0]?.includes(`\n${field}`)) {
            failures.push(`Missing frontmatter ${field} in adventures/${level}/${slug}/README.md`);
          }
        }
        for (const section of requiredSections) {
          if (!content.includes(section)) {
            failures.push(`Missing "${section}" in adventures/${level}/${slug}/README.md`);
          }
          if (!content.includes('docs/prerequisites.md')
            || !content.includes('docs/downloads.md#use-copilot-cli-from-the-extracted-kit')) {
            failures.push(`Missing prerequisites or terminal-only route for ${slug}`);
          }
          if (!fencedBlocks(content).some(block => block.language === 'bash' && block.code.trim() === 'node verify.js')) {
            failures.push(`Missing copyable extracted-kit baseline for ${slug}`);
          }
        }
      }
    }
  }
}

if (adventureCount !== 14) failures.push(`Expected 14 adventures, found ${adventureCount}`);
if (adventureDiagrams.size < 14) failures.push('Each adventure needs a capability-specific diagram, not the same generic workflow.');
if (adventureObjectives.size < 14) failures.push('Each adventure needs specific learning objectives.');
if (!fs.existsSync(path.join(root, 'assets/images/adventures/README.md'))) {
  failures.push('Missing adventure media generation guidance');
}

const requiredHarnessFiles = [
  '.github/copilot-instructions.md',
  '.github/agents/planner.agent.md',
  '.github/agents/reviewer.agent.md',
  '.github/skills/evidence-first/SKILL.md',
  '.github/instructions/adventures.instructions.md'
];

for (const file of requiredHarnessFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing harness file: ${file}`);
}

const requiredSiteFiles = [
  'docs/index.md',
  'docs/start-here.md',
  'docs/prerequisites.md',
  'docs/curriculum-map.md',
  'docs/harness-guide.md',
  'docs/customization-primitives.md',
  'docs/feature-status.md',
  'docs/glossary.md',
  'docs/media-prompts.md'
];

for (const file of requiredSiteFiles) {
  if (!fs.existsSync(path.join(root, file))) failures.push(`Missing site file: ${file}`);
}

const forbiddenPatterns = [
  ['microsoft.github.io', 'old Pages host'],
  ['/concepts/agents/coding-agent/', 'deprecated coding-agent documentation route'],
  ['/docs/copilot/chat/chat-agent-mode', 'deprecated VS Code agent-mode route'],
  ['/docs/copilot/customization/', 'deprecated VS Code customization route'],
  ['.chatmode.md', 'deprecated custom chat mode file'],
  ['100% test coverage', 'unsupported coverage claim'],
  ['Production-ready server', 'unsupported production-readiness claim']
];

for (const fullPath of markdownFiles().filter(file => !path.relative(root, file).startsWith('legacy/'))) {
  const content = fs.readFileSync(fullPath, 'utf8');
  for (const [pattern, description] of forbiddenPatterns) {
    if (content.includes(pattern)) {
      failures.push(`${path.relative(root, fullPath)} contains ${description}: ${pattern}`);
    }
  }
}

for (const unsafeDefault of ['.mcp.json', '.vscode/mcp.json']) {
  if (fs.existsSync(path.join(root, unsafeDefault))) {
    failures.push(`Workspace-wide MCP configuration must not be enabled by default: ${unsafeDefault}`);
  }
}

if (failures.length) {
  console.error('Content validation failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log('Curriculum structure and shared harness are valid.');
