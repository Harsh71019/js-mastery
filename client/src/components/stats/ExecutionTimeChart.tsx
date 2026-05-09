import React, { useState, useMemo } from 'react'
import type { ExecutionTimeEntry } from '@/hooks/useExecutionTimes'
import type { Difficulty } from '@/types/problem'

interface ExecutionTimeChartProps {
  readonly entries: readonly ExecutionTimeEntry[]
}

type SortMode = 'date' | 'time' | 'difficulty'

const DIFFICULTY_ORDER: Record<Difficulty, number> = { Beginner: 0, Easy: 1, Medium: 2, Hard: 3 }

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Beginner: '#22c55e',
  Easy:     '#38bdf8',
  Medium:   '#f59e0b',
  Hard:     '#f43f5e',
}

const SORT_LABELS: Record<SortMode, string> = {
  date:       'By date',
  time:       'By speed',
  difficulty: 'By difficulty',
}

const sortEntries = (entries: readonly ExecutionTimeEntry[], mode: SortMode): ExecutionTimeEntry[] => {
  const copy = [...entries]
  if (mode === 'time') return copy.sort((a, b) => b.executionTimeMs - a.executionTimeMs)
  if (mode === 'difficulty')
    return copy.sort((a, b) => DIFFICULTY_ORDER[a.difficulty] - DIFFICULTY_ORDER[b.difficulty])
  return copy
}

export const ExecutionTimeChart = ({ entries }: ExecutionTimeChartProps): React.JSX.Element => {
  const [sortMode, setSortMode] = useState<SortMode>('date')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [showAll, setShowAll] = useState(false)

  const categories = useMemo(() => {
    const cats = new Set<string>()
    entries.forEach((e) => { if (e.category) cats.add(e.category) })
    return ['all', ...Array.from(cats).sort()]
  }, [entries])

  const sorted = useMemo(() => sortEntries(entries, sortMode), [entries, sortMode])

  const filtered = useMemo(
    () => (categoryFilter === 'all' ? sorted : sorted.filter((e) => e.category === categoryFilter)),
    [sorted, categoryFilter],
  )

  const visible = showAll ? filtered : filtered.slice(0, 20)
  const maxTime = Math.max(...visible.map((e) => e.executionTimeMs), 1)

  if (entries.length === 0) {
    return (
      <p className="text-sm text-text-tertiary py-4 text-center">
        No timing data yet — solve a coding problem to see execution times here.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1">
          {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSortMode(mode)}
              className={[
                'px-2.5 py-1 text-xs rounded transition-colors duration-150 cursor-pointer',
                sortMode === mode
                  ? 'bg-bg-tertiary text-text-primary border border-accent-blue'
                  : 'text-text-tertiary hover:text-text-secondary border border-border-default',
              ].join(' ')}
            >
              {SORT_LABELS[mode]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={[
                'px-2 py-0.5 text-xs rounded capitalize cursor-pointer transition-colors duration-150',
                categoryFilter === cat
                  ? 'bg-bg-tertiary text-text-primary border border-accent-blue'
                  : 'text-text-tertiary hover:text-text-secondary border border-border-default',
              ].join(' ')}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {visible.map((entry) => (
          <div key={entry.id} className="flex items-center gap-3">
            <span className="w-40 text-xs text-text-secondary truncate text-right shrink-0">
              {entry.title}
            </span>
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <div className="flex-1 h-2 bg-bg-tertiary rounded-sm overflow-hidden">
                <div
                  className="h-full rounded-sm transition-[width] duration-300"
                  style={{
                    width: `${(entry.executionTimeMs / maxTime) * 100}%`,
                    backgroundColor: DIFFICULTY_COLOR[entry.difficulty] ?? '#6b7280',
                  }}
                />
              </div>
              <span className="text-xs text-text-tertiary whitespace-nowrap w-14 text-right">
                {entry.executionTimeMs}ms
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 20 && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-xs text-accent-blue hover:underline cursor-pointer self-start"
        >
          {showAll ? 'Show less' : `Show all ${filtered.length} entries`}
        </button>
      )}
    </div>
  )
}
