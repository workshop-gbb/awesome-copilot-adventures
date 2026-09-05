const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const labsRoot = path.resolve(__dirname, '..', 'labs');
const failures = [];
let checked = 0;

function checkJavaScript(file) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) failures.push(`${path.relative(labsRoot, file)}: ${result.stderr.trim()}`);
  else checked++;
}

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name.endsWith('.js') || entry.name.endsWith('.ts')) checkJavaScript(fullPath);
  }
}

walk(labsRoot);

const contextVerifier = path.join(labsRoot, 'context-mirrors', 'verify.js');
const contextResult = spawnSync(process.execPath, [contextVerifier], {
  cwd: path.dirname(contextVerifier),
  encoding: 'utf8'
});
process.stdout.write(contextResult.stdout);
process.stderr.write(contextResult.stderr);
if (contextResult.status !== 0) failures.push('context-mirrors: completed baseline verifier failed');

if (failures.length) {
  console.error('Lab validation failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Syntax-checked ${checked} lab JavaScript and TypeScript files. Starter exercises remain intentionally incomplete.`);
