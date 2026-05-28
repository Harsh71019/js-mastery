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
import { Tabs } from '@/components/ui/Tabs'
import { SectionHeader } from '@/components/ui/SectionHeader'

export const StatsPage = (): React.JSX.Element => {
  const activity = useActivityGraph()
  const executionTimes = useExecutionTimes()
  const { solvedProblems } = useProgress()
  const [activeTab, setActiveTab] = React.useState<'activity' | 'performance' | 'recall'>('activity')

  const tabOptions = React.useMemo(() => [
    { value: 'activity', label: 'Activity' },
    { value: 'performance', label: 'Performance' },
    { value: 'recall', label: 'Recall / Health' },
  ], [])

  const coverage = React.useMemo(
    () => calculateNeuralCoverage(solvedProblems),
    [solvedProblems]
  )

  const recallStats = React.useMemo(() => {
    const entries = Object.values(solvedProblems)
    const totalRecalls = entries.reduce((sum, e) => sum + (e.recallCount ?? 0), 0)
    const totalSkips = entries.reduce((sum, e) => sum + (e.recallSkipped ?? 0), 0)
    const recalledProblems = entries.filter(e => (e.recallCount ?? 0) > 0)
    const mostRecalled = [...entries].sort((a, b) => (b.recallCount ?? 0) - (a.recallCount ?? 0))[0]

    const successRate = totalRecalls + totalSkips > 0 
      ? Math.round((totalRecalls / (totalRecalls + totalSkips)) * 100) 
      : 0

    return {
      totalRecalls,
      uniqueRecalled: recalledProblems.length,
      mostRecalledTitle: mostRecalled?.title || 'None',
      mostRecalledCount: mostRecalled?.recallCount || 0,
      successRate
    }
  }, [solvedProblems])

  return (
    <PageContainer className="flex flex-col gap-10 relative pb-32">
      <Glow color="var(--color-accent-blue)" size="xl" className="-top-40 -left-20 opacity-[0.06]" />
      <Glow color="var(--color-accent-purple)" size="lg" className="top-1/4 -right-20 opacity-[0.04]" />

      {/* Header Telemetry */}
      <div className="flex items-center justify-between px-1 relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-accent-blue text-[10px] font-bold uppercase tracking-[0.4em] font-geist opacity-60">Intelligence Analytics</span>
          <h1 className="text-text-primary text-2xl font-bold font-geist tracking-tighter uppercase">System Intelligence Analytics</h1>
        </div>
        <div className="h-px bg-white/5 flex-1 mx-10 hidden md:block" />
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-bold text-text-tertiary uppercase font-geist">Sync_Status: Online</span>
          <span className="text-[10px] font-bold text-accent-green uppercase font-geist animate-pulse">Real-time Telemetry Active</span>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="relative z-10 flex justify-start">
        <Tabs
          options={tabOptions}
          activeValue={activeTab}
          onChange={(val) => setActiveTab(val as 'activity' | 'performance' | 'recall')}
        />
      </div>

      {/* Tab Panels */}
      <div className="relative z-10">
        {activeTab === 'activity' && (
          <div className="flex flex-col gap-10">
            {/* Temporal Activity Matrix */}
            <section className="flex flex-col gap-4">
              <SectionHeader
                icon={<Activity size={16} />}
                title="Temporal Activity Matrix"
                accent="green"
                meta="Window: 52_WEEKS"
              />
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

            {/* Consistency & Peak Window Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="lg:col-span-2 flex flex-col gap-4">
                <SectionHeader
                  icon={<TrendingUp size={16} />}
                  title="System Integrity"
                  accent="green"
                />
                <ConsistencyScore />
              </section>
              
              <section className="flex flex-col gap-4">
                <SectionHeader
                  icon={<Calendar size={16} />}
                  title="Peak Performance Window"
                  accent="green"
                />
                <PeakWindow />
              </section>
            </div>

            {/* Registry Discovery */}
            <section className="flex flex-col gap-4">
              <SectionHeader
                icon={<GitBranch size={16} />}
                title="Registry Discovery"
                accent="blue"
              />
              <CategoryTimeline />
            </section>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="flex flex-col gap-10">
            {/* Neural & Mastery Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <section className="flex flex-col gap-4">
                <SectionHeader
                  icon={<Zap size={16} />}
                  title="Neural Coverage"
                  accent="purple"
                />
                <Card className="p-6 bg-white/[0.01] flex-1 flex items-center justify-center relative overflow-hidden">
                  <Glow color="var(--color-accent-purple)" size="md" className="opacity-10" />
                  <MasteryRadar scores={coverage} size={260} />
                </Card>
              </section>

              <section className="lg:col-span-2 flex flex-col gap-4">
                <SectionHeader
                  icon={<BarChart3 size={16} />}
                  title="Mastery Segmentation"
                  accent="amber"
                />
                <MasteryBreakdown />
              </section>
            </div>

            {/* Velocity & Difficulty Progression */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="flex flex-col gap-4">
                <SectionHeader
                  icon={<TrendingUp size={16} />}
                  title="Velocity Trends"
                  accent="blue"
                />
                <SpeedTrend />
              </section>

              <section className="flex flex-col gap-4">
                <SectionHeader
                  icon={<LineChart size={16} />}
                  title="Difficulty Evolution Curve"
                  accent="purple"
                />
                <DifficultyProgression />
              </section>
            </div>

            {/* Logic Fluency Matrix */}
            <section className="flex flex-col gap-4">
              <SectionHeader
                icon={<Grid size={16} />}
                title="Logic Fluency Matrix"
                accent="green"
              />
              <FluencyGrid />
            </section>

            {/* Execution Latency Registry */}
            <section className="flex flex-col gap-4">
              <SectionHeader
                icon={<Clock size={16} />}
                title="Execution Latency Registry"
                accent="blue"
                meta="Metric: MS_LOG"
              />
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
          </div>
        )}

        {activeTab === 'recall' && (
          <div className="flex flex-col gap-10">
            {/* Recall Mastery */}
            <section className="flex flex-col gap-4">
              <SectionHeader
                icon={<RefreshCw size={16} />}
                title="Recall Mastery"
                accent="amber"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-white/[0.01] border-white/5 flex flex-col gap-2">
                  <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest opacity-60">Total Recalls</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-text-primary font-geist tracking-tighter">{recallStats.totalRecalls}</span>
                    <span className="text-[10px] font-bold text-accent-amber uppercase tracking-widest">Generations</span>
                  </div>
                </Card>
                <Card className="p-6 bg-white/[0.01] border-white/5 flex flex-col gap-2">
                  <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest opacity-60">Unique Problems Recalled</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-text-primary font-geist tracking-tighter">{recallStats.uniqueRecalled}</span>
                    <span className="text-[10px] font-bold text-accent-blue uppercase tracking-widest">Active Logs</span>
                  </div>
                </Card>
                <Card className="p-6 bg-white/[0.01] border-white/5 flex flex-col gap-2">
                  <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest opacity-60">Recall Success Rate</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-text-primary font-geist tracking-tighter">{recallStats.successRate}%</span>
                    <span className="text-[10px] font-bold text-accent-green uppercase tracking-widest">Accuracy</span>
                  </div>
                </Card>
                <Card className="p-6 bg-white/[0.01] border-white/5 flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-amber/5 blur-3xl rounded-full -mr-16 -mt-16" />
                  <span className="text-text-tertiary text-[10px] font-bold uppercase tracking-widest opacity-60">Highest Stability</span>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-text-primary truncate uppercase tracking-tight">{recallStats.mostRecalledTitle}</span>
                    <span className="text-[10px] font-bold text-accent-amber uppercase tracking-widest">{recallStats.mostRecalledCount} Recalls</span>
                  </div>
                </Card>
              </div>
            </section>

            {/* Stability & Recalibration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <section className="flex flex-col gap-4">
                <SectionHeader
                  icon={<ShieldCheck size={16} />}
                  title="Retention Stability"
                  accent="amber"
                />
                <RepetitionHealth />
              </section>

              <section className="flex flex-col gap-4">
                <SectionHeader
                  icon={<RefreshCw size={16} />}
                  title="Recalibration Frequency"
                  accent="blue"
                />
                <RevisitRate />
              </section>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
