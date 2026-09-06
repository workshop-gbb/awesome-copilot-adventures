import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeCart } from './cart.mjs';

test('uses integer cents and preserves input', () => {
  const input = [{ productId: 'apple', quantity: 2 }, { productId: 'banana', quantity: 1 }];
  const original = structuredClone(input);
  assert.equal(summarizeCart(input).totalCents, 330);
  assert.deepEqual(input, original);
  assert.equal(summarizeCart([]).totalCents, 0);
});

test('rejects invalid quantities, duplicate lines and unknown products', () => {
  for (const quantity of [0, -1, 1.5, 100, '', null, '2']) {
    assert.throws(() => summarizeCart([{ productId: 'apple', quantity }]), RangeError);
  }
  assert.throws(() => summarizeCart([{ productId: 'unknown', quantity: 1 }]), RangeError);
  assert.throws(() => summarizeCart([{ productId: 'apple', quantity: 1 }, { productId: 'apple', quantity: 1 }]), RangeError);
  assert.throws(() => summarizeCart(null), TypeError);
});
