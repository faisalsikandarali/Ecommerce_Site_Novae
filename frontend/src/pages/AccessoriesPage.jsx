import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Watch, Briefcase, Eye, ArrowRight, Compass, CheckCircle2 } from 'lucide-react';
import { ProductCard } from '../components/shop/ProductCard';

export const AccessoriesPage = ({ products, onSelectProduct, onNavigate }) => {
  const accessories = products.filter(p => p.category === 'Accessories' || p.category === 'Backpack' || p.category === 'Footwear');
  const [isHeroHovered, setIsHeroHovered] = useState(false);

  const heroItem = accessories.find(p => p.id === 'nv-103') || accessories[0];

  return (
    <div className="min-h-screen">
      {/* EDITORIAL PRO HERO SECTION FOR ACCESSORIES & LEATHER */}
      <section className="relative bg-[#ECE8E1] overflow-hidden border-b border-stone-300">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-stone-300/40 rounded-full blur-2xl pointer-events-none" />

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
                  <span>Objects of Utility & Form • 2026</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-stone-900 tracking-tight leading-[1.06]">
                  Tactile Accents <br />
                  <span className="italic font-normal text-stone-700 font-serif">Italian Leather & Steel</span>
                </h1>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-light max-w-xl">
                  Precision Italian leather goods, bio-acetate eyewear, and surgical-grade timepiece accents designed to seamlessly companion our everyday apparel collections.
                </p>
              </motion.div>

              {/* Material Craft Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
              >
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-stone-300/80 shadow-2xs flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-stone-800 shrink-0" />
                  <span className="text-xs font-medium text-stone-800">Full-Grain Calfskin</span>
                </div>
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-stone-300/80 shadow-2xs flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-stone-800 shrink-0" />
                  <span className="text-xs font-medium text-stone-800">Bio-Acetate Frames</span>
                </div>
                <div className="p-3 bg-white/70 backdrop-blur-xs rounded-xl border border-stone-300/80 shadow-2xs flex items-center gap-2.5">
                  <Watch className="w-4 h-4 text-stone-800 shrink-0" />
                  <span className="text-xs font-medium text-stone-800">316L Surgical Steel</span>
                </div>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <a
                  href="#accessories-catalog"
                  className="px-7 py-3.5 bg-stone-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xl active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Accessories</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => onNavigate('shop')}
                  className="px-7 py-3.5 bg-white/80 hover:bg-white text-stone-900 text-xs font-bold uppercase tracking-wider rounded-xl transition-all border border-stone-300 active:scale-95 flex items-center gap-2"
                >
                  <span>Complete Wardrobe</span>
                </button>
              </motion.div>
            </div>

            {/* Right Column: Hero Focus Leather Product */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative flex flex-col items-center"
            >
              <motion.div
                onMouseEnter={() => setIsHeroHovered(true)}
                onMouseLeave={() => setIsHeroHovered(false)}
                animate={isHeroHovered ? {
                  scale: 1.02,
                  y: -4
                } : {
                  scale: 1,
                  y: 0
                }}
                transition={{ duration: 0.4 }}
                onClick={() => heroItem && onSelectProduct(heroItem)}
                className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-stone-300/80 cursor-pointer relative group flex flex-col"
              >
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F7F6F3]">
                  <img
                    src={heroItem?.images?.[0]}
                    alt={heroItem?.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                    Craft Spotlight
                  </div>

                  <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                        Tuscan Vegetable-Tanned
                      </p>
                      <h3 className="text-base font-serif font-bold">
                        {heroItem?.name}
                      </h3>
                    </div>
                    <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md group-hover:bg-white group-hover:text-black transition-colors">
                      <Eye className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <div className="pt-4 px-1 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    Rs. {heroItem?.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                    ★ 4.9 • Handcrafted
                  </span>
                </div>
              </motion.div>

              <div className="w-48 h-3 bg-stone-400/30 rounded-full blur-md mt-4" />
            </motion.div>

          </div>
        </div>
      </section>

      {/* Catalog Grid */}
      <div id="accessories-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            Curated Accessories ({accessories.length})
          </h2>
          <span className="text-xs text-stone-400">Guaranteed Genuine Materials</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {accessories.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
