const fs = require('fs');
const path = require('path');
const { root, markdownFiles: listMarkdownFiles } = require('./repository-files');
const { markdownLinkTargets } = require('./markdown-helpers');
const { ownedSourcePath } = require('./site-content');
const markdownFiles = listMarkdownFiles();

const failures = [];

for (const file of markdownFiles) {
  for (const value of markdownLinkTargets(fs.readFileSync(file, 'utf8'))) {
    let target = value.trim().replace(/\s+(["']).*\1$/, '');
    if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1);
    const ownedSource = ownedSourcePath(target);
    if (ownedSource !== null) {
      const local = path.join(root, decodeURIComponent(ownedSource.split(/[?#]/)[0]));
      if (!fs.existsSync(local)) failures.push(`${path.relative(root, file)} -> ${target} (missing repository source)`);
      continue;
    }
    if (!target || /^(https?:|mailto:|tel:|data:|#|\/\/)/i.test(target)) continue;
    target = decodeURIComponent(target.split(/[?#]/)[0]);
    if (!target || target.includes('{') || target.includes('[')) continue;

    const resolved = target.startsWith('/')
      ? path.join(root, target)
      : path.resolve(path.dirname(file), target);

    if (!fs.existsSync(resolved)) {
      failures.push(`${path.relative(root, file)} -> ${target}`);
    }
  }
}

if (failures.length) {
  console.error(`Broken internal links (${failures.length}):`);
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Checked ${markdownFiles.length} Markdown files: internal links are valid.`);
