import React, { useState, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { useProblems } from '@/hooks/useProblems'
import { FilterBar, type FilterState } from '@/components/problems/FilterBar'
import { ProblemTable } from '@/components/problems/ProblemTable'
import { PageContainer } from '@/components/ui/PageContainer'
import { Glow } from '@/components/ui/Glow'
import { Button } from '@/components/ui/Button'
import type { ProblemSummary } from '@/types/problem'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  difficulty: 'all',
  category: 'all',
  collectionId: 'all',
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

export const PatternPage = (): React.JSX.Element => {
  const { tag } = useParams<{ tag: string }>()
  const decodedTag = tag ? decodeURIComponent(tag) : ''
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)
  const { solvedProblems } = useProgress()

  const apiFilters = useMemo(
    () => ({
      search: filters.search,
      difficulty: filters.difficulty,
      category: filters.category,
      type: filters.type,
      collectionId: filters.collectionId === 'all' ? undefined : filters.collectionId,
      patternTag: decodedTag,
    }),
    [filters.search, filters.difficulty, filters.category, filters.type, filters.collectionId, decodedTag],
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

  if (!decodedTag) return <Navigate to="/patterns" replace />

  if (error) {
    return (
      <PageContainer className="flex items-center justify-center py-20">
        <div className="bg-accent-amber/5 border border-accent-amber/20 rounded-xl px-10 py-8 text-center backdrop-blur-md">
          <p className="text-accent-amber font-bold font-geist uppercase tracking-widest text-xs mb-2">Pattern Offline</p>
          <p className="text-text-tertiary text-[10px] font-medium uppercase tracking-tighter">Unable to initialize logic archetype: {decodedTag}</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex flex-col gap-10 relative pb-20">
      <Glow color="var(--color-accent-amber)" size="xl" className="-top-40 -right-20 opacity-[0.06]" />

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span 
            className="text-[10px] font-bold uppercase tracking-[0.4em] font-geist opacity-60 px-2 py-0.5 rounded border border-accent-amber/20 bg-accent-amber/5 text-accent-amber"
          >
            Logic Pattern Archetype
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h1 className="text-text-primary text-4xl font-bold font-geist tracking-tighter uppercase">{decodedTag}</h1>
          <span className="text-[10px] font-bold text-text-tertiary uppercase font-geist mb-2">
            Active Nodes: {pagination.total}
          </span>
        </div>
      </div>

      <div className="flex flex-col relative z-10">
        <div className="glass-panel rounded-t-xl border-b-0">
          <FilterBar
            filters={filters}
            resultCount={filters.status === 'all' ? pagination.total : filtered.length}
            onFiltersChange={handleFiltersChange}
          />
        </div>
        <ProblemTable problems={filtered} solvedProblems={solvedProblems} isLoading={isLoading} />
        
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 py-4 px-6 glass-panel rounded-b-xl border-t-0 bg-white/[0.01]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber/40 shadow-glow-sm" />
              <span className="text-[10px] font-bold text-text-tertiary font-geist uppercase tracking-widest">
                Sector {page} of {pagination.totalPages}
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="font-geist text-[10px] uppercase tracking-widest px-4"
              >
                PREV_SECTOR
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
                className="font-geist text-[10px] uppercase tracking-widest px-4"
              >
                NEXT_SECTOR
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
