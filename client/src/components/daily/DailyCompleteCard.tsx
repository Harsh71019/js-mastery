import React from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Flame } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface DailyCompleteCardProps {
  readonly problemId:   string
  readonly dailyStreak: number
}

export const DailyCompleteCard = ({ problemId, dailyStreak }: DailyCompleteCardProps): React.JSX.Element => {
  const navigate = useNavigate()

  return (
    <Card className="rounded-2xl border-accent-green/30 bg-gradient-to-b from-accent-green/[0.08] via-accent-green/[0.03] to-[#0a0a0a] overflow-hidden shadow-[0_0_30px_-5px_rgba(34,197,94,0.15)] relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-green/10 blur-[60px] rounded-full -mr-20 -mt-20 pointer-events-none" />

      <div className="p-6 sm:p-10 flex flex-col items-center gap-5 sm:gap-6 text-center relative z-10">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-accent-green/10 border border-accent-green/30 flex items-center justify-center text-accent-green shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          <CheckCircle2 size={32} className="sm:scale-110" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-xl sm:text-2xl font-bold font-geist text-white tracking-tight uppercase">Objective Verified</h2>
          <p className="text-text-secondary text-xs sm:text-sm max-w-sm leading-relaxed">
            Today's daily synchronization is complete. Return tomorrow to maintain your sequence streak.
          </p>
        </div>

        {dailyStreak > 0 && (
          <div className="flex items-center gap-2 bg-accent-amber/10 border border-accent-amber/25 rounded-xl px-4 sm:px-5 py-2 sm:py-2.5 shadow-[0_0_15px_-3px_rgba(245,158,11,0.2)]">
            <Flame size={16} className="text-accent-amber fill-accent-amber/30 animate-pulse" />
            <span className="text-accent-amber text-xs sm:text-sm font-bold font-geist tracking-wide">
              {dailyStreak} DAY STREAK MAINTAINED
            </span>
          </div>
        )}

        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/problem/${problemId}`)}
            className="text-text-secondary hover:text-white font-geist text-xs uppercase tracking-wider border border-white/10 hover:border-white/20 px-4 py-2"
          >
            Review Solution Code →
          </Button>
        </div>
      </div>
    </Card>
  )
}
