import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import type { ReviewQueueItem } from '@/hooks/useReviewQueue'
import { DifficultyBadge } from '@/components/ui/Badge'
import type { Difficulty } from '@/types/problem'

interface ReviewCardProps {
  readonly item: ReviewQueueItem
}

const overdueLabel = (days: number): string => {
  if (days === 0) return 'Due today'
  if (days === 1) return '1 day overdue'
  return `${days} days overdue`
}

const overdueColor = (days: number): string => {
  if (days === 0) return 'text-accent-blue'
  if (days <= 3)  return 'text-accent-amber'
  return 'text-accent-red'
}

const intervalLabel = (interval: number): string => {
  if (interval >= 32) return 'Nearly mastered'
  if (interval >= 8)  return `Review in ${interval} days next`
  return `Interval: ${interval}d`
}

export const ReviewCard = ({ item }: ReviewCardProps): React.JSX.Element => (
  <Link
    to={`/problem/${item.id}`}
    className="group flex items-center justify-between gap-4 rounded border border-border-default bg-bg-secondary px-4 py-3.5 hover:border-border-hover transition-colors duration-150"
  >
    <div className="flex flex-col gap-1.5 min-w-0">
      <p className="text-text-primary text-sm font-medium truncate">{item.title}</p>
      <div className="flex items-center gap-2 flex-wrap">
        <DifficultyBadge difficulty={item.difficulty as Difficulty} />
        <span className="text-text-tertiary text-xs capitalize">{item.category.replace(/-/g, ' ')}</span>
      </div>
    </div>

    <div className="flex items-center gap-4 shrink-0">
      <div className="flex flex-col items-end gap-0.5">
        <span className={`text-xs font-medium ${overdueColor(item.daysOverdue)}`}>
          {overdueLabel(item.daysOverdue)}
        </span>
        <span className="flex items-center gap-1 text-text-tertiary text-xs">
          <Clock size={10} />
          {intervalLabel(item.reviewInterval)}
        </span>
      </div>
      <ArrowRight size={14} className="text-text-tertiary group-hover:text-text-primary transition-colors duration-150" />
    </div>
  </Link>
)
