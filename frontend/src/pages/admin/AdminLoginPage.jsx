import React, { useState } from 'react';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLoginPage = ({ onLoginSuccess, onBackToStore }) => {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('admin@novae.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      onLoginSuccess();
    } else {
      setError(result.message || 'Invalid administrator credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 relative selection:bg-amber-500 selection:text-black">
      {/* Back button */}
      <button
        onClick={onBackToStore}
        className="absolute top-6 left-6 text-xs text-stone-400 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Customer Store</span>
      </button>

      <div className="w-full max-w-md space-y-8 bg-[#1A1A1A] p-8 sm:p-10 rounded-3xl border border-stone-800 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 stroke-[2]" />
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-[0.2em] uppercase">
            NOVAÉ HQ
          </h1>
          <p className="text-xs text-stone-400 uppercase tracking-widest font-semibold">
            Boutique Operations & Inventory Console
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@novae.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#222222] border border-stone-700 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-stone-300 uppercase tracking-wider block mb-1.5">
              Access Key / Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#222222] border border-stone-700 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>
          </div>

          {/* Demo hint pill */}
          <div className="p-3 bg-stone-900 rounded-xl border border-stone-800 text-[11px] text-stone-400 flex items-center justify-between">
            <span>Demo: <strong>admin@novae.com</strong> / <strong>admin123</strong></span>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@novae.com');
                setPassword('admin123');
              }}
              className="text-amber-400 hover:underline font-semibold"
            >
              Fill Demo
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-stone-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Encrypted Session with Granular Store Control</span>
        </div>
      </div>
    </div>
  );
};
