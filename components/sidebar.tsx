'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Shirt, Scissors, LogOut, User, ChevronUp, Settings } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useState, useRef, useEffect } from 'react'

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
  const { data: session } = useSession()
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

          <div className="mt-auto p-4 space-y-4">
            {/* User Drop-up Menu */}
            <div className="relative" ref={userMenuRef}>
              <div className={cn(
                "absolute bottom-full left-0 w-full mb-2 bg-[#1A1917] border border-white/10 rounded-[16px] overflow-hidden shadow-2xl transition-all duration-200 origin-bottom",
                isUserMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-2 pointer-events-none"
              )}>
                <Link
                  href="/minha-conta"
                  onClick={() => { setIsUserMenuOpen(false); onClose?.(); }}
                  className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-sidebar-text-muted hover:bg-white/5 hover:text-sidebar-text transition-colors"
                >
                  <Settings size={18} />
                  Minha Conta
                </Link>
                <div className="h-[1px] bg-white/5" />
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="w-full flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-sidebar-text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                  <LogOut size={18} />
                  Sair do Sistema
                </button>
              </div>

              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-[16px] px-4 py-3 bg-white/[0.03] border border-white/5 hover:bg-white/[0.08] transition-all duration-200 group",
                  isUserMenuOpen && "bg-white/[0.08] border-white/10"
                )}
              >
                <div className="w-8 h-8 rounded-full bg-accent-tecido/20 flex items-center justify-center text-accent-tecido text-xs font-bold">
                  {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[13px] font-semibold text-sidebar-text leading-none mb-1 truncate">
                    {session?.user?.name || 'Usuário'}
                  </p>
                  <p className="text-[11px] text-sidebar-text-muted leading-none">Minha Conta</p>
                </div>
                <ChevronUp 
                  size={16} 
                  className={cn("text-sidebar-text-muted transition-transform duration-200", isUserMenuOpen && "rotate-180")} 
                />
              </button>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 opacity-30 hover:opacity-100 transition-opacity whitespace-nowrap">
              <div className="w-1 h-1 rounded-full bg-green-500" />
              <p className="text-[9px] text-white font-bold uppercase tracking-widest">
                System Status <span className="mx-1 opacity-20">/</span> v{process.env.NEXT_PUBLIC_APP_VERSION || '1.9.0'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
