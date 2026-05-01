import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Code2, BarChart2 } from 'lucide-react'
import { Sidebar } from './Sidebar'

interface TabItem {
  readonly to: string
  readonly label: string
  readonly icon: React.ReactNode
}

const TAB_ITEMS: readonly TabItem[] = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { to: '/problems', label: 'Problems', icon: <Code2 size={20} /> },
  { to: '/progress', label: 'Progress', icon: <BarChart2 size={20} /> },
]

const getTabClass = ({ isActive }: { isActive: boolean }): string =>
  [
    'flex flex-col items-center gap-1 py-2 px-4 text-xs transition-colors duration-150',
    isActive ? 'text-accent-blue' : 'text-text-secondary',
  ].join(' ')

export const Layout = (): React.JSX.Element => (
  <div className="min-h-screen bg-bg-primary">
    <div className="hidden md:block">
      <Sidebar />
    </div>

    <main className="md:pl-60 pb-16 md:pb-0">
      <div className="max-w-[1200px] mx-auto">
        <Outlet />
      </div>
    </main>

    <nav className="fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-border-default flex md:hidden z-40">
      {TAB_ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} end={item.to === '/'} className={getTabClass}>
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  </div>
)
