import React, { memo } from 'react'
import { Layers } from 'lucide-react'
import { useDifficultyProgression } from '@/hooks/useDifficultyProgression'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { MonthBucket } from '@/hooks/useDifficultyProgression'

const CHART_HEIGHT = 80

const DIFFICULTY_COLORS = {
  hard:     '#ef4444',
  medium:   '#f59e0b',
  easy:     '#22c55e',
  beginner: '#3b82f6',
} as const

const LEGEND = [
  { key: 'hard',     label: 'Hard',     color: DIFFICULTY_COLORS.hard     },
  { key: 'medium',   label: 'Medium',   color: DIFFICULTY_COLORS.medium   },
  { key: 'easy',     label: 'Easy',     color: DIFFICULTY_COLORS.easy     },
  { key: 'beginner', label: 'Beginner', color: DIFFICULTY_COLORS.beginner },
] as const

interface BarProps {
  readonly month:    MonthBucket
  readonly maxTotal: number
}

const MonthBar = memo(({ month, maxTotal }: BarProps): React.JSX.Element => {
  const barH      = Math.max(2, (month.total / maxTotal) * CHART_HEIGHT)
  const safeTotal = month.total || 1

  const hardPct     = (month.hard     / safeTotal) * 100
  const mediumPct   = (month.medium   / safeTotal) * 100
  const easyPct     = (month.easy     / safeTotal) * 100
  const beginnerPct = (month.beginner / safeTotal) * 100

  return (
    <div className="flex-1 flex flex-col items-center gap-1.5">
      <div className="w-full rounded-sm overflow-hidden" style={{ height: `${barH}px` }}>
        <div style={{ height: `${hardPct}%`,     background: DIFFICULTY_COLORS.hard }}     />
        <div style={{ height: `${mediumPct}%`,   background: DIFFICULTY_COLORS.medium }}   />
        <div style={{ height: `${easyPct}%`,     background: DIFFICULTY_COLORS.easy }}     />
        <div style={{ height: `${beginnerPct}%`, background: DIFFICULTY_COLORS.beginner }} />
      </div>
      <span className="text-[8px] font-bold font-geist text-text-tertiary">{month.label}</span>
    </div>
  )
})
MonthBar.displayName = 'MonthBar'

export const DifficultyProgression = (): React.JSX.Element => {
  const { months, maxTotal } = useDifficultyProgression()
  const hasData = months.some((m) => m.total > 0)

  return (
    <section className="flex flex-col gap-4 relative z-10">
      <SectionHeader
        icon={<Layers size={16} />}
        title="Difficulty Progression"
        accent="blue"
        meta="6 months"
      />

      <Card className="p-6 bg-white/[0.01] flex flex-col gap-5">
        {!hasData ? (
          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest font-geist text-text-tertiary opacity-30">
              Solve problems to see your difficulty progression
            </span>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-2">
              {months.map((month) => (
                <MonthBar key={month.key} month={month} maxTotal={maxTotal} />
              ))}
            </div>

            <div className="flex items-center gap-4 flex-wrap pt-1 border-t border-white/5">
              {LEGEND.map((item) => (
                <div key={item.key} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-sm" style={{ background: item.color }} />
                  <span className="text-[9px] font-bold font-geist text-text-tertiary uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>
    </section>
  )
}
