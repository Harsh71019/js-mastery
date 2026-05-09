import React, { memo } from 'react'
import { TrendingUp } from 'lucide-react'
import { useConsistency } from '@/hooks/useConsistency'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { ConsistencyTier, SparklineEntry } from '@/hooks/useConsistency'

const TIER_CONFIG: Record<ConsistencyTier, { label: string; color: string }> = {
  Irregular:  { label: 'IRREGULAR',  color: '#52525b' },
  Building:   { label: 'BUILDING',   color: '#3b82f6' },
  Solid:      { label: 'SOLID',      color: '#22c55e' },
  Committed:  { label: 'COMMITTED',  color: '#f59e0b' },
  Elite:      { label: 'ELITE',      color: '#a855f7' },
}

const RING_RADIUS = 28
const RING_CIRC   = 2 * Math.PI * RING_RADIUS

interface RingProps {
  readonly score: number
  readonly color: string
}

const ConsistencyRing = memo(({ score, color }: RingProps): React.JSX.Element => {
  const offset = RING_CIRC * (1 - score / 100)
  return (
    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
        <circle
          cx="36" cy="36" r={RING_RADIUS} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 4px ${color}60)` }}
        />
      </svg>
      <span className="text-base font-bold font-geist z-10" style={{ color }}>{score}%</span>
    </div>
  )
})
ConsistencyRing.displayName = 'ConsistencyRing'

interface SparklineProps {
  readonly entries: readonly SparklineEntry[]
}

const Sparkline = memo(({ entries }: SparklineProps): React.JSX.Element => {
  const maxCount = Math.max(...entries.map((e) => e.count), 1)
  return (
    <div className="flex items-end gap-0.5 h-10 shrink-0">
      {entries.map((entry) => (
        <div
          key={entry.date}
          className="flex-1 rounded-sm transition-all duration-300"
          style={{
            height: entry.count > 0
              ? `${Math.max(15, (entry.count / maxCount) * 100)}%`
              : '8%',
            background: entry.count > 0 ? '#22c55e' : 'rgba(255,255,255,0.05)',
          }}
        />
      ))}
    </div>
  )
})
Sparkline.displayName = 'Sparkline'

export const ConsistencyScore = (): React.JSX.Element => {
  const { score, activeDays, tier, sparkline } = useConsistency()
  const tierConfig = TIER_CONFIG[tier]

  return (
    <section className="flex flex-col gap-4 relative z-10">
      <SectionHeader
        icon={<TrendingUp size={16} />}
        title="Consistency Score"
        accent="green"
        meta="Last 30 days"
      />

      <Card className="p-6 bg-white/[0.01]">
        <div className="flex items-center gap-8">
          <ConsistencyRing score={score} color={tierConfig.color} />
          <div className="flex flex-col gap-1.5 flex-1 min-w-0">
            <span className="text-[9px] font-bold uppercase tracking-widest font-geist" style={{ color: tierConfig.color }}>
              {tierConfig.label}
            </span>
            <p className="text-text-primary text-sm font-bold font-geist">{score}% consistent</p>
            <p className="text-[9px] font-geist text-text-tertiary">{activeDays} of 30 days active</p>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0">
            <p className="text-[8px] font-bold uppercase tracking-widest text-text-tertiary font-geist">Last 4 weeks</p>
            <Sparkline entries={sparkline} />
          </div>
        </div>
      </Card>
    </section>
  )
}
