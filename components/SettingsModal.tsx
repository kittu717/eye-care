
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserSettings } from '../types';

interface SettingsModalProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSave, onClose }) => {
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'reminders'>('general');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex flex-col pt-safe-top pb-safe-bottom">
      {/* Header */}
      <div className="px-6 py-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Preferences</h2>
        <button onClick={onClose} className="p-2 text-slate-400"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
      </div>

      {/* Tabs */}
      <div className="flex px-6 gap-4 border-b border-slate-800">
        <button onClick={() => setActiveTab('general')} className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}>Visuals</button>
        <button onClick={() => setActiveTab('reminders')} className={`pb-4 text-sm font-bold transition-all border-b-2 ${activeTab === 'reminders' ? 'border-primary text-primary' : 'border-transparent text-slate-500'}`}>Reminders</button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {activeTab === 'general' ? (
          <div className="space-y-8">
            <ToggleControl label="Sound Effects" desc="Feedback during exercises" active={localSettings.soundEnabled} onToggle={() => setLocalSettings(s => ({ ...s, soundEnabled: !s.soundEnabled }))} />
            <ToggleControl label="Voice Guidance" desc="Step-by-step narration" active={localSettings.voiceGuidanceEnabled} onToggle={() => setLocalSettings(s => ({ ...s, voiceGuidanceEnabled: !s.voiceGuidanceEnabled }))} />
            
            <div className="space-y-4">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Guide Speed</h3>
               <div className="grid grid-cols-3 gap-2">
                 {['slow', 'normal', 'fast'].map(v => (
                   <button key={v} onClick={() => setLocalSettings(s => ({ ...s, animationSpeed: v as any }))} className={`py-3 rounded-2xl text-sm font-bold border transition-all capitalize ${localSettings.animationSpeed === v ? 'bg-primary text-slate-900 border-primary' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>{v}</button>
                 ))}
               </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 text-center py-12">
            <div className="w-16 h-16 bg-slate-900 rounded-3xl mx-auto flex items-center justify-center text-3xl mb-4">🔔</div>
            <h3 className="text-lg font-bold">Smart Reminders</h3>
            <p className="text-sm text-slate-400">Regular breaks prevent eye fatigue. Enable notifications in your browser settings to use this feature.</p>
            <button onClick={() => setLocalSettings(s => ({ ...s, reminders: { ...s.reminders, enabled: !s.reminders.enabled } }))} className={`px-8 py-3 rounded-2xl font-bold transition-all ${localSettings.reminders.enabled ? 'bg-green-500 text-slate-900' : 'bg-slate-800 text-white'}`}>{localSettings.reminders.enabled ? 'Enabled' : 'Enable Reminders'}</button>
          </div>
        )}
      </div>

      <div className="p-6">
        <button onClick={() => { onSave(localSettings); onClose(); }} className="w-full py-4 bg-primary text-slate-900 font-bold rounded-2xl active:scale-[0.98] transition-transform shadow-lg">Save Preferences</button>
      </div>
    </motion.div>
  );
};

const ToggleControl = ({ label, desc, active, onToggle }: any) => (
    <div className="flex items-center justify-between">
        <div>
            <h4 className="font-bold text-white text-base">{label}</h4>
            <p className="text-xs text-slate-500">{desc}</p>
        </div>
        <button onClick={onToggle} className={`w-12 h-6 rounded-full relative transition-colors ${active ? 'bg-primary' : 'bg-slate-800'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${active ? 'left-7' : 'left-1'}`} />
        </button>
    </div>
);
