import { getInitialProducts, getLocalOrders, saveLocalOrder } from '../data/productsData';

const API_BASE = '/api';

export const api = {
  // Fetch all products with query parameters
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
          query.append(key, params[key]);
        }
      });

      const response = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!response.ok) throw new Error('Network error');
      const data = await response.json();
      return data.data;
    } catch (error) {
      // Robust client-side fallback
      const all = getInitialProducts();
      return all.filter(p => {
        if (params.category && params.category !== 'All' && p.category.toLowerCase() !== params.category.toLowerCase()) return false;
        if (params.gender && params.gender !== 'All' && p.gender.toLowerCase() !== params.gender.toLowerCase()) return false;
        if (params.search && !p.name.toLowerCase().includes(params.search.toLowerCase())) return false;
        if (params.hangerOnly === 'true' && !p.isHangerItem) return false;
        return true;
      });
    }
  },

  // Fetch product by ID
  async getProductById(id) {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      return data.data;
    } catch (error) {
      const all = getInitialProducts();
      return all.find(p => p.id === id) || all[0];
    }
  },

  // Fetch categories
  async getCategories() {
    try {
      const response = await fetch(`${API_BASE}/products/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data.data;
    } catch (error) {
      return {
        categories: ['All', 'Clothing', 'Accessories', 'Footwear', 'Backpack'],
        genders: ['All', 'Men', 'Women']
      };
    }
  },

  // Create an order
  async createOrder(orderData) {
    const orderNumber = `NV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      customer: orderData.customer,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shippingCost: orderData.shippingCost,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod || 'Cash on Delivery',
      deliveryMethod: 'Standard Delivery',
      status: 'Confirmed'
    };

    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (response.ok) {
        const data = await response.json();
        saveLocalOrder(data.data);
        return data.data;
      }
    } catch (e) {
      // Fallback
    }

    saveLocalOrder(newOrder);
    return newOrder;
  },

  // Get orders
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE}/orders`);
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (e) {
      // Fallback
    }
    return getLocalOrders();
  }
};
