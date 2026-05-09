import React, { useState, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { useProblems } from '@/hooks/useProblems'
import { FilterBar, type FilterState } from '@/components/problems/FilterBar'
import { ProblemTable } from '@/components/problems/ProblemTable'
import { PageContainer } from '@/components/ui/PageContainer'
import { Glow } from '@/components/ui/Glow'
import { CATEGORIES } from '@/data/categories'

const DEFAULT_FILTERS: FilterState = {
  search: '',
  difficulty: 'all',
  category: 'all',
  collectionId: 'all',
  status: 'all',
  type: 'all',
}

export const CategoryPage = (): React.JSX.Element => {
  const { slug } = useParams<{ slug: string }>()
  const category = CATEGORIES.find((c) => c.slug === slug)
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const { solvedProblems } = useProgress()

  const apiFilters = useMemo(
    () => ({
      search: filters.search,
      difficulty: filters.difficulty,
      category: slug as any,
      type: filters.type,
    }),
    [filters.search, filters.difficulty, slug, filters.type],
  )

  const { problems, isLoading, error } = useProblems(apiFilters)

  const filtered = useMemo(() => {
    if (filters.status === 'all') return problems
    if (filters.status === 'solved') return problems.filter((p) => p.id in solvedProblems)
    return problems.filter((p) => !(p.id in solvedProblems))
  }, [problems, filters.status, solvedProblems])

  const handleFiltersChange = (next: FilterState): void => {
    setFilters(next)
  }

  if (!category) return <Navigate to="/" replace />

  if (error) {
    return (
      <PageContainer className="flex items-center justify-center py-20">
        <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-xl px-10 py-8 text-center backdrop-blur-md">
          <p className="text-accent-blue font-bold font-geist uppercase tracking-widest text-xs mb-2">Sector Offline</p>
          <p className="text-text-tertiary text-[10px] font-medium uppercase tracking-tighter">Unable to initialize intelligence sector: {slug}</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex flex-col gap-10 relative pb-20">
      <Glow color={category.accentColor} size="xl" className="-top-40 -right-20 opacity-[0.06]" />

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span 
            className="text-[10px] font-bold uppercase tracking-[0.4em] font-geist opacity-60 px-2 py-0.5 rounded border"
            style={{ color: category.accentColor, borderColor: `${category.accentColor}44`, backgroundColor: `${category.accentColor}11` }}
          >
            Intelligence Sector
          </span>
        </div>
        <div className="flex items-end justify-between">
          <h1 className="text-text-primary text-4xl font-bold font-geist tracking-tighter uppercase">{category.title}</h1>
          <span className="text-[10px] font-bold text-text-tertiary uppercase font-geist mb-2">Active Nodes: {problems.length}</span>
        </div>
        <p className="text-text-tertiary text-base max-w-2xl leading-relaxed font-medium">
          {category.description}
        </p>
      </div>

      <div className="flex flex-col relative z-10">
        <div className="glass-panel rounded-xl overflow-hidden border-white/5 shadow-sm">
          <FilterBar
            filters={filters}
            resultCount={filtered.length}
            onFiltersChange={handleFiltersChange}
            hideCategoryFilter
          />
          <ProblemTable problems={filtered} solvedProblems={solvedProblems} isLoading={isLoading} />
        </div>
      </div>
    </PageContainer>
  )
}
