import { useState, useEffect } from 'react'
import { CATEGORIES } from '@/data/categories'

export interface CategoryRevisitEntry {
  readonly slug:        string
  readonly title:       string
  readonly accentColor: string
  readonly totalVisits: number
  readonly solvedVisits: number
  readonly ratio:       number
}

export interface RevisitRateResult {
  readonly categories: readonly CategoryRevisitEntry[]
  readonly isLoading:  boolean
  readonly error:      string | null
}

interface StatsResponse {
  byCategory: Record<string, { totalVisits: number; solvedVisits: number; ratio: number }>
}

const getCategoryMeta = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)

export const useRevisitRate = (): RevisitRateResult => {
  const [state, setState] = useState<RevisitRateResult>({
    categories: [],
    isLoading:  true,
    error:      null,
  })

  useEffect(() => {
    const controller = new AbortController()

    fetch('/api/visits/stats', { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Server error: ${r.status}`)
        return r.json() as Promise<StatsResponse>
      })
      .then(({ byCategory }) => {
        const categories: CategoryRevisitEntry[] = Object.entries(byCategory)
          .map(([slug, data]) => {
            const meta = getCategoryMeta(slug)
            return {
              slug,
              title:        meta?.title ?? slug,
              accentColor:  meta?.accentColor ?? '#52525b',
              totalVisits:  data.totalVisits,
              solvedVisits: data.solvedVisits,
              ratio:        data.ratio,
            }
          })
          .sort((a, b) => b.ratio - a.ratio)

        setState({ categories, isLoading: false, error: null })
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') return
        setState({
          categories: [],
          isLoading:  false,
          error:      err instanceof Error ? err.message : 'Failed to load revisit data',
        })
      })

    return () => controller.abort()
  }, [])

  return state
}
