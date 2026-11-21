import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const NotificationToast = () => {
  const { toastNotification, setToastNotification, setIsCartOpen } = useCart();

  return (
    <AnimatePresence>
      {toastNotification && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-5 right-5 z-50 max-w-sm w-full bg-[#111111] text-white px-4 py-3.5 rounded-xl shadow-2xl border border-stone-800 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
              <Check className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-sm font-medium tracking-wide">
                {toastNotification.message}
              </p>
              {toastNotification.item && (
                <p className="text-xs text-stone-400 line-clamp-1">
                  {toastNotification.item.name} {toastNotification.item.size ? `(${toastNotification.item.size})` : ''}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart</span>
            </button>
            <button
              onClick={() => setToastNotification(null)}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
