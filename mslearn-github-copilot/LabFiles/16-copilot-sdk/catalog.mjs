const orders = Object.freeze([
  Object.freeze({ id: 'ORD-1', actorId: 'fixture-alice', status: 'shipped', totalCents: 1200 }),
  Object.freeze({ id: 'ORD-2', actorId: 'fixture-bob', status: 'pending', totalCents: 2400 })
]);

export function orderLookup(actorId) {
  if (!['fixture-alice', 'fixture-bob'].includes(actorId)) throw new TypeError('A trusted fixture actor is required.');
  return args => {
    if (!args || typeof args !== 'object' || Array.isArray(args)
        || Object.keys(args).length !== 1 || typeof args.orderId !== 'string' || !/^ORD-\d+$/.test(args.orderId)) {
      throw new TypeError('Supply only a valid orderId.');
    }
    const order = orders.find(item => item.id === args.orderId && item.actorId === actorId);
    if (!order) throw new Error('Order not available for this actor.');
    return { id: order.id, status: order.status, totalCents: order.totalCents };
  };
}
