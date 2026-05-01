import React, { useState } from 'react'
import { problems } from '@/data'
import { useProgress } from '@/hooks/useProgress'
import { FilterBar, type FilterState } from '@/components/problems/FilterBar'
import { ProblemTable } from '@/components/problems/ProblemTable'
import type { Problem } from '@/types/problem'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  difficulty: 'all',
  category: 'all',
  status: 'all',
}

const applyFilters = (
  allProblems: readonly Problem[],
  filters: FilterState,
  solvedProblems: Record<string, unknown>,
): readonly Problem[] =>
  allProblems.filter((problem) => {
    if (
      filters.search &&
      !problem.title.toLowerCase().includes(filters.search.toLowerCase())
    ) {
      return false
    }
    if (filters.difficulty !== 'all' && problem.difficulty !== filters.difficulty) return false
    if (filters.category !== 'all' && problem.category !== filters.category) return false
    if (filters.status === 'solved' && !(problem.id in solvedProblems)) return false
    if (filters.status === 'unsolved' && problem.id in solvedProblems) return false
    return true
  })

export const ProblemsPage = (): React.JSX.Element => {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const { solvedProblems } = useProgress()

  const filtered = applyFilters(problems, filters, solvedProblems)

  return (
    <div className="flex flex-col">
      <FilterBar
        filters={filters}
        resultCount={filtered.length}
        onFiltersChange={setFilters}
      />
      <ProblemTable problems={filtered} solvedProblems={solvedProblems} />
    </div>
  )
}
