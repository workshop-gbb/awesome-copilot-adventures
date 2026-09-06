import test from 'node:test';
import assert from 'node:assert/strict';

const variant = process.env.HANDS_ON_REFERENCE ?? '0';
if (!['0', '1', 'typescript'].includes(variant)) throw new Error('HANDS_ON_REFERENCE must be 0, 1, or typescript.');
const source = variant === 'typescript' ? './reference/typescript/subscriptions.ts'
  : variant === '1' ? './reference/subscriptions.mjs' : './subscriptions.mjs';
const { createStore } = await import(source);

test('RSS-1: add and list stable IDs without network access', () => {
  const store = createStore();
  assert.deepEqual(store.list(), []);
  assert.deepEqual(store.add(' https://EXAMPLE.test/feed#news '), { id: 'feed-1', url: 'https://example.test/feed' });
  assert.equal(store.add('https://example.test/other').id, 'feed-2');
  assert.equal(store.list().length, 2);
});
test('RSS-2: reject normalized duplicates', () => {
  const store = createStore();
  store.add('https://example.test/feed');
  assert.throws(() => store.add(' https://EXAMPLE.test/feed#top '), { code: 'DUPLICATE_FEED' });
  assert.equal(store.list().length, 1);
});
test('RSS-3: invalid input does not change the store', () => {
  const store = createStore();
  for (const value of ['', ' ', null, 1, 'not a URL', 'file:///etc/passwd', 'https://user:pass@example.test/feed']) {
    assert.throws(() => store.add(value), TypeError);
  }
  assert.deepEqual(store.list(), []);
});
test('RSS-4: callers cannot mutate stored records', () => {
  const store = createStore();
  const item = store.add('https://example.test/feed');
  item.url = 'changed';
  const list = store.list();
  list[0].url = 'changed again';
  list.length = 0;
  assert.deepEqual(store.list(), [{ id: 'feed-1', url: 'https://example.test/feed' }]);
});
