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
  readonly startIndex?: number
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

const SkeletonCard = (): React.JSX.Element => (
  <div className="p-4 border-b border-white/[0.04] flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="h-4 w-40 bg-white/5 rounded animate-pulse" />
      <div className="h-4 w-4 rounded-full bg-white/5 animate-pulse" />
    </div>
    <div className="flex items-center gap-2">
      <div className="h-4 w-16 bg-white/5 rounded animate-pulse" />
      <div className="h-4 w-14 bg-white/5 rounded animate-pulse" />
      <div className="h-4 w-20 bg-white/5 rounded animate-pulse" />
    </div>
  </div>
)

const ProblemCard = memo(({
  problem,
  displayIndex,
  isSolved,
  solvedAt,
  navigate,
}: {
  problem: ProblemSummary
  displayIndex: number
  isSolved: boolean
  solvedAt?: string
  navigate: ReturnType<typeof useNavigate>
}) => (
  <div
    onClick={() => navigate(`/problem/${problem.id}`)}
    className="p-3.5 sm:p-4 border-b border-white/[0.06] hover:bg-white/[0.035] active:bg-white/[0.06] transition-all duration-150 cursor-pointer flex flex-col gap-2.5 group select-none"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-start gap-2.5 min-w-0 flex-1">
        <span className="text-text-tertiary text-[11px] font-geist font-bold shrink-0 mt-0.5">
          #{displayIndex}
        </span>
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-semibold tracking-tight ${
                isSolved ? 'text-accent-green' : 'text-text-primary group-hover:text-accent-blue'
              } transition-colors`}
            >
              {problem.title}
            </span>
            {problem.type && problem.type !== 'coding' && (
              <TypeBadge type={problem.type} />
            )}
          </div>
        </div>
      </div>
      <div className="shrink-0 pt-0.5">
        {isSolved ? (
          <span
            title={`Solved ${formatSolveDate(solvedAt!)}`}
            className="inline-flex items-center justify-center text-accent-green"
          >
            <CheckCircle2 size={16} className="drop-shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
          </span>
        ) : (
          <Circle size={15} className="text-white/20 group-hover:text-accent-blue transition-colors" />
        )}
      </div>
    </div>

    <div className="flex items-center gap-2 flex-wrap pl-6 text-xs">
      <CategoryBadge
        label={getCategoryTitle(problem.category)}
        color={getCategoryColor(problem.category)}
      />
      <DifficultyBadge difficulty={problem.difficulty} />
      <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/5 rounded px-1.5 py-0.5 font-geist">
        {problem.patternTag}
      </span>
      <span className="text-text-tertiary text-[10px] font-bold font-geist ml-auto">
        {problem.estimatedMinutes}M
      </span>
    </div>
  </div>
))

const ProblemRow = memo(({ 
  problem, 
  displayIndex, 
  isSolved, 
  solvedAt, 
  navigate 
}: { 
  problem: ProblemSummary, 
  displayIndex: number, 
  isSolved: boolean, 
  solvedAt?: string, 
  navigate: ReturnType<typeof useNavigate> 
}) => (
  <tr
    onClick={() => navigate(`/problem/${problem.id}`)}
    className="border-t border-white/[0.05] hover:bg-white/[0.035] transition-all duration-200 cursor-pointer group"
  >
    <td className="px-6 py-3.5 text-text-tertiary text-xs font-geist">{displayIndex}</td>

    <td className="px-3 py-3.5 text-sm">
      <span className="flex items-center gap-2.5">
        <span className={`font-semibold tracking-tight ${isSolved ? 'text-accent-green' : 'text-text-primary group-hover:text-accent-blue'} transition-colors duration-200`}>
          {problem.title}
        </span>
        {problem.type && problem.type !== 'coding' && (
          <TypeBadge type={problem.type} />
        )}
      </span>
    </td>

    <td className="px-3 py-3.5">
      <CategoryBadge
        label={getCategoryTitle(problem.category)}
        color={getCategoryColor(problem.category)}
      />
    </td>

    <td className="px-3 py-3.5 max-w-[140px]">
      <Link
        to={`/patterns/${encodeURIComponent(problem.patternTag)}`}
        onClick={(e) => e.stopPropagation()}
        className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider truncate block hover:text-accent-blue hover:underline transition-colors duration-200 font-geist"
      >
        {problem.patternTag}
      </Link>
    </td>

    <td className="px-3 py-3.5">
      <DifficultyBadge difficulty={problem.difficulty} />
    </td>

    <td className="px-3 py-3.5 text-text-tertiary text-[11px] font-bold font-geist">
      {problem.estimatedMinutes}M
    </td>

    <td className="px-3 py-3.5 text-center">
      {isSolved ? (
        <span
          title={`Solved ${formatSolveDate(solvedAt!)}`}
          className="inline-flex items-center justify-center text-accent-green"
        >
          <CheckCircle2 size={16} className="drop-shadow-[0_0_6px_rgba(34,197,94,0.4)]" />
        </span>
      ) : (
        <Circle size={15} className="text-white/20 mx-auto group-hover:text-accent-blue transition-colors" />
      )}
    </td>
  </tr>
))

export const ProblemTable = memo(function ProblemTable({
  problems,
  solvedProblems,
  isLoading = false,
  startIndex = 0,
}: ProblemTableProps): React.JSX.Element {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="rounded-b-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
        {/* Mobile Skeleton Cards */}
        <div className="block md:hidden">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
        {/* Desktop Skeleton Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white/[0.03] text-text-tertiary text-[10px] uppercase tracking-wider border-b border-white/[0.08]">
                <th className="text-left px-6 py-3 w-10 font-bold font-geist">#</th>
                <th className="text-left px-3 py-3 font-bold font-geist">Problem</th>
                <th className="text-left px-3 py-3 w-32 font-bold font-geist">Category</th>
                <th className="text-left px-3 py-3 w-36 font-bold font-geist">Pattern</th>
                <th className="text-left px-3 py-3 w-24 font-bold font-geist">Difficulty</th>
                <th className="text-left px-3 py-3 w-14 font-bold font-geist">Est</th>
                <th className="text-center px-3 py-3 w-12 font-bold font-geist">Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonRow key={index} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  if (problems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 sm:py-24 bg-white/[0.015] border border-white/5 rounded-b-xl backdrop-blur-md px-4 text-center">
        <span className="text-3xl mb-3 opacity-30">🔍</span>
        <p className="text-text-secondary font-bold uppercase tracking-widest text-xs font-geist">No problem nodes found</p>
        <p className="text-text-tertiary text-[11px] mt-1 font-medium">Try broadening your search or resetting filters</p>
      </div>
    )
  }

  return (
    <div 
      tabIndex={0} 
      role="region" 
      aria-label="Problems directory"
      className="rounded-b-xl border border-white/[0.08] bg-[#0a0a0a] shadow-sm relative focus:outline-none focus:ring-1 focus:ring-accent-blue/30 overflow-hidden"
    >
      {/* Mobile View: Clean Card List */}
      <div className="block md:hidden divide-y divide-white/[0.04]">
        {problems.map((problem, index) => {
          const solvedEntry = solvedProblems[problem.id]
          const isSolved = Boolean(solvedEntry)

          return (
            <ProblemCard 
              key={problem.id}
              problem={problem}
              displayIndex={startIndex + index + 1}
              isSolved={isSolved}
              solvedAt={solvedEntry?.solvedAt}
              navigate={navigate}
            />
          )
        })}
      </div>

      {/* Desktop View: Full 7-column Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-[#0c0c0c]">
            <tr className="bg-white/[0.03] text-text-tertiary text-[10px] uppercase tracking-wider border-b border-white/[0.08]">
              <th className="text-left px-6 py-3 w-10 font-bold font-geist">#</th>
              <th className="text-left px-3 py-3 font-bold font-geist">Problem</th>
              <th className="text-left px-3 py-3 w-32 font-bold font-geist">Category</th>
              <th className="text-left px-3 py-3 w-36 font-bold font-geist">Pattern</th>
              <th className="text-left px-3 py-3 w-24 font-bold font-geist">Difficulty</th>
              <th className="text-left px-3 py-3 w-14 font-bold font-geist">Est</th>
              <th className="text-center px-3 py-3 w-12 font-bold font-geist">Status</th>
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
                  displayIndex={startIndex + index + 1}
                  isSolved={isSolved}
                  solvedAt={solvedEntry?.solvedAt}
                  navigate={navigate}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
})
