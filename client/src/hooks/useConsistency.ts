import { useMemo } from 'react'
import { subDays, format, parseISO } from 'date-fns'
import { useProgressStore } from '@/store/useProgressStore'

export type ConsistencyTier = 'Irregular' | 'Building' | 'Solid' | 'Committed' | 'Elite'

export interface SparklineEntry {
  readonly date:  string
  readonly count: number
}

export interface ConsistencyResult {
  readonly score:      number
  readonly activeDays: number
  readonly tier:       ConsistencyTier
  readonly sparkline:  readonly SparklineEntry[]
}

const toTier = (score: number): ConsistencyTier => {
  if (score >= 90) return 'Elite'
  if (score >= 75) return 'Committed'
  if (score >= 50) return 'Solid'
  if (score >= 20) return 'Building'
  return 'Irregular'
}

const selectSolvedProblems = (
  state: ReturnType<typeof useProgressStore.getState>,
) => state.solvedProblems

export const useConsistency = (): ConsistencyResult => {
  const solvedProblems = useProgressStore(selectSolvedProblems)

  return useMemo((): ConsistencyResult => {
    const today = new Date()
    const activeDates = new Set<string>()
    const dayCounts: Record<string, number> = {}

    for (const entry of Object.values(solvedProblems)) {
      if (!entry.solvedAt) continue
      const dateStr = entry.solvedAt.split('T')[0]
      const daysAgo = Math.floor(
        (today.getTime() - parseISO(dateStr).getTime()) / (1000 * 60 * 60 * 24),
      )
      if (daysAgo < 30) {
        activeDates.add(dateStr)
        dayCounts[dateStr] = (dayCounts[dateStr] ?? 0) + 1
      }
    }

    const sparkline: SparklineEntry[] = Array.from({ length: 28 }, (_, i) => {
      const date    = subDays(today, 27 - i)
      const dateStr = format(date, 'yyyy-MM-dd')
      return { date: dateStr, count: dayCounts[dateStr] ?? 0 }
    })

    const activeDays = activeDates.size
    const score      = Math.min(100, Math.round((activeDays / 30) * 100))

    return { score, activeDays, tier: toTier(score), sparkline }
  }, [solvedProblems])
}
