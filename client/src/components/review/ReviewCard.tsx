import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import type { ReviewQueueItem } from '@/hooks/useReviewQueue'
import { DifficultyBadge } from '@/components/ui/Badge'
import type { Difficulty } from '@/types/problem'
import { Card } from '@/components/ui/Card'

interface ReviewCardProps {
  readonly item: ReviewQueueItem
}

const overdueLabel = (days: number): string => {
  if (days === 0) return 'DUE_NOW'
  if (days === 1) return '1D_OVERDUE'
  return `${days}D_OVERDUE`
}

const overdueColor = (days: number): string => {
  if (days === 0) return 'text-accent-blue'
  if (days <= 3)  return 'text-accent-amber'
  return 'text-accent-red'
}

const overdueBg = (days: number): string => {
  if (days === 0) return 'bg-accent-blue/5 border-accent-blue/20'
  if (days <= 3)  return 'bg-accent-amber/5 border-accent-amber/20'
  return 'bg-accent-red/5 border-accent-red/20'
}

const intervalLabel = (interval: number): string => {
  if (interval >= 32) return 'Neural Stability: High'
  if (interval >= 8)  return `Recalibration: ${interval}D`
  return `Interval: ${interval}D`
}

export const ReviewCard = ({ item }: ReviewCardProps): React.JSX.Element | null => {
  if (!item || !item.id) {
    return null
  }

  return (
    <Link
      to={`/problem/${item.id}`}
      className="group block"
    >
      <Card className="flex items-center justify-between gap-6 px-6 py-5 transition-all duration-500 hover:translate-x-1 border-white/5 hover:border-white/20">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <DifficultyBadge difficulty={item.difficulty as Difficulty} />
            <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-[0.2em] bg-white/5 px-2 py-0.5 rounded border border-white/5 font-geist">
              {item.category?.replace(/-/g, '_') || 'GENERIC_CLUSTER'}
            </span>
          </div>
          <p className="text-text-primary text-base font-bold font-geist tracking-tight truncate uppercase transition-colors duration-300 group-hover:text-accent-blue">
            {item.title}
          </p>
        </div>

        <div className="flex items-center gap-8 shrink-0">
          <div className="flex flex-col items-end gap-1.5">
            <span className={`text-[9px] font-bold tracking-[0.2em] border px-2 py-1 rounded-lg font-geist ${overdueColor(item.daysOverdue)} ${overdueBg(item.daysOverdue)} shadow-glow-sm`}>
              {overdueLabel(item.daysOverdue)}
            </span>
            <span className="flex items-center gap-2 text-text-tertiary text-[10px] font-bold font-geist uppercase tracking-widest opacity-60">
              <Clock size={11} className="opacity-60" />
              {intervalLabel(item.reviewInterval)}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-text-tertiary group-hover:bg-accent-blue group-hover:text-white transition-all duration-500 shadow-inner border border-white/5">
            <ArrowRight size={18} className="transition-transform duration-500 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Card>
    </Link>
  )
}
