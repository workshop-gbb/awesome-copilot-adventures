const fs = require('node:fs');
const path = require('node:path');
const { markdownFiles, root } = require('./repository-files');
const { fencedBlocks } = require('./markdown-helpers');
const theme = require('./mermaid-theme.json');

function themeFrontmatter() {
  const variables = Object.entries(theme.themeVariables).map(([key, value]) => `    ${key}: ${JSON.stringify(value)}`);
  return ['---', 'config:', `  theme: ${theme.theme}`, `  look: ${theme.look}`, '  themeVariables:', ...variables, '---'].join('\n');
}

function checkDiagram(block, markdown) {
  const errors = [];
  if (!block.code.startsWith(`${themeFrontmatter()}\n`)) errors.push('use the canonical monochrome diagram frontmatter');
  if (!/^ *accTitle:\s*\S.+$/m.test(block.code)) errors.push('provide an accessible title');
  if (!/^ *accDescr:\s*\S.+$/m.test(block.code)) errors.push('provide an accessible description');
  if (/%%\{\s*init/.test(block.code)) errors.push('replace deprecated init directives with diagram frontmatter');
  const colors = block.code.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
  const allowed = new Set(Object.values(theme.themeVariables).filter(value => typeof value === 'string'));
  allowed.add('#000000');
  for (const color of colors) {
    if (!allowed.has(color.toLowerCase())) errors.push(`color outside the monochrome palette: ${color}`);
  }
  if (/\b(?:fill|stroke|color|background):\s*(?:red|blue|green|yellow|purple|orange|pink)\b/i.test(block.code)) {
    errors.push('named chromatic colors are not part of the palette');
  }
  const following = markdown.split('\n').slice(block.end + 1).join('\n').split(/\n#{1,6} |\n```mermaid/, 1)[0];
  if (!/\*\*Legend\.\*\*\s+\S/.test(following)) errors.push('add an adjacent Legend paragraph');
  if (!/\*\*Explanation\.\*\*\s+\S/.test(following)) errors.push('add an adjacent Explanation paragraph');
  return errors;
}

function main() {
  const failures = [];
  const types = new Set();
  let count = 0;
  for (const file of markdownFiles()) {
    const content = fs.readFileSync(file, 'utf8');
    for (const block of fencedBlocks(content).filter(item => item.language === 'mermaid')) {
      count++;
      const diagram = block.code.replace(/^---\n[\s\S]*?\n---\n/, '');
      types.add(diagram.split(/\s/, 1)[0]);
      for (const error of checkDiagram(block, content)) {
        failures.push(`${path.relative(root, file)}:${block.start + 1}: ${error}`);
      }
    }
  }
  if (count === 0) failures.push('No Mermaid diagrams were found.');
  if (failures.length) throw new Error(failures.join('\n'));
  console.log(`Checked ${count} monochrome Mermaid diagrams (${[...types].sort().join(', ')}), all with accessible titles, legends and explanations.`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(`Diagram validation failed:\n${error.message}`);
    process.exitCode = 1;
  }
}

module.exports = { themeFrontmatter, checkDiagram };
