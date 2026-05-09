import React from 'react'
import { Activity, Clock } from 'lucide-react'
import { useActivityGraph } from '@/hooks/useActivityGraph'
import { useExecutionTimes } from '@/hooks/useExecutionTimes'
import { ActivityGraph } from '@/components/stats/ActivityGraph'
import { ExecutionTimeChart } from '@/components/stats/ExecutionTimeChart'

export const StatsPage = (): React.JSX.Element => {
  const activity = useActivityGraph()
  const executionTimes = useExecutionTimes()

  return (
    <div className="px-6 py-8 flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-text-primary">Stats</h1>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Activity size={15} className="text-accent-green" />
          <h2 className="text-sm font-medium text-text-primary">Activity — last 52 weeks</h2>
        </div>
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5">
          {activity.isLoading ? (
            <div className="h-24 flex items-center justify-center text-text-tertiary text-sm">
              Loading…
            </div>
          ) : activity.error ? (
            <p className="text-xs text-red-400">{activity.error}</p>
          ) : (
            <ActivityGraph days={activity.days} totalSolvedInWindow={activity.totalSolvedInWindow} />
          )}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Clock size={15} className="text-accent-blue" />
          <h2 className="text-sm font-medium text-text-primary">Execution Time per Problem</h2>
        </div>
        <div className="bg-bg-secondary border border-border-default rounded-lg p-5">
          {executionTimes.isLoading ? (
            <div className="h-24 flex items-center justify-center text-text-tertiary text-sm">
              Loading…
            </div>
          ) : executionTimes.error ? (
            <p className="text-xs text-red-400">{executionTimes.error}</p>
          ) : (
            <ExecutionTimeChart entries={executionTimes.entries} />
          )}
        </div>
      </section>
    </div>
  )
}
