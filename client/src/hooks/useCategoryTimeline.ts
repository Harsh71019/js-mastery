import { useMemo } from 'react'
import { differenceInDays, parseISO } from 'date-fns'
import { useProgressStore } from '@/store/useProgressStore'
import { CATEGORIES } from '@/data/categories'

export interface CategoryTimelineEntry {
  readonly slug:           string
  readonly title:          string
  readonly accentColor:    string
  readonly daysUntilStart: number
  readonly daysActive:     number
}

export interface CategoryTimelineResult {
  readonly categories: readonly CategoryTimelineEntry[]
  readonly currentDay: number
}

const selectSolvedProblems = (
  state: ReturnType<typeof useProgressStore.getState>,
) => state.solvedProblems

export const useCategoryTimeline = (): CategoryTimelineResult => {
  const solvedProblems = useProgressStore(selectSolvedProblems)

  return useMemo((): CategoryTimelineResult => {
    const entries = Object.values(solvedProblems)
    if (entries.length === 0) return { categories: [], currentDay: 0 }

    const today = new Date()
    const allDates = entries.map((e) => parseISO(e.solvedAt))
    const firstEverDate = allDates.reduce((min, d) => (d < min ? d : min))
    const currentDay = Math.max(1, differenceInDays(today, firstEverDate))

    const categoryFirstSolve: Record<string, Date> = {}
    for (const entry of entries) {
      const slug = entry.category
      if (!slug) continue
      const date = parseISO(entry.solvedAt)
      if (!categoryFirstSolve[slug] || date < categoryFirstSolve[slug]) {
        categoryFirstSolve[slug] = date
      }
    }

    const categories = Object.entries(categoryFirstSolve)
      .map(([slug, firstDate]) => {
        const cat          = CATEGORIES.find((c) => c.slug === slug)
        const daysUntilStart = differenceInDays(firstDate, firstEverDate)
        return {
          slug,
          title:         cat?.title ?? slug,
          accentColor:   cat?.accentColor ?? '#52525b',
          daysUntilStart,
          daysActive:    Math.max(0, currentDay - daysUntilStart),
        }
      })
      .sort((a, b) => a.daysUntilStart - b.daysUntilStart)

    return { categories, currentDay }
  }, [solvedProblems])
}
