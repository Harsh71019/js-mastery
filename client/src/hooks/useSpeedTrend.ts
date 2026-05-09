import { useMemo } from 'react'
import { subMonths, format, parseISO } from 'date-fns'
import { useProgressStore } from '@/store/useProgressStore'

export interface SpeedTrendMonth {
  readonly key:   string
  readonly label: string
  readonly avgMs: number | null
  readonly count: number
}

export interface SpeedTrendResult {
  readonly months:   readonly SpeedTrendMonth[]
  readonly maxAvgMs: number
  readonly hasData:  boolean
}

const selectSolvedProblems = (
  state: ReturnType<typeof useProgressStore.getState>,
) => state.solvedProblems

export const useSpeedTrend = (): SpeedTrendResult => {
  const solvedProblems = useProgressStore(selectSolvedProblems)

  return useMemo((): SpeedTrendResult => {
    const today = new Date()

    const monthKeys = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(today, 5 - i)
      return { key: format(date, 'yyyy-MM'), label: format(date, 'MMM') }
    })

    const monthData: Record<string, { totalMs: number; count: number }> = {}
    for (const { key } of monthKeys) {
      monthData[key] = { totalMs: 0, count: 0 }
    }

    for (const entry of Object.values(solvedProblems)) {
      if (!entry.executionTimeMs || entry.executionTimeMs <= 0) continue
      const monthKey = format(parseISO(entry.solvedAt), 'yyyy-MM')
      if (!monthData[monthKey]) continue
      monthData[monthKey].totalMs += entry.executionTimeMs
      monthData[monthKey].count++
    }

    const months: SpeedTrendMonth[] = monthKeys.map(({ key, label }) => {
      const d = monthData[key]
      return {
        key,
        label,
        avgMs: d.count > 0 ? Math.round(d.totalMs / d.count) : null,
        count: d.count,
      }
    })

    const validMs  = months.filter((m) => m.avgMs !== null).map((m) => m.avgMs as number)
    const maxAvgMs = validMs.length > 0 ? Math.max(...validMs) : 1

    return { months, maxAvgMs, hasData: validMs.length > 0 }
  }, [solvedProblems])
}
