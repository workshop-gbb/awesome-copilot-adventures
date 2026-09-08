const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { crc32 } = require('node:zlib');
const { spawnSync } = require('node:child_process');
const { createZip, safeEntryName } = require('./lab-kit-zip');
const { includeFixturePath, fixtureFiles } = require('./fixture-files');
const { recipes } = require('./lab-kit-recipes');
const { kitEntries, buildKits } = require('./build-lab-kits');
const { root } = require('./repository-files');
const { fencedBlocks } = require('./markdown-helpers');

function readArchive(bytes) {
  const files = new Map();
  let offset = 0;
  while (bytes.readUInt32LE(offset) === 0x04034b50) {
    assert.equal(bytes.readUInt16LE(offset + 6), 0x0800);
    assert.equal(bytes.readUInt16LE(offset + 8), 0);
    const compressedSize = bytes.readUInt32LE(offset + 18);
    const nameSize = bytes.readUInt16LE(offset + 26);
    const extraSize = bytes.readUInt16LE(offset + 28);
    const name = bytes.subarray(offset + 30, offset + 30 + nameSize).toString('utf8');
    assert.ok(safeEntryName(name));
    const start = offset + 30 + nameSize + extraSize;
    const content = bytes.subarray(start, start + compressedSize);
    assert.equal(content.length, bytes.readUInt32LE(offset + 22));
    assert.equal(crc32(content), bytes.readUInt32LE(offset + 14));
    assert.ok(!files.has(name));
    files.set(name, content);
    offset = start + compressedSize;
  }
  const end = bytes.length - 22;
  assert.equal(bytes.readUInt32LE(offset), 0x02014b50);
  assert.equal(bytes.readUInt32LE(end), 0x06054b50);
  assert.equal(bytes.readUInt16LE(end + 10), files.size);
  assert.equal(bytes.readUInt32LE(end + 16), offset);
  assert.equal(bytes.readUInt32LE(end + 12), end - offset);
  let central = offset;
  for (const [name, content] of files) {
    assert.equal(bytes.readUInt32LE(central), 0x02014b50);
    assert.equal(bytes.readUInt16LE(central + 10), 0);
    const nameSize = bytes.readUInt16LE(central + 28);
    assert.equal(bytes.subarray(central + 46, central + 46 + nameSize).toString('utf8'), name);
    assert.equal(bytes.readUInt32LE(central + 16), crc32(content));
    assert.equal(bytes.readUInt32LE(bytes.readUInt32LE(central + 42)), 0x04034b50);
    central += 46 + nameSize;
  }
  assert.equal(central, end);
  return files;
}

test('ZIP output is deterministic, preserves bytes and supports UTF-8 names', () => {
  const entries = [
    { name: 'lab/source.mjs', data: Buffer.from('export const value = 1;\n') },
    { name: 'lab/café.txt', data: Buffer.from([0, 128, 255]), executable: false }
  ];
  const zip = createZip(entries);
  assert.deepEqual(zip, createZip([...entries].reverse()));
  const files = readArchive(zip);
  for (const entry of entries) assert.deepEqual(files.get(entry.name), entry.data);
});

test('portable ZIP byte contract uses STORE without runtime compression', () => {
  const expected = Buffer.from(
    '504b03041400000800000000210020303a36060000000600000005000000612e74787468656c6c6f0a'
    + '504b010214031400000800000000210020303a360600000006000000050000000000000000000000a48100000000612e747874'
    + '504b0506000000000100010033000000290000000000',
    'hex'
  );
  assert.deepEqual(createZip([{ name: 'a.txt', data: Buffer.from('hello\n') }]), expected);
});

test('ZIP rejects unsafe paths, duplicate names and unsupported archive sizes', () => {
  for (const name of ['../secret', '/etc/passwd', 'C:/file', 'a\\b', 'a//b', './a', 'a/../b', 'a\0b', '']) {
    assert.equal(safeEntryName(name), false, name);
    assert.throws(() => createZip([{ name, data: 'x' }]), /Unsafe/);
  }
  assert.throws(() => createZip([{ name: 'a', data: '' }, { name: 'A', data: '' }]), /Duplicate/);
  assert.throws(() => createZip([]), /entry limits/);
  assert.throws(() => createZip([{ name: 'x'.repeat(65536), data: '' }]), /size limits/);
});

test('fixture copying and packaging share exclusions and reject symlinks', () => {
  for (const name of ['reference/answer.js', 'src/bin/file', 'node_modules/module', '.env', '.env.local', 'trace.log']) {
    assert.equal(includeFixturePath(name), false, name);
  }
  for (const name of ['.env.example', 'src/example.js', '.github/skills/evidence/SKILL.md']) {
    assert.equal(includeFixturePath(name), true, name);
  }
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-files-'));
  try {
    fs.writeFileSync(path.join(temporary, 'source.js'), 'source');
    fs.mkdirSync(path.join(temporary, 'reference'));
    fs.writeFileSync(path.join(temporary, 'reference/answer.js'), 'not for the learner');
    assert.deepEqual(fixtureFiles(temporary), ['source.js']);
    fs.symlinkSync('source.js', path.join(temporary, 'link.js'));
    assert.throws(() => fixtureFiles(temporary), /symbolic link/);
  } finally {
    fs.rmSync(temporary, { recursive: true });
  }
});

test('each exercise has a recipe, source, workspace and explicit baseline', () => {
  const all = recipes();
  assert.equal(all.filter(recipe => recipe.track === 'hands-on').length, 21);
  assert.equal(all.filter(recipe => recipe.track === 'adventures').length, 14);
  for (const recipe of all) {
    assert.ok(fs.existsSync(path.join(root, recipe.guide)), recipe.id);
    assert.ok(fs.existsSync(path.join(root, recipe.source, recipe.workspace)), recipe.id);
    assert.ok(fs.existsSync(path.join(root, recipe.source, recipe.baseline.workingDirectory)), recipe.id);
    assert.ok(recipe.baseline.commands.length > 0, recipe.id);
    assert.ok(['pass', 'intentional-failure'].includes(recipe.baseline.expected), recipe.id);
  }
  assert.throws(() => kitEntries({ ...all[0], source: '../outside' }), /inside the repository/);
});

test('kit first-run guides provide prerequisites and exact VS Code, Insiders and CLI roots', () => {
  for (const recipe of recipes()) {
    const entries = new Map(kitEntries(recipe).map(entry => [entry.name, entry.data]));
    const start = entries.get('KIT-START.md').toString('utf8');
    assert.ok(entries.has('.workshop/PREREQUISITES.md'), recipe.id);
    assert.ok(start.includes('[.workshop/PREREQUISITES.md](.workshop/PREREQUISITES.md)'), recipe.id);
    const commands = fencedBlocks(start).filter(block => block.language === 'bash').map(block => block.code.trim());
    assert.ok(commands.includes(`code ${recipe.workspace}`), recipe.id);
    assert.ok(commands.includes(`code-insiders ${recipe.workspace}`), recipe.id);
    assert.ok(commands.includes(`${recipe.workspace === '.' ? '' : `cd ${recipe.workspace}\n`}copilot`), recipe.id);
    if (recipe.track === 'adventures') {
      const lesson = entries.get('KIT-LESSON.md').toString('utf8');
      assert.ok(fencedBlocks(lesson).some(block => block.code.trim() === 'node verify.js'), recipe.id);
    }
  }
});

test('learner kit integrity verifier detects modification and does not expose answers', () => {
  const recipe = recipes().find(item => item.id === '13-greenfield');
  const entries = kitEntries(recipe);
  assert.ok(!entries.some(entry => entry.name.split('/').includes('reference')));
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'kit-verifier-'));
  try {
    for (const entry of entries) {
      const file = path.join(temporary, entry.name);
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, entry.data);
    }
    const args = [path.join(temporary, 'KIT-VERIFY.cjs')];
    const clean = spawnSync(process.execPath, args, { encoding: 'utf8' });
    assert.equal(clean.status, 0, clean.stdout + clean.stderr);
    fs.appendFileSync(path.join(temporary, 'subscriptions.mjs'), '\n// modified during exercise\n');
    const changed = spawnSync(process.execPath, args, { encoding: 'utf8' });
    assert.notEqual(changed.status, 0);
    assert.match(changed.stderr, /differs from its baseline/);
  } finally {
    fs.rmSync(temporary, { recursive: true });
  }
});

test('all 35 ZIPs contain complete matching manifests, lessons, assets and licenses', () => {
  const { artifacts, inventory } = buildKits();
  assert.equal(inventory.length, 35);
  for (const kit of inventory) {
    const bytes = artifacts.get(`assets/lab-kits/${kit.path}`);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), kit.sha256);
    const files = readArchive(bytes);
    const prefix = `${kit.id}/`;
    assert.ok([...files.keys()].every(name => name.startsWith(prefix)));
    for (const name of ['KIT-START.md', 'KIT-LESSON.md', 'KIT-LICENSE.txt', 'KIT-VERIFY.cjs', '.workshop/SETUP.md', '.workshop/PREREQUISITES.md']) {
      assert.ok(files.has(prefix + name), `${kit.id}: ${name}`);
    }
    assert.ok(![...files.keys()].some(name => name.split('/').includes('reference')), kit.id);
    const manifest = JSON.parse(files.get(prefix + 'KIT-MANIFEST.json'));
    assert.equal(manifest.id, kit.id);
    if (kit.track === 'adventures') assert.ok(files.has(prefix + '.workshop/RUBRIC.md'), kit.id);
    else assert.ok(files.has(prefix + '.workshop/ENVIRONMENT.md'), kit.id);
    assert.equal(files.size, manifest.files.length + 1);
    for (const entry of manifest.files) {
      const content = files.get(prefix + entry.path);
      assert.ok(content, `${kit.id}: ${entry.path}`);
      assert.equal(content.length, entry.bytes);
      assert.equal(crypto.createHash('sha256').update(content).digest('hex'), entry.sha256);
    }
    for (const [name, bytes] of files) {
      if (!name.endsWith('.md')) continue;
      for (const match of bytes.toString('utf8').matchAll(/!?\[[^\]]*]\(([^)\n]+)\)/g)) {
        const destination = match[1].replace(/\s+["'][\s\S]*$/, '');
        if (/^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(destination)) continue;
        const local = decodeURIComponent(destination.split(/[?#]/, 1)[0]);
        const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(name), local));
        assert.ok(files.has(resolved), `${name}: missing bundled link ${destination}`);
      }
    }
  }
});

test('all 35 extracted kits verify integrity and Node kits reproduce their documented baselines', async t => {
  const diagnostics = {
    'algora-skills': 'Skills of Algora verification failed:\n-',
    'automaton-foundry': 'Automaton Foundry verification failed:\n-',
    'cartographer-mcp': 'Cartographer MCP verification failed:\n-',
    'cloud-citadel': 'Cloud Citadel verification failed:\n-',
    'convergence-of-three-realms': 'Convergence verification failed:\n-',
    'eldoria-laws': 'Laws of Eldoria verification failed:\n-',
    'lumoria-graph': 'types should affect api, cli, core, docs, and types',
    'mythos-parallel': 'all tasks must start before the first task settles',
    'portals-of-nexus': 'Portals of Nexus verification failed:\n-',
    'stellaris-agents': 'Agents of Stellaris verification failed:\n-',
    'stonevale-guardrails': '"npm test" should return false',
    'tempora-loop': 'stable loop should finish with value 6',
    'terminal-gate': '"inspect src/index.js" parsed incorrectly',
    '13-greenfield': 'Exercise: implement the reviewed RSS subscription contract.'
  };
  const { artifacts } = buildKits();
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'learner kit baselines '));
  const env = { ...process.env, HANDS_ON_REFERENCE: '0' };
  // Each extracted baseline is a fresh CLI run, not a worker of this test file.
  delete env.NODE_TEST_CONTEXT;
  const run = (args, cwd) => {
    const nodeArgs = args[0] === '--test' ? ['--test', '--test-reporter=tap', ...args.slice(1)] : args;
    const result = spawnSync(process.execPath, nodeArgs, { cwd, encoding: 'utf8', timeout: 10000, env });
    assert.ifError(result.error);
    assert.equal(result.signal, null, result.stderr);
    return { status: result.status, output: result.stdout + result.stderr };
  };
  try {
    for (const recipe of recipes()) {
      const nodeBaseline = recipe.baseline.commands.every(command => command.startsWith('node '));
      await t.test(`${recipe.id}: integrity${nodeBaseline ? ' and Node baseline' : ''}`, () => {
        const archive = artifacts.get(`assets/lab-kits/${recipe.track}/${recipe.id}.zip`);
        for (const [name, bytes] of readArchive(archive)) {
          const file = path.join(temporary, name);
          fs.mkdirSync(path.dirname(file), { recursive: true });
          fs.writeFileSync(file, bytes);
        }
        const kitRoot = path.join(temporary, recipe.id);
        const integrity = run(['KIT-VERIFY.cjs'], kitRoot);
        assert.equal(integrity.status, 0, integrity.output);
        assert.match(integrity.output, /unchanged kit files/);
        if (nodeBaseline) {
          const check = result => {
            assert.doesNotMatch(result.output, /ENOENT|MODULE_NOT_FOUND|SyntaxError|Cannot find module/);
            if (recipe.baseline.expected === 'pass') {
              assert.equal(result.status, 0, result.output);
              assert.match(result.output, /(?:# tests [1-9]|verification passed)/);
            } else {
              assert.equal(result.status, 1, result.output);
              assert.ok(diagnostics[recipe.id], `Missing declared failure diagnostic: ${recipe.id}`);
              assert.ok(result.output.includes(diagnostics[recipe.id]), result.output);
            }
          };
          for (const command of recipe.baseline.commands) {
            const [runtime, ...args] = command.split(' ');
            assert.equal(runtime, 'node');
            check(run(args, path.join(kitRoot, recipe.baseline.workingDirectory)));
          }
          if (recipe.workspace === 'starter') check(run(['../verify.js'], path.join(kitRoot, 'starter')));
        }
      });
    }
  } finally {
    fs.rmSync(temporary, { recursive: true });
  }
});
