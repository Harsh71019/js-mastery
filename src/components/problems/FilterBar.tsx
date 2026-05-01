import React from 'react'
import type { Difficulty, CategorySlug } from '@/types/problem'
import { CATEGORIES } from '@/data/categories'

type StatusFilter = 'all' | 'solved' | 'unsolved'

export interface FilterState {
  readonly search: string
  readonly difficulty: Difficulty | 'all'
  readonly category: CategorySlug | 'all'
  readonly status: StatusFilter
}

interface FilterBarProps {
  readonly filters: FilterState
  readonly resultCount: number
  readonly onFiltersChange: (filters: FilterState) => void
  readonly hideCategoryFilter?: boolean
}

const DIFFICULTIES: readonly (Difficulty | 'all')[] = ['all', 'Beginner', 'Easy', 'Medium', 'Hard']

const inputClass =
  'bg-bg-tertiary border border-border-default text-text-primary text-sm rounded px-3 py-1.5 focus:outline-none focus:border-accent-blue transition-colors duration-150 placeholder:text-text-tertiary'

export const FilterBar = ({
  filters,
  resultCount,
  onFiltersChange,
  hideCategoryFilter = false,
}: FilterBarProps): React.JSX.Element => {
  const update = (partial: Partial<FilterState>): void =>
    onFiltersChange({ ...filters, ...partial })

  return (
    <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-border-default bg-bg-primary sticky top-0 z-10">
      <input
        type="text"
        placeholder="Search problems..."
        value={filters.search}
        onChange={(event) => update({ search: event.target.value })}
        className={`${inputClass} w-52`}
      />

      <select
        value={filters.difficulty}
        onChange={(event) => update({ difficulty: event.target.value as Difficulty | 'all' })}
        className={inputClass}
      >
        {DIFFICULTIES.map((difficulty) => (
          <option key={difficulty} value={difficulty}>
            {difficulty === 'all' ? 'All Difficulties' : difficulty}
          </option>
        ))}
      </select>

      {!hideCategoryFilter && (
        <select
          value={filters.category}
          onChange={(event) => update({ category: event.target.value as CategorySlug | 'all' })}
          className={inputClass}
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.title}
            </option>
          ))}
        </select>
      )}

      <div className="flex items-center gap-1 bg-bg-tertiary border border-border-default rounded overflow-hidden">
        {(['all', 'solved', 'unsolved'] as const).map((statusOption) => (
          <button
            key={statusOption}
            type="button"
            onClick={() => update({ status: statusOption })}
            className={`px-3 py-1.5 text-sm capitalize transition-colors duration-150 cursor-pointer ${
              filters.status === statusOption
                ? 'bg-accent-blue/20 text-accent-blue'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {statusOption}
          </button>
        ))}
      </div>

      <span className="ml-auto text-text-tertiary text-sm">{resultCount} problems</span>
    </div>
  )
}
