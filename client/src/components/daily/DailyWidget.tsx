import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarDays, CheckCircle2, Flame } from 'lucide-react'
import { useDaily } from '@/hooks/useDaily'
import { useProgress } from '@/hooks/useProgress'
import { Card } from '@/components/ui/Card'
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
      <div className="h-20 bg-bg-secondary rounded-xl border border-border-default animate-pulse" />
    )
  }

  return (
    <Card
      onClick={() => navigate('/daily')}
      className="p-4 sm:p-6 hover:bg-white/[0.03] border-white/10 hover:border-accent-blue/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 w-48 h-48 bg-accent-blue/10 blur-[50px] rounded-full -mr-20 -mt-20 pointer-events-none" />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-accent-blue/10 flex items-center justify-center text-accent-blue">
            <CalendarDays size={14} />
          </div>
          <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest font-geist">Daily Challenge Objective</span>
        </div>
        {dailyStreak > 0 && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent-amber/[0.08] border border-accent-amber/20">
            <Flame size={12} className="text-accent-amber fill-accent-amber/30" />
            <span className="text-[10px] font-bold text-accent-amber font-geist">{dailyStreak}D STREAK</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <DifficultyBadge difficulty={daily.problem.difficulty} />
            {daily.problem.type && daily.problem.type !== 'coding' && (
              <TypeBadge type={daily.problem.type} />
            )}
            <span className="text-text-tertiary text-[10px] font-bold font-geist uppercase">{daily.problem.estimatedMinutes}M</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-text-primary tracking-tight font-geist truncate group-hover:text-accent-blue transition-colors">
            {daily.problem.title}
          </h3>
        </div>

        <div className="shrink-0 flex items-center">
          {isCompleted ? (
            <div className="flex items-center gap-2 text-accent-green bg-accent-green/[0.08] px-3.5 py-1.5 rounded-lg border border-accent-green/20 font-geist">
              <CheckCircle2 size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Solved</span>
            </div>
          ) : (
            <div className="bg-accent-blue text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-accent-blue/90 transition-all duration-300 shadow-[0_0_12px_rgba(59,130,246,0.3)] font-geist">
              Solve Now →
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
