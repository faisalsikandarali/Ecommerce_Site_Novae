import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shirt, ChevronRight } from 'lucide-react';
import { TrustBadges } from '../components/common/TrustBadges';
import { HangerRackShowcase } from '../components/hanger/HangerRackShowcase';
import { ProductCard } from '../components/shop/ProductCard';

export const HomePage = ({ products, onSelectProduct, onNavigate }) => {
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Hero Section matching Screen A in Mockup */}
      <section className="relative bg-[#F4EFEB] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 z-10 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-stone-300 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Autumn / Everyday Collection 2026</span>
                </div>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif text-stone-900 font-medium tracking-tight leading-[1.08]">
                  Designed for <br />
                  <span className="italic font-normal">everyday living.</span>
                </h1>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-stone-600 text-base sm:text-lg max-w-lg leading-relaxed font-light"
              >
                Discover thoughtfully selected products made to fit your style, routine, and everyday life. Experience interactive hanging animations on authentic wooden rails.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <button
                  onClick={() => onNavigate('shop', { isNew: true })}
                  className="px-8 py-4 bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl transition-all shadow-xl hover:shadow-stone-900/20 active:scale-95 flex items-center gap-2"
                >
                  <span>Shop New Arrivals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('hanger-rack')}
                  className="px-8 py-4 bg-white/80 hover:bg-white text-stone-900 text-xs sm:text-sm font-semibold tracking-wider uppercase rounded-xl transition-all border border-stone-300 hover:border-stone-400 active:scale-95 flex items-center gap-2"
                >
                  <Shirt className="w-4 h-4 text-amber-700" />
                  <span>Interactive Hanger Rack</span>
                </button>
              </motion.div>
            </div>

            {/* Right Hero Image Showcase with Layered Model & Hanger Accent */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Image Frame */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-stone-200">
                  <img
                    src="https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1200&q=80"
                    alt="NOVAÉ Everyday Linen Shirt"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <span className="text-[11px] uppercase tracking-widest font-semibold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-md">
                      Featured Piece
                    </span>
                    <h3 className="text-xl font-serif font-bold mt-2">
                      Classic Oversized Linen
                    </h3>
                    <p className="text-xs text-stone-200">Rs. 2,498 • Handcrafted</p>
                  </div>
                </div>

                {/* Floating Hanger Mini Card Accent */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  onClick={() => onNavigate('hanger-rack')}
                  className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-stone-200/80 hidden sm:flex items-center gap-3 cursor-pointer hover:scale-105 transition-transform"
                >
                  <div className="w-12 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=300&q=80"
                      alt="Essential Hoodie"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-amber-700 font-semibold uppercase">
                      <Shirt className="w-3 h-3" />
                      <span>Hanger Physics</span>
                    </div>
                    <p className="text-xs font-bold text-stone-900">Virtual Wardrobe</p>
                    <p className="text-[11px] text-stone-500">Tap to slide on rail →</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <TrustBadges />

      {/* SIGNATURE INTERACTIVE HANGER RACK (The core feature requested by user!) */}
      <HangerRackShowcase
        products={products}
        onSelectProduct={onSelectProduct}
      />

      {/* Best Sellers Section matching Screen A in Mockup */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-400">
              Curated Favorites
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-1">
              Best Sellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-semibold text-stone-900 hover:text-stone-600 flex items-center gap-1 transition-colors group"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 5-Column Grid matching reference mockup Screen A */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* Secondary Promo Banner matching Screen A bottom: "New banner lead /shop" */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-stone-900 text-white p-8 sm:p-14">
          <div className="absolute inset-0 opacity-40 mix-blend-overlay">
            <img
              src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1600&q=80"
              alt="NOVAÉ Outerwear Collection"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 max-w-xl space-y-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-400">
              Exclusive Drop
            </span>
            <h3 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
              New banner lead /shop
            </h3>
            <p className="text-stone-300 text-sm font-light">
              Explore our latest collection and find pieces designed to elevate your everyday silhouette. Engineered with breathable fabrics and modern tailoring.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onNavigate('shop')}
                className="px-6 py-3 bg-white text-stone-900 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition-colors shadow-lg"
              >
                Shop Collection
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
