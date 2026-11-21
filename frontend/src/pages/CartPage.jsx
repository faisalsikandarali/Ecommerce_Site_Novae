import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Tag, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';

export const CartPage = ({ onNavigate }) => {
  const { cart, subtotal, shippingCost, grandTotal, clearCart } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (coupon.trim().toUpperCase() === 'NOVAE10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setCouponSuccess('Coupon applied: 10% off your wardrobe order!');
    } else {
      setCouponError('Invalid voucher code. Try "NOVAE10" for 10% off.');
    }
  };

  const finalTotal = Math.max(0, grandTotal - discount);

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-stone-400 mb-4">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Your Bag is Empty</h1>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
          Your boutique shopping bag has no items yet. Browse our collections or discover garments on the signature hanger rack.
        </p>
        <button
          onClick={() => onNavigate('shop')}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <button
        onClick={() => onNavigate('shop')}
        className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Continue Shopping</span>
      </button>

      <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Your Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
        </h1>
        <button
          onClick={clearCart}
          className="text-xs text-stone-400 hover:text-red-500 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Bag</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items List */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs divide-y divide-stone-100">
          {cart.map((item) => (
            <CartItem key={item.cartItemId} item={item} />
          ))}
        </div>

        {/* Right Column: Order Summary & Voucher */}
        <div className="lg:col-span-5 space-y-6">
          {/* Summary Box */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs space-y-6">
            <h2 className="text-base font-semibold text-stone-900 tracking-wide uppercase pb-4 border-b border-stone-200">
              Order Summary
            </h2>

            {/* Voucher input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
                Promo or Gift Code
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Try NOVAE10"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 uppercase font-mono focus:outline-none focus:border-stone-800"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Apply
                </button>
              </div>
              {couponSuccess && <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>}
              {couponError && <p className="text-[11px] text-red-500 font-medium">{couponError}</p>}
            </form>

            {/* Pricing details */}
            <div className="space-y-2.5 pt-4 border-t border-stone-200 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Bag Subtotal</span>
                <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Special Promotion (NOVAE10)</span>
                  <span>- Rs. {discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Standard Delivery (Free &gt; Rs. 5000)</span>
                <span className={shippingCost === 0 ? 'text-emerald-600 font-semibold' : 'text-stone-900 font-semibold'}>
                  {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
                <span>Estimated Total</span>
                <span>Rs. {finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('checkout')}
              className="w-full py-4 bg-stone-900 hover:bg-black text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-xl active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
              <ShieldCheck className="w-4 h-4 text-stone-500" />
              <span>Complimentary garment bag & hanger included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
