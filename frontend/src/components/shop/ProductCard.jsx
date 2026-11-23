import React, { useState } from 'react';
import { Heart, Plus, Check, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product, onSelect }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [addedRecently, setAddedRecently] = useState(false);

  const activeColor = product.colors?.[selectedColorIndex] || { name: 'Default', hex: '#333' };
  const currentImage = activeColor.image || product.images?.[0];
  const isWished = isInWishlist(product.id);
  const isAvailable = product.inStock !== false && (product.stockCount === undefined || product.stockCount > 0);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAvailable) return;
    addToCart(product, product.sizes?.[0] || 'M', activeColor.name, 1, e);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1500);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group cursor-pointer flex flex-col justify-between bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/70 hover:border-stone-300 shadow-xs hover:shadow-lg transition-all duration-300"
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#F6F5F2] mb-3.5">
          <img
            src={currentImage}
            alt={product.name}
            className={`w-full h-full object-cover object-top transition-transform duration-500 ${
              isAvailable ? 'group-hover:scale-105' : 'grayscale-[40%] opacity-90'
            }`}
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            {!isAvailable ? (
              <span className="bg-red-700 text-white text-[9px] sm:text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-md">
                Sold Out
              </span>
            ) : (
              <>
                {product.isNewArrival && (
                  <span className="bg-stone-900 text-white text-[9px] sm:text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-xs">
                    New
                  </span>
                )}
                {product.isHangerItem && (
                  <span className="bg-amber-100 text-amber-900 text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded border border-amber-200/80 shadow-xs flex items-center gap-0.5">
                    👔 Hanger Model
                  </span>
                )}
              </>
            )}
          </div>

          {/* Sold Out Overlay */}
          {!isAvailable && (
            <div className="absolute inset-0 bg-stone-900/30 backdrop-blur-[0.5px] flex items-center justify-center">
              <span className="bg-white/95 text-stone-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm border border-stone-200">
                Out of Stock
              </span>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-red-500 shadow-xs backdrop-blur-xs transition-colors z-20"
            aria-label="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Product Information */}
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-stone-600 transition-colors line-clamp-1">
            {product.name}
          </h4>
          <p className="text-[11px] sm:text-xs text-stone-400 line-clamp-1">
            {product.subtitle || product.category}
          </p>

          {/* Price & Rating */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xs sm:text-sm font-semibold text-stone-900">
                {product.currency || 'Rs.'} {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] text-stone-400 line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className="text-[11px] text-stone-600 font-medium">
              ★ {product.rating || 5.0}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action & Color Swatches */}
      <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-col gap-2">
        {/* Color swatches */}
        {product.colors && product.colors.length > 1 && (
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {product.colors.slice(0, 4).map((color, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedColorIndex(idx)}
                style={{ backgroundColor: color.hex }}
                className={`w-3 h-3 rounded-full border transition-transform ${
                  selectedColorIndex === idx ? 'ring-1 ring-stone-900 scale-110' : 'border-stone-300 hover:scale-105'
                }`}
                title={color.name}
              />
            ))}
          </div>
        )}

        {/* Quick Add Button or Sold Out label */}
        <button
          onClick={handleAddToCart}
          disabled={!isAvailable}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            !isAvailable
              ? 'bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed'
              : addedRecently
              ? 'bg-emerald-700 text-white'
              : 'bg-stone-900 hover:bg-black text-white active:scale-98 shadow-2xs'
          }`}
        >
          {!isAvailable ? (
            <span>Sold Out</span>
          ) : addedRecently ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added to Bag</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
