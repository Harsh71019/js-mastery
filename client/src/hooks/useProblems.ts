import { useState, useEffect } from 'react'
import type { ProblemSummary, Pagination, Difficulty, CategorySlug } from '@/types/problem'

export interface ProblemFilters {
  readonly search: string
  readonly difficulty: Difficulty | 'all'
  readonly category: CategorySlug | 'all'
}

interface UseProblemsResult {
  readonly problems: readonly ProblemSummary[]
  readonly pagination: Pagination
  readonly isLoading: boolean
  readonly error: string | null
}

const DEFAULT_PAGINATION: Pagination = { page: 1, limit: 20, total: 0, totalPages: 0 }

const buildQuery = (filters: ProblemFilters, page: number): string => {
  const params = new URLSearchParams({ page: String(page), limit: '20' })
  if (filters.search) params.set('search', filters.search)
  if (filters.difficulty !== 'all') params.set('difficulty', filters.difficulty)
  if (filters.category !== 'all') params.set('category', filters.category)
  return params.toString()
}

export const useProblems = (filters: ProblemFilters, page: number): UseProblemsResult => {
  const [problems, setProblems] = useState<readonly ProblemSummary[]>([])
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)

    fetch(`/api/problems?${buildQuery(filters, page)}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Server error: ${response.status}`)
        return response.json() as Promise<{ problems: ProblemSummary[]; pagination: Pagination }>
      })
      .then((data) => {
        if (cancelled) return
        setProblems(data.problems)
        setPagination(data.pagination)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load problems')
        setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [filters.search, filters.difficulty, filters.category, page])

  return { problems, pagination, isLoading, error }
}
