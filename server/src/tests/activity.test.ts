import test, { describe } from 'node:test'
import assert from 'node:assert'
import { getDailyActivity } from '../utils/activity'

describe('Daily Activity Graph (getDailyActivity)', () => {
  test('handles Map input correctly', () => {
    const solved = new Map<string, { solvedAt?: string }>([
      ['p1', { solvedAt: new Date().toISOString() }],
      ['p2', { solvedAt: new Date().toISOString() }],
    ])

    const result = getDailyActivity(solved, [], 30)
    assert.strictEqual(result.days.length, 30)
    assert.ok(result.totalSolvedInWindow >= 2)
    assert.ok(result.maxCount >= 2)
  })

  test('handles plain Object input safely without crashing', () => {
    const solved = {
      p1: { solvedAt: new Date().toISOString() },
    }

    const result = getDailyActivity(solved, [], 10)
    assert.strictEqual(result.days.length, 10)
    assert.ok(result.totalSolvedInWindow >= 1)
  })

  test('handles empty or undefined input safely', () => {
    const result = getDailyActivity(new Map(), [], 7)
    assert.strictEqual(result.days.length, 7)
    assert.strictEqual(result.totalSolvedInWindow, 0)
    assert.strictEqual(result.maxCount, 0)
  })

  test('aggregates both solved problems and reading history', () => {
    const today = new Date().toISOString().split('T')[0] ?? ''
    const solved = new Map([['p1', { solvedAt: `${today}T10:00:00.000Z` }]])
    const reading = [{ articleId: 'a1', date: today }]

    const result = getDailyActivity(solved, reading, 10)
    const todayDay = result.days.find((d) => d.date === today)
    assert.ok(todayDay)
    assert.strictEqual(todayDay.count, 2)
  })
})
