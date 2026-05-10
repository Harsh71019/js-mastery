import React, { memo } from 'react'
import { useSpeedTrend } from '@/hooks/useSpeedTrend'
import { Card } from '@/components/ui/Card'
import type { SpeedTrendMonth } from '@/hooks/useSpeedTrend'

interface SpeedRowProps {
  readonly month:    SpeedTrendMonth
  readonly maxAvgMs: number
}

const SpeedRow = memo(({ month, maxAvgMs }: SpeedRowProps): React.JSX.Element | null => {
  if (month.avgMs === null) return null
  const barWidth = (month.avgMs / maxAvgMs) * 100

  return (
    <div className="flex items-center gap-6 group/speed">
      <span className="text-[10px] font-bold font-geist text-text-tertiary w-10 shrink-0 group-hover/speed:text-text-secondary transition-colors">{month.label.toUpperCase()}</span>
      <div className="flex-1 h-3 bg-white/5 rounded-sm overflow-hidden relative border border-white/[0.03]">
        <div
          className="h-full rounded-sm transition-all duration-1000 ease-out"
          style={{ 
            width: `${barWidth}%`, 
            backgroundColor: 'var(--color-accent-blue)',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
          }}
        />
      </div>
      <div className="flex flex-col items-end w-20 shrink-0 font-geist">
        <span className="text-[10px] font-bold text-accent-blue tabular-nums">
          {month.avgMs.toFixed(1)} MS
        </span>
        <span className="text-[8px] font-bold text-text-tertiary uppercase tracking-tighter tabular-nums opacity-60">
          {month.count} SAMPLES
        </span>
      </div>
    </div>
  )
})
SpeedRow.displayName = 'SpeedRow'

export const SpeedTrend = (): React.JSX.Element => {
  const { months, maxAvgMs, hasData } = useSpeedTrend()

  return (
    <Card className="p-8 bg-white/[0.01] flex flex-col gap-5 h-full min-h-[300px] justify-center">
      {!hasData ? (
        <div className="h-full flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary opacity-30 text-center max-w-[200px]">
            Calibrating velocity metrics... Execute solve-sequence to begin.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {months.filter(m => m.avgMs !== null).map((month) => (
            <SpeedRow key={month.key} month={month} maxAvgMs={maxAvgMs} />
          ))}
        </div>
      )}
    </Card>
  )
}
