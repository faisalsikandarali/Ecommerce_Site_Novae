import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingBag, DollarSign, Shirt, LogOut, Plus, Trash2, Edit3,
  Check, X, ExternalLink, RefreshCw, Eye, Sparkles, Filter, Search, Clock,
  Users, Printer, FileText, ChevronRight, BarChart3, ShieldCheck, Tag,
  AlertTriangle, Image as ImageIcon, UploadCloud, Upload, Folder, FolderCheck,
  Truck, CheckCircle2, AlertCircle, Mail, Send
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { playHangerClinkSound, playHangerSlideSound } from '../../utils/audioFeedback';

export const AdminDashboardPage = ({ onNavigateToStore, onProductsUpdated }) => {
  const { logout, adminUser } = useAdminAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'notifications' | 'customers' | 'analytics'
  const [activeOrderFolder, setActiveOrderFolder] = useState('all'); // 'all' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'cancelled'
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    productsCount: 0,
    hangerItemsCount: 0,
    usersCount: 0
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [folderSummary, setFolderSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [inspectingOrder, setInspectingOrder] = useState(null);
  const [previewEmail, setPreviewEmail] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Add Product form state
  const defaultNewProduct = {
    name: '',
    subtitle: '',
    price: '',
    originalPrice: '',
    category: 'Clothing',
    gender: 'Men',
    inStock: true,
    stockCount: 10,
    isHangerItem: true,
    isNewArrival: true,
    isBestSeller: false,
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
    colorName: 'Ecru Beige',
    colorHex: '#D8CAB8',
    sizes: 'S, M, L, XL',
    fabricWeight: '240 GSM Pure Flax Linen',
    hangerType: 'Scandi Oak Wood with Brushed Brass Hook',
    cut: 'Relaxed Boxy Fit',
    description: 'Masterfully woven from European flax yarns for a breathable, refined silhouette.',
    details: '100% sustainably sourced flax linen\nHand-finished tailored French seams\nSignature boutique oak hanger included'
  };

  const [newProduct, setNewProduct] = useState(defaultNewProduct);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, prodRes, ordRes, usersRes, notifsRes, emailsRes, summaryRes] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getOrders(),
        api.getUsers(),
        api.getNotifications(),
        api.getEmailLogs(),
        api.getOrderFoldersSummary()
      ]);

      if (statsRes) setStats(statsRes);
      if (prodRes) setProducts(prodRes);
      if (ordRes) setOrders(ordRes);
      if (usersRes) setCustomers(usersRes);
      if (notifsRes) setNotifications(notifsRes);
      if (emailsRes) setEmailLogs(emailsRes);
      if (summaryRes) setFolderSummary(summaryRes);
    } catch (e) {
      console.error('Failed to load admin dashboard data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotificationSuccess = (msg) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(''), 4000);
  };

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

  // Create Product
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('Please provide at least a garment name and price');
      return;
    }

    try {
      const payload = {
        name: newProduct.name,
        subtitle: newProduct.subtitle || 'NOVAÉ Everyday Line',
        price: Number(newProduct.price),
        originalPrice: Number(newProduct.originalPrice) || Number(newProduct.price),
        category: newProduct.category,
        gender: newProduct.gender,
        inStock: Boolean(newProduct.inStock),
        stockCount: Number(newProduct.stockCount) || 10,
        isHangerItem: Boolean(newProduct.isHangerItem),
        isNewArrival: Boolean(newProduct.isNewArrival),
        isBestSeller: Boolean(newProduct.isBestSeller),
        description: newProduct.description,
        details: newProduct.details ? newProduct.details.split('\n').filter(Boolean) : ['100% fine tailored fabric'],
        images: [newProduct.imageUrl],
        colors: [{ name: newProduct.colorName || 'Default', hex: newProduct.colorHex || '#333', image: newProduct.imageUrl }],
        sizes: newProduct.sizes ? newProduct.sizes.split(',').map(s => s.trim()).filter(Boolean) : ['S', 'M', 'L', 'XL'],
        hangerDetails: {
          fabricWeight: newProduct.fabricWeight || '240 GSM Pure Flax Linen',
          hangerType: newProduct.hangerType || 'Scandi Oak Wood with Brushed Brass Hook',
          cut: newProduct.cut || 'Relaxed Boxy Fit',
          swayIntensity: 'medium'
        }
      };

      await api.createProduct(payload);
      setIsAddModalOpen(false);
      setNewProduct(defaultNewProduct);
      await fetchData();
      if (onProductsUpdated) onProductsUpdated();
      showNotificationSuccess(`"${payload.name}" listed successfully with hanger display!`);
    } catch (e) {
      alert('Failed to list new product');
    }
  };

  // Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const payload = {
        name: editingProduct.name,
        subtitle: editingProduct.subtitle,
        price: Number(editingProduct.price),
        originalPrice: Number(editingProduct.originalPrice) || Number(editingProduct.price),
        category: editingProduct.category,
        gender: editingProduct.gender,
        inStock: Boolean(editingProduct.inStock),
        stockCount: Number(editingProduct.stockCount),
        isHangerItem: Boolean(editingProduct.isHangerItem),
        isNewArrival: Boolean(editingProduct.isNewArrival),
        isBestSeller: Boolean(editingProduct.isBestSeller),
        description: editingProduct.description,
        details: Array.isArray(editingProduct.details) ? editingProduct.details : [editingProduct.details],
        images: editingProduct.imageUrl ? [editingProduct.imageUrl] : editingProduct.images,
        sizes: typeof editingProduct.sizes === 'string' ? editingProduct.sizes.split(',').map(s => s.trim()) : editingProduct.sizes,
        hangerDetails: {
          fabricWeight: editingProduct.fabricWeight || editingProduct.hangerDetails?.fabricWeight || '240 GSM Pure Flax Linen',
          hangerType: editingProduct.hangerType || editingProduct.hangerDetails?.hangerType || 'Scandi Oak Wood with Brushed Brass Hook',
          cut: editingProduct.cut || editingProduct.hangerDetails?.cut || 'Relaxed Boxy Fit',
          swayIntensity: 'medium'
        }
      };

      await api.updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
      await fetchData();
      if (onProductsUpdated) onProductsUpdated();
      showNotificationSuccess(`"${payload.name}" updated successfully!`);
    } catch (e) {
      alert('Failed to update product');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to remove this garment from the boutique?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      await fetchData();
      if (onProductsUpdated) onProductsUpdated();
      showNotificationSuccess('Garment removed from catalog');
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
      showNotificationSuccess(`${prod.name} marked ${nextStock ? 'In Stock' : 'Out of Stock'}`);
    } catch (e) {
      alert('Failed to update stock');
    }
  };

  // Update Order Status (Advances folder & dispatches customer notifications)
  const handleUpdateOrderStatus = async (orderId, newStatus, note = '', trackingCode = '') => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, note, trackingCode);
      await fetchData();
      showNotificationSuccess(`Order status updated to "${newStatus}". In-app notification & email dispatched to customer!`);
      if (inspectingOrder && (inspectingOrder.id === orderId || inspectingOrder.orderNumber === orderId)) {
        setInspectingOrder(updated || { ...inspectingOrder, status: newStatus });
      }
    } catch (e) {
      alert('Failed to update order status');
    }
  };

  // Resend Email Notification
  const handleResendEmail = async (orderId) => {
    try {
      await api.resendEmailNotification(orderId);
      await fetchData();
      showNotificationSuccess('Simulated email notification resent to client inbox!');
    } catch (e) {
      alert('Failed to resend email');
    }
  };

  // Filter products
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter orders by active folder and search term
  const filteredOrders = orders.filter(o => {
    const folder = (o.folder || '').toLowerCase();
    const status = (o.status || 'Confirmed').toLowerCase();

    // Folder check
    if (activeOrderFolder === 'confirmed') {
      if (folder !== 'confirmed' && status !== 'confirmed') return false;
    } else if (activeOrderFolder === 'processing') {
      if (folder !== 'processing' && status !== 'processing') return false;
    } else if (activeOrderFolder === 'in_transit') {
      if (folder !== 'in_transit' && status !== 'in transit' && status !== 'shipped') return false;
    } else if (activeOrderFolder === 'delivered') {
      if (folder !== 'delivered' && status !== 'delivered' && status !== 'completed') return false;
    } else if (activeOrderFolder === 'cancelled') {
      if (folder !== 'cancelled' && status !== 'cancelled' && status !== 'rejected') return false;
    }

    // Search query check
    if (orderSearchTerm) {
      const q = orderSearchTerm.toLowerCase();
      const matchNum = o.orderNumber?.toLowerCase().includes(q);
      const matchName = o.customer?.fullName?.toLowerCase().includes(q);
      const matchPhone = o.customer?.phone?.toLowerCase().includes(q);
      const matchCity = o.customer?.city?.toLowerCase().includes(q);
      return matchNum || matchName || matchPhone || matchCity;
    }

    return true;
  });

  const totalCalculatedRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

  // Computed folder metrics
  const countConfirmed = orders.filter(o => (o.status || 'Confirmed').toLowerCase() === 'confirmed').length;
  const countProcessing = orders.filter(o => (o.status || '').toLowerCase() === 'processing').length;
  const countInTransit = orders.filter(o => (o.status || '').toLowerCase() === 'in transit').length;
  const countDelivered = orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
  const countCancelled = orders.filter(o => (o.status || '').toLowerCase() === 'cancelled').length;

  return (
    <div className="min-h-screen bg-[#F4F3EF] text-stone-900 flex flex-col font-sans select-none">
      {/* Top Admin Bar */}
      <header className="bg-[#141414] text-white px-4 sm:px-8 py-4 border-b border-stone-800 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <h1 className="font-serif tracking-[0.2em] font-bold text-lg uppercase text-stone-100 flex items-center gap-2">
              <span>NOVAÉ HQ OPERATIONS</span>
              <span className="text-[10px] bg-amber-800/80 text-amber-200 px-2 py-0.5 rounded font-sans tracking-normal font-semibold">
                Enterprise Console
              </span>
            </h1>
            <p className="text-[10px] text-stone-400">
              Admin: {adminUser?.name || 'Head of Boutique Operations'} • Connected Live Backend & Order Pipelines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToStore}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs transition-colors cursor-pointer"
          >
            <span>Live Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs border border-red-800/40 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      {/* Floating Action Success Toast */}
      {actionSuccessMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-2 text-xs font-semibold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Revenue */}
          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] uppercase tracking-wider font-bold">Total Gross Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              Rs. {totalCalculatedRevenue.toLocaleString()}
            </p>
            <p className="text-[10px] text-stone-500">All recorded orders value</p>
          </div>

          {/* Confirmed Orders Folder */}
          <div className="p-5 bg-amber-50/80 rounded-3xl border border-amber-200/90 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-amber-800">
              <span className="text-[10px] uppercase tracking-wider font-bold">📂 Confirmed Folder</span>
              <FolderCheck className="w-4 h-4 text-amber-700" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-amber-950">
              {countConfirmed}
            </p>
            <p className="text-[10px] text-amber-800/80">Pending tailoring & steam press</p>
          </div>

          {/* In Transit */}
          <div className="p-5 bg-indigo-50/70 rounded-3xl border border-indigo-200/80 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-indigo-700">
              <span className="text-[10px] uppercase tracking-wider font-bold">🚚 In Transit</span>
              <Truck className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-indigo-950">
              {countInTransit}
            </p>
            <p className="text-[10px] text-indigo-700/80">With courier riders</p>
          </div>

          {/* Delivered */}
          <div className="p-5 bg-emerald-50/80 rounded-3xl border border-emerald-200 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between text-emerald-800">
              <span className="text-[10px] uppercase tracking-wider font-bold">✅ Delivered</span>
              <Check className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-emerald-950">
              {countDelivered}
            </p>
            <p className="text-[10px] text-emerald-800/80">Received safely by patrons</p>
          </div>

          {/* Catalog & Wardrobe */}
          <div className="p-5 bg-white rounded-3xl border border-stone-200 shadow-xs space-y-1.5 col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-stone-400">
              <span className="text-[10px] uppercase tracking-wider font-bold">Wardrobe Pieces</span>
              <Shirt className="w-4 h-4 text-stone-700" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-serif text-stone-900">
              {products.length} ({products.filter(p => p.isHangerItem).length} 👔)
            </p>
            <p className="text-[10px] text-stone-500">Live active catalog items</p>
          </div>
        </div>

        {/* Tab Controls Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-300 pb-3">
          {[
            { id: 'orders', label: 'Customer Orders & Pipelines', count: orders.length, icon: ShoppingBag },
            { id: 'products', label: 'Garment Inventory & Hangers', count: products.length, icon: Package },
            { id: 'notifications', label: 'Customer Notifications & Email Log', count: notifications.length, icon: Mail },
            { id: 'customers', label: 'Registered Clients Directory', count: customers.length, icon: Users },
            { id: 'analytics', label: 'Financials & Audio Rail', icon: BarChart3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white shadow-md'
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

        {/* ============================================================== */}
        {/* TAB 1: CUSTOMER ORDERS & FOLDER PIPELINE (Requested by User)    */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* 1. ORDER FOLDERS BAR (Folders for Confirmed, Processing, Delivered, etc.) */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                    <Folder className="w-5 h-5 text-amber-700" />
                    <span>Order Management Folders (آرڈر فولڈرز)</span>
                  </h3>
                  <p className="text-xs text-stone-500 font-light mt-0.5">
                    Click any folder to inspect orders by stage. Confirmed orders reside in their dedicated pipeline.
                  </p>
                </div>

                {/* Quick Order Search input */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search Order #, customer, city..."
                    value={orderSearchTerm}
                    onChange={(e) => setOrderSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Folder Pills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'all', label: 'All Orders', count: orders.length, color: 'stone', icon: ShoppingBag },
                  { id: 'confirmed', label: '📂 Confirmed Folder', count: countConfirmed, color: 'amber', icon: FolderCheck },
                  { id: 'processing', label: '⚙️ Processing & Steaming', count: countProcessing, color: 'blue', icon: Clock },
                  { id: 'in_transit', label: '🚚 In Transit / Courier', count: countInTransit, color: 'indigo', icon: Truck },
                  { id: 'delivered', label: '✅ Delivered to Client', count: countDelivered, color: 'emerald', icon: CheckCircle2 },
                  { id: 'cancelled', label: '❌ Cancelled Orders', count: countCancelled, color: 'rose', icon: AlertCircle }
                ].map((fld) => {
                  const isSelected = activeOrderFolder === fld.id;
                  const Icon = fld.icon;
                  return (
                    <button
                      key={fld.id}
                      onClick={() => setActiveOrderFolder(fld.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-102 ring-2 ring-stone-900/20'
                          : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-stone-200/80 text-stone-700'
                        }`}>
                          {fld.count}
                        </span>
                      </div>
                      <span className="text-xs font-bold mt-2 truncate">{fld.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. ORDER CARDS PIPELINE LIST */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Showing {filteredOrders.length} orders in "{activeOrderFolder.toUpperCase()}" folder
                </span>
                <button
                  onClick={fetchData}
                  className="text-xs text-stone-600 hover:text-stone-900 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Orders</span>
                </button>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200 text-stone-400 space-y-2">
                  <Package className="w-10 h-10 mx-auto text-stone-300" />
                  <p className="text-sm font-semibold text-stone-600">No orders currently in this folder.</p>
                  <p className="text-xs text-stone-400">Orders placed by customers will automatically register here.</p>
                </div>
              ) : (
                filteredOrders.map((ord) => {
                  const status = ord.status || 'Confirmed';
                  const statusBadgeColor = {
                    'Confirmed': 'bg-amber-100 text-amber-900 border-amber-300',
                    'Processing': 'bg-blue-100 text-blue-900 border-blue-300',
                    'In Transit': 'bg-purple-100 text-purple-900 border-purple-300',
                    'Delivered': 'bg-emerald-100 text-emerald-900 border-emerald-300',
                    'Cancelled': 'bg-red-100 text-red-900 border-red-300'
                  }[status] || 'bg-stone-100 text-stone-800 border-stone-300';

                  return (
                    <div
                      key={ord.id || ord.orderNumber}
                      className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition-shadow p-5 sm:p-6 space-y-4"
                    >
                      {/* Order Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-xs font-semibold text-stone-400">Order Ref:</span>
                          <span className="font-mono font-bold text-base text-stone-900">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-stone-300">|</span>
                          <span className="text-xs text-stone-500">
                            {new Date(ord.createdAt).toLocaleString()}
                          </span>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${statusBadgeColor}`}>
                            ● {status}
                          </span>

                          {ord.folder && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 text-stone-600 border border-stone-200">
                              Folder: {ord.folder}
                            </span>
                          )}
                        </div>

                        {/* Order Action Buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => setInspectingOrder(ord)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-stone-600" />
                            <span>Inspect & Timeline</span>
                          </button>

                          <button
                            onClick={() => setInvoiceOrder(ord)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5 text-amber-800" />
                            <span>Print Invoice</span>
                          </button>

                          <button
                            onClick={() => setPreviewEmail({
                              order: ord,
                              status: ord.status,
                              to: ord.customer?.email
                            })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-xs font-semibold transition-colors cursor-pointer"
                            title="Preview simulated email sent to customer"
                          >
                            <Mail className="w-3.5 h-3.5 text-indigo-700" />
                            <span>View Email</span>
                          </button>
                        </div>
                      </div>

                      {/* Order Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-stone-600">
                        {/* Customer Column */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                            Client & Delivery Destination
                          </span>
                          <p className="font-bold text-stone-900 text-sm">{ord.customer?.fullName}</p>
                          <p className="text-stone-700 font-medium">{ord.customer?.phone}</p>
                          <p className="text-stone-500 font-mono text-[11px]">{ord.customer?.email}</p>
                          <p className="text-stone-600 pt-1">
                            {ord.customer?.address}, <strong>{ord.customer?.city || 'Multan'}</strong>
                          </p>
                          {ord.customer?.notes && (
                            <p className="text-amber-800 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60 mt-1">
                              <strong>Client Note:</strong> {ord.customer.notes}
                            </p>
                          )}
                        </div>

                        {/* Items Column */}
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                            Ordered Garments ({ord.items?.length || 0})
                          </span>
                          <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
                            {ord.items?.map((it, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-stone-50 p-2 rounded-xl border border-stone-100">
                                <div>
                                  <p className="font-semibold text-stone-900 line-clamp-1">{it.name}</p>
                                  <p className="text-[10px] text-stone-400">Qty: {it.quantity} • Size: {it.size || 'M'} • Color: {it.color || 'Standard'}</p>
                                </div>
                                <span className="font-bold text-stone-800">
                                  Rs. {(it.price * it.quantity).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between pt-2 border-t border-stone-100 text-xs font-bold text-stone-900">
                            <span>Total (incl. Rs. {ord.shippingCost || 200} courier):</span>
                            <span>Rs. {(ord.total || 0).toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Pipeline Stage Transitions Column */}
                        <div className="space-y-2 bg-stone-50/80 p-3.5 rounded-2xl border border-stone-200/80 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                              1-Click Stage Transitions (فولڈر تبدیل کریں)
                            </span>
                            <p className="text-[11px] text-stone-500 mb-2">
                              Advance this order to trigger customer in-app notifications and email dispatch.
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5">
                            {status === 'Confirmed' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'Processing', 'Order moved to steam press & tailoring queue')}
                                className="py-2 px-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer text-center"
                              >
                                ⚙️ Move Processing
                              </button>
                            )}

                            {(status === 'Confirmed' || status === 'Processing') && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'In Transit', 'Package handed over to TCS courier rider', `TRK-NV-${Math.floor(10000 + Math.random() * 90000)}`)}
                                className="py-2 px-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer text-center"
                              >
                                🚚 Mark In Transit
                              </button>
                            )}

                            {status === 'In Transit' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'Delivered', 'Delivered safely to client address')}
                                className="py-2 px-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold transition-all shadow-xs cursor-pointer text-center col-span-2"
                              >
                                ✅ Mark Delivered
                              </button>
                            )}

                            {status !== 'Cancelled' && status !== 'Delivered' && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to cancel order #${ord.orderNumber}?`)) {
                                    handleUpdateOrderStatus(ord.id || ord.orderNumber, 'Cancelled', 'Cancelled per client request or boutique stock reconciliation');
                                  }
                                }}
                                className="py-2 px-2.5 rounded-xl bg-white hover:bg-red-50 text-red-700 border border-red-200 text-[11px] font-semibold transition-all cursor-pointer text-center"
                              >
                                ❌ Cancel Order
                              </button>
                            )}

                            {status === 'Cancelled' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(ord.id || ord.orderNumber, 'Confirmed', 'Restored back to confirmed folder')}
                                className="py-2 px-2.5 rounded-xl bg-stone-900 text-white text-[11px] font-bold transition-all cursor-pointer text-center col-span-2"
                              >
                                ↩ Re-Confirm Order
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: INVENTORY & STOCK MANAGEMENT                            */}
        {/* ============================================================== */}
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
                  className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
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
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Hanger Rack</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4">Units</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredProducts.map((prod) => {
                    const isAvail = prod.inStock !== false && (prod.stockCount === undefined || prod.stockCount > 0);
                    return (
                      <tr key={prod.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-14 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                              <img
                                src={prod.hangerImage || prod.images?.[0]}
                                alt={prod.name}
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-stone-900">{prod.name}</p>
                              <p className="text-[11px] text-stone-400">{prod.category} • {prod.gender}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-stone-900">
                          Rs. {prod.price.toLocaleString()}
                        </td>
                        <td className="py-3.5 px-4">
                          {prod.isHangerItem ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300/60">
                              <Shirt className="w-3 h-3 text-amber-800" />
                              <span>Hanger Rack</span>
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">Standard Shelf</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStock(prod)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              isAvail
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                                : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                            }`}
                          >
                            {isAvail ? '● In Stock' : '✕ Out of Stock'}
                          </button>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold">
                          {prod.stockCount ?? 10}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => setEditingProduct(prod)}
                            className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Piece"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove Piece"
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

        {/* ============================================================== */}
        {/* TAB 3: CUSTOMER NOTIFICATIONS & EMAIL LOGS (Requested by User) */}
        {/* ============================================================== */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-700" />
                  <span>Customer Notifications & Email Dispatch Log</span>
                </h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Whenever an order status changes, in-app notifications and simulated HTML emails are automatically dispatched to clients.
                </p>
              </div>

              <button
                onClick={fetchData}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-xl text-xs font-semibold text-stone-700 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Log</span>
              </button>
            </div>

            {notifications.length === 0 ? (
              <div className="p-8 text-center text-stone-400 text-xs">
                No notifications logged yet. Updating any order will dispatch an email and notification.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-stone-600">
                  <thead className="bg-stone-50 text-stone-400 font-bold uppercase tracking-wider border-y border-stone-200 text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Date / Time</th>
                      <th className="py-3 px-4">Recipient</th>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Triggered Status</th>
                      <th className="py-3 px-4">Notification Message</th>
                      <th className="py-3 px-4">Email Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {notifications.map((notif) => (
                      <tr key={notif.id} className="hover:bg-stone-50/50 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(notif.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-stone-900">{notif.customerName || 'Client'}</p>
                          <p className="text-[10px] text-stone-400">{notif.customerEmail}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-stone-900">
                          #{notif.orderNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {notif.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-stone-700">
                          {notif.message}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>Dispatched</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1">
                          <button
                            onClick={() => {
                              const relatedOrder = orders.find(o => o.id === notif.orderId || o.orderNumber === notif.orderNumber);
                              setPreviewEmail({
                                order: relatedOrder || { orderNumber: notif.orderNumber, customer: { fullName: notif.customerName, email: notif.customerEmail } },
                                status: notif.status,
                                to: notif.customerEmail
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-[11px] font-semibold cursor-pointer"
                          >
                            Preview Email
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: REGISTERED CLIENTS DIRECTORY                            */}
        {/* ============================================================== */}
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
                        <p className="text-stone-900">{c.email}</p>
                        <p className="text-stone-400 text-[11px]">{c.phone} • {c.city}</p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {c.vipTier || 'Silver Wardrobe Member'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold">{c.totalOrders ?? 1}</td>
                      <td className="py-3.5 px-4 font-semibold text-stone-900">
                        Rs. {(c.totalSpent ?? 3500).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-stone-500">
                        {c.measurements ? (
                          <span>Chest: {c.measurements.chest} • Shoulder: {c.measurements.shoulder}</span>
                        ) : (
                          <span>Standard M Silhouette</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: FINANCIALS & WARDROBE RAIL AUDIO TESTING                */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Order Pipeline Volume & Revenue
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Gross Sales Volume</span>
                    <span className="font-bold text-stone-900">Rs. {totalCalculatedRevenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Average Order Value</span>
                    <span className="font-bold text-stone-900">
                      Rs. {orders.length > 0 ? Math.round(totalCalculatedRevenue / orders.length).toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Total Tracked Pieces Shipped</span>
                    <span className="font-bold text-stone-900">
                      {orders.reduce((sum, o) => sum + (o.items?.reduce((s, it) => s + (it.quantity || 1), 0) || 0), 0)} items
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Boutique Closet Rail & Audio Synthesis
                </h3>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => playHangerClinkSound()}
                    className="px-3.5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold cursor-pointer hover:bg-black"
                  >
                    Test Rail Clink Sound
                  </button>
                  <button
                    onClick={() => playHangerSlideSound()}
                    className="px-3.5 py-2 rounded-xl bg-amber-800 text-white text-xs font-semibold cursor-pointer hover:bg-amber-900"
                  >
                    Test Rail Slide Sound
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: DETAILED ORDER INSPECTOR & TIMELINE                   */}
      {/* ============================================================== */}
      {inspectingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Order Inspector & Audit Timeline
                </h3>
                <p className="text-xs text-stone-500 font-mono">
                  Ref: #{inspectingOrder.orderNumber} • Placed on {new Date(inspectingOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setInspectingOrder(null)} className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-xs space-y-1">
              <p className="font-bold text-stone-900 text-sm">{inspectingOrder.customer?.fullName}</p>
              <p className="text-stone-600">Phone: {inspectingOrder.customer?.phone} • Email: {inspectingOrder.customer?.email}</p>
              <p className="text-stone-600">Address: {inspectingOrder.customer?.address}, {inspectingOrder.customer?.city}</p>
              <p className="text-indigo-800 font-semibold pt-1">
                Courier Tracking: {inspectingOrder.trackingCode || 'TRK-NV-3341'} ({inspectingOrder.courier || 'TCS Express'})
              </p>
            </div>

            {/* Chronological Audit Timeline */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">
                Order Lifecycle Timeline (آرڈر کی تاریخ)
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-amber-600">
                {(inspectingOrder.timeline || [
                  { status: inspectingOrder.status || 'Confirmed', timestamp: inspectingOrder.createdAt, note: 'Order placed by client', updatedBy: 'System' }
                ]).map((step, idx) => (
                  <div key={idx} className="relative pl-4 space-y-0.5 text-xs">
                    <span className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-amber-600 border-2 border-white" />
                    <div className="flex items-center gap-2">
                      <strong className="text-stone-900">{step.status}</strong>
                      <span className="text-[10px] text-stone-400 font-mono">{new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}, {new Date(step.timestamp).toLocaleDateString()}</span>
                    </div>
                    <p className="text-stone-600 text-[11px]">{step.note}</p>
                    <p className="text-[10px] text-stone-400">By: {step.updatedBy || 'Boutique Operations'}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-stone-200">
              <button
                onClick={() => handleResendEmail(inspectingOrder.id || inspectingOrder.orderNumber)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Resend Notification Email</span>
              </button>
              <button
                onClick={() => setInspectingOrder(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold cursor-pointer hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: PREVIEW DISPATCHED EMAIL (Simulated Client Inbox)     */}
      {/* ============================================================== */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Client Email Dispatch Preview
                </span>
                <h3 className="text-base font-serif font-bold text-stone-900 mt-1">
                  Sent to: {previewEmail.to || 'customer@example.com'}
                </h3>
              </div>
              <button onClick={() => setPreviewEmail(null)} className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Envelope Header */}
            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs text-stone-600 space-y-1">
              <p><strong>From:</strong> orders@novae-atelier.com (NOVAÉ Boutique Concierge)</p>
              <p><strong>To:</strong> {previewEmail.order?.customer?.fullName} &lt;{previewEmail.to}&gt;</p>
              <p><strong>Subject:</strong> NOVAÉ Order Update: #{previewEmail.order?.orderNumber} is now {previewEmail.status}</p>
            </div>

            {/* Email Rendered Template */}
            <div className="border border-stone-200 rounded-2xl p-6 bg-[#FAF8F5]">
              <div className="text-center pb-4 border-b border-stone-200">
                <h2 className="font-serif tracking-[0.25em] font-bold text-xl uppercase text-stone-900">NOVAÉ</h2>
                <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">Haute Couture & Everyday Living</p>
              </div>

              <div className="py-6 text-center space-y-2">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-800 text-white uppercase tracking-wider">
                  {previewEmail.status || 'Confirmed'}
                </span>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  Your Order #{previewEmail.order?.orderNumber} Status Update
                </h3>
                <p className="text-xs text-stone-600 max-w-md mx-auto">
                  Dear {previewEmail.order?.customer?.fullName || 'Client'}, your order is currently <strong>{previewEmail.status || 'Confirmed'}</strong>. Our boutique operations are tracking your pieces with courier partner TCS Express.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between font-mono text-stone-500 border-b border-stone-100 pb-2">
                  <span>Order Ref: #{previewEmail.order?.orderNumber}</span>
                  <span>Total: Rs. {(previewEmail.order?.total || 0).toLocaleString()}</span>
                </div>
                <div className="text-stone-700">
                  <p><strong>Shipping To:</strong> {previewEmail.order?.customer?.address}, {previewEmail.order?.customer?.city}</p>
                  <p><strong>Tracking #:</strong> {previewEmail.order?.trackingCode || 'TRK-NV-3341'} (TCS Express)</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <button
                onClick={() => setPreviewEmail(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold cursor-pointer hover:bg-black"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ADD NEW PRODUCT MODAL                                 */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">
                  List New Boutique Garment
                </h3>
                <p className="text-xs text-stone-500">Provide garment details, local photo upload, and hanger rack configuration.</p>
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
                  <label className="font-semibold text-stone-700 block mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    placeholder="4500"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Original Price</label>
                  <input
                    type="number"
                    placeholder="5500"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Department</label>
                  <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900 bg-white"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    value={newProduct.stockCount}
                    onChange={(e) => setNewProduct({ ...newProduct, stockCount: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              {/* Photo Upload from Computer */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <span className="font-semibold text-stone-800 block">Garment Photo (Computer Upload)</span>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 rounded-xl bg-stone-200 overflow-hidden shrink-0 border border-stone-300">
                    <img src={newProduct.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'new')}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-stone-400">Supported formats: JPG, PNG, WEBP</p>
                  </div>
                </div>
              </div>

              {/* Hanger Rack Configuration */}
              <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-amber-950 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newProduct.isHangerItem}
                      onChange={(e) => setNewProduct({ ...newProduct, isHangerItem: e.target.checked })}
                      className="w-4 h-4 text-amber-900 rounded"
                    />
                    <span>Hang this garment on the Virtual Wardrobe Hanger Rack (👔)</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-200">
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
                  List Piece in Live Boutique
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: EDIT GARMENT MODAL                                    */}
      {/* ============================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <h3 className="text-lg font-serif font-bold text-stone-900">
                Edit Garment: {editingProduct.name}
              </h3>
              <button onClick={() => setEditingProduct(null)} className="p-1 text-stone-400 hover:text-stone-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Name</label>
                  <input
                    type="text"
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">Price (PKR)</label>
                  <input
                    type="number"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: PRINTABLE LUXURY INVOICE MODAL                        */}
      {/* ============================================================== */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[95vh] overflow-y-auto print:shadow-none print:border-none">
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
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                  Dispatch Info
                </span>
                <p className="font-mono font-bold text-stone-900">Order Ref: #{invoiceOrder.orderNumber}</p>
                <p>Date: {new Date(invoiceOrder.createdAt).toLocaleDateString()}</p>
                <p>Status: <strong className="text-amber-800">{invoiceOrder.status || 'Confirmed'}</strong></p>
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
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {invoiceOrder.items?.map((it, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 text-stone-900 font-semibold">{it.name}</td>
                      <td className="py-3 px-4 text-stone-600">{it.size || 'M'}</td>
                      <td className="py-3 px-4 text-center">{it.quantity}</td>
                      <td className="py-3 px-4 text-right text-stone-900 font-bold">
                        Rs. {(it.price * it.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="flex justify-end text-xs">
              <div className="w-64 space-y-1.5">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>Rs. {invoiceOrder.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Courier Delivery:</span>
                  <span>Rs. {invoiceOrder.shippingCost || 200}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-300">
                  <span>Grand Total:</span>
                  <span>Rs. {invoiceOrder.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
