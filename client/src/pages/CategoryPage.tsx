import React, { useState, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { CATEGORIES } from '@/data'
import { useProgress } from '@/hooks/useProgress'
import { useProblems } from '@/hooks/useProblems'
import { useProblemCounts } from '@/hooks/useProblemCounts'
import { FilterBar, type FilterState } from '@/components/problems/FilterBar'
import { ProblemTable } from '@/components/problems/ProblemTable'
import type { CategorySlug, ProblemSummary } from '@/types/problem'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  difficulty: 'all',
  category: 'all',
  status: 'all',
  type: 'all',
}

const applyStatusFilter = (
  problems: readonly ProblemSummary[],
  status: FilterState['status'],
  solvedProblems: Record<string, unknown>,
): readonly ProblemSummary[] => {
  if (status === 'all') return problems
  if (status === 'solved') return problems.filter((p) => p.id in solvedProblems)
  return problems.filter((p) => !(p.id in solvedProblems))
}

export const CategoryPage = (): React.JSX.Element => {
  const { slug } = useParams<{ slug: string }>()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const { solvedProblems } = useProgress()
  const { byCategory } = useProblemCounts()

  const category = CATEGORIES.find((c) => c.slug === slug)
  if (!category) return <Navigate to="/problems" replace />

  const { problems, isLoading, error } = useProblems(
    { search: filters.search, difficulty: filters.difficulty, category: slug as CategorySlug, type: filters.type },
    page,
  )

  const filtered = useMemo(
    () => applyStatusFilter(problems, filters.status, solvedProblems),
    [problems, filters.status, solvedProblems],
  )

  const total = byCategory[slug ?? ''] ?? 0
  const categorySolved = Object.keys(solvedProblems).filter((id) =>
    id.startsWith(slug ?? ''),
  ).length

  const handleFiltersChange = (next: FilterState): void => {
    setFilters(next)
    setPage(1)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-text-tertiary text-sm">
        Failed to load problems — is the server running?
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between px-6 py-5 border-b border-border-default">
        <div>
          <h1 className="text-text-primary text-xl font-medium">{category.title}</h1>
          <p className="text-text-secondary text-sm mt-1">{category.description}</p>
        </div>
        <span className="text-text-secondary text-sm shrink-0 mt-1">
          <span className="text-accent-green font-medium">{categorySolved}</span> / {total} solved
        </span>
      </div>

      <FilterBar
        filters={filters}
        resultCount={filtered.length}
        onFiltersChange={handleFiltersChange}
        hideCategoryFilter
      />
      <ProblemTable problems={filtered} solvedProblems={solvedProblems} isLoading={isLoading} />
    </div>
  )
}
