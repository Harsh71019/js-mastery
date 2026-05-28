import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { MobileTabBar } from './MobileTabBar'

export const Layout = (): React.JSX.Element => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Sidebar />
      <MobileTabBar />
      <main className="md:pl-60 pt-12 pl-0 pb-16 md:pb-0">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
