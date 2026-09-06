export const products = Object.freeze([
  Object.freeze({ id: 'apple', name: 'Apple', priceCents: 125 }),
  Object.freeze({ id: 'banana', name: 'Banana', priceCents: 80 }),
  Object.freeze({ id: 'cherries', name: 'Cherries', priceCents: 240 })
]);

export function summarizeCart(lines) {
  if (!Array.isArray(lines)) throw new TypeError('Cart lines must be an array.');
  const seen = new Set();
  const items = lines.map(line => {
    if (!line || typeof line !== 'object') throw new TypeError('A cart line is required.');
    const product = products.find(item => item.id === line.productId);
    if (!product) throw new RangeError('Unknown product.');
    if (seen.has(product.id)) throw new RangeError('Combine quantities for the same product.');
    if (!Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 99) {
      throw new RangeError('Quantity must be an integer from 1 to 99.');
    }
    seen.add(product.id);
    return { ...product, quantity: line.quantity, totalCents: product.priceCents * line.quantity };
  });
  return { items, totalCents: items.reduce((sum, item) => sum + item.totalCents, 0) };
}
