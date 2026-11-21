import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, ChevronDown, Sparkles, Check, Share2 } from 'lucide-react';
import { InteractiveHangerViewer } from '../components/hanger/InteractiveHangerViewer';
import { RatingStars } from '../components/common/RatingStars';
import { HangerCard } from '../components/hanger/HangerCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { playHangerClinkSound } from '../utils/audioFeedback';

export const ProductDetailPage = ({ product, allProducts = [], onSelectProduct, onNavigate }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState('details'); // 'details' | 'shipping' | 'returns'

  const activeColor = product.colors?.[selectedColorIndex] || { name: 'Default', hex: '#222' };
  const currentImages = product.images || [activeColor.image];
  const activeImage = currentImages[activeImageIndex] || currentImages[0];
  const isWished = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    addToCart(product, selectedSize, activeColor.name, quantity, e);
  };

  const handleBuyNow = (e) => {
    addToCart(product, selectedSize, activeColor.name, quantity, e);
    onNavigate('checkout');
  };

  const relatedHangerItems = allProducts
    .filter(p => p.id !== product.id && (p.isHangerItem || p.category === product.category))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation matching Screen C in mockup */}
      <nav className="text-xs text-stone-400 mb-8 flex items-center gap-2">
        <button onClick={() => onNavigate('home')} className="hover:text-stone-700 transition-colors">Home</button>
        <span>/</span>
        <button onClick={() => onNavigate('shop')} className="hover:text-stone-700 transition-colors">Product</button>
        <span>/</span>
        <span className="text-stone-800 font-medium line-clamp-1">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left Side: Interactive 3D Hanger Presentation Stage & Thumbnails */}
        <div className="lg:col-span-7 space-y-6">
          <InteractiveHangerViewer
            product={product}
            activeImage={activeImage}
            selectedColor={activeColor}
          />

          {/* Thumbnail Gallery matching Screen C */}
          <div className="flex items-center gap-3 justify-center overflow-x-auto py-2">
            {currentImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-stone-100 border-2 transition-all shrink-0 ${
                  activeImageIndex === idx
                    ? 'border-stone-900 ring-2 ring-stone-900/20 scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover object-top"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Product Buy Box matching Screen C */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs uppercase tracking-widest font-semibold text-stone-400">
                {product.gender} • {product.category}
              </span>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: product.name, url: window.location.href });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="text-stone-400 hover:text-stone-900 p-1 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {product.subtitle}
            </p>

            {/* Rating Stars matching Screen C */}
            <div className="flex items-center gap-3 mt-3">
              <RatingStars rating={product.rating} count={product.reviewCount || 213} size="md" />
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-2xl sm:text-3xl font-semibold text-stone-900">
                {product.currency || 'Rs.'} {product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-stone-400 line-through">
                  {product.currency || 'Rs.'} {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-stone-200/80 pt-6 space-y-6">
            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2.5 text-stone-900">
                  <span>Size: <strong className="text-stone-600">{selectedSize}</strong></span>
                  <button className="text-stone-400 underline font-normal normal-case hover:text-stone-900">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-[44px] h-11 px-3 rounded-xl text-xs font-bold tracking-wide border transition-all ${
                        selectedSize === s
                          ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-105'
                          : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider mb-2.5 text-stone-900">
                  Color: <strong className="text-stone-600">{activeColor.name}</strong>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedColorIndex(idx)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full border transition-all ${
                        selectedColorIndex === idx
                          ? 'ring-2 ring-stone-900 ring-offset-2 scale-110 shadow-sm'
                          : 'border-stone-300 hover:scale-105'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider mb-2.5 block text-stone-900">
                Quantity
              </span>
              <div className="inline-flex items-center border border-stone-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-stone-900 select-none">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3.5 py-2.5 text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons matching Screen C */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="py-3.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <span>Buy Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full py-3 px-4 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                  isWished
                    ? 'border-red-300 text-red-600 bg-red-50/50'
                    : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWished ? 'fill-red-500 text-red-500' : ''}`} />
                <span>{isWished ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>

            {/* Accordions matching Screen C (Product Details, Shipping, Returns) */}
            <div className="border-t border-stone-200/80 pt-4 divide-y divide-stone-100 text-xs">
              {/* Product Details */}
              <div className="py-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'details' ? '' : 'details')}
                  className="w-full flex items-center justify-between font-semibold text-stone-900 text-left uppercase tracking-wider"
                >
                  <span>Product Details</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openAccordion === 'details' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'details' && (
                  <div className="pt-3 text-stone-600 space-y-2 leading-relaxed">
                    <p>{product.description}</p>
                    {product.details && (
                      <ul className="list-disc pl-5 space-y-1 pt-1 text-stone-500">
                        {product.details.map((d, idx) => (
                          <li key={idx}>{d}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="py-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')}
                  className="w-full flex items-center justify-between font-semibold text-stone-900 text-left uppercase tracking-wider"
                >
                  <span>Shipping & Delivery</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'shipping' && (
                  <p className="pt-3 text-stone-600 leading-relaxed">
                    {product.shipping || 'Standard nationwide delivery Rs. 200. Orders above Rs. 5,000 qualify for complimentary courier shipping. Delivered in 2-4 business days.'}
                  </p>
                )}
              </div>

              {/* Returns */}
              <div className="py-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'returns' ? '' : 'returns')}
                  className="w-full flex items-center justify-between font-semibold text-stone-900 text-left uppercase tracking-wider"
                >
                  <span>Returns & Exchanges</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform ${openAccordion === 'returns' ? 'rotate-180' : ''}`} />
                </button>
                {openAccordion === 'returns' && (
                  <p className="pt-3 text-stone-600 leading-relaxed">
                    {product.returns || 'We offer 30-day hassle-free exchanges and returns. Returned garments must remain in unworn condition with original closet hanger tags attached.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Clothes on Hangers */}
      {relatedHangerItems.length > 0 && (
        <section className="mt-20 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              Complete Your Wardrobe Look
            </h3>
            <span className="text-xs text-stone-400">Curated pieces that pair well</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {relatedHangerItems.map((item, idx) => (
              <HangerCard
                key={item.id}
                product={item}
                index={idx}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
