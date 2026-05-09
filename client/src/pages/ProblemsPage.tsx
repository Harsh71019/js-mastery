import React, { useState, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { useProblems, type ProblemFilters } from '@/hooks/useProblems'
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
  type: 'coding',
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

export const ProblemsPage = (): React.JSX.Element => {
  const location = useLocation()
  const initialFilters = (location.state as any)?.filters ?? DEFAULT_FILTERS
  const [filters, setFilters] = useState<FilterState>(initialFilters)
  const [page, setPage] = useState(1)
  const { solvedProblems } = useProgress()

  const apiFilters: ProblemFilters = useMemo(
    () => ({
      search: filters.search,
      difficulty: filters.difficulty,
      category: filters.category,
      type: filters.type,
      collectionId: filters.collectionId === 'all' ? undefined : filters.collectionId,
    }),
    [filters.search, filters.difficulty, filters.category, filters.type, filters.collectionId],
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

  if (error) {
    return (
      <PageContainer className="flex items-center justify-center py-20">
        <div className="bg-accent-red/5 border border-accent-red/20 rounded-xl px-10 py-8 text-center backdrop-blur-md">
          <p className="text-accent-red font-bold font-geist uppercase tracking-widest text-xs mb-2">Registry Connection Error</p>
          <p className="text-text-tertiary text-[10px] font-medium uppercase tracking-tighter">Unable to initialize problem stream.</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex flex-col gap-8 relative pb-20">
      <Glow color="var(--color-accent-blue)" size="xl" className="-top-40 -right-20 opacity-[0.06]" />
      
      <div className="flex items-center justify-between px-1 relative z-10">
        <h1 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-geist opacity-60">Problem Repository Registry</h1>
        <div className="h-px bg-white/5 flex-1 mx-6" />
        <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist whitespace-nowrap">Total Nodes: {pagination.total}</span>
      </div>

      <div className="flex flex-col relative z-10">
        <div className="glass-panel rounded-t-xl border-b-0">
          <FilterBar
            filters={filters}
            resultCount={filters.status === 'all' ? pagination.total : filtered.length}
            onFiltersChange={handleFiltersChange}
            hideTypeFilter
          />
        </div>
        <ProblemTable problems={filtered} solvedProblems={solvedProblems} isLoading={isLoading} />
        
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between gap-4 py-4 px-6 glass-panel rounded-b-xl border-t-0 bg-white/[0.01]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/40 shadow-glow-sm" />
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
