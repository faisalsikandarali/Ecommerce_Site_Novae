import React, { useState, useEffect } from 'react';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, Lock, UserCheck, LogIn, Sparkles, Smartphone, Mail, User, Phone, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCustomerAuth } from '../context/CustomerAuthContext';
import { api } from '../services/api';

export const CheckoutPage = ({ onOrderPlaced, onBack, onNavigateToLogin }) => {
  const { cart, subtotal, shippingCost, grandTotal, clearCart } = useCart();
  const { isLoggedIn, customerUser, loginWithGoogle, loginWithPhone, loginWithEmail, registerWithEmail } = useCustomerAuth();

  // Instant auth state inside checkout
  const [checkoutAuthMethod, setCheckoutAuthMethod] = useState('google'); // 'google' | 'phone' | 'email'
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Phone form state
  const [phoneForm, setPhoneForm] = useState({
    phone: '',
    fullName: '',
    city: 'Multan'
  });

  // Email form state
  const [emailForm, setEmailForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  // Shipping form state
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

  // 1-Click Google Auth Handler
  const handleQuickGoogleAuth = async () => {
    try {
      setAuthLoading(true);
      setAuthError('');
      await loginWithGoogle({
        fullName: 'Faisal Sikandar Ali',
        email: 'faisal.sikandar@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      setAuthLoading(false);
    } catch (err) {
      setAuthError('Google sign in error. Please try phone number.');
      setAuthLoading(false);
    }
  };

  // Instant Phone Auth Handler (Zero OTP)
  const handleQuickPhoneAuth = async (e) => {
    e.preventDefault();
    if (!phoneForm.phone.trim()) {
      setAuthError('Please enter a valid phone number');
      return;
    }
    try {
      setAuthLoading(true);
      setAuthError('');
      await loginWithPhone(phoneForm);
      setAuthLoading(false);
    } catch (err) {
      setAuthError('Phone authentication error');
      setAuthLoading(false);
    }
  };

  // Instant Email Auth Handler (Zero OTP)
  const handleQuickEmailAuth = async (e) => {
    e.preventDefault();
    if (!emailForm.email.trim()) {
      setAuthError('Please enter a valid email address');
      return;
    }
    try {
      setAuthLoading(true);
      setAuthError('');
      await registerWithEmail({
        fullName: emailForm.fullName || emailForm.email.split('@')[0],
        email: emailForm.email,
        phone: '0300-1234567',
        city: 'Multan',
        password: emailForm.password || 'client123'
      });
      setAuthLoading(false);
    } catch (err) {
      setAuthError('Email authentication error');
      setAuthLoading(false);
    }
  };

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
    if (!isLoggedIn) {
      setAuthError('Account registration is required before placing an order.');
      return;
    }

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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Checkout & Order Finalization
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Complete your order with verified patron credentials and express door delivery.
          </p>
        </div>
        {isLoggedIn && (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs text-emerald-800">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Authenticated: <strong>{customerUser?.fullName}</strong></span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
        {/* Left Column: Form or Mandatory Account Gate */}
        <div className="lg:col-span-7 space-y-6">
          {!isLoggedIn ? (
            /* MANDATORY ACCOUNT GATE (NO GUEST CHECKOUT) */
            <div className="bg-[#111113] text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full">
                    Mandatory Step
                  </span>
                  <span className="text-xs text-stone-400">Step 1 of 2</span>
                </div>

                <div>
                  <h2 className="text-2xl font-serif font-bold text-stone-100">
                    Patron Account Required to Place Order
                  </h2>
                  <p className="text-xs text-stone-300 mt-1.5 leading-relaxed">
                    To maintain atelier order records, live courier tracking, and warranty service, you must create or sign in to your account.
                    <strong className="text-amber-300"> Direct registration with Zero OTP delay</strong>.
                  </p>
                </div>

                {authError && (
                  <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl">
                    {authError}
                  </div>
                )}

                {/* 1-Click GOOGLE SIGN IN */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleQuickGoogleAuth}
                    disabled={authLoading}
                    className="w-full py-3.5 px-4 bg-white hover:bg-stone-100 text-stone-900 font-bold rounded-2xl text-xs transition-all flex items-center justify-center gap-3 shadow-lg active:scale-[0.98]"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                      <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                    </svg>
                    <span>1-Click Continue with Google (Instant & No OTP)</span>
                  </button>
                </div>

                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-stone-800"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Or register with Phone / Email</span>
                  <div className="flex-grow border-t border-stone-800"></div>
                </div>

                {/* Sub-tabs for Phone vs Email */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-stone-900 rounded-xl">
                  <button
                    type="button"
                    onClick={() => { setCheckoutAuthMethod('phone'); setAuthError(''); }}
                    className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      checkoutAuthMethod === 'phone'
                        ? 'bg-stone-800 text-amber-300 shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Phone Number</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCheckoutAuthMethod('email'); setAuthError(''); }}
                    className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      checkoutAuthMethod === 'email'
                        ? 'bg-stone-800 text-amber-300 shadow'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Email Address</span>
                  </button>
                </div>

                {/* Phone Method Form */}
                {checkoutAuthMethod === 'phone' && (
                  <form onSubmit={handleQuickPhoneAuth} className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                          Mobile Phone <span className="text-emerald-400">(No OTP)</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="0300-1234567"
                          value={phoneForm.phone}
                          onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Asad Bilal"
                          value={phoneForm.fullName}
                          onChange={(e) => setPhoneForm({ ...phoneForm, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow active:scale-95 flex items-center justify-center gap-2 mt-2"
                    >
                      <span>{authLoading ? 'Registering Account...' : 'Sign In & Proceed to Address Form (Zero OTP)'}</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </form>
                )}

                {/* Email Method Form */}
                {checkoutAuthMethod === 'email' && (
                  <form onSubmit={handleQuickEmailAuth} className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Asad Bilal"
                          value={emailForm.fullName}
                          onChange={(e) => setEmailForm({ ...emailForm, fullName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-300 mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="name@domain.com"
                          value={emailForm.email}
                          onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow active:scale-95 flex items-center justify-center gap-2 mt-2"
                    >
                      <span>{authLoading ? 'Creating Account...' : 'Register Instantly & Proceed (Zero OTP)'}</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          ) : null}

          {/* CHECKOUT SHIPPING FORM (UNLOCKED WHEN LOGGED IN) */}
          <div className={`bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs transition-opacity ${
            !isLoggedIn ? 'opacity-40 pointer-events-none' : 'opacity-100'
          }`}>
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-emerald-900">
              <div className="flex items-center gap-2.5">
                <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold">{customerUser?.fullName || 'Patron'}</p>
                  <p className="text-[11px] text-emerald-700 font-mono">{customerUser?.email || customerUser?.phone}</p>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/60 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                Patron Account Connected
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-stone-900 tracking-wide uppercase mb-4">
                  Delivery Destination
                </h2>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                      Recipient Full Name <span className="text-red-500">*</span>
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
                        Contact Phone <span className="text-red-500">*</span>
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
                      placeholder="House No, Street, Sector, Landmark..."
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
                      <p className="text-[11px] text-stone-500">Delivered within 2-4 business days with signature solid oak hanger</p>
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
                        <p className="text-[11px] text-stone-500">Pay cash upon package arrival at your doorstep</p>
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
                disabled={isSubmitting || !isLoggedIn}
                className="w-full py-4 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-xl transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Dispatching Order to Atelier...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Confirm & Place Order (Rs. {grandTotal.toLocaleString()})</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary */}
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
