import { useMemo } from 'react'
import { useProgressStore } from '@/store/useProgressStore'
import { CATEGORIES } from '@/data/categories'

const getCategoryTitle = (slug: string): string =>
  CATEGORIES.find((c) => c.slug === slug)?.title ?? slug

type MasteryBucket = 'clean' | 'struggled' | 'grinded'

export interface CategoryMastery {
  readonly slug:      string
  readonly title:     string
  readonly clean:     number
  readonly struggled: number
  readonly grinded:   number
  readonly total:     number
}

export interface MasteryBreakdownResult {
  readonly clean:      number
  readonly struggled:  number
  readonly grinded:    number
  readonly total:      number
  readonly byCategory: readonly CategoryMastery[]
}

const classifyEntry = (attempts: number): MasteryBucket => {
  if (attempts <= 2) return 'clean'
  if (attempts <= 5) return 'struggled'
  return 'grinded'
}

const selectSolvedProblems = (
  state: ReturnType<typeof useProgressStore.getState>,
) => state.solvedProblems

export const useMasteryBreakdown = (): MasteryBreakdownResult => {
  const solvedProblems = useProgressStore(selectSolvedProblems)

  return useMemo((): MasteryBreakdownResult => {
    let clean = 0
    let struggled = 0
    let grinded = 0

    const categoryMap: Record<string, { clean: number; struggled: number; grinded: number; total: number }> = {}

    for (const entry of Object.values(solvedProblems)) {
      const bucket = classifyEntry(entry.attempts ?? 1)
      if (bucket === 'clean') clean++
      else if (bucket === 'struggled') struggled++
      else grinded++

      const slug = entry.category ?? 'uncategorized'
      if (!categoryMap[slug]) categoryMap[slug] = { clean: 0, struggled: 0, grinded: 0, total: 0 }
      categoryMap[slug][bucket]++
      categoryMap[slug].total++
    }

    const byCategory = Object.entries(categoryMap)
      .map(([slug, data]) => ({ slug, title: getCategoryTitle(slug), ...data }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)

    return { clean, struggled, grinded, total: clean + struggled + grinded, byCategory }
  }, [solvedProblems])
}
