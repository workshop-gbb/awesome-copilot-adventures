const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'starter', '.github', 'copilot-instructions.md');

try {
  const text = fs.readFileSync(file, 'utf8');
  const rules = [
    [/deterministic/i, 'mention deterministic behavior'],
    [/\b(test|tests|testing)\b/i, 'require tests'],
    [/\b(credentials?|secrets?|api keys?)\b/i, 'forbid credentials or secrets'],
    [/(only|limit|restrict)[^\n]*`?src\/?`?/i, 'limit changes to src/'],
    [/\b(verify|verification|validate|validation)\b/i, 'require verification']
  ];
  const failures = rules.filter(([pattern]) => !pattern.test(text)).map(([, message]) => message);
  if (/TODO/i.test(text)) failures.push('remove the TODO placeholder');

  if (failures.length) {
    console.error(`Laws of Eldoria verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Laws of Eldoria verification passed: the workspace instructions are explicit and testable.');
} catch (error) {
  console.error(`Laws of Eldoria verification failed: ${error.message}`);
  process.exit(1);
}
