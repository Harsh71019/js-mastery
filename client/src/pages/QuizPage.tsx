import React, { useState, useMemo } from 'react'
import { useProgress } from '@/hooks/useProgress'
import { useProblems } from '@/hooks/useProblems'
import { FilterBar, type FilterState } from '@/components/problems/FilterBar'
import { ProblemTable } from '@/components/problems/ProblemTable'
import type { ProblemSummary } from '@/types/problem'

type QuizType = 'all' | 'mcq' | 'trick'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  difficulty: 'all',
  category: 'all',
  status: 'all',
  type: 'all',
}

const QUIZ_TABS: readonly { readonly value: QuizType; readonly label: string }[] = [
  { value: 'all',   label: 'All' },
  { value: 'mcq',   label: 'MCQ' },
  { value: 'trick', label: 'Trick' },
]

const tabClass = (isActive: boolean): string =>
  `px-4 py-2 text-sm font-medium transition-colors duration-150 cursor-pointer border-b-2 ${
    isActive
      ? 'text-text-primary border-accent-blue'
      : 'text-text-secondary border-transparent hover:text-text-primary'
  }`

const applyStatusFilter = (
  problems: readonly ProblemSummary[],
  status: FilterState['status'],
  solvedProblems: Record<string, unknown>,
): readonly ProblemSummary[] => {
  if (status === 'all') return problems
  if (status === 'solved') return problems.filter((p) => p.id in solvedProblems)
  return problems.filter((p) => !(p.id in solvedProblems))
}

export const QuizPage = (): React.JSX.Element => {
  const [quizType, setQuizType] = useState<QuizType>('all')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const { solvedProblems } = useProgress()

  const apiFilters = useMemo(
    () => ({
      search: filters.search,
      difficulty: filters.difficulty,
      category: filters.category,
      type: quizType === 'all' ? ('quiz' as const) : quizType,
    }),
    [filters.search, filters.difficulty, filters.category, quizType],
  )

  const { problems, pagination, isLoading, error } = useProblems(apiFilters, page)

  const filtered = useMemo(
    () => applyStatusFilter(problems, filters.status, solvedProblems),
    [problems, filters.status, solvedProblems],
  )

  const handleFiltersChange = (next: FilterState): void => {
    setFilters(next)
    setPage(1)
  }

  const handleQuizTypeChange = (type: QuizType): void => {
    setQuizType(type)
    setPage(1)
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-text-tertiary text-sm">
        Failed to load quiz — is the server running?
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1 px-6 border-b border-border-default bg-bg-primary">
        {QUIZ_TABS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleQuizTypeChange(tab.value)}
            className={tabClass(quizType === tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <FilterBar
        filters={filters}
        resultCount={filters.status === 'all' ? pagination.total : filtered.length}
        onFiltersChange={handleFiltersChange}
        hideTypeFilter
      />
      <ProblemTable problems={filtered} solvedProblems={solvedProblems} isLoading={isLoading} />
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-4 border-t border-border-default">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150"
          >
            Prev
          </button>
          <span className="text-text-tertiary text-sm">
            {page} / {pagination.totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded hover:border-border-hover disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors duration-150"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
