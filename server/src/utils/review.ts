import { format, addDays } from 'date-fns'

export const MAX_REVIEW_INTERVAL = 64

interface NextReview {
  reviewInterval: number
  lastReviewedAt: string
  nextReviewDue:  string
}

export const computeNextReview = (
  currentInterval: number,
  isCorrect: boolean,
  today: string,
): NextReview => {
  const nextInterval = isCorrect
    ? Math.min(currentInterval * 2, MAX_REVIEW_INTERVAL)
    : 1

  return {
    reviewInterval: nextInterval,
    lastReviewedAt: today,
    nextReviewDue:  format(addDays(new Date(today), nextInterval), 'yyyy-MM-dd'),
  }
}

export const isMastered = (reviewInterval: number): boolean =>
  reviewInterval >= MAX_REVIEW_INTERVAL
