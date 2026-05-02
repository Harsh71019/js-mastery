import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, ArrowRight } from 'lucide-react'
import type { AnyProblem } from '@/types/problem'
import { DifficultyBadge, TypeBadge } from '@/components/ui/Badge'

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
    <div className="rounded border border-border-default bg-bg-secondary overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-default bg-bg-tertiary">
        <span className="text-text-tertiary text-xs uppercase tracking-wide">Daily Challenge</span>
        <span className="text-text-tertiary text-xs">{formatDate(date)}</span>
      </div>

      <div className="px-5 py-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-text-primary font-medium">{problem.title}</h2>
          <div className="flex items-center gap-2 shrink-0">
            {problem.type && problem.type !== 'coding' && <TypeBadge type={problem.type} />}
            <DifficultyBadge difficulty={problem.difficulty} />
          </div>
        </div>

        {'description' in problem && problem.description && (
          <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
            {problem.description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-text-tertiary text-xs">
            <Clock size={12} />
            {problem.estimatedMinutes} min
          </span>
          <button
            type="button"
            onClick={() => navigate(`/problem/${problem.id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-accent-blue/10 border border-accent-blue/30 text-accent-blue text-sm font-medium rounded hover:bg-accent-blue/20 transition-colors duration-150 cursor-pointer"
          >
            Start Challenge
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
