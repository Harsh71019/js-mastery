import test, { describe } from 'node:test'
import assert from 'node:assert'
import { getUpdatedStreak } from '../utils/streak'

describe('Streak Calculation (getUpdatedStreak)', () => {
  test('initializes streak when lastActiveDate is empty', () => {
    const initial = { currentStreak: 0, longestStreak: 0, lastActiveDate: '' }
    const updated = getUpdatedStreak(initial, '2026-05-01')

    assert.strictEqual(updated.currentStreak, 1)
    assert.strictEqual(updated.longestStreak, 1)
    assert.strictEqual(updated.lastActiveDate, '2026-05-01')
  })

  test('is idempotent when already solved today', () => {
    const current = { currentStreak: 5, longestStreak: 7, lastActiveDate: '2026-05-02' }
    const updated = getUpdatedStreak(current, '2026-05-02')

    assert.strictEqual(updated.currentStreak, 5)
    assert.strictEqual(updated.longestStreak, 7)
    assert.strictEqual(updated.lastActiveDate, '2026-05-02')
  })

  test('increments streak on consecutive day', () => {
    const current = { currentStreak: 3, longestStreak: 5, lastActiveDate: '2026-05-02' }
    const updated = getUpdatedStreak(current, '2026-05-03')

    assert.strictEqual(updated.currentStreak, 4)
    assert.strictEqual(updated.longestStreak, 5)
    assert.strictEqual(updated.lastActiveDate, '2026-05-03')
  })

  test('updates longestStreak when currentStreak exceeds it', () => {
    const current = { currentStreak: 5, longestStreak: 5, lastActiveDate: '2026-05-02' }
    const updated = getUpdatedStreak(current, '2026-05-03')

    assert.strictEqual(updated.currentStreak, 6)
    assert.strictEqual(updated.longestStreak, 6)
    assert.strictEqual(updated.lastActiveDate, '2026-05-03')
  })

  test('resets streak to 1 when a day is missed', () => {
    const current = { currentStreak: 10, longestStreak: 15, lastActiveDate: '2026-05-01' }
    const updated = getUpdatedStreak(current, '2026-05-03')

    assert.strictEqual(updated.currentStreak, 1)
    assert.strictEqual(updated.longestStreak, 15)
    assert.strictEqual(updated.lastActiveDate, '2026-05-03')
  })
})
