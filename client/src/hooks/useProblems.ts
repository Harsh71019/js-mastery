import { useState, useEffect } from 'react'
import type { ProblemSummary, Pagination, Difficulty, CategorySlug, ProblemType } from '@/types/problem'

export interface ProblemFilters {
  readonly search:      string
  readonly difficulty:  Difficulty | 'all'
  readonly category:    CategorySlug | 'all'
  readonly type:        ProblemType | 'all' | 'quiz'
  readonly patternTag?: string
  readonly collectionId?: string
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
  if (filters.search)                         params.set('search', filters.search)
  if (filters.difficulty !== 'all')           params.set('difficulty', filters.difficulty)
  if (filters.category !== 'all')             params.set('category', filters.category)
  if (filters.type && filters.type !== 'all') params.set('type', filters.type)
  if (filters.patternTag)                     params.set('patternTag', filters.patternTag)
  if (filters.collectionId)                   params.set('collectionId', filters.collectionId)
  return params.toString()
}

export const useProblems = (filters: ProblemFilters, page = 1): UseProblemsResult => {
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
        return response.json() as Promise<{ success: boolean; data: ProblemSummary[]; pagination: Pagination }>
      })
      .then(({ data, pagination }) => {
        if (cancelled) return
        setProblems(data)
        setPagination(pagination)
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Failed to load problems')
        setIsLoading(false)
      })

    return () => { cancelled = true }
  }, [filters.search, filters.difficulty, filters.category, filters.type, filters.patternTag, filters.collectionId, page])

  return { problems, pagination, isLoading, error }
}
