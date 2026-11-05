import { UserSettings, UserStats } from '../types/typing';
import { getStageForLevel } from './metamorphosis';

const STATS_STORAGE_KEY = 'pilla_user_stats_v1';
const SETTINGS_STORAGE_KEY = 'pilla_user_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  language: 'fa', // Default to Persian as requested (bilingual toggle anytime)
  keyboardLayout: 'persian-standard',
  soundEnabled: true,
  soundTheme: 'typewriter',
  soundVolume: 0.4,
  ambientMusicEnabled: true,
  ambientMusicVolume: 0.045,
  typingMode: 'forgiving',
  showKeyboard: true,
  showHands: true,
  fontSize: 'lg',
  theme: 'dark',
};

export const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  stage: 'egg',
  dailyStreak: 0,
  lastActiveDate: '',
  todayKeystrokes: 0,
  todayGoalKeystrokes: 500,
  testsCompleted: 0,
  sessionsCompleted: 0,
  lessonsCompleted: 0,
  bestWpm: 0,
  averageWpm: 0,
  averageAccuracy: 100,
  totalPracticeTimeSeconds: 0,
  sessionHistory: [],
  keyMastery: {},
  completedLessons: {},
  unlockedAchievements: [],
};

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getDayDifference(from: string, to: string): number {
  if (!from || !to) return 0;
  const ordinal = (key: string) => {
    const [year, month, day] = key.split('-').map(Number);
    if (!year || !month || !day) return NaN;
    return Date.UTC(year, month - 1, day) / 86_400_000;
  };
  const diff = ordinal(to) - ordinal(from);
  return Number.isFinite(diff) ? diff : 0;
}

export function loadSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: UserSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function loadStats(): UserStats {
  if (typeof window === 'undefined') return DEFAULT_STATS;
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (!raw) return DEFAULT_STATS;
    const parsed = JSON.parse(raw) as Partial<UserStats>;
    const stats = { ...DEFAULT_STATS, ...parsed };

    // A streak advances only after a real practice session, never just by opening the app.
    if (stats.lastActiveDate !== getLocalDateKey()) stats.todayKeystrokes = 0;

    return stats;
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: UserStats): void {
  if (typeof window === 'undefined') return;
  try {
    stats.stage = getStageForLevel(stats.level).id;
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to localStorage', e);
  }
}

export function exportUserData(): string {
  const settings = loadSettings();
  const stats = loadStats();
  const exportObject = {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    stats,
  };
  return JSON.stringify(exportObject, null, 2);
}

export function importUserData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.settings) saveSettings(parsed.settings);
    if (parsed.stats) saveStats(parsed.stats);
    return true;
  } catch {
    return false;
  }
}

export function resetUserData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STATS_STORAGE_KEY);
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
}
