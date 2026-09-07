import { orderLookup } from './catalog.mjs';

export function sessionOptions(actorId) {
  return {
    model: 'auto',
    availableTools: ['custom:lookup_order'],
    onPermissionRequest: () => ({ kind: 'reject', feedback: 'Additional permissions are outside this read-only lab.' }),
    tools: [{
      name: 'lookup_order',
      description: 'Read one synthetic order for the actor already established by the application.',
      parameters: {
        type: 'object',
        properties: { orderId: { type: 'string', pattern: '^ORD-\\d+$' } },
        required: ['orderId'],
        additionalProperties: false
      },
      handler: orderLookup(actorId)
    }],
    systemMessage: { mode: 'append', content: 'Use only the synthetic order lookup. Do not claim refunds, emails or other actions occurred. Surface lookup errors.' }
  };
}

export async function answer(client, prompt, actorId) {
  let session;
  let result;
  const errors = [];
  try {
    if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 1000) {
      throw new TypeError('Prompt must contain 1 to 1000 characters.');
    }
    session = await client.createSession(sessionOptions(actorId));
    const message = await session.sendAndWait({ prompt: prompt.trim() }, 15000);
    if (typeof message?.data?.content !== 'string' || !message.data.content.trim()) {
      throw new Error('The runtime returned no assistant content.');
    }
    result = message.data.content;
  } catch (error) {
    errors.push(error);
  } finally {
    if (session) {
      try { await session.disconnect(); } catch (error) { errors.push(error); }
    }
    try {
      const cleanupErrors = await client.stop();
      if (Array.isArray(cleanupErrors)) errors.push(...cleanupErrors);
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length === 1) throw errors[0];
  if (errors.length > 1) throw new AggregateError(errors, 'Request and/or cleanup failed.');
  return result;
}
