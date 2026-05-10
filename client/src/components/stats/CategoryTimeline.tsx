import React, { memo } from 'react'
import { useCategoryTimeline } from '@/hooks/useCategoryTimeline'
import { Card } from '@/components/ui/Card'
import type { CategoryTimelineEntry } from '@/hooks/useCategoryTimeline'

interface TimelineRowProps {
  readonly entry:      CategoryTimelineEntry
  readonly currentDay: number
}

const TimelineRow = memo(({ entry, currentDay }: TimelineRowProps): React.JSX.Element => {
  const barWidth = currentDay > 0 ? (entry.daysActive / currentDay) * 100 : 0

  return (
    <div className="flex items-center gap-6 group/trow">
      <span className="text-[10px] font-bold font-geist text-text-tertiary w-14 shrink-0 tabular-nums uppercase tracking-tighter">
        CYC_{String(entry.daysUntilStart).padStart(3, '0')}
      </span>
      <div className="w-1.5 h-1.5 rounded-full shrink-0 shadow-glow-sm" style={{ backgroundColor: entry.accentColor }} />
      <span className="text-[11px] font-bold font-geist text-text-secondary w-32 shrink-0 truncate uppercase tracking-tight group-hover/trow:text-text-primary transition-colors">
        {entry.title}
      </span>
      <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${barWidth}%`, backgroundColor: entry.accentColor, opacity: 0.4 }}
        />
      </div>
      <span className="text-[9px] font-bold font-geist text-text-tertiary w-20 text-right shrink-0 tabular-nums uppercase tracking-widest opacity-60">
        {entry.daysActive}D_UPTIME
      </span>
    </div>
  )
})
TimelineRow.displayName = 'TimelineRow'

export const CategoryTimeline = (): React.JSX.Element => {
  const { categories, currentDay } = useCategoryTimeline()

  return (
    <Card className="p-8 bg-white/[0.01] flex flex-col gap-5">
      {categories.length === 0 ? (
        <div className="h-24 flex items-center justify-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] font-geist text-text-tertiary opacity-30 text-center max-w-[200px]">
            Tracing discovery nodes... No verified sectors found in registry.
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 mb-2">
             <span className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary font-geist opacity-60">Node Discovery Sequence</span>
             <div className="h-px bg-white/5 flex-1" />
          </div>
          {categories.map((entry) => (
            <TimelineRow key={entry.slug} entry={entry} currentDay={currentDay} />
          ))}
        </div>
      )}
    </Card>
  )
}
