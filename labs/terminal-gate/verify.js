const path = require('node:path');

try {
  const { parseCommand } = require(path.join(__dirname, 'starter', 'command.js'));
  const valid = [
    ['inspect src/index.js', { action: 'inspect', target: 'src/index.js' }],
    [' verify test/run.js ', { action: 'verify', target: 'test/run.js' }]
  ];
  const invalid = [
    '', 'deploy src', 'inspect', 'inspect a b', 'inspect ../secret',
    'verify /etc/passwd', 'verify test.js;echo hi', 'inspect $(pwd)',
    'inspect src/a.js & whoami', 'inspect src/a.js | cat',
    'verify test.js > result.txt', 'verify test.js < input.txt',
    'inspect `pwd`', 'inspect src/a.js\nwhoami',
    'inspect "src/a.js"', "inspect 'src/a.js'", null
  ];
  const failures = [];
  for (const [input, expected] of valid) {
    try {
      if (JSON.stringify(parseCommand(input)) !== JSON.stringify(expected)) failures.push(`${JSON.stringify(input)} parsed incorrectly`);
    } catch (error) {
      failures.push(`${JSON.stringify(input)} unexpectedly threw: ${error.message}`);
    }
  }
  for (const input of invalid) {
    let rejected = false;
    try {
      parseCommand(input);
    } catch {
      rejected = true;
    }
    if (!rejected) failures.push(`${JSON.stringify(input)} should be rejected`);
  }

  if (failures.length) {
    console.error(`Terminal Gate verification failed:\n- ${failures.join('\n- ')}`);
    process.exit(1);
  }
  console.log('Terminal Gate verification passed: only safe inspect and verify commands cross the gate.');
} catch (error) {
  console.error(`Terminal Gate verification failed: ${error.message}`);
  process.exit(1);
}
