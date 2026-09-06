const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

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
          '```mermaid',
          '> [!NOTE]'
        ];
        for (const section of requiredSections) {
          if (!content.includes(section)) {
            failures.push(`Missing "${section}" in adventures/${level}/${slug}/README.md`);
          }
        }
      }
    }
  }
}

if (adventureCount !== 14) failures.push(`Expected 14 adventures, found ${adventureCount}`);
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

function activeMarkdownFiles() {
  try {
    return execFileSync('git', ['ls-files', '-z', '*.md'], {
      cwd: root,
      encoding: 'utf8'
    })
      .split('\0')
      .filter(file => file && !file.startsWith('legacy/'))
      .map(file => path.join(root, file));
  } catch {
    return [
      path.join(root, 'README.md'),
      ...['adventures', 'docs', 'labs', 'solutions', 'assets', '.github']
        .filter(directory => fs.existsSync(path.join(root, directory)))
        .flatMap(directory => collectMarkdown(path.join(root, directory)))
    ];
  }
}

function collectMarkdown(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectMarkdown(fullPath);
    return entry.name.endsWith('.md') ? [fullPath] : [];
  });
}

for (const fullPath of activeMarkdownFiles()) {
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
