const fs = require('node:fs');
const path = require('node:path');
const { root } = require('./repository-files');
const catalog = require('../mslearn-github-copilot/catalog.json');

const nodeBaseline = (file, expected = 'pass', message = 'The supplied baseline tests pass.') => ({
  workingDirectory: '.', commands: [`node --test --test-concurrency=1 ${file}`], expected, message
});
const csharpBaseline = {
  workingDirectory: '.',
  commands: ['dotnet test tests/UnitTests/UnitTests.csproj -m:1 -p:UseSharedCompilation=false'],
  expected: 'pass', message: 'The supplied tests pass. New feature requirements still need their own tests.'
};
const pythonBaseline = {
  workingDirectory: 'library',
  commands: ['python -m unittest discover -s tests -p "test_*.py" -v'],
  expected: 'pass', message: 'The existing unittest tests are discovered and pass.'
};
const csharpBuild = name => ({
  workingDirectory: '.', commands: [`dotnet build ${name}.csproj -m:1 -p:UseSharedCompilation=false`],
  expected: 'pass', message: 'The selected project builds. Compilation alone does not prove behavior.'
});
const baselines = {
  '01-interface': nodeBaseline('greeting.test.mjs'),
  '02-csharp': csharpBaseline, '03-csharp': csharpBaseline,
  '04-xunit': csharpBaseline, '05-csharp': csharpBaseline,
  '02-python': pythonBaseline, '03-python': pythonBaseline,
  '04-pytest': pythonBaseline, '05-python': pythonBaseline,
  '06-prototype': nodeBaseline('cart.test.mjs'),
  '07-duplication': csharpBuild('ECommerceOrderAndReturn'),
  '08-functions': {
    workingDirectory: '.',
    commands: ['dotnet build src/ECommerce.Console/ECommerce.Console.csproj -m:1 -p:UseSharedCompilation=false'],
    expected: 'pass', message: 'The console entry project builds; compensation behavior needs separate assertions.'
  },
  '09-conditionals': csharpBuild('ECommercePricingEngine'),
  '10-profiling': csharpBuild('DataAnalyzerReporter'),
  '11-issues': nodeBaseline('pricing.test.mjs'),
  '12-secrets': nodeBaseline('policy.test.mjs'),
  '13-greenfield': nodeBaseline('contract.test.mjs', 'intentional-failure', 'The unfinished RSS store fails with the documented exercise error. A missing runtime or syntax error is not the expected failure.'),
  '14-brownfield': nodeBaseline('baseline.test.mjs'),
  '15-customization': nodeBaseline('inventory.test.mjs'),
  '16-sdk': nodeBaseline('app.test.mjs'),
  '17-modernization': {
    workingDirectory: '.', commands: ['python -m unittest test_legacy -v'],
    expected: 'pass', message: 'The CSV characterization tests pass. The separate modernization suite intentionally fails until implementation.'
  }
};

function recipes() {
  const handsOn = catalog.labs.filter(lab => lab.fixture).map(lab => {
    if (!baselines[lab.id]) throw new Error(`Missing kit baseline: ${lab.id}`);
    return {
      id: lab.id, track: 'hands-on', title: lab.title, runtime: lab.stack,
      source: `mslearn-github-copilot/${lab.fixture}`,
      guide: `mslearn-github-copilot/Instructions/Labs/${lab.file}`,
      workspace: '.', baseline: baselines[lab.id],
      license: 'mslearn-github-copilot/LICENSE'
    };
  });
  const adventures = [];
  const directory = path.join(root, 'adventures');
  for (const level of fs.readdirSync(directory).sort()) {
    const levelPath = path.join(directory, level);
    if (!fs.statSync(levelPath).isDirectory()) continue;
    for (const id of fs.readdirSync(levelPath).sort()) {
      const guide = `adventures/${level}/${id}/README.md`;
      const filename = path.join(root, guide);
      if (!fs.existsSync(filename)) continue;
      const text = fs.readFileSync(filename, 'utf8');
      const title = text.match(/^title: "([^"]+)"$/m)?.[1];
      if (!title) throw new Error(`Adventure has no kit title: ${guide}`);
      adventures.push({
        id, track: 'adventures', title, runtime: 'Node 24; live integrations are optional',
        source: `labs/${id}`, guide, workspace: 'starter',
        baseline: {
          workingDirectory: '.', commands: ['node verify.js'],
          expected: id === 'context-mirrors' ? 'pass' : 'intentional-failure',
          message: id === 'context-mirrors'
            ? 'The supplied sequence baseline passes. Run a fresh copy for each context experiment.'
            : 'The verifier rejects the unfinished starter. Record its specific diagnostics before implementing the mission.'
        },
        license: 'LICENSE'
      });
    }
  }
  return [...handsOn, ...adventures].sort((a, b) => `${a.track}/${a.id}`.localeCompare(`${b.track}/${b.id}`, 'en'));
}

module.exports = { recipes };
