import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Code2, BarChart2, Flame, CheckCircle2, HelpCircle, RefreshCw, Tag, CalendarDays, LineChart, BookOpen, Shield } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useProblemCounts } from '@/hooks/useProblemCounts'
import { getMasteryRank, MASTERY_RANKS } from '@/utils/ranks'

interface NavItem {
  readonly to: string
  readonly label: string
  readonly icon: React.ReactNode
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/',         label: 'Dashboard', icon: <LayoutDashboard size={15} /> },
  { to: '/daily',    label: 'Daily',     icon: <CalendarDays size={15} /> },
  { to: '/problems', label: 'Problems',  icon: <Code2 size={15} /> },
  { to: '/quiz',     label: 'Quiz',      icon: <HelpCircle size={15} /> },
  { to: '/review',   label: 'Review',    icon: <RefreshCw size={15} /> },
  { to: '/patterns', label: 'Patterns',  icon: <Tag size={15} /> },
  { to: '/insights', label: 'Insights',  icon: <BookOpen size={15} /> },
  { to: '/progress', label: 'Progress',  icon: <BarChart2 size={15} /> },
  { to: '/stats',    label: 'Stats',     icon: <LineChart size={15} /> },
]

const getNavClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'relative flex items-center gap-3 px-3.5 py-2 text-xs font-semibold rounded-lg mx-2.5 my-0.5 font-geist uppercase tracking-wide transition-all duration-200 border outline-none active:scale-[0.98] group',
    isActive
      ? 'text-white bg-white/[0.08] shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)] border-white/10'
      : 'text-text-secondary hover:text-white hover:bg-white/[0.03] border-transparent shadow-none',
  ].join(' ')

export const Sidebar = (): React.JSX.Element => {
  const { solvedCount, currentStreak } = useProgress()
  const { total } = useProblemCounts()
  const rank = getMasteryRank(solvedCount)

  // Find next rank for progress
  const currentRankIndex = MASTERY_RANKS.findIndex(r => r.level === rank.level)
  const nextRank = currentRankIndex > 0 ? MASTERY_RANKS[currentRankIndex - 1] : null
  const prevThreshold = rank.minSolved
  const nextThreshold = nextRank ? nextRank.minSolved : (rank.minSolved || 1)
  const rankProgress = nextRank 
    ? Math.min(100, Math.max(0, Math.round(((solvedCount - prevThreshold) / (nextThreshold - prevThreshold)) * 100)))
    : 100

  return (
    <aside className="hidden md:flex fixed left-0 top-12 h-[calc(100vh-3rem)] w-60 bg-[#050505]/95 backdrop-blur-md border-r border-white/[0.08] flex-col z-40">
      <div className="px-3.5 pt-5 pb-2">
         <div className="glass-panel rounded-xl p-3.5 flex flex-col gap-2.5 relative overflow-hidden group hover:border-white/20 transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 blur-2xl opacity-15 transition-opacity duration-500 group-hover:opacity-25 rounded-full -mr-12 -mt-12" style={{ backgroundColor: rank.color }} />
            <div className="flex items-center justify-between relative z-10">
               <div className="flex items-center gap-1.5">
                 <Shield size={12} style={{ color: rank.color }} />
                 <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-text-tertiary font-geist">Clearance</span>
               </div>
               <span className="text-[10px] font-bold font-geist px-1.5 py-0.2 rounded border bg-white/5" style={{ color: rank.color, borderColor: `${rank.color}40` }}>
                  {rank.level}
               </span>
            </div>
            
            <div className="flex flex-col gap-1.5 relative z-10">
               <span className="text-xs font-bold font-geist tracking-tight text-white uppercase truncate">
                  {rank.label.replace(/_/g, ' ')}
               </span>
               <div className="flex items-center gap-2">
                 <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                   <div 
                     className="h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_currentColor]"
                     style={{ width: `${rankProgress}%`, backgroundColor: rank.color, color: rank.color }}
                   />
                 </div>
                 <span className="text-[9px] font-bold font-geist text-text-tertiary shrink-0">
                   {nextRank ? `${solvedCount}/${nextRank.minSolved}` : 'MAX'}
                 </span>
               </div>
            </div>
         </div>
      </div>

      <nav className="flex-1 py-3 flex flex-col overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={getNavClass}>
            {({ isActive }) => (
              <>
                <span className={`shrink-0 transition-colors duration-200 ${isActive ? 'text-accent-blue drop-shadow-[0_0_8px_var(--color-accent-blue)]' : 'text-text-tertiary group-hover:text-text-secondary'}`}>
                  {item.icon}
                </span>
                <span className="text-[11px] font-bold tracking-wider">{item.label}</span>
                {isActive && (
                  <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-accent-blue shadow-[0_0_6px_var(--color-accent-blue)]" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 flex flex-col gap-3.5 border-t border-white/[0.08] bg-white/[0.01]">
        {currentStreak > 0 && (
          <div className="flex items-center justify-between p-2 rounded-lg bg-accent-amber/[0.04] border border-accent-amber/15">
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-accent-amber fill-accent-amber/20" />
              <span className="text-[10px] font-bold tracking-widest font-geist text-text-secondary uppercase">Pulse</span>
            </div>
            <span className="text-accent-amber text-xs font-bold tracking-wider font-geist">{currentStreak}D STREAK</span>
          </div>
        )}
        <div className="flex items-center justify-between p-2 rounded-lg bg-accent-green/[0.04] border border-accent-green/15">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-accent-green" />
            <span className="text-[10px] font-bold tracking-widest font-geist text-text-secondary uppercase">Verified</span>
          </div>
          <span className="text-text-secondary text-xs font-bold tracking-tight font-geist">
            <span className="text-accent-green">{solvedCount}</span>
            {total > 0 && <span className="text-text-tertiary">/{total}</span>}
          </span>
        </div>
      </div>
    </aside>
  )
}
