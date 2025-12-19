
import React, { useState, useEffect, useRef } from 'react';
import { DEFAULT_ROUTINE, QUICK_BREAK_ROUTINE } from './constants';
import { Routine, UserSettings, DailyLog, BlueLightSettings, BlueLightLog } from './types';
import { ExerciseSession } from './components/ExerciseSession';
import { CustomRoutineBuilder } from './components/CustomRoutineBuilder';
import { SettingsModal } from './components/SettingsModal';
import { DailyCheckIn } from './components/DailyCheckIn';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { BlueLightOverlay } from './components/BlueLightOverlay';
import { EyeComfortView } from './components/EyeComfortView';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_SETTINGS: UserSettings = {
  soundEnabled: true,
  voiceGuidanceEnabled: true,
  preferredColor: '#38bdf8',
  usePreferredColor: false,
  animationSpeed: 'normal',
  dotSize: 'medium',
  reminders: {
    enabled: false,
    intervalMinutes: 20,
    startTime: '09:00',
    endTime: '17:00',
    message: 'Time to rest your eyes! Follow the 20-20-20 rule.',
    soundEnabled: true,
    lastNotified: Date.now()
  }
};

const DEFAULT_BLUE_LIGHT: BlueLightSettings = {
    enabled: false,
    opacity: 30,
    warmth: 5,
    schedule: {
        enabled: false,
        startTime: '21:00',
        endTime: '07:00',
        days: [0, 1, 2, 3, 4, 5, 6]
    },
    profiles: [
        { id: 'p1', name: 'Reading', opacity: 40, warmth: 6 },
        { id: 'p2', name: 'Gaming', opacity: 20, warmth: 4 },
        { id: 'p3', name: 'Deep Sleep', opacity: 70, warmth: 9 }
    ]
};

const App = () => {
  const [activeRoutine, setActiveRoutine] = useState<Routine | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isEyeComfortOpen, setIsEyeComfortOpen] = useState(false);

  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('visionary_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [customRoutines, setCustomRoutines] = useState<Routine[]>(() => {
    const saved = localStorage.getItem('visionary_custom_routines');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('visionary_settings');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...parsed };
  });

  const [blueLight, setBlueLight] = useState<BlueLightSettings>(() => {
      const saved = localStorage.getItem('visionary_bluelight');
      return saved ? JSON.parse(saved) : DEFAULT_BLUE_LIGHT;
  });

  const [blueLightLogs, setBlueLightLogs] = useState<BlueLightLog[]>(() => {
      const saved = localStorage.getItem('visionary_bluelight_logs');
      return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('visionary_custom_routines', JSON.stringify(customRoutines));
    localStorage.setItem('visionary_settings', JSON.stringify(settings));
    localStorage.setItem('visionary_logs', JSON.stringify(logs));
    localStorage.setItem('visionary_bluelight', JSON.stringify(blueLight));
    localStorage.setItem('visionary_bluelight_logs', JSON.stringify(blueLightLogs));
  }, [customRoutines, settings, logs, blueLight, blueLightLogs]);

  const startRoutine = (routine: Routine) => {
    setActiveRoutine(routine);
    setSessionCompleted(false);
  };

  const handleRoutineComplete = () => {
    setSessionCompleted(true);
    const today = new Date().toISOString().split('T')[0];
    const durationMins = Math.ceil(activeRoutine!.exercises.reduce((acc, ex) => acc + ex.durationSeconds, 0) / 60);

    setLogs(prev => {
        const existingLogIndex = prev.findIndex(l => l.date === today);
        if (existingLogIndex >= 0) {
            const updated = [...prev];
            updated[existingLogIndex] = {
                ...updated[existingLogIndex],
                exercisesCompleted: updated[existingLogIndex].exercisesCompleted + 1,
                minutesCompleted: updated[existingLogIndex].minutesCompleted + durationMins
            };
            return updated;
        } else {
            return [...prev, {
                date: today,
                timestamp: Date.now(),
                minutesCompleted: durationMins,
                exercisesCompleted: 1,
                visionClarity: 0,
                eyeStrain: 0,
                dryness: 0,
                sleepQuality: 0,
                headaches: false,
                screenTimeHours: 0,
                outdoorTimeMinutes: 0
            }];
        }
    });
  };

  const handleSaveCheckIn = (data: Omit<DailyLog, 'date' | 'timestamp' | 'minutesCompleted' | 'exercisesCompleted'>) => {
      const today = new Date().toISOString().split('T')[0];
      setLogs(prev => {
          const idx = prev.findIndex(l => l.date === today);
          if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = { ...updated[idx], ...data };
              return updated;
          } else {
              return [...prev, { date: today, timestamp: Date.now(), minutesCompleted: 0, exercisesCompleted: 0, ...data }];
          }
      });
      setIsCheckInOpen(false);
  };
  
  const todayLog = logs.find(l => l.date === new Date().toISOString().split('T')[0]);

  if (activeRoutine && !sessionCompleted) {
    return (
      <ExerciseSession 
        routine={activeRoutine} 
        onComplete={handleRoutineComplete}
        onExit={() => setActiveRoutine(null)}
        settings={settings}
      />
    );
  }

  return (
    <div className="min-h-screen text-text font-sans pb-safe-bottom relative overflow-x-hidden">
      <div className="glacier-bg"></div>
      <BlueLightOverlay enabled={blueLight.enabled} opacity={blueLight.opacity} warmth={blueLight.warmth} />

      {/* Main UI Layer */}
      <AnimatePresence>
        {isCreatingRoutine && (
          <CustomRoutineBuilder onSave={(r) => { setCustomRoutines([...customRoutines, r]); setIsCreatingRoutine(false); }} onCancel={() => setIsCreatingRoutine(false)} />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isSettingsOpen && <SettingsModal settings={settings} onSave={setSettings} onClose={() => setIsSettingsOpen(false)} />}
        {isCheckInOpen && <DailyCheckIn onSave={handleSaveCheckIn} onClose={() => setIsCheckInOpen(false)} existingData={todayLog} />}
        {isAnalyticsOpen && <AnalyticsDashboard logs={logs} onClose={() => setIsAnalyticsOpen(false)} />}
        {isEyeComfortOpen && <EyeComfortView settings={blueLight} onUpdate={setBlueLight} onClose={() => setIsEyeComfortOpen(false)} logs={blueLightLogs} onClearStats={() => setBlueLightLogs([])} />}
      </AnimatePresence>

      {/* Completion Dialog */}
      {sessionCompleted && activeRoutine && (
         <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-sm w-full glass-panel p-8 rounded-3xl shadow-2xl">
                <div className="w-20 h-20 bg-gradient-to-tr from-accent to-primary text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Well Done!</h2>
                <p className="text-slate-300 mb-8 text-sm">You finished <b>{activeRoutine.name}</b>. Your eyes thank you!</p>
                <div className="flex flex-col gap-3">
                    <button onClick={() => { setSessionCompleted(false); setActiveRoutine(null); }} className="w-full py-3.5 bg-white text-slate-900 font-bold rounded-2xl active:scale-95 transition-transform">Back to Home</button>
                    {!todayLog?.visionClarity && (
                        <button onClick={() => { setSessionCompleted(false); setActiveRoutine(null); setIsCheckInOpen(true); }} className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-2xl active:scale-95 transition-transform border border-slate-700">Daily Check-in</button>
                    )}
                </div>
            </motion.div>
         </div>
      )}

      {/* Dashboard Header */}
      <header className="px-6 pt-safe-top pb-4 flex justify-between items-center sticky top-0 z-30 bg-background/40 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-slate-900 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <h1 className="text-lg font-bold tracking-tight">Visionary</h1>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => setIsEyeComfortOpen(true)} className={`p-2 rounded-full transition-all ${blueLight.enabled ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800/60 text-slate-300'}`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M1 12h2"/><path d="M21 12h2"/></svg></button>
            <button onClick={() => setIsAnalyticsOpen(true)} className="p-2 bg-slate-800/60 text-slate-300 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></button>
            <button onClick={() => setIsSettingsOpen(true)} className="p-2 bg-slate-800/60 text-slate-300 rounded-full"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg></button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-6">
        {/* Daily Progress */}
        <section className="mb-10">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => setIsCheckInOpen(true)} className="glass-panel p-5 rounded-3xl flex items-center justify-between border-slate-700/50 cursor-pointer active:scale-[0.98] transition-all">
                <div>
                    <h2 className="text-base font-bold text-white mb-0.5">Eye Wellness Check</h2>
                    <p className="text-xs text-slate-400">Track symptoms to see improvements</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                </div>
            </motion.div>
        </section>

        {/* Hero */}
        <section className="mb-10">
            <h2 className="text-3xl font-extrabold mb-3 leading-tight">Reduce Digital<br/>Eye Strain</h2>
            <p className="text-slate-400 text-sm font-medium">Science-backed routines for computer users.</p>
        </section>

        {/* Routine Grid */}
        <section className="space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Daily Routines</h3>
            <div className="grid grid-cols-1 gap-4">
                <RoutineRow routine={DEFAULT_ROUTINE} color="blue" onClick={() => startRoutine(DEFAULT_ROUTINE)} />
                <RoutineRow routine={QUICK_BREAK_ROUTINE} color="teal" onClick={() => startRoutine(QUICK_BREAK_ROUTINE)} />
                {customRoutines.map(r => (
                    <RoutineRow key={r.id} routine={r} color="indigo" onClick={() => startRoutine(r)} onClear={(e) => { e.stopPropagation(); setCustomRoutines(customRoutines.filter(cr => cr.id !== r.id)); }} />
                ))}
                <button onClick={() => setIsCreatingRoutine(true)} className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-700 text-slate-500 font-bold flex items-center justify-center gap-2 hover:border-primary/50 hover:text-primary transition-all active:scale-[0.98]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                    Create Custom Routine
                </button>
            </div>
        </section>

        {/* Knowledge Base */}
        <section className="mt-12 space-y-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest px-1">Guidelines</h3>
            <div className="space-y-4">
                <FeatureRow title="20-20-20 Rule" desc="Look 20 feet away for 20 seconds every 20 mins." icon="👁️" />
                <FeatureRow title="Smart Hydration" desc="Blinking moisturizes the eye surface naturally." icon="💧" />
                <FeatureRow title="Active Focus" desc="Shift focus near and far to exercise muscles." icon="🎯" />
            </div>
        </section>
      </main>
    </div>
  );
};

const RoutineRow = ({ routine, onClick, color, onClear }: any) => {
    const duration = Math.ceil(routine.exercises.reduce((acc: any, ex: any) => acc + ex.durationSeconds, 0) / 60);
    return (
        <motion.div whileTap={{ scale: 0.98 }} onClick={onClick} className="glass-panel p-4 rounded-2xl flex items-center gap-4 cursor-pointer relative group border-slate-700/30">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${color === 'blue' ? 'bg-cyan-500/20 text-cyan-400' : color === 'teal' ? 'bg-teal-500/20 text-teal-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                {color === 'blue' ? '🧊' : color === 'teal' ? '⚡' : '✨'}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white text-base">{routine.name}</h4>
                <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {duration} MIN
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center gap-1">
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20"/></svg>
                        {routine.exercises.length} STEPS
                    </span>
                </div>
            </div>
            {onClear && (
                <button onClick={onClear} className="p-2 text-slate-600 hover:text-red-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            )}
        </motion.div>
    );
};

const FeatureRow = ({ title, desc, icon }: any) => (
    <div className="flex gap-4 p-2">
        <div className="text-2xl pt-1">{icon}</div>
        <div>
            <h4 className="font-bold text-white text-sm">{title}</h4>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
        </div>
    </div>
);

export default App;
