import test from 'node:test';
import assert from 'node:assert/strict';
import { shippingCents } from './pricing.mjs';

test('charges below threshold and is free above it', () => {
  assert.equal(shippingCents(4999), 500);
  assert.equal(shippingCents(5001), 0);
});
test('rejects invalid subtotals', () => {
  for (const value of [-1, 1.5, NaN, Infinity, '5000', null]) {
    assert.throws(() => shippingCents(value), RangeError);
  }
});
