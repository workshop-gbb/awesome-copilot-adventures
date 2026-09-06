const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const ignored = new Set(['.git', 'node_modules', '_site']);
const markdownFiles = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else if (entry.name.endsWith('.md')) markdownFiles.push(fullPath);
  }
}

try {
  const tracked = execFileSync('git', ['ls-files', '-z', '*.md'], {
    cwd: root,
    encoding: 'utf8'
  });
  markdownFiles.push(
    ...tracked
      .split('\0')
      .filter(Boolean)
      .map(file => path.join(root, file))
  );
} catch {
  walk(root);
}

const linkPatterns = [
  /!?\[[^\]]*]\(([^)]+)\)/g,
  /\b(?:src|href)="([^"]+)"/g
];
const failures = [];

for (const file of markdownFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const linkPattern of linkPatterns) {
    for (const match of content.matchAll(linkPattern)) {
      let target = match[1].trim();
      if (!target || /^(https?:|mailto:|#)/i.test(target)) continue;
      if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1);
      target = decodeURIComponent(target.split('#')[0]);
      if (!target || target.includes('{') || target.includes('[')) continue;

      const resolved = target.startsWith('/')
        ? path.join(root, target)
        : path.resolve(path.dirname(file), target);

      if (!fs.existsSync(resolved)) {
        failures.push(`${path.relative(root, file)} -> ${target}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`Broken internal links (${failures.length}):`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Checked ${markdownFiles.length} Markdown files: internal links are valid.`);
