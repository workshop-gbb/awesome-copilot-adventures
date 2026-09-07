const fs = require('node:fs');
const path = require('node:path');
const { root, repositoryFiles } = require('./repository-files');
const { fencedBlocks } = require('./markdown-helpers');

const collection = path.join(root, 'mslearn-github-copilot');
const catalog = JSON.parse(fs.readFileSync(path.join(collection, 'catalog.json'), 'utf8'));
const requiredSections = [
  '## Learning objectives', '## Before you start', '## Concepts and use cases',
  '## Exercise scenario', '## Task 1', '## Verify your work',
  '## Troubleshooting', '## Independent practice', '## Reset', '## Official references'
];
const preparationKits = {
  'setup-dotnet': '02-csharp', 'setup-python': '02-python',
  'setup-copilot': '01-interface', 'setup-speckit': '13-greenfield', 'setup-sdk': '16-sdk'
};

function main() {
  const failures = [];
  const ids = new Set();
  const paths = new Set();
  const permalinks = new Set();
  for (const lab of catalog.labs) {
    if (ids.has(lab.id)) failures.push(`Duplicate lab ID: ${lab.id}`);
    ids.add(lab.id);
    paths.add(lab.file);
    const filename = path.join(collection, 'Instructions', 'Labs', lab.file);
    if (!fs.existsSync(filename)) {
      failures.push(`${lab.id}: missing instruction file ${lab.file}`);
      continue;
    }
    const content = fs.readFileSync(filename, 'utf8');
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatter) failures.push(`${lab.id}: missing frontmatter`);
    else {
      const metadata = frontmatter[1];
      if (!metadata.includes(`lab_id: ${lab.id}`)) failures.push(`${lab.id}: inconsistent lab_id`);
      if (!metadata.includes('parent: Hands-on Labs')) failures.push(`${lab.id}: missing hands-on navigation parent`);
      if (!/^lab:\s*$/m.test(metadata) || !/^ {2}islab: true$/m.test(metadata)) failures.push(`${lab.id}: preserve nested lab metadata`);
      const verified = metadata.match(/^last_verified: "(\d{4}-\d{2}-\d{2})"$/m)?.[1];
      const parsed = verified ? new Date(`${verified}T00:00:00Z`) : null;
      if (!verified || !parsed || Number.isNaN(parsed.valueOf())
          || parsed.toISOString().slice(0, 10) !== verified || verified < '2026-09-06') {
        failures.push(`${lab.id}: missing real verification date`);
      }
      const permalink = metadata.match(/^permalink:\s*(\S+)/m)?.[1];
      if (permalink !== `/hands-on/${lab.id}/`) failures.push(`${lab.id}: unexpected permalink ${permalink}`);
      if (permalinks.has(permalink)) failures.push(`${lab.id}: duplicate permalink`);
      permalinks.add(permalink);
    }
    for (const section of requiredSections) {
      if (!content.includes(section)) failures.push(`${lab.id}: missing ${section}`);
    }
    const image = `assets/images/hands-on/${lab.id}.svg`;
    const kit = `assets/lab-kits/hands-on/${preparationKits[lab.id] || lab.id}.zip`;
    if (!content.includes(image) || !fs.existsSync(path.join(root, image))) {
      failures.push(`${lab.id}: missing linked instructional image`);
    }
    if (!content.includes(kit) || !fs.existsSync(path.join(root, kit))) {
      failures.push(`${lab.id}: missing linked learner ZIP`);
    }
    if (!/https:\/\/(?:code\.visualstudio\.com|docs\.github\.com|learn\.microsoft\.com|github\.com\/github)\//.test(content)) {
      failures.push(`${lab.id}: add an official GitHub/Microsoft reference`);
    }
    if (lab.fixture && !fs.existsSync(path.join(collection, lab.fixture))) failures.push(`${lab.id}: missing fixture`);
    const executableExamples = fencedBlocks(content).map(block => block.code).join('\n');
    if (/\btarget:\s*cloud\b|--text\b|--files\b|--allow-all-tools\b|git config --global/.test(executableExamples)) {
      failures.push(`${lab.id}: contains obsolete or unbounded setup guidance`);
    }
  }
  const actual = fs.readdirSync(path.join(collection, 'Instructions/Labs')).filter(name => /^LAB_.*\.md$/.test(name));
  if (catalog.labs.length !== 26 || actual.length !== 26) failures.push('Expected 25 revised imported guides plus one modernization lab.');
  for (const filename of actual) if (!paths.has(filename)) failures.push(`Uncatalogued guide: ${filename}`);
  for (const file of repositoryFiles().filter(filename => filename.startsWith(`${collection}${path.sep}`) && filename.endsWith('.csproj'))) {
    if (!fs.readFileSync(file, 'utf8').includes('<TargetFramework>net10.0</TargetFramework>')) {
      failures.push(`Fixture target must match the documented toolchain: ${path.relative(root, file)}`);
    }
  }
  for (const obsolete of ['_config.yml', '_build.yml']) {
    if (fs.existsSync(path.join(collection, obsolete))) failures.push(`Remove competing nested publishing configuration: ${obsolete}`);
  }
  if (!fs.existsSync(path.join(collection, 'LICENSE'))) failures.push('Preserve the imported MIT license.');
  if (failures.length) throw new Error(failures.join('\n'));
  console.log(`Checked ${catalog.labs.length} hands-on guides, catalog entries, fixtures and navigation metadata.`);
}

try { main(); } catch (error) {
  console.error(`Hands-on content validation failed:\n${error.message}`);
  process.exitCode = 1;
}
