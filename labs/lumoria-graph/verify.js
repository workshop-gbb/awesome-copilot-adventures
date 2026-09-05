const path = require('node:path');

try {
  const { affectedBy } = require(path.join(__dirname, 'starter', 'graph.js'));
  const graph = {
    api: ['core'],
    cli: ['core'],
    core: ['types'],
    docs: ['api'],
    types: []
  };
  const cycle = { a: ['b'], b: ['a'], c: ['b'] };
  const failures = [];
  if (JSON.stringify(affectedBy(graph, 'types')) !== JSON.stringify(['api', 'cli', 'core', 'docs', 'types'])) {
    failures.push('types should affect api, cli, core, docs, and types');
  }
  if (JSON.stringify(affectedBy(graph, 'api')) !== JSON.stringify(['api', 'docs'])) {
    failures.push('api should affect api and docs');
  }
  if (JSON.stringify(affectedBy(cycle, 'a')) !== JSON.stringify(['a', 'b', 'c'])) {
    failures.push('cycle traversal should terminate with unique sorted nodes');
  }
  let rejected = false;
  try {
    affectedBy(graph, 'missing');
  } catch {
    rejected = true;
  }
  if (!rejected) failures.push('unknown starting nodes should throw');

  if (failures.length) {
    console.error(`Lumoria Graph verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Lumoria Graph verification passed: dependency impact is complete and cycle-safe.');
} catch (error) {
  console.error(`Lumoria Graph verification failed: ${error.message}`);
  process.exit(1);
}
