import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Code2, BarChart2, Repeat2 } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'

interface NavItem {
  readonly to: string
  readonly label: string
  readonly icon: React.ReactNode
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { to: '/problems', label: 'Problems', icon: <Code2 size={16} /> },
  { to: '/progress', label: 'Progress', icon: <BarChart2 size={16} /> },
]

const getNavClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 rounded-none',
    isActive
      ? 'text-text-primary bg-bg-tertiary border-l-[3px] border-accent-blue pl-[13px]'
      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary border-l-[3px] border-transparent pl-[13px]',
  ].join(' ')

export const Sidebar = (): React.JSX.Element => {
  const { solvedCount, totalCount, currentStreak } = useProgress()

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-bg-secondary border-r border-border-default flex flex-col z-40">
      <div className="px-4 py-5">
        <div className="flex items-center gap-2">
          <Repeat2 size={18} className="text-text-primary" />
          <span className="text-text-primary text-base font-medium">JS Trainer</span>
        </div>
      </div>

      <div className="h-px bg-border-default" />

      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={getNavClass}>
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="h-px bg-border-default" />

      <div className="px-4 py-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-accent-purple">🔥</span>
          <span className="text-accent-purple">{currentStreak} day streak</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-accent-green">✓</span>
          <span className="text-accent-green">{solvedCount} solved</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-text-tertiary">◎</span>
          <span className="text-text-tertiary">
            {solvedCount} / {totalCount}
          </span>
        </div>
      </div>
    </aside>
  )
}
