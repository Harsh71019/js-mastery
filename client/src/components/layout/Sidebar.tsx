import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Code2, BarChart2, Flame, CheckCircle2, HelpCircle, RefreshCw, Tag, CalendarDays, LineChart } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useProblemCounts } from '@/hooks/useProblemCounts'
import { getMasteryRank } from '@/utils/ranks'

interface NavItem {
  readonly to: string
  readonly label: string
  readonly icon: React.ReactNode
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/',       label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { to: '/daily',  label: 'Daily',     icon: <CalendarDays size={16} /> },
  { to: '/problems', label: 'Problems', icon: <Code2 size={16} /> },
  { to: '/quiz',     label: 'Quiz',     icon: <HelpCircle size={16} /> },
  { to: '/review',   label: 'Review',   icon: <RefreshCw size={16} /> },
  { to: '/patterns', label: 'Patterns', icon: <Tag size={16} /> },
  { to: '/progress', label: 'Progress', icon: <BarChart2 size={16} /> },
  { to: '/stats',    label: 'Stats',    icon: <LineChart size={16} /> },
]

const getNavClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg mx-2 my-0.5 font-geist uppercase tracking-tight transition-all duration-200 border outline-none active:bg-transparent',
    isActive
      ? 'text-text-primary bg-white/[0.04] shadow-glow-sm border-white/10'
      : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.02] border-transparent shadow-none',
  ].join(' ')

export const Sidebar = (): React.JSX.Element => {
  const { solvedCount, currentStreak } = useProgress()
  const { total } = useProblemCounts()
  const rank = getMasteryRank(solvedCount)

  return (
    <aside className="fixed left-0 top-12 h-[calc(100vh-3rem)] w-60 bg-bg-primary/80 backdrop-blur-md border-r border-white/5 flex flex-col z-40">
      <div className="px-4 pt-6 pb-2">
         <div className="glass-panel rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 blur-2xl opacity-10 transition-opacity duration-500 group-hover:opacity-20 rounded-full -mr-10 -mt-10" style={{ backgroundColor: rank.color }} />
            <div className="flex flex-col gap-1 relative z-10">
               <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-text-tertiary font-geist">Clearance_Level</span>
               <span className="text-lg font-bold font-geist tracking-tighter" style={{ color: rank.color, textShadow: `0 0 10px ${rank.color}44` }}>
                  {rank.level}
               </span>
            </div>
            <div className="flex flex-col gap-1 relative z-10 border-t border-white/5 pt-2">
               <span className="text-[10px] font-bold font-geist tracking-widest text-text-secondary uppercase truncate">
                  {rank.label}
               </span>
            </div>
         </div>
      </div>

      <nav className="flex-1 py-4 flex flex-col">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={getNavClass}>
            <span className={`shrink-0 transition-colors duration-200`}>{item.icon}</span>
            <span className="text-[11px] font-bold tracking-widest">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-6 flex flex-col gap-5 border-t border-white/5">
        {currentStreak > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest font-geist opacity-60">Uptime_Pulse</span>
            <div className="flex items-center gap-2.5">
              <Flame size={14} className="text-accent-amber fill-accent-amber/20 shadow-glow-sm" />
              <span className="text-accent-amber text-xs font-bold tracking-widest font-geist uppercase">{currentStreak}D STREAK</span>
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-text-tertiary text-[9px] font-bold uppercase tracking-widest font-geist opacity-60">Verification_Registry</span>
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={14} className="text-accent-green" />
            <span className="text-text-secondary text-[10px] font-bold tracking-tight font-geist uppercase">
              <span className="text-accent-green">{solvedCount}</span>
              {total > 0 && <span className="text-text-tertiary"> / {total} Verified</span>}
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
