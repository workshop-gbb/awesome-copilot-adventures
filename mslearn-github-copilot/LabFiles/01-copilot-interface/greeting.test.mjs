import test from 'node:test';
import assert from 'node:assert/strict';
import { greeting } from './greeting.mjs';

test('formats a name', () => assert.equal(greeting('Ada'), 'Welcome, Ada!'));
test('rejects blank and non-string input', () => {
  for (const value of ['', '   ', null, 42]) assert.throws(() => greeting(value), TypeError);
});
