import { useMemo } from 'react'
import { subMonths, format, parseISO } from 'date-fns'
import { useProgressStore } from '@/store/useProgressStore'

export interface MonthBucket {
  readonly key:      string
  readonly label:    string
  readonly beginner: number
  readonly easy:     number
  readonly medium:   number
  readonly hard:     number
  readonly total:    number
}

export interface DifficultyProgressionResult {
  readonly months:   readonly MonthBucket[]
  readonly maxTotal: number
}

const selectSolvedProblems = (
  state: ReturnType<typeof useProgressStore.getState>,
) => state.solvedProblems

export const useDifficultyProgression = (): DifficultyProgressionResult => {
  const solvedProblems = useProgressStore(selectSolvedProblems)

  return useMemo((): DifficultyProgressionResult => {
    const today = new Date()

    const monthKeys = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(today, 5 - i)
      return { key: format(date, 'yyyy-MM'), label: format(date, 'MMM') }
    })

    const buckets: Record<string, { beginner: number; easy: number; medium: number; hard: number }> = {}
    for (const { key } of monthKeys) {
      buckets[key] = { beginner: 0, easy: 0, medium: 0, hard: 0 }
    }

    for (const entry of Object.values(solvedProblems)) {
      if (!entry.solvedAt) continue
      const monthKey = format(parseISO(entry.solvedAt), 'yyyy-MM')
      if (!buckets[monthKey]) continue

      const difficulty = entry.difficulty ?? 'Easy'
      if (difficulty === 'Beginner') buckets[monthKey].beginner++
      else if (difficulty === 'Medium') buckets[monthKey].medium++
      else if (difficulty === 'Hard') buckets[monthKey].hard++
      else buckets[monthKey].easy++
    }

    const months = monthKeys.map(({ key, label }) => {
      const b     = buckets[key]
      const total = b.beginner + b.easy + b.medium + b.hard
      return { key, label, ...b, total }
    })

    const maxTotal = Math.max(...months.map((m) => m.total), 1)

    return { months, maxTotal }
  }, [solvedProblems])
}
