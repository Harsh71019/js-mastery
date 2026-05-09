import { useMemo } from 'react'
import { isBefore, parseISO } from 'date-fns'
import { useProgressStore } from '@/store/useProgressStore'

const MASTERY_INTERVAL = 64

export interface RepetitionHealthResult {
  readonly mastered:   number
  readonly onTrack:    number
  readonly due:        number
  readonly unreviewed: number
  readonly total:      number
}

const selectSolvedProblems = (
  state: ReturnType<typeof useProgressStore.getState>,
) => state.solvedProblems

export const useRepetitionHealth = (): RepetitionHealthResult => {
  const solvedProblems = useProgressStore(selectSolvedProblems)

  return useMemo((): RepetitionHealthResult => {
    const today = new Date()
    let mastered = 0
    let onTrack = 0
    let due = 0
    let unreviewed = 0

    for (const entry of Object.values(solvedProblems)) {
      if ((entry.reviewInterval ?? 0) >= MASTERY_INTERVAL) {
        mastered++
        continue
      }
      if (!entry.nextReviewDue) {
        unreviewed++
        continue
      }
      const reviewDate = parseISO(entry.nextReviewDue)
      if (isBefore(reviewDate, today)) due++
      else onTrack++
    }

    return {
      mastered,
      onTrack,
      due,
      unreviewed,
      total: mastered + onTrack + due + unreviewed,
    }
  }, [solvedProblems])
}
