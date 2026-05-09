import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Code2, BarChart2, Flame, CheckCircle2, HelpCircle, RefreshCw, Tag, CalendarDays, LineChart } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useProblemCounts } from '@/hooks/useProblemCounts'

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
    'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150',
    isActive
      ? 'text-text-primary bg-bg-tertiary border-l-[3px] border-accent-blue pl-[13px]'
      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border-l-[3px] border-transparent pl-[13px]',
  ].join(' ')

export const Sidebar = (): React.JSX.Element => {
  const { solvedCount, currentStreak } = useProgress()
  const { total } = useProblemCounts()

  return (
    <aside className="fixed left-0 top-12 h-[calc(100vh-3rem)] w-60 bg-bg-secondary border-r border-border-default flex flex-col z-40">
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={getNavClass}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="h-px bg-border-default" />

      <div className="px-4 py-4 flex flex-col gap-2.5">
        {currentStreak > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <Flame size={13} className="text-accent-amber" />
            <span className="text-accent-amber font-medium">{currentStreak} day streak</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-xs">
          <CheckCircle2 size={13} className="text-accent-green" />
          <span className="text-text-secondary">
            <span className="text-accent-green font-medium">{solvedCount}</span>
            {total > 0 && <span className="text-text-tertiary"> / {total} solved</span>}
          </span>
        </div>
      </div>
    </aside>
  )
}
