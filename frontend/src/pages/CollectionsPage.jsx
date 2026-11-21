import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Shirt, BookOpen, Layers, Compass, Eye } from 'lucide-react';
import { HangerCard } from '../components/hanger/HangerCard';

export const CollectionsPage = ({ products, onSelectProduct, onNavigate }) => {
  const collections = [
    {
      id: 'linen-capsule',
      name: 'The Pure Linen Capsule',
      season: 'Capsule 01',
      tagline: 'Effortless Neutral Living',
      description: 'Airy, organic European flax linen pieces cut in generous boxy proportions for timeless summer and transitional living.',
      heroImage: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      items: products.filter(p => p.name.includes('Linen') || p.name.includes('Shirt') || p.name.includes('Blouse'))
    },
    {
      id: 'heavy-layers',
      name: 'Autumn Heavyweight Layers',
      season: 'Capsule 02',
      tagline: 'Warm Gabardine & French Terry',
      description: '450 GSM luxury brushed French terry and water-repellent Gabardine twill engineered for brisk city evenings.',
      heroImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80',
      items: products.filter(p => p.name.includes('Hoodie') || p.name.includes('Trench') || p.name.includes('Sweater') || p.name.includes('Henley') || p.name.includes('Blazer'))
    },
    {
      id: 'leather-goods',
      name: 'Architectural Leather & Accents',
      season: 'Capsule 03',
      tagline: 'Italian Calfskin & Acetate Optics',
      description: 'Clean geometry and tactile full-grain Tuscan calfskin designed to seamlessly companion our apparel.',
      heroImage: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80',
      items: products.filter(p => p.category === 'Accessories' || p.category === 'Footwear')
    }
  ];

  const [activeCollectionId, setActiveCollectionId] = useState('linen-capsule');
  const activeCol = collections.find(c => c.id === activeCollectionId) || collections[0];

  return (
    <div className="min-h-screen">
      {/* EDITORIAL CINEMATIC HERO SECTION FOR COLLECTIONS */}
      <section className="relative bg-[#EBE7E0] overflow-hidden border-b border-stone-300">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

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
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Curated Lookbooks • Edition 2026</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-stone-900 tracking-tight leading-[1.06]">
                  The Seasonal <br />
                  <span className="italic font-normal text-stone-700 font-serif">Wardrobe Capsules</span>
                </h1>

                <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-light max-w-xl">
                  Cohesive micro-collections designed to be worn together. Each capsule presents complementary garments arranged on hangers to inspire your everyday silhouette.
                </p>
              </motion.div>

              {/* Capsule Selectors */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setActiveCollectionId(col.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      activeCollectionId === col.id
                        ? 'bg-stone-900 text-white shadow-md scale-105'
                        : 'bg-white/80 text-stone-700 hover:bg-white border border-stone-300'
                    }`}
                  >
                    {col.name} ({col.items.length})
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Active Capsule Hero Lookbook Frame */}
            <motion.div
              key={activeCol.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-200">
                <img
                  src={activeCol.heroImage}
                  alt={activeCol.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute bottom-6 inset-x-6 text-white space-y-2">
                  <span className="text-[11px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded bg-white/20 backdrop-blur-md">
                    {activeCol.season} • {activeCol.tagline}
                  </span>
                  <h3 className="text-2xl font-serif font-bold">
                    {activeCol.name}
                  </h3>
                  <p className="text-xs text-stone-200 line-clamp-2">
                    {activeCol.description}
                  </p>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Active Capsule Hanger Wardrobe Rail */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-stone-200">
          <div>
            <span className="text-xs uppercase tracking-widest font-semibold text-amber-800">
              Wardrobe Showcase
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              {activeCol.name}
            </h2>
          </div>
          <span className="text-xs text-stone-400">
            Interactive Hanger Physics Active ({activeCol.items.length} Pieces)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCol.items.map((item, idx) => (
            <HangerCard
              key={item.id}
              product={item}
              index={idx}
              onSelect={onSelectProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
