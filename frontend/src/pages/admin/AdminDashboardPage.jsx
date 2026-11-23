import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingBag, DollarSign, Shirt, LogOut, Plus, Trash2, Edit3,
  Check, X, ExternalLink, RefreshCw, Eye, Sparkles, Filter, Search, Clock,
  Users, Printer, FileText, ChevronRight, BarChart3, ShieldCheck, Tag,
  AlertTriangle, Image as ImageIcon, UploadCloud, Upload
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { playHangerClinkSound, playHangerSlideSound } from '../../utils/audioFeedback';

export const AdminDashboardPage = ({ onNavigateToStore, onProductsUpdated }) => {
  const { logout, adminUser } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'customers' | 'analytics'
  const [stats, setStats] = useState({
    totalRevenue: 6348,
    ordersCount: 2,
    productsCount: 17,
    hangerItemsCount: 10,
    usersCount: 2
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // When not null, edit modal opens
  const [invoiceOrder, setInvoiceOrder] = useState(null); // When not null, luxury invoice modal opens

  // Add Product form state with comprehensive admin info
  const defaultNewProduct = {
    name: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    category: 'Clothing',
    gender: 'Men',
    inStock: true,
    stockCount: 10,
    isHangerItem: true, // Default to hanger rack
    isNewArrival: true,
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
    colorName: 'Ecru Beige',
    colorHex: '#D8CAB8',
    sizes: 'S, M, L, XL',
    fabricWeight: '240 GSM Pure Flax Linen',
    hangerType: 'Scandi Oak Wood with Brushed Brass Hook',
    cut: 'Relaxed Boxy Fit',
    description: 'Masterfully woven from European flax yarns for a breathable, refined summer silhouette.',
    details: '100% sustainably sourced flax linen\nHand-finished tailored French seams\nSignature boutique oak hanger included'
  };

  const [newProduct, setNewProduct] = useState(defaultNewProduct);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes, ordRes, usersRes] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getOrders(),
        api.getUsers()
      ]);

      if (statsRes) setStats(statsRes);
      if (prodRes) setProducts(prodRes);
      if (ordRes) setOrders(ordRes);
      if (usersRes) setCustomers(usersRes);
    } catch (e) {
      console.error('Failed to load admin dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle file upload from user's computer
  const handleImageFileUpload = (e, target = 'new') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const dataUrl = loadEvent.target.result;
      if (target === 'new') {
        setNewProduct(prev => ({ ...prev, imageUrl: dataUrl }));
      } else if (target === 'edit') {
        setEditingProduct(prev => ({ ...prev, imageUrl: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Create Product with complete admin information
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const parsedSizes = newProduct.sizes
        ? newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean)
        : ['S', 'M', 'L', 'XL'];

      const parsedDetails = newProduct.details
        ? newProduct.details.split('\n').map(d => d.trim()).filter(Boolean)
        : ['100% sustainably sourced fabric', 'Signature boutique hanger included'];

      const payload = {
        name: newProduct.name,
        subtitle: newProduct.subtitle || `${newProduct.gender} ${newProduct.category}`,
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price),
        category: newProduct.category,
        gender: newProduct.gender,
        inStock: Boolean(newProduct.inStock),
        stockCount: Number(newProduct.stockCount) || 10,
        isHangerItem: Boolean(newProduct.isHangerItem),
        isNewArrival: Boolean(newProduct.isNewArrival),
        isBestSeller: Boolean(newProduct.isBestSeller),
        images: [newProduct.imageUrl],
        imageUrl: newProduct.imageUrl,
        colors: [
          {
            name: newProduct.colorName || 'Default',
            hex: newProduct.colorHex || '#D8CAB8',
            image: newProduct.imageUrl
          }
        ],
        sizes: parsedSizes,
        description: newProduct.description,
        details: parsedDetails,
        fabricWeight: newProduct.fabricWeight,
        hangerType: newProduct.hangerType,
        cut: newProduct.cut,
        hangerDetails: {
          fabricWeight: newProduct.fabricWeight,
          hangerType: newProduct.hangerType,
          cut: newProduct.cut,
          swayIntensity: 'medium'
        }
      };

      await api.createProduct(payload);
      setIsAddModalOpen(false);
      setNewProduct(defaultNewProduct);
      await fetchData();
      if (onProductsUpdated) onProductsUpdated();
      alert(`"${payload.name}" is now published and live on the customer store!`);
    } catch (e) {
      alert('Failed to create product');
    }
  };

  // Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const parsedSizes = typeof editingProduct.sizes === 'string'
        ? editingProduct.sizes.split(',').map(s => s.trim()).filter(Boolean)
        : editingProduct.sizes;

      const parsedDetails = typeof editingProduct.details === 'string'
        ? editingProduct.details.split('\n').map(d => d.trim()).filter(Boolean)
        : editingProduct.details;

      const payload = {
        name: editingProduct.name,
        subtitle: editingProduct.subtitle,
        price: Number(editingProduct.price),
        originalPrice: Number(editingProduct.originalPrice) || Number(editingProduct.price),
        category: editingProduct.category,
        gender: editingProduct.gender,
        inStock: Boolean(editingProduct.inStock),
        stockCount: Number(editingProduct.stockCount) || (editingProduct.inStock ? 10 : 0),
        isHangerItem: Boolean(editingProduct.isHangerItem),
        isNewArrival: Boolean(editingProduct.isNewArrival),
        isBestSeller: Boolean(editingProduct.isBestSeller),
        imageUrl: editingProduct.imageUrl || editingProduct.images?.[0],
        images: editingProduct.imageUrl ? [editingProduct.imageUrl] : editingProduct.images,
        sizes: parsedSizes,
        description: editingProduct.description,
        details: parsedDetails,
        fabricWeight: editingProduct.fabricWeight,
        hangerType: editingProduct.hangerType,
        cut: editingProduct.cut,
        hangerDetails: {
          ...editingProduct.hangerDetails,
          fabricWeight: editingProduct.fabricWeight || editingProduct.hangerDetails?.fabricWeight,
          hangerType: editingProduct.hangerType || editingProduct.hangerDetails?.hangerType,
          cut: editingProduct.cut || editingProduct.hangerDetails?.cut
        }
      };

      await api.updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
      await fetchData();
      if (onProductsUpdated) onProductsUpdated();
      alert(`"${payload.name}" updated successfully across the live boutique!`);
    } catch (e) {
      alert('Failed to update product');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this garment from the store?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      await fetchData();
      if (onProductsUpdated) onProductsUpdated();
    } catch (e) {
      alert('Failed to delete product');
    }
  };

  // Toggle inStock with instant live sync
  const handleToggleStock = async (prod) => {
    try {
      const nextStock = !prod.inStock;
      await api.updateProduct(prod.id, {
        inStock: nextStock,
        stockCount: nextStock ? (prod.stockCount > 0 ? prod.stockCount : 10) : 0
      });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, inStock: nextStock, stockCount: nextStock ? (p.stockCount > 0 ? p.stockCount : 10) : 0 } : p));
      if (onProductsUpdated) onProductsUpdated();
    } catch (e) {
      alert('Failed to update stock');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => (o.id === orderId || o.orderNumber === orderId) ? { ...o, status: newStatus } : o));
    } catch (e) {
      alert('Failed to update order status');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter === 'All') return true;
    return (o.status || 'Confirmed').toLowerCase() === orderStatusFilter.toLowerCase();
  });

  const totalCalculatedRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-stone-900 flex flex-col font-sans">
      {/* Top Admin Bar */}
      <header className="bg-[#141414] text-white px-4 sm:px-8 py-4 border-b border-stone-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h1 className="font-serif tracking-[0.2em] font-bold text-lg uppercase text-stone-100">
              NOVAÉ HQ CONSOLE
            </h1>
            <p className="text-[10px] text-stone-400">
              Admin: {adminUser?.name || 'Head of Boutique Operations'} • Role: SuperAdmin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToStore}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-colors cursor-pointer"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs border border-red-800/40 transition-colors cursor-pointer"
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
              Rs. {totalCalculatedRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-stone-500">Live order pipeline gross value</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs uppercase tracking-wider font-semibold">Dispatched Orders</span>
              <ShoppingBag className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              {orders.length}
            </p>
            <p className="text-[11px] text-stone-500">Active tracked boutique packages</p>
          </div>

          <div className="p-6 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-xs uppercase tracking-wider font-semibold">Catalog Inventory</span>
              <Package className="w-5 h-5 text-stone-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-stone-900">
              {products.length}
            </p>
            <p className="text-[11px] text-stone-500">Total garments & accessories</p>
          </div>

          <div className="p-6 bg-amber-50/80 rounded-3xl border border-amber-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-xs uppercase tracking-wider font-semibold">Hanger Models</span>
              <Shirt className="w-5 h-5 text-amber-700" />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-serif text-amber-950">
              {products.filter(p => p.isHangerItem).length}
            </p>
            <p className="text-[11px] text-amber-800/80">With active physics pendulum sway</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-300 pb-3">
          {[
            { id: 'products', label: 'Inventory & Stock Management', count: products.length, icon: Package },
            { id: 'orders', label: 'Customer Orders', count: orders.length, icon: ShoppingBag },
            { id: 'customers', label: 'Registered Patrons', count: customers.length, icon: Users },
            { id: 'analytics', label: 'Analytics & Wardrobe Rail', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${isSelected ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    {tab.count}
                  </span>
                )}
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
                  placeholder="Filter by piece name, department, category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={fetchData}
                  className="p-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 cursor-pointer"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>List New Garment</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-400 font-bold uppercase tracking-wider border-y border-stone-200 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Garment</th>
                    <th className="py-3 px-4">Department & Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock Status & Units</th>
                    <th className="py-3 px-4">Hanger Display</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((prod) => {
                    const isAvailable = prod.inStock !== false && (prod.stockCount === undefined || prod.stockCount > 0);
                    return (
                      <tr key={prod.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={prod.images?.[0] || prod.colors?.[0]?.image}
                            alt={prod.name}
                            className="w-10 h-12 object-cover object-top rounded-lg bg-stone-100 shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-stone-900">{prod.name}</p>
                            <p className="text-[11px] text-stone-400">{prod.subtitle}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium">
                          <span className="px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-semibold">
                            {prod.gender} • {prod.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-stone-900">Rs. {prod.price.toLocaleString()}</span>
                          {prod.originalPrice && prod.originalPrice > prod.price && (
                            <span className="block text-[10px] text-stone-400 line-through">
                              Rs. {prod.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleStock(prod)}
                              className={`px-2.5 py-1 rounded-md text-[10px] font-bold cursor-pointer transition-colors ${
                                isAvailable
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-red-100 text-red-800 hover:bg-red-200'
                              }`}
                            >
                              {isAvailable ? `In Stock (${prod.stockCount ?? 10})` : 'Sold Out (0)'}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {prod.isHangerItem ? (
                            <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit">
                              <Shirt className="w-3 h-3" />
                              <span>Hanger Ready</span>
                            </span>
                          ) : (
                            <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1 w-fit">
                              <Package className="w-3 h-3" />
                              <span>Folded Flatlay</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => setEditingProduct({
                              ...prod,
                              imageUrl: prod.images?.[0] || prod.imageUrl || '',
                              sizes: Array.isArray(prod.sizes) ? prod.sizes.join(', ') : prod.sizes,
                              details: Array.isArray(prod.details) ? prod.details.join('\n') : prod.details,
                              fabricWeight: prod.hangerDetails?.fabricWeight || prod.fabricWeight || '',
                              hangerType: prod.hangerDetails?.hangerType || prod.hangerType || 'Scandi Oak Wood with Brushed Brass Hook',
                              cut: prod.hangerDetails?.cut || prod.cut || 'Relaxed Boxy Fit',
                              stockCount: prod.stockCount !== undefined ? prod.stockCount : 10
                            })}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Garment Details"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove Garment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOMER ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  Customer Orders & Dispatch Pipeline
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Track delivery progress, update order statuses, and generate official luxury invoices.
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 font-semibold">Filter:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded-xl focus:outline-none font-semibold text-stone-800 cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-400 text-xs">
                No orders matching the criteria.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((ord, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400">Order: </span>
                        <strong className="font-mono text-stone-900 text-sm">{ord.orderNumber}</strong>
                        <span className="mx-2 text-stone-300">|</span>
                        <span>{new Date(ord.createdAt).toLocaleString()}</span>
                      </div>

                      {/* Status Selector & Print Invoice button */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setInvoiceOrder(ord)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-stone-600" />
                          <span>View & Print Invoice</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-stone-500 font-medium">Status:</span>
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
                    </div>

                    {/* Customer & Items breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-[11px] font-semibold text-stone-400 uppercase">Customer Info</p>
                        <p className="font-bold text-stone-900 mt-1">{ord.customer?.fullName} ({ord.customer?.phone})</p>
                        <p className="text-stone-600">{ord.customer?.email}</p>
                        <p className="text-stone-500">{ord.customer?.city}: {ord.customer?.address}</p>
                        <p className="text-emerald-700 font-medium mt-1">Payment: {ord.paymentMethod || 'Cash on Delivery'}</p>
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
                            <span>Total (incl. Rs. {ord.shippingCost || 200} shipping):</span>
                            <span className="text-stone-900">Rs. {ord.total?.toLocaleString()}</span>
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

        {/* TAB 3: REGISTERED CUSTOMERS DATABASE */}
        {activeTab === 'customers' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div>
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Registered Boutique Patrons & Clients
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Verified customer profiles, VIP tier classifications, and saved tailoring measurements for hanger drape fit.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-600">
                <thead className="bg-stone-50 text-stone-400 font-bold uppercase tracking-wider border-y border-stone-200 text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Patron</th>
                    <th className="py-3 px-4">Contact & Location</th>
                    <th className="py-3 px-4">VIP Tier</th>
                    <th className="py-3 px-4">Orders Placed</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">Hanger Drape Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-serif font-bold flex items-center justify-center text-xs">
                            {c.fullName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">{c.fullName}</p>
                            <p className="text-[11px] text-stone-400 font-mono">{c.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="text-stone-900 font-medium">{c.email}</p>
                        <p className="text-[11px] text-stone-500">{c.phone} • {c.city}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                          {c.vipTier || 'Gold Wardrobe Tier'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        {c.totalOrders || 1} Orders
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900">
                        Rs. {(c.totalSpent || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-[11px]">
                        <span className="text-stone-700 block">Shoulder: {c.measurements?.shoulder || '46 cm'}</span>
                        <span className="text-stone-500">Rec. Size: <strong className="text-stone-900">{c.measurements?.recommendedSize || 'M'}</strong></span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: ANALYTICS & WARDROBE RAIL */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Revenue Distribution */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Revenue by Garment Category
                </h3>
                <div className="space-y-3 pt-2 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Clothing & Shirting</span>
                      <span>72%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-stone-900 rounded-full" style={{ width: '72%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Footwear (Leather Loafers & Slides)</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-amber-800 rounded-full" style={{ width: '18%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Accessories (Bags, Silk Ties, Caps)</span>
                      <span>10%</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-stone-400 rounded-full" style={{ width: '10%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Fulfillment Status */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Order Dispatch Pipeline
                </h3>
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] uppercase font-bold text-amber-800">Confirmed</span>
                    <p className="text-2xl font-bold font-serif text-amber-950 mt-1">
                      {orders.filter(o => o.status === 'Confirmed').length}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] uppercase font-bold text-blue-800">Processing</span>
                    <p className="text-2xl font-bold font-serif text-blue-950 mt-1">
                      {orders.filter(o => o.status === 'Processing').length}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] uppercase font-bold text-purple-800">In Transit</span>
                    <p className="text-2xl font-bold font-serif text-purple-950 mt-1">
                      {orders.filter(o => o.status === 'In Transit').length}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-800">Delivered</span>
                    <p className="text-2xl font-bold font-serif text-emerald-950 mt-1">
                      {orders.filter(o => o.status === 'Delivered').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wardrobe Rail Physics & Audio Testing */}
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
              <div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Boutique Closet Rail & Audio Synthesis
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real-time interactive controls for clothes rack pendulum dynamics and metallic resonance.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <h4 className="text-xs font-bold text-stone-800">Hanger Wood Finish</h4>
                  <p className="text-xs text-stone-600">Scandi Natural Oak Wood with beveled contours.</p>
                  <span className="inline-block text-[10px] font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded">Active Default</span>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <h4 className="text-xs font-bold text-stone-800">Hook Metallics</h4>
                  <p className="text-xs text-stone-600">Brushed Artisan Gold Brass hook neck with 360° swivel.</p>
                  <span className="inline-block text-[10px] font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded">Active Default</span>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-2">
                  <h4 className="text-xs font-bold text-stone-800">Web Audio Feedback</h4>
                  <div className="flex gap-2">
                    <button
                      onClick={() => playHangerClinkSound()}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 text-white text-[11px] font-semibold cursor-pointer hover:bg-black"
                    >
                      Test Clink Sound
                    </button>
                    <button
                      onClick={() => playHangerSlideSound()}
                      className="px-3 py-1.5 rounded-lg bg-amber-800 text-white text-[11px] font-semibold cursor-pointer hover:bg-amber-900"
                    >
                      Test Slide Sound
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD NEW PRODUCT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  List New Boutique Garment
                </h3>
                <p className="text-xs text-stone-500">Provide complete garment details, local photo upload, and hanger rack configuration.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Garment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pure Linen Oversized Shirt"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Tagline / Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. 240 GSM Pure Flax Linen"
                    value={newProduct.subtitle}
                    onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Selling Price (Rs.) *</label>
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
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stockCount}
                    onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer h-10 px-2 bg-stone-50 rounded-xl border border-stone-200">
                    <input
                      type="checkbox"
                      checked={newProduct.inStock}
                      onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-stone-900"
                    />
                    <span>Mark In Stock</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Department</label>
                  <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white cursor-pointer"
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
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white cursor-pointer"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Backpack">Backpack</option>
                  </select>
                </div>
              </div>

              {/* PHOTO UPLOAD: COMPUTER FILE OR IMAGE URL */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <label className="font-bold text-stone-900 block text-xs">
                  Garment Photography (Computer File Upload & Web URL) *
                </label>

                {/* Upload from Computer Box */}
                <label className="border-2 border-dashed border-stone-300 hover:border-stone-900 bg-white rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                  <UploadCloud className="w-7 h-7 text-stone-400 group-hover:text-stone-900 mb-1 transition-colors" />
                  <span className="font-bold text-xs text-stone-800">
                    Choose Photo From Your Computer
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    Click to browse PNG, JPG, WEBP, or AVIF image files
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, 'new')}
                    className="hidden"
                  />
                </label>

                {/* Or Paste URL */}
                <div className="flex gap-2 items-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 whitespace-nowrap">Or Image URL:</span>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={newProduct.imageUrl}
                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono text-[11px]"
                  />
                </div>

                {/* Image Live Preview */}
                {newProduct.imageUrl && (
                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-200 shadow-2xs">
                    <img
                      src={newProduct.imageUrl}
                      alt="Garment Preview"
                      className="w-12 h-16 object-cover object-top rounded-lg bg-stone-100 border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-stone-900 block text-xs truncate">Product Image Ready</span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Photo loaded & ready for boutique display
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* HANGER DISPLAY QUESTION: EXPLICIT CHOICE */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                <label className="font-bold text-stone-900 block text-xs">
                  Display Mode: Hang On Interactive Coat Hanger Rack? *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, isHangerItem: true })}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                      newProduct.isHangerItem
                        ? 'border-amber-800 bg-white ring-2 ring-amber-800/20 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <Shirt className={`w-5 h-5 shrink-0 mt-0.5 ${newProduct.isHangerItem ? 'text-amber-800' : 'text-stone-400'}`} />
                    <div>
                      <p className={`font-bold text-xs ${newProduct.isHangerItem ? 'text-amber-950' : 'text-stone-700'}`}>
                        👔 Yes, Hang on Hanger Rack
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                        Interactive 3D coat hanger hook, pendulum sway, and drape cut.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewProduct({ ...newProduct, isHangerItem: false })}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                      !newProduct.isHangerItem
                        ? 'border-stone-900 bg-white ring-2 ring-stone-900/20 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <Package className={`w-5 h-5 shrink-0 mt-0.5 ${!newProduct.isHangerItem ? 'text-stone-900' : 'text-stone-400'}`} />
                    <div>
                      <p className={`font-bold text-xs ${!newProduct.isHangerItem ? 'text-stone-950' : 'text-stone-700'}`}>
                        📦 No, Folded / Flatlay Edition
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                        Standard boutique folded box presentation without hanger hook.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Hanger Rack Specs (Only if Hanger Selected) */}
                {newProduct.isHangerItem ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200/60">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Fabric Weight Spec</label>
                      <input
                        type="text"
                        placeholder="280 GSM Structured Gabardine"
                        value={newProduct.fabricWeight}
                        onChange={(e) => setNewProduct({ ...newProduct, fabricWeight: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Silhouette Cut</label>
                      <input
                        type="text"
                        placeholder="Relaxed Boxy Fit"
                        value={newProduct.cut}
                        onChange={(e) => setNewProduct({ ...newProduct, cut: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Hanger Wood Finish</label>
                      <select
                        value={newProduct.hangerType}
                        onChange={(e) => setNewProduct({ ...newProduct, hangerType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white cursor-pointer"
                      >
                        <option value="Scandi Oak Wood with Brushed Brass Hook">Scandi Natural Oak (Brass Hook)</option>
                        <option value="Solid Smoked Walnut Deluxe Coat Hanger">Solid Smoked Walnut (Chrome Hook)</option>
                        <option value="Matte Onyx Ash Wood Hanger">Matte Onyx Ash (Gunmetal Hook)</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-stone-500 italic pt-1">
                    ℹ️ This piece will appear in the shop catalog in folded box presentation format without a coat hanger hook.
                  </p>
                )}
              </div>

              {/* Color & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Primary Color Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ecru Beige"
                    value={newProduct.colorName}
                    onChange={(e) => setNewProduct({ ...newProduct, colorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Color Hex</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={newProduct.colorHex}
                      onChange={(e) => setNewProduct({ ...newProduct, colorHex: e.target.value })}
                      className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer p-0.5"
                    />
                    <input
                      type="text"
                      value={newProduct.colorHex}
                      onChange={(e) => setNewProduct({ ...newProduct, colorHex: e.target.value })}
                      className="flex-1 px-2.5 py-2 rounded-xl border border-stone-300 font-mono text-[11px]"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Available Sizes (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL"
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              {/* Description & Details */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 resize-none"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Atelier Details (one per line)</label>
                <textarea
                  rows={2}
                  value={newProduct.details}
                  onChange={(e) => setNewProduct({ ...newProduct, details: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 resize-none font-mono text-[11px]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold shadow-md cursor-pointer"
                >
                  Publish to Live Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Edit Garment: {editingProduct.name}
                </h3>
                <p className="text-xs text-stone-500 font-mono">ID: {editingProduct.id}</p>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Garment Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editingProduct.subtitle || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Original Price (Rs.)</label>
                  <input
                    type="number"
                    value={editingProduct.originalPrice || editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stockCount !== undefined ? editingProduct.stockCount : 10}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 font-bold text-stone-800 cursor-pointer h-10 px-2 bg-stone-50 rounded-xl border border-stone-200">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-stone-900"
                    />
                    <span>Mark In Stock</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Department</label>
                  <select
                    value={editingProduct.gender}
                    onChange={(e) => setEditingProduct({ ...editingProduct, gender: e.target.value })}
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
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="Clothing">Clothing</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Backpack">Backpack</option>
                  </select>
                </div>
              </div>

              {/* Photo Upload: File from Computer & URL */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <label className="font-bold text-stone-900 block text-xs">
                  Change Garment Photography (Upload File or Update URL)
                </label>

                <label className="border-2 border-dashed border-stone-300 hover:border-stone-900 bg-white rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                  <UploadCloud className="w-6 h-6 text-stone-400 group-hover:text-stone-900 mb-1 transition-colors" />
                  <span className="font-bold text-xs text-stone-800">
                    Choose New Photo From Your Computer
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageFileUpload(e, 'edit')}
                    className="hidden"
                  />
                </label>

                <div className="flex gap-2 items-center">
                  <span className="text-[10px] uppercase font-bold text-stone-400 whitespace-nowrap">Image URL:</span>
                  <input
                    type="url"
                    value={editingProduct.imageUrl || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono text-[11px]"
                  />
                </div>

                {editingProduct.imageUrl && (
                  <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-stone-200">
                    <img
                      src={editingProduct.imageUrl}
                      alt="Preview"
                      className="w-12 h-16 object-cover object-top rounded-lg border border-stone-200 bg-stone-100 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="font-bold text-stone-900 block text-xs truncate">Current Selected Image</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">Ready to update</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Hanger Choice in Edit Modal */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 space-y-3">
                <label className="font-bold text-stone-900 block text-xs">
                  Display Mode: Hang On Interactive Coat Hanger Rack? *
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, isHangerItem: true })}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                      editingProduct.isHangerItem
                        ? 'border-amber-800 bg-white ring-2 ring-amber-800/20 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <Shirt className={`w-5 h-5 shrink-0 mt-0.5 ${editingProduct.isHangerItem ? 'text-amber-800' : 'text-stone-400'}`} />
                    <div>
                      <p className={`font-bold text-xs ${editingProduct.isHangerItem ? 'text-amber-950' : 'text-stone-700'}`}>
                        👔 Yes, Hang on Hanger Rack
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Interactive 3D coat hanger hook, pendulum sway, and drape simulation.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingProduct({ ...editingProduct, isHangerItem: false })}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                      !editingProduct.isHangerItem
                        ? 'border-stone-900 bg-white ring-2 ring-stone-900/20 shadow-xs'
                        : 'border-stone-200 bg-stone-50 hover:bg-white'
                    }`}
                  >
                    <Package className={`w-5 h-5 shrink-0 mt-0.5 ${!editingProduct.isHangerItem ? 'text-stone-900' : 'text-stone-400'}`} />
                    <div>
                      <p className={`font-bold text-xs ${!editingProduct.isHangerItem ? 'text-stone-950' : 'text-stone-700'}`}>
                        📦 No, Folded / Flatlay Edition
                      </p>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        Folded box presentation without coat hanger hook.
                      </p>
                    </div>
                  </button>
                </div>

                {editingProduct.isHangerItem && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-amber-200/60">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Fabric Weight Spec</label>
                      <input
                        type="text"
                        value={editingProduct.fabricWeight || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, fabricWeight: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Garment Cut</label>
                      <input
                        type="text"
                        value={editingProduct.cut || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, cut: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">Hanger Wood Finish</label>
                      <select
                        value={editingProduct.hangerType || 'Scandi Oak Wood with Brushed Brass Hook'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, hangerType: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white cursor-pointer"
                      >
                        <option value="Scandi Oak Wood with Brushed Brass Hook">Scandi Natural Oak (Brass Hook)</option>
                        <option value="Solid Smoked Walnut Deluxe Coat Hanger">Solid Smoked Walnut (Chrome Hook)</option>
                        <option value="Matte Onyx Ash Wood Hanger">Matte Onyx Ash (Gunmetal Hook)</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Sizes (comma-separated)</label>
                <input
                  type="text"
                  value={editingProduct.sizes || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, sizes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 resize-none"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold shadow-md cursor-pointer"
                >
                  Update Live Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE LUXURY INVOICE MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[95vh] overflow-y-auto print:shadow-none print:border-none">
            {/* Header */}
            <div className="flex items-start justify-between pb-6 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-serif font-bold tracking-[0.2em] text-stone-900 uppercase">
                  NOVAÉ ATELIER
                </h2>
                <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">
                  Official Luxury Dispatch & Invoice
                </p>
                <p className="text-xs text-stone-400 font-mono mt-1">
                  Invoice #: NV-INV-{invoiceOrder.orderNumber?.replace('NV-', '') || '2120'}
                </p>
              </div>
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="p-2 text-stone-400 hover:text-stone-900 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Billing & Order Details */}
            <div className="grid grid-cols-2 gap-6 text-xs text-stone-600">
              <div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Billed & Shipped To
                </span>
                <p className="font-bold text-stone-900 text-sm">{invoiceOrder.customer?.fullName}</p>
                <p>{invoiceOrder.customer?.address}</p>
                <p>{invoiceOrder.customer?.city}, Pakistan</p>
                <p className="text-stone-500 mt-1">Phone: {invoiceOrder.customer?.phone}</p>
                <p className="text-stone-500">Email: {invoiceOrder.customer?.email}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Dispatch Status
                </span>
                <p className="font-mono font-bold text-stone-900">Order Ref: {invoiceOrder.orderNumber}</p>
                <p>Date: {new Date(invoiceOrder.createdAt).toLocaleDateString()}</p>
                <p className="mt-1">
                  Payment: <strong className="text-stone-900">{invoiceOrder.paymentMethod || 'Cash on Delivery'}</strong>
                </p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                  {invoiceOrder.status || 'Confirmed'}
                </span>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Garment Item</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4 text-center">Qty</th>
                    <th className="py-3 px-4 text-right">Unit Price</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {invoiceOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 text-stone-900 font-semibold">{it.name}</td>
                      <td className="py-3 px-4 text-stone-600">{it.size}</td>
                      <td className="py-3 px-4 text-center">{it.quantity}</td>
                      <td className="py-3 px-4 text-right text-stone-600">Rs. {it.price.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right text-stone-900 font-bold">
                        Rs. {(it.price * it.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">Rs. {invoiceOrder.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Priority Courier Delivery:</span>
                  <span className="font-semibold text-stone-900">Rs. {invoiceOrder.shippingCost || 200}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-300">
                  <span>Grand Total:</span>
                  <span>Rs. {invoiceOrder.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center text-[11px] text-stone-500">
              All garments are inspected, hand-steamed, and hung on solid European oak hangers prior to boutique dispatch.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
