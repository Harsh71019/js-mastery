import { useMemo } from 'react'
import { parseISO } from 'date-fns'
import { useProgressStore } from '@/store/useProgressStore'

export type DayName   = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'
export type HourBlock = 'Night' | 'Morning' | 'Afternoon' | 'Evening'

export const DAY_NAMES: readonly DayName[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const BLOCK_ORDER: readonly HourBlock[] = ['Night', 'Morning', 'Afternoon', 'Evening']

const BLOCK_LABELS: Record<HourBlock, string> = {
  Night:     'Night (12am–6am)',
  Morning:   'Morning (6am–12pm)',
  Afternoon: 'Afternoon (12pm–6pm)',
  Evening:   'Evening (6pm–12am)',
}

const getHourBlock = (hour: number): HourBlock => {
  if (hour < 6)  return 'Night'
  if (hour < 12) return 'Morning'
  if (hour < 18) return 'Afternoon'
  return 'Evening'
}

export interface PeakWindowResult {
  readonly dayDistribution:   readonly number[]
  readonly bestDay:           DayName | null
  readonly bestBlock:         HourBlock | null
  readonly bestBlockLabel:    string | null
  readonly totalSolves:       number
}

const selectSolvedProblems = (
  state: ReturnType<typeof useProgressStore.getState>,
) => state.solvedProblems

export const usePeakWindow = (): PeakWindowResult => {
  const solvedProblems = useProgressStore(selectSolvedProblems)

  return useMemo((): PeakWindowResult => {
    const dayDist   = new Array<number>(7).fill(0)
    const blockDist = new Array<number>(4).fill(0)
    let totalSolves = 0

    for (const entry of Object.values(solvedProblems)) {
      if (!entry.solvedAt) continue
      const date       = parseISO(entry.solvedAt)
      const dayIndex   = (date.getDay() + 6) % 7
      const blockIndex = BLOCK_ORDER.indexOf(getHourBlock(date.getHours()))
      dayDist[dayIndex]++
      blockDist[blockIndex]++
      totalSolves++
    }

    if (totalSolves < 7) {
      return { dayDistribution: dayDist, bestDay: null, bestBlock: null, bestBlockLabel: null, totalSolves }
    }

    const bestDayIndex   = dayDist.indexOf(Math.max(...dayDist))
    const bestBlockIndex = blockDist.indexOf(Math.max(...blockDist))
    const bestBlock      = BLOCK_ORDER[bestBlockIndex]

    return {
      dayDistribution: dayDist,
      bestDay:         DAY_NAMES[bestDayIndex],
      bestBlock,
      bestBlockLabel:  BLOCK_LABELS[bestBlock],
      totalSolves,
    }
  }, [solvedProblems])
}
