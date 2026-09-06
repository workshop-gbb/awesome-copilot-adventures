import test from 'node:test';
import assert from 'node:assert/strict';
import { stages, validateResponse } from './policy.mjs';

const plan = () => ({ simulation: true, steps: stages.map(id => ({ id, evidence: `Owner-reviewed simulation evidence for ${id}.` })) });
test('accepts a complete simulation', () => assert.equal(validateResponse(plan()), true));
test('rejects early closure and missing evidence', () => {
  const early = plan();
  [early.steps[1], early.steps[5]] = [early.steps[5], early.steps[1]];
  assert.throws(() => validateResponse(early), /revoke/);
  const missing = plan();
  missing.steps[1].evidence = '';
  assert.throws(() => validateResponse(missing), /evidence/);
  assert.throws(() => validateResponse({ ...plan(), simulation: false }), /simulation/);
});
