import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, Lock, UserCheck, LogIn } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { api } from '../services/api';

export const CheckoutPage = ({ onOrderPlaced, onBack, onNavigateToLogin }) => {
  const { cart, subtotal, shippingCost, grandTotal, clearCart } = useCart();
  const { isLoggedIn, customerUser } = useCustomerAuth();

  const [formData, setFormData] = useState({
    fullName: customerUser?.fullName || '',
    phone: customerUser?.phone || '',
    email: customerUser?.email || '',
    address: customerUser?.address || '',
    city: customerUser?.city || 'Multan',
    paymentMethod: 'Cash on Delivery'
  });

  useEffect(() => {
    if (customerUser) {
      setFormData(prev => ({
        ...prev,
        fullName: customerUser.fullName || prev.fullName,
        phone: customerUser.phone || prev.phone,
        email: customerUser.email || prev.email,
        address: customerUser.address || prev.address,
        city: customerUser.city || prev.city
      }));
    }
  }, [customerUser]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.phone.trim()) errs.phone = 'Phone number is required';
    if (!formData.email.trim()) errs.email = 'Email address is required';
    if (!formData.address.trim()) errs.address = 'Street address is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const orderPayload = {
        customer: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city
        },
        items: cart,
        subtotal,
        shippingCost,
        total: grandTotal,
        paymentMethod: formData.paymentMethod
      };

      const placedOrder = await api.createOrder(orderPayload);
      clearCart();
      onOrderPlaced(placedOrder);
    } catch (error) {
      console.error('Failed to create order', error);
      alert('Error creating order. Please verify your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Your Bag is Empty</h2>
        <p className="text-xs text-stone-500 mb-6">Add pieces to your cart before proceeding to checkout.</p>
        <button
          onClick={onBack}
          className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Back button */}
      <button
        onClick={onBack}
        className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1.5 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-8">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
        {/* Left Column: Customer Information Form matching Screen F */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs">
          {/* Client Authentication Banner */}
          {isLoggedIn ? (
            <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-xs text-emerald-900">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Signed in as <strong>{customerUser?.fullName}</strong> ({customerUser?.email})</span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/60 px-2 py-0.5 rounded">
                Details Auto-Filled
              </span>
            </div>
          ) : (
            <div className="mb-6 p-3.5 bg-stone-50 border border-stone-200 rounded-2xl flex items-center justify-between text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-stone-500 shrink-0" />
                <span>Already have a NOVAÉ account?</span>
              </div>
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-stone-900 font-bold underline hover:text-black"
              >
                Sign In to Auto-Fill
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-stone-900 tracking-wide uppercase mb-4">
                Customer Information
              </h2>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Asad Bilal"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:outline-none transition-colors ${
                      errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-stone-300 focus:border-stone-800'
                    }`}
                  />
                  {errors.fullName && <p className="text-[11px] text-red-500 mt-1">{errors.fullName}</p>}
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="0300-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-400 bg-red-50/20' : 'border-stone-300 focus:border-stone-800'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-400 bg-red-50/20' : 'border-stone-300 focus:border-stone-800'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Delivery City */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Delivery City <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 bg-stone-50/50 focus:outline-none focus:border-stone-800 cursor-pointer"
                  >
                    <option value="Multan">Multan</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                  </select>
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                    Street Address & House # <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    placeholder="House No, Street, Colony, Landmark..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl border text-sm text-stone-900 bg-stone-50/50 focus:outline-none transition-colors ${
                      errors.address ? 'border-red-400 bg-red-50/20' : 'border-stone-300 focus:border-stone-800'
                    }`}
                  />
                  {errors.address && <p className="text-[11px] text-red-500 mt-1">{errors.address}</p>}
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="pt-4 border-t border-stone-200">
              <h2 className="text-base font-semibold text-stone-900 tracking-wide uppercase mb-3">
                Delivery Method
              </h2>
              <div className="p-4 rounded-2xl border border-stone-300 bg-stone-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-stone-700" />
                  <div>
                    <p className="text-xs font-bold text-stone-900 uppercase tracking-wide">Standard Express Delivery</p>
                    <p className="text-[11px] text-stone-500">Delivered within 2-4 business days</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-stone-900">
                  {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}
                </span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-4 border-t border-stone-200">
              <h2 className="text-base font-semibold text-stone-900 tracking-wide uppercase mb-3">
                Payment Method
              </h2>
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-4 rounded-2xl border border-stone-300 bg-white cursor-pointer hover:border-stone-500 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-stone-900 focus:ring-stone-900 border-stone-300"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900">Cash on Delivery (COD)</p>
                      <p className="text-[11px] text-stone-500">Pay cash upon package arrival at your door</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">Available</span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl border border-stone-200 bg-stone-50 cursor-pointer hover:border-stone-400 transition-colors opacity-80">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Card Payment"
                      checked={formData.paymentMethod === 'Online Card Payment'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-4 h-4 text-stone-900 focus:ring-stone-900 border-stone-300"
                    />
                    <div>
                      <p className="text-xs font-bold text-stone-900">Credit / Debit Card</p>
                      <p className="text-[11px] text-stone-500">Visa, MasterCard & UnionPay</p>
                    </div>
                  </div>
                  <Lock className="w-4 h-4 text-stone-400" />
                </label>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xl transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Place Order (Rs. {grandTotal.toLocaleString()})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary matching Screen F */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-semibold text-stone-900 tracking-wide uppercase pb-4 border-b border-stone-200">
            Order Summary
          </h2>

          {/* Items breakdown list */}
          <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.cartItemId} className="py-3 flex items-center gap-3.5">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-16 object-cover object-top rounded-xl bg-stone-100 border border-stone-200/60"
                />
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] text-stone-400">
                    Qty: {item.quantity} • Size: {item.size} {item.color ? `• ${item.color}` : ''}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-stone-900">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Calculation */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className={shippingCost === 0 ? 'text-emerald-600 font-semibold' : 'text-stone-900'}>
                {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-200">
              <span>Total</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-[11px] text-stone-500 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-stone-700 shrink-0" />
            <span>30-Day Guaranteed Inspection & Hassle-free Exchange on all NOVAÉ garments.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
