import React, { useState, useMemo, useEffect } from 'react'
import { useProgress } from '@/hooks/useProgress'
import { useProblems } from '@/hooks/useProblems'
import { FilterBar, type FilterState } from '@/components/problems/FilterBar'
import { ProblemTable } from '@/components/problems/ProblemTable'
import { PageContainer } from '@/components/ui/PageContainer'
import { Tabs } from '@/components/ui/Tabs'
import { Glow } from '@/components/ui/Glow'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/progress/StatCard'
import type { ProblemSummary } from '@/types/problem'

interface QuizStatsData {
  totalQuizzes: number
  totalMcq: number
  totalTrick: number
  userSolved: number
  userSolvedMcq: number
  userSolvedTrick: number
  completionRate: number
  averageAttempts: number
  byDifficulty: {
    Beginner: { total: number; solved: number }
    Easy: { total: number; solved: number }
    Medium: { total: number; solved: number }
    Hard: { total: number; solved: number }
  }
}

type QuizType = 'all' | 'mcq' | 'trick'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  difficulty: 'all',
  category: 'all',
  collectionId: 'all',
  status: 'all',
  type: 'all',
}

const QUIZ_TABS: readonly { readonly value: QuizType; readonly label: string }[] = [
  { value: 'all',   label: 'ALL_INTEL' },
  { value: 'mcq',   label: 'MCQ_SEQUENCE' },
  { value: 'trick', label: 'TRICK_ANOMALIES' },
]

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
  const [stats, setStats] = useState<QuizStatsData | null>(null)
  const { solvedProblems } = useProgress()

  useEffect(() => {
    fetch('/api/problems/quiz/stats')
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          setStats(res.data)
        }
      })
      .catch((err) => console.error('Failed to fetch quiz stats:', err))
  }, [solvedProblems])

  const apiFilters = useMemo(
    () => ({
      search: filters.search,
      difficulty: filters.difficulty,
      category: filters.category,
      type: quizType === 'all' ? ('quiz' as const) : quizType,
      collectionId: filters.collectionId === 'all' ? undefined : filters.collectionId,
    }),
    [filters.search, filters.difficulty, filters.category, quizType, filters.collectionId],
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
      <PageContainer className="flex items-center justify-center py-20">
        <div className="bg-accent-purple/5 border border-accent-purple/20 rounded-xl px-10 py-8 text-center backdrop-blur-md">
          <p className="text-accent-purple font-bold font-geist uppercase tracking-widest text-xs mb-2">Quiz Database Offline</p>
          <p className="text-text-tertiary text-[10px] font-medium uppercase tracking-tighter">Unable to initialize intelligence stream.</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex flex-col gap-10 relative pb-20">
      <Glow color="var(--color-accent-purple)" size="xl" className="-top-40 -left-20 opacity-[0.06]" />

      <div className="flex items-center justify-between px-1 relative z-10">
        <h1 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-geist opacity-60">Intelligence Assessment Hub</h1>
        <div className="h-px bg-white/5 flex-1 mx-6" />
        <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist whitespace-nowrap">Session: Quiz_Mode</span>
      </div>

      {stats && (
        <div className="flex flex-col gap-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              label="Assessment Pool"
              value={`${stats.totalQuizzes}`}
              accentColor="var(--color-accent-purple)"
            />
            <StatCard
              label="Solved Quizzes"
              value={`${stats.userSolved} (${stats.completionRate}%)`}
              accentColor="var(--color-accent-blue)"
            />
            <StatCard
              label="MCQ Sequence"
              value={`${stats.userSolvedMcq} / ${stats.totalMcq}`}
              accentColor="var(--color-accent-green)"
            />
            <StatCard
              label="Trick Anomalies"
              value={`${stats.userSolvedTrick} / ${stats.totalTrick}`}
              accentColor="var(--color-accent-amber)"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 glass-panel px-4 py-2.5 rounded-xl border border-white/5 text-[11px] font-geist text-text-secondary">
            <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-wider">Difficulty Breakdown:</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              <span>Easy: <strong className="text-text-primary">{stats.byDifficulty.Easy.solved}</strong>/{stats.byDifficulty.Easy.total}</span>
            </div>
            <span className="text-white/10">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-amber" />
              <span>Medium: <strong className="text-text-primary">{stats.byDifficulty.Medium.solved}</strong>/{stats.byDifficulty.Medium.total}</span>
            </div>
            <span className="text-white/10">•</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-red" />
              <span>Hard: <strong className="text-text-primary">{stats.byDifficulty.Hard.solved}</strong>/{stats.byDifficulty.Hard.total}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-col gap-8 relative z-10">
        <Tabs
          options={QUIZ_TABS}
          activeValue={quizType}
          onChange={(v) => handleQuizTypeChange(v as QuizType)}
          className="bg-white/[0.02] border-white/5"
        />
        
        <div className="flex flex-col">
          <div className="glass-panel rounded-t-xl border-b-0">
            <FilterBar
              filters={filters}
              resultCount={filters.status === 'all' ? pagination.total : filtered.length}
              onFiltersChange={handleFiltersChange}
              hideTypeFilter
            />
          </div>
          <ProblemTable
            problems={filtered}
            solvedProblems={solvedProblems}
            isLoading={isLoading}
            startIndex={(page - 1) * (pagination?.limit || 50)}
          />
          
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between gap-2 sm:gap-4 py-3.5 px-4 sm:px-6 glass-panel rounded-b-xl border-t-0 bg-white/[0.01]">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-purple/40 shadow-glow-sm" />
                <span className="text-[10px] font-bold text-text-tertiary font-geist uppercase tracking-widest">
                  Page {page} of {pagination.totalPages}
                </span>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="font-geist text-[10px] uppercase tracking-widest px-2.5 sm:px-4"
                >
                  <span className="sm:hidden">← Prev</span>
                  <span className="hidden sm:inline">PREV_DATA</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={page === pagination.totalPages}
                  className="font-geist text-[10px] uppercase tracking-widest px-2.5 sm:px-4"
                >
                  <span className="sm:hidden">Next →</span>
                  <span className="hidden sm:inline">NEXT_DATA</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
