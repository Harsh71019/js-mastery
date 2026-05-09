import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { useProblemCounts } from '@/hooks/useProblemCounts'
import { StatCard } from '@/components/progress/StatCard'
import { CalendarHeatmap } from '@/components/progress/CalendarHeatmap'
import { SolveHistory } from '@/components/progress/SolveHistory'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'
import { Glow } from '@/components/ui/Glow'
import { CATEGORIES } from '@/data/categories'

export const ProgressPage = (): React.JSX.Element => {
  const navigate = useNavigate()
  const { solvedCount, currentStreak, longestStreak, solvedProblems } = useProgress()
  const { total } = useProblemCounts()

  const heatmapData = React.useMemo(() => {
    const map = new Map<string, { date: string; count: number; titles: string[] }>()
    Object.values(solvedProblems).forEach((entry) => {
      if (!entry.solvedAt) return
      const date = entry.solvedAt.split('T')[0]
      const existing = map.get(date)
      if (existing) {
        existing.count++
        existing.titles.push(entry.title ?? 'Unknown Problem')
      } else {
        map.set(date, {
          date,
          count: 1,
          titles: [entry.title ?? 'Unknown Problem'],
        })
      }
    })
    return map
  }, [solvedProblems])

  const categoriesStarted = CATEGORIES.filter((category) =>
    Object.keys(solvedProblems).some((id) => id.startsWith(category.slug)),
  ).length

  return (
    <PageContainer className="flex flex-col gap-10 relative pb-20">
      <Glow color="var(--color-accent-blue)" size="xl" className="-top-40 -left-20 opacity-[0.06]" />
      <Glow color="var(--color-accent-purple)" size="lg" className="top-1/2 -right-20 opacity-[0.04]" />

      <div className="flex items-center justify-between px-1 relative z-10">
        <h1 className="text-text-primary text-xs font-bold uppercase tracking-[0.3em] font-geist opacity-60">System Progress Metrics</h1>
        <div className="h-px bg-white/5 flex-1 mx-6" />
        <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist">Sync Status: Active</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        <StatCard
          label="Nodes Verified"
          value={`${solvedCount}/${total}`}
          accentColor="#22c55e"
        />
        <StatCard label="Active Uptime" value={`${currentStreak}D`} accentColor="#a855f7" />
        <StatCard label="Max Endurance" value={`${longestStreak}D`} accentColor="#3b82f6" />
        <StatCard
          label="Sector Coverage"
          value={`${categoriesStarted}/${CATEGORIES.length}`}
          accentColor="#f59e0b"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
        <div className="lg:col-span-2 flex flex-col gap-10">
          <div className="flex flex-col gap-4">
            <h2 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.2em] px-1 font-geist opacity-60">Temporal Activity Map</h2>
            <Card className="p-6">
              <CalendarHeatmap dayData={heatmapData} />
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <h2 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.2em] px-1 font-geist opacity-60">Sequence Registry</h2>
            <SolveHistory solvedProblems={solvedProblems} />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h2 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.2em] px-1 font-geist opacity-60">Sector Breakdown</h2>
          <div className="flex flex-col gap-3">
            {CATEGORIES.map((category) => {
              const categorySolved = Object.keys(solvedProblems).filter((id) =>
                id.startsWith(category.slug),
              ).length
              if (categorySolved === 0) return null

              return (
                <button
                  key={category.slug}
                  type="button"
                  onClick={() => navigate(`/category/${category.slug}`)}
                  className="glass-panel rounded-xl p-4 text-left hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 cursor-pointer flex items-center justify-between group"
                >
                  <span className="text-text-primary text-xs font-bold font-geist uppercase tracking-widest group-hover:text-accent-blue transition-colors">{category.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-accent-green text-[10px] font-bold font-geist">
                      {categorySolved} SOLVED
                    </span>
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-accent-blue transition-colors">
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
