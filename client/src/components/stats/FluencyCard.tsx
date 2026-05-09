import React, { memo } from 'react'
import type { CategoryFluency, FluencyTier } from '@/hooks/useFluency'

const TIER_STYLE: Record<FluencyTier, { label: string; color: string; glow: string }> = {
  Novice:     { label: 'NOVICE',     color: 'text-text-tertiary',  glow: 'bg-white/5'          },
  Learning:   { label: 'LEARNING',   color: 'text-accent-blue',    glow: 'bg-accent-blue/10'   },
  Proficient: { label: 'PROFICIENT', color: 'text-accent-amber',   glow: 'bg-accent-amber/10'  },
  Advanced:   { label: 'ADVANCED',   color: 'text-accent-green',   glow: 'bg-accent-green/10'  },
  Fluent:     { label: 'FLUENT',     color: 'text-accent-purple',  glow: 'bg-accent-purple/10' },
}

interface FluencyCardProps {
  readonly fluency: CategoryFluency
}

export const FluencyCard = memo(({ fluency }: FluencyCardProps): React.JSX.Element => {
  const tier = TIER_STYLE[fluency.tier]

  if (!fluency.isStarted) {
    return (
      <div className="rounded-xl border border-white/[0.04] bg-white/[0.01] p-4 flex flex-col gap-3 opacity-30">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary font-geist">LOCKED</span>
          <span className="text-[10px] font-bold text-text-tertiary font-geist">0%</span>
        </div>
        <p className="text-text-tertiary text-xs font-bold font-geist truncate">{fluency.title}</p>
        <div className="h-1 w-full bg-white/5 rounded-full" />
        <p className="text-[9px] text-text-tertiary font-geist">0 / {fluency.totalCount} solved</p>
      </div>
    )
  }

  const barWidth = `${fluency.score}%`

  return (
    <div
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 flex flex-col gap-3 hover:border-white/[0.12] transition-all duration-300 relative overflow-hidden"
      style={{ boxShadow: `0 0 20px -10px ${fluency.accentColor}30` }}
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-xl" style={{ background: fluency.accentColor }} />

      <div className="flex items-center justify-between">
        <span className={`text-[9px] font-bold uppercase tracking-widest font-geist px-1.5 py-0.5 rounded ${tier.glow} ${tier.color}`}>
          {tier.label}
        </span>
        <span className="text-sm font-bold font-geist" style={{ color: fluency.accentColor }}>
          {fluency.score}
        </span>
      </div>

      <p className="text-text-primary text-xs font-bold font-geist truncate">{fluency.title}</p>

      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: barWidth, background: fluency.accentColor }}
        />
      </div>

      <div className="flex items-center gap-3 text-[9px] font-bold uppercase font-geist text-text-tertiary">
        <span>{fluency.solvedCount}<span className="opacity-40">/{fluency.totalCount}</span></span>
        <span className="opacity-20">·</span>
        <span>{fluency.avgAttempts} <span className="opacity-60">avg tries</span></span>
      </div>
    </div>
  )
})

FluencyCard.displayName = 'FluencyCard'
