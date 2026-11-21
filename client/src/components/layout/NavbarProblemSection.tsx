import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { useProblem } from '@/hooks/useProblem'
import { DifficultyBadge } from '@/components/ui/Badge'
import { TechnicalBreadcrumbs } from '@/components/ui/TechnicalBreadcrumbs'
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
    return <div className="h-4 w-32 sm:w-72 bg-white/[0.02] border border-white/5 rounded-full animate-pulse" />
  }

  if (!problem) {
    return (
      <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest font-geist truncate">
        Registry: Loading...
      </span>
    )
  }

  const isQuiz = problem.type === 'mcq' || problem.type === 'trick'
  const backPath = isQuiz ? '/quiz' : '/problems'
  const breadcrumbItems = isQuiz
    ? [
        { label: 'QUIZ_HUB', path: '/quiz' },
        { label: problem.type === 'trick' ? 'TRICK_QUESTION' : 'MCQ_SEQUENCE', path: '/quiz' },
        { label: problem.title, active: true },
      ]
    : [
        { label: 'SECTORS', path: '/problems' },
        { label: getCategoryTitle(problem.category), path: `/category/${problem.category}` },
        { label: problem.title, active: true },
      ]

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-6 min-w-0 flex-1">
      {/* Mobile Back Button & Title */}
      <div className="flex md:hidden items-center gap-2 min-w-0 flex-1">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="p-1 rounded-md text-text-tertiary hover:text-white hover:bg-white/5 transition-colors shrink-0 cursor-pointer"
          title={`Back to ${isQuiz ? 'Quiz Hub' : 'Problems'}`}
        >
          <ArrowLeft size={14} />
        </button>
        <span className="text-xs font-bold text-text-primary font-geist truncate uppercase tracking-tight">
          {problem.title}
        </span>
      </div>

      {/* Desktop Breadcrumbs */}
      <TechnicalBreadcrumbs
        items={breadcrumbItems}
        className="hidden md:flex flex-1"
      />

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden sm:flex items-center gap-2 pr-3 sm:pr-4 border-r border-white/5">
          <DifficultyBadge difficulty={problem.difficulty} />
          <span className="hidden lg:inline-block text-text-tertiary text-[9px] font-bold uppercase tracking-widest bg-white/5 border border-white/5 rounded px-2 py-0.5 font-geist">
            {problem.patternTag}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
            <button
              type="button"
              onClick={() => prevId && navigate(`/problem/${prevId}`)}
              disabled={prevId === null}
              className="p-1 sm:p-1.5 hover:text-accent-blue disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              title="Prev Node"
            >
              <ChevronLeft size={13} />
            </button>
            <div className="w-px h-3 bg-white/10 mx-0.5" />
            <button
              type="button"
              onClick={() => nextId && navigate(`/problem/${nextId}`)}
              disabled={nextId === null}
              className="p-1 sm:p-1.5 hover:text-accent-blue disabled:opacity-20 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
              title="Next Node"
            >
              <ChevronRight size={13} />
            </button>
          </div>
          <span className="hidden sm:inline-block text-[10px] font-bold text-text-tertiary font-geist uppercase tracking-tighter tabular-nums opacity-60">
            EST: {problem.estimatedMinutes}M
          </span>
        </div>
      </div>
    </div>
  )
}
