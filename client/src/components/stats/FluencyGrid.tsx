import React from 'react'
import { Zap } from 'lucide-react'
import { useFluency } from '@/hooks/useFluency'
import { FluencyCard } from '@/components/stats/FluencyCard'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
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
    <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={style.ring} strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease', filter: `drop-shadow(0 0 6px ${style.ring}60)` }}
        />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className={`text-2xl font-bold font-geist ${style.color}`}>{score}</span>
        <span className="text-[8px] font-bold uppercase tracking-widest text-text-tertiary font-geist">{style.label}</span>
      </div>
    </div>
  )
}

export const FluencyGrid = (): React.JSX.Element => {
  const { fluencies, overallScore, overallTier } = useFluency()
  const started = fluencies.filter((f) => f.isStarted)
  const locked  = fluencies.filter((f) => !f.isStarted)

  return (
    <section className="flex flex-col gap-4 relative z-10">
      <SectionHeader
        icon={<Zap size={16} />}
        title="JS Fluency Index"
        accent="purple"
        meta={`${started.length} / ${fluencies.length} sectors active`}
      />

      <Card className="p-6 bg-white/[0.01] flex flex-col gap-8">
        <div className="flex items-center gap-8 pb-6 border-b border-white/5">
          <ScoreRing score={overallScore} tier={overallTier} />
          <div className="flex flex-col gap-2 flex-1">
            <p className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest font-geist">Overall JS Proficiency</p>
            <p className="text-text-secondary text-xs font-geist leading-relaxed">
              Based on <span className="text-text-primary font-bold">{started.reduce((s, f) => s + f.solvedCount, 0)}</span> problems solved across <span className="text-text-primary font-bold">{started.length}</span> categories. Score reflects coverage, difficulty mix, and solve efficiency.
            </p>
            <div className="flex gap-4 mt-1">
              {(['Fluent', 'Advanced', 'Proficient', 'Learning', 'Novice'] as FluencyTier[]).map((tier) => {
                const count = started.filter((f) => f.tier === tier).length
                if (count === 0) return null
                return (
                  <div key={tier} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: OVERALL_TIER_STYLE[tier].ring }} />
                    <span className="text-[9px] font-bold font-geist text-text-tertiary uppercase">{count} {tier}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {started.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary font-geist px-1">Active Sectors</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {started.map((f) => <FluencyCard key={f.slug} fluency={f} />)}
            </div>
          </div>
        )}

        {locked.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary font-geist px-1 opacity-40">Unstarted Sectors</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {locked.map((f) => <FluencyCard key={f.slug} fluency={f} />)}
            </div>
          </div>
        )}

        {started.length === 0 && (
          <div className="h-32 flex flex-col items-center justify-center gap-2 text-text-tertiary">
            <span className="text-[10px] font-bold uppercase tracking-widest font-geist opacity-30">No data — solve problems to build your fluency index</span>
          </div>
        )}
      </Card>
    </section>
  )
}
