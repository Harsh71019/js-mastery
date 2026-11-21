import React from 'react'
import { Search, X, RotateCcw } from 'lucide-react'
import type { Difficulty, CategorySlug, ProblemType } from '@/types/problem'
import { CATEGORIES } from '@/data/categories'
import { Select } from '@/components/ui/Select'

type StatusFilter = 'all' | 'solved' | 'unsolved'

export interface FilterState {
  readonly search: string
  readonly difficulty: Difficulty | 'all'
  readonly category: CategorySlug | 'all'
  readonly collectionId: string | 'all'
  readonly status: StatusFilter
  readonly type: ProblemType | 'all'
}

interface FilterBarProps {
  readonly filters: FilterState
  readonly resultCount: number
  readonly onFiltersChange: (filters: FilterState) => void
  readonly hideCategoryFilter?: boolean
  readonly hideTypeFilter?: boolean
}

const DIFFICULTIES = [
  { value: 'all', label: 'All Difficulties' },
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
]

const COLLECTIONS = [
  { value: 'all', label: 'All Collections' },
  { value: 'blind75', label: 'Blind 75' },
  { value: 'js-pro-mastery', label: 'JS Pro Mastery' },
]

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  ...CATEGORIES.map((c) => ({ value: c.slug, label: c.title })),
]

const TYPES: readonly (ProblemType | 'all')[] = ['all', 'coding', 'mcq', 'trick']

const segmentClass = (isActive: boolean): string =>
  `px-3 py-1.5 text-xs font-semibold uppercase tracking-wider font-geist transition-all duration-200 cursor-pointer ${
    isActive 
      ? 'bg-accent-blue text-white shadow-[0_0_12px_rgba(59,130,246,0.35)]' 
      : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
  }`

export const FilterBar = ({
  filters,
  resultCount,
  onFiltersChange,
  hideCategoryFilter = false,
  hideTypeFilter = false,
}: FilterBarProps): React.JSX.Element => {
  const update = (partial: Partial<FilterState>): void =>
    onFiltersChange({ ...filters, ...partial })

  const isFiltered = Boolean(
    filters.search || 
    filters.difficulty !== 'all' || 
    filters.category !== 'all' || 
    filters.collectionId !== 'all' || 
    filters.status !== 'all' || 
    (filters.type !== 'all' && filters.type !== 'coding')
  )

  const handleReset = () => {
    onFiltersChange({
      search: '',
      difficulty: 'all',
      category: 'all',
      collectionId: 'all',
      status: 'all',
      type: 'coding',
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-4 border-b border-white/[0.08] bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-10">
      {/* Search Input with Clear Button */}
      <div className="relative w-full sm:w-64">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
          <Search size={14} />
        </div>
        <input
          type="text"
          placeholder="Search problems..."
          value={filters.search}
          onChange={(event) => update({ search: event.target.value })}
          className="w-full bg-white/[0.04] border border-white/10 text-text-primary text-xs font-geist rounded-lg pl-9 pr-8 py-2 focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/40 transition-all placeholder:text-text-tertiary"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => update({ search: '' })}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-white p-0.5 cursor-pointer"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Difficulty Select */}
      <Select
        value={filters.difficulty}
        onChange={(event) => update({ difficulty: event.target.value as Difficulty | 'all' })}
        options={DIFFICULTIES}
        className="text-xs font-geist py-2 bg-white/[0.04] border-white/10"
      />

      {/* Collection Select */}
      <Select
        value={filters.collectionId}
        onChange={(event) => update({ collectionId: event.target.value })}
        options={COLLECTIONS}
        className="text-xs font-geist py-2 bg-white/[0.04] border-white/10"
      />

      {/* Category Select */}
      {!hideCategoryFilter && (
        <Select
          value={filters.category}
          onChange={(event) => update({ category: event.target.value as CategorySlug | 'all' })}
          options={CATEGORY_OPTIONS}
          className="text-xs font-geist py-2 bg-white/[0.04] border-white/10"
        />
      )}

      {/* Status Filter */}
      <div className="flex items-center p-0.5 bg-white/[0.04] border border-white/10 rounded-lg">
        {(['all', 'solved', 'unsolved'] as const).map((statusOption) => (
          <button
            key={statusOption}
            type="button"
            onClick={() => update({ status: statusOption })}
            className={`${segmentClass(filters.status === statusOption)} rounded-md`}
          >
            {statusOption}
          </button>
        ))}
      </div>

      {/* Type Filter */}
      {!hideTypeFilter && (
        <div className="flex items-center p-0.5 bg-white/[0.04] border border-white/10 rounded-lg">
          {TYPES.map((typeOption) => (
            <button
              key={typeOption}
              type="button"
              onClick={() => update({ type: typeOption })}
              className={`${segmentClass(filters.type === typeOption)} rounded-md`}
            >
              {typeOption === 'all' ? 'All' : typeOption.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Reset Filter Button */}
      {isFiltered && (
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-text-tertiary hover:text-white hover:bg-white/5 text-xs font-geist transition-colors border border-dashed border-white/10 cursor-pointer"
          title="Reset all filters"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      )}

      <div className="ml-auto flex items-center gap-2">
        <span className="text-text-tertiary text-[11px] font-bold font-geist px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10">
          <span className="text-white">{resultCount}</span> Problems
        </span>
      </div>
    </div>
  )
}
