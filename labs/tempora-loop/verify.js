const path = require('node:path');

try {
  const { refine } = require(path.join(__dirname, 'starter', 'loop.js'));
  const stable = refine(0, (value) => Math.min(value + 2, 6), 10);
  const bounded = refine('a', (value) => `${value}a`, 3);

  const checks = [
    [stable.value === 6, 'stable loop should finish with value 6'],
    [stable.iterations === 4, 'stable loop should report four step calls'],
    [stable.stable === true, 'stable loop should report stable=true'],
    [bounded.value === 'aaaa', 'bounded loop should retain the final value'],
    [bounded.iterations === 3, 'bounded loop should stop at maxIterations'],
    [bounded.stable === false, 'bounded loop should report stable=false']
  ];

  for (const invalid of [0, -1, 1.5, '3', NaN, Infinity]) {
    let rejected = false;
    try {
      refine(0, value => value, invalid);
    } catch {
      rejected = true;
    }
    checks.push([rejected, `maxIterations=${JSON.stringify(invalid)} should throw`]);
  }

  let invalidStepRejected = false;
  try {
    refine(0, null, 3);
  } catch {
    invalidStepRejected = true;
  }
  checks.push([invalidStepRejected, 'a non-function step should throw']);

  const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);
  if (failures.length) {
    console.error(`Tempora Loop verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Tempora Loop verification passed: the loop is stable, bounded, and validated.');
} catch (error) {
  console.error(`Tempora Loop verification failed: ${error.message}`);
  process.exit(1);
}
