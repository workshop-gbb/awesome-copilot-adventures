const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { spawnSync } = require('node:child_process');
const { prepare, parseArguments } = require('./prepare-hands-on');
const { root } = require('./repository-files');
const { fencedBlocks } = require('./markdown-helpers');

const fixtures = path.join(root, 'mslearn-github-copilot/LabFiles');
function fixtureEnvironment(variant = '0') {
  const env = { ...process.env, HANDS_ON_REFERENCE: variant };
  // A nested CLI invocation is a new test run, not a node:test worker of this file.
  delete env.NODE_TEST_CONTEXT;
  return env;
}
const cases = [
  ['01-copilot-interface', ['greeting.test.mjs']],
  ['06-shopping-prototype', ['cart.test.mjs']],
  ['11-issue-workflow', ['pricing.test.mjs']],
  ['12-secret-remediation', ['policy.test.mjs']],
  ['14-spec-driven-feature', ['baseline.test.mjs']],
  ['15-copilot-customization', ['inventory.test.mjs']],
  ['16-copilot-sdk', ['app.test.mjs']]
];

for (const [directory, files] of cases) {
  test(`baseline contracts: ${directory}`, () => {
    const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', '--test-concurrency=1', ...files], {
      cwd: path.join(fixtures, directory), encoding: 'utf8', timeout: 20000, env: fixtureEnvironment()
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /(?:pass [1-9]|tests [1-9])/);
  });
}

for (const [directory, files, message] of [
  ['11-issue-workflow', ['issue.test.mjs'], /500\s*!==\s*0/],
  ['13-spec-driven-development', ['contract.test.mjs'], /Exercise: implement the reviewed RSS/],
  ['14-spec-driven-feature', ['feature.test.mjs'], /Exercise: implement document metadata/]
]) {
  test(`intentional starter failure: ${directory}`, () => {
    const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', '--test-concurrency=1', ...files], {
      cwd: path.join(fixtures, directory), encoding: 'utf8', timeout: 20000,
      env: fixtureEnvironment()
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stdout + result.stderr, message);
  });
}

for (const [directory, files, variant] of [
  ['13-spec-driven-development', ['contract.test.mjs'], '1'],
  ['13-spec-driven-development', ['contract.test.mjs'], 'typescript'],
  ['14-spec-driven-feature', ['baseline.test.mjs', 'feature.test.mjs'], '1']
]) {
  test(`instructor reference: ${directory} (${variant})`, () => {
    const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', '--test-concurrency=1', ...files], {
      cwd: path.join(fixtures, directory), encoding: 'utf8', timeout: 20000,
      env: fixtureEnvironment(variant)
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /# tests [1-9]/);
  });
}

test('issue reference detects the intended equality repair', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'hands-on-issue-'));
  try {
    fs.cpSync(path.join(fixtures, '11-issue-workflow'), temporary, { recursive: true });
    const file = path.join(temporary, 'pricing.mjs');
    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('subtotalCents > 5000', 'subtotalCents >= 5000'));
    const result = spawnSync(process.execPath, ['--test', '--test-reporter=tap', '--test-concurrency=1', 'pricing.test.mjs', 'issue.test.mjs'], {
      cwd: temporary, encoding: 'utf8', timeout: 20000, env: fixtureEnvironment()
    });
    assert.equal(result.status, 0, result.stdout + result.stderr);
    assert.match(result.stdout, /# tests [1-9]/);
  } finally {
    fs.rmSync(temporary, { recursive: true });
  }
});

test('preparation refuses overwrite and omits instructor answers', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'hands-on-prepare-'));
  const destination = path.join(temporary, 'exercise');
  try {
    prepare({ id: '13-greenfield', destination });
    assert.ok(fs.existsSync(path.join(destination, 'subscriptions.mjs')));
    assert.ok(fs.existsSync(path.join(destination, 'HANDS-ON-LICENSE.txt')));
    assert.ok(!fs.existsSync(path.join(destination, 'reference')));
    const before = fs.readFileSync(path.join(destination, 'subscriptions.mjs'), 'utf8');
    assert.throws(() => prepare({ id: '13-greenfield', destination }), /overwrite/);
    assert.equal(fs.readFileSync(path.join(destination, 'subscriptions.mjs'), 'utf8'), before);
    assert.throws(() => prepare({ id: 'unknown', destination }), /Unknown lab/);
    assert.throws(() => prepare({ id: 'setup-python', destination }), /no fixture/);
    assert.throws(() => prepare({ id: '13-greenfield', destination: path.join(root, 'exercise-copy') }), /outside/);
    assert.throws(() => parseArguments(['--lab']), /Usage/);
  } finally {
    fs.rmSync(temporary, { recursive: true });
  }
});

test('fence parser ignores nested examples and rejects unclosed blocks', () => {
  assert.equal(fencedBlocks('````markdown\n```mermaid\nflowchart LR\n```\n````').length, 1);
  assert.throws(() => fencedBlocks('```mermaid\nflowchart LR'), /Unclosed/);
});
