const fs = require('node:fs');
const path = require('node:path');

const file = path.join(__dirname, 'starter', 'task-contract.json');

function findForbiddenKeys(value, location = 'root') {
  if (!value || typeof value !== 'object') return [];
  const failures = [];
  for (const [key, child] of Object.entries(value)) {
    const childLocation = `${location}.${key}`;
    if (/^(token|secret|password|api[_-]?key|deploymentCredentials)$/i.test(key)) {
      failures.push(`remove credential field ${childLocation}`);
    }
    failures.push(...findForbiddenKeys(child, childLocation));
  }
  return failures;
}

try {
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const failures = [];
  if (typeof data.goal !== 'string' || !data.goal.trim() || /TODO/i.test(data.goal)) failures.push('write a concrete goal');
  if (JSON.stringify(data.allowedPaths) !== JSON.stringify(['src/', 'test/'])) failures.push('allowedPaths must be ["src/", "test/"]');
  if (!Array.isArray(data.acceptanceCriteria) || data.acceptanceCriteria.length < 2 || data.acceptanceCriteria.some((item) => typeof item !== 'string' || !item.trim())) {
    failures.push('provide at least two acceptance criteria');
  }
  if (data.verificationCommand !== 'node test/run.js') failures.push('use the local verification command "node test/run.js"');
  if (data.networkRequired !== false) failures.push('set networkRequired to false');
  const evidence = new Set(data.evidence);
  for (const item of ['changed files', 'command', 'exit code', 'observed result']) {
    if (!evidence.has(item)) failures.push(`include "${item}" in evidence`);
  }
  failures.push(...findForbiddenKeys(data));
  if (data.deploymentRequired === true) failures.push('deploymentRequired must not be true');

  if (failures.length) {
    console.error(`Cloud Citadel verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Cloud Citadel verification passed: the delegated task is bounded and locally verifiable.');
} catch (error) {
  console.error(`Cloud Citadel verification failed: ${error.message}`);
  process.exit(1);
}
