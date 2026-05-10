import React from 'react'
import { useFluency } from '@/hooks/useFluency'
import { FluencyCard } from '@/components/stats/FluencyCard'
import { Card } from '@/components/ui/Card'
import type { FluencyTier } from '@/hooks/useFluency'

const OVERALL_TIER_STYLE: Record<FluencyTier, { label: string; color: string; ring: string }> = {
  Novice:     { label: 'NOVICE',     color: 'text-text-tertiary', ring: '#52525b' },
  Learning:   { label: 'LEARNING',   color: 'text-accent-blue',   ring: '#3b82f6' },
  Proficient: { label: 'PROFICIENT', color: 'text-accent-amber',  ring: '#f59e0b' },
  Advanced:   { label: 'ADVANCED',   color: 'text-accent-green',  ring: '#22c55e' },
  Fluent:     { label: 'FLUENT',     color: 'text-accent-purple', ring: '#a855f7' },
}

const ScoreRing = ({ score, tier }: { score: number; tier: FluencyTier }): React.JSX.Element => {
  const style = OVERALL_TIER_STYLE[tier]
  const radius = 42
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={style.ring} strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)', filter: `drop-shadow(0 0 10px ${style.ring}44)` }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className={`text-3xl font-bold font-geist tracking-tighter ${style.color}`}>{score}</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary font-geist opacity-60">{style.label}</span>
      </div>
    </div>
  )
}

export const FluencyGrid = (): React.JSX.Element => {
  const { fluencies, overallScore, overallTier } = useFluency()
  const started = fluencies.filter((f) => f.isStarted)
  const locked  = fluencies.filter((f) => !f.isStarted)

  return (
    <Card className="p-8 bg-white/[0.01] flex flex-col gap-10">
      <div className="flex flex-col md:flex-row items-center gap-10 pb-10 border-b border-white/5">
        <ScoreRing score={overallScore} tier={overallTier} />
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-3">
             <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-[0.3em] font-geist">Logic_Fluency_Index</span>
             <div className="h-px bg-white/5 flex-1" />
          </div>
          <p className="text-text-secondary text-sm font-medium font-geist leading-relaxed max-w-2xl">
            Overall system proficiency calculated at <span className={OVERALL_TIER_STYLE[overallTier].color}>{overallScore}%</span>. Node coverage encompasses <span className="text-text-primary font-bold">{started.length} sectors</span> with high-fidelity validation on <span className="text-text-primary font-bold">{started.reduce((s, f) => s + f.solvedCount, 0)} units</span>.
          </p>
          <div className="flex gap-6 mt-2">
            {(['Fluent', 'Advanced', 'Proficient', 'Learning', 'Novice'] as FluencyTier[]).map((tier) => {
              const count = started.filter((f) => f.tier === tier).length
              if (count === 0) return null
              return (
                <div key={tier} className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest font-geist">{tier}</span>
                  <span className={`text-xs font-bold font-geist ${OVERALL_TIER_STYLE[tier].color}`}>{count} SEC</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {started.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-geist opacity-60">Verified Sectors</span>
             <div className="h-px bg-white/5 flex-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {started.map((f) => <FluencyCard key={f.slug} fluency={f} />)}
          </div>
        </div>
      )}

      {locked.length > 0 && (
        <div className="flex flex-col gap-6 opacity-40 grayscale-[0.5]">
          <div className="flex items-center gap-3 px-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-geist opacity-60">Uninitialized Clusters</span>
             <div className="h-px bg-white/5 flex-1" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {locked.map((f) => <FluencyCard key={f.slug} fluency={f} />)}
          </div>
        </div>
      )}

      {started.length === 0 && (
        <div className="h-32 flex flex-col items-center justify-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary opacity-30 text-center max-w-[240px]">
            Fluency index offline. Execute verification sequences to map neural sectors.
          </span>
        </div>
      )}
    </Card>
  )
}
