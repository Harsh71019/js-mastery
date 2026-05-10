import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const Layout = (): React.JSX.Element => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navbar />
      <Sidebar />
      <main className="pl-60 pt-12">
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
