import test from 'node:test';
import assert from 'node:assert/strict';

const { createDashboard } = await import(process.env.HANDS_ON_REFERENCE === '1' ? './reference/dashboard.mjs' : './dashboard.mjs');
const alice = { id: 'staff-1' };
const bob = { id: 'staff-2' };

test('DOC-2: register metadata and scope the list to the trusted actor', () => {
  const dashboard = createDashboard();
  const document = dashboard.addDocument({ projectId: 'project-1', title: ' Design notes ' }, alice);
  assert.deepEqual(document, { id: 'doc-1', projectId: 'project-1', title: 'Design notes', ownerId: 'staff-1' });
  assert.deepEqual(dashboard.documents('project-1', alice), [document]);
  assert.deepEqual(dashboard.documents('project-1', bob), []);
});
test('DOC-3: reject invalid project/title, missing actor and owner spoofing', () => {
  const dashboard = createDashboard();
  assert.throws(() => dashboard.addDocument({ projectId: 'missing', title: 'Notes' }, alice), RangeError);
  for (const title of ['', ' ', null, 'x'.repeat(121)]) {
    assert.throws(() => dashboard.addDocument({ projectId: 'project-1', title }, alice), TypeError);
  }
  assert.throws(() => dashboard.addDocument({ projectId: 'project-1', title: 'Notes' }, null), TypeError);
  assert.throws(() => dashboard.addDocument({ projectId: 'project-1', title: 'Notes', ownerId: 'staff-2' }, alice), TypeError);
  assert.deepEqual(dashboard.documents('project-1', alice), []);
});
test('DOC-4: external mutation never changes stored metadata', () => {
  const dashboard = createDashboard();
  const result = dashboard.addDocument({ projectId: 'project-1', title: 'Notes' }, alice);
  result.title = 'changed';
  const listed = dashboard.documents('project-1', alice);
  listed[0].ownerId = bob.id;
  assert.equal(dashboard.documents('project-1', alice)[0].title, 'Notes');
  assert.deepEqual(dashboard.documents('project-1', bob), []);
});
