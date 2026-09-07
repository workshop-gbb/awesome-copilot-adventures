const categories = [{ id: 'equipment', name: 'Equipment' }];
export const items = Object.freeze([
  Object.freeze({ sku: 'LAB-001', categoryId: 'equipment', name: 'Keyboard', quantity: 3 }),
  Object.freeze({ sku: 'LAB-002', categoryId: 'equipment', name: 'Monitor', quantity: 2 })
]);

export function listCategories() {
  return categories.map(category => ({ ...category }));
}
