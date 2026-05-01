import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useProblem } from '@/hooks/useProblem'
import { DifficultyBadge } from '@/components/ui/Badge'
import { CATEGORIES } from '@/data/categories'

interface NavbarProblemSectionProps {
  readonly id: string
}

const getCategoryTitle = (slug: string): string =>
  CATEGORIES.find((c) => c.slug === slug)?.title ?? slug

export const NavbarProblemSection = ({ id }: NavbarProblemSectionProps): React.JSX.Element => {
  const { problem, prevId, nextId, isLoading } = useProblem(id)
  const navigate = useNavigate()

  if (isLoading) {
    return <div className="h-4 w-72 bg-bg-tertiary rounded animate-pulse" />
  }

  if (!problem) {
    return <span className="text-text-tertiary text-sm">Loading…</span>
  }

  return (
    <div className="flex items-center gap-3 min-w-0 flex-1">
      <div className="flex items-center gap-1 text-sm text-text-secondary min-w-0">
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
          {getCategoryTitle(problem.category)}
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

      <div className="flex items-center gap-1 text-text-tertiary shrink-0 ml-auto">
        <button
          type="button"
          onClick={() => prevId && navigate(`/problem/${prevId}`)}
          disabled={prevId === null}
          className="p-1 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
        >
          <ChevronLeft size={15} />
        </button>
        <button
          type="button"
          onClick={() => nextId && navigate(`/problem/${nextId}`)}
          disabled={nextId === null}
          className="p-1 hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150 cursor-pointer"
        >
          <ChevronRight size={15} />
        </button>
        <span className="text-xs ml-1">~{problem.estimatedMinutes} min</span>
      </div>
    </div>
  )
}
