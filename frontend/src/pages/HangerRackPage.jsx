import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wind, Volume2, VolumeX, Sparkles, Shirt, Sliders, ArrowLeft, Info } from 'lucide-react';
import { HangerCard } from '../components/hanger/HangerCard';
import { playHangerSlideSound, playHangerClinkSound } from '../utils/audioFeedback';

export const HangerRackPage = ({ products, onSelectProduct, onNavigate }) => {
  const [breezeLevel, setBreezeLevel] = useState(1); // 0 (still), 1 (gentle), 2 (breezy), 3 (gale)
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [activeRail, setActiveRail] = useState('all'); // 'all' | 'tops' | 'outerwear' | 'trousers'

  const hangerItems = products.filter(p => p.isHangerItem);

  const filteredHangerItems = hangerItems.filter(p => {
    if (activeRail === 'all') return true;
    if (activeRail === 'tops') return p.name.includes('Shirt') || p.name.includes('Henley') || p.name.includes('Blouse');
    if (activeRail === 'outerwear') return p.name.includes('Hoodie') || p.name.includes('Trench') || p.name.includes('Blazer') || p.name.includes('Sweater');
    if (activeRail === 'trousers') return p.name.includes('Trouser') || p.name.includes('Dress');
    return true;
  });

  const triggerBreeze = () => {
    if (audioEnabled) playHangerSlideSound();
    setBreezeLevel(prev => (prev % 3) + 1);
  };

  const getSwayRotation = (idx) => {
    if (breezeLevel === 0) return [0, 0];
    if (breezeLevel === 1) return [0, -4, 3.5, -2, 1, 0];
    if (breezeLevel === 2) return [0, -7, 6, -4, 2.5, 0];
    return [0, -11, 9.5, -6, 3, 0];
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      {/* Top Banner & Controls */}
      <div className="bg-[#1C1A18] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1.5 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-xs font-semibold tracking-widest uppercase text-amber-400">
                Live Physics Wardrobe Simulation
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight">
              The Virtual Boutique Hanger Rack
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-xl font-light leading-relaxed">
              Every garment in our collection suspended from hand-turned Scandi Oak & Matte Brass hangers. Interact with the rail, trigger closet breezes, and inspect organic drape.
            </p>
          </div>

          {/* Interactive Physics Console */}
          <div className="flex flex-wrap items-center gap-3 bg-stone-900/90 p-3 rounded-2xl border border-stone-700/80 shadow-2xl">
            {/* Wind breeze button */}
            <button
              onClick={triggerBreeze}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white text-xs font-semibold transition-all active:scale-95 shadow-md"
              title="Change wind sway strength"
            >
              <Wind className="w-4 h-4" />
              <span>Sway Breeze: {breezeLevel === 1 ? 'Gentle' : breezeLevel === 2 ? 'Moderate' : 'Strong'}</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={() => {
                setAudioEnabled(!audioEnabled);
                if (!audioEnabled) playHangerClinkSound();
              }}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors"
              title={audioEnabled ? 'Mute closet sounds' : 'Enable closet sounds'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-stone-500" />}
            </button>
          </div>
        </div>
      </div>

      {/* Rail Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Garments' },
              { id: 'tops', label: 'Tops & Shirts Rail' },
              { id: 'outerwear', label: 'Outerwear & Knit Rail' },
              { id: 'trousers', label: 'Bottoms & Dresses Rail' }
            ].map((rail) => (
              <button
                key={rail.id}
                onClick={() => {
                  setActiveRail(rail.id);
                  if (audioEnabled) playHangerSlideSound();
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeRail === rail.id
                    ? 'bg-stone-900 text-white shadow-sm'
                    : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                }`}
              >
                {rail.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Hover or drag any piece to hear the rail and observe fabric momentum</span>
          </div>
        </div>
      </div>

      {/* The Closet Rails & Hangers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Heavy Polished Chrome Rail Bar */}
        <div className="relative mb-6">
          <div className="h-4 rounded-full hanger-rail-gradient shadow-lg relative">
            <div className="absolute top-0.5 inset-x-0 h-[1.5px] bg-white/80 rounded-full" />
            <div className="absolute bottom-0.5 inset-x-0 h-[1.5px] bg-black/40 rounded-full" />
          </div>
          {/* Brass End Anchors */}
          <div className="absolute -left-3 -top-1.5 w-6 h-7 rounded-md brass-accent shadow-md border border-amber-900/30" />
          <div className="absolute -right-3 -top-1.5 w-6 h-7 rounded-md brass-accent shadow-md border border-amber-900/30" />
        </div>

        {/* Dynamic Hanging Garments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pt-2">
          {filteredHangerItems.map((prod, idx) => (
            <motion.div
              key={prod.id}
              animate={{
                rotate: getSwayRotation(idx),
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: (idx % 4) * 0.4
              }}
              style={{ transformOrigin: "50% 0%" }}
            >
              <HangerCard
                product={prod}
                index={idx}
                onSelect={onSelectProduct}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
