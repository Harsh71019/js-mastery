import React from 'react'
import { NavLink } from 'react-router-dom'
import { Repeat2, Flame, CheckCircle2 } from 'lucide-react'
import { useProgress } from '@/hooks/useProgress'
import { useProblemCounts } from '@/hooks/useProblemCounts'

interface NavItem {
  readonly to: string
  readonly label: string
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Dashboard' },
  { to: '/problems', label: 'Problems' },
  { to: '/progress', label: 'Progress' },
]

const getLinkClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'text-sm transition-colors duration-150 px-1 py-0.5',
    isActive
      ? 'text-text-primary border-b-2 border-accent-blue pb-[1px]'
      : 'text-text-secondary hover:text-text-primary',
  ].join(' ')

export const Navbar = (): React.JSX.Element => {
  const { solvedCount, currentStreak } = useProgress()
  const { total } = useProblemCounts()

  return (
    <header className="fixed top-0 left-0 right-0 h-12 bg-bg-secondary border-b border-border-default flex items-center px-6 gap-8 z-40">
      <NavLink to="/" className="flex items-center gap-2 shrink-0">
        <Repeat2 size={17} className="text-accent-blue" />
        <span className="text-text-primary text-sm font-semibold tracking-tight">JS Trainer</span>
      </NavLink>

      <nav className="flex items-center gap-6">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={getLinkClass}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex items-center gap-5">
        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5">
            <Flame size={14} className="text-accent-amber" />
            <span className="text-accent-amber text-xs font-medium">{currentStreak} day streak</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <CheckCircle2 size={14} className="text-accent-green" />
          <span className="text-text-secondary text-xs">
            <span className="text-accent-green font-medium">{solvedCount}</span>
            {total > 0 && <span className="text-text-tertiary"> / {total}</span>}
          </span>
        </div>
      </div>
    </header>
  )
}
