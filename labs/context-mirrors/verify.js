const { spawnSync } = require('child_process');
const path = require('path');

const starter = path.join(__dirname, 'starter');
const result = spawnSync(process.execPath, ['test.js'], {
  cwd: starter,
  encoding: 'utf8'
});

process.stdout.write(result.stdout);
process.stderr.write(result.stderr);

if (result.status !== 0) {
  console.error('Context Mirrors starter verification failed.');
  process.exit(result.status || 1);
}

console.log('Context Mirrors starter verification passed.');
