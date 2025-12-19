
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routine, Exercise, UserSettings, ExerciseType, MovementPattern } from '../types';
import { VisualGuide } from './VisualGuide';

interface ExerciseSessionProps {
  routine: Routine;
  onComplete: () => void;
  onExit: () => void;
  settings: UserSettings;
}

export const ExerciseSession: React.FC<ExerciseSessionProps> = ({ routine, onComplete, onExit, settings }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(routine.exercises[0].durationSeconds);
  const [isBreak, setIsBreak] = useState(false);
  
  const currentExercise = routine.exercises[currentIndex];

  const playSound = useCallback((frequency = 440, type: OscillatorType = 'sine', duration = 0.1) => {
    if (!settings.soundEnabled) return;
    try {
      const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio Context failed", e);
    }
  }, [settings.soundEnabled]);
  
  const speak = useCallback((text: string, interrupt = true) => {
    if (!settings.voiceGuidanceEnabled || !('speechSynthesis' in window)) return;
    if (interrupt) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
  }, [settings.voiceGuidanceEnabled]);

  useEffect(() => {
    if (isBreak) {
        playSound(660, 'sine', 0.2);
        speak("Take a short break.", false);
    } else {
        playSound(880, 'sine', 0.1);
        speak(`${currentExercise.name}. ${currentExercise.instructionText || currentExercise.description}`);
    }
  }, [currentIndex, isBreak, currentExercise, speak, playSound]);

  const nextExercise = useCallback(() => {
    if (currentIndex < routine.exercises.length - 1) {
      setIsBreak(true);
      setTimeLeft(5); 
    } else {
      playSound(1200, 'sine', 0.5);
      speak("Session complete. Great job.");
      onComplete();
    }
  }, [currentIndex, routine.exercises.length, onComplete, speak, playSound]);

  const startNext = useCallback(() => {
    setIsBreak(false);
    setCurrentIndex(prev => prev + 1);
    setTimeLeft(routine.exercises[currentIndex + 1].durationSeconds);
  }, [currentIndex, routine.exercises]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
           const next = prev - 1;
           if (next <= 3 && next > 0 && !isBreak) {
               playSound(440, 'sine', 0.05);
           }
           return next;
        });
      }, 1000);
    } else if (isPlaying && timeLeft === 0) {
      if (isBreak) startNext();
      else nextExercise();
    }
    return () => clearInterval(interval);
  }, [isPlaying, timeLeft, isBreak, nextExercise, startNext, playSound]);

  useEffect(() => {
    setIsPlaying(true);
    return () => window.speechSynthesis.cancel();
  }, []);

  const progress = isBreak 
    ? ((5 - timeLeft) / 5) * 100 
    : ((currentExercise.durationSeconds - timeLeft) / currentExercise.durationSeconds) * 100;

  const effectiveColor = (settings.usePreferredColor && settings.preferredColor) 
    ? settings.preferredColor 
    : (currentExercise.color || '#38bdf8');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col pt-safe-top pb-safe-bottom overflow-hidden">
      {/* Mini Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Session Progress</p>
          <div className="flex items-center gap-1.5">
             {routine.exercises.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full ${i < currentIndex ? 'bg-primary' : i === currentIndex ? 'bg-primary/40' : 'bg-slate-800'}`} />
             ))}
          </div>
        </div>
        <button onClick={onExit} className="ml-6 p-2 text-slate-400 hover:text-white"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>

      {/* Main Guide Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4">
        <AnimatePresence mode='wait'>
          {isBreak ? (
            <motion.div key="break" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center p-8 glass-panel rounded-3xl w-full max-w-xs">
              <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">Up Next</p>
              <h3 className="text-2xl font-bold mb-6">{routine.exercises[currentIndex + 1]?.name}</h3>
              <div className="text-6xl font-black text-slate-100 tabular-nums">{timeLeft}</div>
            </motion.div>
          ) : (
            <motion.div key="exercise" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full flex flex-col">
              <div className="flex-1 flex items-center justify-center">
                <VisualGuide exercise={currentExercise} isActive={isPlaying} settings={settings} />
              </div>
              
              {/* Context Text */}
              <div className="px-6 py-4 text-center">
                 <h2 className="text-xl font-bold text-white mb-2">{currentExercise.name}</h2>
                 <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">{currentExercise.instructionText || currentExercise.description}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Controls */}
      <div className="p-8 pb-12 w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between gap-6 mb-8">
            <div className="text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Timer</p>
                <span className="text-3xl font-black tabular-nums text-white">{timeLeft}s</span>
            </div>
            
            <div className="flex items-center gap-4">
                <button onClick={() => { setIsPlaying(!isPlaying); playSound(500, 'sine', 0.05); }} className="w-16 h-16 rounded-3xl bg-white text-slate-900 flex items-center justify-center shadow-xl active:scale-90 transition-transform">
                    {isPlaying ? <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg> : <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7V5z"/></svg>}
                </button>
                <button onClick={() => { window.speechSynthesis.cancel(); playSound(700, 'sine', 0.05); if (currentIndex < routine.exercises.length - 1) nextExercise(); else onComplete(); }} className="w-14 h-14 rounded-3xl bg-slate-800 text-white flex items-center justify-center border border-slate-700 active:scale-90 transition-transform">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
            </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden">
            <motion.div className="h-full" style={{ backgroundColor: isBreak ? '#eab308' : effectiveColor }} initial={{ width: '0%' }} animate={{ width: `${progress}%` }} transition={{ ease: "linear", duration: 0.5 }} />
        </div>
      </div>
    </div>
  );
};
