import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DifficultyBadge } from '@/components/ui/Badge'
import type { Problem } from '@/types/problem'
import { CATEGORIES } from '@/data/categories'

interface TopBarProps {
  readonly problem: Problem
  readonly onPrev: () => void
  readonly onNext: () => void
  readonly canGoPrev: boolean
  readonly canGoNext: boolean
}

export const TopBar = ({
  problem,
  onPrev,
  onNext,
  canGoPrev,
  canGoNext,
}: TopBarProps): React.JSX.Element => {
  const navigate = useNavigate()
  const categoryTitle =
    CATEGORIES.find((c) => c.slug === problem.category)?.title ?? problem.category

  return (
    <div className="h-12 flex items-center px-4 border-b border-border-default bg-bg-primary gap-4 shrink-0">
      <div className="flex items-center gap-1 text-sm text-text-secondary min-w-0 flex-1">
        <button
          type="button"
          onClick={() => navigate('/problems')}
          className="hover:text-text-primary transition-colors duration-150 cursor-pointer shrink-0"
        >
          Problems
        </button>
        <span className="shrink-0">/</span>
        <button
          type="button"
          onClick={() => navigate(`/category/${problem.category}`)}
          className="hover:text-text-primary transition-colors duration-150 cursor-pointer shrink-0"
        >
          {categoryTitle}
        </button>
        <span className="shrink-0">/</span>
        <span className="text-text-primary truncate">{problem.title}</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <DifficultyBadge difficulty={problem.difficulty} />
        <span className="text-text-tertiary text-xs bg-bg-tertiary border border-border-default rounded px-2 py-0.5">
          {problem.patternTag}
        </span>
      </div>

      <div className="flex items-center gap-2 text-text-tertiary text-sm shrink-0">
        <button
          type="button"
          onClick={onPrev}
          disabled={!canGoPrev}
          className="p-1 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="p-1 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
        <span className="text-text-tertiary text-xs ml-1">~{problem.estimatedMinutes} min</span>
      </div>
    </div>
  )
}
