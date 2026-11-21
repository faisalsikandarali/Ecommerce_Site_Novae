import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';

export const CartDrawer = ({ onNavigateToCheckout, onNavigateToShop, onNavigateToCart }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    totalItemsCount,
    subtotal,
    shippingCost,
    grandTotal
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-stone-900" />
                  <h3 className="font-semibold text-stone-900 text-base">
                    Cart Drawer ({totalItemsCount})
                  </h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="bg-stone-50 px-5 py-2.5 border-b border-stone-200/80">
                <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                  <span>
                    {subtotal >= 5000
                      ? '🎉 You unlocked Free Express Shipping!'
                      : `Add Rs. ${(5000 - subtotal).toLocaleString()} more for Free Shipping`}
                  </span>
                  <span className="font-semibold text-stone-900">
                    {Math.min(100, Math.round((subtotal / 5000) * 100))}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-stone-900 transition-all duration-500"
                    style={{ width: `${Math.min(100, (subtotal / 5000) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  // Empty State matching Screen D in mockup
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center text-stone-400 mb-4 border border-stone-200/60">
                      <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                    </div>
                    <h4 className="text-lg font-serif font-semibold text-stone-900 mb-1">
                      Empty cart state
                    </h4>
                    <p className="text-xs text-stone-500 max-w-xs mb-6">
                      Your boutique bag is currently empty. Explore our wardrobe pieces on hangers and find your everyday style.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigateToShop();
                      }}
                      className="px-6 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      Explore Collection
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100">
                    {cart.map((item) => (
                      <CartItem key={item.cartItemId} item={item} />
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer */}
              {cart.length > 0 && (
                <div className="p-5 border-t border-stone-200 bg-stone-50/70 space-y-4">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold text-stone-900">
                        Rs. {subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery (Free above Rs. 5000)</span>
                      <span className={shippingCost === 0 ? 'text-emerald-600 font-semibold' : 'text-stone-900'}>
                        {shippingCost === 0 ? 'FREE' : `Rs. ${shippingCost}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                      <span>Total</span>
                      <span>Rs. {grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigateToCart && onNavigateToCart();
                      }}
                      className="py-3 px-3 bg-white border border-stone-300 hover:border-stone-800 text-stone-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View Bag</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        onNavigateToCheckout();
                      }}
                      className="py-3 px-3 bg-stone-900 hover:bg-black text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <span>Checkout</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Guaranteed safe and encrypted checkout</span>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
