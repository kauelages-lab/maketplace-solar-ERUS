import productsJson from './products.json';
import suppliersJson from './suppliers.json';

export const STATIC_PRODUCTS = productsJson;
export const STATIC_SUPPLIERS = suppliersJson;

export const getSubsystemsList = (products = STATIC_PRODUCTS) => {
  const counts = {};
  products.forEach(p => {
    counts[p.subsystem] = (counts[p.subsystem] || 0) + 1;
  });
  return Object.entries(counts).map(([name, count]) => ({
    name,
    count
  }));
};
