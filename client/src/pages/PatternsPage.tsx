import React from 'react'
import { usePatterns } from '@/hooks/usePatterns'
import { PatternCard } from '@/components/patterns/PatternCard'
import { PageContainer } from '@/components/ui/PageContainer'
import { Glow } from '@/components/ui/Glow'

export const PatternsPage = (): React.JSX.Element => {
  const { patterns, isLoading } = usePatterns()

  if (isLoading) {
    return (
      <PageContainer className="flex flex-col gap-10 relative">
        <div className="flex items-center justify-between px-1 opacity-20">
          <div className="h-4 w-48 border border-dashed border-white/10 rounded-full animate-pulse" />
          <div className="h-4 w-32 border border-dashed border-white/10 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 border border-dashed border-white/20 rounded-2xl animate-pulse" />
          ))}
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer className="flex flex-col gap-10 relative pb-20">
      <Glow color="var(--color-accent-amber)" size="xl" className="-top-40 -right-20 opacity-[0.06]" />

      <div className="flex items-center justify-between px-1 relative z-10">
        <h1 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-geist opacity-60">Pattern Architecture Library</h1>
        <div className="h-px bg-white/5 flex-1 mx-6" />
        <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist whitespace-nowrap">Status: Logic_Indexed</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {patterns.map((pattern) => (
          <PatternCard key={pattern.tag} pattern={pattern} />
        ))}
      </div>
    </PageContainer>
  )
}
