
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DailyLog } from '../types';

interface DailyCheckInProps {
  onSave: (log: Omit<DailyLog, 'date' | 'timestamp' | 'minutesCompleted' | 'exercisesCompleted'>) => void;
  onClose: () => void;
  existingData?: Partial<DailyLog>;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({ onSave, onClose, existingData }) => {
  const [formData, setFormData] = useState({
    visionClarity: existingData?.visionClarity || 5,
    eyeStrain: existingData?.eyeStrain || 5,
    dryness: existingData?.dryness || 5,
    sleepQuality: existingData?.sleepQuality || 7,
    headaches: existingData?.headaches || false,
    screenTimeHours: existingData?.screenTimeHours || 8,
    outdoorTimeMinutes: existingData?.outdoorTimeMinutes || 30,
    notes: existingData?.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const RangeInput = ({ label, value, onChange, minLabel, maxLabel, color = "primary" }: any) => (
    <div className="mb-8">
      <div className="flex justify-between mb-4">
        <label className="text-sm font-bold text-slate-300">{label}</label>
        <span className="font-black text-xl text-primary">{value}</span>
      </div>
      <input type="range" min="1" max="10" value={value} onChange={(e) => onChange(parseInt(e.target.value))} className={`w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary`} />
      <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mt-2">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed inset-0 z-[100] bg-slate-950 flex flex-col pt-safe-top pb-safe-bottom">
      <div className="px-6 py-6 flex justify-between items-center border-b border-slate-900">
        <h2 className="text-xl font-bold">Wellness Log</h2>
        <button onClick={onClose} className="p-2 text-slate-400"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
        <RangeInput label="Vision Clarity" value={formData.visionClarity} onChange={(v: number) => setFormData({...formData, visionClarity: v})} minLabel="Blurry" maxLabel="Sharp" />
        <RangeInput label="Eye Strain" value={formData.eyeStrain} onChange={(v: number) => setFormData({...formData, eyeStrain: v})} minLabel="Comfortable" maxLabel="Strained" />
        <RangeInput label="Dryness" value={formData.dryness} onChange={(v: number) => setFormData({...formData, dryness: v})} minLabel="Moist" maxLabel="Gritty" />

        <div className="flex items-center justify-between p-4 bg-slate-900/40 rounded-3xl border border-slate-800/50">
            <span className="font-bold text-sm">Headaches today?</span>
            <div className="flex gap-2">
                {['No', 'Yes'].map((opt, i) => (
                    <button key={opt} type="button" onClick={() => setFormData({...formData, headaches: i === 1})} className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all ${formData.headaches === (i === 1) ? 'bg-primary text-slate-900' : 'bg-slate-800 text-slate-500'}`}>{opt}</button>
                ))}
            </div>
        </div>

        <div className="space-y-4 pt-4">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Environment</h3>
             <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-900/40 p-4 rounded-3xl border border-slate-800/50 text-center">
                    <p className="text-[10px] font-bold text-slate-500 mb-2">SCREEN TIME</p>
                    <input type="number" value={formData.screenTimeHours} onChange={(e) => setFormData({...formData, screenTimeHours: parseFloat(e.target.value)})} className="bg-transparent text-center text-xl font-black w-full text-white" />
                    <p className="text-[10px] text-slate-500 mt-1">HOURS</p>
                 </div>
                 <div className="bg-slate-900/40 p-4 rounded-3xl border border-slate-800/50 text-center">
                    <p className="text-[10px] font-bold text-slate-500 mb-2">OUTDOORS</p>
                    <input type="number" value={formData.outdoorTimeMinutes} onChange={(e) => setFormData({...formData, outdoorTimeMinutes: parseInt(e.target.value)})} className="bg-transparent text-center text-xl font-black w-full text-white" />
                    <p className="text-[10px] text-slate-500 mt-1">MINUTES</p>
                 </div>
             </div>
        </div>
      </form>

      <div className="p-6">
        <button type="submit" className="w-full py-4 bg-primary text-slate-900 font-bold rounded-2xl active:scale-[0.98] transition-transform shadow-lg">Save Wellness Log</button>
      </div>
    </motion.div>
  );
};
