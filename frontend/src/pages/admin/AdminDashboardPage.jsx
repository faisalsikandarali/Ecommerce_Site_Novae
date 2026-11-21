import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingBag, DollarSign, Shirt, LogOut, Plus, Trash2, Edit3,
  Check, X, ExternalLink, RefreshCw, Eye, Sparkles, Filter, Search, Clock
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminDashboardPage = ({ onNavigateToStore }) => {
  const { logout, adminUser } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'wardrobe'
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    productsCount: 0,
    hangerItemsCount: 0,
    confirmedOrders: 0,
    deliveredOrders: 0
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    category: 'Clothing',
    gender: 'Men',
    isHangerItem: true,
    isNewArrival: true,
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
    fabricWeight: '220 GSM Pure Flax Linen',
    hangerType: 'Scandi Oak Wood with Brushed Brass Hook',
    cut: 'Relaxed Boxy Fit'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes, ordRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/products').then(r => r.json()),
        fetch('/api/admin/orders').then(r => r.json())
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (prodRes.success) setProducts(prodRes.data);
      if (ordRes.success) setOrders(ordRes.data);
    } catch (e) {
      console.error('Failed to load admin dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: newProduct.name,
        subtitle: newProduct.subtitle,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price),
        category: newProduct.category,
        gender: newProduct.gender,
        isHangerItem: newProduct.isHangerItem,
        isNewArrival: newProduct.isNewArrival,
        isBestSeller: newProduct.isBestSeller,
        images: [newProduct.imageUrl],
        hangerDetails: {
          fabricWeight: newProduct.fabricWeight,
          hangerType: newProduct.hangerType,
          cut: newProduct.cut,
          swayIntensity: 'medium'
        }
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        fetchData();
        alert('New piece added to the collection and hung on the wardrobe rail!');
      }
    } catch (e) {
      alert('Failed to create product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this garment from the store?')) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        fetchData();
      }
    } catch (e) {
      alert('Failed to delete product');
    }
  };

  const handleToggleStock = async (prod) => {
    try {
      const res = await fetch(`/api/admin/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: !prod.inStock })
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, inStock: !p.inStock } : p));
      }
    } catch (e) {
      alert('Failed to update stock');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setOrders(prev => prev.map(o => (o.id === orderId || o.orderNumber === orderId) ? { ...o, status: newStatus } : o));
      }
    } catch (e) {
      alert('Failed to update order status');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-stone-900 flex flex-col">
      {/* Top Admin Bar */}
      <header className="bg-[#141414] text-white px-4 sm:px-8 py-4 border-b border-stone-800 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h1 className="font-serif tracking-[0.2em] font-bold text-lg uppercase">
              NOVAÉ HQ CONSOLE
            </h1>
            <p className="text-[10px] text-stone-400">
              Admin: {adminUser?.name || 'Store Director'} • Role: SuperAdmin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToStore}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-colors"
          >
            <span>Live Customer Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs border border-red-800/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Revenue</span>
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              Rs. {stats.totalRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-500">From Cash on Delivery & Card orders</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs uppercase tracking-wider font-semibold">Customer Orders</span>
              <ShoppingBag className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              {orders.length}
            </p>
            <p className="text-[11px] text-stone-500">Live active pipeline</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs uppercase tracking-wider font-semibold">Total Pieces</span>
              <Package className="w-5 h-5 text-stone-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              {products.length}
            </p>
            <p className="text-[11px] text-stone-500">In catalog database</p>
          </div>

          <div className="p-6 bg-amber-50/80 rounded-3xl border border-amber-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs uppercase tracking-wider font-semibold">Hanger Models</span>
              <Shirt className="w-5 h-5 text-amber-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-amber-950">
              {products.filter(p => p.isHangerItem).length}
            </p>
            <p className="text-[11px] text-amber-800/80">With live physics sway animation</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-stone-300 pb-3">
          {[
            { id: 'products', label: 'Inventory & Hanger Pieces', count: products.length },
            { id: 'orders', label: 'Customer Orders', count: orders.length },
            { id: 'wardrobe', label: 'Wardrobe Rail Settings' }
          ].map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
              </button>
            );
          })}
        </div>

        {/* TAB 1: PRODUCT & HANGER INVENTORY */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter by piece name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchData}
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Garment</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-400 font-bold uppercase tracking-wider border-y border-stone-200 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Hanger Status</th>
                    <th className="py-3 px-4">In Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={prod.images?.[0]}
                          alt={prod.name}
                          className="w-10 h-12 object-cover object-top rounded-lg bg-stone-100 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-stone-900">{prod.name}</p>
                          <p className="text-[11px] text-stone-400">{prod.subtitle}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{prod.gender} • {prod.category}</td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        Rs. {prod.price.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        {prod.isHangerItem ? (
                          <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit">
                            <Shirt className="w-3 h-3" />
                            {prod.hangerDetails?.fabricWeight || 'Hanger Ready'}
                          </span>
                        ) : (
                          <span className="text-stone-400 text-[11px]">Flatlay Only</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStock(prod)}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            prod.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {prod.inStock ? 'In Stock' : 'Out of Stock'}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
            <h2 className="text-lg font-serif font-bold text-stone-900">
              Customer Orders & Dispatch Status
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                No orders recorded yet. Place an order on the live store to see it here!
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3 text-xs">
                      <div>
                        <span className="text-stone-400">Order ID: </span>
                        <strong className="font-mono text-stone-900">{ord.orderNumber}</strong>
                        <span className="mx-2 text-stone-300">|</span>
                        <span>{new Date(ord.createdAt).toLocaleString()}</span>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-stone-500 font-medium">Update Status:</span>
                        <select
                          value={ord.status || 'Confirmed'}
                          onChange={(e) => handleUpdateOrderStatus(ord.id || ord.orderNumber, e.target.value)}
                          className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-stone-300 text-stone-800 focus:outline-none cursor-pointer"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="In Transit">In Transit</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Items breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[11px] font-semibold text-stone-400 uppercase">Customer Info</p>
                        <p className="font-bold text-stone-900 mt-1">{ord.customer?.fullName} ({ord.customer?.phone})</p>
                        <p className="text-stone-500">{ord.customer?.city}: {ord.customer?.address}</p>
                        <p className="text-emerald-700 font-medium mt-1">{ord.paymentMethod || 'Cash on Delivery'}</p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-stone-400 uppercase">Items Ordered</p>
                        <div className="space-y-1 mt-1">
                          {ord.items?.map((it, itIdx) => (
                            <div key={itIdx} className="flex justify-between text-stone-700">
                              <span>{it.name} (x{it.quantity}) • Size {it.size}</span>
                              <span className="font-medium">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-bold text-stone-900 pt-2 border-t border-stone-200">
                            <span>Total (incl. delivery):</span>
                            <span>Rs. {ord.total?.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WARDROBE RAIL & HANGER SETTINGS */}
        {activeTab === 'wardrobe' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Boutique Closet Rail Configuration
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Control hanger materials, hook metals, and default wind sway physics for the customer-facing clothing rails.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">Hanger Woods Available</h4>
                <ul className="text-xs text-stone-600 space-y-1.5">
                  <li className="flex items-center gap-2">✔ Scandi Natural Oak</li>
                  <li className="flex items-center gap-2">✔ Solid Smoked Walnut</li>
                  <li className="flex items-center gap-2">✔ Matte Onyx Ash</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">Hook Metallics</h4>
                <ul className="text-xs text-stone-600 space-y-1.5">
                  <li className="flex items-center gap-2">✔ Brushed Artisan Brass</li>
                  <li className="flex items-center gap-2">✔ Polished Chrome Steel</li>
                  <li className="flex items-center gap-2">✔ Anodized Gunmetal</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">Audio Synthesis</h4>
                <p className="text-xs text-stone-600">Web Audio API metallic friction & wooden clink sound generator is ACTIVE.</p>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">Operational</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Add Garment to Hanger Rack
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Garment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cashmere Wool Crewneck"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    placeholder="3450"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    placeholder="4200"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Department</label>
                  <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Image URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none font-mono text-[11px]"
                />
              </div>

              {/* Hanger Settings */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 space-y-3">
                <label className="flex items-center gap-2 font-bold text-amber-950 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isHangerItem}
                    onChange={(e) => setNewProduct({ ...newProduct, isHangerItem: e.target.checked })}
                    className="w-4 h-4 text-amber-700 rounded"
                  />
                  <span>Display on Interactive Hanger Rack</span>
                </label>

                {newProduct.isHangerItem && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Fabric Weight Spec</label>
                      <input
                        type="text"
                        placeholder="280 GSM Honeycomb Cotton"
                        value={newProduct.fabricWeight}
                        onChange={(e) => setNewProduct({ ...newProduct, fabricWeight: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Hanger Wood Type</label>
                      <input
                        type="text"
                        placeholder="Scandi Oak Wood with Brass Hook"
                        value={newProduct.hangerType}
                        onChange={(e) => setNewProduct({ ...newProduct, hangerType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold shadow-md"
                >
                  Publish Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
