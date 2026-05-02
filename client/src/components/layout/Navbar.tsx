import React from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { Repeat2, Flame, CheckCircle2 } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useProblemCounts } from '@/hooks/useProblemCounts'
import { NavbarProblemSection } from './NavbarProblemSection'
import { NavbarPageSection } from './NavbarPageSection'

export const Navbar = (): React.JSX.Element => {
  const { solvedCount, currentStreak } = useProgress()
  const { total } = useProblemCounts()
  const navigate = useNavigate()

  const problemMatch = useMatch('/problem/:id')
  const categoryMatch = useMatch('/category/:slug')
  const problemsMatch = useMatch('/problems')
  const quizMatch = useMatch('/quiz')
  const progressMatch = useMatch('/progress')

  const problemId = problemMatch?.params.id

  return (
    <header className="fixed top-0 left-0 right-0 h-12 bg-bg-secondary border-b border-border-default flex items-center px-6 gap-6 z-50">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 shrink-0 cursor-pointer"
      >
        <Repeat2 size={17} className="text-accent-blue" />
        <span className="text-text-primary text-sm font-semibold tracking-tight">JS Trainer</span>
      </button>

      <div className="h-4 w-px bg-border-default shrink-0" />

      <div className="flex-1 min-w-0 flex items-center">
        {problemId !== undefined ? (
          <NavbarProblemSection id={problemId} />
        ) : (
          <NavbarPageSection
            categorySlug={categoryMatch?.params.slug}
            hasProblemsList={problemsMatch !== null}
            hasQuiz={quizMatch !== null}
            hasProgress={progressMatch !== null}
            total={total}
          />
        )}
      </div>

      <div className="flex items-center gap-5 shrink-0">
        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-accent-amber" />
            <span className="text-accent-amber text-xs font-medium">{currentStreak} day streak</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-accent-green" />
          <span className="text-text-secondary text-xs">
            <span className="text-accent-green font-medium">{solvedCount}</span>
            {total > 0 && <span className="text-text-tertiary"> / {total}</span>}
          </span>
        </div>
      </div>
    </header>
  )
}
