import React, { memo } from 'react'
import { useConsistency } from '@/hooks/useConsistency'
import { Card } from '@/components/ui/Card'
import { ProgressRing } from '@/components/ui/ProgressRing'
import type { ConsistencyTier, SparklineEntry } from '@/hooks/useConsistency'

const TIER_CONFIG: Record<ConsistencyTier, { label: string; color: string }> = {
  Irregular:  { label: 'IRREGULAR_LINK',  color: 'var(--color-text-tertiary)' },
  Building:   { label: 'INITIATING_SYNC', color: 'var(--color-accent-blue)' },
  Solid:      { label: 'STABLE_NODE',     color: 'var(--color-accent-green)' },
  Committed:  { label: 'CORE_OPERATOR',   color: 'var(--color-accent-amber)' },
  Elite:      { label: 'ELITE_DIRECTOR',  color: 'var(--color-accent-purple)' },
}

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
        <ProgressRing progress={score} size={96} strokeWidth={4} color={tierConfig.color} glow>
          <span className="text-lg font-bold font-geist z-10 tracking-tighter" style={{ color: tierConfig.color }}>{score}%</span>
        </ProgressRing>
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
          <p className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-geist opacity-60">Temporal Sparkline</p>
          <Sparkline entries={sparkline} />
        </div>
      </div>
    </Card>
  )
}
