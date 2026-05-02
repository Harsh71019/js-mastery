import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Flame } from 'lucide-react'

interface DailyCompleteCardProps {
  readonly problemId:   string
  readonly dailyStreak: number
}

export const DailyCompleteCard = ({ problemId, dailyStreak }: DailyCompleteCardProps): React.JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className="rounded border border-accent-green/30 bg-[#052e16] overflow-hidden">
      <div className="px-5 py-6 flex flex-col items-center gap-4 text-center">
        <CheckCircle2 size={36} className="text-accent-green" />
        <div className="flex flex-col gap-1">
          <p className="text-accent-green font-medium">Challenge complete!</p>
          <p className="text-text-secondary text-sm">Come back tomorrow for the next one.</p>
        </div>

        {dailyStreak > 0 && (
          <div className="flex items-center gap-2 bg-accent-amber/10 border border-accent-amber/20 rounded px-4 py-2">
            <Flame size={16} className="text-accent-amber" />
            <span className="text-accent-amber text-sm font-medium">
              {dailyStreak} day {dailyStreak === 1 ? 'streak' : 'streak'} 🔥
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => navigate(`/problem/${problemId}`)}
          className="text-text-tertiary text-sm hover:text-text-secondary transition-colors duration-150 cursor-pointer"
        >
          Review solution →
        </button>
      </div>
    </div>
  )
}
