import React from 'react'
import { Link } from 'react-router-dom'
import { useRepetitionHealth } from '@/hooks/useRepetitionHealth'
import { Card } from '@/components/ui/Card'

interface HealthBarProps {
  readonly label:    string
  readonly count:    number
  readonly total:    number
  readonly color:    string
  readonly barColor: string
}

const HealthBar = ({ label, count, total, color, barColor }: HealthBarProps): React.JSX.Element => {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-6 group/hrow">
      <span className={`text-[10px] font-bold uppercase tracking-[0.1em] font-geist w-24 shrink-0 ${color}`}>{label}</span>
      <div className="flex-1 h-3 bg-white/5 rounded-sm overflow-hidden relative border border-white/[0.03]">
        <div
          className="h-full rounded-sm transition-all duration-1000 ease-out"
          style={{ 
            width: `${pct}%`, 
            backgroundColor: barColor,
            boxShadow: `0 0 10px ${barColor}44`
          }}
        />
      </div>
      <span className="text-[10px] font-bold font-geist text-text-tertiary w-8 text-right tabular-nums group-hover/hrow:text-text-secondary transition-colors">{count}</span>
    </div>
  )
}

export const RepetitionHealth = (): React.JSX.Element => {
  const { mastered, onTrack, due, unreviewed, total } = useRepetitionHealth()
  const hasDue      = due > 0
  const masteredPct = total > 0 ? Math.round((mastered / total) * 100) : 0

  return (
    <Card className="p-8 bg-white/[0.01] flex flex-col gap-6 h-full min-h-[300px]">
      {total === 0 ? (
        <div className="h-full flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary opacity-30 text-center max-w-[200px]">
            Syncing repetition logs... Initial solve-sequence required.
          </span>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 flex-1">
            <HealthBar label="Mastered"   count={mastered}   total={total} color="text-accent-green"  barColor="var(--color-accent-green)" />
            <HealthBar label="On Track"   count={onTrack}    total={total} color="text-accent-blue"   barColor="var(--color-accent-blue)" />
            <HealthBar label="Due"        count={due}        total={total} color="text-accent-red"    barColor="var(--color-accent-red)" />
            <HealthBar label="Unreviewed" count={unreviewed} total={total} color="text-text-tertiary" barColor="var(--color-text-tertiary)" />
          </div>

          <div className="flex items-center justify-between gap-6 pt-6 border-t border-white/5">
            <div className="flex items-center gap-6">
              {masteredPct > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold font-geist text-text-tertiary uppercase opacity-60">Neural Stability</span>
                  <span className="text-xs font-bold font-geist text-accent-green">{masteredPct}% SECURE</span>
                </div>
              )}
              {hasDue && (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-bold font-geist text-accent-red uppercase opacity-60">Pathway Drift</span>
                  <span className="text-xs font-bold font-geist text-accent-red animate-pulse">{due} OUT_OF_SYNC</span>
                </div>
              )}
            </div>
            {hasDue && (
               <Link to="/review" className="bg-accent-red/10 text-accent-red text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg border border-accent-red/20 hover:bg-accent-red hover:text-white transition-all duration-300 shadow-glow-sm">
                  Initialize_Sync
               </Link>
            )}
          </div>
        </>
      )}
    </Card>
  )
}
