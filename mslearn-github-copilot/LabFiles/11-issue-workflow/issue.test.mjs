import test from 'node:test';
import assert from 'node:assert/strict';
import { shippingCents } from './pricing.mjs';

test('orders at the advertised threshold receive free shipping', () => {
  assert.equal(shippingCents(5000), 0);
});
