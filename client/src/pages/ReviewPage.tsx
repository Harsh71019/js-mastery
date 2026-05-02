import React from 'react'
import { CheckCircle2, RefreshCw } from 'lucide-react'
import { useReviewQueue } from '@/hooks/useReviewQueue'
import { ReviewCard } from '@/components/review/ReviewCard'

const LoadingSkeleton = (): React.JSX.Element => (
  <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-16 bg-bg-secondary rounded border border-border-default animate-pulse" />
    ))}
  </div>
)

export const ReviewPage = (): React.JSX.Element => {
  const { queue, isLoading, error, refresh } = useReviewQueue()

  if (isLoading) return <LoadingSkeleton />

  if (error) {
    return (
      <div className="flex items-center justify-center py-16 text-text-tertiary text-sm">
        Failed to load review queue — is the server running?
      </div>
    )
  }

  if (!queue || queue.total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-3rem)] gap-3">
        <CheckCircle2 size={32} className="text-accent-green" />
        <p className="text-text-primary font-medium">All caught up!</p>
        <p className="text-text-tertiary text-sm">No reviews due today. Come back tomorrow.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-text-primary font-medium">
            {queue.total} {queue.total === 1 ? 'problem' : 'problems'} due for review
          </h1>
          <p className="text-text-tertiary text-xs mt-0.5">
            Solve each one to advance its review interval
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          className="flex items-center gap-1.5 text-text-tertiary hover:text-text-primary text-xs transition-colors duration-150 cursor-pointer"
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {queue.due.map((item) => (
          <ReviewCard key={item.id} item={item} />
        ))}
      </div>

      <p className="text-text-tertiary text-xs text-center pt-2">
        Solve a problem to double its review interval · Max interval: 64 days
      </p>
    </div>
  )
}
