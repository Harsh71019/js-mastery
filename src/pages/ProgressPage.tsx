import React, { useRef } from 'react'
import { format } from 'date-fns'
import { useProgress } from '@/hooks/useProgress'
import { useProgressStore } from '@/store/useProgressStore'
import { StatCard } from '@/components/progress/StatCard'
import { CalendarHeatmap } from '@/components/progress/CalendarHeatmap'
import { SolveHistory } from '@/components/progress/SolveHistory'
import { Toast } from '@/components/ui/Toast'
import { getProblemById } from '@/data'
import { useState } from 'react'

interface DayData {
  readonly date: string
  readonly count: number
  readonly titles: readonly string[]
}

const buildDayData = (
  solvedProblems: Record<string, { solvedAt: string; attempts: number }>,
): ReadonlyMap<string, DayData> => {
  const map = new Map<string, DayData>()

  Object.entries(solvedProblems).forEach(([id, entry]) => {
    if (!entry.solvedAt) return
    const dateKey = format(new Date(entry.solvedAt), 'yyyy-MM-dd')
    const problem = getProblemById(id)
    const title = problem?.title ?? id
    const existing = map.get(dateKey)
    if (existing) {
      map.set(dateKey, {
        date: dateKey,
        count: existing.count + 1,
        titles: [...existing.titles, title],
      })
    } else {
      map.set(dateKey, { date: dateKey, count: 1, titles: [title] })
    }
  })

  return map
}

type ToastState = { message: string; variant: 'success' | 'error' } | null

export const ProgressPage = (): React.JSX.Element => {
  const { solvedProblems, solvedCount, totalCount, currentStreak, longestStreak } = useProgress()
  const [toast, setToast] = useState<ToastState>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const dayData = buildDayData(solvedProblems)

  const handleExport = (): void => {
    const state = useProgressStore.getState()
    const { markSolved: _ms, incrementAttempts: _ia, resetProgress: _rp, dismissBackupBanner: _db, ...persistedState } = state
    const json = JSON.stringify(persistedState, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `js-trainer-progress-${format(new Date(), 'yyyy-MM-dd')}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (loadEvent) => {
      try {
        const parsed: unknown = JSON.parse(loadEvent.target?.result as string)
        if (
          typeof parsed !== 'object' ||
          parsed === null ||
          !('solvedProblems' in parsed)
        ) {
          setToast({ message: 'Invalid file — progress unchanged', variant: 'error' })
          return
        }
        useProgressStore.setState(parsed as Parameters<typeof useProgressStore.setState>[0])
        setToast({ message: 'Progress restored successfully', variant: 'success' })
      } catch {
        setToast({ message: 'Invalid file — progress unchanged', variant: 'error' })
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-text-primary text-xl font-medium">Progress</h1>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded hover:border-border-hover hover:text-text-primary transition-colors duration-150 cursor-pointer"
          >
            Export Progress
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 text-sm text-text-secondary border border-border-default rounded hover:border-border-hover hover:text-text-primary transition-colors duration-150 cursor-pointer"
          >
            Import Progress
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Current Streak" value={`${currentStreak} days`} accentColor="#a855f7" />
        <StatCard label="Longest Streak" value={`${longestStreak} days`} accentColor="#3b82f6" />
        <StatCard label="Total Solved" value={`${solvedCount} / ${totalCount}`} accentColor="#22c55e" />
      </div>

      <div className="bg-bg-secondary border border-border-default rounded-lg p-5">
        <h2 className="text-text-secondary text-xs uppercase tracking-wide mb-4">Activity</h2>
        <CalendarHeatmap dayData={dayData} />
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-text-tertiary text-xs">Less</span>
          {['#1a1a1a', '#14532d', '#15803d', '#22c55e'].map((color) => (
            <span
              key={color}
              className="w-3 h-3 rounded-sm inline-block"
              style={{ backgroundColor: color }}
            />
          ))}
          <span className="text-text-tertiary text-xs">More</span>
        </div>
      </div>

      <div className="bg-bg-secondary border border-border-default rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-text-secondary text-xs uppercase tracking-wide">Solve History</h2>
          <span className="text-text-tertiary text-xs">{solvedCount} total</span>
        </div>
        <SolveHistory solvedProblems={solvedProblems} />
      </div>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  )
}
