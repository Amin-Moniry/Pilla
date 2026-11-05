import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_STATS } from './storage';
import { getEligibleAchievementIds } from './achievements';

test('achievement milestones unlock only when their conditions are met', () => {
  const stats = structuredClone(DEFAULT_STATS);
  stats.sessionsCompleted = 1;
  stats.sessionHistory = [
    { date: '2026-11-05T10:00:00.000Z', type: 'practice', wpm: 90, accuracy: 100, errors: 0 },
  ];

  assert.equal(getEligibleAchievementIds(stats).includes('speed_50'), false);
  assert.equal(getEligibleAchievementIds(stats).includes('speed_80'), false);

  stats.level = 5;
  stats.lessonsCompleted = 1;
  stats.dailyStreak = 7;
  stats.sessionHistory.push(
    { date: '2026-11-05T11:00:00.000Z', type: 'race', wpm: 55, accuracy: 98, errors: 1 },
    { date: '2026-11-05T12:00:00.000Z', type: 'test', wpm: 82, accuracy: 100, errors: 0 }
  );

  const eligible = getEligibleAchievementIds(stats);
  for (const id of ['first_wing', 'stage_silkworm', 'speed_50', 'speed_80', 'flawless_run', 'streak_7']) {
    assert.ok(eligible.includes(id), `Expected ${id} to unlock`);
  }
});

test('Persian scholar unlock requires all 150 Persian lessons', () => {
  const stats = structuredClone(DEFAULT_STATS);
  stats.completedLessons = Object.fromEntries(
    Array.from({ length: 150 }, (_, index) => [
      `fa-${String(index + 1).padStart(3, '0')}`,
      { stars: 1, bestWpm: 20, accuracy: 95, date: '2026-11-05' },
    ])
  );

  assert.ok(getEligibleAchievementIds(stats).includes('persian_scholar'));
});