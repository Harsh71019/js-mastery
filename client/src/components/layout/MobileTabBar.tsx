import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Code2, HelpCircle, RefreshCw, Tag, CalendarDays, LineChart, BarChart2, BookOpen } from 'lucide-react'

interface NavItem {
  readonly to: string
  readonly label: string
  readonly icon: React.ReactNode
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/',         label: 'Dash',     icon: <LayoutDashboard size={17} /> },
  { to: '/daily',    label: 'Daily',    icon: <CalendarDays size={17} /> },
  { to: '/problems', label: 'Problems', icon: <Code2 size={17} /> },
  { to: '/quiz',     label: 'Quiz',     icon: <HelpCircle size={17} /> },
  { to: '/review',   label: 'Review',   icon: <RefreshCw size={17} /> },
  { to: '/patterns', label: 'Patterns', icon: <Tag size={17} /> },
  { to: '/insights', label: 'Insights', icon: <BookOpen size={17} /> },
  { to: '/progress', label: 'Progress', icon: <BarChart2 size={17} /> },
  { to: '/stats',    label: 'Stats',    icon: <LineChart size={17} /> },
]

const getNavClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'relative flex flex-col items-center justify-center flex-1 min-w-[58px] h-full gap-1 transition-all duration-200 outline-none select-none py-1',
    isActive
      ? 'text-white'
      : 'text-text-tertiary hover:text-text-secondary',
  ].join(' ')

export const MobileTabBar = (): React.JSX.Element => {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505]/95 backdrop-blur-lg border-t border-white/[0.08] z-40 flex items-center px-1 overflow-x-auto no-scrollbar scroll-smooth">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === '/'} className={getNavClass}>
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute top-0 left-3 right-3 h-0.5 bg-accent-blue shadow-[0_0_8px_var(--color-accent-blue)]" />
              )}
              <span className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-110 text-accent-blue drop-shadow-[0_0_8px_var(--color-accent-blue)]' : ''}`}>
                {item.icon}
              </span>
              <span className={`text-[9px] font-bold tracking-wider font-geist uppercase ${isActive ? 'text-white' : 'text-text-tertiary'}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  )
}
