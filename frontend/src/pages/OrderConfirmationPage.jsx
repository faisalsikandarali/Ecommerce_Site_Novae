import React, { useEffect } from 'react';
import {
  Check, ShoppingBag, ArrowRight, Home, PackageCheck, Printer,
  Truck, Clock, ShieldCheck, Shirt, ChevronRight, User
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CONFIRMATION_STEPS = [
  { id: '1', title: 'Order Confirmed', desc: 'Garments reserved in boutique database', completed: true },
  { id: '2', title: 'Hand-Steaming & Hanger Tagging', desc: 'Placed on signature oak wood hanger', active: true },
  { id: '3', title: 'Priority Courier Handover', desc: 'Dispatched via TCS / Leopard Courier' },
  { id: '4', title: 'Doorstep Delivery', desc: 'Delivered in signature garment box' }
];

export const OrderConfirmationPage = ({ order, onNavigate }) => {
  // If order not passed in props, check localStorage fallback
  const resolvedOrder = order || (() => {
    try {
      const saved = localStorage.getItem('novae_last_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })();

  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  if (!resolvedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">No Active Order Found</h2>
        <p className="text-xs text-stone-500 mb-6">
          Your shopping bag is waiting for you to discover our atelier garments.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-black transition-all"
        >
          Explore Boutique Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-xl space-y-8">
        {/* Big Success Check Circle */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/40 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
            <Check className="w-10 h-10 stroke-[2.5]" />
          </div>

          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60 inline-block">
            Order Successfully Placed
          </span>

          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
            Thank You For Your Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 max-w-lg mx-auto font-light leading-relaxed">
            Your pieces are now reserved in our atelier inventory. Each garment will be individually inspected, hand-steamed, and tagged on our signature solid oak hangers prior to dispatch.
          </p>
        </div>

        {/* Order Reference Number Banner */}
        <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-stone-400 font-bold block">
              Official Boutique Order Code
            </span>
            <span className="text-2xl font-mono font-bold text-stone-900">
              {resolvedOrder.orderNumber || 'NV-2120'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:text-stone-900 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-500" />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={() => onNavigate('account')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <PackageCheck className="w-4 h-4" />
              <span>Track in Account</span>
            </button>
          </div>
        </div>

        {/* 4-Step Visual Progress Stepper */}
        <div className="p-6 bg-[#FAF9F5] rounded-2xl border border-stone-200/70 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Atelier Preparation & Delivery Stepper</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
            {CONFIRMATION_STEPS.map((step, idx) => (
              <div key={step.id} className="text-center sm:text-left space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.completed
                        ? 'bg-stone-900 text-white'
                        : step.active
                        ? 'bg-amber-800 text-white ring-2 ring-amber-200 animate-pulse'
                        : 'bg-stone-200 text-stone-400'
                    }`}
                  >
                    {step.completed ? '✓' : idx + 1}
                  </span>
                  <span className={`text-xs font-bold ${step.active || step.completed ? 'text-stone-900' : 'text-stone-400'}`}>
                    {step.title}
                  </span>
                </div>
                <p className="text-[10px] text-stone-500 pl-8 hidden sm:block">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Recipient & Shipping Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-stone-50/50 p-6 rounded-2xl border border-stone-200">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Delivery Address & Recipient
            </span>
            <p className="font-bold text-stone-900 text-sm">{resolvedOrder.customer?.fullName}</p>
            <p className="text-stone-700">{resolvedOrder.customer?.address}</p>
            <p className="text-stone-700">{resolvedOrder.customer?.city || 'Multan'}, Pakistan</p>
            <p className="text-stone-500 pt-1">Phone: {resolvedOrder.customer?.phone}</p>
            <p className="text-stone-500">Email: {resolvedOrder.customer?.email}</p>
          </div>

          <div className="space-y-2 sm:text-right">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
              Payment & Dispatch Info
            </span>
            <p>
              Payment Method:{' '}
              <strong className="text-emerald-700">{resolvedOrder.paymentMethod || 'Cash on Delivery'}</strong>
            </p>
            <p className="text-stone-500">
              Estimated Delivery: <strong>2 - 3 Business Days</strong>
            </p>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-left sm:text-right text-[11px] text-amber-950 mt-2">
              💡 Please keep exact amount of <strong>Rs. {resolvedOrder.total?.toLocaleString()}</strong> ready in cash upon courier arrival.
            </div>
          </div>
        </div>

        {/* Ordered Pieces Breakdown */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Ordered Garments & Tailoring Details
          </h3>
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-2xl overflow-hidden bg-white">
            {resolvedOrder.items?.map((item, idx) => {
              const itemImage = item.image || (item.colors && item.colors[0]?.image) || item.images?.[0] || 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80';
              return (
                <div key={idx} className="p-4 flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-lg bg-stone-100 shrink-0"
                    />
                    <div>
                      <p className="font-semibold text-stone-900">{item.name}</p>
                      <p className="text-[11px] text-stone-400">
                        Size: <strong>{item.size || 'M'}</strong> • Qty: {item.quantity} • Color: {item.selectedColor || item.color || 'Default'}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold text-stone-900 text-sm">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Pricing Totals */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex justify-end text-xs">
            <div className="w-64 space-y-1.5">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-stone-900">Rs. {resolvedOrder.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Priority Courier Dispatch:</span>
                <span className="font-semibold text-stone-900">Rs. {resolvedOrder.shippingCost || 200}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-300">
                <span>Total Amount Due:</span>
                <span>Rs. {resolvedOrder.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Navigation Footer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-stone-200">
          <button
            onClick={() => onNavigate('account')}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>View Order Status in Account</span>
          </button>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3.5 bg-white border border-stone-300 hover:border-stone-400 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
