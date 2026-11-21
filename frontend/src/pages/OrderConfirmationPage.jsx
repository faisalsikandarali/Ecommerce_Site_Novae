import React, { useEffect } from 'react';
import { Check, ShoppingBag, ArrowRight, Home, PackageCheck, Printer } from 'lucide-react';
import confetti from 'canvas-confetti';

export const OrderConfirmationPage = ({ order, onNavigate }) => {
  useEffect(() => {
    // Launch festive confetti celebration on order confirmation
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  }, []);

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">No Recent Order Found</h2>
        <button
          onClick={() => onNavigate('home')}
          className="mt-4 px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200/80 shadow-lg text-center">
        {/* Big Success Check Circle matching Screen G */}
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/40 text-emerald-600 mx-auto flex items-center justify-center mb-6 shadow-sm">
          <Check className="w-10 h-10 stroke-[2.5]" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto mb-8 font-light leading-relaxed">
          Explore the latest collection and discover find your styles designed above with you. We have received your order and are preparing it for shipment.
        </p>

        {/* Order Number Badge */}
        <div className="inline-block bg-stone-100 rounded-2xl px-6 py-3 mb-8 border border-stone-200">
          <p className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Order Reference</p>
          <p className="text-xl font-mono font-bold text-stone-900">{order.orderNumber || 'NV-1234'}</p>
        </div>

        {/* Customer & Delivery Summary Card matching Screen G */}
        <div className="bg-stone-50/70 rounded-2xl p-6 border border-stone-200/80 text-left mb-8 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 pb-2 border-b border-stone-200">
            Delivery & Recipient Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block mb-0.5">Customer Name:</span>
              <strong className="text-stone-900">{order.customer?.fullName}</strong>
            </div>

            <div>
              <span className="text-stone-400 block mb-0.5">Delivery City:</span>
              <strong className="text-stone-900">{order.customer?.city || 'Multan'}</strong>
            </div>

            <div>
              <span className="text-stone-400 block mb-0.5">Delivery Address:</span>
              <span className="text-stone-800">{order.customer?.address}</span>
            </div>

            <div>
              <span className="text-stone-400 block mb-0.5">Payment Method:</span>
              <strong className="text-emerald-700">{order.paymentMethod || 'Cash on Delivery'}</strong>
            </div>
          </div>

          {/* Ordered items breakdown */}
          <div className="pt-4 border-t border-stone-200">
            <h4 className="text-xs font-semibold text-stone-700 mb-2">Pieces In This Order:</h4>
            <div className="divide-y divide-stone-200/60 max-h-52 overflow-y-auto">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-12 object-cover rounded-lg bg-stone-100" />
                    <div>
                      <span className="font-semibold text-stone-900">{item.name}</span>
                      <p className="text-[11px] text-stone-400">Qty: {item.quantity} • Size: {item.size}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-stone-900">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-sm font-bold text-stone-900">
              <span>Total Paid / Payable:</span>
              <span>Rs. {order.total?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons matching Screen G */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('shop')}
            className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-95"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-stone-300 hover:border-stone-400 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-xl transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
