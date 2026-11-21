import productsJson from './products.json';

// Local storage key for persistent client-side edits/orders
const STORAGE_KEY_PRODUCTS = 'novae_products_data';
const STORAGE_KEY_ORDERS = 'novae_orders_data';

export const getInitialProducts = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading from localStorage', e);
  }
  return productsJson;
};

export const saveProductsToLocal = (products) => {
  try {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  } catch (e) {
    console.error('Error saving products to local storage', e);
  }
};

export const getLocalOrders = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_ORDERS);
    return saved ? JSON.parse(saved) : [
      {
        id: 'ord_sample_101',
        orderNumber: 'NV-2120',
        createdAt: new Date().toISOString(),
        customer: {
          fullName: 'Asad Bilal',
          phone: '0300-1234567',
          email: 'asad@example.com',
          city: 'Multan',
          address: 'Model Town Phase 2'
        },
        items: [
          {
            id: 'nv-101',
            name: 'Classic Oversized Shirt',
            price: 2498,
            quantity: 1,
            size: 'M',
            color: 'Ecru Beige',
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=500&q=80'
          }
        ],
        subtotal: 2498,
        shippingCost: 200,
        total: 2698,
        paymentMethod: 'Cash on Delivery',
        status: 'In Transit'
      }
    ];
  } catch {
    return [];
  }
};

export const saveLocalOrder = (order) => {
  try {
    const orders = getLocalOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
    return orders;
  } catch (e) {
    console.error('Error saving local order', e);
    return [];
  }
};
