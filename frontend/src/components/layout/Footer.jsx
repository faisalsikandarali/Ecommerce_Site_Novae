import React from 'react';
import { ArrowRight, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-[#141414] text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-2xl font-serif tracking-[0.2em] font-bold text-white uppercase">
              NOVAÉ
            </h3>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              Designed for everyday living. Discover thoughtfully crafted pieces made to fit your style, routine, and everyday life. Every garment is presented with our signature closet hanger aesthetics.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#instagram" className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#facebook" className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#twitter" className="w-9 h-9 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-stone-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('shop', { gender: 'Men' })} className="hover:text-white transition-colors">
                  Men's Essentials
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { gender: 'Women' })} className="hover:text-white transition-colors">
                  Women's Wardrobe
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', { category: 'Accessories' })} className="hover:text-white transition-colors">
                  Accessories & Bags
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('hanger-rack')} className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 font-medium">
                  ★ Hanger Boutique Rack
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li><a href="#shipping" className="hover:text-white transition-colors">Shipping & Delivery</a></li>
              <li><a href="#returns" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#sizing" className="hover:text-white transition-colors">Size & Fit Guide</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Stylist</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs uppercase tracking-widest font-semibold text-white mb-4">
              The Journal
            </h4>
            <p className="text-xs text-stone-400 mb-3">
              Subscribe to receive preview access to new hanger collections and private seasonal drops.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to NOVAÉ Journal'); }} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-stone-500 pr-10"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white transition-colors"
                  aria-label="Submit"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-stone-500">By subscribing you agree to our Privacy Policy.</p>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} NOVAÉ Studio Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-stone-400 cursor-pointer">Terms of Service</span>
            <button
              onClick={() => onNavigate('admin')}
              className="text-amber-400 hover:text-amber-300 transition-colors font-semibold flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-stone-900 border border-amber-500/30"
            >
              <span>🔐 Store Admin</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
