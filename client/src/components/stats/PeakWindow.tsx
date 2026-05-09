import React, { memo } from 'react'
import { Sun } from 'lucide-react'
import { usePeakWindow, DAY_NAMES } from '@/hooks/usePeakWindow'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
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
    <div className="flex items-center gap-4">
      <span className={`text-[9px] font-bold font-geist w-8 shrink-0 ${isPeak ? 'text-accent-amber' : 'text-text-tertiary'}`}>
        {label}
      </span>
      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${barWidth}%`, background: isPeak ? '#f59e0b' : 'rgba(255,255,255,0.12)' }}
        />
      </div>
      <span className={`text-[9px] font-bold font-geist w-5 text-right ${isPeak ? 'text-accent-amber' : 'text-text-tertiary'}`}>
        {count}
      </span>
    </div>
  )
})
DayBar.displayName = 'DayBar'

export const PeakWindow = (): React.JSX.Element => {
  const { dayDistribution, bestDay, bestBlock, bestBlockLabel, totalSolves } = usePeakWindow()
  const maxCount = Math.max(...dayDistribution, 1)

  return (
    <section className="flex flex-col gap-4 relative z-10">
      <SectionHeader
        icon={<Sun size={16} />}
        title="Peak Performance Window"
        accent="amber"
        meta={`${totalSolves} total solves`}
      />

      <Card className="p-6 bg-white/[0.01] flex flex-col gap-5">
        {totalSolves < 7 ? (
          <div className="h-24 flex flex-col items-center justify-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest font-geist text-text-tertiary opacity-30">
              Solve at least 7 problems to reveal your peak window
            </span>
            <span className="text-[9px] font-geist text-text-tertiary opacity-20">{totalSolves} / 7 solved</span>
          </div>
        ) : (
          <>
            {bestDay && bestBlockLabel && (
              <div className="flex items-center gap-10 pb-4 border-b border-white/5">
                <div className="flex flex-col gap-0.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary font-geist">Peak day</p>
                  <p className="text-sm font-bold font-geist text-accent-amber">{bestDay.toUpperCase()}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-text-tertiary font-geist">Best block</p>
                  <p className="text-xs font-bold font-geist text-text-primary">{bestBlockLabel}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
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
    </section>
  )
}
