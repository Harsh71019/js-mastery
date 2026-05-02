import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { ProblemsPage } from '@/pages/ProblemsPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { ProblemPage } from '@/pages/ProblemPage'
import { ProgressPage } from '@/pages/ProgressPage'
import { QuizPage } from '@/pages/QuizPage'
import { ReviewPage } from '@/pages/ReviewPage'
import { PatternsPage } from '@/pages/PatternsPage'
import { PatternPage } from '@/pages/PatternPage'
import { DailyChallengePage } from '@/pages/DailyChallengePage'
import { useProgressStore } from '@/store/useProgressStore'

const selectLoadProgress = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.loadProgress

export const App = (): React.JSX.Element => {
  const loadProgress = useProgressStore(selectLoadProgress)

  useEffect(() => {
    loadProgress()
  }, [loadProgress])

  return (
    <BrowserRouter>
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
          <Route path="progress" element={<ProgressPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
