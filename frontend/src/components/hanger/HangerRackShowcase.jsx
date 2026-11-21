import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Wind, Volume2, VolumeX, Sparkles, SlidersHorizontal } from 'lucide-react';
import { HangerCard } from './HangerCard';
import { playHangerSlideSound } from '../../utils/audioFeedback';

export const HangerRackShowcase = ({ products = [], onSelectProduct }) => {
  const [swayTrigger, setSwayTrigger] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const railRef = useRef(null);

  // Filter to clothing items that hang
  const hangingProducts = products.filter(p => p.isHangerItem || p.category === 'Clothing');

  const scrollRail = (direction) => {
    if (railRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      railRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      if (audioEnabled) playHangerSlideSound();
    }
  };

  const triggerRackWind = () => {
    setSwayTrigger(prev => prev + 1);
    if (audioEnabled) playHangerSlideSound();
  };

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
            <span className="text-xs uppercase tracking-widest font-semibold text-stone-500">
              Interactive Boutique Wardrobe
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif text-stone-900 font-semibold tracking-tight">
            The Signature Hanger Rack
          </h2>
          <p className="text-stone-500 text-sm max-w-xl mt-1">
            Experience our garments hung as they were designed to be seen. Hover or drag along the rail to watch the fabric drape and sway with realistic physics.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          {/* Sway rack button */}
          <button
            onClick={triggerRackWind}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200 shadow-xs"
            title="Sway garments on the rack"
          >
            <Wind className="w-3.5 h-3.5 text-stone-600" />
            <span>Gentle Breeze</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className="p-2 text-xs rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200 shadow-xs"
            title={audioEnabled ? 'Mute boutique sounds' : 'Enable boutique sounds'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
          </button>

          {/* Navigation arrows */}
          <div className="flex items-center gap-1.5 border border-stone-200 rounded-full p-1 bg-white shadow-xs">
            <button
              onClick={() => scrollRail('left')}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRail('right')}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-700 transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* The Clothing Rack Assembly */}
      <div className="relative pt-6">
        {/* Wall mounting brackets */}
        <div className="absolute top-8 left-0 w-4 h-8 bg-stone-400 rounded-sm shadow-md z-0" />
        <div className="absolute top-8 right-0 w-4 h-8 bg-stone-400 rounded-sm shadow-md z-0" />

        {/* Polished Chrome Rail Bar */}
        <div className="relative z-0 mx-2">
          {/* Main rod */}
          <div className="h-3 rounded-full hanger-rail-gradient relative shadow-md">
            {/* Top metallic highlight reflection */}
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-white/70 rounded-full" />
            {/* Bottom shadow line */}
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-black/40 rounded-full" />
          </div>

          {/* End caps */}
          <div className="absolute -left-2 -top-1 w-4 h-5 rounded-sm bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 shadow-md" />
          <div className="absolute -right-2 -top-1 w-4 h-5 rounded-sm bg-gradient-to-r from-amber-700 via-amber-400 to-amber-600 shadow-md" />
        </div>

        {/* Scrollable Garment Rail Container */}
        <div
          ref={railRef}
          className="flex gap-6 sm:gap-8 overflow-x-auto pb-8 pt-3 px-4 sm:px-6 snap-x snap-mandatory scrollbar-none scroll-smooth items-start"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {hangingProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              className="w-64 sm:w-72 shrink-0 snap-center"
              animate={swayTrigger > 0 ? {
                rotate: [0, -6, 5, -3, 2, 0],
                transition: {
                  duration: 2.8,
                  ease: "easeInOut",
                  delay: idx * 0.12
                }
              } : {}}
              style={{ transformOrigin: "50% 0%" }}
            >
              <HangerCard
                product={product}
                index={idx}
                onSelect={onSelectProduct}
              />
            </motion.div>
          ))}
        </div>

        {/* Shadow cast on the floor by the hanging clothes */}
        <div className="w-full h-4 bg-radial from-stone-400/20 via-transparent to-transparent blur-md -mt-4 pointer-events-none" />
      </div>

      {/* Boutique Tip */}
      <div className="text-center mt-3 text-xs text-stone-400 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-stone-400" />
        <span>Hover or drag items along the bar to see the natural organic drape</span>
      </div>
    </section>
  );
};
