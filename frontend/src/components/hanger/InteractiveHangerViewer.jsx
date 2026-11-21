import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { HangerSvg } from './HangerSvg';
import { Sparkles, Maximize2, RotateCcw, Compass } from 'lucide-react';
import { playHangerSlideSound } from '../../utils/audioFeedback';

export const InteractiveHangerViewer = ({ product, activeImage, selectedColor }) => {
  const containerRef = useRef(null);
  const [isSwinging, setIsSwinging] = useState(false);
  const [activeTab, setActiveTab] = useState('hanger'); // 'hanger' | 'fabric' | 'back'

  // Mouse physics for natural 3D tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for pendulum physics
  const springConfig = { damping: 15, stiffness: 120, mass: 0.8 };
  const rotateZ = useSpring(useTransform(mouseX, [-200, 200], [-5, 5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-7, 7]), springConfig);
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [5, -5]), springConfig);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const triggerManualSway = () => {
    setIsSwinging(true);
    playHangerSlideSound();
    setTimeout(() => setIsSwinging(false), 2400);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Top Hanger Rail representation */}
      <div className="w-full relative px-6 py-2">
        <div className="h-2 rounded-full hanger-rail-gradient shadow-sm relative">
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-4 rounded bg-stone-700/20 blur-xs" />
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-[4/5] sm:aspect-square max-w-lg bg-[#F5F4F0] rounded-3xl overflow-hidden p-6 flex flex-col items-center justify-start border border-stone-200/70 shadow-inner select-none"
        style={{ perspective: 1200 }}
      >
        {/* Subtle Luxury Studio Background Lighting */}
        <div className="absolute inset-0 bg-radial from-white/90 via-stone-100/50 to-stone-200/30 pointer-events-none" />

        {/* Hanger Hook Top Anchor */}
        <div className="w-64 z-20 -mb-7">
          <HangerSvg variant={product.hangerDetails?.hangerType?.includes('Black') ? 'black' : 'wood'} />
        </div>

        {/* Dynamic Hanging Garment Container */}
        <motion.div
          style={{
            transformOrigin: "50% 0%",
            rotateZ: isSwinging ? undefined : rotateZ,
            rotateY: isSwinging ? undefined : rotateY,
            rotateX: isSwinging ? undefined : rotateX,
          }}
          animate={isSwinging ? {
            rotateZ: [0, -7, 6, -4, 2, 0],
            rotateY: [0, -5, 5, -2, 1, 0]
          } : {}}
          transition={isSwinging ? { duration: 2.2, ease: "easeInOut" } : undefined}
          className="relative w-full h-[85%] rounded-2xl overflow-hidden shadow-2xl border border-stone-200/50 bg-white"
        >
          {/* Garment Image */}
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-cover object-top transition-all duration-500"
          />

          {/* Fabric Drape Gradient Simulation */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

          {/* Interactive Hanger Tag Badge */}
          {product.hangerDetails && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm text-left">
              <p className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">Hanger Spec</p>
              <p className="text-xs font-medium text-stone-800">{product.hangerDetails.fabricWeight}</p>
            </div>
          )}

          {/* Manual Sway Button */}
          <button
            onClick={triggerManualSway}
            className="absolute bottom-4 right-4 bg-stone-900/80 hover:bg-black text-white text-xs px-3 py-1.5 rounded-xl backdrop-blur-md shadow-md flex items-center gap-1.5 transition-transform active:scale-95"
            title="Sway on hanger"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sway Hanger</span>
          </button>
        </motion.div>

        {/* Dynamic Floor Shadow */}
        <motion.div
          style={{
            transformOrigin: "50% 50%",
            scaleX: useTransform(mouseX, [-200, 200], [0.95, 1.05])
          }}
          className="w-48 h-4 bg-stone-400/30 rounded-full blur-md mt-auto"
        />
      </div>

      {/* Helpful Hint */}
      <div className="flex items-center gap-2 mt-3 text-xs text-stone-400">
        <Compass className="w-3.5 h-3.5 text-stone-400" />
        <span>Move cursor or tap to gently swing the hanger in 3D</span>
      </div>
    </div>
  );
};
