export type Language = 'fa' | 'en';

export type KeyboardLayoutType = 'persian-standard' | 'qwerty' | 'dvorak' | 'colemak';

export type TypingMode = 'strict' | 'forgiving';

export type FingerType =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyDef {
  code: string;
  char: string;
  shiftChar?: string;
  altChar?: string;
  finger: FingerType;
  width?: number; // relative width in units (default 1)
  isHomeBump?: boolean;
}

export type MetamorphosisStageId =
  | 'egg'
  | 'silkworm'
  | 'cocoon'
  | 'emerging'
  | 'butterfly'
  | 'radiant-butterfly';

export interface MetamorphosisStageInfo {
  id: MetamorphosisStageId;
  minLevel: number;
  nameEn: string;
  nameFa: string;
  titleEn: string;
  titleFa: string;
  descriptionEn: string;
  descriptionFa: string;
  glowColor: string;
  accentColor: string;
}

export interface KeystrokeEvent {
  expected: string;
  actual: string;
  timestamp: number;
  isCorrect: boolean;
  timeSinceLastMs: number;
}

export interface SessionMetrics {
  durationSeconds: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  uncorrectedErrors: number;
  correctedErrors: number;
  grossWpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  consistency: number; // percentage
  slowestKeys: { char: string; avgTimeMs: number }[];
  mostErrorKeys: { char: string; errors: number; total: number }[];
  keyStats: {
    char: string;
    total: number;
    correct: number;
    errors: number;
    avgSpeedMs: number;
    speedSamples: number;
  }[];
  fingerStats: Record<FingerType, { total: number; errors: number }>;
}

export interface UserStats {
  xp: number;
  level: number;
  stage: MetamorphosisStageId;
  dailyStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  todayKeystrokes: number;
  todayGoalKeystrokes: number;
  testsCompleted: number;
  sessionsCompleted: number;
  lessonsCompleted: number;
  bestWpm: number;
  averageWpm: number;
  averageAccuracy: number;
  totalPracticeTimeSeconds: number;
  sessionHistory: {
    date: string;
    type: 'lesson' | 'practice' | 'race' | 'test';
    wpm: number;
    accuracy: number;
    errors: number;
    consistency?: number;
    totalKeystrokes?: number;
    correctKeystrokes?: number;
    keyStats?: SessionMetrics['keyStats'];
    fingerStats?: SessionMetrics['fingerStats'];
  }[];
  keyMastery: Record<string, { total: number; correct: number; avgSpeedMs: number; speedSamples?: number }>;
  completedLessons: Record<string, { stars: number; bestWpm: number; accuracy: number; date: string }>;
  unlockedAchievements: string[];
}

export type SoundTheme =
  | 'royal-santoor'
  | 'thock'
  | 'cherry-mx'
  | 'creamy-linear'
  | 'typewriter'
  | 'crystal-drop'
  | 'soft-bubble';

export interface UserSettings {
  language: Language;
  keyboardLayout: KeyboardLayoutType;
  soundEnabled: boolean;
  soundTheme: SoundTheme;
  soundVolume: number;
  ambientMusicEnabled: boolean;
  ambientMusicVolume: number;
  typingMode: TypingMode;
  showKeyboard: boolean;
  showHands: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  theme: 'dark' | 'light';
}
