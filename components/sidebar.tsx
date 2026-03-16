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

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Backdrop for mobile */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-[--color-text-primary]/20 backdrop-blur-sm lg:hidden transition-opacity duration-300 print:hidden",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed left-0 top-0 z-50 h-screen w-[260px] bg-sidebar-bg border-r border-white/5 shadow-2xl transition-transform duration-300 lg:translate-x-0 print:hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          <div className="p-8 pb-6 flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-accent-tecido" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-text-muted block leading-none">
                JC PLUS SIZE
                </span>
              </div>
              <span className="text-[18px] font-light text-sidebar-text tracking-tight">
                Gestão de <span className="font-semibold text-white/90">Pilotos</span>
              </span>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={onClose}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-sidebar-text-muted hover:text-white"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          <nav className="flex-1 space-y-1.5 px-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 rounded-[12px] px-4 py-3 text-[14px] font-medium transition-all duration-200 group relative',
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
                <p className="text-[12px] text-white/60 font-medium tracking-wide">Versão 1.4.3</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
