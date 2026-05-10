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
  <tr className="border-t border-white/[0.03]">
    <td className="px-6 py-4 w-10"><div className="h-4 w-4 border border-dashed border-white/10 rounded animate-pulse" /></td>
    <td className="px-3 py-4"><div className="h-4 w-48 border border-dashed border-white/10 rounded animate-pulse" /></td>
    <td className="px-3 py-4 w-32"><div className="h-4 w-20 border border-dashed border-white/10 rounded animate-pulse" /></td>
    <td className="px-3 py-4 w-36"><div className="h-4 w-24 border border-dashed border-white/10 rounded animate-pulse" /></td>
    <td className="px-3 py-4 w-20"><div className="h-4 w-12 border border-dashed border-white/10 rounded animate-pulse" /></td>
    <td className="px-3 py-4 w-14"><div className="h-4 w-8 border border-dashed border-white/10 rounded animate-pulse" /></td>
    <td className="px-3 py-4 w-10 text-center"><div className="h-4 w-4 border border-dashed border-white/10 rounded mx-auto animate-pulse" /></td>
  </tr>
)

const ProblemRow = memo(({ 
  problem, 
  index, 
  isSolved, 
  solvedAt, 
  navigate 
}: { 
  problem: ProblemSummary, 
  index: number, 
  isSolved: boolean, 
  solvedAt?: string, 
  navigate: ReturnType<typeof useNavigate> 
}) => (
  <tr
    onClick={() => navigate(`/problem/${problem.id}`)}
    className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-all duration-200 cursor-pointer group"
  >
    <td className="px-6 py-4 text-text-tertiary text-xs font-geist">{index + 1}</td>

    <td className="px-3 py-4 text-sm">
      <span className="flex items-center gap-2">
        <span className={`font-semibold tracking-tight ${isSolved ? 'text-accent-green' : 'text-text-primary group-hover:text-accent-blue'} transition-all duration-300`}>
          {problem.title}
        </span>
        {problem.type && problem.type !== 'coding' && (
          <TypeBadge type={problem.type} />
        )}
      </span>
    </td>

    <td className="px-3 py-4">
      <CategoryBadge
        label={getCategoryTitle(problem.category)}
        color={getCategoryColor(problem.category)}
      />
    </td>

    <td className="px-3 py-4 max-w-[140px]">
      <Link
        to={`/patterns/${encodeURIComponent(problem.patternTag)}`}
        onClick={(e) => e.stopPropagation()}
        className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest truncate block hover:text-accent-blue hover:underline transition-all duration-200"
      >
        {problem.patternTag}
      </Link>
    </td>

    <td className="px-3 py-4">
      <DifficultyBadge difficulty={problem.difficulty} />
    </td>

    <td className="px-3 py-4 text-text-tertiary text-[11px] font-bold font-geist">
      {problem.estimatedMinutes}M
    </td>

    <td className="px-3 py-4 text-center">
      {isSolved ? (
        <span
          title={`Solved ${formatSolveDate(solvedAt!)}`}
          className="inline-flex items-center justify-center text-accent-green"
        >
          <CheckCircle2 size={16} />
        </span>
      ) : (
        <Circle size={16} className="text-text-tertiary/40 mx-auto group-hover:text-text-tertiary transition-colors" />
      )}
    </td>
  </tr>
))

export const ProblemTable = memo(function ProblemTable({
  problems,
  solvedProblems,
  isLoading = false,
}: ProblemTableProps): React.JSX.Element {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-bg-primary">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-white/[0.02] text-text-tertiary text-[10px] uppercase tracking-widest border-b border-white/5">
              <th className="text-left px-6 py-3 w-10 font-bold font-geist">#</th>
              <th className="text-left px-3 py-3 font-bold font-geist">Problem</th>
              <th className="text-left px-3 py-3 w-32 font-bold font-geist">Category</th>
              <th className="text-left px-3 py-3 w-36 font-bold font-geist">Pattern</th>
              <th className="text-left px-3 py-3 w-20 font-bold font-geist">Diff</th>
              <th className="text-left px-3 py-3 w-14 font-bold font-geist">Est</th>
              <th className="text-center px-3 py-3 w-10 font-bold font-geist">Status</th>
            </tr>
          </thead>
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
      <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-xl backdrop-blur-md">
        <span className="text-3xl mb-3 opacity-20">🔍</span>
        <p className="text-text-secondary font-bold uppercase tracking-widest text-xs">No results found</p>
        <p className="text-text-tertiary text-[10px] mt-1 uppercase tracking-tighter">Adjust your search parameters</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-white/5 bg-bg-primary shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-white/[0.02] text-text-tertiary text-[10px] uppercase tracking-widest border-b border-white/5">
            <th className="text-left px-6 py-3 w-10 font-bold font-geist">#</th>
            <th className="text-left px-3 py-3 font-bold font-geist">Problem</th>
            <th className="text-left px-3 py-3 w-32 font-bold font-geist">Category</th>
            <th className="text-left px-3 py-3 w-36 font-bold font-geist">Pattern</th>
            <th className="text-left px-3 py-3 w-20 font-bold font-geist">Diff</th>
            <th className="text-left px-3 py-3 w-14 font-bold font-geist">Est</th>
            <th className="text-center px-3 py-3 w-10 font-bold font-geist">Status</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => {
            const solvedEntry = solvedProblems[problem.id]
            const isSolved = Boolean(solvedEntry)

            return (
              <ProblemRow 
                key={problem.id}
                problem={problem}
                index={index}
                isSolved={isSolved}
                solvedAt={solvedEntry?.solvedAt}
                navigate={navigate}
              />
            )
          })}
        </tbody>
      </table>
    </div>
  )
})
