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
      className="px-8 py-6 hover:bg-white/[0.03] border-white/5 hover:border-white/20 transition-all duration-500"
    >
      <div className="flex items-center justify-between gap-10">
        <div className="flex items-center gap-6 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-accent-blue/5 border border-white/5 flex items-center justify-center text-accent-blue shrink-0 shadow-inner group-hover:shadow-glow-sm transition-all duration-500">
            <CalendarDays size={24} className="opacity-80" />
          </div>
          <div className="flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-[0.3em] font-geist opacity-60">System Objective</span>
              <div className="w-1 h-1 rounded-full bg-white/20" />
              {daily.problem.type && daily.problem.type !== 'coding' && (
                <TypeBadge type={daily.problem.type} />
              )}
              <DifficultyBadge difficulty={daily.problem.difficulty} />
            </div>
            <span className="text-text-primary text-xl font-bold tracking-tight font-geist truncate uppercase">
              {daily.problem.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-8 shrink-0">
          {dailyStreak > 0 && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest font-geist">UPTIME</span>
              <span className="flex items-center gap-2 text-accent-amber font-bold font-geist text-lg">
                <Flame size={18} className="fill-accent-amber/20" />
                {dailyStreak}D
              </span>
            </div>
          )}
          <div className="h-10 w-px bg-white/5" />
          {isCompleted ? (
            <div className="flex items-center gap-3 text-accent-green bg-accent-green/5 px-4 py-2 rounded-xl border border-accent-green/20 font-geist">
              <CheckCircle2 size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
            </div>
          ) : (
            <button className="bg-accent-blue text-white text-[10px] font-bold uppercase tracking-[0.2em] px-6 py-3 rounded-xl hover:bg-accent-blue/90 transition-all duration-300 shadow-glow-sm font-geist cursor-pointer">
              Initialize_Solve
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
