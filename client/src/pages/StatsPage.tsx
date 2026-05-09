import React from 'react'
import { Activity, Clock } from 'lucide-react'
import { useActivityGraph } from '@/hooks/useActivityGraph'
import { useExecutionTimes } from '@/hooks/useExecutionTimes'
import { ActivityGraph } from '@/components/stats/ActivityGraph'
import { ExecutionTimeChart } from '@/components/stats/ExecutionTimeChart'
import { FluencyGrid } from '@/components/stats/FluencyGrid'
import { MasteryBreakdown } from '@/components/stats/MasteryBreakdown'
import { RepetitionHealth } from '@/components/stats/RepetitionHealth'
import { ConsistencyScore } from '@/components/stats/ConsistencyScore'
import { DifficultyProgression } from '@/components/stats/DifficultyProgression'
import { CategoryTimeline } from '@/components/stats/CategoryTimeline'
import { SpeedTrend } from '@/components/stats/SpeedTrend'
import { PeakWindow } from '@/components/stats/PeakWindow'
import { RevisitRate } from '@/components/stats/RevisitRate'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'
import { Glow } from '@/components/ui/Glow'

export const StatsPage = (): React.JSX.Element => {
  const activity = useActivityGraph()
  const executionTimes = useExecutionTimes()

  return (
    <PageContainer className="flex flex-col gap-10 relative pb-20">
      <Glow color="var(--color-accent-green)" size="xl" className="-top-40 -right-20 opacity-[0.05]" />
      <Glow color="var(--color-accent-blue)" size="lg" className="bottom-40 -left-20 opacity-[0.03]" />

      <div className="flex items-center justify-between px-1 relative z-10">
        <h1 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-geist opacity-60">System Intelligence Analytics</h1>
        <div className="h-px bg-white/5 flex-1 mx-6" />
        <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist">Real-time Telemetry</span>
      </div>

      <section className="flex flex-col gap-4 relative z-10">
        <SectionHeader icon={<Activity size={16} />} title="Temporal Activity Matrix" accent="green" meta="Window: 52_WEEKS" />
        <Card className="p-8 bg-white/[0.01]">
          {activity.isLoading ? (
            <div className="h-32 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-white/5 border-t-accent-green rounded-full animate-spin" />
              <span className="font-geist text-[10px] font-bold uppercase tracking-widest text-text-tertiary animate-pulse">Syncing Matrix...</span>
            </div>
          ) : activity.error ? (
            <div className="h-32 flex items-center justify-center text-accent-red text-[10px] font-bold uppercase tracking-widest bg-accent-red/5 rounded-lg border border-accent-red/20">
              {activity.error}
            </div>
          ) : (
            <ActivityGraph days={activity.days} totalSolvedInWindow={activity.totalSolvedInWindow} />
          )}
        </Card>
      </section>

      <ConsistencyScore />

      <CategoryTimeline />

      <section className="flex flex-col gap-4 relative z-10">
        <SectionHeader icon={<Clock size={16} />} title="Execution Latency Registry" accent="blue" meta="Metric: MS_LOG" />
        <Card className="p-8 bg-white/[0.01]">
          {executionTimes.isLoading ? (
            <div className="h-32 flex flex-col items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-white/5 border-t-accent-blue rounded-full animate-spin" />
              <span className="font-geist text-[10px] font-bold uppercase tracking-widest text-text-tertiary animate-pulse">Scanning Logs...</span>
            </div>
          ) : executionTimes.error ? (
            <div className="h-32 flex items-center justify-center text-accent-red text-[10px] font-bold uppercase tracking-widest bg-accent-red/5 rounded-lg border border-accent-red/20">
              {executionTimes.error}
            </div>
          ) : (
            <ExecutionTimeChart entries={executionTimes.entries} />
          )}
        </Card>
      </section>

      <SpeedTrend />

      <MasteryBreakdown />

      <DifficultyProgression />

      <PeakWindow />

      <RepetitionHealth />

      <RevisitRate />

      <FluencyGrid />
    </PageContainer>
  )
}
