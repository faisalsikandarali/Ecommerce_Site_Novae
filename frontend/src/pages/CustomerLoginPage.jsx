import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Phone, MapPin, ArrowRight, Sparkles, ShieldCheck, Check, ArrowLeft, Smartphone } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export const CustomerLoginPage = ({ onLoginSuccess, onBackToStore, redirectReason }) => {
  const { loginWithGoogle, loginWithPhone, loginWithEmail, registerWithEmail } = useCustomerAuth();

  const [authMethod, setAuthMethod] = useState('phone'); // 'phone' | 'email'
  const [emailMode, setEmailMode] = useState('login'); // 'login' | 'register'
  
  // Phone form state
  const [phoneData, setPhoneData] = useState({
    phone: '',
    fullName: '',
    city: 'Multan'
  });

  // Email form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Multan',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1-Click Google Auth
  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle({
        fullName: 'Faisal Sikandar Ali',
        email: 'faisal.sikandar@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      });
      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      setError('Google authentication encountered an issue.');
      setLoading(false);
    }
  };

  // Instant Phone Auth (No OTP)
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phoneData.phone.trim()) {
      setError('Please provide your phone number');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await loginWithPhone(phoneData);
      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      setError('Phone login encountered an issue.');
      setLoading(false);
    }
  };

  // Email Login (No OTP)
  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await loginWithEmail(email, password || 'client123');
      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      setError('Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  // Email Register (No OTP)
  const handleEmailRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regData.fullName.trim() || !regData.email.trim()) {
      setError('Please complete your name and email');
      return;
    }
    try {
      setLoading(true);
      setError('');
      await registerWithEmail(regData);
      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      setError('Registration failed.');
      setLoading(false);
    }
  };

  const handleQuickDemo = async () => {
    setLoading(true);
    await loginWithEmail('asad.bilal@example.com', 'client2026');
    setLoading(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative">
      {/* Return button */}
      <button
        onClick={onBackToStore}
        className="absolute top-6 left-6 text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1.5 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Shopping</span>
      </button>

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden my-6">
        {/* Left Side: Brand Story & Member Perks */}
        <div className="lg:col-span-5 bg-[#0F0F10] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              NOVAÉ Patron Access
            </span>
            <h2 className="text-3xl font-serif font-bold tracking-tight text-stone-100">
              Curated Wardrobe & Atelier Account
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Create an account or sign in with Google, Phone Number, or Email. Instant activation without OTP delays — your order will be automatically attached to your profile.
            </p>

            <div className="space-y-3 pt-6 border-t border-stone-800 text-xs text-stone-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero OTP friction: direct instant registration</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live dispatch tracking & receipt history</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom 3D hanger drape sizing profile</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800/80 relative z-10 text-[11px] text-stone-500">
            © {new Date().getFullYear()} NOVAÉ Atelier. All rights reserved.
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          {redirectReason && (
            <div className="mb-6 p-3.5 bg-amber-50 border border-amber-200/90 rounded-2xl text-xs text-amber-900 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{redirectReason}</span>
            </div>
          )}

          {/* 1-CLICK GOOGLE BUTTON */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full py-3.5 px-4 bg-white hover:bg-stone-50 border-2 border-stone-200 hover:border-stone-400 text-stone-800 font-semibold rounded-2xl text-xs transition-all flex items-center justify-center gap-3 shadow-xs active:scale-[0.98]"
            >
              {/* Google multicolored G SVG icon */}
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continue with Google (1-Click Instant)</span>
            </button>
          </div>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-stone-200"></div>
            <span className="flex-shrink mx-4 text-[11px] font-medium uppercase tracking-widest text-stone-400">Or continue with</span>
            <div className="flex-grow border-t border-stone-200"></div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-2xl mb-6">
            <button
              onClick={() => { setAuthMethod('phone'); setError(''); }}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'phone'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone</span>
            </button>
            <button
              onClick={() => { setAuthMethod('email'); setError(''); }}
              className={`py-2 text-xs font-semibold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMethod === 'email'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email Address</span>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
              {error}
            </div>
          )}

          {/* METHOD 1: PHONE AUTH (NO OTP) */}
          {authMethod === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Mobile / Phone Number <span className="text-emerald-600 font-bold">(No OTP Required)</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    required
                    placeholder="0300-1234567 or +92 300 1234567"
                    value={phoneData.phone}
                    onChange={(e) => setPhoneData({ ...phoneData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Full Name (For Order & Delivery)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="e.g. Asad Bilal"
                    value={phoneData.fullName}
                    onChange={(e) => setPhoneData({ ...phoneData, fullName: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                  Delivery City
                </label>
                <input
                  type="text"
                  placeholder="Multan, Lahore, Islamabad..."
                  value={phoneData.city}
                  onChange={(e) => setPhoneData({ ...phoneData, city: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Registering...' : 'Instant Phone Sign In / Register (Zero OTP)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* METHOD 2: EMAIL AUTH */}
          {authMethod === 'email' && (
            <div>
              <div className="flex border-b border-stone-200 mb-4">
                <button
                  type="button"
                  onClick={() => { setEmailMode('login'); setError(''); }}
                  className={`pb-2 text-xs font-semibold uppercase tracking-wider mr-4 border-b-2 ${
                    emailMode === 'login' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400'
                  }`}
                >
                  Email Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setEmailMode('register'); setError(''); }}
                  className={`pb-2 text-xs font-semibold uppercase tracking-wider border-b-2 ${
                    emailMode === 'register' ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-400'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {emailMode === 'login' ? (
                <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="email"
                        required
                        placeholder="name@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Password (Optional)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Authenticating...' : 'Sign In With Email'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleEmailRegisterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Asad Bilal"
                        value={regData.fullName}
                        onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@domain.com"
                        value={regData.email}
                        onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                        Phone
                      </label>
                      <input
                        type="tel"
                        placeholder="0300-1234567"
                        value={regData.phone}
                        onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>{loading ? 'Creating...' : 'Register Account (Zero OTP)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Quick Demo Sign In */}
          <div className="pt-4 border-t border-stone-100 mt-4">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Quick 1-Click Patron Demo Sign In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
