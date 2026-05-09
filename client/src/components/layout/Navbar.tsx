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
    <header className="fixed top-0 left-0 right-0 h-12 bg-bg-primary/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 gap-6 z-50">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2 shrink-0 cursor-pointer group"
      >
        <div className="w-6 h-6 rounded bg-accent-blue/10 flex items-center justify-center text-accent-blue group-hover:shadow-glow transition-all duration-300">
          <Repeat2 size={14} />
        </div>
        <span className="text-text-primary text-sm font-bold tracking-tight font-geist uppercase">JS Mastery</span>
      </button>

      <div className="h-4 w-px bg-white/10 shrink-0" />

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

      <div className="flex items-center gap-6 shrink-0">
        {currentStreak > 0 && (
          <div className="flex flex-col items-end gap-0">
            <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5 font-geist">Streak</span>
            <div className="flex items-center gap-1.5">
              <Flame size={14} className="text-accent-amber fill-accent-amber/20" />
              <span className="text-accent-amber text-xs font-bold tracking-tight font-geist">{currentStreak}D</span>
            </div>
          </div>
        )}
        <div className="flex flex-col items-end gap-0 border-l border-white/10 pl-6">
          <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5 font-geist">Mastery</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-accent-green" />
            <span className="text-text-secondary text-xs font-bold tracking-tight font-geist">
              <span className="text-accent-green">{solvedCount}</span>
              {total > 0 && <span className="text-text-tertiary">/{total}</span>}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
