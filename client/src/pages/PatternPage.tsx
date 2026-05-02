import React, { useState, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { useProblems } from '@/hooks/useProblems'
import { ProblemTable } from '@/components/problems/ProblemTable'
import type { ProblemSummary } from '@/types/problem'

type StatusFilter = 'all' | 'solved' | 'unsolved'

const applyStatusFilter = (
  problems: readonly ProblemSummary[],
  status: StatusFilter,
  solvedProblems: Record<string, unknown>,
): readonly ProblemSummary[] => {
  if (status === 'all') return problems
  if (status === 'solved') return problems.filter((p) => p.id in solvedProblems)
  return problems.filter((p) => !(p.id in solvedProblems))
}

const segmentClass = (isActive: boolean): string =>
  `px-3 py-1.5 text-sm capitalize transition-colors duration-150 cursor-pointer ${
    isActive ? 'bg-accent-blue/20 text-accent-blue' : 'text-text-secondary hover:text-text-primary'
  }`

export const PatternPage = (): React.JSX.Element => {
  const { tag }        = useParams<{ tag: string }>()
  const decodedTag     = tag ? decodeURIComponent(tag) : ''
  const [page, setPage]         = useState(1)
  const [status, setStatus]     = useState<StatusFilter>('all')
  const { solvedProblems }      = useProgress()

  if (!decodedTag) return <Navigate to="/patterns" replace />

  const apiFilters = useMemo(
    () => ({
      search: '', difficulty: 'all' as const, category: 'all' as const,
      type: 'all' as const, patternTag: decodedTag,
    }),
    [decodedTag],
  )

  const { problems, pagination, isLoading, error } = useProblems(apiFilters, page)

  const filtered = useMemo(
    () => applyStatusFilter(problems, status, solvedProblems),
    [problems, status, solvedProblems],
  )

  const solvedInPattern = problems.filter((p) => p.id in solvedProblems).length

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
          <p className="text-text-tertiary text-xs uppercase tracking-wide mb-1">Pattern</p>
          <h1 className="text-text-primary font-medium">{decodedTag}</h1>
        </div>
        {!isLoading && (
          <span className="text-text-secondary text-sm shrink-0 mt-1">
            <span className="text-accent-green font-medium">{solvedInPattern}</span>
            {' '}/ {pagination.total} solved
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 px-6 py-3 border-b border-border-default">
        <div className="flex items-center gap-1 bg-bg-tertiary border border-border-default rounded overflow-hidden">
          {(['all', 'solved', 'unsolved'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => { setStatus(s); setPage(1) }}
              className={segmentClass(status === s)}
            >
              {s}
            </button>
          ))}
        </div>
        <span className="ml-auto text-text-tertiary text-sm">{filtered.length} problems</span>
      </div>

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
          <span className="text-text-tertiary text-sm">{page} / {pagination.totalPages}</span>
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
