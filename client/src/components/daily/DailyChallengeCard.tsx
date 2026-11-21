import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ArrowRight, Calendar } from 'lucide-react'
import type { AnyProblem } from '@/types/problem'
import { DifficultyBadge, TypeBadge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface DailyChallengeCardProps {
  readonly problem: AnyProblem
  readonly date:    string
}

const formatDate = (iso: string): string => {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export const DailyChallengeCard = ({ problem, date }: DailyChallengeCardProps): React.JSX.Element => {
  const navigate = useNavigate()

  return (
    <Card className="rounded-2xl border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-b from-[#0e0e0e] to-[#070707]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 blur-[60px] rounded-full -mr-20 -mt-20 pointer-events-none" />
      
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-accent-blue" />
          <span className="text-accent-blue text-xs font-bold uppercase tracking-widest font-geist">Daily Protocol</span>
        </div>
        <span className="text-text-tertiary text-xs font-geist">{formatDate(date)}</span>
      </div>

      <div className="p-7 flex flex-col gap-6 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <DifficultyBadge difficulty={problem.difficulty} />
              {problem.type && problem.type !== 'coding' && <TypeBadge type={problem.type} />}
              <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-wider font-geist bg-white/5 px-2 py-0.5 rounded border border-white/10">
                {problem.patternTag}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight font-geist">{problem.title}</h2>
          </div>
        </div>

        {'description' in problem && problem.description && (
          <p className="text-text-secondary text-sm leading-relaxed line-clamp-4">
            {problem.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <span className="flex items-center gap-1.5 text-text-tertiary text-xs font-geist">
            <Clock size={13} className="opacity-70" />
            Estimated: {problem.estimatedMinutes} min
          </span>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate(`/problem/${problem.id}`)}
            className="px-6 py-2.5 font-geist uppercase text-xs tracking-wider"
          >
            <span>Start Challenge</span>
            <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </Card>
  )
}
