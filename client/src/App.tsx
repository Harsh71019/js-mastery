import React, { useEffect, useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { useProgressStore } from '@/store/useProgressStore'
import { CommandPalette } from '@/components/ui/CommandPalette'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const ProblemsPage = lazy(() => import('@/pages/ProblemsPage').then((m) => ({ default: m.ProblemsPage })))
const CategoryPage = lazy(() => import('@/pages/CategoryPage').then((m) => ({ default: m.CategoryPage })))
const ProblemPage = lazy(() => import('@/pages/ProblemPage').then((m) => ({ default: m.ProblemPage })))
const ProgressPage = lazy(() => import('@/pages/ProgressPage').then((m) => ({ default: m.ProgressPage })))
const QuizPage = lazy(() => import('@/pages/QuizPage').then((m) => ({ default: m.QuizPage })))
const ReviewPage = lazy(() => import('@/pages/ReviewPage').then((m) => ({ default: m.ReviewPage })))
const PatternsPage = lazy(() => import('@/pages/PatternsPage').then((m) => ({ default: m.PatternsPage })))
const PatternPage = lazy(() => import('@/pages/PatternPage').then((m) => ({ default: m.PatternPage })))
const DailyChallengePage = lazy(() => import('@/pages/DailyChallengePage').then((m) => ({ default: m.DailyChallengePage })))
const StatsPage = lazy(() => import('@/pages/StatsPage').then((m) => ({ default: m.StatsPage })))
const InsightsPage = lazy(() => import('@/pages/InsightsPage').then((m) => ({ default: m.InsightsPage })))

const PageLoader = (): React.JSX.Element => (
  <div className="flex items-center justify-center min-h-[50vh] w-full">
    <div className="flex flex-col items-center gap-3">
      <div className="w-6 h-6 rounded-full border-2 border-accent-blue/20 border-t-accent-blue animate-spin" />
      <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-geist animate-pulse">
        Loading...
      </span>
    </div>
  </div>
)

const selectLoadProgress = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.loadProgress

export const App = (): React.JSX.Element => {
  const loadProgress = useProgressStore(selectLoadProgress)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(prev => !prev)
      }
    }
    const handleCustomOpen = () => setIsCommandPaletteOpen(true)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleCustomOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleCustomOpen)
    }
  }, [])

  return (
    <BrowserRouter>
      <CommandPalette 
        isOpen={isCommandPaletteOpen} 
        onClose={() => setIsCommandPaletteOpen(false)} 
      />
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="daily" element={<DailyChallengePage />} />
              <Route path="problems" element={<ProblemsPage />} />
              <Route path="category/:slug" element={<CategoryPage />} />
              <Route path="problem/:id" element={<ProblemPage />} />
              <Route path="quiz" element={<QuizPage />} />
              <Route path="review" element={<ReviewPage />} />
              <Route path="patterns" element={<PatternsPage />} />
              <Route path="patterns/:tag" element={<PatternPage />} />
              <Route path="insights" element={<InsightsPage />} />
              <Route path="insights/:id" element={<InsightsPage />} />
              <Route path="progress" element={<ProgressPage />} />
              <Route path="stats" element={<StatsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  )
}
