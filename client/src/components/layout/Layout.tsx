import React from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export const Layout = (): React.JSX.Element => (
  <div className="min-h-screen bg-bg-primary">
    <Navbar />
    <main className="pt-12">
      <div className="max-w-[1200px] mx-auto">
        <Outlet />
      </div>
    </main>
  </div>
)
