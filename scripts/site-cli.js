const path = require('node:path');
const { spawnSync } = require('node:child_process');

const [command, ...arguments_] = process.argv.slice(2);
if (!['build', 'check', 'dev', 'preview'].includes(command)) throw new Error('Expected build, check, dev or preview.');

const binary = path.join(path.dirname(require.resolve('astro/package.json')), require('astro/package.json').bin.astro);
const result = spawnSync(process.execPath, [binary, command, ...arguments_], {
  stdio: 'inherit',
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: '1',
    RAYON_NUM_THREADS: process.env.RAYON_NUM_THREADS || '1',
    NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=768'
  }
});
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
