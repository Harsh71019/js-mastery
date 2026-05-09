import React from 'react'
import { RotateCcw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRepetitionHealth } from '@/hooks/useRepetitionHealth'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'

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
    <div className="flex items-center gap-4">
      <span className={`text-[9px] font-bold uppercase tracking-widest font-geist w-20 shrink-0 ${color}`}>{label}</span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      <span className="text-[10px] font-bold font-geist text-text-tertiary w-6 text-right">{count}</span>
    </div>
  )
}

export const RepetitionHealth = (): React.JSX.Element => {
  const { mastered, onTrack, due, unreviewed, total } = useRepetitionHealth()
  const hasDue      = due > 0
  const masteredPct = total > 0 ? Math.round((mastered / total) * 100) : 0

  return (
    <section className="flex flex-col gap-4 relative z-10">
      <SectionHeader
        icon={<RotateCcw size={16} />}
        title="Spaced Repetition Health"
        accent="purple"
        meta={hasDue
          ? <Link to="/review" className="text-[9px] font-bold text-accent-red uppercase font-geist tracking-tighter hover:opacity-80 transition-opacity">{due} due — review now →</Link>
          : `${total} tracked`
        }
      />

      <Card className="p-6 bg-white/[0.01] flex flex-col gap-4">
        {total === 0 ? (
          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest font-geist text-text-tertiary opacity-30">
              Solve problems to track your review health
            </span>
          </div>
        ) : (
          <>
            <HealthBar label="Mastered"   count={mastered}   total={total} color="text-accent-green"  barColor="#22c55e" />
            <HealthBar label="On Track"   count={onTrack}    total={total} color="text-accent-blue"   barColor="#3b82f6" />
            <HealthBar label="Due"        count={due}        total={total} color="text-accent-red"    barColor="#ef4444" />
            <HealthBar label="Unreviewed" count={unreviewed} total={total} color="text-text-tertiary" barColor="#52525b" />

            <div className="flex items-center gap-6 pt-3 border-t border-white/5">
              {masteredPct > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                  <span className="text-[9px] font-bold font-geist text-text-tertiary uppercase">{masteredPct}% mastered</span>
                </div>
              )}
              {hasDue && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse" />
                  <span className="text-[9px] font-bold font-geist text-accent-red uppercase">{due} overdue</span>
                </div>
              )}
              {!hasDue && onTrack > 0 && (
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-blue" />
                  <span className="text-[9px] font-bold font-geist text-text-tertiary uppercase">all reviews on schedule</span>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </section>
  )
}
