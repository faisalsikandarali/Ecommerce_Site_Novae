import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, User, Phone, MapPin, ArrowRight, Sparkles, ShieldCheck, Check, ArrowLeft } from 'lucide-react';
import { useCustomerAuth } from '../context/CustomerAuthContext';

export const CustomerLoginPage = ({ onLoginSuccess, onBackToStore, redirectReason }) => {
  const { login, register } = useCustomerAuth();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Registration state
  const [regData, setRegData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: 'Multan',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please provide your email and password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
      onLoginSuccess();
    }, 400);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!regData.fullName || !regData.email || !regData.password) {
      setError('Please complete all required fields');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      register(regData);
      setLoading(false);
      onLoginSuccess();
    }, 400);
  };

  const handleQuickDemo = () => {
    login('asad.bilal@example.com', 'client2026');
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
        <div className="lg:col-span-5 bg-[#141414] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            <span className="text-[10px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-white/10 text-amber-300">
              NOVAÉ Client Privilege
            </span>
            <h2 className="text-3xl font-serif font-bold tracking-tight">
              A Personal Wardrobe Experience
            </h2>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Sign in to manage your orders, save tailored shoulder & chest measurements for our 3D hanger drape viewer, and unlock private seasonal drops.
            </p>

            <div className="space-y-3 pt-6 border-t border-stone-800 text-xs text-stone-300">
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Live dispatch tracking & receipt history</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom hanger fit sizing calculator</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Complimentary express delivery & garment bag</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-stone-800 relative z-10 text-[11px] text-stone-500">
            © {new Date().getFullYear()} NOVAÉ Studio Inc. All rights reserved.
          </div>
        </div>

        {/* Right Side: Auth Form Container */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          {redirectReason && (
            <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
              <span>{redirectReason}</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="flex border-b border-stone-200 mb-8">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 mr-6 ${
                mode === 'login'
                  ? 'border-stone-900 text-stone-900 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-all border-b-2 ${
                mode === 'register'
                  ? 'border-stone-900 text-stone-900 font-bold'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* SIGN IN FORM */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Password
                  </label>
                  <a href="#forgot" className="text-[11px] text-stone-500 hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded text-stone-900 focus:ring-stone-900 border-stone-300"
                  />
                  <span>Remember my login</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Authenticating...' : 'Sign In to Wardrobe'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Instant Client Demo Fill */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-950 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                  <span>Quick 1-Click Client Demo Sign In</span>
                </button>
              </div>
            </form>
          )}

          {/* CREATE ACCOUNT FORM */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
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
                    required
                    placeholder="0300-1234567"
                    value={regData.phone}
                    onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    City
                  </label>
                  <select
                    value={regData.city}
                    onChange={(e) => setRegData({ ...regData, city: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-white"
                  >
                    <option value="Multan">Multan</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Faisalabad">Faisalabad</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="pt-6 text-center text-[11px] text-stone-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted with standard client SSL protection</span>
          </div>
        </div>
      </div>
    </div>
  );
};
