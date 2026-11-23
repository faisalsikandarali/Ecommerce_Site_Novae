import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, ChevronDown,
  Sparkles, Check, Share2, Ruler, Clock, Star, MessageSquare, X, AlertCircle
} from 'lucide-react';
import { InteractiveHangerViewer } from '../components/hanger/InteractiveHangerViewer';
import { RatingStars } from '../components/common/RatingStars';
import { HangerCard } from '../components/hanger/HangerCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { api } from '../services/api';

export const ProductDetailPage = ({ product, allProducts = [], onSelectProduct, onNavigate }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState('details'); // 'details' | 'shipping' | 'returns'

  // Size Guide Modal state
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Review Modal & List state
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewsList, setReviewsList] = useState(product.reviews || [
    {
      id: 'rev_1',
      author: 'Kamran S.',
      rating: 5,
      date: '3 days ago',
      verified: true,
      fit: 'True to Size',
      title: 'Flawless drape and luxurious linen weight',
      comment: 'The collar structure holds exceptionally well when hung on the boutique hanger. You can immediately feel the dense 240 GSM weave.'
    },
    {
      id: 'rev_2',
      author: 'Fatima Z.',
      rating: 5,
      date: '1 week ago',
      verified: true,
      fit: 'True to Size',
      title: 'Incredible silhouette & tailoring',
      comment: 'Arrived packaged on the signature solid oak hanger. It drapes naturally over the shoulders without bunching.'
    }
  ]);

  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    title: '',
    comment: '',
    fit: 'True to Size'
  });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState('');

  const activeColor = product.colors?.[selectedColorIndex] || { name: 'Default', hex: '#222' };
  const currentImages = product.images || [activeColor.image];
  const activeImage = currentImages[activeImageIndex] || currentImages[0];
  const isWished = isInWishlist(product.id);
  const isAvailable = product.inStock !== false && (product.stockCount === undefined || product.stockCount > 0);
  const remainingStock = product.stockCount ?? 3;

  const handleAddToCart = (e) => {
    if (!isAvailable) return;
    addToCart(product, selectedSize, activeColor.name, quantity, e);
  };

  const handleBuyNow = (e) => {
    if (!isAvailable) return;
    addToCart(product, selectedSize, activeColor.name, quantity, e);
    onNavigate('checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.author.trim() || !newReview.comment.trim()) return;

    setReviewSubmitting(true);
    try {
      const saved = await api.addReview(product.id, newReview);
      setReviewsList(prev => [
        {
          id: saved.id || `rev_${Date.now()}`,
          author: newReview.author,
          rating: newReview.rating,
          date: 'Just now',
          verified: true,
          fit: newReview.fit,
          title: newReview.title || 'Verified Boutique Review',
          comment: newReview.comment
        },
        ...prev
      ]);
      setReviewSuccessMessage('Thank you! Your verified review has been published.');
      setTimeout(() => {
        setIsReviewModalOpen(false);
        setReviewSuccessMessage('');
        setNewReview({ author: '', rating: 5, title: '', comment: '', fit: 'True to Size' });
      }, 1400);
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const relatedHangerItems = allProducts
    .filter(p => p.id !== product.id && (p.isHangerItem || p.category === product.category))
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb Navigation matching Screen C */}
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
              <RatingStars rating={product.rating || 4.9} count={reviewsList.length + 18} size="md" />
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="text-xs text-amber-900 font-medium underline hover:text-amber-950 flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Write a Review</span>
              </button>
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

            {/* Atelier Stock Status & Fast Dispatch Timer */}
            {isAvailable ? (
              <div className="mt-4 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/60 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-950">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  <span>
                    {remainingStock <= 5
                      ? `⚡ Limited Atelier Run: Only ${remainingStock} pieces remaining`
                      : `In Stock: ${remainingStock} atelier pieces ready for dispatch`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-900/80">
                  <Clock className="w-3.5 h-3.5 text-amber-800" />
                  <span>Order within <strong>2 hrs 45 mins</strong> for next-day priority courier dispatch</span>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3.5 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-stone-800 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  <span>Currently Out of Stock / Sold Out</span>
                </div>
                <span className="text-[11px] text-stone-500 font-medium bg-white px-2 py-0.5 rounded border border-stone-200">
                  Boutique Waitlist Open
                </span>
              </div>
            )}
          </div>

          <div className="border-t border-stone-200/80 pt-6 space-y-6">
            {/* Size Selector with Size Guide Trigger */}
            {product.sizes && product.sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider mb-2.5 text-stone-900">
                  <span>Size: <strong className="text-stone-600">{selectedSize}</strong></span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-stone-500 hover:text-stone-900 underline font-normal normal-case flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size Guide & Measurements</span>
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

            {/* Action Buttons with Parabolic Flying Garment Trigger */}
            <div className="space-y-3 pt-2">
              {isAvailable ? (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="py-3.5 px-4 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="py-3.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Buy Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  disabled
                  className="w-full py-3.5 px-4 rounded-xl bg-stone-200 text-stone-500 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <span>Currently Sold Out • Re-stocking Soon</span>
                </button>
              )}

              {/* Wishlist button */}
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-full py-3 px-4 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer ${
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

      {/* Customer Reviews Section */}
      <section className="mt-16 pt-12 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              Patron Reviews & Fabric Impressions
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Verified feedback from discerning collectors who wear and preserve this garment.
            </p>
          </div>
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
          >
            Leave a Review
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviewsList.map((rev) => (
            <div key={rev.id} className="p-6 rounded-2xl border border-stone-200 bg-white shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-stone-900">{rev.author}</span>
                  {rev.verified && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Verified Buyer
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-stone-400">{rev.date}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'}`}
                    />
                  ))}
                </div>
                {rev.fit && (
                  <span className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                    Fit: {rev.fit}
                  </span>
                )}
              </div>

              {rev.title && (
                <h4 className="font-serif font-bold text-sm text-stone-900">{rev.title}</h4>
              )}
              <p className="text-xs text-stone-600 leading-relaxed">{rev.comment}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Clothes on Hangers */}
      {relatedHangerItems.length > 0 && (
        <section className="mt-16 pt-12 border-t border-stone-200">
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

      {/* SIZE GUIDE MODAL */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <Ruler className="w-5 h-5 text-stone-900" />
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Boutique Sizing & Garment Drape Guide
                  </h3>
                </div>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-stone-600">
                <p>
                  All NOVAÉ pieces are tailored with European precision cuts. For this specific cut (<strong>{product.hangerDetails?.cut || 'Relaxed Boxy Fit'}</strong>), we recommend selecting your true size for the intended structured aesthetic.
                </p>

                {/* Measurements Table */}
                <div className="overflow-x-auto border border-stone-200 rounded-2xl">
                  <table className="w-full text-left">
                    <thead className="bg-stone-50 text-stone-500 font-bold uppercase tracking-wider text-[10px] border-b border-stone-200">
                      <tr>
                        <th className="py-3 px-4">Size</th>
                        <th className="py-3 px-4">Chest (cm)</th>
                        <th className="py-3 px-4">Shoulder (cm)</th>
                        <th className="py-3 px-4">Sleeve (cm)</th>
                        <th className="py-3 px-4">Length (cm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium">
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-stone-900">S (Small)</td>
                        <td className="py-2.5 px-4">96 - 100</td>
                        <td className="py-2.5 px-4">44</td>
                        <td className="py-2.5 px-4">63</td>
                        <td className="py-2.5 px-4">70</td>
                      </tr>
                      <tr className="bg-amber-50/40">
                        <td className="py-2.5 px-4 font-bold text-stone-900">M (Medium) - Model Fit</td>
                        <td className="py-2.5 px-4">102 - 106</td>
                        <td className="py-2.5 px-4">46</td>
                        <td className="py-2.5 px-4">64.5</td>
                        <td className="py-2.5 px-4">72</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-stone-900">L (Large)</td>
                        <td className="py-2.5 px-4">108 - 112</td>
                        <td className="py-2.5 px-4">48</td>
                        <td className="py-2.5 px-4">66</td>
                        <td className="py-2.5 px-4">74</td>
                      </tr>
                      <tr>
                        <td className="py-2.5 px-4 font-bold text-stone-900">XL (Extra Large)</td>
                        <td className="py-2.5 px-4">114 - 118</td>
                        <td className="py-2.5 px-4">50</td>
                        <td className="py-2.5 px-4">67.5</td>
                        <td className="py-2.5 px-4">76</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200/80 space-y-2">
                  <h5 className="font-bold text-stone-900 text-xs">How to Measure:</h5>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-stone-500">
                    <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape level under your arms.</li>
                    <li><strong>Shoulder:</strong> Measure from edge of shoulder socket to edge of opposite shoulder across back neck point.</li>
                    <li><strong>Drape on Hanger:</strong> Due to heavy {product.hangerDetails?.fabricWeight || 'French terry/flax linen'} weight, garments hang straight down with minimal creasing.</li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Got It
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WRITE A REVIEW MODAL */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Write a Product Review
                  </h3>
                  <p className="text-xs text-stone-500">{product.name}</p>
                </div>
                <button
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reviewSuccessMessage ? (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-600" />
                  <span>{reviewSuccessMessage}</span>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  {/* Star Rating Selector */}
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1.5">Your Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="p-1 text-stone-300 hover:text-amber-500 transition-colors"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newReview.rating
                                ? 'fill-amber-500 text-amber-500'
                                : 'text-stone-300'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-stone-500 font-semibold ml-2">
                        {newReview.rating} out of 5 stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Asad B."
                      value={newReview.author}
                      onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Headline / Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Exceptional fabric quality and drape"
                      value={newReview.title}
                      onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">How did it fit?</label>
                    <select
                      value={newReview.fit}
                      onChange={(e) => setNewReview({ ...newReview, fit: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none"
                    >
                      <option value="Runs Small">Runs Small (Consider sizing up)</option>
                      <option value="True to Size">True to Size (Perfect fit)</option>
                      <option value="Runs Large">Runs Large (Oversized relaxed cut)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">Detailed Review</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell other boutique patrons about the feel of the fabric, weight, collar cut, and hanger presentation..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:border-stone-900 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-600 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white font-semibold shadow-md disabled:opacity-50"
                    >
                      {reviewSubmitting ? 'Publishing...' : 'Publish Review'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
