import React, { useState, useEffect } from 'react';
import { User, Package, MapPin, Ruler, LogOut, CheckCircle2, Clock, Truck, ChevronRight } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { api } from '../services/api';

export const AccountPage = ({ onNavigate }) => {
  const { customerUser, logout } = useCustomerAuth();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      const data = await api.getOrders();
      setOrders(data);
    }
    loadOrders();
  }, []);

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const displayName = customerUser?.fullName || 'Asad Bilal';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AB';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-stone-200 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-900 text-white font-serif text-2xl font-bold flex items-center justify-center shadow-md">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Welcome back, {displayName}
            </h1>
            <p className="text-xs text-stone-500">
              {customerUser?.email || 'asad@example.com'} • {customerUser?.vipTier || 'VIP Wardrobe Member'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="self-start md:self-auto text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 space-y-1 bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
          {[
            { id: 'orders', label: 'Order History', icon: Package },
            { id: 'sizing', label: 'Hanger Size Profile', icon: Ruler },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
            { id: 'profile', label: 'Personal Information', icon: User }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors ${
                  isSelected ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Your Orders & Tracking
              </h2>

              {orders.length === 0 ? (
                <div className="text-center py-12 text-stone-500 text-xs">
                  No orders placed yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-200 text-xs">
                        <div>
                          <span className="text-stone-400">Order: </span>
                          <strong className="font-mono text-stone-900">{ord.orderNumber}</strong>
                          <span className="mx-2 text-stone-300">•</span>
                          <span className="text-stone-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {ord.status || 'Confirmed'}
                          </span>
                          <strong className="text-stone-900">Rs. {ord.total?.toLocaleString()}</strong>
                        </div>
                      </div>

                      {/* Item thumbnails */}
                      <div className="space-y-2">
                        {ord.items?.map((item, itemIdx) => (
                          <div key={itemIdx} className="flex items-center gap-3 text-xs">
                            <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg bg-stone-100" />
                            <div className="flex-1">
                              <p className="font-semibold text-stone-900">{item.name}</p>
                              <p className="text-[11px] text-stone-400">Size: {item.size} • Qty: {item.quantity}</p>
                            </div>
                            <span className="font-semibold text-stone-900">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-between items-center text-[11px] text-stone-500 border-t border-stone-200/60">
                        <span>Shipping to: {ord.customer?.city || 'Multan'}, {ord.customer?.address}</span>
                        <span className="font-medium text-emerald-700">Cash on Delivery</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sizing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Wardrobe Sizing & Hanger Fit Calculator
              </h2>
              <p className="text-xs text-stone-500 leading-relaxed">
                Save your shoulder width and chest measurements so our 3D Interactive Hanger Viewer can highlight optimal drape recommendations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">Shoulder Span</span>
                  <input type="text" defaultValue="48 cm" className="w-full bg-white px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-900" />
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">Chest Circumference</span>
                  <input type="text" defaultValue="104 cm" className="w-full bg-white px-3 py-2 rounded-lg border border-stone-300 text-xs font-semibold text-stone-900" />
                </div>
                <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-stone-400 block mb-1">Recommended Size</span>
                  <div className="px-3 py-2 rounded-lg bg-stone-900 text-white text-xs font-bold text-center">
                    Size Medium (M) Relaxed
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Saved Shipping Addresses
              </h2>
              <div className="p-4 rounded-2xl border-2 border-stone-900 bg-stone-50 flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-stone-900 text-white">Default Address</span>
                  <h4 className="font-semibold text-stone-900 text-sm mt-2">Asad Bilal (Home)</h4>
                  <p className="text-xs text-stone-600 mt-1">House # 42, Street 7, Model Town Phase 2</p>
                  <p className="text-xs text-stone-600">Multan, Punjab, Pakistan</p>
                  <p className="text-xs text-stone-500 mt-1">Phone: 0300-1234567</p>
                </div>
                <button className="text-xs font-semibold text-stone-900 underline">Edit</button>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <h2 className="text-lg font-serif font-bold text-stone-900">
                Personal Profile
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Full Name</label>
                  <input type="text" defaultValue="Asad Bilal" className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 block mb-1">Email</label>
                  <input type="email" defaultValue="asad@example.com" className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900" />
                </div>
              </div>
              <button
                onClick={() => alert('Profile saved successfully')}
                className="mt-4 px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
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
