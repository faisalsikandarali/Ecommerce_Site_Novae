import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Shirt } from 'lucide-react';

export const SearchModal = ({ isOpen, onClose, products = [], onSelectProduct }) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = products.filter(p => {
    if (!searchTerm.trim()) return false;
    const q = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.subtitle?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 flex items-start justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden z-10"
        >
          {/* Search Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center gap-3">
            <Search className="w-5 h-5 text-stone-400 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search shirts, hoodies, bags, shoes, fabrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-base sm:text-lg text-stone-900 placeholder-stone-400 focus:outline-none"
            />
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Quick Suggestions */}
          {!searchTerm && (
            <div className="p-6">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">
                Popular Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Classic Oversized Shirt', 'Essential Hoodie', 'Linen Trousers', 'Leather Bag', 'Sneakers', 'Hanger Collection'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="text-xs px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {searchTerm && (
            <div className="max-h-96 overflow-y-auto p-4 divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-stone-500 text-sm">
                  No products found for "{searchTerm}".
                </div>
              ) : (
                filtered.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                    className="flex items-center gap-4 py-3 px-2 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors group"
                  >
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-14 h-16 object-cover object-top rounded-lg bg-stone-100"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-stone-900 group-hover:text-stone-600 transition-colors">
                          {product.name}
                        </h4>
                        {product.isHangerItem && (
                          <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5">
                            <Shirt className="w-2.5 h-2.5" /> Hanger
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-400">{product.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-stone-900">
                        {product.currency || 'Rs.'} {product.price.toLocaleString()}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-stone-900 transition-colors" />
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
