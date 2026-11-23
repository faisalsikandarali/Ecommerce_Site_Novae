import React, { useState, useEffect } from 'react';
import {
  User, Package, MapPin, Ruler, LogOut, CheckCircle2, Clock, Truck,
  ChevronRight, Shirt, ShoppingBag, ShieldCheck, Check
} from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { api } from '../services/api';

const ORDER_STEPS = [
  { id: 'Confirmed', label: 'Order Confirmed', desc: 'Garment reserved & inspected' },
  { id: 'Processing', label: 'Processing & Steaming', desc: 'Hung & tagged on oak hanger' },
  { id: 'In Transit', label: 'In Transit', desc: 'With boutique courier rider' },
  { id: 'Delivered', label: 'Delivered', desc: 'Safely arrived at your closet' }
];

const getStepIndex = (status) => {
  switch ((status || '').toLowerCase()) {
    case 'processing': return 1;
    case 'in transit': return 2;
    case 'delivered': return 3;
    case 'confirmed':
    default: return 0;
  }
};

export const AccountPage = ({ onNavigate }) => {
  const { customerUser, logout } = useCustomerAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      setLoadingOrders(true);
      try {
        const data = await api.getCustomerOrders(customerUser?.email);
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load customer orders', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [customerUser]);

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const displayName = customerUser?.fullName || 'Asad Bilal';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AB';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Customer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-stone-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-900 text-white font-serif text-2xl font-bold flex items-center justify-center shadow-md">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              {customerUser?.email || 'asad@example.com'} • <span className="font-semibold text-amber-800">{customerUser?.vipTier || 'Gold Wardrobe Member'}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="self-start md:self-auto text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
          {[
            { id: 'orders', label: 'Order History & Tracking', icon: Package, badge: orders.length },
            { id: 'sizing', label: 'Hanger Drape Profile', icon: Ruler },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'profile', label: 'Personal Information', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
                  isSelected ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-stone-700 text-white' : 'bg-stone-100 text-stone-600'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  Your Orders & Live Tracking
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Real-time status updates as your garment is hand-steamed, hung on our signature oak hangers, and couriered.
                </p>
              </div>

              {loadingOrders ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  Loading boutique orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-stone-500 text-xs">No orders placed yet.</p>
                  <button
                    onClick={() => onNavigate('shop')}
                    className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((ord, idx) => {
                    const currentStepIdx = getStepIndex(ord.status);
                    return (
                      <div key={idx} className="p-6 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-6">
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200 text-xs">
                          <div>
                            <span className="text-stone-400">Order Reference: </span>
                            <strong className="font-mono text-stone-900 text-sm">{ord.orderNumber}</strong>
                            <span className="mx-2 text-stone-300">•</span>
                            <span className="text-stone-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
                              {ord.status || 'Confirmed'}
                            </span>
                            <strong className="text-stone-900 text-sm">Rs. {ord.total?.toLocaleString()}</strong>
                          </div>
                        </div>

                        {/* Visual Order Stepper */}
                        <div className="py-2">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                            {ORDER_STEPS.map((step, sIdx) => {
                              const isCompleted = sIdx <= currentStepIdx;
                              const isCurrent = sIdx === currentStepIdx;
                              return (
                                <div key={step.id} className="flex flex-col items-center text-center space-y-1.5">
                                  <div
                                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                                      isCompleted
                                        ? 'bg-stone-900 text-white'
                                        : 'bg-stone-200 text-stone-400'
                                    } ${isCurrent ? 'ring-4 ring-amber-200 scale-105' : ''}`}
                                  >
                                    {isCompleted ? <Check className="w-4 h-4" /> : sIdx + 1}
                                  </div>
                                  <span className={`text-[11px] font-semibold ${isCompleted ? 'text-stone-900' : 'text-stone-400'}`}>
                                    {step.label}
                                  </span>
                                  <span className="text-[10px] text-stone-400 leading-tight hidden sm:block">
                                    {step.desc}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Item list */}
                        <div className="space-y-3 pt-2">
                          {ord.items?.map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-3 text-xs bg-white p-3 rounded-xl border border-stone-200/80">
                              <img
                                src={item.image || (item.colors && item.colors[0]?.image) || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80'}
                                alt={item.name}
                                className="w-12 h-14 object-cover rounded-lg bg-stone-100"
                              />
                              <div className="flex-1">
                                <p className="font-semibold text-stone-900">{item.name}</p>
                                <p className="text-[11px] text-stone-500">
                                  Color: {item.selectedColor || item.color || 'Default'} • Size: {item.size} • Qty: {item.quantity}
                                </p>
                              </div>
                              <span className="font-bold text-stone-900">
                                Rs. {(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Delivery Footer */}
                        <div className="pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] text-stone-500 border-t border-stone-200 gap-1">
                          <span>Shipping to: <strong>{ord.customer?.city || 'Multan'}</strong> ({ord.customer?.address})</span>
                          <span className="font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {ord.paymentMethod || 'Cash on Delivery'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sizing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-stone-900">
                  Wardrobe Sizing & Hanger Fit Drape Profile
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Save your shoulder span and chest measurements so our interactive boutique coat hangers accurately suggest natural fabric drape.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                    Shoulder Span
                  </span>
                  <input
                    type="text"
                    defaultValue={customerUser?.measurements?.shoulder || '48 cm'}
                    className="w-full bg-white px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-900"
                  />
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                    Chest Circumference
                  </span>
                  <input
                    type="text"
                    defaultValue={customerUser?.measurements?.chest || '104 cm'}
                    className="w-full bg-white px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-900"
                  />
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">
                    Recommended Hanger Cut
                  </span>
                  <div className="px-3 py-2 rounded-lg bg-stone-900 text-white text-xs font-bold text-center">
                    {customerUser?.measurements?.recommendedSize || 'Size Medium (M) Relaxed'}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-950 flex items-start gap-3">
                <Shirt className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
                <p>
                  Your profile is actively linked with our 3D Interactive Coat Hanger Viewer. Whenever you browse items, the hanger sway angle will adapt to your saved shoulder proportion.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Saved Shipping Addresses
              </h2>
              <div className="p-5 rounded-2xl border-2 border-stone-900 bg-stone-50 flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-900 text-white">
                    Primary Atelier Dispatch Address
                  </span>
                  <h4 className="font-semibold text-stone-900 text-sm mt-2">
                    {displayName} (Primary)
                  </h4>
                  <p className="text-xs text-stone-600 mt-1">
                    {customerUser?.address || 'House # 42, Street 7, Model Town Phase 2'}
                  </p>
                  <p className="text-xs text-stone-600">
                    {customerUser?.city || 'Multan'}, Pakistan
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Phone: {customerUser?.phone || '0300-1234567'}
                  </p>
                </div>
                <button
                  onClick={() => alert('Address details saved')}
                  className="text-xs font-semibold text-stone-900 underline cursor-pointer"
                >
                  Edit
                </button>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={displayName}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Email</label>
                  <input
                    type="email"
                    defaultValue={customerUser?.email || 'asad@example.com'}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
                  />
                </div>
              </div>
              <button
                onClick={() => alert('Profile saved successfully')}
                className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-black"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
