import test, { describe } from 'node:test'
import assert from 'node:assert'
import { computeNextReview, isMastered, MAX_REVIEW_INTERVAL } from '../utils/review'

describe('Spaced Repetition Review (computeNextReview & isMastered)', () => {
  test('increments review interval when answer is correct', () => {
    const result = computeNextReview(1, true, '2026-05-01', 2)
    assert.strictEqual(result.reviewInterval, 2)
    assert.strictEqual(result.lastReviewedAt, '2026-05-01')
    assert.strictEqual(result.nextReviewDue, '2026-05-03')
  })

  test('resets review interval to 1 on incorrect answer', () => {
    const result = computeNextReview(16, false, '2026-05-01', 2)
    assert.strictEqual(result.reviewInterval, 1)
    assert.strictEqual(result.lastReviewedAt, '2026-05-01')
    assert.strictEqual(result.nextReviewDue, '2026-05-02')
  })

  test('caps interval at MAX_REVIEW_INTERVAL', () => {
    const result = computeNextReview(40, true, '2026-05-01', 2)
    assert.strictEqual(result.reviewInterval, MAX_REVIEW_INTERVAL)
  })

  test('isMastered returns true only when interval >= MAX_REVIEW_INTERVAL', () => {
    assert.strictEqual(isMastered(MAX_REVIEW_INTERVAL - 1), false)
    assert.strictEqual(isMastered(MAX_REVIEW_INTERVAL), true)
    assert.strictEqual(isMastered(MAX_REVIEW_INTERVAL + 10), true)
  })
})
