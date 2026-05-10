import React, { memo } from 'react'
import { useDifficultyProgression } from '@/hooks/useDifficultyProgression'
import { Card } from '@/components/ui/Card'
import type { MonthBucket } from '@/hooks/useDifficultyProgression'

const CHART_HEIGHT = 120

const DIFFICULTY_COLORS = {
  hard:     'var(--color-accent-red)',
  medium:   'var(--color-accent-amber)',
  easy:     'var(--color-accent-green)',
  beginner: 'var(--color-accent-blue)',
} as const

const LEGEND = [
  { key: 'hard',     label: 'HARD',     color: DIFFICULTY_COLORS.hard     },
  { key: 'medium',   label: 'MEDIUM',   color: DIFFICULTY_COLORS.medium   },
  { key: 'easy',     label: 'EASY',     color: DIFFICULTY_COLORS.easy     },
  { key: 'beginner', label: 'BEGINNER', color: DIFFICULTY_COLORS.beginner },
] as const

interface BarProps {
  readonly month:    MonthBucket
  readonly maxTotal: number
}

const MonthBar = memo(({ month, maxTotal }: BarProps): React.JSX.Element => {
  const barH      = Math.max(4, (month.total / maxTotal) * CHART_HEIGHT)
  const safeTotal = month.total || 1

  const hardPct     = (month.hard     / safeTotal) * 100
  const mediumPct   = (month.medium   / safeTotal) * 100
  const easyPct     = (month.easy     / safeTotal) * 100
  const beginnerPct = (month.beginner / safeTotal) * 100

  return (
    <div className="flex-1 flex flex-col items-center gap-3 group/mbar">
      <div className="w-full flex flex-col justify-end" style={{ height: `${CHART_HEIGHT}px` }}>
         <div className="w-full rounded-sm overflow-hidden border border-white/[0.03] transition-all duration-500 group-hover:border-white/10 group-hover:shadow-glow-sm" style={{ height: `${barH}px` }}>
           <div style={{ height: `${hardPct}%`,     backgroundColor: DIFFICULTY_COLORS.hard }}     />
           <div style={{ height: `${mediumPct}%`,   backgroundColor: DIFFICULTY_COLORS.medium }}   />
           <div style={{ height: `${easyPct}%`,     backgroundColor: DIFFICULTY_COLORS.easy }}     />
           <div style={{ height: `${beginnerPct}%`, backgroundColor: DIFFICULTY_COLORS.beginner }} />
         </div>
      </div>
      <span className="text-[9px] font-bold font-geist text-text-tertiary group-hover:text-text-secondary transition-colors uppercase tracking-tighter">{month.label}</span>
    </div>
  )
})
MonthBar.displayName = 'MonthBar'

export const DifficultyProgression = (): React.JSX.Element => {
  const { months, maxTotal } = useDifficultyProgression()
  const hasData = months.some((m) => m.total > 0)

  return (
    <Card className="p-8 bg-white/[0.01] flex flex-col gap-6 h-full min-h-[300px]">
      {!hasData ? (
        <div className="h-full flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary opacity-30 text-center max-w-[200px]">
            Plotting difficulty evolution... Verification log empty.
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-3 flex-1 min-h-[160px]">
            {months.map((month) => (
              <MonthBar key={month.key} month={month} maxTotal={maxTotal} />
            ))}
          </div>

          <div className="flex items-center gap-6 flex-wrap pt-6 border-t border-white/5">
            {LEGEND.map((item) => (
              <div key={item.key} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}44` }} />
                <span className="text-[9px] font-bold font-geist text-text-tertiary tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
