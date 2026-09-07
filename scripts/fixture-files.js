const fs = require('node:fs');
const path = require('node:path');

const excludedDirectories = new Set([
  '.git', 'bin', 'obj', 'node_modules', '.venv', '__pycache__',
  '.pytest_cache', 'reference', 'TestResults', '.cache'
]);

function includeFixturePath(relative) {
  const parts = relative.split(/[\\/]/);
  const name = parts.at(-1);
  return !parts.some(part => excludedDirectories.has(part))
    && name !== '.DS_Store' && name !== 'Thumbs.db'
    && !(name.startsWith('.env') && name !== '.env.example')
    && !name.endsWith('.log');
}

function fixtureFiles(directory) {
  const files = [];
  function walk(current) {
    for (const entry of fs.readdirSync(current, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
      const file = path.join(current, entry.name);
      const relative = path.relative(directory, file);
      if (!includeFixturePath(relative)) continue;
      if (entry.isSymbolicLink()) throw new Error(`Fixture contains a symbolic link: ${file}`);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) files.push(relative.split(path.sep).join('/'));
      else throw new Error(`Unsupported fixture entry: ${file}`);
    }
  }
  walk(directory);
  return files.sort();
}

module.exports = { includeFixturePath, fixtureFiles };
