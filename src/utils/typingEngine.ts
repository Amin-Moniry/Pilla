import { KeystrokeEvent, SessionMetrics, FingerType } from '../types/typing';

/**
 * Standard touch-typing calculation constants.
 * Standard word length across all major typing standards (including Persian) is 5 characters (keystrokes).
 * 1 Word = 5 keystrokes (including spaces and punctuation).
 */
export const CHARS_PER_WORD = 5;

/**
 * Calculates Gross Words Per Minute (all keystrokes typed regardless of errors).
 */
export function calcGrossWpm(totalKeystrokes: number, durationSeconds: number): number {
  if (durationSeconds <= 0 || totalKeystrokes <= 0) return 0;
  const minutes = durationSeconds / 60;
  const words = totalKeystrokes / CHARS_PER_WORD;
  return Math.round(words / minutes);
}

/**
 * Calculates Net Words Per Minute (penalizes uncorrected errors).
 */
export function calcNetWpm(grossWpm: number, uncorrectedErrors: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0;
  const minutes = durationSeconds / 60;
  const errorPenalty = uncorrectedErrors / minutes;
  return Math.max(0, Math.round(grossWpm - errorPenalty));
}

/**
 * Calculates Characters Per Minute (CPM) based on correct keystrokes.
 */
export function calcCpm(correctKeystrokes: number, durationSeconds: number): number {
  if (durationSeconds <= 0 || correctKeystrokes <= 0) return 0;
  const minutes = durationSeconds / 60;
  return Math.round(correctKeystrokes / minutes);
}

/**
 * Calculates typing accuracy percentage (0 to 100).
 */
export function calcAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  return Math.min(100, Math.max(0, Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10));
}

/**
 * Calculates typing rhythm consistency percentage (0-100%).
 * Consistency measures the variance in inter-keystroke intervals (smoothness of flow).
 * Lower variance relative to mean interval yields higher consistency score.
 */
export function calcConsistency(intervalsMs: number[]): number {
  if (intervalsMs.length < 5) return 100;
  // Exclude pauses > 2 seconds (e.g. user sneezed or looked away)
  const filtered = intervalsMs.filter(t => t > 10 && t < 2000);
  if (filtered.length < 3) return 85;

  const mean = filtered.reduce((acc, v) => acc + v, 0) / filtered.length;
  const variance =
    filtered.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / filtered.length;
  const stdDev = Math.sqrt(variance);

  // Coefficient of variation: lower is more consistent
  const cv = stdDev / mean;
  const consistencyScore = Math.max(0, Math.min(100, Math.round((1 - cv * 0.5) * 100)));
  return consistencyScore;
}

/**
 * Zero-Width Non-Joiner (ZWNJ / نیم‌فاصله) character code: \u200C
 */
export const ZWNJ_CHAR = '\u200C';

/**
 * Checks if a character is Persian ZWNJ.
 */
export function isZwnj(char: string): boolean {
  return char === ZWNJ_CHAR || char === '\u200D' || char === '\u200B';
}

/**
 * Normalizes Persian/Arabic variations for typing comparison:
 * - Persian Yeh ('ی') and Arabic Yeh ('ي')
 * - Persian Kaf ('ک') and Arabic Kaf ('ك')
 * - Persian digits (۰-۹) vs Arabic digits (٠-٩)
 * - Various whitespace representations and ZWNJ
 */
export function normalizeChar(char: string): string {
  if (!char) return '';
  if (isZwnj(char)) return ZWNJ_CHAR;
  return char
    .replace(/\u064A/g, '\u06CC') // Arabic Yeh -> Persian Yeh
    .replace(/\u0643/g, '\u06A9') // Arabic Kaf -> Persian Kaf
    .replace(/\u0660/g, '\u06F0') // Arabic 0 -> Persian 0
    .replace(/\u0661/g, '\u06F1')
    .replace(/\u0662/g, '\u06F2')
    .replace(/\u0663/g, '\u06F3')
    .replace(/\u0664/g, '\u06F4')
    .replace(/\u0665/g, '\u06F5')
    .replace(/\u0666/g, '\u06F6')
    .replace(/\u0667/g, '\u06F7')
    .replace(/\u0668/g, '\u06F8')
    .replace(/\u0669/g, '\u06F9');
}

/**
 * Determines if a typed character matches the target character,
 * respecting normalization and flexible whitespace/ZWNJ policies.
 */
export function isCharMatch(expected: string, actual: string): boolean {
  if (expected === actual) return true;
  return normalizeChar(expected) === normalizeChar(actual);
}

/**
 * Calculates star rating (1 to 3 stars) based on target WPM and accuracy criteria.
 */
export function calculateStars(
  wpm: number,
  targetWpm: number,
  accuracy: number,
  minAccuracy: number
): number {
  if (accuracy < minAccuracy - 5) return 0;
  if (wpm >= targetWpm * 1.25 && accuracy >= Math.min(99, minAccuracy + 2)) {
    return 3;
  }
  if (wpm >= targetWpm && accuracy >= minAccuracy) {
    return 2;
  }
  if (wpm >= targetWpm * 0.8 && accuracy >= minAccuracy - 5) {
    return 1;
  }
  return 0;
}

/**
 * Computes complete diagnostics from keystroke stream.
 */
export function computeSessionMetrics(
  keystrokes: KeystrokeEvent[],
  durationSeconds: number,
  fingerLookup: (char: string) => FingerType
): SessionMetrics {
  const duration = Math.max(0.5, durationSeconds);
  const totalKeystrokes = keystrokes.length;
  const correctKeystrokes = keystrokes.filter(k => k.isCorrect).length;
  const uncorrectedErrors = totalKeystrokes - correctKeystrokes;

  const grossWpm = calcGrossWpm(totalKeystrokes, duration);
  const netWpm = calcNetWpm(grossWpm, uncorrectedErrors, duration);
  const cpm = calcCpm(correctKeystrokes, duration);
  const accuracy = calcAccuracy(correctKeystrokes, totalKeystrokes);

  const intervals = keystrokes.map(k => k.timeSinceLastMs);
  const consistency = calcConsistency(intervals);

  // Group keystroke time and error by character
  const charStats: Record<string, { times: number[]; errors: number; total: number }> = {};
  const fingerStats: Record<FingerType, { total: number; errors: number }> = {
    'left-pinky': { total: 0, errors: 0 },
    'left-ring': { total: 0, errors: 0 },
    'left-middle': { total: 0, errors: 0 },
    'left-index': { total: 0, errors: 0 },
    thumb: { total: 0, errors: 0 },
    'right-index': { total: 0, errors: 0 },
    'right-middle': { total: 0, errors: 0 },
    'right-ring': { total: 0, errors: 0 },
    'right-pinky': { total: 0, errors: 0 },
  };

  for (const k of keystrokes) {
    const char = k.expected;
    if (!charStats[char]) {
      charStats[char] = { times: [], errors: 0, total: 0 };
    }
    charStats[char].total += 1;
    if (!k.isCorrect) {
      charStats[char].errors += 1;
    }
    if (k.timeSinceLastMs > 20 && k.timeSinceLastMs < 3000) {
      charStats[char].times.push(k.timeSinceLastMs);
    }

    const finger = fingerLookup(char);
    fingerStats[finger].total += 1;
    if (!k.isCorrect) {
      fingerStats[finger].errors += 1;
    }
  }

  // Find slowest keys
  const slowestKeys = Object.entries(charStats)
    .filter(([_, stats]) => stats.times.length >= 2)
    .map(([char, stats]) => ({
      char,
      avgTimeMs: Math.round(stats.times.reduce((a, b) => a + b, 0) / stats.times.length),
    }))
    .sort((a, b) => b.avgTimeMs - a.avgTimeMs)
    .slice(0, 5);

  // Find most error keys
  const mostErrorKeys = Object.entries(charStats)
    .filter(([_, stats]) => stats.errors > 0)
    .map(([char, stats]) => ({
      char,
      errors: stats.errors,
      total: stats.total,
    }))
    .sort((a, b) => b.errors - a.errors)
    .slice(0, 5);

  const keyStats = Object.entries(charStats).map(([char, stats]) => ({
    char,
    total: stats.total,
    correct: stats.total - stats.errors,
    errors: stats.errors,
    avgSpeedMs: stats.times.length
      ? Math.round(stats.times.reduce((sum, time) => sum + time, 0) / stats.times.length)
      : 0,
    speedSamples: stats.times.length,
  }));

  return {
    durationSeconds: Math.round(duration),
    totalKeystrokes,
    correctKeystrokes,
    uncorrectedErrors,
    correctedErrors: 0,
    grossWpm,
    netWpm,
    cpm,
    accuracy,
    consistency,
    slowestKeys,
    mostErrorKeys,
    keyStats,
    fingerStats,
  };
}
