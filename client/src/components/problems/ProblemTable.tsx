import React, { memo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { CheckCircle2, Circle } from 'lucide-react'
import { format } from 'date-fns'
import type { ProblemSummary } from '@/types/problem'
import { DifficultyBadge, CategoryBadge, TypeBadge } from '@/components/ui/Badge'
import { CATEGORIES } from '@/data/categories'

interface ProblemTableProps {
  readonly problems: readonly ProblemSummary[]
  readonly solvedProblems: Record<string, { solvedAt: string; attempts: number }>
  readonly isLoading?: boolean
}

const getCategoryColor = (slug: string): string =>
  CATEGORIES.find((category) => category.slug === slug)?.accentColor ?? '#a1a1aa'

const getCategoryTitle = (slug: string): string =>
  CATEGORIES.find((category) => category.slug === slug)?.title ?? slug

const formatSolveDate = (isoString: string): string => {
  if (!isoString) return ''
  return format(new Date(isoString), 'MMM d, yyyy')
}

const SkeletonRow = (): React.JSX.Element => (
  <tr className="border-t border-border-default">
    {[1, 2, 3, 4, 5, 6, 7].map((cell) => (
      <td key={cell} className="px-3 py-3">
        <div className="h-4 bg-bg-tertiary rounded animate-pulse" />
      </td>
    ))}
  </tr>
)

export const ProblemTable = memo(function ProblemTable({
  problems,
  solvedProblems,
  isLoading = false,
}: ProblemTableProps): React.JSX.Element {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-text-tertiary text-sm">
        No problems match your filters.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-bg-secondary text-text-secondary text-xs uppercase tracking-wide">
            <th className="text-left px-6 py-3 w-10 font-medium">#</th>
            <th className="text-left px-3 py-3 font-medium">Title</th>
            <th className="text-left px-3 py-3 w-32 font-medium">Category</th>
            <th className="text-left px-3 py-3 w-36 font-medium">Pattern</th>
            <th className="text-left px-3 py-3 w-20 font-medium">Diff</th>
            <th className="text-left px-3 py-3 w-14 font-medium">Time</th>
            <th className="text-center px-3 py-3 w-10 font-medium">✓</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => {
            const solvedEntry = solvedProblems[problem.id]
            const isSolved = Boolean(solvedEntry)

            return (
              <tr
                key={problem.id}
                onClick={() => navigate(`/problem/${problem.id}`)}
                className="border-t border-border-default hover:bg-bg-tertiary transition-colors duration-150 cursor-pointer group"
              >
                <td className="px-6 py-3 text-text-tertiary text-sm">{index + 1}</td>

                <td className="px-3 py-3 text-sm">
                  <span className="flex items-center gap-2">
                    <span className={isSolved ? 'text-accent-green/80' : 'text-text-primary'}>
                      {problem.title}
                    </span>
                    {problem.type && problem.type !== 'coding' && (
                      <TypeBadge type={problem.type} />
                    )}
                  </span>
                </td>

                <td className="px-3 py-3">
                  <CategoryBadge
                    label={getCategoryTitle(problem.category)}
                    color={getCategoryColor(problem.category)}
                  />
                </td>

                <td className="px-3 py-3 max-w-[140px]">
                  <Link
                    to={`/patterns/${encodeURIComponent(problem.patternTag)}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-text-secondary text-sm truncate block hover:text-accent-blue transition-colors duration-150"
                  >
                    {problem.patternTag}
                  </Link>
                </td>

                <td className="px-3 py-3">
                  <DifficultyBadge difficulty={problem.difficulty} />
                </td>

                <td className="px-3 py-3 text-text-tertiary text-sm">
                  {problem.estimatedMinutes}m
                </td>

                <td className="px-3 py-3 text-center">
                  {isSolved ? (
                    <span
                      title={`Solved ${formatSolveDate(solvedEntry.solvedAt)}`}
                      className="inline-flex items-center justify-center"
                    >
                      <CheckCircle2 size={18} className="text-accent-green" />
                    </span>
                  ) : (
                    <Circle size={18} className="text-text-tertiary mx-auto" />
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
})
