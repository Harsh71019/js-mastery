import { useMemo } from 'react'
import { useProgressStore } from '@/store/useProgressStore'
import { useProblemCounts } from '@/hooks/useProblemCounts'
import { CATEGORIES } from '@/data/categories'

const DIFFICULTY_WEIGHT: Record<string, number> = {
  Beginner: 0.25,
  Easy:     0.5,
  Medium:   0.75,
  Hard:     1.0,
}

export type FluencyTier = 'Novice' | 'Learning' | 'Proficient' | 'Advanced' | 'Fluent'

export interface CategoryFluency {
  readonly slug:          string
  readonly title:         string
  readonly accentColor:   string
  readonly score:         number
  readonly tier:          FluencyTier
  readonly solvedCount:   number
  readonly totalCount:    number
  readonly avgAttempts:   number
  readonly avgDifficulty: number
  readonly isStarted:     boolean
}

export interface FluencyResult {
  readonly fluencies:    readonly CategoryFluency[]
  readonly overallScore: number
  readonly overallTier:  FluencyTier
}

const toTier = (score: number): FluencyTier => {
  if (score >= 85) return 'Fluent'
  if (score >= 70) return 'Advanced'
  if (score >= 50) return 'Proficient'
  if (score >= 25) return 'Learning'
  return 'Novice'
}

const selectSolvedProblems = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.solvedProblems

export const useFluency = (): FluencyResult => {
  const solvedProblems = useProgressStore(selectSolvedProblems)
  const { byCategory } = useProblemCounts()

  const fluencies = useMemo((): readonly CategoryFluency[] => {
    return CATEGORIES.map((cat) => {
      const totalCount = byCategory[cat.slug] ?? 0
      const entries = Object.entries(solvedProblems)
        .filter(([id, e]) => e.category === cat.slug || (!e.category && id.startsWith(cat.slug)))
        .map(([, e]) => e)

      const solvedCount = entries.length

      if (solvedCount === 0 || totalCount === 0) {
        return { slug: cat.slug, title: cat.title, accentColor: cat.accentColor, score: 0, tier: 'Novice', solvedCount: 0, totalCount, avgAttempts: 0, avgDifficulty: 0, isStarted: false }
      }

      const solveRatio     = Math.min(1, solvedCount / totalCount)
      const avgDifficulty  = entries.reduce((s, e) => s + (DIFFICULTY_WEIGHT[e.difficulty ?? 'Easy'] ?? 0.5), 0) / solvedCount
      const avgAttempts    = entries.reduce((s, e) => s + (e.attempts ?? 1), 0) / solvedCount
      const efficiency     = 1 / (1 + Math.max(0, avgAttempts - 1) * 0.5)
      const score          = Math.min(100, Math.round(solveRatio * 60 + avgDifficulty * 25 + efficiency * 15))

      return {
        slug:          cat.slug,
        title:         cat.title,
        accentColor:   cat.accentColor,
        score,
        tier:          toTier(score),
        solvedCount,
        totalCount,
        avgAttempts:   Math.round(avgAttempts * 10) / 10,
        avgDifficulty: Math.round(avgDifficulty * 100),
        isStarted:     true,
      }
    }).sort((a, b) => b.score - a.score)
  }, [solvedProblems, byCategory])

  const overallScore = useMemo(() => {
    const started = fluencies.filter((f) => f.isStarted)
    if (started.length === 0) return 0
    return Math.round(started.reduce((s, f) => s + f.score, 0) / started.length)
  }, [fluencies])

  return { fluencies, overallScore, overallTier: toTier(overallScore) }
}
