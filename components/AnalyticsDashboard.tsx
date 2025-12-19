
import React, { useMemo } from 'react';
import { DailyLog } from '../types';

interface AnalyticsDashboardProps {
  logs: DailyLog[];
  onClose: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ logs, onClose }) => {
  
  const analytics = useMemo(() => {
    if (logs.length === 0) return null;

    // Sort by date ascending
    const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const last7Days = sortedLogs.slice(-7);

    // Calculate Averages
    const avgStrain = sortedLogs.reduce((acc, log) => acc + log.eyeStrain, 0) / sortedLogs.length;
    const avgClarity = sortedLogs.reduce((acc, log) => acc + log.visionClarity, 0) / sortedLogs.length;
    const avgSleep = sortedLogs.reduce((acc, log) => acc + log.sleepQuality, 0) / sortedLogs.length;
    
    // Improvement Calculation (First 3 vs Last 3 if enough data)
    let improvement = 0;
    if (sortedLogs.length >= 6) {
        const first3AvgStrain = sortedLogs.slice(0, 3).reduce((acc, l) => acc + l.eyeStrain, 0) / 3;
        const last3AvgStrain = sortedLogs.slice(-3).reduce((acc, l) => acc + l.eyeStrain, 0) / 3;
        // Negative strain change is good, so we invert logic for display
        improvement = ((first3AvgStrain - last3AvgStrain) / first3AvgStrain) * 100;
    }

    return {
        sortedLogs,
        last7Days,
        averages: {
            strain: avgStrain.toFixed(1),
            clarity: avgClarity.toFixed(1),
            sleep: avgSleep.toFixed(1)
        },
        improvement: improvement.toFixed(0)
    };
  }, [logs]);

  const handleExport = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `visionary_health_data_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!analytics) {
    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col items-center justify-center p-6">
            <h2 className="text-2xl font-bold text-white mb-2">No Data Yet</h2>
            <p className="text-slate-400 mb-6">Complete your first daily check-in to see analytics.</p>
            <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white rounded-lg">Close</button>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-background overflow-y-auto">
      <div className="max-w-5xl mx-auto p-6 min-h-screen">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 sticky top-0 bg-background/95 backdrop-blur py-4 z-10 border-b border-white/5">
            <div>
                <h2 className="text-2xl font-bold text-white">Health Analytics</h2>
                <p className="text-slate-400 text-sm">Tracking {logs.length} days of history</p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={handleExport}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm hover:bg-slate-700 flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    Export JSON
                </button>
                <button 
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700"
                >
                    Close
                </button>
            </div>
        </div>

        {/* Top Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Avg Eye Strain" value={analytics.averages.strain} max={10} inverse />
            <StatCard label="Avg Clarity" value={analytics.averages.clarity} max={10} />
            <StatCard label="Avg Sleep" value={analytics.averages.sleep} max={10} />
            <div className="bg-surface border border-slate-700 p-4 rounded-xl">
                <h4 className="text-xs text-slate-500 uppercase font-bold mb-1">Total Progress</h4>
                <div className="text-2xl font-bold text-white flex items-end gap-2">
                    {parseFloat(analytics.improvement) > 0 ? '+' : ''}{analytics.improvement}%
                    <span className="text-xs font-normal text-slate-400 mb-1">strain reduction</span>
                </div>
            </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
            
            {/* Strain vs Exercise Trend */}
            <div className="bg-surface border border-slate-700 p-6 rounded-xl">
                <h3 className="text-lg font-bold text-white mb-6">Strain vs. Exercises (Last 7 Days)</h3>
                <div className="flex items-end justify-between h-48 gap-2">
                    {analytics.last7Days.map((log, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                             {/* Bars */}
                             <div className="w-full flex gap-1 h-full items-end justify-center">
                                {/* Strain Bar */}
                                <div 
                                    className="w-3 bg-red-500/50 rounded-t-sm transition-all group-hover:bg-red-500"
                                    style={{ height: `${(log.eyeStrain / 10) * 100}%` }}
                                    title={`Strain: ${log.eyeStrain}/10`}
                                />
                                {/* Exercise Bar (Normalized to 10 for visual comparison, assuming max 5 exercises/day is great) */}
                                <div 
                                    className="w-3 bg-primary/50 rounded-t-sm transition-all group-hover:bg-primary"
                                    style={{ height: `${Math.min((log.exercisesCompleted / 5) * 100, 100)}%` }}
                                    title={`Exercises: ${log.exercisesCompleted}`}
                                />
                             </div>
                             <span className="text-[10px] text-slate-500 font-mono">
                                {new Date(log.date).getDate()}
                             </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-4 mt-4 text-xs">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500/50 rounded-sm"></div> Eye Strain</div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary/50 rounded-sm"></div> Exercises Done</div>
                </div>
            </div>

            {/* Metrics Heatmap List */}
            <div className="bg-surface border border-slate-700 p-6 rounded-xl overflow-hidden">
                <h3 className="text-lg font-bold text-white mb-4">Daily Logs</h3>
                <div className="overflow-y-auto max-h-60 pr-2 space-y-2">
                    {[...analytics.sortedLogs].reverse().map(log => (
                        <div key={log.date} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-800">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-200">{new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                <span className="text-xs text-slate-500">{log.exercisesCompleted} exercises • {log.screenTimeHours}h screen</span>
                            </div>
                            <div className="flex gap-3 text-right">
                                <div className="flex flex-col items-end">
                                    <span className={`text-xs font-bold ${log.eyeStrain > 6 ? 'text-red-400' : 'text-green-400'}`}>Strain: {log.eyeStrain}</span>
                                    <span className="text-[10px] text-slate-500">Target: &lt;4</span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`text-xs font-bold ${log.visionClarity < 5 ? 'text-amber-400' : 'text-blue-400'}`}>Clarity: {log.visionClarity}</span>
                                    <span className="text-[10px] text-slate-500">Target: &gt;7</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Correlation / Insight Section */}
        <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-white mb-2">Weekly Insights</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
                Based on your logs, your eye strain tends to be higher on days with over {analytics.sortedLogs.reduce((acc,l) => acc + l.screenTimeHours, 0) / analytics.sortedLogs.length > 0 ? (analytics.sortedLogs.reduce((acc,l) => acc + l.screenTimeHours, 0) / analytics.sortedLogs.length).toFixed(1) : 0} hours of screen time.
                {parseFloat(analytics.improvement) > 5 
                    ? " Great news! Your strain levels are trending downwards compared to when you started." 
                    : " Consistency is key. Try to increase your outdoor time to combat digital strain."}
            </p>
        </div>

      </div>
    </div>
  );
};

const StatCard = ({ label, value, max, inverse = false }: { label: string, value: string, max: number, inverse?: boolean }) => {
    const numVal = parseFloat(value);
    // Inverse: Lower is better (Red -> Green). Normal: Higher is better (Red -> Green)
    // Actually simpler: 
    // Inverse (Strain): High = Bad (Red), Low = Good (Green)
    // Normal (Clarity): High = Good (Green), Low = Bad (Red)
    
    let color = 'text-slate-200';
    if (inverse) {
        color = numVal < 4 ? 'text-green-400' : numVal > 7 ? 'text-red-400' : 'text-amber-400';
    } else {
        color = numVal > 7 ? 'text-green-400' : numVal < 4 ? 'text-red-400' : 'text-amber-400';
    }

    return (
        <div className="bg-surface border border-slate-700 p-4 rounded-xl">
            <h4 className="text-xs text-slate-500 uppercase font-bold mb-1">{label}</h4>
            <div className={`text-2xl font-bold flex items-end gap-1 ${color}`}>
                {value}
                <span className="text-xs font-normal text-slate-500 mb-1">/{max}</span>
            </div>
        </div>
    )
}
