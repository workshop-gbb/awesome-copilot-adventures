const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { root } = require('./repository-files');
const { fixtureFiles } = require('./fixture-files');
const { recipes } = require('./lab-kit-recipes');
const { createZip } = require('./lab-kit-zip');
const { readSource, rewriteLinks } = require('./build-site');
const { splitFrontmatter } = require('./site-content');
const { repository } = require('../site.config.json');

const output = 'assets/lab-kits';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
function checkedSource(name) {
  if (path.isAbsolute(name) || name.split(/[\\/]/).some(part => part === '..' || !part)) {
    throw new Error(`Kit source must stay inside the repository: ${name}`);
  }
  const file = path.join(root, name);
  const relative = path.relative(fs.realpathSync(root), fs.realpathSync(file));
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    throw new Error(`Kit source resolves outside the repository: ${name}`);
  }
  if (fs.lstatSync(file).isSymbolicLink()) throw new Error(`Kit source is a symbolic link: ${name}`);
  return file;
}
const sourceUrl = name => {
  const file = path.join(root, name);
  const kind = fs.existsSync(file) && fs.statSync(file).isDirectory() ? 'tree' : 'blob';
  return `https://github.com/${repository}/${kind}/main/${name.split('/').map(encodeURIComponent).join('/')}`;
};

const verifier = `'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'KIT-MANIFEST.json'), 'utf8'));
if (manifest.formatVersion !== 1 || !Array.isArray(manifest.files) || !manifest.files.length) {
  throw new Error('Invalid kit manifest.');
}
for (const entry of manifest.files) {
  if (typeof entry.path !== 'string' || !entry.path || /[\\\\:\\u0000-\\u001f]/.test(entry.path)
      || entry.path.split('/').some(part => !part || part === '.' || part === '..')) {
    throw new Error('Unsafe manifest path.');
  }
  let target = __dirname;
  for (const part of entry.path.split('/')) {
    target = path.join(target, part);
    if (fs.lstatSync(target).isSymbolicLink()) throw new Error('Unexpected symlink: ' + entry.path);
  }
  const bytes = fs.readFileSync(target);
  const digest = crypto.createHash('sha256').update(bytes).digest('hex');
  if (bytes.length !== entry.bytes || digest !== entry.sha256) {
    throw new Error('Kit file differs from its baseline: ' + entry.path);
  }
}
console.log('Verified ' + manifest.files.length + ' unchanged kit files. This is integrity evidence, not a lesson test.');
`;

function startGuide(recipe) {
  const baseline = recipe.baseline;
  const commands = [...(baseline.workingDirectory === '.' ? [] : [`cd ${baseline.workingDirectory}`]), ...baseline.commands];
  return `# Start this lab: ${recipe.title}

> [!IMPORTANT]
> This is a learner starter, not a completed solution. Use only synthetic data.
> Live Copilot, cloud and SDK steps require your own authorized access and are optional where the lesson says so.

| Item | Value |
| --- | --- |
| Lab | ${recipe.id} |
| Track | ${recipe.track} |
| Runtime | ${recipe.runtime} |
| VS Code workspace | ${recipe.workspace === '.' ? 'The extracted lab directory' : 'The starter/ directory inside the extracted lab'} |
| Initial check | ${baseline.expected === 'pass' ? 'Expected to pass' : 'Expected intentional starter failure'} |
| Full instructions | [KIT-LESSON.md](KIT-LESSON.md) |
| Setup and GitHub walkthrough | [.workshop/SETUP.md](.workshop/SETUP.md) |

## 1. Extract and inspect

Extract into a new folder on your selected work drive. Open this file from the
extracted directory, not from the ZIP viewer. Do not merge it into another project.
The archive does not include credentials, installed runtimes, dependencies, Git
history or the instructor's reference directory.

Before running any downloaded code, review its source and use a trusted download.
With Node 24 available, run from the extracted lab directory:

\`\`\`bash
node KIT-VERIFY.cjs
\`\`\`

This checks the bundled file inventory. It does not authenticate the publisher,
scan for malware or prove that the exercise passes. After you edit files it is
normal for their baseline hashes to differ; use the lesson's tests for your work.

## 2. Record the baseline

Start in the extracted lab directory. The commands below state any additional
working-directory change explicitly:

\`\`\`bash
${commands.join('\n')}
\`\`\`

**Expected starting state:** ${baseline.message}

For the Python route, select the same interpreter in VS Code and your terminal;
on Windows, use \`py\` instead of \`python\` if that is the installed launcher.
Install only dependencies required by the selected exercise. Do not run every
project or profiler in parallel.

## 3. Open the correct workspace

Use **File > Open Folder** in a new VS Code window and select
${recipe.workspace === '.' ? 'this extracted lab directory' : 'the starter/ directory inside the extracted lab'}.
Follow [the full lesson](KIT-LESSON.md). When it says to work in a disposable copy,
this extracted kit is that copy. References to the curriculum describe its source,
not a second directory you must recreate.

Use the original README for project-specific details. The setup guide explains
local Git initialization and an optional private GitHub repository. Nothing is
published automatically. External documentation and other lessons still need an
internet connection; the local starter files do not depend on those links.

## 4. Prove completion and reset safely

- [ ] Record the initial command, working directory, exit code and observed result.
- [ ] Explain the concept and approved change before asking Agent to implement.
- [ ] Follow the positive and negative checks in the lesson; do not weaken tests.
- [ ] Review the actual diff and distinguish local tests from live integration.
- [ ] Save your evidence before stopping only the processes you started.
- [ ] For a fresh attempt, extract into another unused folder; do not overwrite your work.

See [the source lesson](${sourceUrl(recipe.guide)}) for updates. This package is a
snapshot; its file hashes are in [KIT-MANIFEST.json](KIT-MANIFEST.json).
`;
}

function kitEntries(recipe) {
  const source = checkedSource(recipe.source);
  const entries = new Map();
  for (const file of fixtureFiles(source)) {
    entries.set(file, {
      data: readSource(path.join(source, file)),
      executable: Boolean(fs.statSync(path.join(source, file)).mode & 0o111),
      original: `${recipe.source}/${file}`
    });
  }
  for (const name of ['KIT-START.md', 'KIT-LESSON.md', 'KIT-VERIFY.cjs', 'KIT-MANIFEST.json', 'KIT-LICENSE.txt', 'CURRICULUM-LICENSE.txt']) {
    if (entries.has(name)) throw new Error(`Fixture uses a reserved kit filename: ${recipe.id}/${name}`);
  }
  if ([...entries.keys()].some(name => name.startsWith('.workshop/'))) {
    throw new Error(`Fixture uses the reserved .workshop directory: ${recipe.id}`);
  }
  const documents = new Map([
    [recipe.guide, 'KIT-LESSON.md'],
    ['docs/downloads.md', '.workshop/SETUP.md']
  ]);
  if (recipe.track === 'hands-on') {
    documents.set('mslearn-github-copilot/Instructions/Reference/COPILOT.md', '.workshop/CONCEPTS.md');
    documents.set('mslearn-github-copilot/Instructions/Reference/SETUP.md', '.workshop/ENVIRONMENT.md');
    if (['13-greenfield', '14-brownfield', '17-modernization'].includes(recipe.id)) {
      documents.set('mslearn-github-copilot/Instructions/Reference/SPEC_KIT.md', '.workshop/SPEC-KIT.md');
      documents.set('mslearn-github-copilot/Instructions/Concepts/Sample PRDs.md', '.workshop/PRD-EXAMPLES.md');
    }
  } else {
    documents.set(path.posix.join(path.posix.dirname(recipe.guide), 'rubric.md'), '.workshop/RUBRIC.md');
  }
  for (const [original, name] of documents) {
    entries.set(name, { data: Buffer.from(splitFrontmatter(fs.readFileSync(checkedSource(original), 'utf8')).body), original });
  }
  entries.set('KIT-LICENSE.txt', { data: readSource(checkedSource(recipe.license)) });
  entries.set('CURRICULUM-LICENSE.txt', { data: readSource(path.join(root, 'LICENSE')) });
  if (!entries.has('.gitignore')) {
    entries.set('.gitignore', { data: Buffer.from('node_modules/\nbin/\nobj/\n.venv/\n__pycache__/\n.pytest_cache/\n.env\n.env.*\n!.env.example\n.runtime/\n*.log\n.DS_Store\n') });
  }
  if (!entries.has('.gitattributes')) {
    entries.set('.gitattributes', { data: Buffer.from('* text=auto eol=lf\n*.png binary\n*.jpg binary\n*.zip binary\n') });
  }
  entries.set('KIT-VERIFY.cjs', { data: Buffer.from(verifier) });
  entries.set('KIT-START.md', { data: Buffer.from(startGuide(recipe)) });

  const originals = new Map([...entries].filter(([, value]) => value.original).map(([name, value]) => [value.original, name]));
  for (const [name, entry] of [...entries]) {
    if (!name.toLowerCase().endsWith('.md') || !entry.original) continue;
    const resolve = (target, from, locale, image) => {
      if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(target)) return target;
      const parts = target.trim().match(/^(?:<([^>]+)>|([^\s]+))(\s+["'][\s\S]*["'])?$/);
      if (!parts) throw new Error(`Unsupported Markdown target in ${from}: ${target}`);
      const destination = parts[1] || parts[2];
      const suffix = destination.match(/[?#].*$/)?.[0] || '';
      const decoded = decodeURIComponent(destination.replace(/[?#].*$/, ''));
      if (!decoded) return target;
      const candidate = path.posix.normalize(decoded.startsWith('/')
        ? decoded.slice(1) : path.posix.join(path.posix.dirname(from), decoded));
      if (candidate === '..' || candidate.startsWith('../')) throw new Error(`Lesson link escapes the repository: ${target}`);
      let bundled = originals.get(candidate);
      if (image) {
        const bytes = readSource(checkedSource(candidate));
        bundled = `.workshop/media/${hash(bytes).slice(0, 16)}${path.extname(candidate).toLowerCase()}`;
        entries.set(bundled, { data: bytes });
      }
      if (bundled) {
        const relative = path.posix.relative(path.posix.dirname(name), bundled).split('/').map(encodeURIComponent).join('/');
        return relative + suffix + (parts[3] || '');
      }
      return sourceUrl(candidate) + suffix + (parts[3] || '');
    };
    entry.data = Buffer.from(rewriteLinks(entry.data.toString('utf8'), entry.original, 'en', resolve));
  }
  const inventory = [...entries].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0).map(([name, entry]) => ({
    path: name, bytes: entry.data.length, sha256: hash(entry.data)
  }));
  entries.set('KIT-MANIFEST.json', { data: Buffer.from(JSON.stringify({
    formatVersion: 1, id: recipe.id, track: recipe.track, source: recipe.source,
    lesson: recipe.guide, workspace: recipe.workspace, baseline: recipe.baseline, files: inventory
  }, null, 2) + '\n') });
  return [...entries].map(([name, entry]) => ({ name, ...entry }));
}

function buildKits() {
  const artifacts = new Map();
  const inventory = [];
  for (const recipe of recipes()) {
    const entries = kitEntries(recipe);
    const archive = createZip(entries.map(entry => ({ ...entry, name: `${recipe.id}/${entry.name}` })));
    const filename = `${recipe.track}/${recipe.id}.zip`;
    artifacts.set(`${output}/${filename}`, archive);
    inventory.push({
      id: recipe.id, track: recipe.track, title: recipe.title, path: filename,
      bytes: archive.length, sha256: hash(archive), files: entries.length,
      source: recipe.source, lesson: recipe.guide, baseline: recipe.baseline
    });
  }
  artifacts.set(`${output}/index.json`, Buffer.from(JSON.stringify({ formatVersion: 1, kits: inventory }, null, 2) + '\n'));
  artifacts.set(`${output}/SHA256SUMS.txt`, Buffer.from(inventory.map(item => `${item.sha256}  ${item.path}`).join('\n') + '\n'));
  return { artifacts, inventory };
}

function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check') || args.length > 1) throw new Error('Usage: node scripts/build-lab-kits.js [--check]');
  const { artifacts, inventory } = buildKits();
  const stale = [];
  for (const [name, bytes] of artifacts) {
    const file = path.join(root, name);
    if (fs.existsSync(file) && fs.readFileSync(file).equals(bytes)) continue;
    stale.push(name);
    if (!args.includes('--check')) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, bytes);
    }
  }
  if (args.includes('--check') && stale.length) {
    throw new Error(`${stale.length} lab-kit artifacts are missing or stale. Run npm run build:kits.`);
  }
  console.log(`${args.includes('--check') ? 'Verified' : 'Built'} ${inventory.length} reproducible learner ZIPs, with manifests and SHA-256 checksums.`);
}

if (require.main === module) {
  try { main(); } catch (error) {
    console.error(`Lab-kit packaging failed: ${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { kitEntries, buildKits, startGuide };
