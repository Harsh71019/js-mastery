import React, { useState, useMemo } from 'react'
import type { ExecutionTimeEntry } from '@/hooks/useExecutionTimes'
import type { Difficulty } from '@/types/problem'

interface ExecutionTimeChartProps {
  readonly entries: readonly ExecutionTimeEntry[]
}

type SortMode = 'date' | 'time' | 'difficulty'

const DIFFICULTY_ORDER: Record<Difficulty, number> = { Beginner: 0, Easy: 1, Medium: 2, Hard: 3 }

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Beginner: 'var(--color-accent-green)',
  Easy:     'var(--color-accent-blue)',
  Medium:   'var(--color-accent-amber)',
  Hard:     'var(--color-accent-red)',
}

const SORT_LABELS: Record<SortMode, string> = {
  date:       'TEMPORAL_SEQ',
  time:       'VELOCITY_LOG',
  difficulty: 'INTEL_RANK',
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
      <div className="flex items-center justify-center py-10">
        <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-geist animate-pulse">
          No latency data found in registry...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-white/5 border border-white/5 rounded-xl w-fit">
          {(Object.keys(SORT_LABELS) as SortMode[]).map((mode) => {
            const isActive = sortMode === mode
            return (
              <button
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
                className={`
                  px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 rounded-lg cursor-pointer font-geist
                  ${isActive 
                    ? 'bg-white/10 text-text-primary shadow-glow-sm border border-white/10' 
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-white/[0.02]'
                  }
                `}
              >
                {SORT_LABELS[mode]}
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap max-w-md md:justify-end">
          {categories.map((cat) => {
            const isActive = categoryFilter === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`
                  px-2.5 py-1 text-[9px] font-bold uppercase tracking-tighter transition-all duration-300 rounded-md cursor-pointer font-geist border
                  ${isActive 
                    ? 'bg-accent-blue/10 text-accent-blue border-accent-blue/40 shadow-glow-sm' 
                    : 'bg-white/5 text-text-tertiary border-white/5 hover:border-white/20 hover:text-text-secondary'
                  }
                `}
              >
                {cat.replace(/-/g, '_')}
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {visible.map((entry) => (
          <div key={entry.id} className="group/row flex items-center gap-6">
            <span className="w-48 text-[11px] font-bold text-text-secondary truncate text-right shrink-0 font-geist tracking-tight group-hover/row:text-text-primary transition-colors">
              {entry.title.toUpperCase()}
            </span>
            <div className="flex-1 flex items-center gap-4 min-w-0">
              <div className="flex-1 h-3 bg-white/5 rounded-sm overflow-hidden relative border border-white/[0.03]">
                <div
                  className="h-full rounded-sm transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(255,255,255,0.1)]"
                  style={{
                    width: `${(entry.executionTimeMs / maxTime) * 100}%`,
                    backgroundColor: DIFFICULTY_COLOR[entry.difficulty] ?? '#6b7280',
                    boxShadow: `0 0 10px ${DIFFICULTY_COLOR[entry.difficulty]}44`
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-text-tertiary whitespace-nowrap w-16 text-right font-geist tracking-tighter tabular-nums group-hover/row:text-text-secondary transition-colors">
                {entry.executionTimeMs.toFixed(2)} MS
              </span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length > 20 && (
        <button
          type="button"
          onClick={() => setShowAll((prev) => !prev)}
          className="text-[9px] font-bold uppercase tracking-[0.2em] text-accent-blue hover:text-white transition-colors cursor-pointer self-center font-geist py-2 px-4 rounded border border-accent-blue/20 hover:bg-accent-blue/10"
        >
          {showAll ? 'Collapse_Registry' : `Access_Full_Registry (${filtered.length}_Nodes)`}
        </button>
      )}
    </div>
  )
}
