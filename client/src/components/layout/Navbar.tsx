import React from 'react'
import { useMatch, useNavigate } from 'react-router-dom'
import { Repeat2, Flame, CheckCircle2, Search } from 'lucide-react'
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

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'))
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-12 bg-[#050505]/90 backdrop-blur-md border-b border-white/[0.08] flex items-center px-4 sm:px-6 gap-4 sm:gap-6 z-50">
      <button
        type="button"
        onClick={() => navigate('/')}
        className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
      >
        <div className="w-7 h-7 rounded-lg bg-accent-blue/10 border border-accent-blue/20 flex items-center justify-center text-accent-blue group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:bg-accent-blue/20 transition-all duration-300">
          <Repeat2 size={15} />
        </div>
        <span className="text-text-primary text-xs sm:text-sm font-bold tracking-tight font-geist uppercase bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          JS Mastery
        </span>
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
          />
        )}
      </div>

      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        <button
          type="button"
          onClick={openSearch}
          className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-white/20 text-text-tertiary hover:text-text-primary transition-all duration-200 cursor-pointer text-xs font-geist"
          title="Search commands and problems"
        >
          <Search size={13} className="text-text-secondary" />
          <span className="text-text-secondary">Search</span>
          <kbd className="text-[10px] bg-white/5 border border-white/10 px-1 py-0.5 rounded text-text-tertiary font-geist uppercase font-bold">⌘K</kbd>
        </button>

        {currentStreak > 0 && (
          <div className="flex flex-col items-end gap-0">
            <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5 font-geist">Streak</span>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent-amber/[0.08] border border-accent-amber/20 shadow-[0_0_10px_-3px_rgba(245,158,11,0.3)]">
              <Flame size={13} className="text-accent-amber fill-accent-amber/30 animate-pulse" />
              <span className="text-accent-amber text-xs font-bold tracking-tight font-geist">{currentStreak}D</span>
            </div>
          </div>
        )}

        <div className="flex flex-col items-end gap-0 border-l border-white/10 pl-3 sm:pl-5">
          <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5 font-geist">Mastery</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent-green/[0.08] border border-accent-green/20">
            <CheckCircle2 size={13} className="text-accent-green" />
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
