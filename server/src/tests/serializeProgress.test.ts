import test, { describe } from 'node:test'
import assert from 'node:assert'
import { serializeProgress } from '../utils/serializeProgress'

describe('Progress Serialization (serializeProgress)', () => {
  test('handles Map solvedProblems correctly', () => {
    const doc = {
      solvedProblems: new Map([
        [
          'loop-1',
          {
            solvedAt: '2026-05-01T12:00:00.000Z',
            attempts: 2,
            runTimings: [12, 14],
          },
        ],
      ]),
      lastActiveDate: '2026-05-01',
      currentStreak: 1,
      longestStreak: 1,
      dismissedBackupMilestone: 0,
    }

    const serialized = serializeProgress(doc) as {
      solvedProblems: Record<string, { runTimings: { ms: number; accepted: boolean }[] }>
      lastActiveDate: string
      dailyStreak: number
    }

    assert.ok(serialized.solvedProblems['loop-1'])
    assert.strictEqual(serialized.solvedProblems['loop-1'].runTimings.length, 2)
    assert.strictEqual(serialized.solvedProblems['loop-1'].runTimings[0]?.ms, 12)
    assert.strictEqual(serialized.dailyStreak, 0)
  })

  test('handles plain Object solvedProblems safely', () => {
    const doc = {
      solvedProblems: {
        'loop-2': {
          solvedAt: '2026-05-02T10:00:00.000Z',
          attempts: 1,
          runTimings: [{ ms: 25, accepted: true }],
        },
      },
      lastActiveDate: '2026-05-02',
      currentStreak: 2,
      longestStreak: 2,
      dismissedBackupMilestone: 0,
    }

    const serialized = serializeProgress(doc) as {
      solvedProblems: Record<string, { runTimings: { ms: number; accepted: boolean }[] }>
    }

    assert.ok(serialized.solvedProblems['loop-2'])
    assert.strictEqual(serialized.solvedProblems['loop-2'].runTimings[0]?.ms, 25)
  })

  test('provides sensible defaults for missing optional fields', () => {
    const doc = {
      solvedProblems: new Map(),
    }

    const serialized = serializeProgress(doc as never) as {
      currentStreak: number
      completedDailies: string[]
      bookmarkedArticles: string[]
      readingStreak: number
    }

    assert.strictEqual(serialized.currentStreak, 0)
    assert.deepStrictEqual(serialized.completedDailies, [])
    assert.deepStrictEqual(serialized.bookmarkedArticles, [])
    assert.strictEqual(serialized.readingStreak, 0)
  })
})
