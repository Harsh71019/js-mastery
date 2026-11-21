import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { MobileTabBar } from './MobileTabBar'
import { MobileDrawer } from './MobileDrawer'

export const Layout = (): React.JSX.Element => {
  const location = useLocation()
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const isProblemRoute = location.pathname.startsWith('/problem/')

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar onOpenDrawer={() => setIsMobileDrawerOpen(true)} />
      <Sidebar />
      <MobileDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
      />
      {!isProblemRoute && (
        <MobileTabBar onOpenDrawer={() => setIsMobileDrawerOpen(true)} />
      )}
      <main className={`md:pl-60 pt-12 pl-0 ${isProblemRoute ? 'pb-0' : 'pb-20 md:pb-0'}`}>
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
