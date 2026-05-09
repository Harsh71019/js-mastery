import React, { memo } from 'react'
import { Gauge } from 'lucide-react'
import { useSpeedTrend } from '@/hooks/useSpeedTrend'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { SpeedTrendMonth } from '@/hooks/useSpeedTrend'

interface SpeedRowProps {
  readonly month:    SpeedTrendMonth
  readonly maxAvgMs: number
}

const SpeedRow = memo(({ month, maxAvgMs }: SpeedRowProps): React.JSX.Element | null => {
  if (month.avgMs === null) return null
  const barWidth = (month.avgMs / maxAvgMs) * 100

  return (
    <div className="flex items-center gap-4">
      <span className="text-[9px] font-bold font-geist text-text-tertiary w-8 shrink-0">{month.label}</span>
      <span className="text-[9px] font-bold font-geist text-accent-blue w-14 shrink-0 tabular-nums text-right">
        {month.avgMs}ms
      </span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${barWidth}%`, background: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }}
        />
      </div>
      <span className="text-[8px] font-geist text-text-tertiary w-16 shrink-0 text-right tabular-nums">
        {month.count} problem{month.count !== 1 ? 's' : ''}
      </span>
    </div>
  )
})
SpeedRow.displayName = 'SpeedRow'

export const SpeedTrend = (): React.JSX.Element => {
  const { months, maxAvgMs, hasData } = useSpeedTrend()

  return (
    <section className="flex flex-col gap-4 relative z-10">
      <SectionHeader
        icon={<Gauge size={16} />}
        title="Execution Speed Trend"
        accent="blue"
        meta="↓ faster = better"
      />

      <Card className="p-6 bg-white/[0.01] flex flex-col gap-3">
        {!hasData ? (
          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest font-geist text-text-tertiary opacity-30">
              Solve problems with timing to see your speed trend
            </span>
          </div>
        ) : (
          months.map((month) => (
            <SpeedRow key={month.key} month={month} maxAvgMs={maxAvgMs} />
          ))
        )}
      </Card>
    </section>
  )
}
