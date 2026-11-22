import test, { describe } from 'node:test'
import assert from 'node:assert'
import { updateDailyStreak } from '../utils/dailyStreak'

describe('Daily Challenge Streak (updateDailyStreak)', () => {
  test('initializes daily streak on first completion', () => {
    const initial = {
      dailyStreak: 0,
      longestDailyStreak: 0,
      completedDailies: [],
    }
    const updated = updateDailyStreak(initial, '2026-05-01')

    assert.strictEqual(updated.dailyStreak, 1)
    assert.strictEqual(updated.longestDailyStreak, 1)
    assert.strictEqual(updated.lastDailySolvedAt, '2026-05-01')
    assert.deepStrictEqual(updated.completedDailies, ['2026-05-01'])
  })

  test('is idempotent when today was already completed', () => {
    const current = {
      dailyStreak: 4,
      longestDailyStreak: 6,
      lastDailySolvedAt: '2026-05-05',
      completedDailies: ['2026-05-02', '2026-05-03', '2026-05-04', '2026-05-05'],
    }
    const updated = updateDailyStreak(current, '2026-05-05')

    assert.strictEqual(updated.dailyStreak, 4)
    assert.strictEqual(updated.longestDailyStreak, 6)
    assert.strictEqual(updated.lastDailySolvedAt, '2026-05-05')
    assert.strictEqual(updated.completedDailies.length, 4)
  })

  test('increments streak on consecutive day', () => {
    const current = {
      dailyStreak: 2,
      longestDailyStreak: 4,
      lastDailySolvedAt: '2026-05-05',
      completedDailies: ['2026-05-04', '2026-05-05'],
    }
    const updated = updateDailyStreak(current, '2026-05-06')

    assert.strictEqual(updated.dailyStreak, 3)
    assert.strictEqual(updated.longestDailyStreak, 4)
    assert.strictEqual(updated.lastDailySolvedAt, '2026-05-06')
    assert.strictEqual(updated.completedDailies.length, 3)
    assert.ok(updated.completedDailies.includes('2026-05-06'))
  })

  test('resets streak to 1 after a missed day but preserves history', () => {
    const current = {
      dailyStreak: 5,
      longestDailyStreak: 5,
      lastDailySolvedAt: '2026-05-01',
      completedDailies: ['2026-05-01'],
    }
    const updated = updateDailyStreak(current, '2026-05-04')

    assert.strictEqual(updated.dailyStreak, 1)
    assert.strictEqual(updated.longestDailyStreak, 5)
    assert.strictEqual(updated.lastDailySolvedAt, '2026-05-04')
    assert.deepStrictEqual(updated.completedDailies, ['2026-05-01', '2026-05-04'])
  })
})
