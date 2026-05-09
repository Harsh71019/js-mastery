import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export const Layout = (): React.JSX.Element => (
  <div className="min-h-screen bg-bg-primary">
    <Navbar />
    <Sidebar />
    <main className="pl-60 pt-12">
      <Outlet />
    </main>
  </div>
)
