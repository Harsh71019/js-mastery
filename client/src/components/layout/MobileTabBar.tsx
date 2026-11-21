import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LayoutDashboard, Code2, HelpCircle, CalendarDays, MoreHorizontal } from 'lucide-react'

interface MobileTabBarProps {
  readonly onOpenDrawer: () => void
}

const PRIMARY_TABS = [
  { to: '/',         label: 'Dash',     icon: <LayoutDashboard size={18} /> },
  { to: '/daily',    label: 'Daily',    icon: <CalendarDays size={18} /> },
  { to: '/problems', label: 'Problems', icon: <Code2 size={18} /> },
  { to: '/quiz',     label: 'Quiz',     icon: <HelpCircle size={18} /> },
] as const

const SECONDARY_ROUTES = ['/review', '/patterns', '/insights', '/progress', '/stats']

export const MobileTabBar = ({ onOpenDrawer }: MobileTabBarProps): React.JSX.Element => {
  const location = useLocation()
  const isMoreActive = SECONDARY_ROUTES.some((route) => location.pathname.startsWith(route))

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#050505]/95 backdrop-blur-lg border-t border-white/[0.08] z-40 flex items-center justify-around px-2 pb-safe"
    >
      {PRIMARY_TABS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 outline-none select-none py-1 cursor-pointer ${
              isActive ? 'text-white' : 'text-text-tertiary hover:text-text-secondary'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <div className="absolute top-0 left-4 right-4 h-0.5 bg-accent-blue shadow-[0_0_8px_var(--color-accent-blue)]" />
              )}
              <span
                className={`shrink-0 transition-transform duration-200 ${
                  isActive ? 'scale-110 text-accent-blue drop-shadow-[0_0_8px_var(--color-accent-blue)]' : ''
                }`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[10px] font-bold tracking-wider font-geist uppercase ${
                  isActive ? 'text-white' : 'text-text-tertiary'
                }`}
              >
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}

      {/* More Button */}
      <button
        type="button"
        onClick={onOpenDrawer}
        className={`relative flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all duration-200 outline-none select-none py-1 cursor-pointer ${
          isMoreActive ? 'text-white' : 'text-text-tertiary hover:text-text-secondary'
        }`}
      >
        {isMoreActive && (
          <div className="absolute top-0 left-4 right-4 h-0.5 bg-accent-blue shadow-[0_0_8px_var(--color-accent-blue)]" />
        )}
        <span
          className={`shrink-0 transition-transform duration-200 ${
            isMoreActive ? 'scale-110 text-accent-blue drop-shadow-[0_0_8px_var(--color-accent-blue)]' : ''
          }`}
        >
          <MoreHorizontal size={18} />
        </span>
        <span
          className={`text-[10px] font-bold tracking-wider font-geist uppercase ${
            isMoreActive ? 'text-white' : 'text-text-tertiary'
          }`}
        >
          More
        </span>
      </button>
    </nav>
  )
}
