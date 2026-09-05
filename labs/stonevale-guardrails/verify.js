const path = require('node:path');

try {
  const { isAllowed } = require(path.join(__dirname, 'starter', 'guard.js'));
  const cases = [
    ['node verify.js', true],
    ['node test.js', true],
    [' node   verify.js ', true],
    ['npm test', false],
    ['node ../verify.js', false],
    ['node /opt/test.js', false],
    [String.raw`node C:\work\test.js`, false],
    [String.raw`node \\server\share\test.js`, false],
    [String.raw`node ..\verify.js`, false],
    ['node verify.js; echo unsafe', false],
    ['node verify.js & whoami', false],
    ['node verify.js && echo unsafe', false],
    ['node verify.js || echo unsafe', false],
    ['node verify.js | cat', false],
    ['node $(echo test.js)', false],
    ['node `echo test.js`', false],
    ['node test.js > result.txt', false],
    ['node test.js < input.txt', false],
    ['node test.js\nwhoami', false],
    ['node test.js\r\nwhoami', false],
    ['node verify.js extra-argument', false],
    ['', false],
    [null, false]
  ];
  const failures = cases
    .filter(([command, expected]) => isAllowed(command) !== expected)
    .map(([command, expected]) => `${JSON.stringify(command)} should return ${expected}`);

  if (failures.length) {
    console.error(`Stonevale Guardrails verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Stonevale Guardrails verification passed: unsafe command forms are rejected.');
} catch (error) {
  console.error(`Stonevale Guardrails verification failed: ${error.message}`);
  process.exit(1);
}
