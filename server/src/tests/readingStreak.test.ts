import test, { describe } from 'node:test'
import assert from 'node:assert'
import { getUpdatedReadingStreak } from '../utils/readingStreak'

describe('Article Reading Streak (getUpdatedReadingStreak)', () => {
  test('initializes reading streak on first article read', () => {
    const initial = { readingStreak: 0, longestReadingStreak: 0, lastArticleReadAt: null }
    const updated = getUpdatedReadingStreak(initial, '2026-05-10')

    assert.strictEqual(updated.readingStreak, 1)
    assert.strictEqual(updated.longestReadingStreak, 1)
    assert.ok(updated.lastArticleReadAt.length > 0)
  })

  test('is idempotent when another article is read on the same day', () => {
    const current = {
      readingStreak: 3,
      longestReadingStreak: 5,
      lastArticleReadAt: '2026-05-10T14:30:00.000Z',
    }
    const updated = getUpdatedReadingStreak(current, '2026-05-10')

    assert.strictEqual(updated.readingStreak, 3)
    assert.strictEqual(updated.longestReadingStreak, 5)
    assert.strictEqual(updated.lastArticleReadAt, '2026-05-10T14:30:00.000Z')
  })

  test('increments reading streak on consecutive day', () => {
    const current = {
      readingStreak: 2,
      longestReadingStreak: 2,
      lastArticleReadAt: '2026-05-10T10:00:00.000Z',
    }
    const updated = getUpdatedReadingStreak(current, '2026-05-11')

    assert.strictEqual(updated.readingStreak, 3)
    assert.strictEqual(updated.longestReadingStreak, 3)
  })

  test('resets reading streak to 1 after a missed day', () => {
    const current = {
      readingStreak: 8,
      longestReadingStreak: 10,
      lastArticleReadAt: '2026-05-01T12:00:00.000Z',
    }
    const updated = getUpdatedReadingStreak(current, '2026-05-05')

    assert.strictEqual(updated.readingStreak, 1)
    assert.strictEqual(updated.longestReadingStreak, 10)
  })
})
