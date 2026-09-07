import test from 'node:test';
import assert from 'node:assert/strict';
import { orderLookup } from './catalog.mjs';
import { answer, sessionOptions } from './app.mjs';

function fakeClient(operation) {
  const calls = [];
  return {
    calls,
    async createSession(options) {
      calls.push(['create', options]);
      return {
        async sendAndWait(message, timeout) { calls.push(['send', timeout]); return operation(options, message); },
        async disconnect() { calls.push(['disconnect']); }
      };
    },
    async stop() { calls.push(['stop']); return []; }
  };
}

test('lookup validates arguments and isolates actors', () => {
  const lookup = orderLookup('fixture-alice');
  assert.deepEqual(lookup({ orderId: 'ORD-1' }), { id: 'ORD-1', status: 'shipped', totalCents: 1200 });
  assert.throws(() => lookup({ orderId: 'ORD-2' }), /not available/);
  assert.throws(() => lookup({ orderId: 'ORD-999' }), /not available/);
  assert.throws(() => lookup({ orderId: 'ORD-2', actorId: 'fixture-bob' }), TypeError);
  assert.throws(() => lookup({ orderId: '../file' }), TypeError);
  assert.throws(() => orderLookup('unknown'), TypeError);
});
test('session exposes only the local tool and denies extra permissions', () => {
  const options = sessionOptions('fixture-alice');
  assert.deepEqual(options.availableTools, ['custom:lookup_order']);
  assert.equal(options.onPermissionRequest({ kind: 'shell' }).kind, 'reject');
  assert.equal(options.tools.length, 1);
});
test('orchestration returns content and cleans up in order', async () => {
  const client = fakeClient(options => {
    const order = options.tools[0].handler({ orderId: 'ORD-1' });
    return { data: { content: `Order status: ${order.status}` } };
  });
  assert.equal(await answer(client, ' Status? ', 'fixture-alice'), 'Order status: shipped');
  assert.deepEqual(client.calls.map(call => call[0]), ['create', 'send', 'disconnect', 'stop']);
  assert.equal(client.calls[1][1], 15000);
});
test('request failure is propagated and cleanup still runs', async () => {
  const client = fakeClient(() => { throw new Error('controlled tool failure'); });
  await assert.rejects(answer(client, 'Status?', 'fixture-alice'), /controlled tool failure/);
  assert.deepEqual(client.calls.slice(-2).map(call => call[0]), ['disconnect', 'stop']);
});
test('empty answers and invalid prompts are not success', async () => {
  await assert.rejects(answer(fakeClient(() => undefined), 'Status?', 'fixture-alice'), /no assistant/);
  const client = fakeClient(() => assert.fail('No session should run'));
  await assert.rejects(answer(client, '', 'fixture-alice'), TypeError);
  assert.deepEqual(client.calls.map(call => call[0]), ['stop']);
});
test('cleanup failures are surfaced', async () => {
  const client = fakeClient(() => ({ data: { content: 'OK' } }));
  client.stop = async () => [new Error('cleanup failure')];
  await assert.rejects(answer(client, 'Status?', 'fixture-alice'), /cleanup failure/);
});
