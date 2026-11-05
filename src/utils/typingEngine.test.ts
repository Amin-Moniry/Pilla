import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calcGrossWpm,
  calcNetWpm,
  calcCpm,
  calcAccuracy,
  calcConsistency,
  normalizeChar,
  isCharMatch,
  isZwnj,
  calculateStars,
  computeSessionMetrics,
  CHARS_PER_WORD,
  ZWNJ_CHAR,
} from './typingEngine';

test('touch-typing standard uses 5 chars per word', () => {
  assert.equal(CHARS_PER_WORD, 5);
});

test('gross WPM calculation handles typical cases', () => {
  // 300 keystrokes in 60 seconds = 60 words / 1 min = 60 WPM
  assert.equal(calcGrossWpm(300, 60), 60);
  // 150 keystrokes in 30 seconds = 30 words / 0.5 min = 60 WPM
  assert.equal(calcGrossWpm(150, 30), 60);
  // 0 keystrokes or 0 duration
  assert.equal(calcGrossWpm(0, 60), 0);
  assert.equal(calcGrossWpm(100, 0), 0);
});

test('net WPM calculation applies uncorrected error penalty correctly', () => {
  // 60 gross WPM with 2 uncorrected errors over 60 seconds: 60 - 2 = 58 net WPM
  assert.equal(calcNetWpm(60, 2, 60), 58);
  // Errors greater than gross WPM clamps to 0
  assert.equal(calcNetWpm(20, 25, 60), 0);
});

test('cpm and accuracy calculation', () => {
  // 240 correct keystrokes in 60s = 240 CPM
  assert.equal(calcCpm(240, 60), 240);
  // 95 correct out of 100 total = 95%
  assert.equal(calcAccuracy(95, 100), 95);
  // 0 total keystrokes defaults to 100%
  assert.equal(calcAccuracy(0, 0), 100);
});

test('consistency calculation measures interval smoothness', () => {
  // Perfectly uniform intervals
  const uniform = [150, 150, 150, 150, 150, 150, 150];
  const highConsistency = calcConsistency(uniform);
  assert.ok(highConsistency >= 95, `Expected high consistency, got ${highConsistency}`);

  // Wildly erratic intervals
  const erratic = [50, 900, 80, 1200, 60, 800, 110];
  const lowerConsistency = calcConsistency(erratic);
  assert.ok(lowerConsistency < highConsistency, 'Erratic intervals should have lower consistency');
});

test('Persian normalization handles Arabic Yeh, Kaf, and ZWNJ correctly', () => {
  // Arabic Yeh (\u064A) to Persian Yeh (\u06CC)
  assert.equal(normalizeChar('\u064A'), '\u06CC');
  // Arabic Kaf (\u0643) to Persian Kaf (\u06A9)
  assert.equal(normalizeChar('\u0643'), '\u06A9');

  // Arabic digits to Persian digits
  assert.equal(normalizeChar('٥'), '۵');
  assert.equal(normalizeChar('٠'), '۰');

  // ZWNJ detection
  assert.equal(isZwnj(ZWNJ_CHAR), true);
  assert.equal(isZwnj(' '), false);

  // isCharMatch
  assert.equal(isCharMatch('\u064A', '\u06CC'), true);
  assert.equal(isCharMatch('a', 'a'), true);
  assert.equal(isCharMatch('a', 'b'), false);
});

test('star rating calculation', () => {
  // Below min accuracy -> 0 stars
  assert.equal(calculateStars(80, 40, 85, 95), 0);
  // Standard pass -> 2 stars
  assert.equal(calculateStars(42, 40, 96, 95), 2);
  // Superior speed & high accuracy -> 3 stars
  assert.equal(calculateStars(55, 40, 99, 95), 3);
  // Borderline -> 1 star
  assert.equal(calculateStars(34, 40, 92, 95), 1);
});

test('computeSessionMetrics generates comprehensive diagnostics', () => {
  const dummyLookup = () => 'left-index' as const;
  const events = [
    { expected: 'f', actual: 'f', timestamp: 100, isCorrect: true, timeSinceLastMs: 150 },
    { expected: 'j', actual: 'j', timestamp: 250, isCorrect: true, timeSinceLastMs: 150 },
    { expected: 'd', actual: 'x', timestamp: 400, isCorrect: false, timeSinceLastMs: 150 },
    { expected: 'k', actual: 'k', timestamp: 550, isCorrect: true, timeSinceLastMs: 150 },
  ];

  const metrics = computeSessionMetrics(events, 2, dummyLookup);
  assert.equal(metrics.totalKeystrokes, 4);
  assert.equal(metrics.correctKeystrokes, 3);
  assert.equal(metrics.uncorrectedErrors, 1);
  assert.equal(metrics.accuracy, 75);
  assert.equal(metrics.mostErrorKeys[0].char, 'd');
  assert.equal(metrics.keyStats.length, 4);
  assert.deepEqual(
    metrics.keyStats.find((key) => key.char === 'd'),
    {
      char: 'd',
      total: 1,
      correct: 0,
      errors: 1,
      avgSpeedMs: 150,
      speedSamples: 1,
    }
  );
  assert.equal(metrics.keyStats.find((key) => key.char === 'f')?.correct, 1);
});
