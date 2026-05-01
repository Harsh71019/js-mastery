import React, { useState } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { getProblemsByCategory, CATEGORIES } from '@/data'
import { useProgress } from '@/hooks/useProgress'
import { FilterBar, type FilterState } from '@/components/problems/FilterBar'
import { ProblemTable } from '@/components/problems/ProblemTable'
import type { CategorySlug, Problem } from '@/types/problem'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  difficulty: 'all',
  category: 'all',
  status: 'all',
}

const applyFilters = (
  categoryProblems: readonly Problem[],
  filters: FilterState,
  solvedProblems: Record<string, unknown>,
): readonly Problem[] =>
  categoryProblems.filter((problem) => {
    if (
      filters.search &&
      !problem.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }
    if (filters.difficulty !== 'all' && problem.difficulty !== filters.difficulty) return false
    if (filters.status === 'solved' && !(problem.id in solvedProblems)) return false
    if (filters.status === 'unsolved' && problem.id in solvedProblems) return false
    return true
  })

export const CategoryPage = (): React.JSX.Element => {
  const { slug } = useParams<{ slug: string }>()
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const { solvedProblems, categoryProgress } = useProgress()

  const category = CATEGORIES.find((c) => c.slug === slug)
  if (!category) return <Navigate to="/problems" replace />

  const categoryProblems = getProblemsByCategory(slug as CategorySlug)
  const filtered = applyFilters(categoryProblems, filters, solvedProblems)
  const { solved, total } = categoryProgress(slug as CategorySlug)

  return (
    <div className="flex flex-col">
      <div className="flex items-start justify-between px-6 py-5 border-b border-border-default">
        <div>
          <h1 className="text-text-primary text-xl font-medium">{category.title}</h1>
          <p className="text-text-secondary text-sm mt-1">{category.description}</p>
        </div>
        <span className="text-text-secondary text-sm shrink-0 mt-1">
          <span className="text-accent-green font-medium">{solved}</span> / {total} solved
        </span>
      </div>

      <FilterBar
        filters={filters}
        resultCount={filtered.length}
        onFiltersChange={setFilters}
        hideCategoryFilter
      />
      <ProblemTable problems={filtered} solvedProblems={solvedProblems} />
    </div>
  )
}
