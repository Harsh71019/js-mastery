import React from 'react'
import { Activity, Clock, Zap, TrendingUp, BarChart3, LineChart, Calendar, ShieldCheck, RefreshCw, Grid, GitBranch } from 'lucide-react'
import { useActivityGraph } from '@/hooks/useActivityGraph'
import { useExecutionTimes } from '@/hooks/useExecutionTimes'
import { useProgress } from '@/hooks/useProgress'
import { calculateNeuralCoverage } from '@/utils/neuralMetrics'
import { ActivityGraph } from '@/components/stats/ActivityGraph'
import { ExecutionTimeChart } from '@/components/stats/ExecutionTimeChart'
import { MasteryRadar } from '@/components/stats/MasteryRadar'
import { SpeedTrend } from '@/components/stats/SpeedTrend'
import { MasteryBreakdown } from '@/components/stats/MasteryBreakdown'
import { DifficultyProgression } from '@/components/stats/DifficultyProgression'
import { PeakWindow } from '@/components/stats/PeakWindow'
import { RepetitionHealth } from '@/components/stats/RepetitionHealth'
import { RevisitRate } from '@/components/stats/RevisitRate'
import { FluencyGrid } from '@/components/stats/FluencyGrid'
import { ConsistencyScore } from '@/components/stats/ConsistencyScore'
import { CategoryTimeline } from '@/components/stats/CategoryTimeline'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'
import { Glow } from '@/components/ui/Glow'
import { Divider } from '@/components/ui/Divider'

export const StatsPage = (): React.JSX.Element => {
  const activity = useActivityGraph()
  const executionTimes = useExecutionTimes()
  const { solvedProblems } = useProgress()

  const coverage = React.useMemo(
    () => calculateNeuralCoverage(solvedProblems),
    [solvedProblems]
  )

  return (
    <PageContainer className="flex flex-col gap-12 relative pb-32">
      <Glow color="var(--color-accent-blue)" size="xl" className="-top-40 -left-20 opacity-[0.06]" />
      <Glow color="var(--color-accent-purple)" size="lg" className="top-1/4 -right-20 opacity-[0.04]" />

      {/* Header Telemetry */}
      <div className="flex items-center justify-between px-1 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-accent-blue text-[9px] font-bold uppercase tracking-[0.4em] font-geist opacity-60">Intelligence Analytics</span>
          <h1 className="text-text-primary text-2xl font-bold font-geist tracking-tighter uppercase">System Intelligence Analytics</h1>
        </div>
        <div className="h-px bg-white/5 flex-1 mx-10 hidden md:block" />
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist">Sync_Status: Online</span>
          <span className="text-[9px] font-bold text-accent-green uppercase font-geist animate-pulse">Real-time Telemetry Active</span>
        </div>
      </div>

      {/* Core Matrix & Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <section className="lg:col-span-2 flex flex-col gap-4">
           <div className="flex items-center justify-between px-1">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-accent-green/5 border border-accent-green/20 flex items-center justify-center text-accent-green shadow-glow-sm">
                 <Activity size={16} />
               </div>
               <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Temporal Activity Matrix</h2>
             </div>
             <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist tracking-tighter">Window: 52_WEEKS</span>
           </div>
           <Card className="p-8 bg-white/[0.01]">
             {activity.isLoading ? (
               <div className="h-32 flex flex-col items-center justify-center gap-4">
                 <div className="w-8 h-8 border-2 border-dashed border-accent-green/20 rounded-full animate-spin" />
                 <span className="font-geist text-[10px] font-bold uppercase tracking-[0.2em] text-text-tertiary animate-pulse">Syncing_Logic_Matrix...</span>
               </div>
             ) : (
               <ActivityGraph days={activity.days} totalSolvedInWindow={activity.totalSolvedInWindow} />
             )}
           </Card>
        </section>

        <section className="flex flex-col gap-4">
           <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-lg bg-accent-purple/5 border border-accent-purple/20 flex items-center justify-center text-accent-purple shadow-glow-sm">
               <Zap size={16} />
             </div>
             <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Neural Coverage</h2>
           </div>
           <Card className="p-6 bg-white/[0.01] flex-1 flex flex-col items-center justify-center relative overflow-hidden">
              <Glow color="var(--color-accent-purple)" size="md" className="opacity-10" />
              <MasteryRadar scores={coverage} size={260} />
           </Card>
        </section>
      </div>

      {/* Consistency Row */}
      <section className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-lg bg-accent-green/5 border border-accent-green/20 flex items-center justify-center text-accent-green">
            <TrendingUp size={16} />
          </div>
          <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">System Integrity</h2>
        </div>
        <ConsistencyScore />
      </section>

      <Divider className="opacity-10" />

      {/* Velocity & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <section className="flex flex-col gap-4">
           <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-lg bg-accent-blue/5 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
               <TrendingUp size={16} />
             </div>
             <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Velocity Trends</h2>
           </div>
           <SpeedTrend />
        </section>

        <section className="flex flex-col gap-4">
           <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-lg bg-accent-amber/5 border border-accent-amber/20 flex items-center justify-center text-accent-amber">
               <BarChart3 size={16} />
             </div>
             <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Mastery Segmentation</h2>
           </div>
           <MasteryBreakdown />
        </section>
      </div>

      {/* Discovery Timeline */}
      <section className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-lg bg-accent-blue/5 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
            <GitBranch size={16} />
          </div>
          <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Registry Discovery</h2>
        </div>
        <CategoryTimeline />
      </section>

      <Divider className="opacity-10" />

      {/* Progression & Peaks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        <section className="lg:col-span-2 flex flex-col gap-4">
           <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-lg bg-accent-purple/5 border border-accent-purple/20 flex items-center justify-center text-accent-purple">
               <LineChart size={16} />
             </div>
             <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Difficulty Evolution Curve</h2>
           </div>
           <DifficultyProgression />
        </section>

        <section className="flex flex-col gap-4">
           <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-lg bg-accent-green/5 border border-accent-green/20 flex items-center justify-center text-accent-green">
               <Calendar size={16} />
             </div>
             <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Peak Performance Window</h2>
           </div>
           <PeakWindow />
        </section>
      </div>

      <Divider className="opacity-10" />

      {/* Stability Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <section className="flex flex-col gap-4">
           <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-lg bg-accent-amber/5 border border-accent-amber/20 flex items-center justify-center text-accent-amber">
               <ShieldCheck size={16} />
             </div>
             <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Retention Stability</h2>
           </div>
           <RepetitionHealth />
        </section>

        <section className="flex flex-col gap-4">
           <div className="flex items-center gap-3 px-1">
             <div className="w-8 h-8 rounded-lg bg-accent-blue/5 border border-accent-blue/20 flex items-center justify-center text-accent-blue">
               <RefreshCw size={16} />
             </div>
             <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Recalibration Frequency</h2>
           </div>
           <RevisitRate />
        </section>
      </div>

      {/* Latency Registry */}
      <section className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-blue/5 border border-accent-blue/20 flex items-center justify-center text-accent-blue shadow-glow-sm">
              <Clock size={16} />
            </div>
            <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Execution Latency Registry</h2>
          </div>
          <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist tracking-tighter">Metric: MS_LOG</span>
        </div>
        <Card className="p-8 bg-white/[0.01]">
          {executionTimes.isLoading ? (
            <div className="h-32 flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-dashed border-accent-blue/20 rounded-full animate-spin" />
              <span className="font-geist text-[10px] font-bold uppercase tracking-[0.2em] text-text-tertiary animate-pulse">Mapping_Latency_Registry...</span>
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

      {/* Fluency Matrix */}
      <section className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-lg bg-accent-green/5 border border-accent-green/20 flex items-center justify-center text-accent-green">
            <Grid size={16} />
          </div>
          <h2 className="text-text-primary text-xs font-bold uppercase tracking-widest font-geist">Logic Fluency Matrix</h2>
        </div>
        <FluencyGrid />
      </section>
    </PageContainer>
  )
}
