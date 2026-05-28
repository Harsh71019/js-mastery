import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Code2, HelpCircle, RefreshCw, Tag, CalendarDays, LineChart, BarChart2 } from 'lucide-react'

interface NavItem {
  readonly to: string
  readonly label: string
  readonly icon: React.ReactNode
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/',         label: 'Dash',     icon: <LayoutDashboard size={18} /> },
  { to: '/daily',    label: 'Daily',    icon: <CalendarDays size={18} /> },
  { to: '/problems', label: 'Verify',   icon: <Code2 size={18} /> },
  { to: '/quiz',     label: 'Quiz',     icon: <HelpCircle size={18} /> },
  { to: '/review',   label: 'Review',   icon: <RefreshCw size={18} /> },
  { to: '/patterns', label: 'Patterns', icon: <Tag size={18} /> },
  { to: '/progress', label: 'Progress', icon: <BarChart2 size={18} /> },
  { to: '/stats',    label: 'Stats',    icon: <LineChart size={18} /> },
]

const getNavClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'flex flex-col items-center justify-center flex-1 min-w-[56px] h-full gap-1 transition-all duration-200 outline-none active:bg-transparent',
    isActive
      ? 'text-text-primary'
      : 'text-text-secondary hover:text-text-primary',
  ].join(' ')

export const MobileTabBar = (): React.JSX.Element => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-bg-primary/80 backdrop-blur-md border-t border-white/5 z-40 flex items-center justify-between px-2 overflow-x-auto no-scrollbar scroll-smooth">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === '/'} className={getNavClass}>
          {({ isActive }) => (
            <>
              <span className={`shrink-0 transition-all duration-200 ${isActive ? 'scale-110 text-accent-blue drop-shadow-[0_0_8px_var(--color-accent-blue)]' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-bold tracking-widest font-geist uppercase scale-90 md:scale-100">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
