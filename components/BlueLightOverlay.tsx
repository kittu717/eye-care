
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BlueLightOverlayProps {
  enabled: boolean;
  opacity: number; // 0-100 (mapped from 0-80 setting)
  warmth: number;  // 1-10
}

export const BlueLightOverlay: React.FC<BlueLightOverlayProps> = ({ enabled, opacity, warmth }) => {
  // Color Warmth Algorithm based on specific requirements
  // Warmth 1: RGB(255, 220, 150)
  // Warmth 5: RGB(255, 188, 110)
  // Warmth 10: RGB(255, 148, 60)
  
  const getWarmthColor = (level: number) => {
    const r = 255;
    // Green starts at 220 and decreases by 8 per step
    const g = 220 - ((level - 1) * 8);
    // Blue starts at 150 and decreases by 10 per step, clamped at 0
    const b = Math.max(0, 150 - ((level - 1) * 10));
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  const color = getWarmthColor(warmth);
  const opacityValue = opacity / 100; // Convert 0-80 integer to 0.0-0.8 float

  return (
    <AnimatePresence>
      {enabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: opacityValue }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] pointer-events-none mix-blend-multiply"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  );
};
