import { getInitialProducts, getLocalOrders, saveLocalOrder, saveProductsToLocal } from '../data/productsData';

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

  // Add a review to a product
  async addReview(productId, reviewData) {
    try {
      const response = await fetch(`${API_BASE}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (e) {
      console.warn('API review endpoint unavailable, using local review fallback', e);
    }

    return {
      id: `rev_${Date.now()}`,
      author: reviewData.author || 'Verified Patron',
      rating: Number(reviewData.rating) || 5,
      comment: reviewData.comment || 'Exceptional craftsmanship and drape.',
      fit: reviewData.fit || 'True to size',
      createdAt: new Date().toISOString()
    };
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
      console.warn('Backend order creation offline, saved to client storage', e);
    }

    saveLocalOrder(newOrder);
    return newOrder;
  },

  // Get all orders
  async getOrders() {
    try {
      const response = await fetch(`${API_BASE}/orders`);
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (e) {
      console.warn('Backend orders fetch failed, reading from local', e);
    }
    return getLocalOrders();
  },

  // Get orders for a specific customer
  async getCustomerOrders(email) {
    if (!email) return this.getOrders();
    try {
      const response = await fetch(`${API_BASE}/orders/customer/${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          return data.data;
        }
      }
    } catch (e) {
      console.warn('Backend customer orders fetch failed, filtering local', e);
    }
    const all = getLocalOrders();
    const filtered = all.filter(o => o.customer?.email?.toLowerCase() === email.toLowerCase());
    return filtered.length > 0 ? filtered : all;
  },

  // Update order status
  async updateOrderStatus(orderId, status) {
    try {
      const response = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (e) {
      console.warn('Backend order status update failed', e);
    }
    return null;
  },

  // Admin stats
  async getAdminStats() {
    try {
      const response = await fetch(`${API_BASE}/admin/analytics`);
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (e) {
      console.warn('Admin stats endpoint failed', e);
    }
    return null;
  },

  // Get registered users/customers
  async getUsers() {
    try {
      const response = await fetch(`${API_BASE}/admin/users`);
      if (response.ok) {
        const data = await response.json();
        return data.data;
      }
    } catch (e) {
      console.warn('Users endpoint failed, providing default customers', e);
    }
    return [
      {
        id: 'usr_101',
        fullName: 'Asad Bilal',
        email: 'asad@example.com',
        phone: '0300-1234567',
        city: 'Multan',
        address: 'Model Town Phase 2, Street 7',
        registeredAt: '2026-11-15T10:00:00.000Z',
        totalSpent: 5196,
        totalOrders: 2,
        vipTier: 'Gold Wardrobe Tier',
        measurements: {
          shoulder: '48 cm',
          chest: '104 cm',
          waist: '32 in',
          recommendedSize: 'M Relaxed'
        }
      },
      {
        id: 'usr_102',
        fullName: 'Sara Khan',
        email: 'sara.k@example.com',
        phone: '0321-9876543',
        city: 'Lahore',
        address: 'DHA Phase 5, Sector C',
        registeredAt: '2026-11-18T14:30:00.000Z',
        totalSpent: 10987,
        totalOrders: 3,
        vipTier: 'Platinum Tier',
        measurements: {
          shoulder: '40 cm',
          chest: '92 cm',
          waist: '28 in',
          recommendedSize: 'S'
        }
      }
    ];
  },

  // Admin create product
  async createProduct(productData) {
    try {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (response.ok) {
        const data = await response.json();
        const current = getInitialProducts();
        saveProductsToLocal([data.data, ...current]);
        return data.data;
      }
    } catch (e) {
      console.warn('Backend create product failed, falling back to local', e);
    }

    const localNew = {
      id: `nv-${Date.now()}`,
      name: productData.name || 'New Garment',
      subtitle: productData.subtitle || 'Everyday Collection',
      price: Number(productData.price) || 2999,
      originalPrice: Number(productData.originalPrice) || Number(productData.price) || 3500,
      currency: 'Rs.',
      rating: 5.0,
      reviewCount: 1,
      category: productData.category || 'Clothing',
      gender: productData.gender || 'Men',
      isBestSeller: Boolean(productData.isBestSeller),
      isNewArrival: Boolean(productData.isNewArrival ?? true),
      isHangerItem: Boolean(productData.isHangerItem ?? true),
      inStock: productData.inStock !== false,
      stockCount: productData.stockCount || 10,
      description: productData.description || 'Crafted with premium materials.',
      details: productData.details || ['100% sustainably sourced fabric'],
      hangerDetails: productData.hangerDetails || {
        fabricWeight: productData.fabricWeight || '240 GSM Pure Flax Linen',
        cut: productData.cut || 'Relaxed Boxy Fit',
        hangerType: productData.hangerType || 'Scandi Oak Wood with Brass Hook'
      },
      images: productData.images || [productData.imageUrl || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'],
      colors: productData.colors || [{ name: 'Natural Sand', hex: '#D8CAB8' }],
      sizes: productData.sizes || ['S', 'M', 'L', 'XL']
    };
    const current = getInitialProducts();
    saveProductsToLocal([localNew, ...current]);
    return localNew;
  },

  // Admin update product
  async updateProduct(id, productData) {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (response.ok) {
        const data = await response.json();
        const current = getInitialProducts();
        const updated = current.map(p => p.id === id ? { ...p, ...data.data } : p);
        saveProductsToLocal(updated);
        return data.data;
      }
    } catch (e) {
      console.warn('Backend update product failed, saving locally', e);
    }

    const current = getInitialProducts();
    const updated = current.map(p => p.id === id ? { ...p, ...productData } : p);
    saveProductsToLocal(updated);
    return updated.find(p => p.id === id);
  },

  // Admin delete product
  async deleteProduct(id) {
    try {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        const current = getInitialProducts();
        saveProductsToLocal(current.filter(p => p.id !== id));
        return true;
      }
    } catch (e) {
      console.warn('Backend delete product failed, deleting locally', e);
    }
    const current = getInitialProducts();
    saveProductsToLocal(current.filter(p => p.id !== id));
    return true;
  }
};
