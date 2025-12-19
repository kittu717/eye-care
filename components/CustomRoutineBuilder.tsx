import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Routine, Exercise } from '../types';
import { EXERCISE_TEMPLATES } from '../constants';

interface CustomRoutineBuilderProps {
  onSave: (routine: Routine) => void;
  onCancel: () => void;
}

export const CustomRoutineBuilder: React.FC<CustomRoutineBuilderProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState('My Custom Routine');
  const [exercises, setExercises] = useState<Exercise[]>([]);

  const addExercise = (template: Omit<Exercise, 'id'>) => {
    const newExercise = {
      ...template,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExercises([...exercises, newExercise]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateDuration = (index: number, seconds: number) => {
    const updated = [...exercises];
    updated[index].durationSeconds = seconds;
    setExercises(updated);
  };

  const moveExercise = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === exercises.length - 1) return;
    
    const updated = [...exercises];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    [updated[index], updated[swapIndex]] = [updated[swapIndex], updated[index]];
    setExercises(updated);
  };

  const handleSave = () => {
    if (exercises.length === 0) return;
    const newRoutine: Routine = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      description: 'Custom user routine',
      exercises,
      isCustom: true
    };
    onSave(newRoutine);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col md:flex-row">
      {/* Sidebar: Available Exercises */}
      <div className="w-full md:w-80 bg-surface border-r border-slate-700 p-6 overflow-y-auto">
        <h3 className="text-lg font-bold text-slate-200 mb-4">Add Exercises</h3>
        <div className="space-y-3">
          {EXERCISE_TEMPLATES.map((ex, i) => (
            <button
              key={i}
              onClick={() => addExercise(ex)}
              className="w-full text-left p-4 rounded-lg bg-slate-800 border border-slate-700 hover:border-primary hover:bg-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                 <span className="font-medium text-slate-200">{ex.name}</span>
                 <svg className="w-4 h-4 text-slate-500 group-hover:text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
              <p className="text-xs text-slate-400 line-clamp-2">{ex.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Area: Builder */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-surface/50 backdrop-blur flex justify-between items-center">
            <div>
                <label className="block text-xs text-slate-500 uppercase font-bold mb-1">Routine Name</label>
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-transparent text-2xl font-bold text-white focus:outline-none focus:border-b focus:border-primary placeholder-slate-600 w-full md:w-96"
                    placeholder="Enter routine name..."
                />
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={onCancel}
                    className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleSave}
                    disabled={exercises.length === 0}
                    className="px-6 py-2 bg-primary hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-900 font-bold rounded-lg transition-colors"
                >
                    Save Routine
                </button>
            </div>
        </div>

        {/* Routine Steps List */}
        <div className="flex-1 p-6 overflow-y-auto bg-background">
            {exercises.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                    <svg className="w-16 h-16 mb-4 opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                    <p className="text-lg">Select exercises from the left to build your routine</p>
                </div>
            ) : (
                <div className="space-y-4 max-w-3xl mx-auto">
                    {exercises.map((ex, index) => (
                        <motion.div 
                            key={ex.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-surface border border-slate-700 rounded-xl p-4 flex items-center gap-4 group"
                        >
                            <div className="flex flex-col gap-1 text-slate-500">
                                <button onClick={() => moveExercise(index, 'up')} disabled={index === 0} className="hover:text-primary disabled:opacity-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                                </button>
                                <button onClick={() => moveExercise(index, 'down')} disabled={index === exercises.length - 1} className="hover:text-primary disabled:opacity-30">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                                </button>
                            </div>
                            
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-200">{ex.name}</h4>
                                <p className="text-xs text-slate-500">{ex.description}</p>
                            </div>

                            <div className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                                <span className="text-xs text-slate-500 font-mono uppercase">Duration</span>
                                <input 
                                    type="number" 
                                    min="5" 
                                    max="300" 
                                    value={ex.durationSeconds}
                                    onChange={(e) => updateDuration(index, parseInt(e.target.value) || 30)}
                                    className="bg-transparent w-12 text-right font-mono text-primary focus:outline-none"
                                />
                                <span className="text-xs text-slate-500">sec</span>
                            </div>

                            <button 
                                onClick={() => removeExercise(index)}
                                className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                        </motion.div>
                    ))}
                    
                    <div className="flex justify-end pt-4 border-t border-slate-800 text-slate-400 text-sm font-mono">
                        Total Duration: {Math.ceil(exercises.reduce((acc, ex) => acc + ex.durationSeconds, 0) / 60)} min
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
