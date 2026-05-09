import React from 'react'
import { Search } from 'lucide-react'
import type { Difficulty, CategorySlug, ProblemType } from '@/types/problem'
import { CATEGORIES } from '@/data/categories'
import { Input } from '@/components/ui/Input'
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
  `px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-200 cursor-pointer ${
    isActive ? 'bg-accent-blue text-white shadow-sm' : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
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

  return (
    <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-border-default bg-bg-primary sticky top-0 z-10">
      <Input
        placeholder="Search problems..."
        value={filters.search}
        onChange={(event) => update({ search: event.target.value })}
        icon={<Search size={14} />}
        className="w-56"
      />

      <Select
        value={filters.difficulty}
        onChange={(event) => update({ difficulty: event.target.value as Difficulty | 'all' })}
        options={DIFFICULTIES}
      />

      <Select
        value={filters.collectionId}
        onChange={(event) => update({ collectionId: event.target.value })}
        options={COLLECTIONS}
      />

      {!hideCategoryFilter && (
        <Select
          value={filters.category}
          onChange={(event) => update({ category: event.target.value as CategorySlug | 'all' })}
          options={CATEGORY_OPTIONS}
        />
      )}

      {!hideTypeFilter && (
        <div className="flex items-center p-1 bg-bg-tertiary border border-border-default rounded-lg">
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

      <div className="flex items-center p-1 bg-bg-tertiary border border-border-default rounded-lg">
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

      <span className="ml-auto text-text-tertiary text-xs font-medium bg-bg-tertiary px-2 py-1 rounded border border-border-default">
        {resultCount} problems
      </span>
    </div>
  )
}
