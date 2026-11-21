import React, { useState } from 'react';
import { Heart, Plus, Check } from 'lucide-react';
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

  const handleAddToCart = (e) => {
    e.stopPropagation();
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
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
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
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 hover:bg-white text-stone-700 hover:text-red-500 shadow-xs backdrop-blur-xs transition-colors"
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
            <span className="text-xs sm:text-sm font-semibold text-stone-900">
              {product.currency || 'Rs.'} {product.price.toLocaleString()}
            </span>
            <span className="text-[11px] text-stone-600 font-medium">
              ★ {product.rating}
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

        {/* Add to Cart Button (matches mockup 'Add to Cart' pill) */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 flex items-center justify-center gap-1.5 ${
            addedRecently
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-900 hover:bg-black text-white active:scale-[0.98]'
          }`}
        >
          {addedRecently ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Added!</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
