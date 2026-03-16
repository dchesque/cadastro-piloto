'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Shirt, Scissors } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/pecas', label: 'Peças Piloto', icon: Shirt },
  { href: '/tecidos', label: 'Cortes de Tecido', icon: Scissors },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[240px] bg-sidebar-bg border-r border-white/5 shadow-2xl">
      <div className="flex h-full flex-col">
        <div className="p-8 pb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-accent-tecido" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-text-muted block leading-none">
              JC Studio
            </span>
          </div>
          <span className="text-[18px] font-light text-sidebar-text tracking-tight">
            Gestão de <span className="font-semibold text-white/90">Pilotos</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1.5 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-[10px] px-4 py-3 text-[14px] font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-white/10 text-sidebar-text shadow-inner after:absolute after:left-0 after:top-2 after:bottom-2 after:w-1 after:bg-accent-tecido after:rounded-full'
                    : 'text-sidebar-text-muted hover:bg-white/[0.05] hover:text-sidebar-text'
                )}
              >
                <item.icon 
                  size={18} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={cn(
                    "transition-colors duration-200",
                    isActive ? "text-accent-tecido" : "group-hover:text-sidebar-text"
                  )} 
                />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto p-6">
          <div className="rounded-[12px] bg-white/[0.05] border border-white/[0.08] p-4">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[12px] text-white/60 font-medium tracking-wide">Versão 1.3.0</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
