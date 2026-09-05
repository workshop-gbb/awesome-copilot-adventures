const fs = require('node:fs');
const path = require('node:path');

const starter = path.join(__dirname, 'starter');

function validateProject() {
  const packageData = JSON.parse(fs.readFileSync(path.join(starter, 'package.json'), 'utf8'));
  const sourcePath = path.join(starter, 'index.ts');
  const source = fs.readFileSync(sourcePath, 'utf8');
  const executableSource = source
    .split('\n')
    .map(line => {
      const comment = line.indexOf('//');
      return comment === -1 ? line : line.slice(0, comment);
    })
    .join('\n');
  const failures = [];
  const syntax = require('node:child_process').spawnSync(process.execPath, ['--check', sourcePath], {
    encoding: 'utf8'
  });

  if (syntax.status !== 0) failures.push(`index.ts has invalid syntax: ${syntax.stderr.trim()}`);
  if (packageData.scripts?.start !== 'tsx index.ts') failures.push('start the application with "tsx index.ts"');
  if (packageData.dependencies?.['@github/copilot-sdk'] !== '1.0.13') failures.push('pin @github/copilot-sdk to 1.0.13');
  if (packageData.devDependencies?.tsx !== '4.23.12') failures.push('pin tsx to 4.23.12');
  if (!/import\s+\{\s*CopilotClient\s*\}\s+from\s+["']@github\/copilot-sdk["']/.test(executableSource)) failures.push('import CopilotClient from @github/copilot-sdk');
  if (!/process\.argv\.slice\(2\)/.test(executableSource)) failures.push('read the prompt from command-line arguments');
  if (!/new\s+CopilotClient\(\)/.test(executableSource)) failures.push('create CopilotClient');
  if (!/createSession\(\s*\{\s*model:\s*["']auto["']\s*\}\s*\)/s.test(executableSource)) failures.push('create a session with model "auto"');
  if (!/sendAndWait\(\s*\{\s*prompt\s*\}\s*\)/s.test(executableSource)) failures.push('send the prompt with sendAndWait');
  if (!/finally\s*\{[\s\S]*await\s+client\.stop\(\)/.test(executableSource)) failures.push('stop the client in finally');
  if (/(ghp_|github_pat_|api[_-]?key\s*=|token\s*=)/i.test(executableSource)) failures.push('remove credential-like values');
  if (/CHANGE_ME/.test(executableSource)) failures.push('replace every CHANGE_ME placeholder in index.ts');

  return failures;
}

function validateEvaluation() {
  const data = JSON.parse(fs.readFileSync(path.join(starter, 'evaluation.json'), 'utf8'));
  const expectedBehaviors = new Map([
    ['explain', 'grounded-answer'],
    ['design', 'bounded-plan'],
    ['implement', 'verified-change'],
    ['unsupported', 'decline-and-explain'],
    ['tool-failure', 'surface-failure']
  ]);
  const failures = [];

  if (!Array.isArray(data.cases) || data.cases.length !== 5) {
    return ['define exactly five evaluation cases'];
  }

  const ids = new Set(data.cases.map(item => item.id));
  if (ids.size !== data.cases.length) failures.push('case IDs must be unique');
  for (const item of data.cases) {
    if (!expectedBehaviors.has(item.id)) failures.push(`unexpected case ID "${item.id}"`);
    else if (item.expectedBehavior !== expectedBehaviors.get(item.id)) failures.push(`${item.id} should expect behavior "${expectedBehaviors.get(item.id)}"`);
    if (typeof item.prompt !== 'string' || !item.prompt.trim()) failures.push(`${item.id} needs a prompt`);
    if (typeof item.expectedEvidence !== 'string' || !item.expectedEvidence.trim()) failures.push(`${item.id} needs expected evidence`);
  }
  return failures;
}

try {
  const failures = [...validateProject(), ...validateEvaluation()];
  if (failures.length) {
    console.error(`Automaton Foundry verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Automaton Foundry verification passed: the SDK app and evaluation contract are complete.');
} catch (error) {
  console.error(`Automaton Foundry verification failed: ${error.message}`);
  process.exit(1);
}
