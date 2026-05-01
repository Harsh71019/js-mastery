import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { Dashboard } from '@/pages/Dashboard'
import { ProblemsPage } from '@/pages/ProblemsPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { ProblemPage } from '@/pages/ProblemPage'
import { ProgressPage } from '@/pages/ProgressPage'

export const App = (): React.JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="problems" element={<ProblemsPage />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="problem/:id" element={<ProblemPage />} />
        <Route path="progress" element={<ProgressPage />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
