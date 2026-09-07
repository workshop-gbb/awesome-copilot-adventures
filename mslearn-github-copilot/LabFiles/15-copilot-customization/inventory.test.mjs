import test from 'node:test';
import assert from 'node:assert/strict';
import { listCategories, items } from './inventory.mjs';

test('existing category contract is stable and isolated', () => {
  assert.deepEqual(listCategories(), [{ id: 'equipment', name: 'Equipment' }]);
  listCategories()[0].name = 'modified by caller';
  assert.equal(listCategories()[0].name, 'Equipment');
});
test('synthetic inventory records have valid quantities and categories', () => {
  const ids = new Set(listCategories().map(category => category.id));
  for (const item of items) {
    assert.ok(ids.has(item.categoryId));
    assert.ok(Number.isInteger(item.quantity) && item.quantity >= 0);
  }
});
