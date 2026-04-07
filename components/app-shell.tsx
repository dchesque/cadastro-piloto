'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Navbar } from '@/components/navbar'
import { useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const closeSidebar = () => setIsSidebarOpen(false)

  const isLoginPage = pathname === '/login'
  const isAuth = !!session?.user

  // Se for página de login ou se não estiver autenticado (e não for carregando), 
  // não mostra a estrutura lateral/superior
  if (isLoginPage || (!isAuth && status !== 'loading')) {
    return <main className="min-h-screen w-full">{children}</main>
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <Navbar onMenuClick={toggleSidebar} />
      
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      
      <main className="md:ml-[260px] flex-1 w-full max-w-[1440px] mx-auto px-4 py-8 sm:px-6 md:px-8 lg:px-10">
        {children}
      </main>
    </div>
  )
}
