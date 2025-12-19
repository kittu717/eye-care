
import React from 'react';
import { motion } from 'framer-motion';
import { Exercise, ExerciseType, MovementPattern, UserSettings } from '../types';

interface VisualGuideProps {
  exercise: Exercise;
  isActive: boolean;
  settings: UserSettings;
}

export const VisualGuide: React.FC<VisualGuideProps> = ({ exercise, isActive, settings }) => {
  const activeColor = (settings.usePreferredColor && settings.preferredColor) 
    ? settings.preferredColor 
    : (exercise.color || '#38bdf8');

  const speedMultiplier = settings.animationSpeed === 'slow' ? 1.5 : settings.animationSpeed === 'fast' ? 0.7 : 1;
  
  const getDotSize = () => {
      switch(settings.dotSize) {
          case 'small': return 'w-8 h-8';
          case 'large': return 'w-16 h-16';
          default: return 'w-12 h-12';
      }
  }

  const getVariants = () => {
    const { pattern } = exercise;
    const baseDuration = pattern === MovementPattern.FIGURE_EIGHT ? 4 : 3;
    const duration = baseDuration * speedMultiplier;

    const transition = {
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      repeatType: "mirror" as const
    };

    switch (pattern) {
      case MovementPattern.HORIZONTAL:
        return { animate: { x: ["-30vw", "30vw"], transition: transition } };
      case MovementPattern.VERTICAL:
        return { animate: { y: ["-25vh", "25vh"], transition: transition } };
      case MovementPattern.FIGURE_EIGHT:
        return { animate: { x: ["-25vw", "25vw", "-25vw"], y: ["-10vh", "10vh", "-10vh"], transition: { x: { duration: duration, repeat: Infinity, ease: "easeInOut" }, y: { duration: duration / 2, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" } } } };
      case MovementPattern.CIRCULAR:
        return { animate: { rotate: 360, transition: { duration: duration, repeat: Infinity, ease: "linear" } } };
      default:
        return {};
    }
  };

  const variants = getVariants();

  if (exercise.type === ExerciseType.MOVING_DOT) {
    if (exercise.pattern === MovementPattern.CIRCULAR) {
        return (
            <div className="relative w-full h-full flex items-center justify-center">
                 <div className="w-[45vw] h-[45vw] border border-slate-800 rounded-full absolute" />
                 <motion.div className="w-[45vw] h-[45vw] absolute flex items-center" variants={variants as any} animate={isActive ? "animate" : "initial"}>
                    <div className={`${getDotSize()} bg-white rounded-full absolute -left-6`} style={{ backgroundColor: activeColor, boxShadow: `0 0 30px ${activeColor}` }} />
                 </motion.div>
            </div>
        )
    }

    return (
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {exercise.pattern === MovementPattern.HORIZONTAL && <div className="absolute w-[70vw] h-[2px] bg-slate-800/50" />}
        {exercise.pattern === MovementPattern.VERTICAL && <div className="absolute h-[60vh] w-[2px] bg-slate-800/50" />}
        <motion.div className={`${getDotSize()} rounded-full z-10`} style={{ backgroundColor: activeColor, boxShadow: `0 0 30px ${activeColor}` }} variants={variants as any} animate={isActive ? "animate" : "initial"} />
      </div>
    );
  }

  // Palming/Blinking UI
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
      <div className="w-24 h-24 mb-6 rounded-3xl bg-slate-900 border border-slate-700 flex items-center justify-center" style={{ color: activeColor }}>
          {exercise.type === ExerciseType.PALMING && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/></svg>}
          {exercise.type === ExerciseType.BLINKING && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>}
          {exercise.type === ExerciseType.FOCUS_SHIFT && <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/></svg>}
      </div>
      {exercise.steps && (
        <div className="space-y-3 mt-4 text-left">
           {exercise.steps.map((s, i) => (
             <div key={i} className="flex gap-3 text-sm text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-800/50">
                <span className="font-bold text-primary">{i+1}.</span>
                <span>{s}</span>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};
