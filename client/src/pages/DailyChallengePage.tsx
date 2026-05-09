import React from 'react'
import { useDaily } from '@/hooks/useDaily'
import { DailyChallengeCard } from '@/components/daily/DailyChallengeCard'
import { DailyCompleteCard } from '@/components/daily/DailyCompleteCard'
import { PageContainer } from '@/components/ui/PageContainer'
import { Glow } from '@/components/ui/Glow'

export const DailyChallengePage = (): React.JSX.Element => {
  const { daily, dailyStreak, isAlreadyCompleted, isChallengeSolved, isLoading, error } = useDaily()

  if (isLoading) {
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative">
        <Glow color="var(--color-accent-blue)" size="xl" opacity={0.1} />
        <div className="w-full max-w-2xl aspect-video glass-panel rounded-2xl animate-pulse flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10" />
          <div className="h-4 w-48 bg-white/5 rounded-full" />
          <div className="h-3 w-32 bg-white/5 rounded-full opacity-50" />
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative">
        <div className="bg-accent-red/5 border border-accent-red/20 rounded-xl px-10 py-8 text-center backdrop-blur-md">
          <p className="text-accent-red font-bold font-geist uppercase tracking-widest text-xs mb-2">Protocol Error</p>
          <p className="text-text-tertiary text-[10px] font-medium uppercase tracking-tighter">Unable to load primary daily objective.</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative">
      <Glow color="var(--color-accent-blue)" size="xl" className="opacity-[0.08]" />
      <Glow color="var(--color-accent-amber)" size="lg" className="bottom-0 right-0 opacity-[0.03]" />

      <div className="w-full max-w-3xl relative z-10">
        <div className="flex flex-col items-center gap-2 mb-10 text-center">
          <span className="text-accent-blue text-[10px] font-bold uppercase tracking-[0.4em] font-geist opacity-60">Strategic Objective</span>
          <h1 className="text-text-primary text-2xl font-bold font-geist tracking-tight uppercase">Daily Synchronization</h1>
        </div>

        {!isLoading && !error && daily && (
          isAlreadyCompleted || isChallengeSolved
            ? <DailyCompleteCard problemId={daily.problem.id} dailyStreak={dailyStreak} />
            : <DailyChallengeCard problem={daily.problem} date={daily.date} />
        )}
      </div>
    </PageContainer>
  )
}
