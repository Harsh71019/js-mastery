import React, { memo } from 'react'
import { GitBranch } from 'lucide-react'
import { useCategoryTimeline } from '@/hooks/useCategoryTimeline'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { CategoryTimelineEntry } from '@/hooks/useCategoryTimeline'

interface TimelineRowProps {
  readonly entry:      CategoryTimelineEntry
  readonly currentDay: number
}

const TimelineRow = memo(({ entry, currentDay }: TimelineRowProps): React.JSX.Element => {
  const barWidth = currentDay > 0 ? (entry.daysActive / currentDay) * 100 : 0

  return (
    <div className="flex items-center gap-3">
      <span className="text-[9px] font-bold font-geist text-text-tertiary w-12 shrink-0 tabular-nums">
        Day {entry.daysUntilStart}
      </span>
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: entry.accentColor }} />
      <span className="text-[10px] font-bold font-geist text-text-secondary w-28 shrink-0 truncate">
        {entry.title}
      </span>
      <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${barWidth}%`, background: entry.accentColor, opacity: 0.6 }}
        />
      </div>
      <span className="text-[8px] font-geist text-text-tertiary w-14 text-right shrink-0 tabular-nums">
        {entry.daysActive}d active
      </span>
    </div>
  )
})
TimelineRow.displayName = 'TimelineRow'

export const CategoryTimeline = (): React.JSX.Element => {
  const { categories, currentDay } = useCategoryTimeline()

  return (
    <section className="flex flex-col gap-4 relative z-10">
      <SectionHeader
        icon={<GitBranch size={16} />}
        title="Category Discovery Timeline"
        accent="green"
        meta={`Day ${currentDay} journey`}
      />

      <Card className="p-6 bg-white/[0.01] flex flex-col gap-3">
        {categories.length === 0 ? (
          <div className="h-24 flex items-center justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest font-geist text-text-tertiary opacity-30">
              Solve problems to build your category timeline
            </span>
          </div>
        ) : (
          categories.map((entry) => (
            <TimelineRow key={entry.slug} entry={entry} currentDay={currentDay} />
          ))
        )}
      </Card>
    </section>
  )
}
