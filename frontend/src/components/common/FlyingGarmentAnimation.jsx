import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const FlyingGarmentAnimation = ({ flyingItem, onAnimationComplete }) => {
  if (!flyingItem) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={flyingItem.id}
        initial={{
          top: flyingItem.startY,
          left: flyingItem.startX,
          width: 90,
          height: 120,
          scale: 1,
          opacity: 1,
          rotate: 0,
        }}
        animate={{
          top: [flyingItem.startY, Math.min(flyingItem.startY, flyingItem.endY) - 70, flyingItem.endY],
          left: [flyingItem.startX, (flyingItem.startX + flyingItem.endX) / 2, flyingItem.endX],
          scale: [1, 0.8, 0.18],
          opacity: [1, 0.9, 0.7],
          rotate: [0, -15, -25],
        }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1], // Cubic bezier luxury swoop
        }}
        onAnimationComplete={onAnimationComplete}
        className="fixed z-50 pointer-events-none rounded-xl overflow-hidden shadow-2xl border-2 border-stone-800 bg-white"
        style={{
          boxShadow: '0 20px 30px rgba(0,0,0,0.3)',
        }}
      >
        <img
          src={flyingItem.image}
          alt="Adding to bag"
          className="w-full h-full object-cover object-top"
        />
        {/* Little wooden hanger bar on top of flying garment */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-800" />
      </motion.div>
    </AnimatePresence>
  );
};
