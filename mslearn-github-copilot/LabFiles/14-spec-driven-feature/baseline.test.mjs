import test from 'node:test';
import assert from 'node:assert/strict';

const { createDashboard } = await import(process.env.HANDS_ON_REFERENCE === '1' ? './reference/dashboard.mjs' : './dashboard.mjs');
test('existing health and project contracts are unchanged', () => {
  const dashboard = createDashboard();
  assert.deepEqual(dashboard.health(), { status: 'ok' });
  assert.deepEqual(dashboard.projects(), [{ id: 'project-1', name: 'Training dashboard' }]);
  dashboard.projects()[0].name = 'caller change';
  assert.equal(dashboard.projects()[0].name, 'Training dashboard');
});
