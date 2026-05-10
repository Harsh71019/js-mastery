import React, { memo } from 'react'
import { useConsistency } from '@/hooks/useConsistency'
import { Card } from '@/components/ui/Card'
import type { ConsistencyTier, SparklineEntry } from '@/hooks/useConsistency'

const TIER_CONFIG: Record<ConsistencyTier, { label: string; color: string }> = {
  Irregular:  { label: 'IRREGULAR_LINK',  color: '#52525b' },
  Building:   { label: 'INITIATING_SYNC', color: '#3b82f6' },
  Solid:      { label: 'STABLE_NODE',     color: '#22c55e' },
  Committed:  { label: 'CORE_OPERATOR',   color: '#f59e0b' },
  Elite:      { label: 'ELITE_DIRECTOR',  color: '#a855f7' },
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
    <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
        <circle
          cx="36" cy="36" r={RING_RADIUS} fill="none"
          stroke={color} strokeWidth="4"
          strokeDasharray={RING_CIRC}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)', filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <span className="text-lg font-bold font-geist z-10 tracking-tighter" style={{ color }}>{score}%</span>
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
    <div className="flex items-end gap-1 h-12 shrink-0">
      {entries.map((entry) => (
        <div
          key={entry.date}
          className="flex-1 rounded-sm transition-all duration-1000 ease-out border border-white/[0.03]"
          style={{
            height: entry.count > 0
              ? `${Math.max(20, (entry.count / maxCount) * 100)}%`
              : '10%',
            backgroundColor: entry.count > 0 ? 'var(--color-accent-green)' : 'rgba(255,255,255,0.05)',
            boxShadow: entry.count > 0 ? '0 0 10px rgba(34, 197, 94, 0.2)' : 'none'
          }}
          title={`${entry.count} solves on ${entry.date}`}
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
    <Card className="p-8 bg-white/[0.01]">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <ConsistencyRing score={score} color={tierConfig.color} />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-geist" style={{ color: tierConfig.color }}>
               {tierConfig.label}
             </span>
             <div className="h-px bg-white/5 flex-1" />
          </div>
          <p className="text-text-primary text-xl font-bold font-geist tracking-tight">{score}% System Integrity</p>
          <p className="text-[10px] font-bold uppercase tracking-widest font-geist text-text-tertiary">Uptime: {activeDays} of 30 cycles</p>
        </div>
        <div className="flex flex-col gap-3 shrink-0 w-full md:w-48">
          <p className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary font-geist opacity-60">Temporal Sparkline</p>
          <Sparkline entries={sparkline} />
        </div>
      </div>
    </Card>
  )
}
