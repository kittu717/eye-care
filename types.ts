
export enum ExerciseType {
  MOVING_DOT = 'MOVING_DOT',
  TEXT_INSTRUCTION = 'TEXT_INSTRUCTION',
  PALMING = 'PALMING',
  FOCUS_SHIFT = 'FOCUS_SHIFT',
  BLINKING = 'BLINKING'
}

export enum MovementPattern {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
  FIGURE_EIGHT = 'FIGURE_EIGHT',
  CIRCULAR = 'CIRCULAR',
  RANDOM = 'RANDOM',
  NONE = 'NONE'
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  durationSeconds: number;
  type: ExerciseType;
  pattern?: MovementPattern;
  instructionText?: string;
  color?: string;
  
  // Rich Data
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits?: string[];
  steps?: string[];
  bestTime?: string;
  scientificEvidence?: string;
  conditions?: {
    helps: string[];
    caution: string[];
  };
}

export interface Routine {
  id: string;
  name: string;
  description: string;
  exercises: Exercise[];
  isCustom?: boolean;
}

export interface ReminderSettings {
  enabled: boolean;
  intervalMinutes: number;
  startTime: string; // Format "HH:mm"
  endTime: string;   // Format "HH:mm"
  message: string;
  soundEnabled: boolean;
  lastNotified: number; // Timestamp
}

export interface UserSettings {
  soundEnabled: boolean; // Sound effects (beeps)
  voiceGuidanceEnabled: boolean; // Text-to-speech instructions
  preferredColor: string | null; // null means use exercise default
  usePreferredColor: boolean;
  animationSpeed: 'slow' | 'normal' | 'fast';
  dotSize: 'small' | 'medium' | 'large';
  reminders: ReminderSettings;
}

export interface UserProfile {
  name?: string;
  onboardingComplete: boolean;
  dailyGoalMinutes: number;
  conditions: string[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  timestamp: number;
  
  // Activity
  minutesCompleted: number;
  exercisesCompleted: number;
  
  // Health Metrics (1-10 scales)
  visionClarity: number;
  eyeStrain: number;
  dryness: number;
  sleepQuality: number;
  
  // Lifestyle
  headaches: boolean;
  screenTimeHours: number;
  outdoorTimeMinutes: number;
  
  notes?: string;
}

// --- Blue Light Filter Types ---

export interface BlueLightProfile {
  id: string;
  name: string;
  opacity: number; // 0-80
  warmth: number; // 1-10
}

export interface BlueLightSchedule {
  enabled: boolean;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  days: number[]; // 0-6 (Sun-Sat)
}

export interface BlueLightSettings {
  enabled: boolean;
  opacity: number; // 0-80
  warmth: number; // 1-10
  schedule: BlueLightSchedule;
  profiles: BlueLightProfile[];
}

export interface BlueLightLog {
    date: string; // YYYY-MM-DD
    minutesActive: number;
}