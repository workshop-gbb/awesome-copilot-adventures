const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'starter', '.github', 'skills', 'evidence-report', 'SKILL.md');

try {
  const text = fs.readFileSync(file, 'utf8');
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/);
  const failures = [];
  if (!frontmatter) {
    failures.push('add YAML frontmatter');
  } else {
    if (!/^name:\s*evidence-report\s*$/m.test(frontmatter[1])) failures.push('set name to evidence-report');
    if (!/^description:\s*(?!TODO\s*$).+/m.test(frontmatter[1])) failures.push('write a concrete description');
  }
  if (!/\b(run|execute)\b[\s\S]*\b(test|verification|verify|command)\b/i.test(text)) failures.push('tell the agent to run verification');
  if (!/\bcommand\b/i.test(text)) failures.push('record the command');
  if (!/\bexit code\b/i.test(text)) failures.push('record the exit code');
  if (!/\b(observed|actual) (result|output)\b/i.test(text)) failures.push('record the observed result');
  if (!/\b(unsupported|unverified)\b[\s\S]*\b(claim|success)\b/i.test(text)) failures.push('forbid unsupported success claims');
  if (/TODO/i.test(text)) failures.push('remove every TODO');

  if (failures.length) {
    console.error(`Skills of Algora verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Skills of Algora verification passed: the skill has metadata and evidence-first instructions.');
} catch (error) {
  console.error(`Skills of Algora verification failed: ${error.message}`);
  process.exit(1);
}
