import test from 'node:test';
import assert from 'node:assert/strict';
import { getDayDifference, getLocalDateKey } from './storage';

test('local date keys use the local calendar date', () => {
  const localDate = new Date(2026, 10, 5, 12, 0, 0);
  assert.equal(getLocalDateKey(localDate), '2026-11-05');
});

test('day difference handles month and year boundaries', () => {
  assert.equal(getDayDifference('2026-10-31', '2026-11-01'), 1);
  assert.equal(getDayDifference('2025-12-31', '2026-01-01'), 1);
  assert.equal(getDayDifference('2026-11-05', '2026-11-08'), 3);
  assert.equal(getDayDifference('', '2026-11-08'), 0);
});