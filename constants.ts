import { Exercise, ExerciseType, MovementPattern, Routine } from './types';

export const DEFAULT_EXERCISES: Exercise[] = [
  {
    id: 'horizontal-scan',
    name: 'Horizontal Scan',
    description: 'Follow the dot with your eyes without moving your head.',
    durationSeconds: 30,
    type: ExerciseType.MOVING_DOT,
    pattern: MovementPattern.HORIZONTAL,
    color: '#38bdf8',
    difficulty: 'Beginner',
    bestTime: 'Anytime',
    benefits: ['Improve eye coordination', 'Stretch horizontal eye muscles'],
    steps: ['Keep your head still', 'Focus on the moving dot', 'Follow it smoothly from left to right']
  },
  {
    id: 'vertical-scan',
    name: 'Vertical Scan',
    description: 'Look up and down following the guide.',
    durationSeconds: 30,
    type: ExerciseType.MOVING_DOT,
    pattern: MovementPattern.VERTICAL,
    color: '#2dd4bf',
    difficulty: 'Beginner',
    bestTime: 'Anytime',
    benefits: ['Enhance vertical tracking', 'Reduce eyelid tension'],
    steps: ['Keep your chin level', 'Look up as the dot rises', 'Look down as it falls']
  },
  {
    id: 'figure-eight',
    name: 'Infinity Loop',
    description: 'Trace the figure-eight pattern smoothly.',
    durationSeconds: 45,
    type: ExerciseType.MOVING_DOT,
    pattern: MovementPattern.FIGURE_EIGHT,
    color: '#818cf8',
    difficulty: 'Intermediate',
    bestTime: 'Afternoon slump',
    benefits: ['Increase muscle flexibility', 'Improve complex tracking'],
    steps: ['Imagine a sideways 8', 'Trace the shape smoothly', 'Keep your focus soft but steady']
  },
  {
    id: 'blinking',
    name: 'Conscious Blinking',
    description: 'Blink slowly and deliberately to moisturize eyes.',
    durationSeconds: 60,
    type: ExerciseType.BLINKING,
    instructionText: 'Close your eyes gently... pause... and open.',
    color: '#f472b6',
    difficulty: 'Beginner',
    bestTime: 'Every 20 minutes',
    benefits: ['Refresh tear film', 'Clean the eye surface', 'Rest the brain'],
    steps: [
      'Close your eyes gently',
      'Keep them closed for 2 seconds',
      'Open them normally',
      'Repeat rhythmically'
    ]
  },
  {
    id: 'palming',
    name: 'Palming - The Ultimate Relaxer',
    description: 'Deep relaxation technique that releases eye tension and improves circulation.',
    durationSeconds: 300, // 5 minutes as per request
    type: ExerciseType.PALMING,
    instructionText: 'Block out all light. Feel the warmth soaking into your eyes.',
    color: '#fbbf24',
    difficulty: 'Beginner',
    bestTime: 'Evening / After screen time',
    scientificEvidence: 'Research shows palming reduces eye strain by 40-50% in 5 minutes through accommodation relaxation and parasympathetic nervous system activation.',
    benefits: [
      'Deep eye relaxation',
      'Improved blood circulation',
      'Mental stress reduction',
      'Moisture restoration',
      'Prevents tension headaches',
      'Better sleep quality'
    ],
    conditions: {
      helps: [
        'Digital Eye Strain',
        'Computer Vision Syndrome',
        'Temporary eye fatigue',
        'General eye relaxation'
      ],
      caution: [
        'Severe eye infections',
        'Recent eye surgery',
        'Extreme light sensitivity'
      ]
    },
    steps: [
      'Sit comfortably with feet flat',
      'Rub palms together for 10 seconds until warm',
      'Cup palms over eyes without pressing',
      'Keep eyes in complete darkness',
      'Take deep, slow breaths (4-4-4 rhythm)',
      'Maintain for full 5 minutes',
      'Slowly remove hands and open eyes gradually'
    ]
  },
  {
    id: 'focus-shift',
    name: 'Near & Far',
    description: 'Focus on your thumb (near), then a distant object (far).',
    durationSeconds: 45,
    type: ExerciseType.FOCUS_SHIFT,
    instructionText: 'Focus Near... Focus Far...',
    color: '#a78bfa',
    difficulty: 'Intermediate',
    bestTime: 'During work breaks',
    benefits: ['Improve accommodation', 'Prevent locking of focus'],
    steps: [
      'Hold your thumb 10 inches from your face',
      'Focus on your thumb for 5 seconds',
      'Shift focus to an object 20 feet away',
      'Focus on the distance for 5 seconds',
      'Repeat the cycle'
    ]
  },
  {
    id: 'circular-scan',
    name: 'Circular Clock',
    description: 'Rotate your eyes in a full circle.',
    durationSeconds: 30,
    type: ExerciseType.MOVING_DOT,
    pattern: MovementPattern.CIRCULAR,
    color: '#fb7185',
    difficulty: 'Intermediate',
    bestTime: 'Anytime',
    benefits: ['Full range of motion', 'Stretch all eye muscles'],
    steps: ['Imagine a large clock face', 'Look at 12, then 3, 6, and 9', 'Connect them in a smooth circle']
  }
];

export const DEFAULT_ROUTINE: Routine = {
  id: 'daily-relief',
  name: 'Daily Digital Relief',
  description: 'A balanced routine for computer users.',
  exercises: [
    DEFAULT_EXERCISES[0], // Horizontal
    DEFAULT_EXERCISES[1], // Vertical
    DEFAULT_EXERCISES[3], // Blinking
    DEFAULT_EXERCISES[2], // Figure 8
    DEFAULT_EXERCISES[4], // Palming
  ]
};

export const QUICK_BREAK_ROUTINE: Routine = {
  id: 'quick-break',
  name: '2-Minute Reset',
  description: 'Quick reset for tired eyes between meetings.',
  exercises: [
    DEFAULT_EXERCISES[3], // Blinking
    DEFAULT_EXERCISES[5], // Focus Shift
    // Use a shortened version of Palming for quick break if needed, 
    // but for now we reference the standard one.
    // In a real app, we might create a "Palming Short" variant.
    { ...DEFAULT_EXERCISES[4], name: 'Palming (Short)', durationSeconds: 60 }
  ]
};

// Templates for the builder
export const EXERCISE_TEMPLATES = DEFAULT_EXERCISES.map(({ id, ...rest }) => rest);