
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlueLightSettings, BlueLightProfile, BlueLightLog } from '../types';

interface EyeComfortViewProps {
  settings: BlueLightSettings;
  onUpdate: (settings: BlueLightSettings) => void;
  onClose: () => void;
  logs: BlueLightLog[];
  onClearStats: () => void;
}

export const EyeComfortView: React.FC<EyeComfortViewProps> = ({ settings, onUpdate, onClose, logs, onClearStats }) => {
  const [activeTab, setActiveTab] = useState<'controls' | 'schedule' | 'profiles' | 'stats'>('controls');
  
  // Local state for profile creation
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');

  // Calculate Stats
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(l => l.date === today);
  const todayMinutes = todayLog?.minutesActive || 0;
  const todayHours = (todayMinutes / 60).toFixed(1);

  // Weekly Stats
  const getLast7DaysStats = () => {
    const stats = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const log = logs.find(l => l.date === dateStr);
        stats.push({ day: d.toLocaleDateString('en-US', { weekday: 'narrow' }), mins: log?.minutesActive || 0 });
    }
    return stats;
  };
  const weeklyStats = getLast7DaysStats();
  const totalWeeklyMinutes = weeklyStats.reduce((acc, curr) => acc + curr.mins, 0);

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    const newProfile: BlueLightProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: newProfileName,
        opacity: settings.opacity,
        warmth: settings.warmth
    };
    onUpdate({
        ...settings,
        profiles: [...settings.profiles, newProfile]
    });
    setNewProfileName('');
    setIsCreatingProfile(false);
  };

  const applyProfile = (profile: BlueLightProfile) => {
    onUpdate({
        ...settings,
        opacity: profile.opacity,
        warmth: profile.warmth,
        enabled: true
    });
  };

  const deleteProfile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({
        ...settings,
        profiles: settings.profiles.filter(p => p.id !== id)
    });
  };

  const getWarmthColor = (level: number) => {
    const r = 255;
    const g = 220 - ((level - 1) * 8);
    const b = Math.max(0, 150 - ((level - 1) * 10));
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div className="fixed inset-0 z-40 bg-background overflow-y-auto">
       <div className="max-w-3xl mx-auto p-6 min-h-screen pb-20">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-8 sticky top-0 bg-background/95 backdrop-blur py-4 z-10 border-b border-white/5">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-amber-500/20 text-amber-500 rounded-lg flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2"/><path d="M12 21v2"/><path d="M4.22 4.22l1.42 1.42"/><path d="M18.36 18.36l1.42 1.42"/><path d="M1 12h2"/><path d="M21 12h2"/><path d="M4.22 19.78l1.42-1.42"/><path d="M18.36 5.64l1.42-1.42"/></svg>
                 </div>
                 <div>
                    <h2 className="text-xl font-bold text-white">EyeComfort</h2>
                    <p className="text-xs text-slate-400">Blue Light Filter [Offline]</p>
                 </div>
             </div>
             <button onClick={onClose} className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700">Close</button>
          </div>

          {/* Main Toggle (Always Visible) */}
          <div className="bg-surface border border-slate-700 rounded-2xl p-6 mb-8 flex items-center justify-between shadow-lg">
             <div>
                 <h3 className="text-lg font-bold text-white">Master Switch</h3>
                 <p className="text-sm text-slate-400">{settings.enabled ? 'Filter is currently active' : 'Filter is disabled'}</p>
             </div>
             <button 
                 onClick={() => onUpdate({ ...settings, enabled: !settings.enabled })}
                 className={`w-16 h-8 rounded-full transition-colors relative ${settings.enabled ? 'bg-amber-500' : 'bg-slate-600'}`}
             >
                 <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${settings.enabled ? 'left-9' : 'left-1'}`} />
             </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto gap-2 mb-6 pb-2">
            {[
                { id: 'controls', label: 'Controls', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg> },
                { id: 'schedule', label: 'Schedule', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
                { id: 'profiles', label: 'Profiles', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
                { id: 'stats', label: 'Stats', icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${activeTab === tab.id ? 'bg-slate-800 text-white border border-slate-600' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                    {tab.icon} {tab.label}
                </button>
            ))}
          </div>

          <div className="bg-surface/50 border border-slate-700/50 rounded-2xl p-6 min-h-[400px]">
             
             {/* --- CONTROLS TAB --- */}
             {activeTab === 'controls' && (
                <div className="space-y-8">
                    {/* Live Preview */}
                    <div className="relative h-32 rounded-xl overflow-hidden border border-slate-700 flex items-center justify-center bg-background">
                         <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-50" />
                         <div className="relative z-10 text-center">
                             <h4 className="text-xl font-bold text-white drop-shadow-md">Preview Text</h4>
                             <p className="text-white/80 drop-shadow-md">This is how your screen looks.</p>
                         </div>
                         {/* Mini Overlay for Preview */}
                         <div 
                            className="absolute inset-0 z-20 mix-blend-multiply pointer-events-none transition-all duration-300"
                            style={{ 
                                backgroundColor: getWarmthColor(settings.warmth),
                                opacity: settings.opacity / 100 
                            }} 
                         />
                    </div>

                    {/* Opacity Control */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300">Intensity (Opacity)</label>
                            <span className="text-sm font-mono text-amber-400">{settings.opacity}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="80" 
                            value={settings.opacity}
                            onChange={(e) => onUpdate({ ...settings, opacity: parseInt(e.target.value) })}
                            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                    </div>

                    {/* Warmth Control */}
                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-medium text-slate-300">Warmth (Color Temperature)</label>
                            <span className="text-sm font-mono text-amber-400">{settings.warmth}/10</span>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="10" 
                            value={settings.warmth}
                            onChange={(e) => onUpdate({ ...settings, warmth: parseInt(e.target.value) })}
                            className="w-full h-3 bg-gradient-to-r from-yellow-200 via-orange-300 to-red-400 rounded-lg appearance-none cursor-pointer accent-white"
                        />
                        <div className="flex justify-between text-xs text-slate-500 mt-2">
                            <span>Cool (Daylight)</span>
                            <span>Warm (Candlelight)</span>
                        </div>
                    </div>
                </div>
             )}

             {/* --- SCHEDULE TAB --- */}
             {activeTab === 'schedule' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                         <h3 className="text-lg font-bold text-white">Time-Based Schedule</h3>
                         <div className="flex items-center gap-2">
                             <span className="text-sm text-slate-400">{settings.schedule.enabled ? 'On' : 'Off'}</span>
                             <button 
                                onClick={() => onUpdate({ ...settings, schedule: { ...settings.schedule, enabled: !settings.schedule.enabled } })}
                                className={`w-10 h-6 rounded-full transition-colors relative ${settings.schedule.enabled ? 'bg-amber-500' : 'bg-slate-600'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.schedule.enabled ? 'left-5' : 'left-1'}`} />
                            </button>
                         </div>
                    </div>
                    
                    <div className={`space-y-6 transition-opacity ${settings.schedule.enabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">Start Time</label>
                                <input 
                                    type="time" 
                                    value={settings.schedule.startTime}
                                    onChange={(e) => onUpdate({ ...settings, schedule: { ...settings.schedule, startTime: e.target.value } })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1">End Time</label>
                                <input 
                                    type="time" 
                                    value={settings.schedule.endTime}
                                    onChange={(e) => onUpdate({ ...settings, schedule: { ...settings.schedule, endTime: e.target.value } })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Active Days</label>
                            <div className="flex justify-between">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                                    <button
                                        key={day}
                                        onClick={() => {
                                            const days = settings.schedule.days.includes(index)
                                                ? settings.schedule.days.filter(d => d !== index)
                                                : [...settings.schedule.days, index];
                                            onUpdate({ ...settings, schedule: { ...settings.schedule, days } });
                                        }}
                                        className={`w-9 h-9 rounded-full text-xs font-bold transition-colors ${settings.schedule.days.includes(index) ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                    >
                                        {day[0]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                           ℹ️ The filter will automatically turn ON at the start time and OFF at the end time on selected days.
                        </p>
                    </div>
                </div>
             )}

             {/* --- PROFILES TAB --- */}
             {activeTab === 'profiles' && (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {settings.profiles.map(profile => (
                            <div key={profile.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col justify-between group">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-white">{profile.name}</h4>
                                    <button onClick={(e) => deleteProfile(profile.id, e)} className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                    </button>
                                </div>
                                <div className="text-xs text-slate-400 mb-4">
                                    Opacity: {profile.opacity}% • Warmth: {profile.warmth}
                                </div>
                                <button 
                                    onClick={() => applyProfile(profile)}
                                    className="w-full py-2 bg-slate-700 hover:bg-amber-500 hover:text-slate-900 text-slate-200 text-sm font-medium rounded-lg transition-colors"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>

                    {isCreatingProfile ? (
                        <div className="bg-slate-800/50 border border-dashed border-slate-600 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2">
                             <label className="block text-xs font-bold text-slate-400 uppercase mb-2">New Profile Name</label>
                             <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={newProfileName}
                                    onChange={(e) => setNewProfileName(e.target.value)}
                                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-amber-500"
                                    placeholder="e.g., Reading Mode"
                                />
                                <button onClick={() => setIsCreatingProfile(false)} className="px-3 py-2 text-slate-400 hover:text-white">Cancel</button>
                                <button onClick={handleCreateProfile} className="px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg">Save</button>
                             </div>
                             <p className="text-xs text-slate-500 mt-2">Saves current opacity and warmth settings.</p>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsCreatingProfile(true)}
                            className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl text-slate-400 hover:border-amber-500 hover:text-amber-500 transition-colors flex items-center justify-center gap-2 font-medium"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            Save Current as Profile
                        </button>
                    )}
                </div>
             )}

             {/* --- STATS TAB --- */}
             {activeTab === 'stats' && (
                 <div className="space-y-6">
                     <div className="grid grid-cols-2 gap-4">
                         <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                             <div className="text-slate-400 text-xs font-bold uppercase mb-1">Today's Usage</div>
                             <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                                 {todayHours} <span className="text-sm font-normal text-slate-500">hours</span>
                             </div>
                         </div>
                         <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                             <div className="text-slate-400 text-xs font-bold uppercase mb-1">Weekly Total</div>
                             <div className="text-2xl font-bold text-white flex items-baseline gap-1">
                                 {(totalWeeklyMinutes / 60).toFixed(1)} <span className="text-sm font-normal text-slate-500">hours</span>
                             </div>
                         </div>
                     </div>

                     <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                         <h4 className="text-sm font-bold text-slate-300 mb-6">Last 7 Days Activity</h4>
                         <div className="flex items-end justify-between h-32 gap-2">
                             {weeklyStats.map((stat, i) => (
                                 <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                     <div 
                                         className="w-full bg-amber-500/30 rounded-t-sm transition-all group-hover:bg-amber-500 relative"
                                         style={{ height: `${Math.min((stat.mins / 480) * 100, 100)}%` }} // Max bar height = 8 hours
                                     >
                                         <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700">
                                             {(stat.mins / 60).toFixed(1)}h
                                         </div>
                                     </div>
                                     <span className="text-xs text-slate-500">{stat.day}</span>
                                 </div>
                             ))}
                         </div>
                     </div>
                     
                     <div className="flex justify-between items-center bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                         <span className="text-sm text-slate-400">Reset all usage history?</span>
                         <button onClick={onClearStats} className="text-xs text-red-400 hover:text-red-300 underline">Clear Stats</button>
                     </div>
                 </div>
             )}

          </div>
       </div>
    </div>
  );
};
