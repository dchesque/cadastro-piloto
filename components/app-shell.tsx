'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <Navbar onMenuClick={toggleSidebar} />
      
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="lg:ml-[260px] flex-1 w-full max-w-[1440px] px-4 py-8 sm:px-6 md:px-8 lg:px-10">
        {children}
      </main>
    </div>
  )
}
