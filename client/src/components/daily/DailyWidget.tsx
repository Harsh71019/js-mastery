import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Flame } from 'lucide-react'
import { useDaily } from '@/hooks/useDaily'
import { useProgress } from '@/hooks/useProgress'
import { DifficultyBadge, TypeBadge } from '@/components/ui/Badge'

export const DailyWidget = (): React.JSX.Element => {
  const navigate = useNavigate()
  const { daily, isLoading } = useDaily()
  const { isSolved, isDailyCompleted, dailyStreak } = useProgress()

  const isCompleted = daily
    ? daily.alreadyCompleted || isDailyCompleted(daily.date) || isSolved(daily.problem.id)
    : false

  if (isLoading || !daily) {
    return (
      <div className="h-20 bg-bg-secondary rounded border border-border-default animate-pulse" />
    )
  }

  return (
    <button
      type="button"
      onClick={() => navigate('/daily')}
      className="w-full text-left bg-bg-secondary border border-border-default rounded-lg px-4 py-4 hover:border-border-hover transition-colors duration-150 cursor-pointer"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <CalendarDays size={14} className="text-text-tertiary shrink-0" />
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-text-tertiary text-xs uppercase tracking-wide">Daily</span>
              {daily.problem.type && daily.problem.type !== 'coding' && (
                <TypeBadge type={daily.problem.type} />
              )}
              <DifficultyBadge difficulty={daily.problem.difficulty} />
            </div>
            <span className="text-text-primary text-sm font-medium truncate">
              {daily.problem.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {dailyStreak > 0 && (
            <span className="flex items-center gap-1 text-accent-amber text-xs font-medium">
              <Flame size={12} />
              {dailyStreak}
            </span>
          )}
          {isCompleted ? (
            <CheckCircle2 size={18} className="text-accent-green" />
          ) : (
            <span className="text-accent-blue text-xs font-medium">Start →</span>
          )}
        </div>
      </div>
    </button>
  )
}
