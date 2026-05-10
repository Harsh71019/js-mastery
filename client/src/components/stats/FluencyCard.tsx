import React, { memo } from 'react'
import type { CategoryFluency, FluencyTier } from '@/hooks/useFluency'

const TIER_STYLE: Record<FluencyTier, { label: string; color: string; glow: string }> = {
  Novice:     { label: 'NOVICE',     color: 'text-text-tertiary',  glow: 'bg-white/5'          },
  Learning:   { label: 'LEARNING',   color: 'text-accent-blue',    glow: 'bg-accent-blue/5 border-accent-blue/20'   },
  Proficient: { label: 'PROFICIENT', color: 'text-accent-amber',   glow: 'bg-accent-amber/5 border-accent-amber/20'  },
  Advanced:   { label: 'ADVANCED',   color: 'text-accent-green',   glow: 'bg-accent-green/5 border-accent-green/20'  },
  Fluent:     { label: 'FLUENT',     color: 'text-accent-purple',  glow: 'bg-accent-purple/5 border-accent-purple/20' },
}

interface FluencyCardProps {
  readonly fluency: CategoryFluency
}

export const FluencyCard = memo(({ fluency }: FluencyCardProps): React.JSX.Element => {
  const tier = TIER_STYLE[fluency.tier]

  if (!fluency.isStarted) {
    return (
      <div className="rounded-xl border border-dashed border-white/5 bg-white/[0.01] p-4 flex flex-col gap-3 opacity-40 group/locked hover:opacity-60 transition-opacity duration-500">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary font-geist">UNINITIALIZED</span>
          <span className="text-[10px] font-bold text-text-tertiary font-geist">0.0%</span>
        </div>
        <p className="text-text-tertiary text-[11px] font-bold font-geist truncate uppercase tracking-tight group-hover/locked:text-text-secondary transition-colors">{fluency.title}</p>
        <div className="h-0.5 w-full bg-white/5 rounded-full" />
        <p className="text-[9px] text-text-tertiary font-geist uppercase tracking-tighter">Cluster_Inactive</p>
      </div>
    )
  }

  const barWidth = `${fluency.score}%`

  return (
    <div
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 flex flex-col gap-4 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden group/fcard"
    >
      <div className="absolute left-0 top-0 bottom-0 w-[1px] opacity-40 group-hover/fcard:opacity-100 transition-opacity" style={{ backgroundColor: fluency.accentColor }} />
      <div className="absolute top-0 right-0 w-16 h-16 blur-2xl rounded-full opacity-[0.03] group-hover/fcard:opacity-[0.1] transition-opacity" style={{ backgroundColor: fluency.accentColor }} />

      <div className="flex items-center justify-between relative z-10">
        <span className={`text-[8px] font-bold uppercase tracking-[0.2em] font-geist px-2 py-0.5 rounded border ${tier.glow} ${tier.color}`}>
          {tier.label}
        </span>
        <span className="text-base font-bold font-geist tracking-tighter" style={{ color: fluency.accentColor, textShadow: `0 0 10px ${fluency.accentColor}44` }}>
          {fluency.score.toFixed(1)}
        </span>
      </div>

      <p className="text-text-primary text-[11px] font-bold font-geist truncate uppercase tracking-tight relative z-10">{fluency.title}</p>

      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden relative z-10">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out shadow-glow-sm"
          style={{ width: barWidth, backgroundColor: fluency.accentColor }}
        />
      </div>

      <div className="flex items-center gap-4 text-[9px] font-bold uppercase font-geist text-text-tertiary relative z-10">
        <div className="flex flex-col">
           <span className="opacity-40">Verified</span>
           <span className="text-text-secondary">{fluency.solvedCount}<span className="opacity-40">/{fluency.totalCount}</span></span>
        </div>
        <div className="w-px h-6 bg-white/5" />
        <div className="flex flex-col">
           <span className="opacity-40">Avg_Tries</span>
           <span className="text-text-secondary">{fluency.avgAttempts.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
})

FluencyCard.displayName = 'FluencyCard'
