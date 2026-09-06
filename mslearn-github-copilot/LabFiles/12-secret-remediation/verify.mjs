import fs from 'node:fs';
import { validateResponse } from './policy.mjs';

try {
  validateResponse(JSON.parse(fs.readFileSync(new URL('./response.json', import.meta.url), 'utf8')));
  console.log('Simulation plan validated. No credential, provider, or GitHub service was contacted.');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
