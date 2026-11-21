import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shirt, LayoutGrid, ArrowRight, Eye, ShieldCheck, Feather, Wind } from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';
import { HangerCard } from '../components/hanger/HangerCard';
import { HangerRackShowcase } from '../components/hanger/HangerRackShowcase';
import { HangerSvg } from '../components/hanger/HangerSvg';

export const MenPage = ({ products, onSelectProduct, onNavigate }) => {
  const menProducts = products.filter(p => p.gender === 'Men' || p.category === 'Accessories');
  const [viewMode, setViewMode] = useState('hanger');
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const featuredPiece = menProducts.find(p => p.id === 'nv-102') || menProducts[0];

  return (
    <div className="min-h-screen">
      {/* EDITORIAL PRO HERO SECTION FOR MEN'S WARDROBE */}
      <section className="relative bg-[#EAE6DE] overflow-hidden border-b border-stone-300">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-stone-300/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-semibold tracking-widest uppercase shadow-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>The Modern Essentialist • 2026</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-stone-900 tracking-tight leading-[1.06]">
                  Understated Luxury <br />
                  <span className="italic font-normal text-stone-700 font-serif">In Everyday Form</span>
                </h1>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-light max-w-xl">
                  Boxy oversized linen shirts, heavyweight French terry fleece, and tailored trousers. Built for comfort, durability, and perpetual refinement—hung with precision.
                </p>
              </motion.div>

              {/* Craft Specs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
              >
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-stone-300/80 shadow-2xs flex items-center gap-2.5">
                  <Feather className="w-4 h-4 text-stone-800 shrink-0" />
                  <span className="text-xs font-medium text-stone-800">450 GSM French Terry</span>
                </div>
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-stone-300/80 shadow-2xs flex items-center gap-2.5">
                  <Shirt className="w-4 h-4 text-stone-800 shrink-0" />
                  <span className="text-xs font-medium text-stone-800">Boxy Dropped Cut</span>
                </div>
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-stone-300/80 shadow-2xs flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-stone-800 shrink-0" />
                  <span className="text-xs font-medium text-stone-800">Pre-shrunk Guarantee</span>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <a
                  href="#men-catalog"
                  className="px-7 py-3.5 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xl active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Men's Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onNavigate('hanger-rack')}
                  className="px-7 py-3.5 bg-white/80 hover:bg-white text-stone-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-stone-300 active:scale-95 flex items-center gap-2"
                >
                  <Wind className="w-4 h-4 text-amber-800" />
                  <span>Interactive Clothing Rail</span>
                </button>
              </motion.div>
            </div>

            {/* Right Column: Garment Suspended on Coat Hanger */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative flex flex-col items-center"
            >
              <div className="w-full max-w-sm relative -mb-3 z-0">
                <div className="h-3 rounded-full hanger-rail-gradient shadow-md" />
                <div className="absolute -left-2 -top-1 w-4 h-5 rounded-sm brass-accent shadow-xs" />
                <div className="absolute -right-2 -top-1 w-4 h-5 rounded-sm brass-accent shadow-xs" />
              </div>

              <div className="w-48 z-10 -mb-5 transition-transform duration-300">
                <HangerSvg variant="black" />
              </div>

              <motion.div
                onMouseEnter={() => setIsHeroHovered(true)}
                onMouseLeave={() => setIsHeroHovered(false)}
                animate={isHeroHovered ? {
                  rotate: [0, -5, 4.5, -3, 1.5, 0],
                  y: [-1, 2, -1, 1, 0]
                } : {
                  rotate: [0, -1.8, 1.8, 0],
                }}
                transition={isHeroHovered ? {
                  duration: 2.4,
                  ease: "easeInOut"
                } : {
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{ transformOrigin: "50% -12px" }}
                onClick={() => featuredPiece && onSelectProduct(featuredPiece)}
                className="w-full max-w-sm bg-white rounded-3xl p-4 shadow-2xl border border-stone-300/80 cursor-pointer relative group flex flex-col"
              >
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#F6F5F2]">
                  <img
                    src={featuredPiece?.images?.[0]}
                    alt={featuredPiece?.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    Heavyweight Essential
                  </div>

                  <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-amber-200 font-semibold">
                        {featuredPiece?.hangerDetails?.fabricWeight}
                      </p>
                      <h3 className="text-base font-serif font-bold">
                        {featuredPiece?.name}
                      </h3>
                    </div>
                    <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-colors">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="pt-3 px-1 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900">
                    Rs. {featuredPiece?.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                    👔 Tap to Inspect
                  </span>
                </div>
              </motion.div>

              <div className="w-48 h-3 bg-stone-400/30 rounded-full blur-md mt-3" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Men's Signature Hanger Rack */}
      <HangerRackShowcase
        products={menProducts}
        onSelectProduct={onSelectProduct}
      />

      {/* Catalog Grid */}
      <div id="men-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Men's Catalog ({menProducts.length})
          </h2>

          <div className="bg-stone-100 p-1 rounded-xl flex items-center border border-stone-200">
            <button
              onClick={() => setViewMode('hanger')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === 'hanger' ? 'bg-stone-900 text-white shadow-xs' : 'text-stone-500'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>Hangers</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>

        {viewMode === 'hanger' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {menProducts.map((prod, idx) => (
              <HangerCard
                key={prod.id}
                product={prod}
                index={idx}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {menProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
