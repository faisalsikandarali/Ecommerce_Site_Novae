import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingBag, DollarSign, Shirt, LogOut, Plus, Trash2, Edit3,
  Check, X, ExternalLink, RefreshCw, Eye, Sparkles, Filter, Search, Clock,
  Users, Printer, FileText, ChevronRight, BarChart3, ShieldCheck, Tag,
  AlertTriangle, Image as ImageIcon, UploadCloud, Upload, Folder, FolderCheck,
  Truck, CheckCircle2, AlertCircle, Mail, Send, Menu, Smartphone, Layers,
  LayoutDashboard, Award
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { api } from '../../services/api';
import { playHangerClinkSound, playHangerSlideSound } from '../../utils/audioFeedback';

export const AdminDashboardPage = ({ onNavigateToStore, onProductsUpdated }) => {
  const { logout, adminUser } = useAdminAuth();

  // Navigation state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'orders' | 'categories' | 'products' | 'customers' | 'notifications' | 'analytics'
  const [activeOrderFolder, setActiveOrderFolder] = useState('all'); // 'all' | 'confirmed' | 'processing' | 'in_transit' | 'delivered' | 'cancelled'
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Data state
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
  const [categories, setCategories] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [folderSummary, setFolderSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [categorySearchTerm, setCategorySearchTerm] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [inspectingOrder, setInspectingOrder] = useState(null);
  const [previewEmail, setPreviewEmail] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  // Category Modal state
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    slug: '',
    department: 'Apparel',
    description: '',
    icon: 'Shirt',
    active: true
  });

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
      const [statsRes, prodRes, ordRes, usersRes, notifsRes, emailsRes, summaryRes, catRes] = await Promise.all([
        api.getAdminStats(),
        api.getProducts(),
        api.getOrders(),
        api.getUsers(),
        api.getNotifications(),
        api.getEmailLogs(),
        api.getOrderFoldersSummary(),
        api.getCategories()
      ]);

      if (statsRes) setStats(statsRes);
      if (prodRes) setProducts(prodRes);
      if (ordRes) setOrders(ordRes);
      if (usersRes) setCustomers(usersRes);
      if (notifsRes) setNotifications(notifsRes);
      if (emailsRes) setEmailLogs(emailsRes);
      if (summaryRes) setFolderSummary(summaryRes);
      if (catRes && catRes.data) {
        setCategories(catRes.data);
      }
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
          cut: newProduct.cut || 'Relaxed Boxy Fit',
          hangerType: newProduct.hangerType || 'Scandi Oak Wood with Brass Hook'
        }
      };

      const created = await api.createProduct(payload);
      setProducts(prev => [created, ...prev]);
      setIsAddModalOpen(false);
      setNewProduct(defaultNewProduct);
      playHangerClinkSound();
      showNotificationSuccess(`"${created.name}" created and hung on live wardrobe rail!`);
      if (onProductsUpdated) onProductsUpdated();
      fetchData();
    } catch (e) {
      alert('Failed to create garment');
    }
  };

  // Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      const updated = await api.updateProduct(editingProduct.id, editingProduct);
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditingProduct(null);
      showNotificationSuccess(`"${updated.name}" updated successfully`);
      if (onProductsUpdated) onProductsUpdated();
      fetchData();
    } catch (e) {
      alert('Failed to update garment');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove "${name}" from the boutique collection?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showNotificationSuccess(`Garment "${name}" removed from wardrobe catalog`);
      if (onProductsUpdated) onProductsUpdated();
      fetchData();
    } catch (e) {
      alert('Failed to remove garment');
    }
  };

  // Quick Stock Toggle
  const handleToggleStock = async (prod) => {
    const nextStock = !prod.inStock;
    try {
      await api.updateProduct(prod.id, { inStock: nextStock, stockCount: nextStock ? 10 : 0 });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, inStock: nextStock, stockCount: nextStock ? (p.stockCount > 0 ? p.stockCount : 10) : 0 } : p));
      if (onProductsUpdated) onProductsUpdated();
      showNotificationSuccess(`${prod.name} marked ${nextStock ? 'In Stock' : 'Out of Stock'}`);
    } catch (e) {
      alert('Failed to update stock');
    }
  };

  // Quick Hanger Toggle
  const handleToggleHanger = async (prod) => {
    const nextHanger = !prod.isHangerItem;
    try {
      await api.updateProduct(prod.id, { isHangerItem: nextHanger });
      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, isHangerItem: nextHanger } : p));
      if (nextHanger) playHangerSlideSound();
      if (onProductsUpdated) onProductsUpdated();
      showNotificationSuccess(`${prod.name} hanger rack display ${nextHanger ? 'Enabled' : 'Disabled'}`);
    } catch (e) {
      alert('Failed to update hanger setting');
    }
  };

  // CATEGORIES CRUD
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      alert('Category name is required');
      return;
    }
    try {
      const created = await api.createCategory(categoryFormData);
      setCategories(prev => [...prev, created]);
      setIsAddCategoryModalOpen(false);
      setCategoryFormData({ name: '', slug: '', department: 'Apparel', description: '', icon: 'Shirt', active: true });
      showNotificationSuccess(`Category "${created.name}" stored in boutique taxonomy!`);
      fetchData();
    } catch (e) {
      alert('Failed to create category');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory) return;
    try {
      const updated = await api.updateCategory(editingCategory.id, editingCategory);
      setCategories(prev => prev.map(c => c.id === updated.id ? updated : c));
      setEditingCategory(null);
      showNotificationSuccess(`Category "${updated.name}" updated successfully!`);
      fetchData();
    } catch (e) {
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`)) return;
    try {
      await api.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      showNotificationSuccess(`Category "${name}" deleted`);
      fetchData();
    } catch (e) {
      alert('Failed to delete category');
    }
  };

  // Update Order Status (Advances folder & dispatches customer notifications)
  const handleUpdateOrderStatus = async (orderId, newStatus, note = '', trackingCode = '') => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, note, trackingCode);
      await fetchData();
      if (newStatus === 'Processing' || newStatus === 'In Transit') {
        playHangerSlideSound();
      } else if (newStatus === 'Delivered') {
        playHangerClinkSound();
      }
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

  // Delete Patron Account
  const handleDeleteCustomer = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove patron account "${name}"?`)) return;
    try {
      await api.deleteUser(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      showNotificationSuccess(`Patron "${name}" account removed`);
    } catch (e) {
      alert('Failed to delete customer');
    }
  };

  // Filters
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const folder = (o.folder || '').toLowerCase();
    const status = (o.status || 'Confirmed').toLowerCase();

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

  const filteredCustomers = customers.filter(c => {
    if (!customerSearchTerm) return true;
    const q = customerSearchTerm.toLowerCase();
    return (
      c.fullName?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.city?.toLowerCase().includes(q) ||
      c.authProvider?.toLowerCase().includes(q)
    );
  });

  const filteredCategories = categories.filter(cat => {
    if (!categorySearchTerm) return true;
    const q = categorySearchTerm.toLowerCase();
    return (
      cat.name?.toLowerCase().includes(q) ||
      cat.slug?.toLowerCase().includes(q) ||
      cat.department?.toLowerCase().includes(q) ||
      cat.description?.toLowerCase().includes(q)
    );
  });

  const totalCalculatedRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);

  // Folder counts
  const countConfirmed = orders.filter(o => (o.status || 'Confirmed').toLowerCase() === 'confirmed').length;
  const countProcessing = orders.filter(o => (o.status || '').toLowerCase() === 'processing').length;
  const countInTransit = orders.filter(o => (o.status || '').toLowerCase() === 'in transit').length;
  const countDelivered = orders.filter(o => (o.status || '').toLowerCase() === 'delivered').length;
  const countCancelled = orders.filter(o => (o.status || '').toLowerCase() === 'cancelled').length;

  return (
    <div className="min-h-screen bg-[#0C0C0E] text-stone-100 flex font-sans select-none antialiased">
      {/* MOBILE SIDEBAR OVERLAY */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* 1. LEFT SIDEBAR */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 sm:w-72 bg-[#101013] border-r border-[#222227] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Brand & Suite Header */}
        <div>
          <div className="p-6 border-b border-[#1E1E24]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-serif font-black text-black text-sm shadow-lg shadow-amber-500/20">
                  N
                </div>
                <div>
                  <h1 className="font-serif tracking-[0.22em] font-bold text-sm uppercase text-stone-100 leading-tight">
                    NOVAÉ ATELIER
                  </h1>
                  <span className="text-[9px] uppercase tracking-widest font-mono text-amber-400/90 font-semibold block">
                    Operations Suite v2.6
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="lg:hidden text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 px-3 py-1.5 rounded-lg bg-[#16161A] border border-[#26262F] flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Rail Store
              </span>
              <span className="font-mono text-amber-400/80 text-[10px]">PKT</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => { setActiveTab('overview'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'overview'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-[#1A1A20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Executive Overview</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'orders'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-[#1A1A20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Folder className="w-4 h-4" />
                <span>Orders & Folders</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'orders' ? 'bg-black text-amber-300' : 'bg-stone-800 text-stone-300'
              }`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('categories'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'categories'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-[#1A1A20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4" />
                <span>Categories Store</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'categories' ? 'bg-black text-amber-300' : 'bg-stone-800 text-stone-300'
              }`}>
                {categories.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('products'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'products'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-[#1A1A20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Shirt className="w-4 h-4" />
                <span>Wardrobe Inventory</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'products' ? 'bg-black text-amber-300' : 'bg-stone-800 text-stone-300'
              }`}>
                {products.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('customers'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'customers'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-[#1A1A20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Registered Patrons</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'customers' ? 'bg-black text-amber-300' : 'bg-stone-800 text-stone-300'
              }`}>
                {customers.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('notifications'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'notifications'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-[#1A1A20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Notifications & Emails</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                activeTab === 'notifications' ? 'bg-black text-amber-300' : 'bg-stone-800 text-stone-300'
              }`}>
                {notifications.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('analytics'); setIsMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-100 hover:bg-[#1A1A20]'
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart3 className="w-4 h-4" />
                <span>Analytics & Reports</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="p-4 border-t border-[#1E1E24] space-y-3">
          <div className="p-3 rounded-2xl bg-[#16161A] border border-[#25252E] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 font-bold text-xs shrink-0">
              AD
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-stone-100 truncate">{adminUser?.name || 'Director Faisal'}</p>
              <p className="text-[10px] text-stone-400 truncate">Store Curator</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onNavigateToStore}
              className="py-2 px-3 rounded-xl bg-[#1D1D24] hover:bg-[#252530] text-stone-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-[#2C2C36]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Store</span>
            </button>
            <button
              onClick={logout}
              className="py-2 px-3 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-red-900/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header className="h-16 px-4 sm:px-8 border-b border-[#202026] bg-[#0E0E11]/90 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden text-stone-400 hover:text-white p-2 rounded-xl bg-[#1A1A20]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-200">
                {activeTab === 'overview' && 'Executive Metrics & Revenue'}
                {activeTab === 'orders' && 'Order Folders Pipeline (Confirmed / Dispatch)'}
                {activeTab === 'categories' && 'Categories Taxonomy Management'}
                {activeTab === 'products' && 'Wardrobe Inventory & Hanger Rail'}
                {activeTab === 'customers' && 'Registered Patrons (Google / Phone / Email)'}
                {activeTab === 'notifications' && 'In-App Customer Notifications & Email Audit'}
                {activeTab === 'analytics' && 'Boutique Sales & Financial Performance'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === 'products' && (
              <button
                onClick={() => { setNewProduct(defaultNewProduct); setIsAddModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Garment</span>
              </button>
            )}

            {activeTab === 'categories' && (
              <button
                onClick={() => { setCategoryFormData({ name: '', slug: '', department: 'Apparel', description: '', icon: 'Shirt', active: true }); setIsAddCategoryModalOpen(true); }}
                className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            )}

            <button
              onClick={fetchData}
              title="Refresh Live Data"
              className="p-2 rounded-xl bg-[#1A1A20] hover:bg-[#252530] text-stone-300 border border-[#2B2B36] transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Floating Action Success Toast */}
        {actionSuccessMessage && (
          <div className="fixed top-20 right-6 z-50 bg-emerald-950 text-emerald-200 px-4 py-3 rounded-2xl shadow-2xl border border-emerald-700/80 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}

        {/* View Contents */}
        <main className="p-4 sm:p-8 space-y-8 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Executive KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="p-6 rounded-3xl bg-[#131317] border border-[#22222B] shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Net Revenue</span>
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    Rs. {(totalCalculatedRevenue || stats.totalRevenue || 0).toLocaleString()}
                  </h3>
                  <p className="text-[11px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
                    <span>↑ 18.4%</span>
                    <span className="text-stone-500">vs last month atelier target</span>
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#131317] border border-[#22222B] shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Orders</span>
                    <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <FolderCheck className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {orders.length}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-2 font-medium">
                    {countConfirmed} confirmed • {countProcessing + countInTransit} active in pipeline
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#131317] border border-[#22222B] shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Categories Stored</span>
                    <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <Tag className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {categories.length}
                  </h3>
                  <p className="text-[11px] text-stone-400 mt-2 font-medium">
                    Stored in categories.json & synced
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-[#131317] border border-[#22222B] shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Registered Patrons</span>
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-stone-100">
                    {customers.length}
                  </h3>
                  <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                    Google, Phone & Email verified accounts
                  </p>
                </div>
              </div>

              {/* Quick Actions & Recent Orders Banner */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-[#131317] border border-[#22222B]">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-stone-200">
                      Recent Confirmed Orders
                    </h4>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-amber-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>View All Folders</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-[#202028]">
                    {orders.slice(0, 5).map(ord => (
                      <div key={ord.id} className="py-3.5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-stone-800 flex items-center justify-center text-xs font-mono font-bold text-stone-300">
                            #{ord.orderNumber?.slice(-3)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-stone-100">{ord.customer?.fullName || 'Patron'}</p>
                            <p className="text-[11px] text-stone-500">{ord.customer?.city || 'Multan'} • {new Date(ord.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            ord.status === 'Confirmed' ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' :
                            ord.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {ord.status || 'Confirmed'}
                          </span>
                          <span className="text-xs font-mono font-bold text-stone-100">
                            Rs. {(ord.total || 0).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-[#131317] border border-[#22222B] flex flex-col justify-between space-y-6">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      Quick Shortcuts
                    </span>
                    <h4 className="text-base font-bold text-stone-100 mt-3">
                      Atelier Operations
                    </h4>
                    <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                      Instant links to wardrobe collection catalog, categories taxonomy, and customer accounts.
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab('categories')}
                      className="w-full py-3 px-4 rounded-xl bg-[#1A1A22] hover:bg-[#22222C] border border-[#2B2B38] text-xs font-semibold text-stone-200 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Tag className="w-4 h-4 text-purple-400" />
                        <span>Manage Categories taxonomy</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-500" />
                    </button>

                    <button
                      onClick={() => setActiveTab('customers')}
                      className="w-full py-3 px-4 rounded-xl bg-[#1A1A22] hover:bg-[#22222C] border border-[#2B2B38] text-xs font-semibold text-stone-200 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Users className="w-4 h-4 text-emerald-400" />
                        <span>Inspect Patron accounts</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-500" />
                    </button>

                    <button
                      onClick={() => { setNewProduct(defaultNewProduct); setIsAddModalOpen(true); }}
                      className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Hang New Atelier Garment</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & FOLDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Order Folders Navigator */}
              <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#141418] rounded-2xl border border-[#24242E]">
                {[
                  { id: 'all', label: 'All Orders', count: orders.length, color: 'text-stone-300' },
                  { id: 'confirmed', label: 'Confirmed Folder', count: countConfirmed, color: 'text-amber-400' },
                  { id: 'processing', label: 'Processing & Atelier', count: countProcessing, color: 'text-blue-400' },
                  { id: 'in_transit', label: 'In Transit (TCS)', count: countInTransit, color: 'text-purple-400' },
                  { id: 'delivered', label: 'Delivered Folder', count: countDelivered, color: 'text-emerald-400' },
                  { id: 'cancelled', label: 'Cancelled Folder', count: countCancelled, color: 'text-red-400' }
                ].map(folder => (
                  <button
                    key={folder.id}
                    onClick={() => setActiveOrderFolder(folder.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                      activeOrderFolder === folder.id
                        ? 'bg-amber-400 text-stone-950 font-bold shadow'
                        : 'text-stone-400 hover:text-stone-100 hover:bg-[#1E1E26]'
                    }`}
                  >
                    <span>{folder.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                      activeOrderFolder === folder.id ? 'bg-black text-amber-300' : 'bg-stone-800 text-stone-400'
                    }`}>
                      {folder.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Order Search Filter */}
              <div className="flex items-center gap-3 bg-[#131317] border border-[#24242E] px-4 py-3 rounded-2xl">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Filter by Order # (e.g. NV-1234), Customer Name, Phone, or City..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-100 placeholder-stone-500 focus:outline-none"
                />
              </div>

              {/* Orders Table */}
              <div className="bg-[#131317] border border-[#22222B] rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#18181E] text-stone-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#252530]">
                      <tr>
                        <th className="py-4 px-6">Order Ref</th>
                        <th className="py-4 px-6">Patron Details</th>
                        <th className="py-4 px-6">Curated Items</th>
                        <th className="py-4 px-6">Total Value</th>
                        <th className="py-4 px-6">Current Pipeline Status</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F1F27]">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-stone-500">
                            No orders found matching the selected folder or search query.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map(ord => (
                          <tr key={ord.id} className="hover:bg-[#16161B] transition-colors">
                            <td className="py-4 px-6 font-mono font-bold text-amber-400">
                              #{ord.orderNumber}
                              <p className="text-[10px] text-stone-500 font-sans font-normal mt-0.5">
                                {new Date(ord.createdAt).toLocaleDateString()}
                              </p>
                            </td>
                            <td className="py-4 px-6">
                              <p className="font-bold text-stone-100">{ord.customer?.fullName}</p>
                              <p className="text-[11px] text-stone-400">{ord.customer?.phone}</p>
                              <p className="text-[10px] text-stone-500">{ord.customer?.city}</p>
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-stone-300">
                                {ord.items?.length || 0} piece(s)
                              </p>
                              <p className="text-[10px] text-stone-500 truncate max-w-xs">
                                {ord.items?.map(it => `${it.name} (x${it.quantity})`).join(', ')}
                              </p>
                            </td>
                            <td className="py-4 px-6 font-mono font-bold text-stone-100">
                              Rs. {(ord.total || 0).toLocaleString()}
                              <p className="text-[10px] text-emerald-400 font-sans font-normal">{ord.paymentMethod || 'COD'}</p>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2">
                                <select
                                  value={ord.status || 'Confirmed'}
                                  onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                                  className="px-2.5 py-1.5 rounded-xl bg-[#1C1C24] border border-[#2D2D3A] text-xs font-semibold text-stone-200 focus:outline-none focus:border-amber-400 cursor-pointer"
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Processing">Processing</option>
                                  <option value="In Transit">In Transit</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => setInvoiceOrder(ord)}
                                  title="Print Official Invoice"
                                  className="p-2 rounded-xl bg-[#1D1D24] hover:bg-[#252530] text-stone-300 hover:text-white transition-colors cursor-pointer border border-[#2D2D3A]"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleResendEmail(ord.id)}
                                  title="Resend Client Notification Email"
                                  className="p-2 rounded-xl bg-[#1D1D24] hover:bg-[#252530] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer border border-[#2D2D3A]"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORIES MANAGEMENT (STORED IN categories.json) */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-100">
                    Boutique Categories Taxonomy
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Managed directly in <code className="text-amber-300 font-mono">backend/src/data/categories.json</code>. Changes reflect immediately on catalog filters.
                  </p>
                </div>
                <button
                  onClick={() => { setCategoryFormData({ name: '', slug: '', department: 'Apparel', description: '', icon: 'Shirt', active: true }); setIsAddCategoryModalOpen(true); }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs transition-all shadow active:scale-95 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              </div>

              {/* Search Category */}
              <div className="flex items-center gap-3 bg-[#131317] border border-[#24242E] px-4 py-3 rounded-2xl">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search categories by name, slug, department, or description..."
                  value={categorySearchTerm}
                  onChange={(e) => setCategorySearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-100 placeholder-stone-500 focus:outline-none"
                />
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map(cat => (
                  <div key={cat.id} className="p-6 rounded-3xl bg-[#131317] border border-[#22222B] shadow-lg flex flex-col justify-between space-y-4 hover:border-[#33333F] transition-colors">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-[#1C1C24] text-purple-300 border border-purple-500/20">
                          {cat.department || 'Apparel'}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          cat.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {cat.active ? 'Active' : 'Archived'}
                        </span>
                      </div>

                      <h4 className="text-lg font-serif font-bold text-stone-100">
                        {cat.name}
                      </h4>
                      <p className="text-[11px] font-mono text-amber-400/80 mt-0.5">
                        slug: /{cat.slug}
                      </p>
                      <p className="text-xs text-stone-400 mt-2 leading-relaxed">
                        {cat.description || 'Curated boutique wardrobe garments.'}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#1F1F27] flex items-center justify-between">
                      <span className="text-xs font-semibold text-stone-300">
                        {cat.itemCount || 0} garment(s)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingCategory(cat)}
                          title="Edit Category"
                          className="p-2 rounded-xl bg-[#1C1C24] hover:bg-[#252530] text-stone-300 hover:text-white transition-colors cursor-pointer border border-[#2A2A38]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          title="Delete Category"
                          className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 transition-colors cursor-pointer border border-red-900/30"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WARDROBE INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 bg-[#131317] border border-[#24242E] px-4 py-3 rounded-2xl">
                  <Search className="w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search garments by name, category, or gender..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-transparent text-xs text-stone-100 placeholder-stone-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-[#131317] border border-[#22222B] rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#18181E] text-stone-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#252530]">
                      <tr>
                        <th className="py-4 px-6">Garment</th>
                        <th className="py-4 px-6">Category & Department</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Stock Status</th>
                        <th className="py-4 px-6">3D Hanger Rail</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F1F27]">
                      {filteredProducts.map(prod => (
                        <tr key={prod.id} className="hover:bg-[#16161B] transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.images?.[0] || prod.imageUrl}
                                alt={prod.name}
                                className="w-12 h-14 object-cover object-top rounded-xl bg-stone-800 border border-stone-700/60"
                              />
                              <div>
                                <p className="font-bold text-stone-100">{prod.name}</p>
                                <p className="text-[10px] text-stone-400">{prod.subtitle}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-1 rounded-md bg-[#1C1C24] text-purple-300 font-semibold border border-purple-500/20">
                              {prod.category}
                            </span>
                            <span className="ml-2 text-stone-400 text-[11px]">{prod.gender}</span>
                          </td>
                          <td className="py-4 px-6 font-mono font-bold text-stone-100">
                            Rs. {prod.price.toLocaleString()}
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleStock(prod)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-all ${
                                prod.inStock
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                              }`}
                            >
                              {prod.inStock ? `In Stock (${prod.stockCount || 10})` : 'Out of Stock'}
                            </button>
                          </td>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleHanger(prod)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase cursor-pointer transition-all ${
                                prod.isHangerItem
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                  : 'bg-stone-800 text-stone-400'
                              }`}
                            >
                              {prod.isHangerItem ? 'Hung on Rail' : 'Folded Only'}
                            </button>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(prod)}
                                title="Edit Garment"
                                className="p-2 rounded-xl bg-[#1C1C24] hover:bg-[#252530] text-stone-300 hover:text-white transition-colors cursor-pointer border border-[#2A2A38]"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.name)}
                                title="Delete Garment"
                                className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 transition-colors cursor-pointer border border-red-900/30"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: REGISTERED PATRONS / USERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-100">
                    Registered Patrons Directory
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">
                    Users registered via Google, Phone, or Email (Zero OTP). Orders placed are automatically linked.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/20">
                  {customers.length} Patrons Total
                </span>
              </div>

              {/* Customer Search Filter */}
              <div className="flex items-center gap-3 bg-[#131317] border border-[#24242E] px-4 py-3 rounded-2xl">
                <Search className="w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search patrons by Name, Email, Phone number, or City..."
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  className="w-full bg-transparent text-xs text-stone-100 placeholder-stone-500 focus:outline-none"
                />
              </div>

              {/* Customers Table */}
              <div className="bg-[#131317] border border-[#22222B] rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#18181E] text-stone-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#252530]">
                      <tr>
                        <th className="py-4 px-6">Patron Profile</th>
                        <th className="py-4 px-6">Contact & Location</th>
                        <th className="py-4 px-6">Auth Method</th>
                        <th className="py-4 px-6">Orders Placed</th>
                        <th className="py-4 px-6">Lifetime Spend</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F1F27]">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-12 text-center text-stone-500">
                            No registered patron accounts found.
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map(user => (
                          <tr key={user.id} className="hover:bg-[#16161B] transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <img
                                  src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                                  alt={user.fullName}
                                  className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                                />
                                <div>
                                  <p className="font-bold text-stone-100">{user.fullName || 'Patron'}</p>
                                  <span className="text-[10px] text-amber-400 font-medium">
                                    {user.vipTier || 'Wardrobe Member'}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <p className="text-stone-300 font-mono">{user.email}</p>
                              <p className="text-[11px] text-stone-400 font-mono">{user.phone || '—'}</p>
                              <p className="text-[10px] text-stone-500">{user.city || 'Multan'}</p>
                            </td>
                            <td className="py-4 px-6">
                              {user.authProvider === 'google' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold">
                                  <span>Google 1-Click</span>
                                </span>
                              ) : user.authProvider === 'phone' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                                  <span>Phone Verified</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700 text-[10px] font-bold">
                                  <span>Email Verified</span>
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6 font-mono font-bold text-stone-200">
                              {user.totalOrders || 0} order(s)
                            </td>
                            <td className="py-4 px-6 font-mono font-bold text-amber-300">
                              Rs. {(user.totalSpent || 0).toLocaleString()}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => handleDeleteCustomer(user.id, user.fullName)}
                                title="Remove Patron Record"
                                className="p-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-300 transition-colors cursor-pointer border border-red-900/30"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: NOTIFICATIONS & EMAILS */}
          {activeTab === 'notifications' && (
            <div className="space-y-8">
              {/* In-app notifications */}
              <div className="bg-[#131317] border border-[#22222B] rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold uppercase tracking-wider text-stone-200 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span>In-App Customer Notifications Log</span>
                </h3>
                <div className="divide-y divide-[#1F1F27]">
                  {notifications.slice(0, 10).map(n => (
                    <div key={n.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <p className="font-bold text-stone-100 text-xs">{n.title}</p>
                        <p className="text-[11px] text-stone-400">{n.message}</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">To: {n.customerName} ({n.customerEmail})</p>
                      </div>
                      <span className="text-[10px] text-stone-400 font-mono shrink-0">
                        {new Date(n.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email logs */}
              <div className="bg-[#131317] border border-[#22222B] rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-base font-bold uppercase tracking-wider text-stone-200 flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-400" />
                  <span>Dispatched Simulated Email Audit Trail</span>
                </h3>
                <div className="divide-y divide-[#1F1F27]">
                  {emailLogs.slice(0, 10).map(eml => (
                    <div key={eml.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="font-bold text-stone-100 text-xs">{eml.subject}</p>
                        <p className="text-[11px] text-stone-400">Recipient: {eml.toName} &lt;{eml.to}&gt;</p>
                        <p className="text-[10px] text-stone-500 mt-0.5">Status: {eml.status} • Tracking: {eml.trackingCode || 'NV-2026'}</p>
                      </div>
                      <button
                        onClick={() => setPreviewEmail(eml)}
                        className="px-3 py-1.5 bg-[#1E1E26] hover:bg-[#282834] text-stone-200 rounded-xl text-xs font-semibold self-start sm:self-auto border border-[#2F2F3D] cursor-pointer"
                      >
                        Inspect HTML Email
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-3xl bg-[#131317] border border-[#22222B]">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Average Order Value</span>
                  <h3 className="text-2xl font-serif font-bold text-stone-100 mt-2">
                    Rs. {orders.length > 0 ? Math.round(totalCalculatedRevenue / orders.length).toLocaleString() : 0}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">Based on {orders.length} total orders</p>
                </div>
                <div className="p-6 rounded-3xl bg-[#131317] border border-[#22222B]">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Catalog Conversion Rate</span>
                  <h3 className="text-2xl font-serif font-bold text-emerald-400 mt-2">
                    4.82%
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">Top category: Tops & Shirts</p>
                </div>
                <div className="p-6 rounded-3xl bg-[#131317] border border-[#22222B]">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Hanger Rail Engagement</span>
                  <h3 className="text-2xl font-serif font-bold text-amber-400 mt-2">
                    94.1%
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">3D interactive sway viewer clicks</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* CREATE CATEGORY MODAL */}
      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#262632] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#22222C] pb-4">
              <h3 className="text-lg font-serif font-bold text-stone-100">Add New Category</h3>
              <button onClick={() => setIsAddCategoryModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Formal Suits or Summer Linens"
                  value={categoryFormData.name}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Department / Taxonomy</label>
                <select
                  value={categoryFormData.department}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Apparel">Apparel</option>
                  <option value="Layering">Layering</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief description for customer catalog browsing..."
                  value={categoryFormData.description}
                  onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1D1D24] text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold"
                >
                  Save in categories.json
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#262632] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#22222C] pb-4">
              <h3 className="text-lg font-serif font-bold text-stone-100">Edit Category: {editingCategory.name}</h3>
              <button onClick={() => setEditingCategory(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Department</label>
                <select
                  value={editingCategory.department || 'Apparel'}
                  onChange={(e) => setEditingCategory({ ...editingCategory, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Apparel">Apparel</option>
                  <option value="Layering">Layering</option>
                  <option value="Bottoms">Bottoms</option>
                  <option value="Footwear">Footwear</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#1D1D24] text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold"
                >
                  Update Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GARMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#262632] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#22222C] pb-4">
              <h3 className="text-lg font-serif font-bold text-stone-100">Hang New Atelier Garment</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Garment Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scandi Linen Overshirt"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Subtitle</label>
                  <input
                    type="text"
                    placeholder="e.g. Atelier Edition 2026"
                    value={newProduct.subtitle}
                    onChange={(e) => setNewProduct({ ...newProduct, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    placeholder="2999"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Category</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                  >
                    {categories.map(c => (
                      <option key={c.id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Gender</label>
                  <select
                    value={newProduct.gender}
                    onChange={(e) => setNewProduct({ ...newProduct, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>

              {/* Upload image from computer */}
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Garment Image</label>
                <div className="flex items-center gap-4">
                  <img
                    src={newProduct.imageUrl}
                    alt="Preview"
                    className="w-16 h-20 object-cover rounded-xl bg-stone-800 border border-stone-700 shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <label className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1D1D24] hover:bg-[#262630] text-stone-200 border border-[#2D2D3A] cursor-pointer text-xs font-semibold">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>Upload from this computer</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'new')}
                        className="hidden"
                      />
                    </label>
                    <input
                      type="text"
                      placeholder="Or paste external image URL..."
                      value={newProduct.imageUrl}
                      onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white text-[11px] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-[#1D1D24] border border-[#2D2D3A]">
                  <input
                    type="checkbox"
                    checked={newProduct.isHangerItem}
                    onChange={(e) => setNewProduct({ ...newProduct, isHangerItem: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                  />
                  <div>
                    <p className="font-bold text-stone-100">Hang on 3D Wardrobe Rail</p>
                    <p className="text-[10px] text-stone-400">Enables boutique wooden hanger sway</p>
                  </div>
                </label>

                <label className="flex items-center gap-2 cursor-pointer p-3 rounded-xl bg-[#1D1D24] border border-[#2D2D3A]">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                  />
                  <div>
                    <p className="font-bold text-stone-100">Available in Stock</p>
                    <p className="text-[10px] text-stone-400">Allows instant customer ordering</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#1D1D24] text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold"
                >
                  Hang Garment on Live Rail
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GARMENT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#262632] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b border-[#22222C] pb-4">
              <h3 className="text-lg font-serif font-bold text-stone-100">Edit Garment: {editingProduct.name}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Price (Rs.)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Image URL / Computer Upload</label>
                <div className="flex items-center gap-3">
                  <label className="px-3.5 py-2 bg-[#1D1D24] hover:bg-[#252530] text-stone-300 rounded-xl cursor-pointer border border-[#2D2D3A] shrink-0">
                    Upload
                    <input type="file" accept="image/*" onChange={(e) => handleImageFileUpload(e, 'edit')} className="hidden" />
                  </label>
                  <input
                    type="text"
                    value={editingProduct.imageUrl || (editingProduct.images && editingProduct.images[0]) || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#1D1D24] border border-[#2D2D3A] text-white text-[11px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl bg-[#1D1D24] text-stone-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-stone-900 rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="font-serif tracking-widest text-xl font-bold uppercase">NOVAÉ ATELIER</h2>
                <p className="text-[10px] text-stone-500 uppercase tracking-wider">Official Patron Invoice</p>
              </div>
              <button onClick={() => setInvoiceOrder(null)} className="text-stone-400 hover:text-stone-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 text-xs text-stone-600 gap-4">
              <div>
                <p className="font-bold text-stone-900">Order Ref: #{invoiceOrder.orderNumber}</p>
                <p>Date: {new Date(invoiceOrder.createdAt).toLocaleDateString()}</p>
                <p>Status: {invoiceOrder.status}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-stone-900">Billed to:</p>
                <p>{invoiceOrder.customer?.fullName}</p>
                <p>{invoiceOrder.customer?.phone}</p>
                <p>{invoiceOrder.customer?.city}</p>
              </div>
            </div>

            <div className="divide-y divide-stone-100 text-xs">
              {invoiceOrder.items?.map(it => (
                <div key={it.id || it.cartItemId} className="py-2.5 flex justify-between">
                  <span>{it.name} (x{it.quantity}) • Size {it.size || 'M'}</span>
                  <span className="font-bold">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-between font-bold text-sm">
              <span>Total Value:</span>
              <span className="font-serif">Rs. {(invoiceOrder.total || 0).toLocaleString()}</span>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-stone-100">
              <button
                onClick={() => setInvoiceOrder(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold"
              >
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HTML EMAIL PREVIEW MODAL */}
      {previewEmail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141418] border border-[#262632] text-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#22222C] pb-3">
              <div>
                <h4 className="font-bold text-sm">{previewEmail.subject}</h4>
                <p className="text-[11px] text-stone-400">To: {previewEmail.toName} &lt;{previewEmail.to}&gt;</p>
              </div>
              <button onClick={() => setPreviewEmail(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="bg-white rounded-2xl p-4 text-stone-900 text-xs overflow-y-auto max-h-[60vh]"
              dangerouslySetInnerHTML={{ __html: previewEmail.htmlContent || '<p>Email template rendered.</p>' }}
            />

            <div className="flex justify-end">
              <button
                onClick={() => setPreviewEmail(null)}
                className="px-4 py-2 bg-[#1E1E26] text-stone-300 rounded-xl text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
