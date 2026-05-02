import React, { useEffect, useRef } from 'react'
import { CalendarDays } from 'lucide-react'
import { useDaily } from '@/hooks/useDaily'
import { useProgress } from '@/hooks/useProgress'
import { useProgressStore } from '@/store/useProgressStore'
import { DailyChallengeCard } from '@/components/daily/DailyChallengeCard'
import { DailyCompleteCard } from '@/components/daily/DailyCompleteCard'

const selectCompleteDailyChallenge = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.completeDailyChallenge

const LoadingSkeleton = (): React.JSX.Element => (
  <div className="h-48 bg-bg-secondary rounded border border-border-default animate-pulse" />
)

export const DailyChallengePage = (): React.JSX.Element => {
  const { daily, isLoading, error, refresh } = useDaily()
  const { isSolved, isDailyCompleted, dailyStreak } = useProgress()
  const completeDailyChallenge = useProgressStore(selectCompleteDailyChallenge)
  const completedRef = useRef(false)

  const isChallengeSolved   = daily ? isSolved(daily.problem.id) : false
  const isAlreadyCompleted  = daily ? (daily.alreadyCompleted || isDailyCompleted(daily.date)) : false

  useEffect(() => {
    if (!daily || isAlreadyCompleted || !isChallengeSolved || completedRef.current) return
    completedRef.current = true
    completeDailyChallenge().then(refresh)
  }, [isChallengeSolved, isAlreadyCompleted, daily, completeDailyChallenge, refresh])

  return (
    <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <CalendarDays size={18} className="text-text-tertiary" />
        <h1 className="text-text-primary font-medium">Daily Challenge</h1>
      </div>

      {isLoading && <LoadingSkeleton />}

      {error && (
        <div className="flex items-center justify-center py-16 text-text-tertiary text-sm">
          Failed to load daily challenge — is the server running?
        </div>
      )}

      {!isLoading && !error && daily && (
        isAlreadyCompleted || isChallengeSolved
          ? <DailyCompleteCard problemId={daily.problem.id} dailyStreak={dailyStreak} />
          : <DailyChallengeCard problem={daily.problem} date={daily.date} />
      )}
    </div>
  )
}
