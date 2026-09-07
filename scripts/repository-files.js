const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const skippedDirectories = new Set([
  '.git', 'node_modules', '_site', 'bin', 'obj', '.venv', '__pycache__',
  '.pytest_cache', 'TestResults', '.cache'
]);
const sourceDirectories = ['adventures', 'assets', 'docs', 'labs', 'legacy', 'mslearn-github-copilot', 'shared', 'solutions', '.github', '.devcontainer', 'scripts', 'site', 'site-locales'];

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const filename = path.join(directory, entry.name);
    if (entry.isSymbolicLink() || skippedDirectories.has(entry.name)) return [];
    if (entry.isDirectory()) return walk(filename);
    return entry.isFile() ? [filename] : [];
  });
}

function repositoryFiles() {
  if (!fs.existsSync(path.join(root, '.git'))) {
    const topLevel = fs.readdirSync(root, { withFileTypes: true })
      .filter(entry => entry.isFile())
      .map(entry => path.join(root, entry.name));
    return [...topLevel, ...sourceDirectories.flatMap(directory => {
      const location = path.join(root, directory);
      return fs.existsSync(location) ? walk(location) : [];
    })].sort();
  }

  const output = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z'], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 4 * 1024 * 1024
  });
  return [...new Set(output.split('\0').filter(Boolean))]
    .filter(filename => !filename.split('/').some(part => skippedDirectories.has(part)))
    .map(filename => path.join(root, filename))
    .filter(filename => fs.existsSync(filename) && fs.lstatSync(filename).isFile())
    .sort();
}

function markdownFiles() {
  // Generated locale copies have their own translation, route and diagram checks.
  return repositoryFiles().filter(filename => filename.toLowerCase().endsWith('.md')
    && !path.relative(root, filename).startsWith(`site-pages${path.sep}`));
}

module.exports = { root, repositoryFiles, markdownFiles };
