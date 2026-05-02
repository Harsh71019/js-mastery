import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { useProblemCounts } from '@/hooks/useProblemCounts'
import { useProgressStore } from '@/store/useProgressStore'
import { StatCard } from '@/components/progress/StatCard'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { DailyWidget } from '@/components/daily/DailyWidget'
import { CATEGORIES } from '@/data/categories'

const selectDismissBackupBanner = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.dismissBackupBanner

export const Dashboard = (): React.JSX.Element => {
  const navigate = useNavigate()
  const {
    solvedCount,
    solvedProblems,
    currentStreak,
    longestStreak,
    shouldShowBackupBanner,
    nextBackupMilestone,
  } = useProgress()
  const { total, byCategory } = useProblemCounts()
  const dismissBackupBanner = useProgressStore(selectDismissBackupBanner)

  const categoriesStarted = CATEGORIES.filter(
    (category) => Object.keys(solvedProblems).some((id) => id.startsWith(category.slug)),
  ).length

  const handleExportBackup = (): void => {
    const state = useProgressStore.getState()
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    const date = new Date().toISOString().split('T')[0]
    anchor.href = url
    anchor.download = `js-trainer-progress-${date}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    dismissBackupBanner(nextBackupMilestone)
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      {shouldShowBackupBanner && (
        <div className="flex items-center justify-between bg-accent-amber/10 border border-accent-amber/30 rounded-lg px-4 py-3 text-sm">
          <span className="text-text-secondary">
            You've solved {solvedCount} problems —{' '}
            <button
              type="button"
              onClick={handleExportBackup}
              className="text-accent-amber hover:underline cursor-pointer"
            >
              download a backup
            </button>{' '}
            so you don't lose your progress.
          </span>
          <button
            type="button"
            onClick={() => dismissBackupBanner(nextBackupMilestone)}
            className="text-text-tertiary hover:text-text-secondary ml-4 text-base leading-none cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      <DailyWidget />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Solved"
          value={`${solvedCount} / ${total}`}
          accentColor="#22c55e"
        />
        <StatCard label="Current Streak" value={`${currentStreak} days`} accentColor="#a855f7" />
        <StatCard label="Longest Streak" value={`${longestStreak} days`} accentColor="#3b82f6" />
        <StatCard
          label="Categories Started"
          value={`${categoriesStarted} / ${CATEGORIES.length}`}
          accentColor="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => {
          const categoryTotal = byCategory[category.slug] ?? 0
          const categorySolved = Object.keys(solvedProblems).filter((id) =>
            id.startsWith(category.slug),
          ).length
          const progress = categoryTotal > 0 ? Math.round((categorySolved / categoryTotal) * 100) : 0

          return (
            <button
              key={category.slug}
              type="button"
              onClick={() => navigate(`/category/${category.slug}`)}
              className="bg-bg-secondary border border-border-default rounded-lg p-4 text-left hover:border-border-hover transition-colors duration-150 cursor-pointer"
              style={{ borderLeftColor: category.accentColor, borderLeftWidth: '4px' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-text-primary text-sm font-medium mb-1">{category.title}</h3>
                  <p className="text-text-secondary text-xs leading-relaxed line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-1 mt-3">
                    <span className="text-accent-green text-sm font-medium">{categorySolved} solved</span>
                    <span className="text-text-secondary text-sm">/ {categoryTotal} total</span>
                  </div>
                </div>
                <div className="shrink-0 mt-1">
                  <ProgressRing progress={progress} size={40} strokeWidth={3} color={category.accentColor} />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
