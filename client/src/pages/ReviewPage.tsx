import React from 'react'
import { RefreshCw } from 'lucide-react'
import { useReviewQueue } from '@/hooks/useReviewQueue'
import { ReviewCard } from '@/components/review/ReviewCard'
import { PageContainer } from '@/components/ui/PageContainer'
import { Glow } from '@/components/ui/Glow'

const LoadingSkeleton = (): React.JSX.Element => (
  <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative">
    <Glow color="var(--color-accent-blue)" size="xl" opacity={0.1} />
    <div className="w-full max-w-2xl flex flex-col gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 glass-panel rounded-2xl animate-pulse" />
      ))}
    </div>
  </PageContainer>
)

export const ReviewPage = (): React.JSX.Element => {
  const { queue, isLoading, error } = useReviewQueue()

  if (isLoading) return <LoadingSkeleton />

  if (error) {
    return (
      <PageContainer className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] relative">
        <div className="bg-accent-red/5 border border-accent-red/20 rounded-xl px-10 py-8 text-center backdrop-blur-md">
          <p className="text-accent-red font-bold font-geist uppercase tracking-widest text-xs mb-2">Sync Error</p>
          <p className="text-text-tertiary text-[10px] font-medium uppercase tracking-tighter">Unable to initialize recalibration sequence.</p>
        </div>
      </PageContainer>
    )
  }

  // Filter out any invalid items just in case the API returned gaps
  const items = (queue?.due ?? []).filter(item => item && item.id)

  return (
    <PageContainer className="flex flex-col items-center min-h-[calc(100vh-8rem)] relative pb-20 pt-10">
      <Glow color="var(--color-accent-blue)" size="xl" className="-top-40 opacity-[0.06]" />
      
      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-6 text-center max-w-md mt-20">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center shadow-inner relative group">
            <div className="absolute inset-0 bg-accent-green/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
            <span className="text-3xl relative z-10">🎉</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-text-primary text-xl font-bold font-geist tracking-tighter uppercase">Recalibration Complete</h1>
            <p className="text-text-tertiary text-sm font-medium leading-relaxed uppercase tracking-widest text-[10px]">Neural pathways stabilized. No sequences due for review.</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex flex-col gap-8 relative z-10">
          <div className="flex flex-col items-center gap-3 mb-4 text-center">
            <div className="flex items-center gap-3">
               <RefreshCw size={14} className="text-accent-blue animate-[spin_4s_linear_infinite] opacity-60" />
               <span className="text-accent-blue text-[10px] font-bold uppercase tracking-[0.4em] font-geist opacity-60">Sequence Recalibration</span>
            </div>
            <h1 className="text-text-primary text-3xl font-bold font-geist tracking-tighter uppercase">Active Review Queue</h1>
            <div className="h-px bg-white/5 w-24 mt-2" />
            <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-[0.2em] font-geist mt-1 bg-white/5 px-3 py-1 rounded-full border border-white/5">
              {items.length} LOGS_DUE
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <ReviewCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  )
}
