import React, { memo } from 'react'
import { useRevisitRate } from '@/hooks/useRevisitRate'
import { Card } from '@/components/ui/Card'
import type { CategoryRevisitEntry } from '@/hooks/useRevisitRate'

const getRatioLabel = (ratio: number, solvedVisits: number): string => {
  if (solvedVisits === 0) return 'EXPLORING'
  if (ratio <= 1.5) return 'RETAINED'
  if (ratio <= 3.0) return 'REVISITING'
  return 'HIGH_DRIFT'
}

const getRatioColor = (ratio: number, solvedVisits: number): string => {
  if (solvedVisits === 0) return 'text-text-tertiary'
  if (ratio <= 1.5) return 'text-accent-green'
  if (ratio <= 3.0) return 'text-accent-amber'
  return 'text-accent-red'
}

interface RevisitRowProps {
  readonly entry: CategoryRevisitEntry
}

const RevisitRow = memo(({ entry }: RevisitRowProps): React.JSX.Element => {
  const label = getRatioLabel(entry.ratio, entry.solvedVisits)
  const color = getRatioColor(entry.ratio, entry.solvedVisits)

  return (
    <div className="flex items-center gap-6 py-4 border-b border-white/[0.03] last:border-0 group/rvrow">
      <div className="w-1.5 h-1.5 rounded-full shrink-0 shadow-glow-sm" style={{ backgroundColor: entry.accentColor }} />
      <span className="text-[11px] font-bold font-geist text-text-secondary flex-1 truncate uppercase tracking-tight group-hover/rvrow:text-text-primary transition-colors">
        {entry.title}
      </span>
      <div className="flex items-center gap-6 shrink-0 text-[10px] font-bold font-geist text-text-tertiary">
        <span className="tabular-nums uppercase tracking-tighter opacity-60">{entry.totalVisits} READS</span>
        <span className="tabular-nums uppercase tracking-tighter opacity-60">{entry.solvedVisits} WRITES</span>
        <div className="w-px h-3 bg-white/10" />
        <span className={`tabular-nums min-w-[32px] text-right ${color}`}>
          {entry.solvedVisits > 0 ? `${entry.ratio.toFixed(1)}×` : '—'}
        </span>
        <span className={`text-[9px] uppercase tracking-widest w-24 text-right ${color} opacity-80`}>
          {label}
        </span>
      </div>
    </div>
  )
})
RevisitRow.displayName = 'RevisitRow'

export const RevisitRate = (): React.JSX.Element => {
  const { categories, isLoading, error } = useRevisitRate()

  const bestEntry = categories.find((c) => c.solvedVisits > 0 && c.ratio <= 1.5)
  const worstEntry = categories.find((c) => c.solvedVisits > 0 && c.ratio > 3.0)

  return (
    <Card className="p-8 bg-white/[0.01] flex flex-col gap-6 h-full min-h-[300px]">
      {isLoading ? (
        <div className="h-full flex flex-col items-center justify-center gap-4">
          <div className="w-8 h-8 border-2 border-dashed border-accent-blue/20 rounded-full animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary animate-pulse">Scanning frequency registries...</span>
        </div>
      ) : error ? (
        <div className="h-full flex items-center justify-center text-accent-red text-[10px] font-bold uppercase tracking-widest bg-accent-red/5 rounded-lg border border-accent-red/20 p-8 text-center">
          Registry read-fail: {error}
        </div>
      ) : categories.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary opacity-30 text-center max-w-[200px]">
            Initialize logic streams to map revisit frequencies.
          </span>
        </div>
      ) : (
        <>
          <div className="flex flex-col flex-1">
            {categories.map((entry) => (
              <RevisitRow key={entry.slug} entry={entry} />
            ))}
          </div>

          {(bestEntry ?? worstEntry) && (
            <div className="flex flex-col gap-2 pt-6 border-t border-white/5">
              {bestEntry && (
                <p className="text-[9px] font-bold font-geist text-text-tertiary uppercase tracking-[0.1em]">
                  <span className="text-accent-green mr-2">LOG_OK:</span> 
                  Stability high in <span className="text-text-secondary">{bestEntry.title.toUpperCase()}</span> sector.
                </p>
              )}
              {worstEntry && (
                <p className="text-[9px] font-bold font-geist text-text-tertiary uppercase tracking-[0.1em]">
                  <span className="text-accent-amber mr-2">LOG_WRN:</span> 
                  Significant neural drift in <span className="text-text-secondary">{worstEntry.title.toUpperCase()}</span> category.
                </p>
              )}
            </div>
          )}
        </>
      )}
    </Card>
  )
}
