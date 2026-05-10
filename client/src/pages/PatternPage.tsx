import React from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { usePatterns } from '@/hooks/usePatterns'
import { useProgress } from '@/hooks/useProgress'
import { ProblemTable } from '@/components/problems/ProblemTable'
import { PageContainer } from '@/components/ui/PageContainer'
import { Glow } from '@/components/ui/Glow'
import { Card } from '@/components/ui/Card'

export const PatternPage = (): React.JSX.Element => {
  const { tag } = useParams<{ tag: string }>()
  const { patterns, isLoading } = usePatterns()
  const { solvedProblems } = useProgress()

  const pattern = patterns.find((p) => p.tag === tag)

  if (isLoading) {
    return (
      <PageContainer className="flex flex-col gap-10">
        <div className="flex flex-col gap-4 opacity-20">
          <div className="h-8 w-64 border border-dashed border-white/20 rounded-full animate-pulse" />
          <div className="h-20 w-full max-w-2xl border border-dashed border-white/10 rounded-2xl animate-pulse" />
        </div>
      </PageContainer>
    )
  }

  if (!pattern) return <Navigate to="/patterns" replace />

  return (
    <PageContainer className="flex flex-col gap-12 relative pb-20">
      <Glow color="var(--color-accent-amber)" size="xl" className="-top-40 -left-20 opacity-[0.06]" />

      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent-amber text-[10px] font-bold uppercase tracking-[0.4em] font-geist opacity-60">Logic Pattern Archetype</span>
        </div>
        <h1 className="text-text-primary text-3xl font-bold font-geist tracking-tighter uppercase">{pattern.tag}</h1>
        <p className="text-text-tertiary text-base max-w-2xl leading-relaxed font-medium">
          {pattern.description}
        </p>
      </div>

      <section className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.2em] font-geist opacity-60">Implementation Protocol</h2>
          <div className="h-px bg-white/5 flex-1 mx-6" />
          <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist">Type: Algorithmic_Core</span>
        </div>
        <Card className="p-8 bg-white/[0.01]">
          <pre className="font-geist text-sm text-text-secondary leading-relaxed whitespace-pre-wrap selection:bg-accent-blue/30">
            {pattern.logic}
          </pre>
        </Card>
      </section>

      <section className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.2em] font-geist opacity-60">Associated Nodes</h2>
          <div className="h-px bg-white/5 flex-1 mx-6" />
          <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist">Registry: Verified</span>
        </div>
        <ProblemTable problems={pattern.problems} solvedProblems={solvedProblems} />
      </section>
    </PageContainer>
  )
}
