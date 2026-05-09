import React, { memo } from 'react'
import { RefreshCw } from 'lucide-react'
import { useRevisitRate } from '@/hooks/useRevisitRate'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { CategoryRevisitEntry } from '@/hooks/useRevisitRate'

const getRatioLabel = (ratio: number, solvedVisits: number): string => {
  if (solvedVisits === 0) return 'Exploring'
  if (ratio <= 1.5) return 'Solid'
  if (ratio <= 3.0) return 'Reviewing'
  return 'High Revisit'
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
    <div className="flex items-center gap-4 py-2.5 border-b border-white/[0.03] last:border-0">
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: entry.accentColor }} />
      <span className="text-[10px] font-bold font-geist text-text-secondary flex-1 truncate">
        {entry.title}
      </span>
      <div className="flex items-center gap-4 shrink-0 text-[9px] font-geist text-text-tertiary">
        <span className="tabular-nums">{entry.totalVisits} visits</span>
        <span className="opacity-30">·</span>
        <span className="tabular-nums">{entry.solvedVisits} solved</span>
        <span className="opacity-30">·</span>
        <span className={`font-bold tabular-nums ${color}`}>
          {entry.solvedVisits > 0 ? `${entry.ratio}×` : '—'}
        </span>
        <span className={`text-[8px] font-bold uppercase tracking-wider w-20 text-right ${color}`}>
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
    <section className="flex flex-col gap-4 relative z-10">
      <SectionHeader
        icon={<RefreshCw size={16} />}
        title="Problem Revisit Rate"
        accent="purple"
        meta={`${categories.length} categories tracked`}
      />

      <Card className="p-6 bg-white/[0.01] flex flex-col gap-4">
        {isLoading ? (
          <div className="h-24 flex flex-col items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-white/5 border-t-accent-purple rounded-full animate-spin" />
            <span className="text-[9px] font-bold uppercase tracking-widest font-geist text-text-tertiary animate-pulse">Loading visit data...</span>
          </div>
        ) : error ? (
          <div className="h-24 flex items-center justify-center text-accent-red text-[10px] font-bold uppercase tracking-widest bg-accent-red/5 rounded-lg border border-accent-red/20">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest font-geist text-text-tertiary opacity-30">
              Open problems to start tracking revisit rate
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              {categories.map((entry) => (
                <RevisitRow key={entry.slug} entry={entry} />
              ))}
            </div>

            {(bestEntry ?? worstEntry) && (
              <div className="flex flex-col gap-1.5 pt-3 border-t border-white/5">
                {bestEntry && (
                  <p className="text-[9px] font-geist text-text-tertiary">
                    <span className="text-accent-green font-bold">★ {bestEntry.title}</span>
                    {' — knowledge is sticking'}
                  </p>
                )}
                {worstEntry && (
                  <p className="text-[9px] font-geist text-text-tertiary">
                    <span className="text-accent-amber font-bold">⚠ {worstEntry.title}</span>
                    {' — you keep coming back here'}
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </Card>
    </section>
  )
}
