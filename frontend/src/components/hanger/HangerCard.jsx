import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { HangerSvg } from './HangerSvg';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { playHangerClinkSound, playHangerSlideSound } from '../../utils/audioFeedback';

export const HangerCard = ({ product, onSelect, index = 0, isCompact = false }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const activeColor = product.colors?.[selectedColorIndex] || { name: 'Default', hex: '#333' };
  const currentImage = activeColor.image || product.images?.[0];
  const isWished = isInWishlist(product.id);

  const handleMouseEnter = () => {
    setIsHovered(true);
    playHangerSlideSound();
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addToCart(product, product.sizes?.[0] || 'M', activeColor.name, 1, e);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="flex flex-col items-center group relative">
      {/* Top Hanger Hook Assembly that hangs on rail */}
      <div className="w-40 sm:w-48 z-10 -mb-5 transition-transform duration-300 group-hover:-translate-y-1">
        <HangerSvg variant={product.hangerDetails?.hangerType?.includes('Black') ? 'black' : 'wood'} />
      </div>

      {/* Swaying Garment Body */}
      <motion.div
        animate={isHovered ? {
          rotate: [0, -4, 3.5, -2, 1, 0],
          y: [-1, 2, -1, 1, 0]
        } : {
          rotate: [0, -1, 1, 0],
          y: 0
        }}
        transition={isHovered ? {
          duration: 2.4,
          ease: "easeInOut",
        } : {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: (index % 4) * 0.7
        }}
        style={{ transformOrigin: "50% -12px" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full relative bg-white rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl transition-shadow duration-300 border border-stone-200/80 cursor-pointer flex flex-col"
        onClick={() => onSelect && onSelect(product)}
      >
        {/* Subtle cloth hanger suspension lines */}
        <div className="absolute top-0 inset-x-8 h-1 bg-gradient-to-b from-stone-300/40 to-transparent pointer-events-none" />

        {/* Top Badges: New / Fabric */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 items-start">
          {product.isNewArrival && (
            <span className="bg-stone-900 text-white text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full shadow-sm">
              New
            </span>
          )}
          {product.hangerDetails?.fabricWeight && (
            <span className="bg-stone-100/90 backdrop-blur-xs text-stone-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-stone-200/60 hidden sm:inline-flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" />
              {product.hangerDetails.fabricWeight.split(' ')[0]} {product.hangerDetails.fabricWeight.split(' ')[1]}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label="Wishlist"
          className="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 backdrop-blur-xs hover:bg-white text-stone-700 hover:text-red-500 shadow-sm transition-all duration-200"
        >
          <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Garment Image on Hanger */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#F7F6F3] flex items-center justify-center mb-3">
          <motion.img
            src={currentImage}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Quick Action Overlay on Desktop */}
          <div className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickAdd}
              className="flex-1 bg-stone-900/90 hover:bg-black backdrop-blur-xs text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Quick Add</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelect && onSelect(product);
              }}
              className="p-2.5 bg-white/90 hover:bg-white text-stone-900 rounded-xl shadow-lg transition-transform active:scale-95"
              title="Inspect"
            >
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>{product.gender || 'Everyday'} • {product.category}</span>
              <span className="text-amber-600 font-medium flex items-center gap-0.5">
                ★ {product.rating}
              </span>
            </div>
            <h3 className="font-medium text-stone-900 text-sm line-clamp-1 group-hover:text-stone-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-stone-500 line-clamp-1 mb-2">
              {product.subtitle || 'NOVAÉ Everyday Essential'}
            </p>
          </div>

          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-stone-900">
                {product.currency || 'Rs.'} {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-1.5 text-xs text-stone-400 line-through">
                  {product.currency || 'Rs.'} {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Color Swatch Dots */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {product.colors.slice(0, 4).map((c, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => setSelectedColorIndex(cIdx)}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    className={`w-3.5 h-3.5 rounded-full border transition-all ${
                      selectedColorIndex === cIdx
                        ? 'ring-1 ring-offset-1 ring-stone-800 scale-110'
                        : 'border-black/15 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
