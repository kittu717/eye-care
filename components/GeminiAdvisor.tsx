
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { DailyLog } from '../types';

interface GeminiAdvisorProps {
  logs: DailyLog[];
  onClose: () => void;
}

export const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ logs, onClose }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAIInsight = async () => {
    if (logs.length === 0) {
      setError("Please complete at least one daily check-in for the AI to analyze your trends.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Prepare data for the prompt
      const dataSummary = logs.slice(-14).map(l => ({
        date: l.date,
        strain: l.eyeStrain,
        clarity: l.visionClarity,
        screenTime: l.screenTimeHours,
        exercises: l.exercisesCompleted,
        outdoor: l.outdoorTimeMinutes
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze my eye health logs for the last two weeks: ${JSON.stringify(dataSummary)}. 
        Provide a concise (under 150 words), encouraging, and personalized insight. 
        Identify patterns between screen time and strain, and suggest specific focus areas for my eye exercises. 
        Use a friendly tone but maintain professional wellness standards.`,
        config: {
          systemInstruction: "You are a world-class eye wellness consultant. Your goal is to help users reduce digital eye strain. Focus on actionable insights. Always include a short disclaimer that this is not medical advice.",
          temperature: 0.7,
        },
      });

      setInsight(response.text || "No insights available at this moment.");
    } catch (err) {
      console.error("Gemini Error:", err);
      setError("Failed to connect to the advisor. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-2xl flex flex-col pt-safe-top pb-safe-bottom"
    >
      <div className="px-6 py-6 flex justify-between items-center border-b border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 12L2.1 10.1"/><path d="m12 12 4.36-9.22"/><path d="m12 12 7.92 6.1"/><path d="m12 12-7.92 6.1"/><path d="m12 12-1.13 9.71"/><path d="m12 12 1.13 9.71"/><path d="m12 12 4.36-9.22"/></svg>
          </div>
          <h2 className="text-xl font-bold">AI Health Advisor</h2>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
        {!insight && !loading && !error && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-xs">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800">
              <span className="text-4xl">🧠</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Ready to Analyze?</h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed">
              I'll scan your daily logs and activity trends to find ways to improve your eye comfort.
            </p>
            <button 
              onClick={getAIInsight}
              className="w-full py-4 bg-primary text-slate-900 font-bold rounded-2xl shadow-xl active:scale-95 transition-transform"
            >
              Generate AI Insight
            </button>
          </motion.div>
        )}

        {loading && (
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">✨</div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Scanning Patterns...</h3>
              <p className="text-sm text-slate-500">Correlating screen time with eye strain</p>
            </div>
          </div>
        )}

        {error && (
          <div className="max-w-xs">
            <div className="text-4xl mb-4">⚠️</div>
            <p className="text-red-400 text-sm font-medium mb-6">{error}</p>
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold"
            >
              Go Back
            </button>
          </div>
        )}

        <AnimatePresence>
          {insight && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="w-full max-w-lg text-left bg-slate-900/40 p-8 rounded-3xl border border-slate-800 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
              </div>
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">Your Personalized Insight</h3>
              <div className="text-slate-200 leading-relaxed text-base space-y-4">
                {insight.split('\n').map((para, i) => para ? <p key={i}>{para}</p> : <br key={i} />)}
              </div>
              <div className="mt-10 pt-6 border-t border-slate-800/50 flex flex-col gap-4">
                 <button 
                  onClick={onClose}
                  className="w-full py-3.5 bg-slate-800 text-white font-bold rounded-2xl active:scale-95 transition-transform"
                >
                  Got it, Thanks!
                </button>
                <button 
                  onClick={() => setInsight(null)}
                  className="text-xs text-slate-500 font-bold uppercase tracking-wider hover:text-slate-300 transition-colors"
                >
                  Regenerate Analysis
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
