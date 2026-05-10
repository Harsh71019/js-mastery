import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgress } from '@/hooks/useProgress'
import { useProblemCounts } from '@/hooks/useProblemCounts'
import { useProgressStore } from '@/store/useProgressStore'
import { StatCard } from '@/components/progress/StatCard'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { DailyWidget } from '@/components/daily/DailyWidget'
import { PageContainer } from '@/components/ui/PageContainer'
import { Card } from '@/components/ui/Card'
import { Glow } from '@/components/ui/Glow'
import { CATEGORIES } from '@/data/categories'

const selectDismissBackupBanner = (state: ReturnType<typeof useProgressStore.getState>) =>
  state.dismissBackupBanner

export const Dashboard = (): React.JSX.Element => {
  const navigate = useNavigate()
  const {
    solvedCount,
    solvedProblems,
    currentStreak,
    longestStreak,
    shouldShowBackupBanner,
    nextBackupMilestone,
  } = useProgress()
  const { total, byCategory } = useProblemCounts()
  const [collectionCounts, setCollectionCounts] = React.useState<Record<string, number>>({})

  React.useEffect(() => {
    fetch('/api/problems/collections/counts')
      .then((res) => res.json() as Promise<{ success: boolean; data: { id: string; count: number }[] }>)
      .then(({ data }) => {
        const counts = Object.fromEntries(data.map((c) => [c.id, c.count]))
        setCollectionCounts(counts)
      })
      .catch((err: unknown) => console.error('Failed to fetch collection counts:', err))
  }, [])

  const dismissBackupBanner = useProgressStore(selectDismissBackupBanner)

  const collections = [
    { id: 'blind75', title: 'BLIND 75', description: 'Essential curated problem set for technical mastery.', color: '#3b82f6', bg: 'bg-accent-blue/5', border: 'hover:border-accent-blue/30', text: 'text-accent-blue' },
    { id: 'js-pro-mastery', title: 'JS PRO', description: 'Deep intelligence training for JavaScript engineering.', color: '#a855f7', bg: 'bg-accent-purple/5', border: 'hover:border-accent-purple/30', text: 'text-accent-purple' },
  ]

  const categoriesStarted = CATEGORIES.filter(
    (category) => Object.keys(solvedProblems).some((id) => id.startsWith(category.slug)),
  ).length

  const handleExportBackup = (): void => {
    const state = useProgressStore.getState()
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    const date = new Date().toISOString().split('T')[0]
    anchor.href = url
    anchor.download = `js-trainer-progress-${date}.json`
    anchor.click()
    URL.revokeObjectURL(url)
    dismissBackupBanner(nextBackupMilestone)
  }

  return (
    <PageContainer className="flex flex-col gap-12 relative min-h-screen pb-20">
      <Glow color="var(--color-accent-blue)" size="xl" className="-top-40 -right-20 opacity-[0.08]" />
      <Glow color="var(--color-accent-purple)" size="lg" className="bottom-40 -left-20 opacity-[0.05]" />

      {shouldShowBackupBanner && (
        <div className="flex items-center justify-between bg-accent-amber/5 border border-accent-amber/20 rounded-xl px-6 py-4 backdrop-blur-md relative z-10">
          <span className="text-text-secondary text-sm font-geist">
            <span className="text-accent-amber font-bold mr-2 uppercase tracking-widest text-xs">Security Alert:</span>
            Archive found: {solvedCount} solved entries. 
            <button
              type="button"
              onClick={handleExportBackup}
              className="text-accent-amber hover:text-white font-bold ml-2 underline underline-offset-4 cursor-pointer transition-colors"
            >
              Initialize Local Backup
            </button>
          </span>
          <button
            type="button"
            onClick={() => dismissBackupBanner(nextBackupMilestone)}
            className="text-text-tertiary hover:text-text-secondary ml-4 text-xl leading-none cursor-pointer transition-colors"
          >
            ×
          </button>
        </div>
      )}

      <div className="relative z-10">
        <DailyWidget />
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-geist opacity-60">System Clusters</h2>
          <div className="h-px bg-white/5 flex-1 mx-6" />
          <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist">Status: Online</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map(col => {
            const totalInCol = collectionCounts[col.id] ?? 0
            return (
              <Card
                key={col.id}
                onClick={() => navigate('/problems', { 
                  state: { 
                    filters: { 
                      search: '',
                      difficulty: 'all',
                      category: 'all',
                      collectionId: col.id,
                      status: 'all',
                      type: 'coding'
                    } 
                  } 
                })}
                className={`p-6 group/col relative overflow-hidden transition-all duration-500 border-white/5 hover:border-white/20`}
              >
                <div className={`absolute top-0 right-0 w-48 h-48 ${col.bg} blur-[60px] rounded-full -mr-20 -mt-20 opacity-40 group-hover/col:opacity-100 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-text-primary text-lg font-bold tracking-tighter font-geist">
                      {col.title}
                    </h3>
                    <div className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border border-white/10 bg-white/5 text-text-tertiary`}>
                      Data Set
                    </div>
                  </div>
                  <p className="text-text-secondary text-xs leading-relaxed mb-6 max-w-[85%] font-medium">
                    {col.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-current transition-all duration-1000 ease-out shadow-[0_0_8px_currentColor]" 
                                style={{ width: totalInCol > 0 ? '100%' : '0%', color: col.color }} 
                            />
                        </div>
                        <span className="text-text-tertiary text-[10px] font-bold font-geist uppercase tracking-tighter">{totalInCol} Problem Nodes</span>
                    </div>
                    <span className={`${col.text} text-[10px] font-bold uppercase tracking-widest group-hover/col:translate-x-1 transition-transform inline-flex items-center gap-2`}>
                        ACCESS_LIST <span className="text-lg leading-none">→</span>
                    </span>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
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

      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-text-primary text-[10px] font-bold uppercase tracking-[0.3em] font-geist opacity-60">Intelligence Sectors</h2>
          <div className="h-px bg-white/5 flex-1 mx-6" />
          <span className="text-[9px] font-bold text-text-tertiary uppercase font-geist">Real-time sync</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => {
            const categoryTotal = byCategory[category.slug] ?? 0
            const categorySolved = Object.keys(solvedProblems).filter((id) =>
              id.startsWith(category.slug),
            ).length
            const progress = categoryTotal > 0 ? Math.round((categorySolved / categoryTotal) * 100) : 0

            return (
              <Card
                key={category.slug}
                onClick={() => navigate(`/category/${category.slug}`)}
                className="p-5 transition-all duration-300 hover:bg-white/[0.03]"
                style={{ borderLeftColor: `${category.accentColor}44`, borderLeftWidth: '1px' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-text-primary text-xs font-bold uppercase tracking-widest mb-1 font-geist">{category.title}</h3>
                    <p className="text-text-tertiary text-[11px] leading-relaxed line-clamp-2 font-medium mb-4">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full transition-all duration-1000 ease-out" 
                          style={{ width: `${progress}%`, backgroundColor: category.accentColor }} 
                        />
                      </div>
                      <span className="text-text-tertiary text-[9px] font-bold font-geist whitespace-nowrap">{progress}%</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <ProgressRing progress={progress} size={36} strokeWidth={2} color={category.accentColor} />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </PageContainer>
  )
}
