'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

interface Props {
  children: React.ReactNode
  counts?: { pecas?: number; tecidos?: number }
}

export function AppShell({ children, counts }: Props) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen((o) => !o)
  const closeSidebar = () => setIsSidebarOpen(false)

  const isLoginPage = pathname === '/login'
  const isAuth = !!session?.user

  if (isLoginPage || (!isAuth && status !== 'loading')) {
    return <main className="min-h-screen w-full">{children}</main>
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} counts={counts} />
      <main className="md:ml-[252px] flex-1 w-full max-w-[1440px] mx-auto px-4 py-8 sm:px-6 md:px-8 lg:px-10">
        {children}
      </main>
    </div>
  )
}
