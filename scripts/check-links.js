const fs = require('fs');
const path = require('path');
const { root, markdownFiles: listMarkdownFiles } = require('./repository-files');
const { withoutCodeBlocks } = require('./markdown-helpers');
const markdownFiles = listMarkdownFiles();

const linkPatterns = [
  /!?\[[^\]]*]\(([^)]+)\)/g,
  /\b(?:src|href)="([^"]+)"/g
];
const failures = [];

for (const file of markdownFiles) {
  const content = withoutCodeBlocks(fs.readFileSync(file, 'utf8'));
  for (const linkPattern of linkPatterns) {
    for (const match of content.matchAll(linkPattern)) {
      let target = match[1].trim();
      const ownedSource = target.match(/^https:\/\/github\.com\/paulasilvatech\/awesome-copilot-adventures\/(?:blob|tree)\/main\/([^?#]+)/);
      if (ownedSource) {
        const local = path.join(root, decodeURIComponent(ownedSource[1]));
        if (!fs.existsSync(local)) failures.push(`${path.relative(root, file)} -> ${target} (missing repository source)`);
        continue;
      }
      if (!target || /^(https?:|mailto:|tel:|#)/i.test(target)) continue;
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
