import React, { memo } from 'react'
import { usePeakWindow, DAY_NAMES } from '@/hooks/usePeakWindow'
import { Card } from '@/components/ui/Card'
import type { DayName } from '@/hooks/usePeakWindow'

interface DayBarProps {
  readonly label:  DayName
  readonly count:  number
  readonly max:    number
  readonly isPeak: boolean
}

const DayBar = memo(({ label, count, max, isPeak }: DayBarProps): React.JSX.Element => {
  const barWidth = max > 0 ? (count / max) * 100 : 0
  return (
    <div className="flex items-center gap-6 group/day">
      <span className={`text-[10px] font-bold font-geist w-10 shrink-0 uppercase tracking-tighter ${isPeak ? 'text-accent-amber shadow-amber-glow' : 'text-text-tertiary group-hover/day:text-text-secondary'} transition-colors`}>
        {label.slice(0, 3)}
      </span>
      <div className="flex-1 h-2.5 bg-white/5 rounded-sm overflow-hidden relative border border-white/[0.03]">
        <div
          className="h-full rounded-sm transition-all duration-1000 ease-out"
          style={{ 
            width: `${barWidth}%`, 
            backgroundColor: isPeak ? 'var(--color-accent-amber)' : 'rgba(255,255,255,0.12)',
            boxShadow: isPeak ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none'
          }}
        />
      </div>
      <span className={`text-[10px] font-bold font-geist w-6 text-right tabular-nums ${isPeak ? 'text-accent-amber' : 'text-text-tertiary'}`}>
        {count}
      </span>
    </div>
  )
})
DayBar.displayName = 'DayBar'

export const PeakWindow = (): React.JSX.Element => {
  const { dayDistribution, bestDay, bestBlockLabel, totalSolves } = usePeakWindow()
  const maxCount = Math.max(...dayDistribution, 1)

  return (
    <Card className="p-8 bg-white/[0.01] flex flex-col gap-6 h-full min-h-[300px]">
      {totalSolves < 7 ? (
        <div className="h-full flex flex-col items-center justify-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary opacity-30 text-center max-w-[220px]">
            Syncing temporal patterns... Need 7+ data points to identify peak.
          </span>
          <div className="w-full max-w-[120px] h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-accent-amber/40 transition-all duration-1000" style={{ width: `${(totalSolves / 7) * 100}%` }} />
          </div>
        </div>
      ) : (
        <>
          {bestDay && bestBlockLabel && (
            <div className="flex items-center gap-12 pb-6 border-b border-white/5">
              <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary font-geist opacity-60">Peak_Day_Active</p>
                <p className="text-xl font-bold font-geist text-accent-amber tracking-tighter">{bestDay.toUpperCase()}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-text-tertiary font-geist opacity-60">Optimum_Block</p>
                <p className="text-xs font-bold font-geist text-text-primary tracking-widest">{bestBlockLabel.toUpperCase()}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {DAY_NAMES.map((label, i) => (
              <DayBar
                key={label}
                label={label}
                count={dayDistribution[i]}
                max={maxCount}
                isPeak={label === bestDay}
              />
            ))}
          </div>
        </>
      )}
    </Card>
  )
}
